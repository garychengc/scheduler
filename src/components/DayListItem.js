import React from "react";
import "./DayListItem.scss";
import classNames from "classnames";



export default function DayListItem(props) {
  let dayClass = classNames("day-list__item",{
    "day-list__item--selected": props.selected,
    "day-list__item--full": props.spots === 0
  });

  function formatSpots(props) {
    if (props.spots === 0) {
      return "no spots remaining";
    } else if (props.spots === 1) {
      return "1 spot remaining";
    } else {
      return `${props.spots} spots remaining`;
    }
  }

  const spotsOutput = formatSpots(props);


  return (
    <li onClick={props.setDay} className={dayClass}>
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{spotsOutput}</h3>
    </li>
  );
}
