import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react";
import { Note } from "@/lib/notes";
import { Button } from "@/components/ui/button";

interface NoteEditorProps {
  note: Note | null;
  updateNote: (id: string, data: Partial<Note>) => void;
  onBack: () => void;
  isMobile: boolean;
}

export function NoteEditor({ note, updateNote, onBack, isMobile }: NoteEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setSaveStatus("idle");
    }
  }, [note?.id]); // Only run on id change to allow local edits

  const handleSave = useCallback(
    (newTitle: string, newContent: string) => {
      if (!note) return;
      setSaveStatus("saving");
      
      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Set new timeout for debounced save
      saveTimeoutRef.current = setTimeout(() => {
        updateNote(note.id, { title: newTitle, content: newContent });
        setSaveStatus("saved");
        
        // Reset status after a moment
        setTimeout(() => {
          setSaveStatus("idle");
        }, 2000);
      }, 300);
    },
    [note, updateNote]
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    handleSave(newTitle, content);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    handleSave(title, newContent);
  };

  if (!note) {
    return (
      <div className="hidden md:flex flex-col h-full items-center justify-center bg-background text-muted-foreground">
        <div className="w-16 h-16 rounded-full bg-accent/5 flex items-center justify-center mb-4">
          <div className="w-8 h-8 rounded bg-accent/20" />
        </div>
        <p>Selecciona una nota para editar</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background relative">
      <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-background/80 backdrop-blur z-10">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Sin título"
          className="flex-1 bg-transparent text-lg font-semibold outline-none placeholder:text-muted-foreground/50"
        />
        <div className="flex items-center gap-2 text-xs text-muted-foreground ml-4">
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
      <div className="flex-1 p-4 max-w-3xl w-full mx-auto">
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Escribe algo..."
          className="w-full h-full bg-transparent resize-none outline-none font-mono text-sm leading-relaxed placeholder:text-muted-foreground/30"
          spellCheck={false}
        />
      </div>
    </div>
  );
}