import Amplify, { Auth, API } from "aws-amplify";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { TabList, Tabs, Tab, TabPanel } from "react-tabs";
import aws_exports from './aws-exports';
import 'react-tabs/style/react-tabs.css'
import StatsChart from "./StatsChart";
Amplify.configure(aws_exports);

const Stats = () => {
  const [globalStats, setGlobalStats] = useState("")
  const [userStats, setUserStats] = useState("")

  const getStatistics = () => {
    Auth.currentUserPoolUser().then(user => {
      API.post("api1939e8e6", "/statistics", {
        body: {
          users: [user.attributes.sub, 'globalStats']
        }
      })
        .then(responseBody => {
          for (var i in responseBody) {
            var result = []
            var content = responseBody[i]
            console.log(content)
            content['noFeedbackCount'] = content.uploadCount - content.correctCount - content.wrongCount
            if (i == user.attributes.sub) {
              content.name = user.username
              result.push(content)
              setUserStats(result)
            }
            else if (i == "globalStats") {
              content.name = "Global"
              result.push(content)
              setGlobalStats(result)
            }
            else
              console.log("unkown")
          }
        })
        .catch(err => console.log(err.body))
    })      
  }
  
  return (
    <div className="stat-div">
      <button id="orange-button" onClick={getStatistics}>
        Reload
      </button>
      <p />
      <Tabs>
        <TabList>
          <Tab>Global</Tab>
          <Tab>Personal</Tab>
        </TabList>
        <TabPanel>
          <StatsChart stats={globalStats} />
        </TabPanel>
        <TabPanel>
          <StatsChart stats={userStats} />
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default Stats;