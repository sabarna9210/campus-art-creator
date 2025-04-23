import { create } from "zustand";

type Element = { id: string; type: "rect"; x: number; y: number; width: number; height: number };

interface EditorState {
  elements: Element[];
  addRect: () => void;
  updateElement: (id: string, attrs: Partial<Element>) => void;
}

export const useEditorStore = create<EditorState>(set => ({
  elements: [],
  addRect: () => set(state => ({
    elements: [
      ...state.elements,
      { id: crypto.randomUUID(), type: "rect", x: 50, y: 50, width: 100, height: 80 },
    ],
  })),
  updateElement: (id, attrs) => set(state => ({
    elements: state.elements.map(el =>
      el.id === id ? { ...el, ...attrs } : el
    ),
  })),
}));
