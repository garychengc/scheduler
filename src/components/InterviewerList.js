import React from "react";
import "./InterviewerList.scss";
import InterviewerListItem from "./InterviewerListItem";

export default function InterviewerList({
  interviewers,
  value,
  onChange
}) {
  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {interviewers.map(interviewerInfo => {
          return (
            <InterviewerListItem
              key={interviewerInfo.id}
              avatar={interviewerInfo.avatar}
              name={interviewerInfo.name}
              selected={interviewerInfo.id === value}
              setInterviewer={() => onChange(interviewerInfo.id)}
            />
          );
        })}
      </ul>
    </section>
  );
}
