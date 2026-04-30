import { useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Search, Plus, Pin, Trash2, Settings, FileText, Tag, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Note } from "@/lib/notes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TagInfo {
  tag: string;
  count: number;
}

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
  allTags: TagInfo[];
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
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
  allTags,
  selectedTag,
  setSelectedTag,
}: NoteListProps) {
  const tagScrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-border">
      <div className="p-4 flex flex-col gap-3 border-b border-border bg-sidebar/50 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center font-bold text-sm">
              LN
            </div>
            <span className="font-semibold tracking-tight">Lumen</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onOpenSettings}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              data-testid="button-settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              onClick={onCreateNote}
              className="h-8 w-8 bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="button-create-note"
            >
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
            data-testid="input-search"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {allTags.length > 0 && (
          <div
            ref={tagScrollRef}
            className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none"
            style={{ scrollbarWidth: "none" }}
          >
            <button
              onClick={() => setSelectedTag(null)}
              className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all border ${
                selectedTag === null
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background/50 text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
              }`}
              data-testid="tag-filter-all"
            >
              <Tag className="h-3 w-3" />
              Todas
            </button>
            {allTags.map(({ tag, count }) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all border whitespace-nowrap ${
                  selectedTag === tag
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background/50 text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                }`}
                data-testid={`tag-filter-${tag}`}
              >
                {tag}
                <span className={`text-[10px] opacity-70`}>{count}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {selectedTag && (
          <div className="flex items-center gap-2 px-2 py-1.5 mb-1">
            <span className="text-xs text-muted-foreground">Etiqueta:</span>
            <span className="text-xs font-medium text-primary">{selectedTag}</span>
            <button
              onClick={() => setSelectedTag(null)}
              className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        {notes.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-muted-foreground">
            <FileText className="h-12 w-12 mb-4 opacity-20" />
            <p className="text-sm font-medium mb-1">
              {selectedTag ? `Sin notas en "${selectedTag}"` : "No hay notas"}
            </p>
            <p className="text-xs mb-4">
              {selectedTag ? "Prueba con otra etiqueta" : "Crea una nueva nota para empezar"}
            </p>
            {!selectedTag && (
              <Button onClick={onCreateNote} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nueva nota
              </Button>
            )}
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-1">
              {notes.map((note) => (
                <motion.div
                  key={note.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                >
                  <div
                    onClick={() => setActiveNoteId(note.id)}
                    className={`
                      group flex flex-col gap-1 p-3 rounded-lg cursor-pointer transition-colors relative overflow-hidden
                      ${activeNoteId === note.id ? "bg-accent/10 text-accent" : "hover:bg-accent/5"}
                    `}
                    data-testid={`note-item-${note.id}`}
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
                          data-testid={`button-pin-${note.id}`}
                        >
                          <Pin
                            className={`h-3 w-3 ${note.pinned ? "fill-primary text-primary" : "text-muted-foreground"}`}
                          />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteNote(note.id);
                          }}
                          className="p-1 hover:text-destructive transition-colors text-muted-foreground"
                          data-testid={`button-delete-${note.id}`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {note.content || "Sin contenido"}
                    </p>
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {note.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTag(tag === selectedTag ? null : tag);
                            }}
                            className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                              tag === selectedTag
                                ? "bg-primary/20 text-primary"
                                : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                        {note.tags.length > 3 && (
                          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] text-muted-foreground">
                            +{note.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                    <span className="text-[10px] text-muted-foreground/60 mt-0.5">
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
