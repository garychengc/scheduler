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
