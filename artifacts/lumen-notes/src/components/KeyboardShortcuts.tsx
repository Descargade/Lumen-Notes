import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if inside input/textarea unless it's Escape
      if (
        (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) &&
        e.key !== "Escape"
      ) {
        return;
      }

      if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }

      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const shortcuts = [
    { keys: ["Ctrl", "N"], desc: "Nueva nota" },
    { keys: ["Ctrl", "F"], desc: "Buscar" },
    { keys: ["Ctrl", ","], desc: "Configuración" },
    { keys: ["Ctrl", "L"], desc: "Bloquear notas privadas" },
    { keys: ["Del", "Bksp"], desc: "Eliminar nota (en lista)" },
    { keys: ["Esc"], desc: "Cerrar / Cancelar" },
    { keys: ["?"], desc: "Atajos de teclado" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
              <h2 className="text-lg font-semibold text-foreground">Atajos de teclado</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 space-y-3">
              {shortcuts.map((sc, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{sc.desc}</span>
                  <div className="flex items-center gap-1">
                    {sc.keys.map((key, j) => (
                      <kbd
                        key={j}
                        className="px-2 py-1 text-xs font-mono bg-background border border-border rounded shadow-sm text-foreground"
                      >
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}