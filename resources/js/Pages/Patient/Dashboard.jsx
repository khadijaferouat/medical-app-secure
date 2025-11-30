import { Head } from '@inertiajs/react';
import PatientLayout from '@/Layouts/PatientLayout';

export default function Dashboard({ user, nextAppointment, healthSummary, stats, recentConsultations, authorizedDoctors }) {
    return (
        <PatientLayout user={user}>
            <Head title="Dashboard Patient" />

            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Bonjour, {user.name}
            </h1>

            {/* Security Badges */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                <div className="flex items-center justify-center space-x-6 text-sm">
                    <div className="flex items-center">
                        <span className="text-blue-900 font-medium">
                            🔒 Vos données sont chiffrées avec AES-256
                        </span>
                    </div>
                    <div className="flex items-center">
                        <span className="text-blue-900 font-medium">
                            🛡️ Connexion sécurisée HTTPS
                        </span>
                    </div>
                    <div className="flex items-center">
                        <span className="text-blue-900 font-medium">
                            ✅ Conforme RGPD - Vous contrôlez vos données
                        </span>
                    </div>
                </div>
            </div>

            {/* Next Appointment */}
            {nextAppointment && (
                <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-6 mb-8">
                    <h2 className="text-lg font-bold text-green-900 mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Prochain Rendez-vous
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Date & Heure</p>
                            <p className="font-medium text-gray-900">
                                📅 {nextAppointment.date} à {nextAppointment.time}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Médecin</p>
                            <p className="font-medium text-gray-900">
                                👨‍⚕️ {nextAppointment.doctor_name}
                            </p>
                            <p className="text-xs text-gray-500">{nextAppointment.doctor_specialty}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Lieu</p>
                            <p className="font-medium text-gray-900">
                                📍 {nextAppointment.location}
                            </p>
                        </div>
                    </div>
                    {nextAppointment.reason && (
                        <div className="mt-4">
                            <p className="text-sm text-gray-600">Motif</p>
                            <p className="font-medium text-gray-900">{nextAppointment.reason}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Stats */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-blue-600">{stats.total_consultations}</p>
                            <p className="text-sm text-gray-600 mt-1">Consultations</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-green-600">{stats.active_prescriptions}</p>
                            <p className="text-sm text-gray-600 mt-1">Ordonnances Actives</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-purple-600">{stats.authorized_doctors}</p>
                            <p className="text-sm text-gray-600 mt-1">Médecins Autorisés</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-orange-600">{stats.pending_appointments}</p>
                            <p className="text-sm text-gray-600 mt-1">RDV à Venir</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Health Summary */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Résumé Santé</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm text-gray-500">Groupe Sanguin</p>
                        <p className="font-medium text-gray-900 text-lg">{healthSummary.blood_type || 'Non renseigné'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Allergies</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {healthSummary.allergies && healthSummary.allergies.length > 0 ? (
                                healthSummary.allergies.map((allergy, index) => (
                                    <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                                        {allergy}
                                    </span>
                                ))
                            ) : (
                                <span className="text-gray-400 text-sm">Aucune allergie connue</span>
                            )}
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Traitements en Cours</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {healthSummary.current_treatments && healthSummary.current_treatments.length > 0 ? (
                                healthSummary.current_treatments.map((treatment, index) => (
                                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                        {treatment}
                                    </span>
                                ))
                            ) : (
                                <span className="text-gray-400 text-sm">Aucun traitement</span>
                            )}
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Dernière Consultation</p>
                        <p className="font-medium text-gray-900">
                            {healthSummary.last_consultation_date || 'Aucune consultation'}
                        </p>
                        {healthSummary.last_consultation_doctor && (
                            <p className="text-sm text-gray-500">{healthSummary.last_consultation_doctor}</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Recent Consultations */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Consultations Récentes</h2>
                    {recentConsultations && recentConsultations.length > 0 ? (
                        <div className="space-y-3">
                            {recentConsultations.map((consultation) => (
                                <div key={consultation.id} className="border-b pb-3 last:border-b-0">
                                    <p className="font-medium text-gray-900">{consultation.title}</p>
                                    <p className="text-sm text-gray-500">
                                        {consultation.date} - {consultation.doctor_name} ({consultation.doctor_specialty})
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">Aucune consultation récente</p>
                    )}
                </div>

                {/* Authorized Doctors */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Médecins Autorisés</h2>
                    {authorizedDoctors && authorizedDoctors.length > 0 ? (
                        <div className="space-y-3">
                            {authorizedDoctors.map((doctor) => (
                                <div key={doctor.id} className="border-b pb-3 last:border-b-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-medium text-gray-900">{doctor.name}</p>
                                            <p className="text-sm text-gray-500">{doctor.specialty}</p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs rounded ${
                                            doctor.access_level === 'write' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {doctor.access_level === 'write' ? 'Lecture/Écriture' : 'Lecture'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Autorisé depuis le {doctor.authorized_since}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">Aucun médecin autorisé</p>
                    )}
                </div>
            </div>
        </PatientLayout>
    );
}