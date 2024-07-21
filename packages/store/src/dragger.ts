import { IElement } from '@app/types';
import { create } from 'zustand';

interface IDragData {
  element: IElement;
  x: number;
  y: number;
  delay: number;
  from: 'material' | 'segment';
}

interface IDraggerState {
  dragging: boolean;
  dragData: IDragData | null;
  hoverTrackIdx: number;
  isEnterTimeline: boolean;
}

interface IDraggerAction {
  setDragging: (dragging: boolean) => void;
  setDragData: (dragData: IDragData | null) => void;
  setHoverTrackIdx: (hoverTrackIdx: number) => void;
  setIsEnterTimeline: (isEnterTimeline: boolean) => void;
}

export const useDraggerStore = create<IDraggerState & IDraggerAction>(set => ({
  dragging: false,
  dragData: null,
  hoverTrackIdx: -1,
  isEnterTimeline: false,
  setDragging: dragging => set(state => ({ ...state, dragging })),
  setDragData: dragData => set(state => ({ ...state, dragData })),
  setHoverTrackIdx: hoverTrackIdx => set(state => ({ ...state, hoverTrackIdx })),
  setIsEnterTimeline: isEnterTimeline => set(state => ({ ...state, isEnterTimeline })),
}));
