import { BarChart, Title } from "@tremor/react";
import React from "react";
import axiosInstance from "../../api/configs/AxiosConfig";

const fetchBarChartData = async () => {
  let res = await axiosInstance.get("/dashboard/weekly/");
  console.log(res.data);
  const barchartData = [
    {
      date: "Monday",
      "This Week": res.data[0]["Completed This Week"],
      "Last Week": res.data[0]["Completed Last Week"],
    },
    {
      date: "Tuesday",
      "This Week": res.data[1]["Completed This Week"],
      "Last Week": res.data[1]["Completed Last Week"],
    },
    {
      date: "Wednesday",
      "This Week": res.data[2]["Completed This Week"],
      "Last Week": res.data[2]["Completed Last Week"],
    },
    {
      date: "Thursday",
      "This Week": res.data[3]["Completed This Week"],
      "Last Week": res.data[3]["Completed Last Week"],
    },
    {
      date: "Friday",
      "This Week": res.data[4]["Completed This Week"],
      "Last Week": res.data[4]["Completed Last Week"],
    },
    {
      date: "Saturday",
      "This Week": res.data[5]["Completed This Week"],
      "Last Week": res.data[5]["Completed Last Week"],
    },
    {
      date: "Sunday",
      "This Week": res.data[6]["Completed This Week"],
      "Last Week": res.data[6]["Completed Last Week"],
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