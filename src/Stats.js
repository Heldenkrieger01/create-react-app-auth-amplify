import Amplify from "aws-amplify";
import React, { useState, useRef, useCallback } from "react";
import { TabList, Tabs, Tab, TabPanel } from "react-tabs";
import aws_exports from './aws-exports';
import 'react-tabs/style/react-tabs.css'
Amplify.configure(aws_exports);

const Stats = () => {

    return (
        <div className="stat-div">
            <Tabs>
                <TabList>
                    <Tab>Global</Tab>
                    <Tab>Personal</Tab>
                </TabList>
                <TabPanel>
                    The global stats
            </TabPanel>
                <TabPanel>
                    Your personal stats
            </TabPanel>
            </Tabs>
        </div>
    );
}

export default Stats;