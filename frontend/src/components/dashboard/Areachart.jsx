import { AreaChart, Title } from "@tremor/react";
import React from "react";
import axiosInstance from "../../api/configs/AxiosConfig";

const fetchAreaChartData = async () => {
    let res = await axiosInstance.get("/dashboard/weekly/");
    console.log(res.data);
    const areaChartData = [
        {
            date: "Monday",
            "This Week": res.data[0]["This Week"],
            "Last Week": res.data[0]["Last Week"],
        },
        {
            date: "Tuesday",
            "This Week": res.data[1]["This Week"],
            "Last Week": res.data[1]["Last Week"],
        },
        {
            date: "Wednesday",
            "This Week": res.data[2]["This Week"],
            "Last Week": res.data[2]["Last Week"],
        },
        {
            date: "Thursday",
            "This Week": res.data[3]["This Week"],
            "Last Week": res.data[3]["Last Week"],
        },
        {
            date: "Friday",
            "This Week": res.data[4]["This Week"],
            "Last Week": res.data[4]["Last Week"],
        },
        {
            date: "Saturday",
            "This Week": res.data[5]["This Week"],
            "Last Week": res.data[5]["Last Week"],
        },
        {
            date: "Sunday",
            "This Week": res.data[6]["This Week"],
            "Last Week": res.data[6]["Last Week"],
        },
    ];
}

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