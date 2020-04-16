import React from "react";
import { GiHornedReptile } from "react-icons/gi";

export const playerIconColors = () => {
  return {
    0: "RGB(255, 212, 0)",
    1: "RGB(130, 2, 99)",
  };
};

export const UnitIcon = (props) => {
  const unitPlayerID = props?.unit?.playerID ?? "";
  const playerColor = playerIconColors[unitPlayerID];
  const gameIconProps = {
    x: "-2.5",
    y: "-2.5",
    style: {
      fill: `${playerColor}`,
      fontSize: "0.3rem",
      transform: "translate(30, 0)",
    },
  };
  if (typeof props?.unit?.unitCardID === "string") {
    switch (props.unitCardID) {
      case "hm101":
        return <GiHornedReptile {...gameIconProps} />;
      case "hm102":
        return <GiHornedReptile {...gameIconProps} />;
      case "hm103":
        return <GiHornedReptile {...gameIconProps} />;
      case "hm201":
        return <GiHornedReptile {...gameIconProps} />;
      case "hm202":
        return <GiHornedReptile {...gameIconProps} />;
      case "hm203":
        return <GiHornedReptile {...gameIconProps} />;
      default:
        return null;
    }
  }
  return null;
};
