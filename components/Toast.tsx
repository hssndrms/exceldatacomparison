import React from 'react';

export interface ToastData {
    id: string;
    message: string;
    type: 'error' | 'info';
}

interface ToastProps {
    toasts: ToastData[];
}

const Toast: React.FC<ToastProps> = ({ toasts }) => {
    if (toasts.length === 0) {
        return null;
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'error':
                return <i className="fa-solid fa-circle-exclamation text-yellow-500"></i>;
            case 'info':
                return <i className="fa-solid fa-circle-info text-blue-500"></i>;
            default:
                return null;
        }
    };

    return (
        <div className="fixed top-5 right-5 z-50 space-y-3 w-full max-w-sm">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className="bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
                >
                    <div className="p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 text-xl">
                                {getIcon(toast.type)}
                            </div>
                            <div className="ml-3 w-0 flex-1 pt-0.5">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    Uyarı
                                </p>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    {toast.message}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Toast;
