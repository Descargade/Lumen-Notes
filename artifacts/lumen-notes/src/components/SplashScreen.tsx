import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SplashScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        >
          <div className="relative">
            <h1 className="text-6xl font-bold tracking-tighter text-primary drop-shadow-[0_0_15px_rgba(245,166,35,0.5)]">
              LN
            </h1>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}