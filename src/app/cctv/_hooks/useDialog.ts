"use client";
import { useState } from "react";
import { DialogState } from "../_types";

export function useDialog() {
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [toast, setToast]   = useState<string | null>(null);

  const showAlert   = (message: string) => setDialog({ type: "alert", message });
  const showConfirm = (message: string, onConfirm: () => void) =>
    setDialog({ type: "confirm", message, onConfirm });
  const showToast   = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };
  const closeDialog = () => setDialog(null);

  return { dialog, toast, showAlert, showConfirm, showToast, closeDialog };
}
