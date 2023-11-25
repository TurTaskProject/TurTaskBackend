import { DonutChart } from "@tremor/react";
import axiosInstance from "../../api/configs/AxiosConfig";

const fetchPieData = async () => {
  try {
    let res = await axiosInstance.get("/dashboard/stats/");
    // let todoCount = res.data.todo_count;
    // let recurrenceCount = res.data.recurrence_count;
    let todoCount = 10;
    let recurrenceCount = 15;
    if (todoCount === undefined) {
      todoCount = 0;
    }
    if (recurrenceCount === undefined) {
      recurrenceCount = 0;
    }
    const donutData = [
      { name: "Completed Tasks", count: todoCount },
      { name: "Uncompleted Tasks", count: recurrenceCount },
    ];
    return donutData;
  } catch (error) {
    console.error("Error fetching donut data:", error);
    return [];
  }
};

const pieDataArray = await fetchPieData();

export  function PieChartGraph() {
  return (
    <DonutChart
      className="mt-6"
      data={pieDataArray}
      category="count"
      index="name"
      colors={["rose", "yellow"]}
      showAnimation
      radius={25}
      variant="pie"
    />
  );
}
