import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function SecurityLogs({ logs, stats, filters, eventTypes, riskLevels }) {
    const [localFilters, setLocalFilters] = useState({
        event_type: filters.event_type || '',
        risk_level: filters.risk_level || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
    });

    const handleFilter = () => {
        router.get('/admin/security-logs', localFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setLocalFilters({
            event_type: '',
            risk_level: '',
            date_from: '',
            date_to: '',
        });
        router.get('/admin/security-logs');
    };

    const getRiskBadgeColor = (level) => {
        switch (level) {
            case 'critical': return 'bg-red-100 text-red-800';
            case 'high': return 'bg-orange-100 text-orange-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getEventIcon = (eventType) => {
        if (eventType.includes('login')) return '🔐';
        if (eventType.includes('logout')) return '🚪';
        if (eventType.includes('password')) return '🔑';
        if (eventType.includes('locked')) return '🔒';
        if (eventType.includes('approved')) return '✅';
        if (eventType.includes('rejected')) return '❌';
        if (eventType.includes('unauthorized')) return '⚠️';
        if (eventType.includes('2fa')) return '🛡️';
        return '📝';
    };

    return (
        <AdminLayout>
            <Head title="Logs de Sécurité" />

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Logs de Sécurité</h1>
                <p className="mt-2 text-sm text-gray-600">
                    Suivi de toutes les activités de sécurité de la plateforme
                </p>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-sm text-gray-500">Total d'événements</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-sm text-gray-500">Aujourd'hui</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.today}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-sm text-gray-500">Risques élevés</p>
                    <p className="text-2xl font-bold text-red-600">{stats.high_risk}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-sm text-gray-500">Échecs connexion (7j)</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.failed_logins}</p>
                </div>
            </div>

            {/* Filtres */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Filtres</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type d'événement
                        </label>
                        <select
                            value={localFilters.event_type}
                            onChange={(e) => setLocalFilters({ ...localFilters, event_type: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Tous</option>
                            {Object.entries(eventTypes).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Niveau de risque
                        </label>
                        <select
                            value={localFilters.risk_level}
                            onChange={(e) => setLocalFilters({ ...localFilters, risk_level: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Tous</option>
                            {Object.entries(riskLevels).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date début
                        </label>
                        <input
                            type="date"
                            value={localFilters.date_from}
                            onChange={(e) => setLocalFilters({ ...localFilters, date_from: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date fin
                        </label>
                        <input
                            type="date"
                            value={localFilters.date_to}
                            onChange={(e) => setLocalFilters({ ...localFilters, date_to: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                </div>

                <div className="flex gap-2 mt-4">
                    <button
                        onClick={handleFilter}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Appliquer
                    </button>
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                        Réinitialiser
                    </button>
                </div>
            </div>

            {/* Liste des logs */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Date/Heure
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Utilisateur
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Événement
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    IP
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Risque
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {logs.data.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {log.created_at}
                                        <br />
                                        <span className="text-xs text-gray-500">{log.created_at_human}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{log.user_name}</div>
                                        <div className="text-sm text-gray-500">{log.user_email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <span className="mr-2">{getEventIcon(log.event_type)}</span>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {eventTypes[log.event_type]}
                                                </div>
                                                {log.description && (
                                                    <div className="text-sm text-gray-500">{log.description}</div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {log.ip_address}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs rounded ${getRiskBadgeColor(log.risk_level)}`}>
                                            {riskLevels[log.risk_level]}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {logs.links && logs.links.length > 3 && (
                    <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                        <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-700">
                                Page {logs.current_page} sur {logs.last_page}
                            </div>
                            <div className="flex gap-2">
                                {logs.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() => link.url && router.get(link.url)}
                                        disabled={!link.url}
                                        className={`px-3 py-1 rounded ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}