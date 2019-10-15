export function getAppointmentsForDay(state, day) {
  const findDay = state.days.find(dayData => dayData.name === day);
  return findDay ? (findDay.appointments.map(day => state.appointments[day])) : []
}

export function getInterviewersByDay(state, day) {
  const filteredDay = state.days.filter(dayData => dayData.name === day);
  let filteredInterviews = [];
  if (filteredDay.length !== 0) {
    for (let ID of filteredDay[0].interviewers) {
      filteredInterviews.push(state.interviewers[ID]);
    }
  }
  return filteredInterviews;
}

export function getInterview(state, interview) {
  if (interview === null) return null;
  const interviewObj = { student: interview.student };
  const interviewerID = interview.interviewer;
  for (let key in state.interviewers) {
    if (state.interviewers[key].id === interviewerID) {
      interviewObj["interviewer"] = state.interviewers[key];
    }
  }
  return interviewObj;
}
