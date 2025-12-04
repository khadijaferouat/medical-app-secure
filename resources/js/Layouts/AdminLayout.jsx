import { Link } from '@inertiajs/react';
import FlashMessages from '@/Components/FlashMessages';

export default function AdminLayout({ children, user }) {
    return (
        <div className="min-h-screen bg-gray-100">
            <FlashMessages />
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-xl">A</span>
                            </div>
                            <h1 className="ml-3 text-2xl font-bold text-gray-900">
                                Admin Dashboard
                            </h1>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-700">
                                {user?.name || 'Administrateur'}
                            </span>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                            >
                                Déconnexion
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-gray-800 min-h-screen">
                    <nav className="mt-5 px-2">
                        <Link
                            href="/admin/dashboard"
                            className="group flex items-center px-3 py-2 text-base font-medium rounded-md text-white hover:bg-gray-700 mb-1"
                        >
                            <svg className="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Dashboard
                        </Link>

                        <Link
                            href="/admin/users"
                            className="group flex items-center px-3 py-2 text-base font-medium rounded-md text-white hover:bg-gray-700 mb-1"
                        >
                            <svg className="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            Utilisateurs
                        </Link>

                        <Link
                            href="/admin/doctors/requests"
                            className="group flex items-center px-3 py-2 text-base font-medium rounded-md text-white hover:bg-gray-700 mb-1"
                        >
                            <svg className="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Demandes Médecins
                        </Link>
<Link
    href="/admin/security"
    className="group flex items-center px-3 py-2 text-base font-medium rounded-md text-white hover:bg-gray-700 mb-1"
>
    <svg className="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
    Sécurité
</Link>

                        <Link
                            href="/admin/security-logs"
                            className="group flex items-center px-3 py-2 text-base font-medium rounded-md text-white hover:bg-gray-700"
                        >
                            <svg className="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Logs Sécurité
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