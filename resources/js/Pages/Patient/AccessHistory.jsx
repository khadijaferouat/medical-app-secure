import { Head, router } from '@inertiajs/react';
import PatientLayout from '@/Layouts/PatientLayout';

export default function AccessHistory({ user, logs, authorizedDoctors, stats, filters }) {
    
    const handleFilterChange = (filter) => {
        router.get('/patient/access-history', { 
            filter,
            doctor_id: filters.doctor_id 
        }, { 
            preserveState: true 
        });
    };

    const handleDoctorFilter = (doctorId) => {
        router.get('/patient/access-history', { 
            filter: filters.current,
            doctor_id: doctorId || null
        }, { 
            preserveState: true 
        });
    };

    const getRiskBadge = (level) => {
        switch (level) {
            case 'low':
                return 'bg-green-100 text-green-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'high':
                return 'bg-orange-100 text-orange-800';
            case 'critical':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getRiskText = (level) => {
        switch (level) {
            case 'low':
                return '🟢 Normal';
            case 'medium':
                return '🟡 Attention';
            case 'high':
                return '🟠 Élevé';
            case 'critical':
                return '🔴 Critique';
            default:
                return level;
        }
    };

    const getActionIcon = (action) => {
        if (action.includes('Création')) return '➕';
        if (action.includes('Modification')) return '✏️';
        if (action.includes('Suppression')) return '🗑️';
        if (action.includes('Consultation')) return '👁️';
        if (action.includes('Annulation')) return '❌';
        return '📋';
    };

    return (
        <PatientLayout user={user}>
            <Head title="Historique des Accès" />

            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    📜 Historique des Accès à mon Dossier
                </h1>

                {/* Info RGPD */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                    <h3 className="font-bold text-blue-900 mb-2">
                        🛡️ Traçabilité RGPD
                    </h3>
                    <p className="text-sm text-blue-800">
                        Conformément au RGPD, tous les accès à votre dossier médical sont tracés. 
                        Vous pouvez consulter qui a accédé à vos données, quand et pourquoi.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-blue-600">{stats.total_accesses}</p>
                            <p className="text-sm text-gray-600 mt-1">Total Accès</p>
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
                            <p className="text-3xl font-bold text-purple-600">{stats.this_week}</p>
                            <p className="text-sm text-gray-600 mt-1">Cette Semaine</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-green-600">{stats.this_month}</p>
                            <p className="text-sm text-gray-600 mt-1">Ce Mois</p>
                        </div>
                    </div>
                </div>

                {/* Filtres */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Filtre par date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Période
                            </label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleFilterChange('all')}
                                    className={`px-4 py-2 rounded-md font-medium transition ${
                                        filters.current === 'all'
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Tout
                                </button>
                                <button
                                    onClick={() => handleFilterChange('today')}
                                    className={`px-4 py-2 rounded-md font-medium transition ${
                                        filters.current === 'today'
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Aujourd'hui
                                </button>
                                <button
                                    onClick={() => handleFilterChange('week')}
                                    className={`px-4 py-2 rounded-md font-medium transition ${
                                        filters.current === 'week'
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    7 jours
                                </button>
                                <button
                                    onClick={() => handleFilterChange('month')}
                                    className={`px-4 py-2 rounded-md font-medium transition ${
                                        filters.current === 'month'
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    30 jours
                                </button>
                            </div>
                        </div>

                        {/* Filtre par médecin */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Médecin
                            </label>
                            <select
                                value={filters.doctor_id || ''}
                                onChange={(e) => handleDoctorFilter(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="">Tous les médecins</option>
                                {authorizedDoctors.map((doctor) => (
                                    <option key={doctor.id} value={doctor.id}>
                                        Dr. {doctor.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Liste des accès */}
                {logs.data && logs.data.length > 0 ? (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="divide-y divide-gray-200">
                            {logs.data.map((log) => (
                                <div key={log.id} className="p-6 hover:bg-gray-50 transition">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-2xl">
                                                    {getActionIcon(log.action)}
                                                </span>
                                                <div>
                                                    <h3 className="font-bold text-gray-900">
                                                        {log.action}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        📅 {log.datetime} | 👨‍⚕️ Dr. {log.doctor_name}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="ml-11 space-y-2">
                                                <p className="text-sm text-gray-700">
                                                    {log.description}
                                                </p>
                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                    <span>🌐 IP: {log.ip_address}</span>
                                                    <span className={`px-2 py-1 rounded-full font-medium ${getRiskBadge(log.risk_level)}`}>
                                                        {getRiskText(log.risk_level)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {logs.links && logs.links.length > 3 && (
                            <div className="bg-gray-50 px-6 py-4 border-t">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Affichage de {logs.from} à {logs.to} sur {logs.total} entrées
                                    </div>
                                    <div className="flex gap-2">
                                        {logs.links.map((link, index) => (
                                            <button
                                                key={index}
                                                onClick={() => link.url && router.get(link.url)}
                                                disabled={!link.url}
                                                className={`px-3 py-1 rounded ${
                                                    link.active
                                                        ? 'bg-green-600 text-white'
                                                        : link.url
                                                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Aucun accès enregistré
                        </h3>
                        <p className="text-gray-500">
                            {filters.current !== 'all' 
                                ? 'Aucun accès durant cette période' 
                                : 'Aucun médecin n\'a encore accédé à votre dossier'}
                        </p>
                    </div>
                )}
            </div>
        </PatientLayout>
    );
}