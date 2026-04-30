import { useState, useEffect, useCallback, useRef, KeyboardEvent } from "react";
import { ArrowLeft, CheckCircle2, Circle, Tag, X, Plus, Lock, LockOpen } from "lucide-react";
import { Note } from "@/lib/notes";
import { Button } from "@/components/ui/button";
import { isPinEnabled } from "@/lib/pin";

interface NoteEditorProps {
  note: Note | null;
  updateNote: (id: string, data: Partial<Note>) => void;
  onBack: () => void;
  isMobile: boolean;
  allTags: { tag: string; count: number }[];
  onTogglePrivate: (id: string) => void;
  isUnlocked: boolean;
}

export function NoteEditor({ note, updateNote, onBack, isMobile, allTags, onTogglePrivate, isUnlocked }: NoteEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [tagInputVisible, setTagInputVisible] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const pinActive = isPinEnabled();

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags ?? []);
      setSaveStatus("idle");
    }
  }, [note?.id]);

  const debouncedSave = useCallback(
    (newTitle: string, newContent: string, newTags: string[]) => {
      if (!note) return;
      setSaveStatus("saving");
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        updateNote(note.id, { title: newTitle, content: newContent, tags: newTags });
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      }, 300);
    },
    [note, updateNote]
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setTitle(v);
    debouncedSave(v, content, tags);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    setContent(v);
    debouncedSave(title, v, tags);
  };

  const addTag = useCallback(
    (tag: string) => {
      const trimmed = tag.trim().toLowerCase();
      if (!trimmed || tags.includes(trimmed)) { setTagInput(""); return; }
      const newTags = [...tags, trimmed];
      setTags(newTags);
      setTagInput("");
      setShowTagSuggestions(false);
      debouncedSave(title, content, newTags);
    },
    [tags, title, content, debouncedSave]
  );

  const removeTag = useCallback(
    (tag: string) => {
      const newTags = tags.filter((t) => t !== tag);
      setTags(newTags);
      debouncedSave(title, content, newTags);
    },
    [tags, title, content, debouncedSave]
  );

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(tagInput); }
    else if (e.key === "Escape") { setTagInput(""); setTagInputVisible(false); setShowTagSuggestions(false); }
    else if (e.key === "Backspace" && tagInput === "" && tags.length > 0) { removeTag(tags[tags.length - 1]); }
  };

  const suggestions = tagInput.trim()
    ? allTags.map((t) => t.tag).filter((t) => t.includes(tagInput.toLowerCase()) && !tags.includes(t)).slice(0, 5)
    : [];

  if (!note) {
    return (
      <div className="hidden md:flex flex-col h-full items-center justify-center bg-background text-muted-foreground">
        <div className="w-16 h-16 rounded-full bg-accent/5 flex items-center justify-center mb-4">
          <div className="w-8 h-8 rounded bg-accent/20" />
        </div>
        <p className="text-sm">Selecciona una nota para editar</p>
      </div>
    );
  }

  const isPrivate = !!note.private;
  const canTogglePrivate = !pinActive || isUnlocked || !isPrivate;

  return (
    <div className="flex flex-col h-full bg-background relative">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-background/80 backdrop-blur z-10">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-2 flex-shrink-0" data-testid="button-back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Sin título"
          className="flex-1 bg-transparent text-lg font-semibold outline-none placeholder:text-muted-foreground/50 min-w-0"
          data-testid="input-note-title"
        />
        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
          {pinActive && canTogglePrivate && (
            <button
              onClick={() => onTogglePrivate(note.id)}
              title={isPrivate ? "Quitar privacidad" : "Marcar como privada"}
              className={`p-1.5 rounded-lg transition-colors ${
                isPrivate
                  ? "text-primary bg-primary/10 hover:bg-primary/20"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/10"
              }`}
              data-testid="button-toggle-private"
            >
              {isPrivate ? <Lock className="h-4 w-4" /> : <LockOpen className="h-4 w-4" />}
            </button>
          )}
          <div className="text-xs text-muted-foreground">
            {saveStatus === "saving" && (
              <span className="flex items-center gap-1">
                <Circle className="h-3 w-3 animate-pulse" />
                Guardando...
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="flex items-center gap-1 text-primary">
                <CheckCircle2 className="h-3 w-3" />
                Guardado
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 py-2 border-b border-border/50 flex items-center flex-wrap gap-1.5 min-h-[40px]">
        <Tag className="h-3 w-3 text-muted-foreground flex-shrink-0" />
        {tags.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 group">
            {tag}
            <button onClick={() => removeTag(tag)} className="opacity-50 hover:opacity-100 transition-opacity" data-testid={`button-remove-tag-${tag}`}>
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}

        {tagInputVisible ? (
          <div className="relative">
            <input
              ref={tagInputRef}
              type="text"
              value={tagInput}
              onChange={(e) => { setTagInput(e.target.value); setShowTagSuggestions(true); }}
              onKeyDown={handleTagKeyDown}
              onBlur={() => { setTimeout(() => { if (tagInput.trim()) addTag(tagInput); setTagInputVisible(false); setShowTagSuggestions(false); }, 150); }}
              placeholder="Nueva etiqueta..."
              className="bg-transparent text-xs outline-none border-b border-primary/50 focus:border-primary placeholder:text-muted-foreground/40 w-32 pb-0.5"
              autoFocus
              data-testid="input-tag"
            />
            {showTagSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-20 min-w-[140px] overflow-hidden">
                {suggestions.map((s) => (
                  <button key={s} onMouseDown={(e) => { e.preventDefault(); addTag(s); }} className="w-full text-left px-3 py-1.5 text-xs hover:bg-accent/10 hover:text-primary transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => { setTagInputVisible(true); setTimeout(() => tagInputRef.current?.focus(), 0); }}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs text-muted-foreground/50 hover:text-muted-foreground border border-dashed border-muted/30 hover:border-muted/60 transition-colors"
            data-testid="button-add-tag"
          >
            <Plus className="h-3 w-3" />
            Etiqueta
          </button>
        )}
      </div>

      <div className="flex-1 p-4 max-w-3xl w-full mx-auto overflow-y-auto">
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Escribe algo..."
          className="w-full h-full bg-transparent resize-none outline-none font-mono text-sm leading-relaxed placeholder:text-muted-foreground/30"
          spellCheck={false}
          data-testid="textarea-note-content"
        />
      </div>
    </div>
  );
}
