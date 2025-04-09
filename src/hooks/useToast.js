import { useState } from "react";

export function useToast() {
    const [toast, setToast] = useState(null);

    const showToast = (message, duration = 3000) => {
        setToast(message);
        setTimeout(() => setToast(null), duration);
    };

    const ToastComponent = () =>
        toast ? (
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded shadow z-50 text-sm">
                {toast}
            </div>
        ) : null;

    return { showToast, ToastComponent };
}
