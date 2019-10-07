import { useReducer, useEffect } from "react";
import axios from "axios";
const useApplicationData = () => {
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";
  const UPDATE_SPOTS_REMAINING = "UPDATE_SPOTS_REMAINING";
  function reducer(state, action) {
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
      case SET_INTERVIEW:
        const appointment = {
          ...state.appointments[action.id],
          interview: action.interview && { ...action.interview }
        };
        const appointments = {
          ...state.appointments,
          [action.id]: appointment
        };
        return {
          ...state,
          appointments
        };
      case UPDATE_SPOTS_REMAINING:
        let dayid = 0;
        if (action.id < 6) {
          dayid = 0;
        } else if (action.id < 11) {
          dayid = 1;
        } else if (action.id < 16) {
          dayid = 2;
        } else if (action.id < 21) {
          dayid = 3;
        } else if (action.id < 26) {
          dayid = 4;
        }
        let newdays = state.days.map((item, index) => {
          if (index !== dayid) {
            return item;
          }
          return {
            ...item,
            spots: state.days[dayid].spots + action.val
          };
        });
        return { ...state, days: newdays };
      default:
        throw new Error("Tried to use unsupported action type " + action.type);
    }
  }
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ])
      .then(all =>
        dispatch({
          type: SET_APPLICATION_DATA,
          days: all[0].data,
          appointments: all[1].data,
          interviewers: all[2].data
        })
      )
      .catch(err => console.log("err"));
  }, []);
  const setDay = day => dispatch({ type: SET_DAY, day });
  function bookInterview(id, interview) {
    if (!state.appointments[id].interview) {
      updateDays(id, -1);
    }
    return axios
      .put(`/api/appointments/${id}`, { interview })
      .then(dispatch({ type: SET_INTERVIEW, id, interview }));
  }
  function cancelInterview(id, interview) {
    return axios
      .delete(`/api/appointments/${id}`)
      .then(dispatch({ type: SET_INTERVIEW, id, interview: null }))
      .then(updateDays(id, 1));
  }
  function updateDays(id, val) {
    // console.log("logging state.days ", state.days);
    dispatch({
      type: UPDATE_SPOTS_REMAINING,
      id,
      val
    });
    // console.log("consolelog state.days after change", state.days);
  }
  return { state, setDay, bookInterview, cancelInterview };
};
export default useApplicationData;



// import { useEffect, useReducer } from "react";
// import axios from "axios";
// // import { statement, statements } from "@babel/template";

// export default function useApplicationData(props) {
//   // const [state, setState] = useState({
//   //   day: "Monday",
//   //   days: [],
//   //   appointments: {},
//   //   interviewers: {}
//   // });
//   const SET_DAY = "SET_DAY";
//   const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
//   const SET_INTERVIEW = "SET_INTERVIEW";
//   const SET_REMAININGSPOTS = "SET_REMAININGSPOTS";
//   const UPDATE_INTERVIEW = "UPDATE_INTERVIEW";
//   const DELETE_INTERVIEW = "DELETE_INTERVIEW";
//   const SET_DAYS = "SET_DAYS";

//   const reducer = (state, action) => {
//     switch (action.type) {
//       case SET_DAY:
//         return { ...state, day: action.day };

//       case SET_APPLICATION_DATA:
//         return {
//           ...state,
//           days: action.days,
//           appointments: action.appointments,
//           interviewers: action.interviewers
//         };

//       case SET_INTERVIEW: {
//         return { ...state, appointments: action.appointments };
//       }

//       case SET_REMAININGSPOTS: {
//         return { ...state, days: action.days };
//       }

//       case SET_DAYS: {
//         return { ...state, days: action.days };
//       }

//       case UPDATE_INTERVIEW: {
//         return {
//           ...state,
//           appointments: action.appointments,
//           days: action.days
//         };
//       }

//       case DELETE_INTERVIEW: {
//         return {
//           ...state,
//           appointments: action.appointments,
//           days: action.days
//         };
//       }

//       default:
//         throw new Error(
//           `Tried to reduce with unsupported action type: ${action.type}`
//         );
//     }
//   };

//   const [state, dispatch] = useReducer(reducer, {
//     day: "Monday",
//     days: [],
//     appointments: {},
//     interviewers: {}
//   });

//   const setDay = day => {
//     // setState({ ...state, day })
//     return dispatch({ type: SET_DAY, day });
//   };

//   useEffect(() => {
//     Promise.all([
//       axios.get("/api/days"),
//       axios.get("/api/appointments"),
//       axios.get("/api/interviewers")
//     ]).then(all => {
//       // setState(prev => ({
//       //   ...prev,
//       //   days: all[0].data,
//       //   appointments: all[1].data,
//       //   interviewers: all[2].data
//       // }));
//       // let days = all[0].data;
//       // let appointments = all[1].data;
//       // let interviewers = all[2].data;
//       // console.log(all[0].data);
//       dispatch({
//         type: SET_APPLICATION_DATA,
//         days: all[0].data,
//         appointments: all[1].data,
//         interviewers: all[2].data
//       });
//     });
//   }, []);

//   useEffect(() => {
//     let webSocket = new WebSocket("ws://localhost:8001/");

//     webSocket.onopen = function(e) {
//       // console.log(e);
//       webSocket.send("ping");
//     };

//     webSocket.onmessage = function(e) {
//       const message = JSON.parse(e.data);
//       if (message.type === "SET_INTERVIEW") {
//         // axios.get("/api/days").then(res => dispatch ({type: SET_DAYS, days: res.data}))

//         if (state.days.length > 0) {
//           if (message.interview === null) {
            
//             const appointment = {
//               ...state.appointments[message.id],
//               interview: null
//             };

//             const appointments = {
//               ...state.appointments,
//               [message.id]: appointment
//             };

//             let dayID = getDayID(message.id);
//             let days;

//             if (state.days[dayID]) {
//               days = updateObjectInArray(state.days, {
//                 index: dayID,
//                 item: state.days[dayID].spots + 1
//               });
//             }
//             dispatch({ type: "DELETE_INTERVIEW", appointments, days: days });
//           } else {
//             const appointment = {
//               ...state.appointments[message.id],
//               interview: { ...message }
//             };

//             const appointments = {
//               ...state.appointments,
//               [message.id]: appointment
//             };

//             let dayID = getDayID(message.id);
//             let days = updateObjectInArray(state.days, {
//               index: dayID,
//               item: state.days[dayID].spots - 1
//             });

//             dispatch({ type: "UPDATE_INTERVIEW", appointments, days: days });
//           }
//         }
//       }
//       return () => webSocket.close();
//     };
//   }, []);

//   function updateObjectInArray(array, action) {
//     return array.map((item, index) => {
//       if (index !== action.index) {
//         // This isn't the item we care about - keep it as-is
//         return item;
//       }

//       // Otherwise, this is the one we want - return an updated value
//       return {
//         ...item,
//         spots: action.item
//       };
//     });
//   }

//   function getDayID(id) {
//     for (let i = 0; i < state.days.length; i++) {
//       if (state.days[i].appointments.includes(id)) {
//         return i;
//       }
//     }
//   }

//   // const getDayID = appointmentId => {
//   //   let dayId = 0;
//   //   if (appointmentId > 20) {
//   //     dayId = 4;
//   //   } else if (appointmentId > 15) {
//   //     dayId = 3;
//   //   } else if (appointmentId > 10) {
//   //     dayId = 2;
//   //   } else if (appointmentId > 5) {
//   //     dayId = 1;
//   //   }
//   //   return dayId;
//   // };

//   function bookInterview(id, interview) {
//     const appointment = {
//       ...state.appointments[id],
//       interview: { ...interview }
//     };

//     const appointments = {
//       ...state.appointments,
//       [id]: appointment
//     };

//     if (!state.appointments[id].interview) {
//       const dayID = getDayID(id);
//       let days = updateObjectInArray(state.days, {
//         index: dayID,
//         item: state.days[dayID].spots - 1
//       });
//       dispatch({ type: SET_REMAININGSPOTS, days });
//     }

//     return axios.put(`/api/appointments/${id}`, { interview }).then(res => {
//       // setState({ ...state, appointments });

//       dispatch({ type: SET_INTERVIEW, appointments });
//     });
//     // .catch(error => console.log(error));
//   }

//   function cancelInterview(id) {
//     const appointment = {
//       ...state.appointments[id],
//       interview: null
//     };

//     const appointments = {
//       ...state.appointments,
//       [id]: appointment
//     };

//     const dayID = getDayID(id);
//     let days = updateObjectInArray(state.days, {
//       index: dayID,
//       item: state.days[dayID].spots + 1
//     });

//     dispatch({ type: SET_REMAININGSPOTS, days });

//     return axios.delete(`/api/appointments/${id}`, { data: null }).then(res => {
//       // setState({ ...state, appointments });
//       dispatch({ type: SET_INTERVIEW, appointments });
//       // console.log(res);
//     });
//     // .catch(error => console.log(error));
//   }

//   return { state, setDay, bookInterview, cancelInterview };
// }


// import React, { useReducer, useEffect } from "react";
// import axios from "axios";
// const useApplicationData = () => {
//   const SET_DAY = "SET_DAY";
//   const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
//   const SET_INTERVIEW = "SET_INTERIVEW";
//   const SET_SPOT_COUNT = "SET_COUNT";
//   const UPDATE_DATA = "UPDATE_DATA";
//   const DELETE_DATA = "DELETE_DATA";
//   const reducer = (state, action) => {
//     switch (action.type) {
//       case SET_DAY:
//         return {
//           ...state,
//           day: action.value
//         };
//       case SET_APPLICATION_DATA:
//         return {
//           ...state,
//           days: action.value[0].data,
//           appointments: action.value[1].data,
//           interviewers: action.value[2].data
//         };
//       case SET_INTERVIEW:
//         return {
//           ...state,
//           appointments: action.value
//         };
//       case SET_SPOT_COUNT:
//         return {
//           ...state,
//           days: action.value
//         };
//       case UPDATE_DATA: {
//         const appointment = {
//           ...state.appointments[action.message.id],
//           interview: { ...action.message.interview }
//         };
//         const appointments = {
//           ...state.appointments,
//           [action.message.id]: appointment
//         };
//         let dayId = getDayId(action.message.id);
//         let days = updateObjectInArray(state.days, {
//           index: dayId,
//           item: state.days[dayId].spots - 1
//         });
//         return {
//           ...state,
//           appointments: appointments,
//           days: days
//         };
//       }
//       case DELETE_DATA: {
//         const appointment = {
//           ...state.appointments[action.message.id],
//           interview: null
//         };
//         const appointments = {
//           ...state.appointments,
//           [action.message.id]: appointment
//         };
//         let dayId = getDayId(action.message.id);
//         let days = updateObjectInArray(state.days, {
//           index: dayId,
//           item: state.days[dayId].spots + 1
//         });
//         return {
//           ...state,
//           appointments: appointments,
//           days: days
//         };
//       }
//       default:
//         throw new Error(
//           `Tried to reduce with unsupported action type: ${action.type}`
//         );
//     }
//   };
//   const updateObjectInArray = (array, action) => {
//     return array.map((item, index) => {
//       if (index !== action.index) {
//         return item;
//       }
//       return {
//         ...item,
//         spots: action.item
//       };
//     });
//   };
//   const getDayId = appointmentId => {
//     let dayId = 0;
//     if (appointmentId > 20) {
//       dayId = 4;
//     } else if (appointmentId > 15) {
//       dayId = 3;
//     } else if (appointmentId > 10) {
//       dayId = 2;
//     } else if (appointmentId > 5) {
//       dayId = 1;
//     }
//     return dayId;
//   };
//   const [state, dispatch] = useReducer(reducer, {
//     day: "Monday",
//     days: [],
//     appointments: {},
//     interviewers: {}
//   });
//   const setDay = day => dispatch({ type: SET_DAY, value: day });
//   useEffect(() => {
//     Promise.all([
//       axios.get("/api/days"),
//       axios.get("/api/appointments"),
//       axios.get("/api/interviewers")
//     ]).then(all => {
//       dispatch({ type: SET_APPLICATION_DATA, value: all });
//     });
//   }, []);
//   const bookInterview = (id, interview) => {
//     return axios
//       .put(`/api/appointments/${id}`, { interview })
//       .then(response => {
//         if (response.status >= 200 && response.status < 300) {
//           const appointment = {
//             ...state.appointments[id],
//             interview: { ...interview }
//           };
//           const appointments = {
//             ...state.appointments,
//             [id]: appointment
//           };
//           console.log("Appoinrment", appointment)
//           console.log("Appoinrments", appointments)

//           if (!state.appointments[id].interview) {
//             let dayId = getDayId(id);
//             let days = updateObjectInArray(state.days, {
//               index: dayId,
//               item: state.days[dayId].spots - 1
//             });
//             dispatch({ type: SET_SPOT_COUNT, value: days });
//             dispatch({ type: SET_INTERVIEW, value: appointments });
//           }
//         }
//       });
//   };
//   const cancelInterview = id => {
//     return axios.delete(`/api/appointments/${id}`).then(response => {
//       if (response.status >= 200 && response.status < 300) {
//         const appointment = {
//           ...state.appointments[id],
//           interview: null
//         };
//         const appointments = {
//           ...state.appointments,
//           [id]: appointment
//         };
//         let dayId = getDayId(id);
//         let days = updateObjectInArray(state.days, {
//           index: dayId,
//           item: state.days[dayId].spots + 1
//         });
//         dispatch({ type: SET_SPOT_COUNT, value: days });
//         dispatch({ type: SET_INTERVIEW, value: appointments });
//       }
//     });
//   };
//   // WebSockets
//   useEffect(() => {
//     const socket = new WebSocket("ws://localhost:8001");
//     socket.onopen = event => {};
//     socket.onmessage = event => {
//       const message = JSON.parse(event.data);
//       if (message.type === "SET_INTERVIEW") {
//         if (message.interview !== null) {
//           console.log(message);
//           dispatch({ type: "UPDATE_DATA", message });
//         } else {
//           dispatch({ type: "DELETE_DATA", message });
//         }
//       }
//     };
//     return () => {
//       socket.close();
//     };
//   }, []);
//   return {
//     state,
//     setDay,
//     bookInterview,
//     cancelInterview
//   };
// };
// export default useApplicationData;
