import { Note } from "./notes";

export function fuzzyMatch(query: string, text: string): boolean {
  if (!query) return true;
  
  query = query.toLowerCase();
  text = text.toLowerCase();
  
  let i = 0;
  let j = 0;
  
  while (i < query.length && j < text.length) {
    if (query[i] === text[j]) {
      i++;
    }
    j++;
  }
  
  return i === query.length;
}

export function searchNotes(query: string, notes: Note[]): Note[] {
  if (!query.trim()) return notes;
  
  const q = query.trim();
  return notes.filter((note) => {
    return fuzzyMatch(q, note.title) || fuzzyMatch(q, note.content);
  });
}