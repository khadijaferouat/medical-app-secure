import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function FlashMessages() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    if (!visible || (!flash?.success && !flash?.error)) {
        return null;
    }

    return (
        <div className="fixed top-4 right-4 z-50 max-w-md">
            {flash.success && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded shadow-lg">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-green-800">{flash.success}</p>
                        </div>
                        <button onClick={() => setVisible(false)} className="ml-auto">
                            <span className="text-green-500 text-xl">×</span>
                        </button>
                    </div>
                </div>
            )}

            {flash.error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-lg">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-800">{flash.error}</p>
                        </div>
                        <button onClick={() => setVisible(false)} className="ml-auto">
                            <span className="text-red-500 text-xl">×</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}