import { useState, useEffect } from "react";
import { useNotes } from "@/lib/hooks";
import { NoteList } from "@/components/NoteList";
import { NoteEditor } from "@/components/NoteEditor";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
import { SettingsPanel } from "@/components/Settings";
import { InstallPrompt } from "@/components/InstallPrompt";
import { PinModal } from "@/components/PinModal";

export default function Home() {
  const {
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
    togglePrivate,
    deleteAllNotes,
    importNotes,
    allTags,
    selectedTag,
    setSelectedTag,
    isUnlocked,
    pendingNoteId,
    setPendingNoteId,
    tryOpenNote,
    unlockWithPin,
    lock,
    hasPrivateNotes,
    onPinEnabled,
    onPinDisabled,
  } = useNotes();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const inInput = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;

      if (e.ctrlKey || e.metaKey) {
        if (e.key === "n") {
          e.preventDefault();
          handleCreateNote();
        } else if (e.key === "f") {
          e.preventDefault();
          const searchInput = document.querySelector('input[data-testid="input-search"]') as HTMLInputElement;
          if (searchInput) searchInput.focus();
        } else if (e.key === ",") {
          e.preventDefault();
          setIsSettingsOpen(true);
        } else if (e.key === "l") {
          e.preventDefault();
          lock();
        }
      }

      if ((e.key === "Delete" || e.key === "Backspace") && activeNoteId && !inInput) {
        e.preventDefault();
        deleteNote(activeNoteId);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [activeNoteId, handleCreateNote, deleteNote, lock]);

  const showEditor = !!activeNoteId && isMobile;
  const showList = !showEditor;

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background text-foreground">
      {showList && (
        <div className="w-full md:w-80 lg:w-96 flex-shrink-0 h-full">
          <NoteList
            notes={filteredNotes}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeNoteId={activeNoteId}
            tryOpenNote={tryOpenNote}
            onCreateNote={handleCreateNote}
            onDeleteNote={deleteNote}
            onTogglePin={togglePin}
            onOpenSettings={() => setIsSettingsOpen(true)}
            isMobile={isMobile}
            allTags={allTags}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            isUnlocked={isUnlocked}
            hasPrivateNotes={hasPrivateNotes}
            onLock={lock}
          />
        </div>
      )}

      {(!isMobile || showEditor) && (
        <div className="flex-1 h-full overflow-hidden relative">
          <NoteEditor
            note={activeNote}
            updateNote={updateNote}
            onBack={() => setActiveNoteId(null)}
            isMobile={isMobile}
            allTags={allTags}
            onTogglePrivate={togglePrivate}
            isUnlocked={isUnlocked}
          />
        </div>
      )}

      <div className="fixed bottom-4 left-4 z-50">
        <InstallPrompt />
      </div>

      <KeyboardShortcuts />

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        notes={notes}
        onDeleteAll={deleteAllNotes}
        onImport={importNotes}
        onPinEnabled={onPinEnabled}
        onPinDisabled={onPinDisabled}
      />

      <PinModal
        isOpen={!!pendingNoteId}
        title="Nota privada — introduce tu PIN"
        onVerify={unlockWithPin}
        onSuccess={() => {}}
        onCancel={() => setPendingNoteId(null)}
      />
    </div>
  );
}
