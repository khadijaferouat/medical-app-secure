import { Link } from '@inertiajs/react';
import FlashMessages from '@/Components/FlashMessages';

export default function PatientLayout({ children, user }) {
    return (
        <div className="min-h-screen bg-gray-50">
                        <FlashMessages />

            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-xl">
                                    {user?.name?.charAt(0) || 'P'}
                                </span>
                            </div>
                            <h1 className="ml-3 text-xl font-bold text-gray-900">
                                {user?.name || 'Patient'}
                            </h1>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 text-sm">
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                                    🔒 AES-256
                                </span>
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                    🛡️ HTTPS
                                </span>
                                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                                    ✅ RGPD
                                </span>
                            </div>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                            >
                                Déconnexion
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-white shadow-md min-h-screen">
                    <nav className="mt-5 px-2">
                        <Link
                            href="/patient/dashboard"
                            className="group flex items-center px-3 py-2 text-base font-medium rounded-md text-gray-900 hover:bg-green-50 mb-1"
                        >
                            🏠 Dashboard
                        </Link>

                        <Link
                            href="/patient/medical-record"
                            className="group flex items-center px-3 py-2 text-base font-medium rounded-md text-gray-900 hover:bg-green-50 mb-1"
                        >
                            📋 Mon Dossier
                        </Link>

                        <Link
                            href="/patient/prescriptions"
                            className="group flex items-center px-3 py-2 text-base font-medium rounded-md text-gray-900 hover:bg-green-50 mb-1"
                        >
                            💊 Mes Ordonnances
                        </Link>

                        <Link
                            href="/patient/appointments"
                            className="group flex items-center px-3 py-2 text-base font-medium rounded-md text-gray-900 hover:bg-green-50 mb-1"
                        >
                            📅 Rendez-vous
                        </Link>

                        <Link
                            href="/patient/access-management"
                            className="group flex items-center px-3 py-2 text-base font-medium rounded-md text-gray-900 hover:bg-green-50 mb-1"
                        >
                            🔐 Gérer Accès
                        </Link>

                        <Link
                            href="/patient/access-history"
                            className="group flex items-center px-3 py-2 text-base font-medium rounded-md text-gray-900 hover:bg-green-50 mb-1"
                        >
                            📜 Historique Accès
                        </Link>

                        <Link
                            href="/patient/doctors"
                            className="group flex items-center px-3 py-2 text-base font-medium rounded-md text-gray-900 hover:bg-green-50 mb-1"
                        >
                            👨‍⚕️ Mes Médecins
                        </Link>

                        <Link
                            href="/patient/profile"
                            className="group flex items-center px-3 py-2 text-base font-medium rounded-md text-gray-900 hover:bg-green-50"
                        >
                            ⚙️ Mon Profil
                        </Link>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}