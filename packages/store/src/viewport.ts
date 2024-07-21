import { create } from 'zustand';

interface IViewportState {
  zoom: number;
}

interface IViewportAction {
  setZoom: (zoom: number) => void;
}

export const useViewportStore = create<IViewportState & IViewportAction>(set => ({
  zoom: 15,
  setZoom: (zoom: number) => set(state => ({ ...state, zoom })),
}));
