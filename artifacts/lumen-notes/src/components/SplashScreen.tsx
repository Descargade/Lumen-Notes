import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SplashScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ backgroundColor: "#0d0d14" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative flex flex-col items-center gap-5"
          >
            <div className="relative">
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 0px 0px rgba(245, 166, 35, 0)",
                    "0 0 40px 16px rgba(245, 166, 35, 0.18)",
                    "0 0 60px 24px rgba(245, 166, 35, 0.10)",
                    "0 0 40px 16px rgba(245, 166, 35, 0.18)",
                  ],
                }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-2xl"
              />

              <motion.div
                animate={{
                  filter: [
                    "drop-shadow(0 0 8px rgba(245,166,35,0.4))",
                    "drop-shadow(0 0 22px rgba(245,166,35,0.8))",
                    "drop-shadow(0 0 8px rgba(245,166,35,0.4))",
                  ],
                }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  width="72"
                  height="72"
                  className="rounded-2xl"
                >
                  <defs>
                    <radialGradient id="splash-glow" cx="38%" cy="30%" r="55%">
                      <stop offset="0%" stopColor="#f5a623" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#0d0d14" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="splash-mark" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ffc14d" />
                      <stop offset="100%" stopColor="#e08800" />
                    </linearGradient>
                  </defs>
                  <rect width="512" height="512" rx="110" fill="#0d0d14" />
                  <rect width="512" height="512" rx="110" fill="url(#splash-glow)" />
                  <rect x="148" y="124" width="78" height="284" rx="14" fill="url(#splash-mark)" />
                  <rect x="148" y="332" width="216" height="76" rx="14" fill="url(#splash-mark)" />
                  <circle cx="376" cy="148" r="22" fill="#f5a623" opacity="0.15" />
                  <circle cx="376" cy="148" r="12" fill="#f5a623" opacity="0.5" />
                  <circle cx="376" cy="148" r="6" fill="#ffd280" />
                </svg>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4, ease: "easeOut" }}
              className="flex flex-col items-center gap-1"
            >
              <span
                className="text-base font-semibold tracking-wide"
                style={{ color: "#e8dcc8" }}
              >
                Lumen Notes
              </span>
              <motion.div
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                className="flex items-center gap-1"
              >
                {[0, 0.15, 0.3].map((delay, i) => (
                  <motion.span
                    key={i}
                    animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1, 0.8] }}
                    transition={{ duration: 1, repeat: Infinity, delay, ease: "easeInOut" }}
                    className="block w-1 h-1 rounded-full"
                    style={{ backgroundColor: "#f5a623" }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
