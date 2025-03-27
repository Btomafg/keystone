import PropTypes from "prop-types";

const Cell = ({ selected, onMouseDown, onMouseEnter, onMouseUp, currentSelection }) => {
  const cellClass = selected ? "cell selected" : "cell";
  const currentClass = currentSelection ? "bg-yellow-200" : "";

  return (
    <div
      className={` ${cellClass} ${currentClass}`}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseUp={onMouseUp}
    />
  );
};

Cell.propTypes = {
  selected: PropTypes.bool,
  onMouseDown: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseUp: PropTypes.func,
};

Cell.defaultProps = {
  selected: false,
};

export default Cell;
