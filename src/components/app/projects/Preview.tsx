import PropTypes from "prop-types";

/**
 * zones: Array of finalized zones (each zone has { start: {x, y}, end: {x, y} })
 * current: The in-progress zone, if any
 * removeZone: A function that removes a specific zone by index
 */
const Preview = ({ zones = [], current, removeZone }) => {
  // Combine all finalized zones + the in-progress zone for display
  const allZones = current ? [...zones, current] : zones;

  return (
    <div className="preview-container">
      <h3>Selected Cabinet Zones</h3>
      <div className="preview-grid">
        {allZones.map((zone, index) => {
          // The zone’s width/height in cells
          const width = zone.end.x - zone.start.x + 1;
          const height = zone.end.y - zone.start.y + 1;

          // Inline style to visualize the zone in a small “preview grid”
          // You can adjust this to your preference.
          const style = {
            gridColumn: `${zone.start.x + 1} / span ${width}`,
            gridRow: `${zone.start.y + 1} / span ${height}`,
          };

          // If it’s the “current” (in-progress) zone, style it differently
          const classNames = zone.current ? "zone current " : "zone finalized";

          return (
            <div key={index} className={classNames} style={style}>
              {/* Show a remove button only if the zone is finalized */}
              {!zone.current && (
                <>
                  <button
                    className="remove-zone"
                    onClick={() => removeZone(index)}
                  >
                    X
                  </button>
                  <span className="zone-label">{index + 1}</span>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

Preview.propTypes = {
  zones: PropTypes.arrayOf(
    PropTypes.shape({
      start: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number })
        .isRequired,
      end: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number })
        .isRequired,
      current: PropTypes.bool,
    })
  ),
  current: PropTypes.shape({
    start: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number })
      .isRequired,
    end: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number })
      .isRequired,
    current: PropTypes.bool,
  }),
  removeZone: PropTypes.func.isRequired,
};

export default Preview;
