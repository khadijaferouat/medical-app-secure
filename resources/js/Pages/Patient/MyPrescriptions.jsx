import { Head, Link, router } from '@inertiajs/react';
import PatientLayout from '@/Layouts/PatientLayout';

export default function MyPrescriptions({ user,prescriptions, stats, currentFilter }) {
    const handleFilterChange = (filter) => {
        router.get('/patient/prescriptions', { filter }, { preserveState: true });
    };

    const getStatusBadge = (prescription) => {
        if (prescription.is_active) {
            return (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    ✅ Active ({prescription.days_remaining} jours restants)
                </span>
            );
        } else if (prescription.status === 'cancelled') {
            return (
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                    ❌ Annulée
                </span>
            );
        } else {
            return (
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    ⏰ Expirée
                </span>
            );
        }
    };

    return (
        <PatientLayout user={user}>
            <Head title="Mes Ordonnances" />

            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    💊 Mes Ordonnances
                </h1>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                            <p className="text-sm text-gray-600 mt-1">Total</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-green-600">{stats.active}</p>
                            <p className="text-sm text-gray-600 mt-1">Actives</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-gray-600">{stats.expired}</p>
                            <p className="text-sm text-gray-600 mt-1">Expirées</p>
                        </div>
                    </div>
                </div>

                {/* Filtres */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-8">
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleFilterChange('all')}
                            className={`px-4 py-2 rounded-md font-medium transition ${
                                currentFilter === 'all'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Toutes ({stats.total})
                        </button>
                        <button
                            onClick={() => handleFilterChange('active')}
                            className={`px-4 py-2 rounded-md font-medium transition ${
                                currentFilter === 'active'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Actives ({stats.active})
                        </button>
                        <button
                            onClick={() => handleFilterChange('expired')}
                            className={`px-4 py-2 rounded-md font-medium transition ${
                                currentFilter === 'expired'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Expirées ({stats.expired})
                        </button>
                    </div>
                </div>

                {/* Liste des ordonnances */}
                {prescriptions.length > 0 ? (
                    <div className="space-y-4">
                        {prescriptions.map((prescription) => (
                            <div key={prescription.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">
                                            📄 Ordonnance du {prescription.prescription_date}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Par Dr. {prescription.doctor_name} ({prescription.doctor_specialty})
                                        </p>
                                        {prescription.medical_record_title && (
                                            <p className="text-sm text-gray-500 mt-1">
                                                Liée au dossier : {prescription.medical_record_title}
                                            </p>
                                        )}
                                    </div>
                                    {getStatusBadge(prescription)}
                                </div>

                                {/* Médicaments */}
                                <div className="space-y-2 mb-4">
                                    {prescription.medications.map((med, index) => (
                                        <div key={index} className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                                            <p className="font-bold text-gray-900">
                                                💊 {med.name} {med.dosage}
                                            </p>
                                            <p className="text-sm text-gray-700 mt-1">{med.posology}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Durée : {med.duration_days} jour{med.duration_days > 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Instructions */}
                                {prescription.instructions && (
                                    <div className="bg-yellow-50 p-3 rounded-lg mb-4">
                                        <p className="text-sm font-medium text-gray-900">📝 Instructions :</p>
                                        <p className="text-sm text-gray-700 mt-1">{prescription.instructions}</p>
                                    </div>
                                )}

                                {/* Validité */}
                                <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t">
                                    <span>Valable jusqu'au {prescription.valid_until}</span>
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/patient/prescriptions/${prescription.id}`}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                                        >
                                            📄 Voir Détails
                                        </Link>
                                        <button
                                            onClick={() => alert('Fonctionnalité d\'impression à venir')}
                                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
                                        >
                                            🖨️ Imprimer
                                        </button>
                                        <button
                                            onClick={() => alert('Fonctionnalité de téléchargement PDF à venir')}
                                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
                                        >
                                            📥 PDF
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Aucune ordonnance
                        </h3>
                        <p className="text-gray-500">
                            {currentFilter === 'active' 
                                ? 'Vous n\'avez pas d\'ordonnances actives pour le moment'
                                : currentFilter === 'expired'
                                ? 'Vous n\'avez pas d\'ordonnances expirées'
                                : 'Vous n\'avez pas encore d\'ordonnances enregistrées'}
                        </p>
                    </div>
                )}
            </div>
        </PatientLayout>
    );
}