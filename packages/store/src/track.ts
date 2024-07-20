import { ITrack } from '@app/types';
import { create } from 'zustand';

interface ITrackState {
  list: ITrack[];
}

interface ITrackAction {
  addTrack: (track: ITrack) => void;
  removeTrack: (id: string) => void;
  updateTrack: (id: string, track: Partial<ITrack>) => void;
  pushElementId: (trackId: string, elementId: string) => void;
}

export const useTrackStore = create<ITrackState & ITrackAction>(set => ({
  list: [],
  addTrack: track =>
    set(state => ({
      ...state,
      list: [...state.list, track],
    })),
  removeTrack: id =>
    set(state => ({
      ...state,
      list: state.list.filter(track => track.id !== id),
    })),
  updateTrack: (id, track) =>
    set(state => ({
      ...state,
      list: state.list.map(item => (item.id === id ? { ...item, ...track } : item)),
    })),
  pushElementId: (trackId, elementId) =>
    set(state => ({
      ...state,
      list: state.list.map(item =>
        item.id === trackId ? { ...item, elementIds: [...item.elementIds, elementId] } : item
      ),
    })),
}));
