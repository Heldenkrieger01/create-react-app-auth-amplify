import React from "react";
import { TabList, Tabs, Tab, TabPanel } from "react-tabs";
import StatsChart from "./StatsChart";

const StatsTabPanel = (props) => {
  return (
    <Tabs className="tabs">
      <TabList className="tablist">
        <Tab className="inner-tab" selectedClassName="inner-tab--selected">Overview</Tab>
        <Tab className="inner-tab" selectedClassName="inner-tab--selected">Human</Tab>
        <Tab className="inner-tab" selectedClassName="inner-tab--selected">Animal</Tab>
        <Tab className="inner-tab" selectedClassName="inner-tab--selected">Car</Tab>
        <Tab className="inner-tab" selectedClassName="inner-tab--selected">Landscape</Tab>
        <Tab className="inner-tab" selectedClassName="inner-tab--selected">Undefined</Tab>
      </TabList>
      <TabPanel>
        <StatsChart stats={props.stats.Overview} plural={true} />
      </TabPanel>
      <TabPanel>
        <StatsChart stats={props.stats.Human} />
      </TabPanel>
      <TabPanel>
        <StatsChart stats={props.stats.Animal} />
      </TabPanel>
      <TabPanel>
        <StatsChart stats={props.stats.Car} />
      </TabPanel>
      <TabPanel>
        <StatsChart stats={props.stats.Landscape} />
      </TabPanel>
      <TabPanel>
        <StatsChart stats={props.stats.NOT_DEFINED} />
      </TabPanel>
    </Tabs>
  );
}

export default StatsTabPanel;