import { Head, useForm } from '@inertiajs/react';
import PatientLayout from '@/Layouts/PatientLayout';
import { useState } from 'react';

export default function AccessManagement({ availableDoctors, activeAuthorizations }) {
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        access_level: 'write',
        duration_months: 12,
        reason: '',
    });

    const handleAuthorize = (e) => {
        e.preventDefault();
        post(`/patient/doctors/${selectedDoctor.id}/authorize`, {
            onSuccess: () => {
                setShowModal(false);
                setSelectedDoctor(null);
                reset();
            }
        });
    };

    const handleRevoke = (authorizationId, doctorName) => {
        if (confirm(`Êtes-vous sûr de vouloir révoquer l'accès de ${doctorName} ?`)) {
            post(`/patient/authorizations/${authorizationId}/revoke`);
        }
    };

    const filteredDoctors = availableDoctors.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const unauthorizedDoctors = filteredDoctors.filter(d => !d.is_authorized);
    const authorizedDoctors = filteredDoctors.filter(d => d.is_authorized);

    return (
        <PatientLayout>
            <Head title="Gérer les Accès" />

            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        🔐 Gérer les Accès à mon Dossier
                    </h1>
                </div>

                {/* Info RGPD */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                    <h3 className="font-bold text-blue-900 mb-2">
                        ℹ️ Contrôlez vos données médicales
                    </h3>
                    <p className="text-sm text-blue-800">
                        Vous êtes le seul à décider qui peut accéder à votre dossier médical. 
                        Vous pouvez autoriser ou révoquer l'accès à tout moment. Toutes les actions sont tracées.
                    </p>
                </div>

                {/* Autorisations actives */}
                {activeAuthorizations.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            ✅ Médecins Autorisés ({activeAuthorizations.length})
                        </h2>
                        <div className="space-y-3">
                            {activeAuthorizations.map((auth) => (
                                <div key={auth.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900">
                                                👨‍⚕️ Dr. {auth.doctor_name}
                                            </h3>
                                            <p className="text-sm text-gray-600">{auth.doctor_specialty}</p>
                                            <div className="flex gap-4 mt-2 text-sm">
                                                <span className={`px-3 py-1 rounded-full ${
                                                    auth.access_level === 'write' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {auth.access_level === 'write' ? '✍️ Lecture + Écriture' : '👁️ Lecture seule'}
                                                </span>
                                                <span className="text-gray-500">
                                                    Autorisé du {auth.valid_from} au {auth.valid_until}
                                                </span>
                                                <span className={`font-medium ${
                                                    auth.days_remaining > 30 ? 'text-green-600' : 'text-orange-600'
                                                }`}>
                                                    {auth.days_remaining > 0 
                                                        ? `${auth.days_remaining} jours restants` 
                                                        : 'Expire bientôt'}
                                                </span>
                                            </div>
                                            {auth.reason && (
                                                <p className="text-sm text-gray-500 mt-2">
                                                    Raison : {auth.reason}
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleRevoke(auth.id, auth.doctor_name)}
                                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                                        >
                                            ❌ Révoquer
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recherche */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        🔍 Autoriser un Nouveau Médecin
                    </h2>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Rechercher un médecin par nom ou spécialité..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    />
                </div>

                {/* Médecins déjà autorisés */}
                {authorizedDoctors.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            ✅ Déjà Autorisés ({authorizedDoctors.length})
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {authorizedDoctors.map((doctor) => (
                                <div key={doctor.id} className="border border-green-200 bg-green-50 rounded-lg p-4">
                                    <h4 className="font-bold text-gray-900">Dr. {doctor.name}</h4>
                                    <p className="text-sm text-gray-600">{doctor.specialty}</p>
                                    <p className="text-xs text-gray-500 mt-1">RPPS: {doctor.rpps_number}</p>
                                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs ${
                                        doctor.access_level === 'write' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        ✅ Autorisé ({doctor.access_level === 'write' ? 'Écriture' : 'Lecture'})
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Médecins disponibles (non autorisés) */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        👨‍⚕️ Médecins Disponibles ({unauthorizedDoctors.length})
                    </h3>
                    {unauthorizedDoctors.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {unauthorizedDoctors.map((doctor) => (
                                <div key={doctor.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                    <h4 className="font-bold text-gray-900">Dr. {doctor.name}</h4>
                                    <p className="text-sm text-gray-600">{doctor.specialty}</p>
                                    <p className="text-xs text-gray-500 mt-1">RPPS: {doctor.rpps_number}</p>
                                    <button
                                        onClick={() => {
                                            setSelectedDoctor(doctor);
                                            setShowModal(true);
                                        }}
                                        className="mt-3 w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                                    >
                                        ✅ Autoriser
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500">
                                {searchTerm 
                                    ? 'Aucun médecin ne correspond à votre recherche' 
                                    : 'Tous les médecins disponibles ont déjà accès à votre dossier'}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Autorisation */}
            {showModal && selectedDoctor && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Autoriser Dr. {selectedDoctor.name}
                        </h2>
                        <p className="text-sm text-gray-600 mb-6">
                            {selectedDoctor.specialty}
                        </p>

                        <form onSubmit={handleAuthorize} className="space-y-6">
                            {/* Niveau d'accès */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Niveau d'accès *
                                </label>
                                <select
                                    value={data.access_level}
                                    onChange={(e) => setData('access_level', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                    required
                                >
                                    <option value="read">👁️ Lecture seule (consultation uniquement)</option>
                                    <option value="write">✍️ Lecture + Écriture (peut créer des dossiers)</option>
                                </select>
                                {errors.access_level && <p className="text-red-600 text-sm mt-1">{errors.access_level}</p>}
                            </div>

                            {/* Durée */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Durée de l'autorisation *
                                </label>
                                <select
                                    value={data.duration_months}
                                    onChange={(e) => setData('duration_months', parseInt(e.target.value))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                    required
                                >
                                    <option value="1">1 mois</option>
                                    <option value="3">3 mois</option>
                                    <option value="6">6 mois</option>
                                    <option value="12">1 an</option>
                                    <option value="24">2 ans</option>
                                    <option value="60">5 ans (maximum)</option>
                                </select>
                                {errors.duration_months && <p className="text-red-600 text-sm mt-1">{errors.duration_months}</p>}
                            </div>

                            {/* Raison */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Raison (optionnel)
                                </label>
                                <textarea
                                    value={data.reason}
                                    onChange={(e) => setData('reason', e.target.value)}
                                    rows="3"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                    placeholder="Ex: Médecin traitant, suivi spécialisé..."
                                />
                                {errors.reason && <p className="text-red-600 text-sm mt-1">{errors.reason}</p>}
                            </div>

                            {/* Boutons */}
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 font-medium"
                                >
                                    {processing ? 'Autorisation...' : '✅ Autoriser'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setSelectedDoctor(null);
                                        reset();
                                    }}
                                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </PatientLayout>
    );
}