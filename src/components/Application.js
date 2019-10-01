import React, { useState, Fragment, useEffect } from "react";
import DayList from "./DayList";
import Appointment from "components/Appointment";
import "components/Application.scss";
import axios from "axios";
import { getAppointmentsForDay, getInterview } from "../helpers/selectors.js";

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then(all => {
      const [days, appointments, interviewers] = all;
      console.log(days, appointments, interviewers);
      setState(prev => ({
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      }));
    });
  }, []);

  const appointmentSchedule = getAppointmentsForDay(state, state.day);

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointmentSchedule.map(appointmentTime => {
          const interview = getInterview(state, appointmentTime.interview);
          return (
            <Fragment key={appointmentTime.id}>
              <Appointment
                key={appointmentTime.id}
                id={appointmentTime.id}
                {...appointmentTime}
                interview={interview}
              />
              <Appointment key="last" time="5pm" />
            </Fragment>
          );
        })}
      </section>
    </main>
  );
}
