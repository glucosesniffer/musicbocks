import { useEffect } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info" | "warning";
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const alertClass = `alert alert-${type}`;

  return (
    <div className="toast toast-top toast-end z-50">
      <div className={alertClass}>
        <span>{message}</span>
        <button className="btn btn-sm btn-circle" onClick={onClose}>✕</button>
      </div>
    </div>
  );
};

