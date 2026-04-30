import { useState } from "react";
import { Download, Upload, Trash2, X, Lock, LockOpen, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Note } from "@/lib/notes";
import { useRef } from "react";
import { isPinEnabled, savePin, removePin, verifyPin } from "@/lib/pin";
import { PinSetupModal, PinModal } from "@/components/PinModal";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  notes: Note[];
  onDeleteAll: () => void;
  onImport: (notes: Note[]) => void;
  onPinEnabled: () => void;
  onPinDisabled: () => void;
}

export function SettingsPanel({ isOpen, onClose, notes, onDeleteAll, onImport, onPinEnabled, onPinDisabled }: SettingsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pinEnabled, setPinEnabled] = useState(isPinEnabled);
  const [showSetup, setShowSetup] = useState(false);
  const [showDisable, setShowDisable] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(notes));
    const a = document.createElement("a");
    a.setAttribute("href", dataStr);
    a.setAttribute("download", "notes_lumen.json");
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) { onImport(imported); onClose(); }
      } catch { alert("El archivo no es válido."); }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDeleteAll = () => {
    if (window.confirm("¿Estás seguro de que quieres borrar todas las notas? Esta acción no se puede deshacer.")) {
      onDeleteAll();
      onClose();
    }
  };

  const handlePinSave = (pin: string) => {
    savePin(pin);
    setPinEnabled(true);
    setShowSetup(false);
    setIsChanging(false);
    onPinEnabled();
  };

  const handleDisableConfirmed = () => {
    removePin();
    setPinEnabled(false);
    setShowDisable(false);
    onPinDisabled();
  };

  const totalChars = notes.reduce((acc, note) => acc + (note.content?.length || 0), 0);
  const privateCount = notes.filter(n => n.private).length;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-card border-l border-border shadow-2xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
                <h2 className="text-lg font-semibold text-foreground">Configuración</h2>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto space-y-8">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Estadísticas</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-background border border-border p-3 rounded-lg">
                      <p className="text-xl font-bold text-primary">{notes.length}</p>
                      <p className="text-xs text-muted-foreground">Notas</p>
                    </div>
                    <div className="bg-background border border-border p-3 rounded-lg">
                      <p className="text-xl font-bold text-primary">{totalChars}</p>
                      <p className="text-xs text-muted-foreground">Caracteres</p>
                    </div>
                    <div className="bg-background border border-border p-3 rounded-lg">
                      <p className="text-xl font-bold text-primary">{privateCount}</p>
                      <p className="text-xs text-muted-foreground">Privadas</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Privacidad
                  </h3>
                  <div className="bg-background border border-border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">Bloqueo con PIN</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {pinEnabled ? "Las notas privadas requieren PIN" : "Desactivado"}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          if (pinEnabled) {
                            setShowDisable(true);
                          } else {
                            setIsChanging(false);
                            setShowSetup(true);
                          }
                        }}
                        className={`relative w-11 h-6 rounded-full transition-colors ${pinEnabled ? "bg-primary" : "bg-muted"}`}
                        data-testid="toggle-pin"
                      >
                        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${pinEnabled ? "left-6" : "left-1"}`} />
                      </button>
                    </div>
                    {pinEnabled && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => { setIsChanging(true); setShowSetup(true); }}
                      >
                        <Lock className="h-3 w-3 mr-2" />
                        Cambiar PIN
                      </Button>
                    )}
                    {!pinEnabled && (
                      <p className="text-xs text-muted-foreground/70">
                        Activa el PIN para proteger notas marcadas como privadas.
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Datos</h3>
                  <div className="space-y-2">
                    <Button onClick={handleExport} variant="outline" className="w-full justify-start">
                      <Download className="mr-2 h-4 w-4" />
                      Exportar notas
                    </Button>
                    <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full justify-start">
                      <Upload className="mr-2 h-4 w-4" />
                      Importar notas
                    </Button>
                    <input type="file" ref={fileInputRef} onChange={handleImport} accept=".json" className="hidden" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-destructive uppercase tracking-wider">Zona de peligro</h3>
                  <Button onClick={handleDeleteAll} variant="destructive" className="w-full justify-start">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Borrar todas las notas
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <PinSetupModal
        isOpen={showSetup}
        onSave={handlePinSave}
        onCancel={() => { setShowSetup(false); setIsChanging(false); }}
        isChanging={isChanging}
        onVerifyOld={isChanging ? verifyPin : undefined}
      />

      <PinModal
        isOpen={showDisable}
        title="Introduce tu PIN para desactivar"
        onVerify={verifyPin}
        onSuccess={handleDisableConfirmed}
        onCancel={() => setShowDisable(false)}
      />
    </>
  );
}
