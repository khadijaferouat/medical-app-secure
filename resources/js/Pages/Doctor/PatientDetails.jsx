import { Head, Link, router } from '@inertiajs/react';
import DoctorLayout from '@/Layouts/DoctorLayout';

export default function PatientDetails({ patient, authorization, medicalRecords, prescriptions }) {
    
    const handleDeleteRecord = (recordId) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce dossier médical ?')) {
            router.delete(`/doctor/medical-records/${recordId}`);
        }
    };

    const handleCancelPrescription = (prescriptionId) => {
        if (confirm('Êtes-vous sûr de vouloir annuler cette ordonnance ?')) {
            router.post(`/doctor/prescriptions/${prescriptionId}/cancel`);
        }
    };

    return (
        <DoctorLayout>
            <Head title={`Dossier - ${patient.name}`} />

            {/* Header avec actions */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <Link 
                        href="/doctor/patients"
                        className="text-blue-600 hover:underline mb-2 inline-block"
                    >
                        ← Retour à la liste
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Dossier de {patient.name}
                    </h1>
                </div>
                
                <div className="flex gap-2">
                    {authorization.can_write ? (
                        <>
                            <Link
                                href={`/doctor/patients/${patient.id}/record/create`}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                📋 Nouveau Dossier
                            </Link>
                            <Link
                                href={`/doctor/patients/${patient.id}/prescription/create`}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                💊 Nouvelle Ordonnance
                            </Link>
                        </>
                    ) : (
                        <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md text-sm">
                            🔒 Accès lecture seule
                        </span>
                    )}
                </div>
            </div>

            {/* Informations patient */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Informations Patient</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div>
                        <p className="text-sm text-gray-500">Nom</p>
                        <p className="font-medium text-gray-900">{patient.name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Âge</p>
                        <p className="font-medium text-gray-900">{patient.age} ans</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Groupe Sanguin</p>
                        <p className="font-medium text-gray-900">{patient.blood_type || 'Non renseigné'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Sexe</p>
                        <p className="font-medium text-gray-900">
                            {patient.gender === 'M' ? 'Masculin' : patient.gender === 'F' ? 'Féminin' : 'Non renseigné'}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t">
                    <div>
                        <p className="text-sm text-gray-500 mb-2">Allergies</p>
                        <div className="flex flex-wrap gap-2">
                            {patient.allergies && patient.allergies.length > 0 ? (
                                patient.allergies.map((allergy, index) => (
                                    <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                                        ⚠️ {allergy}
                                    </span>
                                ))
                            ) : (
                                <span className="text-gray-400 text-sm">Aucune allergie connue</span>
                            )}
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500 mb-2">Antécédents Médicaux</p>
                        <div className="flex flex-wrap gap-2">
                            {patient.medical_history && patient.medical_history.length > 0 ? (
                                patient.medical_history.map((history, index) => (
                                    <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                                        {history}
                                    </span>
                                ))
                            ) : (
                                <span className="text-gray-400 text-sm">Aucun antécédent</span>
                            )}
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500 mb-2">Traitements Actuels</p>
                        <div className="flex flex-wrap gap-2">
                            {patient.current_treatments && patient.current_treatments.length > 0 ? (
                                patient.current_treatments.map((treatment, index) => (
                                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                        💊 {treatment}
                                    </span>
                                ))
                            ) : (
                                <span className="text-gray-400 text-sm">Aucun traitement</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Autorisation d'accès */}
                <div className="mt-6 pt-6 border-t">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Niveau d'accès</p>
                            <p className="font-medium text-gray-900">
                                {authorization.access_level === 'write' ? 'Lecture/Écriture' : 'Lecture seule'}
                            </p>
                        </div>
                        {authorization.valid_until && (
                            <div>
                                <p className="text-sm text-gray-500">Autorisation valide jusqu'au</p>
                                <p className="font-medium text-gray-900">{authorization.valid_until}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Dossiers Médicaux */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Dossiers Médicaux</h2>
                    <span className="text-sm text-gray-500">
                        {medicalRecords.length} dossier(s)
                    </span>
                </div>

                {medicalRecords && medicalRecords.length > 0 ? (
                    <div className="space-y-4">
                        {medicalRecords.map((record) => (
                            <div key={record.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-bold text-gray-900">{record.title}</h3>
                                        <p className="text-sm text-gray-500">
                                            📅 {record.consultation_date}
                                            {record.is_emergency && (
                                                <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                                                    🚨 Urgence
                                                </span>
                                            )}
                                            {record.consultation_type && (
                                                <span className="ml-2 text-gray-600">
                                                    | {record.consultation_type}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    {authorization.can_write && (
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/doctor/medical-records/${record.id}/edit`}
                                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                                            >
                                                ✏️ Modifier
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteRecord(record.id)}
                                                className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                                            >
                                                🗑️ Supprimer
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div className="bg-gray-50 p-3 rounded">
                                        <p className="font-medium text-gray-700 mb-1">Symptômes</p>
                                        <p className="text-gray-600">{record.symptoms}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded">
                                        <p className="font-medium text-gray-700 mb-1">Diagnostic</p>
                                        <p className="text-gray-600">{record.diagnosis}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded">
                                        <p className="font-medium text-gray-700 mb-1">Traitement</p>
                                        <p className="text-gray-600">{record.treatment}</p>
                                    </div>
                                </div>

                                {record.notes && (
                                    <div className="mt-3 bg-blue-50 p-3 rounded">
                                        <p className="font-medium text-blue-900 mb-1 text-sm">Notes complémentaires</p>
                                        <p className="text-blue-800 text-sm">{record.notes}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun dossier médical</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Vous n'avez pas encore créé de dossier pour ce patient
                        </p>
                        {authorization.can_write && (
                            <Link
                                href={`/doctor/patients/${patient.id}/record/create`}
                                className="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                Créer le premier dossier
                            </Link>
                        )}
                    </div>
                )}
            </div>

            {/* Ordonnances */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Ordonnances</h2>
                    <span className="text-sm text-gray-500">
                        {prescriptions.length} ordonnance(s)
                    </span>
                </div>

                {prescriptions && prescriptions.length > 0 ? (
                    <div className="space-y-4">
                        {prescriptions.map((prescription) => (
                            <div key={prescription.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            Ordonnance du {prescription.prescription_date}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Valide jusqu'au {prescription.valid_until}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded text-sm font-medium ${
                                            prescription.status === 'active' 
                                                ? 'bg-green-100 text-green-800' 
                                                : prescription.status === 'expired'
                                                ? 'bg-gray-100 text-gray-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {prescription.status === 'active' 
                                                ? `✅ Active (${prescription.days_remaining}j)` 
                                                : prescription.status === 'expired'
                                                ? '❌ Expirée'
                                                : '🚫 Annulée'}
                                        </span>
                                        {prescription.status === 'active' && authorization.can_write && (
                                            <button
                                                onClick={() => handleCancelPrescription(prescription.id)}
                                                className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                                            >
                                                Annuler
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {prescription.medications.map((med, index) => (
                                        <div key={index} className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
                                            <p className="font-medium text-gray-900">
                                                💊 {med.name} {med.dosage}
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">{med.posology}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Durée: {med.duration_days} jours
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {prescription.instructions && (
                                    <div className="mt-3 bg-yellow-50 p-3 rounded">
                                        <p className="font-medium text-yellow-900 mb-1 text-sm">Instructions</p>
                                        <p className="text-yellow-800 text-sm">{prescription.instructions}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune ordonnance</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Vous n'avez pas encore créé d'ordonnance pour ce patient
                        </p>
                        {authorization.can_write && (
                            <Link
                                href={`/doctor/patients/${patient.id}/prescription/create`}
                                className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Créer la première ordonnance
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </DoctorLayout>
    );
}