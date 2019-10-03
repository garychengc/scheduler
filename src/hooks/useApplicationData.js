import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";

export default function useApplicationData(props) {
  // const [state, setState] = useState({
  //   day: "Monday",
  //   days: [],
  //   appointments: {},
  //   interviewers: {}
  // });
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  const reducer = (state, action) => {
    switch (action.type) {
      case SET_DAY:
        return { ...state, day: action.value };

      case SET_APPLICATION_DATA:
        return { ...state, days: action.value[0].data, appointments: action.value[1].data, interviewers: action.value[2].data };
      
        case SET_INTERVIEW: {
        return { ...state, appointments: action.value };
      }

      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  };


  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => {
    // setState({ ...state, day })
    return dispatch({ type: SET_DAY, value: day });
  };

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then(all => {
      // setState(prev => ({
      //   ...prev,
      //   days: all[0].data,
      //   appointments: all[1].data,
      //   interviewers: all[2].data
      // }));
      // let days = all[0].data;
      // let appointments = all[1].data;
      // let interviewers = all[2].data;
      dispatch({
        type: SET_APPLICATION_DATA,
        value: all,
      });
    });
  }, []);

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.put(`/api/appointments/${id}`, { interview }).then(res => {
      // setState({ ...state, appointments });
      dispatch({ type: SET_INTERVIEW, value: appointments});
    });
    // .catch(error => console.log(error));
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.delete(`/api/appointments/${id}`, { data: null }).then(res => {
      // setState({ ...state, appointments });
      dispatch({ type: SET_INTERVIEW, value: appointments});
      // console.log(res);
    });
    // .catch(error => console.log(error));
  }

  return { state, setDay, bookInterview, cancelInterview };
}
