import "./styles.scss";
import React, { Fragment } from "react";
import Header from "./Header.js";
import Show from "./Show.js";
import Empty from "./Empty.js";

export default function Appointment(props) {
  return (
    <Fragment>
      <Header time={props.time} />
      {props.interview ? <Show student={props.interview.student} interviewer={props.interview.interviewer.name} /> : <Empty />}
    </Fragment>
  );
}
