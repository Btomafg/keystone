// components/CabinetGrid.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SawLoader from '@/components/ui/loader';
import { Cabinet, Room, Wall } from '@/constants/models/object.types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useScreenSize } from '@/utils/common';
import { AlertCircle, Check, Pencil, Trash2, X } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// ... (Keep interfaces: CabinetType, CabinetZone, GridProps) ...
interface CabinetType {
  id: number;
  name: string;
  min_height: number; // Assuming feet
  max_height: number | null; // Assuming feet
  min_width: number; // Assuming feet
  max_width: number | null; // Assuming feet
  base_y_lock: number; // Assuming feet from floor
  color: string;
  img_url?: string;
  active: boolean;
}

interface CabinetZone {
  id: string | number; // Use string for new zones
  name: string;
  type: number; // Keep original type name
  start: { x: number; y: number }; // Grid cell coords
  end: { x: number; y: number }; // Grid cell coords
  color: string;
  isSelected?: boolean;
  typeInfo: CabinetType;
  wall_id: number;
}

interface GridProps {
  cabinetTypes: CabinetType[];
  wall: Wall;
  room: Room;
  loading?: boolean;
  submitLoading?: boolean;
  cabinets: Cabinet[];
  onCabinetSave: (cabinet: CabinetZone) => void; // Fired on creation
  onCabinetUpdate: (cabinet: CabinetZone) => void; // Fired on move, resize, rename
  onCabinetDelete: (cabinetId: number) => void; // Fired on deletion
}

export default function CabinetGrid({
  cabinetTypes,
  wall,
  room,
  loading,
  submitLoading,
  cabinets,
  onCabinetSave,
  onCabinetUpdate,
  onCabinetDelete,
}: GridProps) {
  const screenSize = useScreenSize();
  const isMobile = screenSize.width < 768;

  const CELLS_PER_FOOT = 2;
  const calcCellSize = (wallLength: number) => {
    if (isMobile) {
      return wallLength < 10 ? 24 : wallLength < 25 ? 20 : 8; // Adjust cell size based on wall length
    } else {
      return wallLength < 10 ? 22 : wallLength < 25 ? 18 : 15; // Adjust cell size based on wall length
    }
  };

  const CELL_SIZE = calcCellSize(wall?.length || 10); // Default to 10 feet if wall is not provided

  const feetToCells = (feet: number): number => Math.round(feet * CELLS_PER_FOOT);
  const cellsToFeet = (cells: number): number => cells / CELLS_PER_FOOT;
  const formatFeet = (feet: number): string => {
    const totalInches = Math.round(feet * 12);
    const ft = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    return `${ft}' ${inches}"`; // Always show inches for clarity
  };
  const formatDim = (cells: number): string => {
    const feet = cellsToFeet(cells);
    const totalInches = Math.round(feet * 12);
    const ft = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    if (ft > 0 && inches > 0) return `${ft}'${inches}"`;
    if (ft > 0) return `${ft}'`;
    return `${inches}"`;
  };
  const wallWidthFeet = wall?.length || 10;
  const roomHeightFeet = room?.height || 10;
  const { toast } = useToast();

  const roomCols = feetToCells(wallWidthFeet);
  const roomRows = feetToCells(roomHeightFeet);
  const gridRef = useRef<HTMLDivElement>(null);
  const [zones, setZones] = useState<CabinetZone[]>([]);
  const [nextZoneId, setNextZoneId] = useState(1);
  const [selectedZoneId, setSelectedZoneId] = useState<number | null>(null);
  const [interactionState, setInteractionState] = useState<'idle' | 'dragging' | 'resizing'>('idle');
  const [activeZoneId, setActiveZoneId] = useState<number | null>(null);
  const [resizeDirection, setResizeDirection] = useState<'horizontal' | 'vertical' | null>(null);
  const [interactionStartPos, setInteractionStartPos] = useState<{ x: number; y: number } | null>(null);
  const [elementStartPos, setElementStartPos] = useState<{ x: number; y: number } | null>(null);
  const [elementStartSize, setElementStartSize] = useState<{ widthCells: number; heightCells: number } | null>(null);
  const [editingNameZoneId, setEditingNameZoneId] = useState<number | null>(null);
  const [currentEditName, setCurrentEditName] = useState<string>('');
  const editInputRef = useRef<HTMLInputElement>(null);
  const [noRoomError, setNoRoomError] = useState(false);

  useEffect(() => {
    // Define a default fallback type in case lookup fails
    const fallbackType: CabinetType = {
      id: 0,
      name: 'Unknown',
      min_height: 1,
      max_height: null,
      min_width: 1,
      max_width: null,
      base_y_lock: 0,
      color: '#cccccc', //
      active: false,
    };

    if (cabinets && cabinets.length > 0 && cabinetTypes) {
      const initialZones = cabinets
        .map((cabinet) => {
          const id = cabinet?.id;
          const typeId = cabinet?.type;
          const name = cabinet?.name ?? 'Unnamed Cabinet';
          const startX = cabinet?.grid_start_x ?? 0;
          const startY = cabinet?.grid_start_y ?? 0;
          const endX = cabinet?.grid_end_x ?? startX;
          const endY = cabinet?.grid_end_y ?? startY;
          const wallId = cabinet?.wall_id;

          const foundTypeInfo = cabinetTypes.find((type) => type.id == typeId);
          const typeInfo = foundTypeInfo ?? fallbackType;
          const color = typeInfo.color;

          if (wallId === undefined || wallId === null) {
            console.warn(`Cabinet with ID ${id} is missing a wall_id. Skipping.`);
            return null;
          }

          if (typeId === undefined || typeId === null) {
            console.warn(`Cabinet with ID ${id} is missing a type ID. Using fallback type.`);
          } else if (!foundTypeInfo) {
            console.warn(`Cabinet type with ID ${typeId} (for Cabinet ${id}) not found in cabinetTypes. Using fallback type.`);
          }

          return {
            id: id,
            name: name,
            type: typeInfo.id,
            start: { x: startX, y: startY },
            end: { x: endX, y: endY },
            color: color,
            isSelected: false,
            typeInfo: typeInfo,
            wall_id: wallId,
          };
        })
        .filter((zone) => zone !== null) as CabinetZone[];

      setZones(initialZones);

      const maxId = initialZones.reduce((max, zone) => Math.max(max, zone.id), 0);
      setNextZoneId(maxId + 1);
    } else {
      setZones([]);
      setNextZoneId(1);
    }
  }, [cabinets, cabinetTypes]);

  const selectedZone = useMemo(() => {
    if (selectedZoneId === null) return null;
    return zones.find((z) => z.id === selectedZoneId) || null;
  }, [selectedZoneId, zones]);

  const checkCollision = useCallback(
    (targetZone: CabinetZone, ignoreId?: number): boolean => {
      return zones.some((z) => {
        if (z.id === ignoreId) return false;
        return (
          targetZone.start.x <= z.end.x && targetZone.end.x >= z.start.x && targetZone.start.y <= z.end.y && targetZone.end.y >= z.start.y
        );
      });
    },
    [zones],
  );

  const autoPlaceCabinet = (type: CabinetType) => {
    const widthCells = feetToCells(type.min_width);
    const heightCells = feetToCells(type.min_height);
    const startY = roomRows - feetToCells(type.base_y_lock) - heightCells;
    const endY = startY + heightCells - 1;
    if (startY < 0 || endY >= roomRows) {
      console.warn(`Cabinet "${type.name}" cannot be placed due to height constraints.`);
      return;
    }
    let placed = false;

    for (let x = 0; x <= roomCols - widthCells; x++) {
      const potentialZone: Omit<CabinetZone, 'id'> = {
        name: type.name,
        type: type.id,
        start: { x: x, y: startY },
        end: { x: x + widthCells - 1, y: endY },
        color: type.color,
        isSelected: true,
        typeInfo: type,
        wall_id: wall.id,
      };
      const tempCheckZone = { ...potentialZone, id: -1 };
      if (!checkCollision(tempCheckZone)) {
        const newZone: CabinetZone = { ...potentialZone, id: `new-${nextZoneId}` };
        setZones((prev) => [...prev.map((z) => ({ ...z, isSelected: false })), newZone]);
        setSelectedZoneId(newZone.id);
        setNextZoneId(nextZoneId + 1);

        placed = true;
        break;
      }
    }
    if (!placed) {
      setNoRoomError(true);
      console.warn(`No space found to place cabinet "${type.name}".`);
    }
  };
  useEffect(() => {
    if (noRoomError) {
      setTimeout(() => {
        setNoRoomError(false);
      }, 3000); // Show the toast for 3 seconds
    }
  }, [noRoomError]);
  // ... (Keep selection functions: deselectAll, selectZone) ...
  const deselectAll = useCallback(() => {
    if (interactionState !== 'idle') return;
    setSelectedZoneId(null);
    setEditingNameZoneId(null);
  }, [interactionState]);
  const selectZone = useCallback(
    (zoneId: number) => {
      if (interactionState !== 'idle') return;
      setZones((prev) => prev.map((z) => ({ ...z, isSelected: z.id === zoneId })));
      setSelectedZoneId(zoneId);
      setEditingNameZoneId(null);
    },
    [interactionState],
  );

  // ... (Keep handleDeleteSelected) ...
  const handleDeleteSelected = () => {
    if (selectedZoneId === null) return;
    setZones((prev) => prev.filter((z) => z.id !== selectedZoneId));
    onCabinetDelete(selectedZoneId);
    setSelectedZoneId(null);
  };

  // ... (Keep name editing functions) ...
  const startEditingName = () => {
    if (!selectedZone || interactionState !== 'idle') return;
    setEditingNameZoneId(selectedZone.id);
    setCurrentEditName(selectedZone.name);
  };
  useEffect(() => {
    if (editingNameZoneId !== null && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingNameZoneId]);
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentEditName(e.target.value);
  };
  const saveNameChange = () => {
    if (editingNameZoneId === null || !selectedZone) return;
    if (currentEditName.trim() === '') {
      setEditingNameZoneId(null);
      return;
    }
    const updatedZone = { ...selectedZone, name: currentEditName };
    setZones((prev) => prev.map((z) => (z.id === editingNameZoneId ? updatedZone : z)));
    onCabinetUpdate(updatedZone);
    setEditingNameZoneId(null);
  };
  const cancelNameChange = () => {
    setEditingNameZoneId(null);
    setCurrentEditName('');
  };
  const handleNameInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      saveNameChange();
    } else if (e.key === 'Escape') {
      cancelNameChange();
    }
  };

  // --- Unified Interaction Handling ---

  // ... (Keep getEventCoords helper) ...
  const getEventCoords = (e: MouseEvent | TouchEvent): { x: number; y: number } | null => {
    if ('touches' in e) {
      if (e.touches.length > 0) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    } else {
      return { x: e.clientX, y: e.clientY };
    }
    return null;
  };

  // ... (Keep handleInteractionStart - wrapped in useCallback) ...
  const handleInteractionStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent, zoneId: number) => {
      if (interactionState !== 'idle' || editingNameZoneId === zoneId) return;
      const zone = zones.find((z) => z.id === zoneId);
      if (!zone) return;
      if (selectedZoneId !== zoneId) {
        selectZone(zoneId);
      }
      const startCoords = getEventCoords(e.nativeEvent);
      if (!startCoords) return;
      const target = e.target as HTMLElement;
      const isResizeHandle = target.closest('[data-resize]');
      const resizeDir = isResizeHandle?.getAttribute('data-resize') as 'horizontal' | 'vertical' | null;
      setActiveZoneId(zoneId);
      setInteractionStartPos(startCoords);
      if (resizeDir) {
        setInteractionState('resizing');
        setResizeDirection(resizeDir);
        setElementStartSize({ widthCells: zone.end.x - zone.start.x + 1, heightCells: zone.end.y - zone.start.y + 1 });
        setElementStartPos(null);
      } else {
        setInteractionState('dragging');
        setResizeDirection(null);
        setElementStartPos({ x: zone.start.x, y: zone.start.y });
        setElementStartSize(null);
      }
    },
    [interactionState, editingNameZoneId, zones, selectedZoneId, selectZone],
  );

  // ... (Keep handleInteractionMove - wrapped in useCallback) ...
  const handleInteractionMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (interactionState === 'idle' || !activeZoneId || !interactionStartPos) return;
      const currentCoords = getEventCoords(e);
      if (!currentCoords) return;
      if ('touches' in e && (interactionState === 'dragging' || interactionState === 'resizing')) {
        e.preventDefault();
      }
      const deltaX = currentCoords.x - interactionStartPos.x;
      const deltaY = currentCoords.y - interactionStartPos.y;
      setZones((prevZones) =>
        prevZones.map((zone) => {
          if (zone.id !== activeZoneId) return zone;
          let newZone = { ...zone, start: { ...zone.start }, end: { ...zone.end } }; // Deep copy
          const typeInfo = zone.typeInfo;
          if (interactionState === 'resizing' && resizeDirection && elementStartSize) {
            if (resizeDirection === 'horizontal') {
              const newGridWidth = Math.round(deltaX / CELL_SIZE);
              let targetWidthCells = elementStartSize.widthCells + newGridWidth;
              const minWidthCells = feetToCells(typeInfo.min_width);
              const maxWidthCells = typeInfo.max_width ? feetToCells(typeInfo.max_width) : roomCols;
              targetWidthCells = Math.max(minWidthCells, targetWidthCells);
              targetWidthCells = Math.min(maxWidthCells, targetWidthCells);
              targetWidthCells = Math.min(targetWidthCells, roomCols - zone.start.x);
              newZone.end.x = zone.start.x + targetWidthCells - 1;
            } else if (resizeDirection === 'vertical') {
              const newGridHeight = Math.round(-deltaY / CELL_SIZE);
              let targetHeightCells = elementStartSize.heightCells + newGridHeight;
              const minHeightCells = feetToCells(typeInfo.min_height);
              const maxHeightCells = typeInfo.max_height ? feetToCells(typeInfo.max_height) : roomRows;
              targetHeightCells = Math.max(minHeightCells, targetHeightCells);
              targetHeightCells = Math.min(maxHeightCells, targetHeightCells);
              const newStartY = zone.end.y - targetHeightCells + 1;
              targetHeightCells = Math.min(targetHeightCells, zone.end.y + 1);
              newZone.start.y = zone.end.y - targetHeightCells + 1;
            }
            if (checkCollision(newZone, zone.id)) {
              return zone; /* Revert */
            }
          } else if (interactionState === 'dragging' && elementStartPos) {
            const gridDeltaX = Math.round(deltaX / CELL_SIZE);
            let newStartX = elementStartPos.x + gridDeltaX;
            const currentWidthCells = zone.end.x - zone.start.x;
            newStartX = Math.max(0, newStartX);
            newStartX = Math.min(roomCols - currentWidthCells - 1, newStartX);
            const newEndX = newStartX + currentWidthCells;
            const potentialZone = { ...newZone, start: { ...newZone.start, x: newStartX }, end: { ...newZone.end, x: newEndX } };
            if (checkCollision(potentialZone, zone.id)) {
              return zone; /* Revert */
            }
            newZone = potentialZone;
          }
          return newZone;
        }),
      );
    },
    [
      interactionState,
      activeZoneId,
      interactionStartPos,
      resizeDirection,
      elementStartPos,
      elementStartSize,
      roomCols,
      roomRows,
      checkCollision,
    ],
  );

  // ***** CHANGE 1: REMOVE useCallback from handleInteractionEnd *****
  const handleInteractionEnd = () => {
    // Add console logs for debugging
    console.log(`DEBUG: handleInteractionEnd called! State: ${interactionState}, Active Zone: ${activeZoneId}`);

    if (interactionState === 'idle' || !activeZoneId) {
      console.log('DEBUG: handleInteractionEnd - Aborting (already idle or no active zone)');
      return;
    }

    const finalZone = zones.find((z) => z.id === activeZoneId);

    // Check if an update actually occurred and notify parent
    if (finalZone) {
      if (interactionState === 'dragging' && elementStartPos) {
        if (finalZone.start.x !== elementStartPos.x || finalZone.start.y !== elementStartPos.y) {
          console.log('DEBUG: handleInteractionEnd - Dragging finished with changes');
          onCabinetUpdate(finalZone);
        }
      } else if (interactionState === 'resizing' && elementStartSize) {
        const finalWidth = finalZone.end.x - finalZone.start.x + 1;
        const finalHeight = finalZone.end.y - finalZone.start.y + 1;
        if (finalWidth !== elementStartSize.widthCells || finalHeight !== elementStartSize.heightCells) {
          console.log('DEBUG: handleInteractionEnd - Resizing finished with changes');
          onCabinetUpdate(finalZone);
        }
      }
    }

    console.log('DEBUG: handleInteractionEnd - Resetting state to idle...');
    // Reset interaction states - THIS IS THE CRITICAL PART
    setInteractionState('idle');
    setActiveZoneId(null);
    setResizeDirection(null);
    setInteractionStartPos(null);
    setElementStartPos(null);
    setElementStartSize(null);
  };
  // ***** NO useCallback wrapper above *****

  // Attach global listeners for move/end when interaction starts
  useEffect(() => {
    const moveHandler = (e: Event) => handleInteractionMove(e as unknown as MouseEvent | TouchEvent);
    // *** Use the function directly here ***
    const endHandler = (e: Event) => handleInteractionEnd();

    if (interactionState !== 'idle') {
      console.log('DEBUG: ATTACHING global listeners, state:', interactionState);
      window.addEventListener('mousemove', moveHandler, { passive: false });
      window.addEventListener('touchmove', moveHandler, { passive: false });
      window.addEventListener('mouseup', endHandler);
      window.addEventListener('touchend', endHandler);
      window.addEventListener('mouseleave', endHandler);
      window.addEventListener('touchcancel', endHandler);

      return () => {
        console.log('DEBUG: REMOVING global listeners, state:', interactionState);
        window.removeEventListener('mousemove', moveHandler);
        window.removeEventListener('touchmove', moveHandler);
        window.removeEventListener('mouseup', endHandler);
        window.removeEventListener('touchend', endHandler);
        window.removeEventListener('mouseleave', endHandler);
        window.removeEventListener('touchcancel', endHandler);
      };
    }
    // ***** CHANGE 2: Add handleInteractionEnd to dependency array *****
  }, [interactionState, handleInteractionMove, handleInteractionEnd]);

  // --- Render ---
  return (
    // ... (Keep the JSX structure exactly as you provided in the previous message) ...
    // Including the main div, left panel, right panel, grid, zone mapping, resize handles etc.
    <div className="flex flex-wrap space-x-4 gap-4 p-4 items-center">
      {/* Left Panel: Cabinet Types & Info */}
      <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-4 mb-auto">
        {/* Cabinet Type Selection */}
        <div className="flex flex-row flex-wrap justify-center gap-3">
          <h3 className="w-full text-sm font-medium text-center mb-1">Add Cabinet</h3>
          {loading ? (
            <SawLoader />
          ) : (
            cabinetTypes?.map((type) => (
              <div key={type.id} className="w-[70px] group" title={`Add ${type.name}`}>
                <div
                  onClick={() => autoPlaceCabinet(type)}
                  className={cn(
                    /* styles */ 'cursor-pointer overflow-hidden relative rounded-md shadow-md aspect-square mx-auto flex flex-col justify-end p-1.5 bg-cover bg-center hover:shadow-lg transition-shadow bg-slate-200',
                  )}
                  style={type.img_url ? { backgroundImage: `url(${type.img_url})` } : {}}
                >
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-200"></div>
                  <div className="relative z-10 text-content text-center">
                    <p className="font-medium text-[11px] text-white leading-tight line-clamp-2">{type.name}</p>
                  </div>
                </div>
              </div>
            ))
          )}
          {noRoomError && (
            <div className=" flex items-center justify-center text-xs p-2 bg-red-500 text-white rounded-md shadow-md mt-2">
              <AlertCircle size={12} className="mr-1" /> No space available for this cabinet.
            </div>
          )}
        </div>
        {/* Selected Cabinet Info Panel */}
        <div className="mt-4 border rounded-md p-3 bg-slate-50 min-h-[100px] w-[300px] mx-auto">
          <h3 className="text-sm font-medium text-center mb-2">Selected Cabinet</h3>
          {selectedZone ? (
            <div className="space-y-2 text-xs">
              {/* Name Display/Edit */}
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold flex-shrink-0">Name:</span>
                {editingNameZoneId === selectedZone.id ? (
                  <div className="flex items-center gap-1 flex-grow min-w-0">
                    {' '}
                    {/* Added min-w-0 */}
                    <Input
                      ref={editInputRef}
                      type="text"
                      value={currentEditName}
                      onChange={handleNameChange}
                      onKeyDown={handleNameInputKeyDown}
                      className="h-6 px-1 text-xs flex-grow"
                      maxLength={50}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-green-600 hover:bg-green-100 flex-shrink-0"
                      onClick={saveNameChange}
                      title="Save name"
                    >
                      {' '}
                      <Check size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-red-600 hover:bg-red-100 flex-shrink-0"
                      onClick={cancelNameChange}
                      title="Cancel edit"
                    >
                      {' '}
                      <X size={14} />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="flex items-center gap-1 cursor-pointer group min-w-0"
                    onClick={startEditingName}
                    title="Click to edit name"
                  >
                    {' '}
                    {/* Added min-w-0 */}
                    <span className="truncate font-medium">{selectedZone.name}</span>
                    <Pencil size={12} className="text-slate-500 group-hover:text-blue-600 flex-shrink-0" />
                  </div>
                )}
              </div>
              {/* Dimensions & Details */}
              <div>
                <span className="font-semibold">Type:</span> {selectedZone.typeInfo.name}
              </div>
              <div>
                <span className="font-semibold">Width:</span> {formatFeet(cellsToFeet(selectedZone.end.x - selectedZone.start.x + 1))}
              </div>
              <div>
                <span className="font-semibold">Height:</span> {formatFeet(cellsToFeet(selectedZone.end.y - selectedZone.start.y + 1))}
              </div>
              <div>
                <span className="font-semibold">Base Offset:</span> {formatFeet(selectedZone.typeInfo.base_y_lock)} from floor
              </div>
              {/* Constraints Info */}
              <div className="text-[10px] text-slate-500 pt-1 border-t mt-2">
                Min W: {formatDim(feetToCells(selectedZone.typeInfo.min_width))} {/* Use formatDim */}
                {selectedZone.typeInfo.max_width ? `, Max W: ${formatDim(feetToCells(selectedZone.typeInfo.max_width))}` : ''} <br />
                Min H: {formatDim(feetToCells(selectedZone.typeInfo.min_height))}
                {selectedZone.typeInfo.max_height ? `, Max H: ${formatDim(feetToCells(selectedZone.typeInfo.max_height))}` : ''}
              </div>
              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2 border-t mt-2">
                <Button variant="destructive" size="sm" onClick={handleDeleteSelected} title="Delete selected cabinet">
                  <Trash2 size={14} className="mr-1" /> Delete
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-center italic mt-4">Click on a cabinet in the grid to see details.</p>
          )}
        </div>
      </div>

      {/* Right Panel: Grid */}

      <div className="flex flex-col items-center flex-grow w-fit overflow-x-auto">
        <p className="text-xs text-slate-600 mb-2">Grid Scale: Each square = {formatDim(1)} (6 inches)</p>
        <div className="flex flex-row items-center gap-2">
          <div
            ref={gridRef}
            className="relative border border-slate-400 grid w-fit mx-auto bg-slate-50 shadow-inner overflow-hidden touch-none"
            style={{ gridTemplateColumns: `repeat(${roomCols}, ${CELL_SIZE}px)`, gridTemplateRows: `repeat(${roomRows}, ${CELL_SIZE}px)` }}
            onClick={deselectAll}
          >
            {[...Array(roomCols * roomRows)].map((_, index) => (
              <div key={index} className="border-[.5px] border-slate-200 w-full h-full" />
            ))}

            {/* Placed Cabinets (Zones) */}
            {zones.map((zone) => {
              const widthPx = (zone.end.x - zone.start.x + 1) * CELL_SIZE;
              const heightPx = (zone.end.y - zone.start.y + 1) * CELL_SIZE;
              const isSelected = selectedZoneId === zone.id;
              const isInteracting = activeZoneId === zone.id;
              const canResizeHorizontally = isSelected;
              const canResizeVertically =
                isSelected && (zone.typeInfo?.max_height === null || zone.typeInfo?.max_height > zone.typeInfo?.min_height);
              const widthDim = formatDim(zone.end.x - zone.start.x + 1);
              const heightDim = formatDim(zone.end.y - zone.start.y + 1);

              return (
                <div
                  key={zone.id}
                  style={{
                    position: 'absolute',
                    left: zone.start.x * CELL_SIZE,
                    top: zone.start.y * CELL_SIZE,
                    width: widthPx,
                    height: heightPx,
                    zIndex: isSelected || isInteracting ? 10 : 1,
                    backgroundColor: zone.color,
                  }}
                  className={cn(
                    'border border-slate-800/50 flex items-center justify-center text-center relative group transition-shadow duration-150',
                    'select-none',
                    isSelected && 'ring-2 ring-offset-1 ring-blue-600 shadow-lg',
                    interactionState === 'dragging' && isInteracting && 'cursor-grabbing shadow-xl opacity-90',
                    interactionState !== 'dragging' && 'cursor-grab',
                    interactionState === 'resizing' && isInteracting && 'opacity-90',
                    'pointer-events-auto',
                    'touch-none',
                  )}
                  onMouseDown={(e) => handleInteractionStart(e, zone.id)}
                  onTouchStart={(e) => handleInteractionStart(e, zone.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectZone(zone.id);
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    startEditingName();
                  }}
                >
                  {/* Context on Cabinet Block */}
                  <div className="flex flex-col items-center justify-center p-1 pointer-events-none">
                    <span className="font-medium text-white text-shadow-sm text-[10px] leading-tight truncate w-full px-1 line-clamp-1">
                      {zone.name}
                    </span>
                    <span className="text-[10px] text-white/80 text-shadow-sm leading-tight mt-0.5">
                      {widthDim}W x {heightDim}H
                    </span>
                  </div>

                  {/* Resize Handles (Larger Interaction Area) */}
                  {canResizeHorizontally && (
                    <div
                      data-resize="horizontal"
                      className="absolute -right-2 top-[-4px] bottom-[-4px] w-4 flex items-center justify-end cursor-ew-resize group/handle z-20"
                      title="Resize width"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        handleInteractionStart(e, zone.id);
                      }}
                      onTouchStart={(e) => {
                        e.stopPropagation();
                        handleInteractionStart(e, zone.id);
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="w-1.5 h-8 bg-blue-600 rounded-full opacity-50 group-hover/handle:opacity-100 pointer-events-none" />
                    </div>
                  )}
                  {canResizeVertically && (
                    <div
                      data-resize="vertical"
                      className="absolute -top-2 left-[-4px] right-[-4px] h-4 flex items-center justify-center cursor-ns-resize group/handle z-20"
                      title="Resize height"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        handleInteractionStart(e, zone.id);
                      }}
                      onTouchStart={(e) => {
                        e.stopPropagation();
                        handleInteractionStart(e, zone.id);
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="h-1.5 w-8 bg-blue-600 rounded-full opacity-50 group-hover/handle:opacity-100 pointer-events-none" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div
            className="text-xs text-slate-600 self-center px-1 [writing-mode:vertical-rl] transform rotate-180 whitespace-nowrap"
            title={`Room Height: ${formatFeet(roomHeightFeet)}`}
          >
            {' '}
            {/* Added Tooltip */}
            {formatFeet(roomHeightFeet)} H
          </div>
        </div>
        <div className="text-xs text-slate-600 mt-1" title={`Wall Width: ${formatFeet(wallWidthFeet)}`}>
          {' '}
          {/* Added Tooltip */}
          {formatFeet(wallWidthFeet)} W
        </div>
        {/* Instructions & Mobile warning */}
        <span className="text-xs text-slate-600 mt-3 text-center px-4">
          Click cabinet type to add. Click placed cabinet to select. Drag to move. Use handles to resize. Double-click name in panel to
          edit.
        </span>
        {isMobile && (
          <div className="text-xs text-orange-600 text-center mt-2 flex items-center gap-1 justify-center">
            {' '}
            <AlertCircle size={14} /> Rotate screen for better experience.{' '}
          </div>
        )}
        <Button className="ms-auto mt-4" onClick={() => onCabinetSave(zones)} loading={submitLoading} disabled={submitLoading}>
          Save and Continue
        </Button>
      </div>
    </div>
  );
}
