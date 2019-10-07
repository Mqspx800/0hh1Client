import React from "react";

export default function Square(props) {
  const style = () => {
    const { value, dupe, locked } = props;
    let className = ["square"];
    if (locked) className.push("locked");
    if (dupe) className.push("dupe");
    className.push(`fill-${value || 0}`);

    return className.join(" ");
  };
  const { x, y } = props.coords;
  return (
    <span
      onClick={() => props.onClick({ variables: { x, y } })}
      className={style()}
    ></span>
  );
}
