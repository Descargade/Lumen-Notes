import { useState, useEffect, useCallback, useMemo } from "react";
import { Note, loadNotes, saveNotes, createNote } from "./notes";
import { searchNotes } from "./search";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    setNotes(loadNotes());
  }, []);

  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  const handleCreateNote = useCallback(() => {
    const initialTags = selectedTag ? [selectedTag] : [];
    const newNote = createNote({ tags: initialTags });
    setNotes((prev) => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
  }, [selectedTag]);

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

  const allTags = useMemo(() => {
    const tagCount = new Map<string, number>();
    for (const note of notes) {
      for (const tag of note.tags ?? []) {
        if (tag.trim()) {
          tagCount.set(tag, (tagCount.get(tag) ?? 0) + 1);
        }
      }
    }
    return Array.from(tagCount.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([tag, count]) => ({ tag, count }));
  }, [notes]);

  const filteredNotes = useMemo(() => {
    const bySearch = searchNotes(searchQuery, notes);
    const byTag = selectedTag
      ? bySearch.filter(n => n.tags?.includes(selectedTag))
      : bySearch;
    return byTag.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.updatedAt - a.updatedAt;
    });
  }, [notes, searchQuery, selectedTag]);

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
    allTags,
    selectedTag,
    setSelectedTag,
  };
}
