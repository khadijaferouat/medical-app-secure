import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Dashboard({ user, stats, recentActivity, pendingRequests }) {
    return (
        <AdminLayout user={user}>
            <Head title="Admin Dashboard" />

            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Tableau de Bord Administrateur
            </h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <div className="ml-5">
                            <p className="text-sm font-medium text-gray-500">Total Utilisateurs</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total_users}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-5">
                            <p className="text-sm font-medium text-gray-500">Médecins</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total_doctors}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div className="ml-5">
                            <p className="text-sm font-medium text-gray-500">Patients</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total_patients}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-orange-500 rounded-md p-3">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-5">
                            <p className="text-sm font-medium text-gray-500">Demandes en Attente</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.pending_doctor_requests}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            {recentActivity && recentActivity.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Activité Récente</h2>
                    <div className="space-y-3">
                        {recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-center justify-between border-b pb-3">
                                <div>
                                    <p className="font-medium text-gray-900">{activity.user_name}</p>
                                    <p className="text-sm text-gray-500">{activity.action}</p>
                                </div>
                                <span className="text-xs text-gray-400">{activity.date}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Pending Requests */}
            {pendingRequests && pendingRequests.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Demandes Médecins en Attente</h2>
                    <div className="space-y-3">
                        {pendingRequests.map((request) => (
                            <div key={request.id} className="flex items-center justify-between border-b pb-3">
                                <div>
                                    <p className="font-medium text-gray-900">{request.doctor_name}</p>
                                    <p className="text-sm text-gray-500">
                                        {request.specialty} - RPPS: {request.rpps_number}
                                    </p>
                                </div>
                                <div className="space-x-2">
                                    <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                                        Valider
                                    </button>
                                    <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                                        Rejeter
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {(!recentActivity || recentActivity.length === 0) && (!pendingRequests || pendingRequests.length === 0) && (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune activité récente</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Les activités s'afficheront ici une fois que des utilisateurs commenceront à utiliser la plateforme.
                    </p>
                </div>
            )}
        </AdminLayout>
    );
}