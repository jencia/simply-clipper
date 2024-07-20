import { create } from 'zustand';

interface IPlayerState {
  playing: boolean;
  currentTime: number;
}

interface IPlayerAction {
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setCurrentTime: (time: number) => void;
}

export const usePlayerStore = create<IPlayerState & IPlayerAction>(set => ({
  playing: false,
  currentTime: 0,
  play: () => set(state => ({ ...state, playing: true })),
  pause: () => set(state => ({ ...state, playing: false })),
  togglePlay: () => set(state => ({ ...state, playing: !state.playing })),
  setCurrentTime: time => set(state => ({ ...state, currentTime: time })),
}));
