import { Head, useForm, Link } from '@inertiajs/react';
import DoctorLayout from '@/Layouts/DoctorLayout';
import { useState } from 'react';

export default function CreatePrescription({ patient, recentRecords }) {
    const { data, setData, post, processing, errors } = useForm({
        medical_record_id: '',
        prescription_date: new Date().toISOString().split('T')[0],
        valid_until: '',
        instructions: '',
        medications: [
            { name: '', dosage: '', posology: '', duration_days: '' }
        ],
    });

    const addMedication = () => {
        setData('medications', [
            ...data.medications,
            { name: '', dosage: '', posology: '', duration_days: '' }
        ]);
    };

    const removeMedication = (index) => {
        const newMedications = data.medications.filter((_, i) => i !== index);
        setData('medications', newMedications);
    };

    const updateMedication = (index, field, value) => {
        const newMedications = [...data.medications];
        newMedications[index][field] = value;
        setData('medications', newMedications);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/doctor/patients/${patient.id}/prescription`);
    };

    const handlePrescriptionDateChange = (date) => {
        setData('prescription_date', date);
        if (!data.valid_until) {
            const validUntil = new Date(date);
            validUntil.setFullYear(validUntil.getFullYear() + 1);
            setData('valid_until', validUntil.toISOString().split('T')[0]);
        }
    };

    return (
        <DoctorLayout>
            <Head title="Créer une Ordonnance" />

            <div className="max-w-4xl mx-auto">
                <Link 
                    href={`/doctor/patients/${patient.id}`}
                    className="text-blue-600 hover:underline mb-4 inline-block"
                >
                    ← Retour au dossier patient
                </Link>

                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">
                        Nouvelle Ordonnance - {patient.name}
                    </h1>

                    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-900">
                            👤 {patient.name} | 🩸 {patient.blood_type} | 🎂 {patient.age} ans
                        </p>
                        {patient.allergies && patient.allergies.length > 0 && (
                            <div className="mt-2">
                                <p className="text-sm font-medium text-red-900">⚠️ Allergies:</p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {patient.allergies.map((allergy, index) => (
                                        <span key={index} className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                                            {allergy}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date de prescription *
                                </label>
                                <input
                                    type="date"
                                    value={data.prescription_date}
                                    onChange={(e) => handlePrescriptionDateChange(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                {errors.prescription_date && <p className="text-red-600 text-sm mt-1">{errors.prescription_date}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Valable jusqu'au *
                                </label>
                                <input
                                    type="date"
                                    value={data.valid_until}
                                    onChange={(e) => setData('valid_until', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                {errors.valid_until && <p className="text-red-600 text-sm mt-1">{errors.valid_until}</p>}
                            </div>

                            {recentRecords && recentRecords.length > 0 && (
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Lier à un dossier médical (optionnel)
                                    </label>
                                    <select
                                        value={data.medical_record_id}
                                        onChange={(e) => setData('medical_record_id', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Aucun</option>
                                        {recentRecords.map((record) => (
                                            <option key={record.id} value={record.id}>
                                                {record.title} - {record.consultation_date}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="border-t pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-gray-900">💊 Médicaments</h3>
                                <button
                                    type="button"
                                    onClick={addMedication}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                                >
                                    + Ajouter un médicament
                                </button>
                            </div>

                            {errors.medications && <p className="text-red-600 text-sm mb-4">{errors.medications}</p>}

                            <div className="space-y-4">
                                {data.medications.map((medication, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-medium text-gray-900">Médicament {index + 1}</h4>
                                            {data.medications.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeMedication(index)}
                                                    className="text-red-600 hover:text-red-800 text-sm"
                                                >
                                                    🗑️ Supprimer
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Nom du médicament *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={medication.name}
                                                    onChange={(e) => updateMedication(index, 'name', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Ex: Doliprane"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Dosage *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={medication.dosage}
                                                    onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Ex: 1000mg"
                                                    required
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Posologie *
                                                </label>
                                                <textarea
                                                    value={medication.posology}
                                                    onChange={(e) => updateMedication(index, 'posology', e.target.value)}
                                                    rows="2"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Ex: 1 comprimé 3 fois par jour"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Durée (jours) *
                                                </label>
                                                <input
                                                    type="number"
                                                    value={medication.duration_days}
                                                    onChange={(e) => updateMedication(index, 'duration_days', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Ex: 7"
                                                    min="1"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Instructions complémentaires
                            </label>
                            <textarea
                                value={data.instructions}
                                onChange={(e) => setData('instructions', e.target.value)}
                                rows="3"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Consignes particulières..."
                            />
                        </div>

                        <div className="flex gap-4 pt-6 border-t">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
                            >
                                {processing ? 'Création en cours...' : '✅ Créer l\'Ordonnance'}
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