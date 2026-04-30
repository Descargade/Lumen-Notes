import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, X, Delete } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PinModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
  onVerify: (pin: string) => boolean;
  title?: string;
}

const PAD = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];

export function PinModal({ isOpen, onSuccess, onCancel, onVerify, title = "Introduce tu PIN" }: PinModalProps) {
  const [digits, setDigits] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const shakeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setDigits([]);
      setError(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (digits.length === 4) {
      const pin = digits.join("");
      if (onVerify(pin)) {
        onSuccess();
        setDigits([]);
      } else {
        setError(true);
        if (shakeRef.current) clearTimeout(shakeRef.current);
        shakeRef.current = setTimeout(() => {
          setDigits([]);
          setError(false);
        }, 600);
      }
    }
  }, [digits, onVerify, onSuccess]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9" && digits.length < 4) {
        setDigits((d) => [...d, e.key]);
      } else if (e.key === "Backspace") {
        setDigits((d) => d.slice(0, -1));
      } else if (e.key === "Escape") {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, digits, onCancel]);

  const handlePad = (val: string) => {
    if (val === "del") {
      setDigits((d) => d.slice(0, -1));
    } else if (digits.length < 4) {
      setDigits((d) => [...d, val]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(13,13,20,0.92)", backdropFilter: "blur(12px)" }}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.34, 1.2, 0.64, 1] }}
            className="w-full max-w-xs bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Lock className="h-4 w-4 text-primary" />
                </div>
                <span className="font-semibold text-sm text-foreground">{title}</span>
              </div>
              <button onClick={onCancel} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-5 pb-4">
              <motion.div
                animate={error ? { x: [-8, 8, -6, 6, -4, 0] } : { x: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center justify-center gap-3 py-4"
              >
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full border-2 transition-all duration-150 ${
                      digits.length > i
                        ? error
                          ? "bg-destructive border-destructive scale-110"
                          : "bg-primary border-primary scale-110"
                        : "border-muted-foreground/40 bg-transparent"
                    }`}
                  />
                ))}
              </motion.div>

              {error && (
                <p className="text-center text-xs text-destructive mb-2 -mt-2">PIN incorrecto</p>
              )}

              <div className="grid grid-cols-3 gap-2 mt-2">
                {PAD.map((val, i) => {
                  if (val === "") return <div key={i} />;
                  return (
                    <button
                      key={i}
                      onClick={() => handlePad(val)}
                      disabled={val !== "del" && digits.length >= 4}
                      className={`
                        h-14 rounded-xl flex items-center justify-center text-lg font-semibold
                        transition-all duration-100 active:scale-95
                        ${val === "del"
                          ? "bg-muted/50 text-muted-foreground hover:bg-muted"
                          : "bg-background hover:bg-accent/10 active:bg-primary/10 text-foreground border border-border hover:border-primary/30"
                        }
                        ${digits.length >= 4 && val !== "del" ? "opacity-40 cursor-not-allowed" : ""}
                      `}
                      data-testid={`pin-button-${val}`}
                    >
                      {val === "del" ? <Delete className="h-4 w-4" /> : val}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


interface PinSetupModalProps {
  isOpen: boolean;
  onSave: (pin: string) => void;
  onCancel: () => void;
  isChanging?: boolean;
  onVerifyOld?: (pin: string) => boolean;
}

export function PinSetupModal({ isOpen, onSave, onCancel, isChanging, onVerifyOld }: PinSetupModalProps) {
  const [step, setStep] = useState<"verify_old" | "enter" | "confirm">(
    isChanging ? "verify_old" : "enter"
  );
  const [first, setFirst] = useState("");
  const [digits, setDigits] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setStep(isChanging ? "verify_old" : "enter");
      setFirst("");
      setDigits([]);
      setError("");
    }
  }, [isOpen, isChanging]);

  useEffect(() => {
    if (digits.length !== 4) return;
    const pin = digits.join("");

    if (step === "verify_old") {
      if (onVerifyOld && onVerifyOld(pin)) {
        setStep("enter");
        setDigits([]);
        setError("");
      } else {
        setError("PIN incorrecto");
        setTimeout(() => { setDigits([]); setError(""); }, 600);
      }
    } else if (step === "enter") {
      setFirst(pin);
      setStep("confirm");
      setDigits([]);
    } else if (step === "confirm") {
      if (pin === first) {
        onSave(pin);
        setDigits([]);
      } else {
        setError("Los PINs no coinciden");
        setTimeout(() => { setStep("enter"); setFirst(""); setDigits([]); setError(""); }, 700);
      }
    }
  }, [digits, step, first, onSave, onVerifyOld]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9" && digits.length < 4) {
        setDigits((d) => [...d, e.key]);
      } else if (e.key === "Backspace") {
        setDigits((d) => d.slice(0, -1));
      } else if (e.key === "Escape") {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, digits, onCancel]);

  const handlePad = (val: string) => {
    if (val === "del") {
      setDigits((d) => d.slice(0, -1));
    } else if (digits.length < 4) {
      setDigits((d) => [...d, val]);
    }
  };

  const stepTitle = step === "verify_old"
    ? "PIN actual"
    : step === "enter"
    ? "Nuevo PIN (4 dígitos)"
    : "Confirmar PIN";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(13,13,20,0.92)", backdropFilter: "blur(12px)" }}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.34, 1.2, 0.64, 1] }}
            className="w-full max-w-xs bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Lock className="h-4 w-4 text-primary" />
                </div>
                <span className="font-semibold text-sm text-foreground">{stepTitle}</span>
              </div>
              <button onClick={onCancel} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-5 pb-5">
              <motion.div
                animate={error ? { x: [-8, 8, -6, 6, -4, 0] } : { x: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center justify-center gap-3 py-4"
              >
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full border-2 transition-all duration-150 ${
                      digits.length > i
                        ? error
                          ? "bg-destructive border-destructive"
                          : "bg-primary border-primary scale-110"
                        : "border-muted-foreground/40"
                    }`}
                  />
                ))}
              </motion.div>
              {error && <p className="text-center text-xs text-destructive -mt-2 mb-2">{error}</p>}

              <div className="grid grid-cols-3 gap-2 mt-2">
                {PAD.map((val, i) => {
                  if (val === "") return <div key={i} />;
                  return (
                    <button
                      key={i}
                      onClick={() => handlePad(val)}
                      disabled={val !== "del" && digits.length >= 4}
                      className={`
                        h-14 rounded-xl flex items-center justify-center text-lg font-semibold
                        transition-all duration-100 active:scale-95
                        ${val === "del"
                          ? "bg-muted/50 text-muted-foreground hover:bg-muted"
                          : "bg-background hover:bg-accent/10 text-foreground border border-border hover:border-primary/30"
                        }
                        ${digits.length >= 4 && val !== "del" ? "opacity-40 cursor-not-allowed" : ""}
                      `}
                    >
                      {val === "del" ? <Delete className="h-4 w-4" /> : val}
                    </button>
                  );
                })}
              </div>

              <Button variant="ghost" size="sm" onClick={onCancel} className="w-full mt-3 text-muted-foreground">
                Cancelar
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
