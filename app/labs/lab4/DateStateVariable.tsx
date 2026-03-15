"use client";
import { useState } from "react";
import { FormControl } from "react-bootstrap";
export default function DateStateVariable() {
  const [startDate, setStartDate] = useState("2024-01-01");
  return (
    <div id="wd-date-state-variables">
      <h2>Date State Variables</h2>
      <h3>{startDate}</h3>
      <FormControl
        type="date"
        defaultValue={startDate}
        onChange={(e) => setStartDate(e.target.value)} />
      <hr />
    </div>
  );
}
