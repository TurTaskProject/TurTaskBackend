import { BarChart, Title } from "@tremor/react";
import React from "react";
import axiosInstance from "src/api/AxiosConfig";

const fetchBarChartData = async () => {
  let res = await axiosInstance.get("/dashboard/weekly/");
  console.log(res.data);
  // const barchartData = [
  //   {
  //     date: "Mon",
  //     "This Week": res.data[0]["Completed This Week"],
  //     "Last Week": res.data[0]["Completed Last Week"],
  //   },
  //   {
  //     date: "Tue",
  //     "This Week": res.data[1]["Completed This Week"],
  //     "Last Week": res.data[1]["Completed Last Week"],
  //   },
  //   {
  //     date: "Wed",
  //     "This Week": res.data[2]["Completed This Week"],
  //     "Last Week": res.data[2]["Completed Last Week"],
  //   },
  //   {
  //     date: "Th",
  //     "This Week": res.data[3]["Completed This Week"],
  //     "Last Week": res.data[3]["Completed Last Week"],
  //   },
  //   {
  //     date: "Fri",
  //     "This Week": res.data[4]["Completed This Week"],
  //     "Last Week": res.data[4]["Completed Last Week"],
  //   },
  //   {
  //     date: "Sat",
  //     "This Week": res.data[5]["Completed This Week"],
  //     "Last Week": res.data[5]["Completed Last Week"],
  //   },
  //   {
  //     date: "Sun",
  //     "This Week": res.data[6]["Completed This Week"],
  //     "Last Week": res.data[6]["Completed Last Week"],
  //   },
  // ];
  const barchartData = [
    {
      date: "Mon",
      "This Week": 1,
      "Last Week": 2,
    },
    {
      date: "Tue",
      "This Week": 5,
      "Last Week": 2,
    },
    {
      date: "Wed",
      "This Week": 7,
      "Last Week": 9,
    },
    {
      date: "Th",
      "This Week": 10,
      "Last Week": 3,
    },
    {
      date: "Fri",
      "This Week": 5,
      "Last Week": 1,
    },
    {
      date: "Sat",
      "This Week": 7,
      "Last Week": 8,
    },
    {
      date: "Sun",
      "This Week": 3,
      "Last Week": 8,
    },
  ];
  return barchartData;
};
const barchartDataArray = await fetchBarChartData();
export const BarChartGraph = () => {
  const [value, setValue] = React.useState(null);
  return (
    <>
      <Title>Task completed statistics vs. last week</Title>
      <BarChart
        className="mt-6"
        data={barchartDataArray}
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
