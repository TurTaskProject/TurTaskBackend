import { BadgeDelta, Card, Flex, Metric, ProgressBar, Text } from "@tremor/react";
import React from "react";
import axiosInstance from "src/api/AxiosConfig";

const fetchKpiCardData = async () => {
  let res = await axiosInstance.get("/dashboard/stats/");
  // let completedThisWeek = res.data["completed_this_week"];
  // let completedLastWeek = res.data["completed_last_week"];
  let completedThisWeek = 4;
  let completedLastWeek = 23;
  let percentage = (completedThisWeek / completedLastWeek) * 100;
  let incOrdec = undefined;
  if (completedThisWeek <= completedLastWeek) {
    incOrdec = "moderateDecrease";
  }
  if (completedThisWeek > completedLastWeek) {
    incOrdec = "moderateIncrease";
  }
  return { completedThisWeek, completedLastWeek, incOrdec, percentage };
};

const { kpiCardDataArray, completedThisWeek, completedLastWeek, incOrdec, percentage } = await fetchKpiCardData();

export default function KpiCard() {
  return (
    <Card className="max-w-lg mx-auto">
      <Flex alignItems="start">
        <div>
          <Metric>{completedThisWeek}</Metric>
        </div>
        <BadgeDelta deltaType={incOrdec}>{percentage.toFixed(0)}%</BadgeDelta>
      </Flex>
      <Flex className="mt-4">
        <Text className="truncate">vs. {completedLastWeek} (last week)</Text>
      </Flex>
      <ProgressBar value={percentage} className="mt-2" />
    </Card>
  );
}
