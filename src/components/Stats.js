import { Auth, API } from "aws-amplify";
import React, { useState } from "react";
import StatsTabs from "./StatsTabs"
import "../styles/Stats.css"

const Stats = () => {
  const [globalStats, setGlobalStats] = useState("")
  const [userStats, setUserStats] = useState("")
  const [statsLoadedOnce, setStatsLoadedOnce] = useState(false)

  const getStatistics = () => {
    Auth.currentUserPoolUser().then(user => {
      API.post("api1939e8e6", "/newStatistics", {
        body: {
          users: [user.attributes.sub, 'globalStats']
        }
      })
        .then(responseBody => {
          for (var i in responseBody) {
            var res = {}
            for (var k in responseBody[i]) {
              res[k] = handleCategory(responseBody, i, k, user)
            }
            if (i === user.attributes.sub) {
              setUserStats(res)
            }
            else if (i === "globalStats") {
              setGlobalStats(res)
            }
          }
          setStatsLoadedOnce(true)
        })
        .catch(err => console.log(err.body))
    })
  }

  const handleCategory = (body, i, k, user) => {
    var result = []
    body[i][k]['noFeedbackCount'] = body[i][k].uploadCount - body[i][k].correctCount - body[i][k].wrongCount
    if (i === user.attributes.sub) {
      body[i][k].name = user.username
    }
    else if (i === "globalStats") {
      body[i][k].name = "Global"
    }
    result.push(body[i][k])
    return result
  }

  return (
    <div className="stat-div">
      <button id="orange-button" onClick={getStatistics}>
        {statsLoadedOnce ? "Reload" : "Load"}
      </button>
      <p/>
        <StatsTabs user={userStats} global={globalStats}/>
    </div>
  );
}

export default Stats;