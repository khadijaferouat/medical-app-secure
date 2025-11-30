import { Head, useForm, Link } from '@inertiajs/react';
import DoctorLayout from '@/Layouts/DoctorLayout';

export default function CreateMedicalRecord({ patient }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        consultation_date: new Date().toISOString().split('T')[0],
        symptoms: '',
        diagnosis: '',
        treatment: '',
        notes: '',
        is_emergency: false,
        consultation_type: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/doctor/patients/${patient.id}/record`);
    };

    return (
        <DoctorLayout>
            <Head title="Créer un Dossier Médical" />

            <div className="max-w-4xl mx-auto">
                <Link 
                    href={`/doctor/patients/${patient.id}`}
                    className="text-blue-600 hover:underline mb-4 inline-block"
                >
                    ← Retour au dossier patient
                </Link>

                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">
                        Nouveau Dossier Médical - {patient.name}
                    </h1>

                    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-900">
                            👤 {patient.name} | 🩸 {patient.blood_type} | 🎂 {patient.age} ans
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Titre de la consultation *
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Ex: Consultation de suivi, Urgence, etc."
                                    required
                                />
                                {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date de consultation *
                                </label>
                                <input
                                    type="date"
                                    value={data.consultation_date}
                                    onChange={(e) => setData('consultation_date', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                {errors.consultation_date && <p className="text-red-600 text-sm mt-1">{errors.consultation_date}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Type de consultation
                                </label>
                                <select
                                    value={data.consultation_type}
                                    onChange={(e) => setData('consultation_type', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Sélectionner...</option>
                                    <option value="Consultation générale">Consultation générale</option>
                                    <option value="Suivi">Suivi</option>
                                    <option value="Urgence">Urgence</option>
                                    <option value="Contrôle">Contrôle</option>
                                    <option value="Téléconsultation">Téléconsultation</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Symptômes *
                            </label>
                            <textarea
                                value={data.symptoms}
                                onChange={(e) => setData('symptoms', e.target.value)}
                                rows="4"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Décrire les symptômes observés..."
                                required
                            />
                            {errors.symptoms && <p className="text-red-600 text-sm mt-1">{errors.symptoms}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Diagnostic *
                            </label>
                            <textarea
                                value={data.diagnosis}
                                onChange={(e) => setData('diagnosis', e.target.value)}
                                rows="4"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Diagnostic établi..."
                                required
                            />
                            {errors.diagnosis && <p className="text-red-600 text-sm mt-1">{errors.diagnosis}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Traitement prescrit *
                            </label>
                            <textarea
                                value={data.treatment}
                                onChange={(e) => setData('treatment', e.target.value)}
                                rows="4"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Traitement recommandé..."
                                required
                            />
                            {errors.treatment && <p className="text-red-600 text-sm mt-1">{errors.treatment}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Notes complémentaires
                            </label>
                            <textarea
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                rows="3"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Observations additionnelles..."
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="is_emergency"
                                checked={data.is_emergency}
                                onChange={(e) => setData('is_emergency', e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="is_emergency" className="ml-2 block text-sm text-gray-900">
                                🚨 Marquer comme urgence
                            </label>
                        </div>

                        <div className="flex gap-4 pt-6 border-t">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                                {processing ? 'Création en cours...' : '✅ Créer le Dossier'}
                            </button>
                            <Link
                                href={`/doctor/patients/${patient.id}`}
                                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
                            >
                                Annuler
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </DoctorLayout>
    );
}