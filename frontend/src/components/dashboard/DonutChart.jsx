import { DonutChart } from "@tremor/react";
import axiosInstance from "src/api/AxiosConfig";
import { useState, useEffect } from "react";

export default function DonutChartGraph() {
  const [donutData, setDonutData] = useState([]);

  useEffect(() => {
    const fetchDonutData = async () => {
      try {
        const response = await axiosInstance.get("/dashboard/stats/");
        const todoCount = response.data.todo_count || 0;
        const recurrenceCount = response.data.recurrence_count || 0;

        const donutData = [
          { name: "Todo", count: todoCount },
          { name: "Recurrence", count: recurrenceCount },
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
      colors={["rose", "yellow", "orange"]}
      showAnimation
      radius={25}
    />
  );
}
