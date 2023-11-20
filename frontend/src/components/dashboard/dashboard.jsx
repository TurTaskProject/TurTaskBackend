import {
  Card,
  Grid,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Text,
  Title,
  DonutChart,
} from "@tremor/react";
import KpiCard from "./kpiCard";
import { BarChartGraph } from "./Barchart";

const cities = [
  {
    name: "New York",
    sales: 9800,
  },
  // ...
  {
    name: "Zurich",
    sales: 1398,
  },
];

const valueFormatter = (number) =>
  `$ ${new Intl.NumberFormat("us").format(number).toString()}`;

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
            <Tab>Overview</Tab>
            <Tab>Detail</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Grid numItemsMd={2} numItemsLg={3} className="gap-6 mt-6">
                <Card>
                  <KpiCard />
                  <br />
                  <KpiCard />
                </Card>
                  {/* Placeholder to set height */}
                  <div className="h-31">
                    <Card className="mx-auto h-full">
                      <Title>Sales</Title>
                      <DonutChart
                        className="mt-6"
                        data={cities}
                        category="sales"
                        index="name"
                        colors={[
                          "rose",
                          "yellow",
                          "orange",
                          "indigo",
                          "blue",
                          "emerald",
                        ]}
                        onValueChange={(v) => setValue(v)}
                        showAnimation
                      />
                    </Card>
                  </div>
                  <BarChartGraph />
                      
                <Card>
                  {/* Placeholder to set height */}
                  <div className="h-28" />
                </Card>
              </Grid>
              <div className="mt-6">
                <Card>
                  <div className="h-80" />
                </Card>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="mt-6">
                <Card>
                  <div className="h-96" />
                </Card>
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
}
