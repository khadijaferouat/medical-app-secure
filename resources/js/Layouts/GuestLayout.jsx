import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 px-6">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-3xl font-bold">🏥</span>
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Medical App Secure
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Gestion sécurisée de dossiers médicaux
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-6 shadow-xl rounded-lg">
                    {children}
                </div>
            </div>

            <div className="mt-8 text-center">
                <p className="text-xs text-gray-500">
                    🔒 Chiffrement AES-256 | 🛡️ 2FA | ✅ RGPD
                </p>
            </div>
        </div>
    );
}