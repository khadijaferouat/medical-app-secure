import { Head } from '@inertiajs/react';
import DoctorLayout from '@/Layouts/DoctorLayout';

export default function Dashboard({ user, stats, todayPatients, recentRecords }) {
    return (
        <DoctorLayout user={user}>
            <Head title="Dashboard Médecin" />

            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Bienvenue, Dr. {user.name}
            </h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div className="ml-5">
                            <p className="text-sm font-medium text-gray-500">Patients Suivis</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="ml-5">
                            <p className="text-sm font-medium text-gray-500">RDV Aujourd'hui</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div className="ml-5">
                            <p className="text-sm font-medium text-gray-500">Dossiers ce Mois</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.monthlyRecords}</p>
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
                            <p className="text-sm font-medium text-gray-500">Autorisations Pendantes</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.pendingAuthorizations}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Patients du Jour */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Patients du Jour</h2>
                {todayPatients && todayPatients.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Heure</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Raison</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {todayPatients.map((patient) => (
                                    <tr key={patient.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {patient.appointmentTime}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {patient.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {patient.reason}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {patient.phone}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">Aucun rendez-vous aujourd'hui</p>
                )}
            </div>

            {/* Dossiers Récents */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Dossiers Récents</h2>
                {recentRecords && recentRecords.length > 0 ? (
                    <div className="space-y-3">
                        {recentRecords.map((record) => (
                            <div key={record.id} className="border-b pb-3 hover:bg-gray-50 p-3 rounded">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-medium text-gray-900">{record.patient_name}</p>
                                        <p className="text-sm text-gray-500">{record.title}</p>
                                        {record.is_emergency && (
                                            <span className="inline-block mt-1 px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                                                🚨 Urgence
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-400">{record.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">Aucun dossier récent</p>
                )}
            </div>
        </DoctorLayout>
    );
}