import React from "react";

const Colors = props => {
  // console.log(props);
  const { colors } = props;
  const colorItem = colors.slice(0, 20).map((color, i) => (
    <li
      key={i}
      className="color"
      style={{ background: color.hex_value, color: color.hex_value }}
    >
      <div className="color" />
    </li>
  ));

  return <ul className="colorList">{colorItem}</ul>;
};

export default Colors;
