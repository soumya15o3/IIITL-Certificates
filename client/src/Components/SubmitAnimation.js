import React from "react";
import PropTypes from "prop-types";
// import "../Styles/submitAnimation.css";

function SubmitAnimation(props) {
  const { currentState } = props;
  return (
    <div className="container" style={{ marginBottom: "15px" }}>
      <button className={`animatedButton ${currentState}`}/>
    </div>
  );
}

SubmitAnimation.propTypes = {
  currentState: PropTypes.string.isRequired,
};

export default SubmitAnimation;
