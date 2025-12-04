import PatientLayout from '@/Layouts/PatientLayout';
import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react'; // ← Ajoutez Link


export default function Profile({ user, patient }) {
    const { data, setData, put, processing, errors } = useForm({
        phone: patient.phone || '',
        gender: patient.gender || '',
        address: patient.address || '',
        city: patient.city || '',
        postal_code: patient.postal_code || '',
        blood_type: patient.blood_type || '',
        allergies: patient.allergies || [],
        medical_history: patient.medical_history || [],
        current_treatments: patient.current_treatments || [],
    });

    const [newAllergy, setNewAllergy] = useState('');
    const [newHistory, setNewHistory] = useState('');
    const [newTreatment, setNewTreatment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        put('/patient/profile');
    };

    const addAllergy = () => {
        if (newAllergy.trim()) {
            setData('allergies', [...data.allergies, newAllergy.trim()]);
            setNewAllergy('');
        }
    };

    const removeAllergy = (index) => {
        setData('allergies', data.allergies.filter((_, i) => i !== index));
    };

    const addHistory = () => {
        if (newHistory.trim()) {
            setData('medical_history', [...data.medical_history, newHistory.trim()]);
            setNewHistory('');
        }
    };

    const removeHistory = (index) => {
        setData('medical_history', data.medical_history.filter((_, i) => i !== index));
    };

    const addTreatment = () => {
        if (newTreatment.trim()) {
            setData('current_treatments', [...data.current_treatments, newTreatment.trim()]);
            setNewTreatment('');
        }
    };

    const removeTreatment = (index) => {
        setData('current_treatments', data.current_treatments.filter((_, i) => i !== index));
    };

    return (
        <PatientLayout user={user}>
            <Head title="Mon Profil" />

            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Mon Profil
            </h1>

             {/* ✅ AJOUTEZ CETTE SECTION 2FA ICI */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                    🔐 Authentification à deux facteurs (2FA)
                </h3>
                
                {user.google2fa_enabled ? (
                    <div>
                        <div className="flex items-center mb-3">
                            <span className="text-green-600 mr-2 text-2xl">✅</span>
                            <p className="text-sm text-green-600 font-semibold">
                                L'authentification à deux facteurs est activée
                            </p>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                            Votre compte est protégé par une couche de sécurité supplémentaire
                        </p>
                    </div>
                ) : (
                    <div>
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                            <p className="text-sm text-blue-800">
                                💡 Renforcez la sécurité de votre dossier médical en activant l'authentification à deux facteurs
                            </p>
                        </div>
                        <Link
                            href={route('2fa.setup')}
                            className="inline-block px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold"
                        >
                            Activer le 2FA
                        </Link>
                    </div>
                )}
            </div>
            {/* FIN DE LA SECTION 2FA */}           

            <div className="bg-white rounded-lg shadow-md p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Informations personnelles */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Informations personnelles</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Téléphone
                                </label>
                                <input
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                    placeholder="06 00 00 00 00"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sexe
                                </label>
                                <select
                                    value={data.gender}
                                    onChange={(e) => setData('gender', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="">Non spécifié</option>
                                    <option value="M">Masculin</option>
                                    <option value="F">Féminin</option>
                                    <option value="Other">Autre</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Groupe sanguin
                                </label>
                                <select
                                    value={data.blood_type}
                                    onChange={(e) => setData('blood_type', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="">Non renseigné</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Adresse
                                </label>
                                <input
                                    type="text"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                    placeholder="12 Rue Example"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ville
                                </label>
                                <input
                                    type="text"
                                    value={data.city}
                                    onChange={(e) => setData('city', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                    placeholder="Paris"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Code postal
                                </label>
                                <input
                                    type="text"
                                    value={data.postal_code}
                                    onChange={(e) => setData('postal_code', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                    placeholder="75001"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Allergies */}
                    <div className="border-t pt-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Allergies</h2>
                        
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={newAllergy}
                                onChange={(e) => setNewAllergy(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                placeholder="Ajouter une allergie..."
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
                            />
                            <button
                                type="button"
                                onClick={addAllergy}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                Ajouter
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {data.allergies.map((allergy, index) => (
                                <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm flex items-center gap-2">
                                    ⚠️ {allergy}
                                    <button
                                        type="button"
                                        onClick={() => removeAllergy(index)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                            {data.allergies.length === 0 && (
                                <span className="text-gray-400 text-sm">Aucune allergie enregistrée</span>
                            )}
                        </div>
                    </div>

                    {/* Antécédents médicaux */}
                    <div className="border-t pt-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Antécédents médicaux</h2>
                        
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={newHistory}
                                onChange={(e) => setNewHistory(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                placeholder="Ajouter un antécédent..."
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHistory())}
                            />
                            <button
                                type="button"
                                onClick={addHistory}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                Ajouter
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {data.medical_history.map((history, index) => (
                                <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm flex items-center gap-2">
                                    {history}
                                    <button
                                        type="button"
                                        onClick={() => removeHistory(index)}
                                        className="text-yellow-600 hover:text-yellow-800"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                            {data.medical_history.length === 0 && (
                                <span className="text-gray-400 text-sm">Aucun antécédent enregistré</span>
                            )}
                        </div>
                    </div>

                    {/* Traitements actuels */}
                    <div className="border-t pt-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Traitements actuels</h2>
                        
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={newTreatment}
                                onChange={(e) => setNewTreatment(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                placeholder="Ajouter un traitement..."
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTreatment())}
                            />
                            <button
                                type="button"
                                onClick={addTreatment}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                Ajouter
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {data.current_treatments.map((treatment, index) => (
                                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2">
                                    💊 {treatment}
                                    <button
                                        type="button"
                                        onClick={() => removeTreatment(index)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                            {data.current_treatments.length === 0 && (
                                <span className="text-gray-400 text-sm">Aucun traitement en cours</span>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6 border-t">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 font-medium"
                        >
                            {processing ? 'Enregistrement...' : '✅ Enregistrer les modifications'}
                        </button>
                    </div>
                </form>
            </div>
        </PatientLayout>
    );
}