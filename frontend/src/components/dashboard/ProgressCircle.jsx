import { Card, Flex, ProgressCircle } from "@tremor/react";
import { useState, useEffect } from "react";
import { axiosInstance } from "src/api/AxiosConfig";

export function ProgressCircleChart() {
  const [progressData, setProgressData] = useState(0);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const response = await axiosInstance.get("/dashboard/todostats/");
        let completedLastWeek = response.data.completed_last_week || 0;
        let assignLastWeek = response.data.tasks_assigned_last_week || 0;

        if (completedLastWeek === undefined) {
          completedLastWeek = 0;
        }
        if (assignLastWeek === undefined) {
          assignLastWeek = 0;
        }

        const progress = (completedLastWeek / assignLastWeek) * 100;

        setProgressData(progress);
      } catch (error) {
        console.error("Error fetching progress data:", error);
      }
    };

    fetchProgressData();
  }, []);

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
