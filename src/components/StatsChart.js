import React, { useState } from "react";
import { BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis, Bar, ResponsiveContainer } from "recharts";
import "../styles/StatsChart.css"

const StatsChart = (props) => {
  const [correctFill, seCorrectFill] = useState("#5A9120ff")
  const [wrongFill, setWrongFill] = useState("#BD2F11ff")
  const [totalFill, setTotalFill] = useState("#1A2094ff")
  const [noFeedbackFill, setNoFeedbackFill] = useState("gray")
  const [currentTooltip, setCurrentTooltip] = useState(null)

  const handleMouseEnterCorrect = () => {
    seCorrectFill("#5A912099")
  }

  const handleMouseLeaveCorrect = () => {
    seCorrectFill("#5A9120ff")
    setCurrentTooltip("")
  }

  const handleMouseEnterWrong = () => {
    setWrongFill("#BD2F1199")
  }

  const handleMouseLeaveWrong = () => {
    setWrongFill("#BD2F11ff")
    setCurrentTooltip("")
  }

  const handleMouseEnterNoFeedback = () => {
    setNoFeedbackFill("lightgray")
  }

  const handleMouseLeaveNoFeedback = () => {
    setNoFeedbackFill("gray")
    setCurrentTooltip("")
  }

  const handleMouseEnterTotal = () => {
    setTotalFill("#1A209499")
  }

  const handleMouseLeaveTotal = () => {
    setTotalFill("#1A2094ff")
    setCurrentTooltip("")
  }

  function BarTooltip({active, payload}) {
    try {
      if (!active || !currentTooltip)
        return null
      for (const bar of payload) {
        if (bar.dataKey === currentTooltip)
          return (
            <div className="stats-tooltip">
              {bar.name}: {bar.value}
            </div>
          );
      }
      return null
    }
    catch {
      return null
    }
  }

  return (
    <div className="stats-chart">
      <ResponsiveContainer width="100%" minHeight="400px">
        <BarChart width={730} height={250} data={props.stats}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={false} />
          <YAxis tickCount={10} allowDecimals={false}/>
          <Legend verticalAlign="bottom" />
          <Tooltip cursor={{fill: "transparent"}} animationDuration={500} offset={0} content={<BarTooltip />} />
          <Bar onMouseOver={() => setCurrentTooltip("correctCount")} onMouseEnter={handleMouseEnterCorrect} onMouseLeave={handleMouseLeaveCorrect} name={props.plural ? "Correct Categories" : "Correct Category"} stackId="feedback" dataKey="correctCount" fill={correctFill} />
          <Bar onMouseOver={() => setCurrentTooltip("wrongCount")} onMouseEnter={handleMouseEnterWrong} onMouseLeave={handleMouseLeaveWrong} name={props.plural ? "Wrong Categories" : "Wrong Category"} stackId="feedback" dataKey="wrongCount" fill={wrongFill} />
          <Bar onMouseOver={() => setCurrentTooltip("noFeedbackCount")} onMouseEnter={handleMouseEnterNoFeedback} onMouseLeave={handleMouseLeaveNoFeedback} name="No Feedback" stackId="feedback" dataKey="noFeedbackCount" fill={noFeedbackFill} />
          <Bar onMouseOver={() => setCurrentTooltip("uploadCount")} onMouseEnter={handleMouseEnterTotal} onMouseLeave={handleMouseLeaveTotal} name="Total Uploads" dataKey="uploadCount" fill={totalFill} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StatsChart;