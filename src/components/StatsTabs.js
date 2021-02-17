import React, { useState } from "react";
import { TabList, Tabs, Tab, TabPanel } from "react-tabs";
import '../styles/StatsTabs.css'
import StatsTabPanel from "./StatsTabPanel";

const StatsTabs = (props) => {
  return (
      <Tabs className="tabs">
        <TabList className="tablist">
          <Tab className="outer-tab" selectedClassName="outer-tab--selected">Global</Tab>
          <Tab className="outer-tab" selectedClassName="outer-tab--selected">Personal</Tab>
        </TabList>
        <TabPanel>
          <div className="innerStatsTabContainer">
            <StatsTabPanel stats={props.global} />
          </div>
        </TabPanel>
        <TabPanel>
          <div className="innerStatsTabContainer">
            <StatsTabPanel stats={props.user} />
          </div>
        </TabPanel>
      </Tabs>
  );
}

export default StatsTabs;