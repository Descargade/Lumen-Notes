import { Download, Upload, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Note } from "@/lib/notes";
import { useRef } from "react";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  notes: Note[];
  onDeleteAll: () => void;
  onImport: (notes: Note[]) => void;
}

export function SettingsPanel({ isOpen, onClose, notes, onDeleteAll, onImport }: SettingsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(notes));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "notes_lumen.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          onImport(imported);
          onClose();
        }
      } catch (error) {
        console.error("Error parsing imported file", error);
        alert("El archivo no es válido.");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDeleteAll = () => {
    if (window.confirm("¿Estás seguro de que quieres borrar todas las notas? Esta acción no se puede deshacer.")) {
      onDeleteAll();
      onClose();
    }
  };

  const totalChars = notes.reduce((acc, note) => acc + (note.content?.length || 0), 0);

  return (
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background border border-border p-4 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{notes.length}</p>
                    <p className="text-xs text-muted-foreground">Notas totales</p>
                  </div>
                  <div className="bg-background border border-border p-4 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{totalChars}</p>
                    <p className="text-xs text-muted-foreground">Caracteres</p>
                  </div>
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
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImport}
                    accept=".json"
                    className="hidden"
                  />
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
  );
}