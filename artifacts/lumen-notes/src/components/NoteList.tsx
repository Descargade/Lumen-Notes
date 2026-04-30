import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Search, Plus, Pin, Trash2, Settings, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Note } from "@/lib/notes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NoteListProps {
  notes: Note[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeNoteId: string | null;
  setActiveNoteId: (id: string | null) => void;
  onCreateNote: () => void;
  onDeleteNote: (id: string) => void;
  onTogglePin: (id: string) => void;
  onOpenSettings: () => void;
  isMobile: boolean;
}

export function NoteList({
  notes,
  searchQuery,
  setSearchQuery,
  activeNoteId,
  setActiveNoteId,
  onCreateNote,
  onDeleteNote,
  onTogglePin,
  onOpenSettings,
  isMobile,
}: NoteListProps) {
  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-border">
      <div className="p-4 flex flex-col gap-4 border-b border-border bg-sidebar/50 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center font-bold">
              LN
            </div>
            <span className="font-semibold tracking-tight">Lumen</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={onOpenSettings} className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <Settings className="h-4 w-4" />
            </Button>
            <Button size="icon" onClick={onCreateNote} className="h-8 w-8 bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar notas..."
            className="pl-9 bg-background/50 border-border focus-visible:ring-primary h-9"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {notes.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-muted-foreground">
            <FileText className="h-12 w-12 mb-4 opacity-20" />
            <p className="text-sm font-medium mb-1">No hay notas</p>
            <p className="text-xs mb-4">Crea una nueva nota para empezar</p>
            <Button onClick={onCreateNote} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nueva nota
            </Button>
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-1">
              {notes.map((note) => (
                <motion.div
                  key={note.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    onClick={() => setActiveNoteId(note.id)}
                    className={`
                      group flex flex-col gap-1 p-3 rounded-lg cursor-pointer transition-colors relative overflow-hidden
                      ${activeNoteId === note.id ? "bg-accent/10 text-accent" : "hover:bg-accent/5"}
                    `}
                  >
                    {activeNoteId === note.id && (
                      <motion.div 
                        layoutId="active-indicator" 
                        className="absolute left-0 top-2 bottom-2 w-1 bg-accent rounded-r-full" 
                      />
                    )}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-sm truncate flex-1">
                        {note.title || "Sin título"}
                      </h3>
                      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onTogglePin(note.id);
                          }}
                          className="p-1 hover:text-primary transition-colors"
                        >
                          <Pin className={`h-3 w-3 ${note.pinned ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteNote(note.id);
                          }}
                          className="p-1 hover:text-destructive transition-colors text-muted-foreground"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {note.content || "Sin contenido"}
                    </p>
                    <span className="text-[10px] text-muted-foreground/60 mt-1">
                      {formatDistanceToNow(note.updatedAt, { addSuffix: true, locale: es })}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}