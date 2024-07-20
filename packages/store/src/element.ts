import { IElement } from '@app/types';
import { create } from 'zustand';

interface IElementState {
  list: IElement[];
}

interface IElementAction {
  addElement: (element: IElement) => void;
  removeElement: (id: string) => void;
  updateElement: (id: string, element: Partial<IElement>) => void;
}

export const useElementStore = create<IElementState & IElementAction>(set => ({
  list: [],
  addElement: element =>
    set(state => ({
      ...state,
      list: [...state.list, element],
    })),
  removeElement: id =>
    set(state => ({
      ...state,
      list: state.list.filter(element => element.id !== id),
    })),
  updateElement: (id, element) =>
    set(state => ({
      ...state,
      list: state.list.map(item => (item.id === id ? { ...item, ...element } : item)),
    })),
}));
