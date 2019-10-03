import { useEffect, useReducer } from "react";
import axios from "axios";
import { statement, statements } from "@babel/template";

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
  const SET_REMAININGSPOTS = "SET_REMAININGSPOTS";

  const reducer = (state, action) => {
    switch (action.type) {
      case SET_DAY:
        return { ...state, day: action.day };

      case SET_APPLICATION_DATA:
        return {
          ...state,
          days: action.days,
          appointments: action.appointments,
          interviewers: action.interviewers
        };

      case SET_INTERVIEW: {
        return { ...state, appointments: action.appointments };
      }

      case SET_REMAININGSPOTS: {
        return { ...state, days: action.days };
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
    return dispatch({ type: SET_DAY, day });
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
      // console.log(all[0].data);
      dispatch({
        type: SET_APPLICATION_DATA,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      });
    });
  }, []);

  function updateObjectInArray(array, action) {
    return array.map((item, index) => {
      if (index !== action.index) {
        // This isn't the item we care about - keep it as-is
        return item;
      }

      // Otherwise, this is the one we want - return an updated value
      return {
        ...item,
        spots: action.item
      };
    });
  }

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    let dayID;
    function getDayID(id) {
      state.days.forEach((element, index) => {
        if (element.appointments.includes(id)) {
          dayID = index;
          return index;
        }
      });
    }
    getDayID(id);
    let days = updateObjectInArray(state.days, {
      index: dayID,
      item: state.days[dayID].spots - 1
    });

    dispatch({ type: SET_REMAININGSPOTS, days });

    return axios.put(`/api/appointments/${id}`, { interview }).then(res => {
      // setState({ ...state, appointments });

      dispatch({ type: SET_INTERVIEW, appointments });
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

    let dayID;
    function getDayID(id) {
      state.days.forEach((element, index) => {
        if (element.appointments.includes(id)) {
          dayID = index;
          return index;
        }
      });
    }
    getDayID(id);
    let days = updateObjectInArray(state.days, {
      index: dayID,
      item: state.days[dayID].spots + 1
    });

    dispatch({ type: SET_REMAININGSPOTS, days });

    return axios.delete(`/api/appointments/${id}`, { data: null }).then(res => {
      // setState({ ...state, appointments });
      dispatch({ type: SET_INTERVIEW, appointments });
      // console.log(res);
    });
    // .catch(error => console.log(error));
  }

  return { state, setDay, bookInterview, cancelInterview };
}
