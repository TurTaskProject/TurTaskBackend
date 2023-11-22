import { Card, Grid, Tab, TabGroup, TabList, TabPanel, TabPanels, Text, Title, Legend } from "@tremor/react";
import KpiCard from "./kpiCard";
import { BarChartGraph } from "./Barchart";
import DonutChartGraph from "./DonutChart";
import { AreaChartGraph } from "./Areachart";
import ProgressCircleChart from "./ProgressCircle";

export default function Dashboard() {
  return (
    <div className="flex flex-col p-12">
      <div>
        <Title>Dashboard</Title>
        <Text>All of your progress will be shown right here.</Text>
      </div>

      <div>
        <TabGroup className="mt-6">
          <TabList>
            <Tab>Weekly</Tab>
            <Tab>Overview</Tab>
          </TabList>
          <TabPanels>
            {/*Weekly Tab*/}
            <TabPanel>
              <Grid numItemsMd={2} numItemsLg={3} className="gap-6 mt-6">
                <Card>
                  <Title>Highlights vs. last week</Title>
                  <br />
                  <KpiCard />
                  <br />
                  <Title>Last week progress rate</Title>
                  <br />
                  <ProgressCircleChart />
                  <Legend
                    className="mt-3 mx-auto w-1/2"
                    categories={["Completed Tasks", "Assigned Tasks"]}
                    colors={["indigo"]}></Legend>
                </Card>
                <Card>
                  <BarChartGraph />
                </Card>
                <Card>
                  <AreaChartGraph />
                </Card>
              </Grid>
            </TabPanel>
            <TabPanel>
              <div className="h-31">
                <Card className="mx-auto h-full">
                  <Title>Tasks</Title>
                  <DonutChartGraph />
                  <br />
                  <Legend
                    className="mt-3 mx-auto w-1/2"
                    categories={["Todo Task", "Recurrence Task"]}
                    colors={["rose", "yellow"]}
                  />
                </Card>
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
}
