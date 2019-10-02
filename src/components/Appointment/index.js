import "./styles.scss";
import React from "react";
import Header from "./Header.js";
import Show from "./Show.js";
import Empty from "./Empty.js";
import Form from "./Form.js";
import Status from "./Status.js";
import Confirm from "./Confirm.js";
import useVisualMode from "../../hooks/useVisualMode.js";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING);
    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(error => {
        console.log(error);
        transition(ERROR_SAVE);
      });
  }

  function cancel() {
    transition(DELETING);
    props
      .cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(error => {
        console.log(error);
        transition(ERROR_DELETE);
      });
  }

  function confirm() {
    transition(CONFIRM);
  }

  function edit(id) {
    transition(EDIT);
  }

  function studentName() {
    let nameOfStudent;
    if (props.interview !== null) {
      nameOfStudent = props.interview.student;
    }
    return nameOfStudent;
  }

  function interviewerID() {
    let interviewerID;
    if (props.interview !== null) {
      interviewerID = props.interview.interviewer.id;
    }
    return interviewerID;
  }

  function interviewerName() {
    let interviewerName;
    if (props.interview !== null) {
      interviewerName = props.interview.interviewer.name;
    }
    return interviewerName;
  }

  return (
    <article className="appointment" id={props.id}>
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === CREATE && (
        <Form interviewers={props.interviewers} onCancel={back} onSave={save} />
      )}
      {mode === EDIT && (
        <Form
          interviewers={props.interviewers}
          studentName={studentName()}
          onSave={save}
          onCancel={back}
          interviewer={interviewerID()}
        />
      )}
      {mode === SAVING && <Status message="Saving" />}
      {mode === CONFIRM && <Confirm onConfirm={cancel} onCancel={back} />}
      {mode === DELETING && <Status message="Deleting" />}
      {mode === SHOW && (
        <Show
          student={studentName()}
          // interviewer={props.interview.interviewer.name}
          interviewer={interviewerName()}
          onDelete={confirm}
          onEdit={edit}
        />
      )}
    </article>
  );
}
