import { AreaChart, Title } from "@tremor/react";
import { useState, useEffect } from "react";
import { axiosInstance } from "src/api/AxiosConfig";

export const AreaChartGraph = () => {
  const [areaChartDataArray, setAreaChartDataArray] = useState([]);

  useEffect(() => {
    const fetchAreaChartData = async () => {
      try {
        const response = await axiosInstance.get("/dashboard/weekly/");
        const areaChartData = response.data;
        setAreaChartDataArray(areaChartData);
      } catch (error) {
        console.error("Error fetching area chart data:", error);
      }
    };

    fetchAreaChartData();
  }, []);

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
        showAnimation
      />
    </>
  );
};
