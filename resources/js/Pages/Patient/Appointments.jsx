import { Head, router, Link, usePage } from '@inertiajs/react';
import PatientLayout from '@/Layouts/PatientLayout';

export default function Appointments({ user, appointments, nextAppointment, stats, currentFilter }) {
    
    const { flash } = usePage().props;

    const handleFilterChange = (filter) => {
        router.get('/patient/appointments', { filter }, { preserveState: true });
    };

    const getStatusBadge = (appointment) => {
        if (appointment.status === 'completed') {
            return 'bg-green-100 text-green-800';
        } else if (appointment.status === 'cancelled') {
            return 'bg-red-100 text-red-800';
        } else if (appointment.is_today) {
            return 'bg-orange-100 text-orange-800';
        } else {
            return 'bg-blue-100 text-blue-800';
        }
    };

    const getStatusText = (appointment) => {
        if (appointment.status === 'completed') {
            return '✅ Complété';
        } else if (appointment.status === 'cancelled') {
            return '❌ Annulé';
        } else if (appointment.is_today) {
            return '🔥 Aujourd\'hui';
        } else if (appointment.is_past) {
            return '⏰ Passé';
        } else {
            return '📅 Prévu';
        }
    };

    const handleCancel = (appointmentId) => {
        if (confirm('⚠️ Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
            router.post(`/patient/appointments/${appointmentId}/cancel`, {}, {
                onSuccess: () => {
                    // Rafraîchir automatiquement
                },
                onError: (errors) => {
                    alert(errors.error || 'Erreur lors de l\'annulation');
                }
            });
        }
    };    

    return (
        <PatientLayout user={user}>
            <Head title="Mes Rendez-vous" />

            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        📅 Mes Rendez-vous
                    </h1>
                    <Link
                        href="/patient/appointments/create"
                        className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
                    >
                        ➕ Prendre rendez-vous
                    </Link>
                </div>

                {/* Messages Flash */}
                {flash?.success && (
                    <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-sm text-green-800">{flash.success}</p>
                    </div>
                )}

                {flash?.error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-800">{flash.error}</p>
                    </div>
                )}

                {/* Prochain RDV */}
                {nextAppointment && (
                    <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 rounded-lg p-6 mb-8">
                        <h2 className="text-lg font-bold text-green-900 mb-4 flex items-center">
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Prochain Rendez-vous
                            {nextAppointment.days_until === 0 && (
                                <span className="ml-3 px-3 py-1 bg-orange-500 text-white rounded-full text-sm">
                                    Aujourd'hui !
                                </span>
                            )}
                            {nextAppointment.days_until === 1 && (
                                <span className="ml-3 px-3 py-1 bg-orange-400 text-white rounded-full text-sm">
                                    Demain
                                </span>
                            )}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Date & Heure</p>
                                <p className="font-bold text-gray-900">
                                    📅 {nextAppointment.date} à {nextAppointment.time}
                                </p>
                                {nextAppointment.days_until > 1 && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Dans {nextAppointment.days_until} jours
                                    </p>
                                )}
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Médecin</p>
                                <p className="font-bold text-gray-900">
                                    👨‍⚕️ Dr. {nextAppointment.doctor_name}
                                </p>
                                <p className="text-xs text-gray-500">{nextAppointment.doctor_specialty}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Lieu</p>
                                <p className="font-bold text-gray-900">
                                    📍 {nextAppointment.location}
                                </p>
                            </div>
                        </div>
                        {nextAppointment.reason && (
                            <div className="mt-4 pt-4 border-t border-green-200">
                                <p className="text-sm text-gray-600">Motif</p>
                                <p className="font-medium text-gray-900">{nextAppointment.reason}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                            <p className="text-sm text-gray-600 mt-1">Total</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-orange-600">{stats.today}</p>
                            <p className="text-sm text-gray-600 mt-1">Aujourd'hui</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-purple-600">{stats.upcoming}</p>
                            <p className="text-sm text-gray-600 mt-1">À venir</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                            <p className="text-sm text-gray-600 mt-1">Complétés</p>
                        </div>
                    </div>
                </div>

                {/* Filtres */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-8">
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleFilterChange('today')}
                            className={`px-4 py-2 rounded-md font-medium transition ${
                                currentFilter === 'today'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            🔥 Aujourd'hui ({stats.today})
                        </button>
                        <button
                            onClick={() => handleFilterChange('upcoming')}
                            className={`px-4 py-2 rounded-md font-medium transition ${
                                currentFilter === 'upcoming'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            📅 À venir ({stats.upcoming})
                        </button>
                        <button
                            onClick={() => handleFilterChange('past')}
                            className={`px-4 py-2 rounded-md font-medium transition ${
                                currentFilter === 'past'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            📋 Historique
                        </button>
                    </div>
                </div>

                {/* Liste des rendez-vous */}
                {appointments.length > 0 ? (
                    <div className="space-y-4">
                        {appointments.map((appointment) => (
                            <div key={appointment.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <h3 className="text-lg font-bold text-gray-900">
                                                Dr. {appointment.doctor_name}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(appointment)}`}>
                                                {getStatusText(appointment)}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-600">📅 Date & Heure</p>
                                                <p className="font-medium text-gray-900">
                                                    {appointment.appointment_date} à {appointment.appointment_time}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">🏥 Spécialité</p>
                                                <p className="font-medium text-gray-900">{appointment.doctor_specialty}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">📍 Lieu</p>
                                                <p className="font-medium text-gray-900">{appointment.location}</p>
                                            </div>
                                        </div>

                                        {appointment.reason && (
                                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                                <p className="text-sm font-medium text-blue-900">Motif :</p>
                                                <p className="text-sm text-blue-800">{appointment.reason}</p>
                                            </div>
                                        )}

                                        {/* Bouton Annuler (seulement si scheduled et futur) */}
                                        {appointment.status === 'scheduled' && !appointment.is_past && (
                                            <div className="mt-4 pt-4 border-t">
                                                <button
                                                    onClick={() => handleCancel(appointment.id)}
                                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium transition"
                                                >
                                                    ❌ Annuler ce rendez-vous
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Aucun rendez-vous
                        </h3>
                        <p className="text-gray-500">
                            {currentFilter === 'today' && 'Vous n\'avez pas de rendez-vous aujourd\'hui'}
                            {currentFilter === 'upcoming' && 'Aucun rendez-vous prévu pour le moment'}
                            {currentFilter === 'past' && 'Aucun rendez-vous passé'}
                        </p>
                    </div>
                )}
            </div>
        </PatientLayout>
    );
}