import { createContext, useCallback, useContext, useRef, useState } from "react";

const SnackbarContext = createContext(null);

const AUTO_DISMISS_MS = 3000;

export function SnackbarProvider({ children }) {
  const [snackbar, setSnackbar] = useState(null);
  const timeoutRef = useRef(null);

  const showSnackbar = useCallback((message, type = "success") => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setSnackbar({ message, type });
    timeoutRef.current = setTimeout(() => setSnackbar(null), AUTO_DISMISS_MS);
  }, []);

  return (
    <SnackbarContext.Provider value={showSnackbar}>
      {children}
      {snackbar && (
        <div
          role="status"
          aria-live="polite"
          className={`snackbar ${snackbar.type === "error" ? "snackbar-error" : ""}`}
        >
          {snackbar.message}
        </div>
      )}
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const showSnackbar = useContext(SnackbarContext);
  if (!showSnackbar) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return showSnackbar;
}
