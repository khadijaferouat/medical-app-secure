import { Head } from '@inertiajs/react';
import PatientLayout from '@/Layouts/PatientLayout';

export default function MyMedicalRecord({ patient, consultations, prescriptions }) {
    return (
        <PatientLayout>
            <Head title="Mon Dossier Médical" />

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Mon Dossier Médical</h1>
                
                <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
                        🔒 Données chiffrées AES-256
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                        📋 Lecture seule
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded text-sm font-medium">
                        ✅ RGPD
                    </span>
                </div>
            </div>

            {/* Patient Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Informations Générales</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                        <p className="text-sm text-gray-500">Nom</p>
                        <p className="font-medium text-gray-900">{patient.name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Date de Naissance</p>
                        <p className="font-medium text-gray-900">{patient.birth_date} ({patient.age} ans)</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Sexe</p>
                        <p className="font-medium text-gray-900">
                            {patient.gender === 'M' ? 'Masculin' : patient.gender === 'F' ? 'Féminin' : 'Autre'}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Groupe Sanguin</p>
                        <p className="font-medium text-gray-900">{patient.blood_type || 'Non renseigné'}</p>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                </div>
            </div>

            {/* Consultations */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Mes Consultations</h2>
                    <span className="text-sm text-gray-500">
                        {consultations ? consultations.length : 0} consultation(s)
                    </span>
                </div>

                {consultations && consultations.length > 0 ? (
                    <div className="space-y-4">
                        {consultations.map((consultation) => (
                            <div key={consultation.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-bold text-gray-900">{consultation.title}</h3>
                                        <p className="text-sm text-gray-500">
                                            📅 {consultation.date} - 👨‍⚕️ {consultation.doctor_name} ({consultation.doctor_specialty})
                                        </p>
                                    </div>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                        🔒 Chiffré
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div className="bg-gray-50 p-3 rounded">
                                        <p className="font-medium text-gray-700 mb-1">Symptômes</p>
                                        <p className="text-gray-600">{consultation.symptoms}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded">
                                        <p className="font-medium text-gray-700 mb-1">Diagnostic</p>
                                        <p className="text-gray-600">{consultation.diagnosis}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded">
                                        <p className="font-medium text-gray-700 mb-1">Traitement</p>
                                        <p className="text-gray-600">{consultation.treatment}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune consultation</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Vous n'avez pas encore de consultations enregistrées
                        </p>
                    </div>
                )}
            </div>

            {/* Prescriptions */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Mes Ordonnances</h2>
                    <span className="text-sm text-gray-500">
                        {prescriptions ? prescriptions.length : 0} ordonnance(s)
                    </span>
                </div>

                {prescriptions && prescriptions.length > 0 ? (
                    <div className="space-y-4">
                        {prescriptions.map((prescription) => (
                            <div key={prescription.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            Ordonnance du {prescription.date}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Par {prescription.doctor_name}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded text-sm font-medium ${
                                        prescription.status === 'active' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {prescription.status === 'active' 
                                            ? `✅ Valable ${prescription.days_remaining} jours` 
                                            : '❌ Expirée'}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    {prescription.medications && prescription.medications.map((med, index) => (
                                        <div key={index} className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
                                            <p className="font-medium text-gray-900">
                                                💊 {med.name} {med.dosage}
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">{med.posology}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-3 flex space-x-2">
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                                        📄 Voir Détails
                                    </button>
                                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">
                                        🖨️ Imprimer
                                    </button>
                                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">
                                        📥 Télécharger PDF
                                    </button>
                                </div>
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
                            Vous n'avez pas encore d'ordonnances enregistrées
                        </p>
                    </div>
                )}
            </div>
        </PatientLayout>
    );
}