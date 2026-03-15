"use client";
import Link from "next/link";
import ClickEvent from "./ClickEvent";
import PassingDataOnEvent from "./PassingDataOnEvent";
import PassingFunctions from "./PassingFunctions";
import Counter from "./Counter";
import BooleanStateVariables from "./BooleanStateVariables";
import StringStateVariables from "./StringStateVariables";
import DateStateVariable from "./DateStateVariable";
import ObjectStateVariable from "./ObjectStateVariable";
import ArrayStateVariable from "./ArrayStateVariable";
import ParentStateComponent from "./ParentStateComponent";

export default function Lab4() {
  function sayHello() {
    alert("Hello");
  }
  return (
    <div id="wd-lab4" className="container">
      <h2>Lab 4</h2>
      <Link href="/labs/lab4/redux" className="btn btn-primary me-2">Redux Examples</Link>
      <Link href="/labs/lab4/react-context" className="btn btn-primary me-2">React Context Examples</Link>
      <Link href="/labs/lab4/zustand" className="btn btn-primary me-2">Zustand Examples</Link>
      <Link href="/labs/lab4/url-encoding" className="btn btn-primary">URL Encoding</Link>
      <hr />
      <ClickEvent />
      <PassingDataOnEvent />
      <PassingFunctions theFunction={sayHello} />
      <Counter />
      <BooleanStateVariables />
      <StringStateVariables />
      <DateStateVariable />
      <ObjectStateVariable />
      <ArrayStateVariable />
      <ParentStateComponent />
    </div>
  );
}
