export function getAppointmentsForDay(state, day) {
  const filteredDay = state.days.filter(dayData => dayData.name === day);
  let filteredAppoinment = [];
  if (filteredDay.length !== 0) {
    for (let key in state.appointments) {
      if (filteredDay[0].appointments.includes(state.appointments[key].id)) {
        filteredAppoinment.push(state.appointments[key]);
      }
    }
  }
  return filteredAppoinment;
}

export function getInterview(state, interview) {
  let interviewObj = {};
  if (interview === null) return null;

  interviewObj = { student: interview.student };
  const interviewerID = interview.interviewer;

  for (let key in state.interviewers) {
    if (state.interviewers[key].id === interviewerID) {
      interviewObj["interviewer"] = state.interviewers[key];
    }
  }

  return interviewObj;
}
