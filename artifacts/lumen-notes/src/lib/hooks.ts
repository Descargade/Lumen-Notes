import { useState, useEffect, useCallback } from "react";
import { Note, loadNotes, saveNotes, createNote } from "./notes";
import { searchNotes } from "./search";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  // Initial load
  useEffect(() => {
    setNotes(loadNotes());
  }, []);

  // Save on change
  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  const handleCreateNote = useCallback(() => {
    const newNote = createNote();
    setNotes((prev) => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
  }, []);

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, ...updates, updatedAt: Date.now() } : note
      )
    );
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
    if (activeNoteId === id) {
      setActiveNoteId(null);
    }
  }, [activeNoteId]);

  const togglePin = useCallback((id: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, pinned: !note.pinned } : note
      )
    );
  }, []);

  const deleteAllNotes = useCallback(() => {
    setNotes([]);
    setActiveNoteId(null);
  }, []);

  const importNotes = useCallback((importedNotes: Note[]) => {
    setNotes((prev) => {
      const existingIds = new Set(prev.map(n => n.id));
      const newNotes = importedNotes.filter(n => !existingIds.has(n.id));
      return [...newNotes, ...prev];
    });
  }, []);

  const filteredNotes = searchNotes(searchQuery, notes).sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.updatedAt - a.updatedAt;
  });

  const activeNote = notes.find((n) => n.id === activeNoteId) || null;

  return {
    notes,
    filteredNotes,
    searchQuery,
    setSearchQuery,
    activeNoteId,
    setActiveNoteId,
    activeNote,
    handleCreateNote,
    updateNote,
    deleteNote,
    togglePin,
    deleteAllNotes,
    importNotes,
  };
}