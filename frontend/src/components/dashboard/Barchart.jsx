import { BarChart, Title } from "@tremor/react";
import { useState, useEffect } from "react";
import { axiosInstance } from "src/api/AxiosConfig";

export const BarChartGraph = () => {
  const [barchartDataArray, setBarChartDataArray] = useState([]);

  useEffect(() => {
    const fetchAreaChartData = async () => {
      try {
        const response = await axiosInstance.get("/dashboard/weekly/");
        const barchartDataArray = response.data;
        setBarChartDataArray(barchartDataArray);
      } catch (error) {
        console.error("Error fetching area chart data:", error);
      }
    };

    fetchAreaChartData();
  }, []);

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
        showAnimation
      />
    </>
  );
};
