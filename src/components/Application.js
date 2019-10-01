import React, { useState, Fragment, useEffect } from "react";
import DayList from "./DayList";
import Appointment from "components/Appointment";
import "components/Application.scss";
import axios from "axios";
import { getAppointmentsForDay } from "../helpers/selectors.js";

// const appointments = [
//   {
//     id: 1,
//     time: "12pm"
//   },
//   {
//     id: 2,
//     time: "1pm",
//     interview: {
//       student: "Lydia Miller-Jones",
//       interviewer: {
//         id: 1,
//         name: "Sylvia Palmer",
//         avatar: "https://i.imgur.com/LpaY82x.png"
//       }
//     }
//   },
//   {
//     id: 3,
//     time: "2pm"
//   },
//   {
//     id: 4,
//     time: "3pm",
//     interview: {
//       student: "Archie Cohen",
//       interviewer: {
//         id: 1,
//         name: "Sylvia Palmer",
//         avatar: "https://i.imgur.com/LpaY82x.png"
//       }
//     }
//   },
//   {
//     id: 5,
//     time: "4pm",
//     interview: {
//       student: "Hello-World",
//       interviewer: {
//         id: 2,
//         name: "Jason Chou",
//         avatar: "https://i.imgur.com/LpaY82x.png"
//       }
//     }
//   }
// ];

export default function Application(props) {
  // const [day, setDay] = useState("Monday");
  // const [days, setDays] = useState([]);

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });

  const setDay = day => setState({ ...state, day });
  // const setDays = days => setState({ ...state, days });
  // const setDays = days => setState(prev => ({ ...prev, days }));

  useEffect(() => {
    Promise.all([axios.get("/api/days"), axios.get("/api/appointments")]).then(
      all => {
        const [days, appointments] = all;
        // console.log(days, appointments);
        setState(prev => ({ days: all[0].data, appointments: all[1].data }));
      }
    );

    // axios
    //   .get("/api/days")
    //   .then(res => {
    //     // setDays(res.data);
    //   })
    //   .catch(error => console.log(error));
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
          return (
            <Fragment key={appointmentTime.id}>
              <Appointment key={appointmentTime.id} {...appointmentTime} />
              <Appointment key="last" time="5pm" />
            </Fragment>
          );
        })}
      </section>
    </main>
  );
}
