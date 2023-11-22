import { BadgeDelta, Card, Flex, Metric, ProgressBar, Text } from "@tremor/react";
import { useEffect, useState } from "react";
import axiosInstance from "src/api/AxiosConfig";

export default function KpiCard() {
  const [kpiCardData, setKpiCardData] = useState({
    completedThisWeek: 0,
    completedLastWeek: 0,
    incOrdec: undefined,
    percentage: 0,
  });

  useEffect(() => {
    const fetchKpiCardData = async () => {
      try {
        const response = await axiosInstance.get("/dashboard/stats/");
        const completedThisWeek = response.data.completed_this_week || 0;
        const completedLastWeek = response.data.completed_last_week || 0;
        const percentage = (completedThisWeek / completedLastWeek) * 100;
        let incOrdec = undefined;

        if (completedThisWeek <= completedLastWeek) {
          incOrdec = "moderateDecrease";
        }
        if (completedThisWeek > completedLastWeek) {
          incOrdec = "moderateIncrease";
        }

        setKpiCardData({
          completedThisWeek,
          completedLastWeek,
          incOrdec,
          percentage,
        });
      } catch (error) {
        console.error("Error fetching KPI card data:", error);
      }
    };

    fetchKpiCardData();
  }, []);

  return (
    <Card className="max-w-lg mx-auto">
      <Flex alignItems="start">
        <div>
          <Metric>{kpiCardData.completedThisWeek}</Metric>
        </div>
        <BadgeDelta deltaType={kpiCardData.incOrdec}>{kpiCardData.percentage.toFixed(0)}%</BadgeDelta>
      </Flex>
      <Flex className="mt-4">
        <Text className="truncate">vs. {kpiCardData.completedLastWeek} (last week)</Text>
      </Flex>
      <ProgressBar value={kpiCardData.percentage} className="mt-2" />
    </Card>
  );
}
