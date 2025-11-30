import { Head, Link } from '@inertiajs/react';
import PatientLayout from '@/Layouts/PatientLayout';

export default function PrescriptionDetails({
    id,
    prescription_date,
    valid_until,
    status,
    is_active,
    days_remaining,
    doctor_name,
    doctor_specialty,
    doctor_rpps,
    instructions,
    medical_record_title,
    medical_record_date,
    medications,
    patient_name,
    patient_birth_date,
    patient_age,
}) {
    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = () => {
        alert('Fonctionnalité de téléchargement PDF à venir');
    };

    return (
        <PatientLayout user={{ name: patient_name }}>
            <Head title="Détails Ordonnance" />

            <div className="max-w-4xl mx-auto">
                <Link
                    href="/patient/prescriptions"
                    className="text-blue-600 hover:underline mb-4 inline-block"
                >
                    ← Retour à mes ordonnances
                </Link>

                {/* En-tête d'impression */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-6 print:shadow-none">
                    <div className="flex justify-between items-start mb-6 pb-6 border-b-2 border-gray-200">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                🏥 ORDONNANCE MÉDICALE
                            </h1>
                            <p className="text-sm text-gray-600">
                                Ordonnance n° {id}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-gray-900">Dr. {doctor_name}</p>
                            <p className="text-sm text-gray-600">{doctor_specialty}</p>
                            <p className="text-xs text-gray-500">RPPS: {doctor_rpps}</p>
                        </div>
                    </div>

                    {/* Statut */}
                    <div className="mb-6 print:hidden">
                        {is_active ? (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <p className="text-green-900 font-medium">
                                    ✅ Cette ordonnance est active et valable encore {days_remaining} jour{days_remaining > 1 ? 's' : ''}
                                </p>
                            </div>
                        ) : status === 'cancelled' ? (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-900 font-medium">
                                    ❌ Cette ordonnance a été annulée
                                </p>
                            </div>
                        ) : (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <p className="text-gray-900 font-medium">
                                    ⏰ Cette ordonnance est expirée
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Informations Patient */}
                    <div className="mb-6 pb-6 border-b">
                        <h2 className="text-lg font-bold text-gray-900 mb-3">👤 Patient</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Nom</p>
                                <p className="font-medium text-gray-900">{patient_name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Date de naissance</p>
                                <p className="font-medium text-gray-900">{patient_birth_date} ({patient_age} ans)</p>
                            </div>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="mb-6 pb-6 border-b">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Date de prescription</p>
                                <p className="font-medium text-gray-900">📅 {prescription_date}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Valable jusqu'au</p>
                                <p className="font-medium text-gray-900">📅 {valid_until}</p>
                            </div>
                        </div>
                        {medical_record_title && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-600">Consultation associée</p>
                                <p className="font-medium text-gray-900">
                                    {medical_record_title} ({medical_record_date})
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Médicaments */}
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">💊 Médicaments Prescrits</h2>
 
                        <div className="space-y-4">
                            {medications.map((med, index) => (
                                <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="font-bold text-gray-900 text-lg">
                                            {index + 1}. {med.name}
                                        </p>
                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                            {med.dosage}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-700 space-y-1">
                                        <p><strong>Posologie :</strong> {med.posology}</p>
                                        <p><strong>Durée du traitement :</strong> {med.duration_days} jour{med.duration_days > 1 ? 's' : ''}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Instructions */}
                    {instructions && (
                        <div className="mb-6 pb-6 border-b">
                            <h2 className="text-lg font-bold text-gray-900 mb-3">📝 Instructions Complémentaires</h2>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-gray-700">{instructions}</p>
                            </div>
                        </div>
                    )}

                    {/* Signature (pour impression) */}
                    <div className="mt-8 pt-6 border-t print:block hidden">
                        <div className="text-right">
                            <p className="text-sm text-gray-600 mb-4">Fait le {prescription_date}</p>
                            <p className="font-bold text-gray-900">Dr. {doctor_name}</p>
                            <p className="text-sm text-gray-600">Signature et cachet</p>
                        </div>
                    </div>

                    {/* Boutons Actions */}
                    <div className="flex gap-4 mt-6 print:hidden">
                        <button
                            onClick={handlePrint}
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                        >
                            🖨️ Imprimer
                        </button>
                        <button
                            onClick={handleDownloadPDF}
                            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
                        >
                            📥 Télécharger PDF
                        </button>
                        <Link
                            href="/patient/prescriptions"
                            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium text-center"
                        >
                            Retour
                        </Link>
                    </div>
                </div>

                {/* Avertissement */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 print:hidden">
                    <p className="text-sm text-orange-900">
                        ⚠️ <strong>Important :</strong> Cette ordonnance est un document médical confidentiel. 
                        Ne la partagez qu'avec des professionnels de santé autorisés.
                    </p>
                </div>
            </div>
        </PatientLayout>
    );
}