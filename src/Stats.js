import Amplify, { Auth, API} from "aws-amplify";
import React, { useState, useRef, useCallback } from "react";
import { TabList, Tabs, Tab, TabPanel } from "react-tabs";
import aws_exports from './aws-exports';
import 'react-tabs/style/react-tabs.css'
Amplify.configure(aws_exports);

const Stats = () => {
  const [globalStats, setGlobalStats] = useState("")
  const [userStats, setUserStats] = useState("")

  const getStatistics = () => {
    Auth.currentCredentials().then(res => {
      API.post("api1939e8e6", "/statistics", {
        body: {
          users: [res.data.IdentityId, 'globalStats']
        }
      })
        .then(responseBody => {
          console.log(responseBody)
        })
        .catch(err => console.log(err.body))
    })
  }

  return (
    <div className="stat-div">
      <Tabs>
        <TabList>
          <Tab>Global</Tab>
          <Tab>Personal</Tab>
        </TabList>
        <TabPanel>
        <button onClick={getStatistics}>
              mol doch
            </button>
          <div className={globalStats === "" ? "hidden" : "global-stats"}>
            {globalStats}
           
          </div>
        </TabPanel>
        <TabPanel>
          <div className={userStats === "" ? "hidden" : "user-stats"}>
            {userStats}
          </div>
          </TabPanel>
      </Tabs>
    </div>
  );
}

export default Stats;