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
    date: "Mar 23",
    "2022": 48,
    "2023": 80,
  },
  {
    date: "Apr 23",
    "2022": 61,
    "2023": 65,
  },
  {
    date: "May 23",
    "2022": 55,
    "2023": 58,
  },
  {
    date: "Jun 23",
    "2022": 67,
    "2023": 62,
  },
  {
    date: "Jul 23",
    "2022": 60,
    "2023": 54,
  },
  {
    date: "Aug 23",
    "2022": 72,
    "2023": 49,
  },
  {
    date: "Sep 23",
    "2022": 65,
    "2023": 52,
  },
  {
    date: "Oct 23",
    "2022": 68,
    "2023": null,
  },
  {
    date: "Nov 23",
    "2022": 74,
    "2023": null,
  },
  {
    date: "Dec 23",
    "2022": 71,
    "2023": null,
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
          categories={["This Week", "Last week"]}
          colors={["neutral", "indigo"]}
          yAxisWidth={30}
          onValueChange={(v) => setValue(v)}
          showAnimation
        />
    </>
  );
};