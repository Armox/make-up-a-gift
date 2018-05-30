import React from "react";
import styled from "styled-components";
import scrollToComponent from "react-scroll-to-component";

class Slider extends React.Component {
  componentDidMount() {
    scrollToComponent(this.Blue, {
      offset: 0,
      align: "middle",
      duration: 500,
      ease: "inCirc"
    });
  }

  render() {
    let { max, min, range } = this.props.budget;
    const maxDollar = (max / 100).toLocaleString("en-US", {
      style: "currency",
      currency: "USD"
    });
    const minDollar = (min / 100).toLocaleString("en-US", {
      style: "currency",
      currency: "USD"
    });
    const rangeDollar = (range / 100).toLocaleString("en-US", {
      style: "currency",
      currency: "USD"
    });
    // console.log(min, max)

    return (
      <div className="sliderContainer">
        {range ? (
          <p style={{ fontSize: "18px" }}>Budget: {rangeDollar} </p>
        ) : (
          <p style={{ fontSize: "18px" }}>Set Your Budget</p>
        )}
        <span
          className="slider"
          ref={section => {
            this.Blue = section;
          }}
        >
          {minDollar}
          <input
            type="range"
            min={min}
            max={max}
            onChange={e => {
              this.props.setBudget(e.target.value);
            }}
          />
          {maxDollar}
        </span>
      </div>
    );
  }
}

export default Slider;

const Input = styled.input`
  border: 1px solid black;
`;
