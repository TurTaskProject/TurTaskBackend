import { BarChart, Card, Title } from "@tremor/react";
import React from "react";
import axiosInstance from "../../api/configs/AxiosConfig";

const fetchBarChartData = async () => {
}
const chartdata3 = [
  {
    date: "Monday",
    "This Week": 45,
    "Last Week": 78,
  },
  {
    date: "Tuesday",
    "This Week": 52,
    "Last Week": 71,
  },
  {
    date: "Wednesday",
    "2022": 48,
    "2023": 80,
  },
  {
    date: "Thursday",
    "2022": 61,
    "2023": 65,
  },
  {
    date: "Friday",
    "2022": 55,
    "2023": 58,
  },
  {
    date: "Saturday",
    "2022": 67,
    "2023": 62,
  },
  {
    date: "Sunday",
    "2022": 60,
    "2023": 54,
  },

];

export const BarChartGraph = () => {
  const [value, setValue] = React.useState(null);
  return (
    <>
        <Title>Task completed statistics vs. last week</Title>
        <BarChart
          className="mt-6"
          data={chartdata3}
          index="date"
          categories={["This Week", "Last Week"]}
          colors={["neutral", "indigo"]}
          yAxisWidth={30}
          onValueChange={(v) => setValue(v)}
          showAnimation
        />
    </>
  );
};