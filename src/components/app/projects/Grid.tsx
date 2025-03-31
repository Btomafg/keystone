'use client';
import { useEffect, useMemo, useState } from 'react';

/* -----------------------------------------------
   Constants & Helper Functions
----------------------------------------------- */
const CELLS_PER_FOOT = 1; // each foot equals 2 cells (0.5ft increments)
const CELL_SIZE = 10; // pixel dimension of each cell

function isInSelectionRange(x, y, start, end) {
  return x >= start.x && x <= end.x && y >= start.y && y <= end.y;
}

/* -----------------------------------------------
   Blue Shades Array
----------------------------------------------- */
const blueShades = [
  'bg-blue-100',
  'bg-blue-200',
  'bg-blue-300',
  'bg-blue-400',
  'bg-blue-500',
  'bg-blue-600',
  'bg-blue-700',
  'bg-blue-800',
  'bg-blue-900',
];

/* -----------------------------------------------
   Cell Component
----------------------------------------------- */
function Cell({ x, y, grid, zoneMap, currentSelection, onStart, onMove, onEnd }) {
  if (x < 0 || x >= grid.length) return null;
  if (y < 0 || y >= grid[x].length) return null;
  const cellValue = grid[x][y];
  const isInProgress = currentSelection && isInSelectionRange(x, y, currentSelection.start, currentSelection.end);

  let cellClass = 'border border-slate-200 w-3 h-3 cursor-pointer transition-colors duration-200 ease-in-out';
  if (isInProgress) {
    cellClass += ' bg-yellow-200'; // in-progress selection = yellow
  } else if (cellValue) {
    const zoneColor = zoneMap[cellValue] || 'bg-blue-200';
    cellClass += ` ${zoneColor}`;
  } else {
    cellClass += ' bg-white hover:bg-gray-50';
  }

  // Common handler that passes along x,y.
  const handleStart = () => onStart(x, y);
  const handleMove = () => onMove(x, y);
  const handleEnd = () => onEnd();

  return (
    <div
      className={cellClass}
      onMouseDown={handleStart}
      onMouseEnter={handleMove}
      onMouseUp={handleEnd}
      onTouchStart={handleStart}
      onTouchMove={(e) => {
        // Prevent default scrolling behavior
        e.preventDefault();
        // Get the touch point and determine cell based on element bounding box.
        handleMove();
      }}
      onTouchEnd={handleEnd}
    />
  );
}

/* -----------------------------------------------
   DimensionPopup Component
----------------------------------------------- */
function DimensionPopup({ mouseX, mouseY, width, height }) {
  if (width <= 0 || height <= 0) return null;
  return (
    <div
      style={{ position: 'fixed', top: mouseY + 10, left: mouseX + 10 }}
      className="z-50 bg-popover text-popover-foreground border border-slate-200 p-2 rounded-md shadow-md pointer-events-none text-sm"
    >
      {width / CELLS_PER_FOOT}ft × {height / CELLS_PER_FOOT}ft
    </div>
  );
}

/* -----------------------------------------------
   NameZonePopover Component (for new zone or editing)
----------------------------------------------- */
function NameZonePopover({ pendingZone, cellSize, defaultName = '', onSave, onCancel }) {
  const [zoneName, setZoneName] = useState(defaultName);
  const { start, end } = pendingZone;
  const zoneWidth = (end.x - start.x + 1) * cellSize;
  const zoneHeight = (end.y - start.y + 1) * cellSize;
  // Position popover at center of pending zone.
  const left = start.x * cellSize + zoneWidth / 2;
  const top = start.y * cellSize + zoneHeight / 2;

  return (
    <div
      style={{ position: 'absolute', left, top, transform: 'translate(-50%, -50%)' }}
      className="z-50 bg-white border border-gray-300 p-4 rounded shadow-md"
    >
      <div className="mb-2 text-sm font-semibold">{defaultName ? 'Edit Zone Name:' : 'Name this cabinet zone:'}</div>
      <input
        type="text"
        value={zoneName}
        onChange={(e) => setZoneName(e.target.value)}
        className="border p-1 rounded w-full mb-2"
        placeholder="Zone name..."
      />
      <div className="flex justify-end space-x-2">
        <button onClick={onCancel} className="px-3 py-1 rounded bg-red-500 text-white text-sm">
          Cancel
        </button>
        <button onClick={() => onSave(zoneName)} className="px-3 py-1 rounded bg-green-500 text-white text-sm">
          Save
        </button>
      </div>
    </div>
  );
}

/* -----------------------------------------------
   Main Grid Component
----------------------------------------------- */
export default function Grid() {
  // Room dimensions in feet (user input)
  const [roomWidthFeet, setRoomWidthFeet] = useState(10);
  const [roomHeightFeet, setRoomHeightFeet] = useState(8);

  // Derived grid dimensions (cells)
  const roomCols = roomWidthFeet * CELLS_PER_FOOT;
  const roomRows = roomHeightFeet * CELLS_PER_FOOT;

  const createEmptyGrid = (cols, rows) => Array.from({ length: cols }, () => Array(rows).fill(false));
  const [grid, setGrid] = useState(createEmptyGrid(roomCols, roomRows));
  const [zones, setZones] = useState([]);

  // Selection states
  const [selected, setSelected] = useState(null);
  const [lastSelected, setLastSelected] = useState(null);
  const [currentSelection, setCurrentSelection] = useState(null);
  // Pending zone for naming (or editing).
  const [pendingZone, setPendingZone] = useState(null);
  // If editing, store the zone id.
  const [editingZoneId, setEditingZoneId] = useState(null);

  const [isDragging, setIsDragging] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [nextZoneId, setNextZoneId] = useState(1);

  // Reinitialize grid when room dimensions change.
  useEffect(() => {
    setGrid(createEmptyGrid(roomCols, roomRows));
    setZones([]);
  }, [roomCols, roomRows]);

  const resetGrid = () => {
    setGrid(createEmptyGrid(roomCols, roomRows));
    setZones([]);
    setSelected(null);
    setLastSelected(null);
    setCurrentSelection(null);
    setPendingZone(null);
    setEditingZoneId(null);
    setIsDragging(false);
  };

  /* -----------------------------
     Event Handlers (for Mouse/Touch)
  ----------------------------- */
  const handleStart = (x, y) => {
    if (grid[x][y]) return;
    setSelected({ x, y });
    setIsDragging(true);
  };

  const handleMove = (x, y) => {
    if (!selected) return;
    const minX = Math.min(selected.x, x);
    const maxX = Math.max(selected.x, x);
    const minY = Math.min(selected.y, y);
    const maxY = Math.max(selected.y, y);
    // Abort if any cell in the range is already finalized.
    for (let i = minX; i <= maxX; i++) {
      for (let j = minY; j <= maxY; j++) {
        if (grid[i][j]) return;
      }
    }
    setLastSelected({ x, y });
    setCurrentSelection({ start: { x: minX, y: minY }, end: { x: maxX, y: maxY }, current: true });
  };

  const handleEnd = () => {
    setIsDragging(false);
    if (!selected || !lastSelected) {
      setSelected(null);
      setLastSelected(null);
      setCurrentSelection(null);
      return;
    }
    const minX = Math.min(selected.x, lastSelected.x);
    const maxX = Math.max(selected.x, lastSelected.x);
    const minY = Math.min(selected.y, lastSelected.y);
    const maxY = Math.max(selected.y, lastSelected.y);
    setPendingZone({ start: { x: minX, y: minY }, end: { x: maxX, y: maxY } });
    setSelected(null);
    setLastSelected(null);
    setCurrentSelection(null);
  };

  const handleMoveContainer = (e) => {
    if (!isDragging) return;
    // Use clientX/clientY from mouse or touch.
    if (e.touches) {
      setMousePos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    } else {
      setMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  /* -----------------------------
     Finalizing/Editing Zones
  ----------------------------- */
  const savePendingZone = (name) => {
    const newGrid = grid.map((col) => [...col]);
    const { start, end } = pendingZone;
    for (let i = start.x; i <= end.x; i++) {
      for (let j = start.y; j <= end.y; j++) {
        newGrid[i][j] = nextZoneId;
      }
    }
    setGrid(newGrid);
    const color = blueShades[(nextZoneId - 1) % blueShades.length] + '/70';
    const newZone = { id: nextZoneId, start, end, name, color };
    const updatedZones = [...zones, newZone].sort((a, b) => (a.start.y !== b.start.y ? a.start.y - b.start.y : a.start.x - b.start.x));
    setZones(updatedZones);
    setNextZoneId(nextZoneId + 1);
    setPendingZone(null);
  };

  const cancelPendingZone = () => {
    setPendingZone(null);
  };

  const saveEditedZone = (zoneId, newName) => {
    const updatedZones = zones.map((zone) => (zone.id === zoneId ? { ...zone, name: newName } : zone));
    setZones(updatedZones);
    setEditingZoneId(null);
  };

  const cancelEditing = () => {
    setEditingZoneId(null);
  };

  const removeZone = (zoneId) => {
    const zoneToRemove = zones.find((zone) => zone.id === zoneId);
    if (!zoneToRemove) return;
    const newGrid = grid.map((col) => [...col]);
    for (let i = zoneToRemove.start.x; i <= zoneToRemove.end.x; i++) {
      for (let j = zoneToRemove.start.y; j <= zoneToRemove.end.y; j++) {
        newGrid[i][j] = false;
      }
    }
    const updatedZones = zones.filter((zone) => zone.id !== zoneId);
    setGrid(newGrid);
    setZones(updatedZones);
  };

  // Mapping from zone id to its color.
  const zoneMap = useMemo(() => {
    const map = {};
    zones.forEach((zone) => {
      map[zone.id] = zone.color;
    });
    return map;
  }, [zones]);

  const totalCells = roomCols * roomRows;
  const cells = Array.from({ length: totalCells }, (_, index) => {
    const x = index % roomCols;
    const y = Math.floor(index / roomCols);
    return (
      <Cell
        key={index}
        x={x}
        y={y}
        grid={grid}
        zoneMap={zoneMap}
        currentSelection={currentSelection}
        onStart={handleStart}
        onMove={handleMove}
        onEnd={handleEnd}
      />
    );
  });

  // Compute dimensions (in cells) for the DimensionPopup.
  let dragWidth = 0;
  let dragHeight = 0;
  if (selected && lastSelected) {
    const minX = Math.min(selected.x, lastSelected.x);
    const maxX = Math.max(selected.x, lastSelected.x);
    const minY = Math.min(selected.y, lastSelected.y);
    const maxY = Math.max(selected.y, lastSelected.y);
    dragWidth = maxX - minX + 1;
    dragHeight = maxY - minY + 1;
  }

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <h2 className="text-2xl font-bold">Kitchen Cabinet Layout</h2>
      {/* Room Dimensions in Feet */}
      <div className="flex space-x-4 items-center">
        <label className="flex flex-col">
          Room Width (ft)
          <input
            type="number"
            value={roomWidthFeet}
            onChange={(e) => setRoomWidthFeet(Math.max(1, parseFloat(e.target.value) || 1))}
            className="border p-1 rounded"
          />
        </label>
        <label className="flex flex-col">
          Room Height (ft)
          <input
            type="number"
            value={roomHeightFeet}
            onChange={(e) => setRoomHeightFeet(Math.max(1, parseFloat(e.target.value) || 1))}
            className="border p-1 rounded"
          />
        </label>
        <button onClick={resetGrid} className="bg-green-500 text-white px-3 py-1 rounded">
          Reset Room
        </button>
      </div>
      <div className="relative">
        {/* Main Grid */}
        <div
          className="grid border border-gray-300 relative"
          style={{
            gridTemplateColumns: `repeat(${roomCols}, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(${roomRows}, ${CELL_SIZE}px)`,
          }}
          onMouseMove={handleMoveContainer}
          onTouchMove={handleMoveContainer}
        >
          {cells}
          {isDragging && currentSelection && (
            <DimensionPopup mouseX={mousePos.x} mouseY={mousePos.y} width={dragWidth} height={dragHeight} />
          )}
          {pendingZone && (
            <NameZonePopover pendingZone={pendingZone} cellSize={CELL_SIZE} onSave={savePendingZone} onCancel={cancelPendingZone} />
          )}
          {/* Overlay for Editing/Deleting */}
          {zones.map((zone) => {
            const left = zone.start.x * CELL_SIZE;
            const top = zone.start.y * CELL_SIZE;
            const width = (zone.end.x - zone.start.x + 1) * CELL_SIZE;
            const height = (zone.end.y - zone.start.y + 1) * CELL_SIZE;
            return (
              <div key={zone.id} style={{ position: 'absolute', left, top, width, height }} className="group">
                <div className="opacity-0 group-hover:opacity-100 absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-200">
                  <button
                    onClick={() => {
                      setEditingZoneId(zone.id);
                      setPendingZone({ start: zone.start, end: zone.end });
                    }}
                    className="bg-blue-500 text-white px-2 py-1 text-xs rounded mr-1"
                  >
                    Edit
                  </button>
                  <button onClick={() => removeZone(zone.id)} className="bg-red-500 text-white px-2 py-1 text-xs rounded">
                    Delete
                  </button>
                </div>
                {editingZoneId === zone.id && (
                  <NameZonePopover
                    pendingZone={{ start: zone.start, end: zone.end }}
                    cellSize={CELL_SIZE}
                    defaultName={zone.name}
                    onSave={(newName) => saveEditedZone(zone.id, newName)}
                    onCancel={cancelEditing}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
