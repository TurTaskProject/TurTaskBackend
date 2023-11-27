import { DonutChart } from "@tremor/react";
import { axiosInstance } from "src/api/AxiosConfig";
import { useState, useEffect } from "react";

export function DonutChartGraph() {
  const [donutData, setDonutData] = useState([]);

  useEffect(() => {
    const fetchDonutData = async () => {
      try {
        const response = await axiosInstance.get("/dashboard/todostats/");
        const totalTask = response.data.total_tasks || 0;
        const completedTask = response.data.total_completed_tasks || 0;

        const donutData = [
<<<<<<< HEAD
          { name: "Completed task", count: completedTask },
=======
          { name: "Completed task", count:  completedTask},
>>>>>>> 4a3f253e3049f97ef4479dd423642897a56e13fc
          { name: "Total task", count: totalTask },
        ];

        setDonutData(donutData);
      } catch (error) {
        console.error("Error fetching donut data:", error);
      }
    };
    fetchDonutData();
  }, []);

  return (
    <DonutChart
      className="mt-6"
      data={donutData}
      category="count"
      index="name"
      colors={["rose", "yellow"]}
      showAnimation
      radius={25}
      variant="pie"
    />
  );
}
