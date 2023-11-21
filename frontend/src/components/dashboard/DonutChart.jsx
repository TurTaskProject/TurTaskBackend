import { DonutChart } from "@tremor/react";
import axiosInstance from "../../api/configs/AxiosConfig";

const fetchDonutData = async () => {
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
      { name: "Todo", count: todoCount },
      { name: "Recurrence", count: recurrenceCount },
    ];
    return donutData;
  } catch (error) {
    console.error("Error fetching donut data:", error);
    return [];
  }
};

const donutDataArray = await fetchDonutData();
export default function DonutChartGraph() {
  return (
    <DonutChart
      className="mt-6"
      data={donutDataArray}
      category="count"
      index="name"
      colors={["rose", "yellow", "orange"]}
      onValueChange={(v) => setValue(v)}
      showAnimation
      radius={25}
    />
  );
}
