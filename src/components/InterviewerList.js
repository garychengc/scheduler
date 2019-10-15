import React from "react";
import "./InterviewerList.scss";
import InterviewerListItem from "./InterviewerListItem";
import PropTypes from "prop-types";

export default function InterviewerList({ interviewers, value, onChange }) {
  InterviewerList.propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func.isRequired
  };

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
              selected={interviewerInfo.id === value || null}
              setInterviewer={() => onChange(interviewerInfo.id)}
            />
          );
        })}
      </ul>
    </section>
  );
}
