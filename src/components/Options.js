import React from "react";
import Overdrive from "react-overdrive";

class Options extends React.Component {
  checkToggleLimit = key => {
    // for (let value in selectedType) {
    //   console.log(value);
    // }

    Object.values(this.props.selectedType).reduce(
      (accumulator, currentValue, currentIndex, array) =>
        accumulator + currentValue
    ) < 3 && this.props.toggleSelect(key);
  };

  render() {
    const { selectedType } = this.props;
    return (
      <div className="type-list">
        <h2>Pick 3</h2>

        {Object.keys(selectedType)
          .filter(key => !selectedType[key])
          .map(key => (
            <Overdrive id={"option" + key} key={key}>
              <div
                className="type-list-item"
                name={key}
                onClick={() => this.checkToggleLimit(key)}
              >
                {key.replace(/_/g, " ").toUpperCase()}
              </div>
            </Overdrive>
          ))}
      </div>
    );
  }
}

export default Options;
