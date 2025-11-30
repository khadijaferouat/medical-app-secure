import { Head, Link, router, usePage } from '@inertiajs/react';
import DoctorLayout from '@/Layouts/DoctorLayout';

export default function Appointments({ user, appointments, stats, filter }) {
    
    const { flash } = usePage().props;

    const handleFilter = (newFilter) => {
        router.get('/doctor/appointments', { filter: newFilter }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleComplete = (appointmentId) => {
        if (confirm('✅ Marquer ce rendez-vous comme complété ?')) {
            router.post(`/doctor/appointments/${appointmentId}/complete`);
        }
    };

    const handleCancel = (appointmentId) => {
        if (confirm('⚠️ Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
            router.post(`/doctor/appointments/${appointmentId}/cancel`);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'scheduled':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'scheduled':
                return '📅 Prévu';
            case 'completed':
                return '✅ Complété';
            case 'cancelled':
                return '❌ Annulé';
            default:
                return status;
        }
    };

    const getLocationIcon = (location) => {
        switch (location) {
            case 'cabinet':
                return '🏥';
            case 'teleconsultation':
                return '💻';
            case 'domicile':
                return '🏠';
            default:
                return '📍';
        }
    };

    const getLocationText = (location) => {
        switch (location) {
            case 'cabinet':
                return 'Cabinet';
            case 'teleconsultation':
                return 'Téléconsultation';
            case 'domicile':
                return 'Domicile';
            default:
                return location;
        }
    };

    return (
        <DoctorLayout user={user}>
            <Head title="Rendez-vous" />

            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                📅 Mes Rendez-vous
            </h1>

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

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Aujourd'hui</p>
                            <p className="text-3xl font-bold text-blue-600">{stats.today_count}</p>
                        </div>
                        <div className="bg-blue-100 rounded-full p-3">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">À venir</p>
                            <p className="text-3xl font-bold text-orange-600">{stats.upcoming_count}</p>
                        </div>
                        <div className="bg-orange-100 rounded-full p-3">
                            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Complétés ce mois</p>
                            <p className="text-3xl font-bold text-green-600">{stats.completed_this_month}</p>
                        </div>
                        <div className="bg-green-100 rounded-full p-3">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filtres */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex gap-2">
                    <button
                        onClick={() => handleFilter('today')}
                        className={`px-4 py-2 rounded-md font-medium transition ${
                            filter === 'today'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        📅 Aujourd'hui ({stats.today_count})
                    </button>
                    <button
                        onClick={() => handleFilter('upcoming')}
                        className={`px-4 py-2 rounded-md font-medium transition ${
                            filter === 'upcoming'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        🔜 À venir ({stats.upcoming_count})
                    </button>
                    <button
                        onClick={() => handleFilter('past')}
                        className={`px-4 py-2 rounded-md font-medium transition ${
                            filter === 'past'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        📋 Historique
                    </button>
                </div>
            </div>

            {/* Appointments List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {appointments && appointments.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                        {appointments.map((appointment) => (
                            <div key={appointment.id} className="p-6 hover:bg-gray-50 transition">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-gray-900">
                                                {appointment.patient_name}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(appointment.status)}`}>
                                                {getStatusText(appointment.status)}
                                            </span>
                                            {appointment.is_today && (
                                                <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                                                    🔥 Aujourd'hui
                                                </span>
                                            )}
                                            {appointment.is_new && appointment.status === 'scheduled' && (
                                                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                                                    ✨ Nouveau
                                                </span>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                                            <div>
                                                <p className="font-medium text-gray-700">📅 Date</p>
                                                <p>{appointment.appointment_date}</p>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-700">🕐 Heure</p>
                                                <p>{appointment.appointment_time}</p>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-700">
                                                    {getLocationIcon(appointment.location)} Lieu
                                                </p>
                                                <p>{getLocationText(appointment.location)}</p>
                                            </div>
                                        </div>

                                        {appointment.reason && (
                                            <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                                                <p className="text-xs font-medium text-blue-900 mb-1">💬 Motif de consultation :</p>
                                                <p className="text-sm text-blue-800">{appointment.reason}</p>
                                            </div>
                                        )}

                                        <div className="mt-3 text-xs text-gray-500">
                                            Créé le {appointment.created_at}
                                        </div>
                                    </div>

                                    <div className="ml-4 flex flex-col gap-2">
                                        <Link
                                            href={`/doctor/patients/${appointment.patient_id}`}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm text-center transition"
                                        >
                                            📋 Dossier Patient
                                        </Link>

                                        {appointment.status === 'scheduled' && !appointment.is_past && (
                                            <>
                                                <button
                                                    onClick={() => handleComplete(appointment.id)}
                                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm transition"
                                                >
                                                    ✅ Marquer complété
                                                </button>
                                                <button
                                                    onClick={() => handleCancel(appointment.id)}
                                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm transition"
                                                >
                                                    ❌ Annuler
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 px-4">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun rendez-vous</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {filter === 'today' && 'Vous n\'avez pas de rendez-vous aujourd\'hui'}
                            {filter === 'upcoming' && 'Aucun rendez-vous prévu'}
                            {filter === 'past' && 'Aucun rendez-vous passé'}
                        </p>
                    </div>
                )}
            </div>
        </DoctorLayout>
    );
}