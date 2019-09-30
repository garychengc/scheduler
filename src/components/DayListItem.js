import React from "react";
import "components/DayListItem.scss";
import classNames from "classnames";






export default function DayListItem(props) {
  // let dayClass = classNames("day-list__item",{
  //   "--selected": props.selected,
  //   "--full": props.spots === 0
  // });

  let dayClass = "day-list__item";

  if (props.selected) {
    dayClass += "--selected";
  }

  if (props.spots === 0) {
    dayClass += "--full";
  }

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
    <li onClick={() => props.setDay(props.name)} className={dayClass}>
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{spotsOutput}</h3>
    </li>
  );
}
