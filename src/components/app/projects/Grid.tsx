'use client'
import { useState } from "react";

/**
 * Helper to check if cell (x,y) is within a start->end selection.
 */
function isInSelectionRange(x, y, start, end) {
  return x >= start.x && x <= end.x && y >= start.y && y <= end.y;
}

/**
 * Cell Component
 * - Renders a single cell in the grid.
 * - Highlights based on whether it's:
 *   1) Already selected (blue).
 *   2) Currently in an in-progress selection (yellow).
 */
function Cell({
  x,
  y,
  grid,
  currentSelection,
  onMouseDown,
  onMouseEnter,
  onMouseUp
}) {
  const isSelected = grid[x][y];
  const isInProgress =
    currentSelection &&
    isInSelectionRange(x, y, currentSelection.start, currentSelection.end);

  let cellClass = "border border-gray-300 w-8 h-8 cursor-pointer transition-colors duration-200 ease-in-out";
  if (isInProgress) {
    cellClass += " bg-yellow-400"; // In-progress selection = yellow
  } else if (isSelected) {
    cellClass += " bg-blue-400"; // Finalized selection = blue
  } else {
    cellClass += " bg-white hover:bg-gray-100";
  }

  return (
    <div
      className={cellClass}
      onMouseDown={() => onMouseDown(x, y)}
      onMouseEnter={() => onMouseEnter(x, y)}
      onMouseUp={onMouseUp}
    />
  );
}

/**
 * Preview Component
 * - Shows finalized zones + any current (in-progress) zone in a smaller preview grid.
 * - Each zone is positioned using inline grid styles (gridColumn, gridRow).
 * - "Remove" button allows the user to delete a finalized zone.
 */
function Preview({ zones, currentSelection, removeZone }) {
  // Combine finalized zones and in-progress zone for display
  const allZones = currentSelection ? [...zones, currentSelection] : zones;

  return (
    <div className="flex flex-col space-y-2">
      <h3 className="font-semibold text-lg">Selected Cabinet Zones</h3>
      {/* 12 columns x 6 rows, scaled down */}
      <div className="relative grid grid-cols-12 grid-rows-6 w-48 h-24 border border-gray-300">
        {allZones.map((zone, idx) => {
          const width = zone.end.x - zone.start.x + 1;
          const height = zone.end.y - zone.start.y + 1;

          // Inline grid positioning
          const style = {
            gridColumn: `${zone.start.x + 1} / span ${width}`,
            gridRow: `${zone.start.y + 1} / span ${height}`
          };

          // Different color for in-progress vs finalized
          const zoneColor = zone.current ? "bg-yellow-400/70" : "bg-blue-400/70";

          return (
            <div
              key={idx}
              style={style}
              className={`border border-gray-500 ${zoneColor} relative flex items-center justify-center`}
            >
              {/* Show a remove button only if this zone is finalized */}
              {!zone.current && (
                <>
                  <button
                    className="absolute top-0 right-0 text-white bg-red-600 rounded-bl px-1 text-xs"
                    onClick={() => removeZone(idx)}
                  >
                    X
                  </button>
                  <span className="text-white text-xs font-semibold">
                    {idx + 1}
                  </span>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Grid Component
 * - Main interactive area: 12 columns x 6 rows.
 * - Tracks:
 *   - grid[][]: which cells are finalized (true/false)
 *   - zones[]: list of finalized cabinet zones
 *   - selected: the first cell clicked on mouseDown
 *   - lastSelected: the latest cell hovered while dragging
 *   - currentSelection: the in-progress zone
 */
function Grid() {
  const COLS = 12;
  const ROWS = 6;

  // 2D array for cell selection state
  const [grid, setGrid] = useState(
    Array.from({ length: COLS }, () => Array(ROWS).fill(false))
  );

  const [zones, setZones] = useState([]);
  const [selected, setSelected] = useState(null);
  const [lastSelected, setLastSelected] = useState(null);
  const [currentSelection, setCurrentSelection] = useState(null);

  // Handle mouseDown to start a selection
  const handleMouseDown = (x, y) => {
    // If already selected, ignore
    if (grid[x][y]) return;
    setSelected({ x, y });
  };

  // Handle mouseEnter while dragging
  const handleMouseEnter = (x, y) => {
    if (!selected) return;

    // If the new range overlaps already-selected cells, abort
    for (let i = selected.x; i <= x; i++) {
      for (let j = selected.y; j <= y; j++) {
        if (grid[i][j]) return;
      }
    }

    // Update lastSelected and currentSelection
    const newLastSelected = { x, y };
    const newCurrentSelection = {
      start: selected,
      end: newLastSelected,
      current: true
    };

    setLastSelected(newLastSelected);
    setCurrentSelection(newCurrentSelection);
  };

  // Handle mouseUp to finalize the selection
  const handleMouseUp = () => {
    // If no valid selection in progress, reset
    if (!selected || !lastSelected) {
      setSelected(null);
      setLastSelected(null);
      setCurrentSelection(null);
      return;
    }

    // Copy the grid
    const newGrid = grid.map((col) => [...col]);

    // Mark all cells in the dragged area as true (selected)
    for (let i = selected.x; i <= lastSelected.x; i++) {
      for (let j = selected.y; j <= lastSelected.y; j++) {
        newGrid[i][j] = true;
      }
    }

    // Create a new zone
    const newZone = { start: selected, end: lastSelected };

    // Sort zones by row, then by column
    const updatedZones = [...zones, newZone].sort((a, b) => {
      if (a.start.y !== b.start.y) {
        return a.start.y - b.start.y;
      }
      return a.start.x - b.start.x;
    });

    setGrid(newGrid);
    setZones(updatedZones);

    // Reset in-progress selection
    setSelected(null);
    setLastSelected(null);
    setCurrentSelection(null);
  };

  // Remove a finalized zone
  const removeZone = (index) => {
    const zone = zones[index];
    if (!zone) return;

    const newGrid = grid.map((col) => [...col]);
    for (let i = zone.start.x; i <= zone.end.x; i++) {
      for (let j = zone.start.y; j <= zone.end.y; j++) {
        newGrid[i][j] = false;
      }
    }
    const updatedZones = zones.filter((_, idx) => idx !== index);

    setGrid(newGrid);
    setZones(updatedZones);
  };

  // Build all cells for the main grid
  const cells = Array.from({ length: COLS * ROWS }, (_, index) => {
    const x = index % COLS;
    const y = Math.floor(index / COLS);
    return (
      <Cell
        key={index}
        x={x}
        y={y}
        grid={grid}
        currentSelection={currentSelection}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseUp={handleMouseUp}
      />
    );
  });

  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-xl font-bold">Kitchen Cabinet Layout</h2>
      <div className="flex space-x-8">
        {/* Main interactive grid */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${COLS}, 2rem)`,
            gridTemplateRows: `repeat(${ROWS}, 2rem)`
          }}
        >
          {cells}
        </div>
        {/* Preview panel */}
        <Preview
          zones={zones}
          currentSelection={currentSelection}
          removeZone={removeZone}
        />
      </div>
    </div>
  );
}

export default Grid;
