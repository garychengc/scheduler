import React from "react";
import "./InterviewerList.scss";
import InterviewerListItem from "./InterviewerListItem";

export default function InterviewerList({
  interviewers,
  interviewer,
  setInterviewer
}) {
  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {interviewers.map(interviewerInfo => {
          return (
            <InterviewerListItem
              id={interviewerInfo.id}
              avatar={interviewerInfo.avatar}
              name={interviewerInfo.name}
              selected={interviewerInfo.id === interviewer}
              setInterviewer={setInterviewer}
            />
          );
        })}
      </ul>
    </section>
  );
}
