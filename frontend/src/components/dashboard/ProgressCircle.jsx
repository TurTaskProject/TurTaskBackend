import { Card, Flex, ProgressCircle, Text } from "@tremor/react";
import React from "react";
import axiosInstance from "src/api/AxiosConfig";

const fetchProgressData = async () => {
  try {
    let res = await axiosInstance.get("/dashboard/stats/");
    // let completedLastWeek = res.data.completed_last_week;
    // let assignLastWeek = res.data.tasks_assigned_last_week;
    let completedLastWeek = 15;
    let assignLastWeek = 35;
    if (completedLastWeek === undefined) {
      completedLastWeek = 0;
    }
    if (assignLastWeek === undefined) {
      assignLastWeek = 0;
    }
    return (completedLastWeek / assignLastWeek) * 100;
  } catch (error) {
    console.error("Error fetching progress data:", error);
    return 0;
  }
};

const progressData = await fetchProgressData();
export default function ProgressCircleChart() {
  return (
    <Card className="max-w-lg mx-auto">
      <Flex className="flex-col items-center">
        <ProgressCircle className="mt-6" value={progressData} size={200} strokeWidth={10} radius={60} color="indigo">
          <span className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-sm text-indigo-500 font-medium">
            {progressData.toFixed(0)} %
          </span>
        </ProgressCircle>
      </Flex>
    </Card>
  );
}
