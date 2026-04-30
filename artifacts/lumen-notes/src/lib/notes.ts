export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  pinned: boolean;
  tags?: string[];
}

const STORAGE_KEY = "lumen_notes_v1";

export function loadNotes(): Note[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (e) {
    console.error("Error loading notes", e);
    return [];
  }
}

export function saveNotes(notes: Note[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (e) {
    console.error("Error saving notes", e);
  }
}

export function createNote(data?: Partial<Note>): Note {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    title: "",
    content: "",
    createdAt: now,
    updatedAt: now,
    pinned: false,
    ...data,
  };
}