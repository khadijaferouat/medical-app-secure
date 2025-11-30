import { Link } from '@inertiajs/react';
import FlashMessages from '@/Components/FlashMessages';

export default function DoctorLayout({ children, user }) {
    return (
        <div className="min-h-screen bg-gray-100">
                        <FlashMessages />

            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-xl">Dr</span>
                            </div>
                            <div className="ml-3">
                                <h1 className="text-xl font-bold text-gray-900">
                                    {user?.name || 'Dr. Médecin'}
                                </h1>
                                <p className="text-sm text-gray-500">
                                    {user?.specialty || 'Spécialité'}
                                </p>
                            </div>
                        </div>
                        
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                        >
                            Déconnexion
                        </Link>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-white shadow-md min-h-screen">
                    <nav className="mt-5 px-2">
                        <Link
                            href="/doctor/dashboard"
                            className="group flex items-center px-3 py-2 text-base font-medium rounded-md text-gray-900 hover:bg-blue-50 mb-1"
                        >
                            📊 Dashboard
                        </Link>

                        <Link
                            href="/doctor/patients"
                            className="group flex items-center px-3 py-2 text-base font-medium rounded-md text-gray-900 hover:bg-blue-50 mb-1"
                        >
                            👥 Mes Patients
                        </Link>

                        <Link
                            href="/doctor/appointments"
                            className="group flex items-center px-3 py-2 text-base font-medium rounded-md text-gray-900 hover:bg-blue-50 mb-1"
                        >
                            📅 Rendez-vous
                        </Link>

                        <Link
                            href="/doctor/activity"
                            className="group flex items-center px-3 py-2 text-base font-medium rounded-md text-gray-900 hover:bg-blue-50 mb-1"
                        >
                            📈 Mon Activité
                        </Link>

                        <Link
                            href="/doctor/profile"
                            className="group flex items-center px-3 py-2 text-base font-medium rounded-md text-gray-900 hover:bg-blue-50"
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