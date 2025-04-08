'use client';;
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useScreenSize } from '@/utils/common';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

const CELLS_PER_FOOT = 2; // each foot equals 2 cells (0.5ft increments)

function isInSelectionRange(x, y, start, end) {
  return x >= start.x && x <= end.x && y >= start.y && y <= end.y;
}

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

  let cellClass = 'border z-[9999] border-slate-200 w-full h-full cursor-pointer transition-colors duration-200 ease-in-out';
  if (isInProgress) {
    cellClass += ' bg-yellow-200';
  } else if (cellValue) {
    const zoneColor = zoneMap[cellValue] || 'bg-blue-200';
    cellClass += ` ${zoneColor}`;
  } else {
    cellClass += ' bg-white hover:bg-gray-50 ';
  }

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
        e.preventDefault();
        handleMove();
      }}
      onTouchEnd={handleEnd}
    />
  );
}

function DimensionPopup({ mouseX, mouseY, width, height }) {
  if (width <= 0 || height <= 0) return null;
  return (
    <div
      style={{ position: 'absolute', top: mouseY - 30, left: mouseX + 6 }}
      className="z-[9999] bg-popover w-fit text-nowrap text-popover-foreground border border-slate-200 p-2 rounded-md shadow-md pointer-events-none text-sm"
    >
      <p className='font-bold'>New Cabinet Dimensions</p>
      <p>{width / CELLS_PER_FOOT}ft × {height / CELLS_PER_FOOT}ft</p>

    </div>
  );
}



function NameZonePopover({ pendingZone, cellSize, defaultName = '', onSave, onCancel }) {
  const [zoneName, setZoneName] = useState(defaultName);
  const { start, end } = pendingZone;
  const zoneWidth = (end.x - start.x + 1) * cellSize;
  const zoneHeight = (end.y - start.y + 1) * cellSize;
  const left = start.x * cellSize + zoneWidth / 2;
  const top = start.y * cellSize - 10; // show slightly above

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        transform: 'translate(-50%, -100%)',
        zIndex: 9999,
      }}
      className="bg-white border border-gray-300 p-4 rounded shadow-md w-48"
    >
      <div className="mb-2 text-sm font-semibold">{defaultName ? 'Edit Section Name:' : 'Name this cabinet section:'}</div>
      <Input
        type="text"
        value={zoneName}
        onChange={(e) => setZoneName(e.target.value)}
        className="border p-1 rounded w-full mb-2"
        placeholder="Section name..."
      />
      <div className="flex justify-end space-x-2">
        <Button size='xs' variant='outline' onClick={onCancel} className="text-sm">
          Cancel
        </Button>
        <Button size='xs' onClick={() => onSave(zoneName)} className=" text-sm">
          Save
        </Button>
      </div>
    </div>
  );
}

interface GridProps {
  wall: any
  roomHeight?: number;
  onCabinetSave?: (cabinet: any) => void;
}

export default function Grid({ wall, roomHeight, onCabinetSave }: GridProps) {
  const wallLength = wall?.length || 10; 
 
  const [roomWidthFeet, setRoomWidthFeet] = useState(wallLength || 10);
  const [roomHeightFeet, setRoomHeightFeet] = useState(roomHeight || 10);
  const [upperHelper, setUpperHelper] = useState(false);
  const [baseHelper, setBaseHelper] = useState(false);
  const [wallHelper, setWallHelper] = useState(false);
  const screenSize = useScreenSize()
  const isMobile = screenSize.width < 768
  const isLandscape = screenSize.width > screenSize.height
  const roomCols = roomWidthFeet * CELLS_PER_FOOT;
  const roomRows = roomHeightFeet * CELLS_PER_FOOT;
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>(null);

  const maxGridWidth = 600;
  const maxGridHeight = 300;
  const cellSizeByWidth = Math.floor(maxGridWidth / roomCols);
  const cellSizeByHeight = Math.floor(maxGridHeight / roomRows);
  const dynamicCellSize = Math.min(cellSizeByWidth, cellSizeByHeight);
  const CELL_SIZE = dynamicCellSize < 8 ? 8 : dynamicCellSize;

  const createEmptyGrid = (cols, rows) => Array.from({ length: cols }, () => Array(rows).fill(false));
  const [grid, setGrid] = useState(createEmptyGrid(roomCols, roomRows));
  const [zones, setZones] = useState([]);

  const [selected, setSelected] = useState(null);
  const [lastSelected, setLastSelected] = useState(null);
  const [currentSelection, setCurrentSelection] = useState(null);
  const [pendingZone, setPendingZone] = useState(null);
  const [editingZoneId, setEditingZoneId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [nextZoneId, setNextZoneId] = useState(1);
  const gridRef = useRef(null);
  useEffect(() => {
    if (!wall || !wall.cabinets) return;
  
    const newGrid = createEmptyGrid(roomCols, roomRows);
    const newZones = [];
    let nextId = 1;
  
    wall.cabinets.forEach((cabinet, index) => {
      const startX = cabinet.grid_start_x;
      const startY = cabinet.grid_start_y;
      const endX = cabinet.grid_end_x;
      const endY = cabinet.grid_end_y;
  
      for (let i = startX; i <= endX; i++) {
        for (let j = startY; j <= endY; j++) {
          newGrid[i][j] = nextId;
        }
      }
      console.log(newZones)
      newZones.push({
        start: { x: startX, y: startY },
        end: { x: endX, y: endY },
        name: cabinet.name || 'New Cabinet',
        color: blueShades[index] + '/70',
      });
  
      nextId++;
    });
  
    setGrid(newGrid);
    setZones(newZones);
    setNextZoneId(nextId);
  }, [wall, roomCols, roomRows]);
  






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
  const getCellFromTouch = (touch) => {
    const rect = gridRef.current?.getBoundingClientRect();
    if (!rect) return null;

    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;

    const x = Math.floor(offsetX / CELL_SIZE);
    const y = Math.floor(offsetY / CELL_SIZE);

    if (x < 0 || x >= roomCols || y < 0 || y >= roomRows) return null;

    return { x, y };
  };

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

    let x, y;

    if (e.touches) {
      const touch = e.touches[0];
      const coords = getCellFromTouch(touch);
      if (!coords) return;
      x = coords.x;
      y = coords.y;
      setMousePos({ x: touch.clientX, y: touch.clientY });
    } else {
      const rect = gridRef.current?.getBoundingClientRect();
      x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
      y = Math.floor((e.clientY - rect.top) / CELL_SIZE);
      setMousePos({ x: e.clientX, y: e.clientY });
    }
    if (x < 0 || x > roomCols || y < 0 || y >= roomRows) return;
    setHoveredCell({ x, y });
    if (!isDragging) return;
    handleMove(x, y);
  };


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
    const newZone = { start, end, name, color };
    const updatedZones = [...zones, newZone].sort((a, b) =>
      a.start.y !== b.start.y ? a.start.y - b.start.y : a.start.x - b.start.x
    );
    setZones(updatedZones);
  
    onCabinetSave(newZone);
    resetGrid();
    setNextZoneId(nextZoneId + 1);
    setPendingZone(null);
  };

  const cancelPendingZone = () => {
    setPendingZone(null);
  };

  const saveEditedZone = (zoneId, newName) => {

    const updatedZones = zones.map((zone) => (zone.id === zoneId ? { ...zone, name: newName } : zone));
    console.log(updatedZones);
    setZones(updatedZones);
    onCabinetSave(updatedZones.find((zone) => zone.id === zoneId));
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
      <div style={{ width: CELL_SIZE, height: CELL_SIZE }}>
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
      </div>
    );
  });

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
  const invertedY = roomRows - hoveredCell?.y;

  const baseCabinetHeightFt = 3;   // e.g. countertop level (3ft)
  const upperCabinetHeightFt = roomHeight - 4.5;
  const wallCabinetHeightFt = roomHeight    // e.g. top of wall cabinets (6ft)

  // Calculate the Y positions (in px) for helper lines relative to the grid container.
  const baseHelperY = (roomRows - baseCabinetHeightFt * CELLS_PER_FOOT) * CELL_SIZE;
  const upperHelperY = (roomRows - upperCabinetHeightFt * CELLS_PER_FOOT) * CELL_SIZE;
  const wallHelperY = (roomRows - wallCabinetHeightFt * CELLS_PER_FOOT) * CELL_SIZE;

  return (
    <div className="flex flex-nowrap mx-auto items-center space-y-4 p-4 overflow-visible">

      <div
        className="text-nowrap text-center  flex flex-col w-fit justify-center items-center text-[10px] font-semibold text-muted-foreground gap-0 p-2"
      >
        <ChevronUp className="text-muted cursor-pointer my-auto text-xl h-4" />
        <span className="h-4" >{roomHeight}ft</span>
        <span className="h-4">Wall</span>
        <span className="h-4">Height</span>
        <ChevronDown className="text-muted cursor-pointer my-auto text-xl h-4 mt-3" />




      </div>
      <div className="flex flex-col relative max-w-[800px] overflow-visible">

        <div
          ref={gridRef}
          key={`grid-${roomCols}-${roomRows}`}
          className="grid border border-gray-300 relative "
          style={{
            gridTemplateColumns: `repeat(${roomCols}, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(${roomRows}, ${CELL_SIZE}px)`,
          }}
          onMouseMove={handleMoveContainer}
          onTouchMove={handleMoveContainer}
        >
          {cells}
          {isDragging && currentSelection && (
            <DimensionPopup
              mouseX={mousePos.x - gridRef.current?.getBoundingClientRect()?.left ?? 0}
              mouseY={mousePos.y - gridRef.current?.getBoundingClientRect()?.top ?? 0}
              width={dragWidth}
              height={dragHeight}
            />
          )}
          {hoveredCell && !isDragging && !pendingZone && editingZoneId === null && (
            <>

              <div
                className="absolute bg-blue-500/30 pointer-events-none"
                style={{
                  left: hoveredCell.x * CELL_SIZE,
                  top: 0,
                  width: 1,
                  height: roomRows * CELL_SIZE,
                }}
              />


              <div
                className="absolute bg-blue-500/30 pointer-events-none"
                style={{
                  top: hoveredCell.y * CELL_SIZE,
                  left: 0,
                  height: 1,
                  width: roomCols * CELL_SIZE,
                }}
              />
              <div
                style={{ position: 'absolute', top: -18, left: hoveredCell.x * CELL_SIZE, }}
                className="z-[9999] bg-white rounded-xl  pointer-events-none text-xs"
              >

                {hoveredCell.x / CELLS_PER_FOOT}ft
              </div>
              <div
                style={{
                  position: 'absolute',
                  top: hoveredCell.y * CELL_SIZE,
                  right: -35,
                }}
                className="z-[9999] bg-white rounded-xl pointer-events-none text-xs"
              >
                {(invertedY / CELLS_PER_FOOT).toFixed(1)}ft
              </div>
            </>
          )}
          {baseHelper && (
            <div
              style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                width: roomCols * CELL_SIZE,
                height: baseCabinetHeightFt * (CELLS_PER_FOOT * CELL_SIZE),

                pointerEvents: 'none',
              }}
              className='bg-blue-400/15 border-blue-400 border-t-4 z-20'
            />
          )}
          {upperHelper && (
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: roomCols * CELL_SIZE,
                height: upperCabinetHeightFt * (CELLS_PER_FOOT * CELL_SIZE),
                pointerEvents: 'none',
              }}
              className='bg-purple-400/15 border-purple-400 border-b-4'
            />
          )}
          {wallHelper && (
            <div
              style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                width: roomCols * CELL_SIZE,
                height: roomHeight * CELLS_PER_FOOT * CELL_SIZE,

                pointerEvents: 'none',
              }}
              className='bg-green-500/15  border-green-800 border-t-4 border-b-4'
            />
          )}
          {pendingZone && (
            <NameZonePopover pendingZone={pendingZone} cellSize={CELL_SIZE} onSave={savePendingZone} onCancel={cancelPendingZone} />
          )}
        {zones.map((zone) => {
  const left = zone.start.x * CELL_SIZE;
  const top = zone.start.y * CELL_SIZE;
  const width = (zone.end.x - zone.start.x + 1) * CELL_SIZE;
  const height = (zone.end.y - zone.start.y + 1) * CELL_SIZE;
console.log('Zone', zone)
  const zoneColor = zone.color;
  return (
    <div
      key={zone.id}
      style={{ position: 'absolute', left, top, width, height }}
      className={`group ${zone.color} rounded-md border border-slate-300 transition-all`}
    >
   
      <div className="absolute top-1 left-1 text-xs font-semibold bg-white/80 px-1 rounded-sm pointer-events-none">
        {zone.name}
      </div>

    
      <div className="opacity-0 group-hover:opacity-100 absolute inset-0 flex flex-col gap-2 items-center justify-center bg-black/50 transition-opacity duration-200 cursor-pointer">
        <button
          onClick={() => {
            setEditingZoneId(zone.id);
            setPendingZone({ start: zone.start, end: zone.end });
          }}
          className="bg-blue-500 text-white px-2 py-1 text-xs rounded"
        >
          Edit
        </button>
        <button
          onClick={() => removeZone(zone.id)}
          className="bg-red-500 text-white px-2 py-1 text-xs rounded"
        >
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


        <div
          className="text-nowrap text-center mx-auto flex  w-fit justify-center items-center text-[10px] font-semibold text-muted-foreground gap-0"
        >
          <ChevronLeft className="text-muted cursor-pointer my-auto text-2xl" /> <span>{wallLength}ft Floor Width</span> <ChevronRight className="text-muted cursor-pointer my-auto text-2xl" />


        </div>
        <div className='flex flex-col gap-2 text-xs'>
          <h3 className='font-bold'>Height Helpers</h3>
          <div className='flex flex-row gap-2'>
            <Checkbox
              checked={upperHelper}
              onCheckedChange={(e) => setUpperHelper(upperHelper ? false : true)}
              className='my-auto h-4 w-4 rounded-sm data-[state=checked]:bg-purple-400'
            /> Upper Cabinet
          </div>
          <div className='flex flex-row gap-2'>
            <Checkbox
              checked={baseHelper}
              onCheckedChange={(e) => setBaseHelper(baseHelper ? false : true)}
              className='my-auto h-4 w-4 rounded-sm data-[state=checked]:bg-blue-400'
            /> Base Cabinet
          </div>
          <div className='flex flex-row gap-2'>
            <Checkbox
              checked={wallHelper}
              onCheckedChange={(e) => setWallHelper(wallHelper ? false : true)}
              className='my-auto h-4 w-4 rounded-sm data-[state=checked]:bg-green-500'
            /> Wall Cabinet
          </div>
        </div>



        {isMobile && !isLandscape && (
          <p className='text-xs text-center max-w-24 mx-auto'>Rotate Screen if cannot select screen</p>
        )}
      </div>



    </div>
  );
}
