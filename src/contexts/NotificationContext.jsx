// components/NotificationContext.jsx
import {
    createContext,
    useContext,
    useState,
    useCallback,
    useRef,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

const NotificationContext = createContext();
export const useNotification = () => useContext(NotificationContext);

let idCounter = 0;

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const timeouts = useRef({});

    const removeNotification = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        clearTimeout(timeouts.current[id]);
        delete timeouts.current[id];
    };

    const pushNotification = useCallback((type, description, value = null) => {
        const id = ++idCounter;
        const titles = {
            success: "Success!",
            error: "Error!",
            info: "Info",
            score: "Score Up!",
            item: "Item Collected!",
        };

        const newNotification = {
            id,
            type,
            title: titles[type] || "Notification",
            description,
            value,
        };

        setNotifications((prev) => [...prev, newNotification]);

        // Auto-remove after 3 seconds
        timeouts.current[id] = setTimeout(() => {
            removeNotification(id);
        }, 3000);
    }, []);

    return (
        <NotificationContext.Provider value={{ pushNotification }}>
            {children}
            {createPortal(
                <div className="fixed top-4 inset-x-0 flex flex-col items-center z-[9999] space-y-2 pointer-events-none">
                    <AnimatePresence initial={false}>
                        {notifications.map((notif) => (
                            <motion.div
                                key={notif.id}
                                initial={{ y: -50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -50, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className={`relative bg-neutral-800 text-white border-l-4 px-4 py-3 rounded shadow-lg w-full max-w-xs pointer-events-auto cursor-pointer
                  ${
                                    notif.type === "success"
                                        ? "border-green-500"
                                        : notif.type === "error"
                                            ? "border-red-500"
                                            : notif.type === "score"
                                                ? "border-yellow-400"
                                                : notif.type === "item"
                                                    ? "border-blue-400"
                                                    : "border-gray-400"
                                }
                `}
                                onClick={() => removeNotification(notif.id)}
                            >
                                <div className="font-bold text-base">{notif.title}</div>
                                <div className="text-sm">{notif.description}</div>
                                {notif.value !== null && (
                                    <div className="text-yellow-300 font-semibold text-sm mt-1">
                                        +{notif.value}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>,
                document.body
            )}
        </NotificationContext.Provider>
    );
};
