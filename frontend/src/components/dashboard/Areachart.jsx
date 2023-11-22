import { AreaChart, Title } from "@tremor/react";
import React from "react";
import axiosInstance from "src/api/AxiosConfig";

const fetchAreaChartData = async () => {
  let res = await axiosInstance.get("/dashboard/weekly/");
  console.log(res.data);
  // const areaChartData = [
  //     {
  //         date: "Mon",
  //         "This Week": res.data[0]["This Week"],
  //         "Last Week": res.data[0]["Last Week"],
  //     },
  //     {
  //         date: "Tue",
  //         "This Week": res.data[1]["This Week"],
  //         "Last Week": res.data[1]["Last Week"],
  //     },
  //     {
  //         date: "Wed",
  //         "This Week": res.data[2]["This Week"],
  //         "Last Week": res.data[2]["Last Week"],
  //     },
  //     {
  //         date: "Th",
  //         "This Week": res.data[3]["This Week"],
  //         "Last Week": res.data[3]["Last Week"],
  //     },
  //     {
  //         date: "Fri",
  //         "This Week": res.data[4]["This Week"],
  //         "Last Week": res.data[4]["Last Week"],
  //     },
  //     {
  //         date: "Sat",
  //         "This Week": res.data[5]["This Week"],
  //         "Last Week": res.data[5]["Last Week"],
  //     },
  //     {
  //         date: "Sun",
  //         "This Week": res.data[6]["This Week"],
  //         "Last Week": res.data[6]["Last Week"],
  //     },
  // ];
  const areaChartData = [
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
  return areaChartData;
};

const areaChartDataArray = await fetchAreaChartData();
export const AreaChartGraph = () => {
  const [value, setValue] = React.useState(null);
  return (
    <>
      <Title>Number of tasks statistics vs. last week</Title>
      <AreaChart
        className="mt-6"
        data={areaChartDataArray}
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
