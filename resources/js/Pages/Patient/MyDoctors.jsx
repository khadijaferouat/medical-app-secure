import { Head, Link } from '@inertiajs/react';
import PatientLayout from '@/Layouts/PatientLayout';

export default function MyDoctors({ user, doctors, stats }) {
    
    return (
        <PatientLayout user={user}>
            <Head title="Mes Médecins" />

            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        👨‍⚕️ Mes Médecins
                    </h1>
                    <Link
                        href="/patient/access-management"
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                        ➕ Autoriser un médecin
                    </Link>
                </div>

                {/* Info RGPD */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                    <p className="text-sm text-blue-800">
                        ℹ️ Vous contrôlez l'accès à votre dossier médical. 
                        Seuls les médecins que vous avez autorisés peuvent consulter vos données de santé.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-blue-600">{stats.total_doctors}</p>
                            <p className="text-sm text-gray-600 mt-1">Médecins Autorisés</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-green-600">{stats.write_access}</p>
                            <p className="text-sm text-gray-600 mt-1">Accès Écriture</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-yellow-600">{stats.read_access}</p>
                            <p className="text-sm text-gray-600 mt-1">Accès Lecture</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-purple-600">{stats.total_consultations}</p>
                            <p className="text-sm text-gray-600 mt-1">Consultations Total</p>
                        </div>
                    </div>
                </div>

                {/* Liste des médecins */}
                {doctors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {doctors.map((doctor) => (
                            <div key={doctor.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
                                {/* Header */}
                                <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold mb-1">
                                                Dr. {doctor.name}
                                            </h3>
                                            <p className="text-green-100 text-sm">
                                                {doctor.specialty}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            doctor.access_level === 'write' 
                                                ? 'bg-white text-green-600' 
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {doctor.access_level === 'write' ? '✍️ Écriture' : '👁️ Lecture'}
                                        </span>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-6">
                                    {/* Coordonnées */}
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center text-sm">
                                            <span className="text-gray-600 w-24">📧 Email:</span>
                                            <span className="text-gray-900 font-medium">{doctor.email}</span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <span className="text-gray-600 w-24">🆔 RPPS:</span>
                                            <span className="text-gray-900 font-medium">{doctor.rpps_number}</span>
                                        </div>
                                    </div>

                                    {/* Statistiques */}
                                    <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t">
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-blue-600">{doctor.consultations_count}</p>
                                            <p className="text-xs text-gray-600">Consultations</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-purple-600">{doctor.prescriptions_count}</p>
                                            <p className="text-xs text-gray-600">Ordonnances</p>
                                        </div>
                                    </div>

                                    {/* Dernière consultation */}
                                    {doctor.last_consultation_date && (
                                        <div className="bg-gray-50 p-3 rounded-lg mb-4">
                                            <p className="text-xs text-gray-600">Dernière consultation</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                📅 {doctor.last_consultation_date}
                                            </p>
                                        </div>
                                    )}

                                    {/* Autorisation */}
                                    <div className="bg-green-50 p-3 rounded-lg mb-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <div>
                                                <p className="text-xs text-gray-600">Autorisé depuis</p>
                                                <p className="font-medium text-gray-900">{doctor.authorized_since}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-600">Valable jusqu'au</p>
                                                <p className="font-medium text-gray-900">{doctor.valid_until}</p>
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <p className={`text-xs font-medium ${
                                                doctor.days_remaining > 30 
                                                    ? 'text-green-700' 
                                                    : 'text-orange-700'
                                            }`}>
                                                {doctor.days_remaining > 0 
                                                    ? `${doctor.days_remaining} jours restants` 
                                                    : 'Expire bientôt'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Raison */}
                                    {doctor.reason && (
                                        <div className="mb-4">
                                            <p className="text-xs text-gray-600 mb-1">Raison de l'autorisation</p>
                                            <p className="text-sm text-gray-700 italic">"{doctor.reason}"</p>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-4 border-t">
                                        <Link
                                            href="/patient/medical-record"
                                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm text-center"
                                        >
                                            📋 Voir mes consultations
                                        </Link>
                                        <Link
                                            href="/patient/access-management"
                                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
                                        >
                                            ⚙️ Gérer
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Aucun médecin autorisé
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Vous n'avez pas encore autorisé de médecins à accéder à votre dossier médical
                        </p>
                        <Link
                            href="/patient/access-management"
                            className="inline-block px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
                        >
                            ➕ Autoriser mon premier médecin
                        </Link>
                    </div>
                )}
            </div>
        </PatientLayout>
    );
}