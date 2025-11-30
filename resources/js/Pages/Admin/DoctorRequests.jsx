import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function DoctorRequests({ requests }) {
    
    const handleApprove = (id) => {
        if (confirm('Êtes-vous sûr de vouloir valider ce médecin ?')) {
            router.post(`/admin/doctors/${id}/approve`);
        }
    };

    const handleReject = (id) => {
        const reason = prompt('Raison du rejet (optionnel) :');
        if (confirm('Êtes-vous sûr de vouloir rejeter cette demande ?')) {
            router.post(`/admin/doctors/${id}/reject`, {
                reason: reason || 'Non spécifié'
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Demandes Médecins" />
            
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Demandes de Comptes Médecins
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                    {requests.length} demande(s) en attente de validation
                </p>
            </div>

            {requests && requests.length > 0 ? (
                <div className="space-y-6">
                    {requests.map((request) => (
                        <div key={request.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                                            Dr
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">{request.doctor_name}</h3>
                                            <p className="text-sm text-gray-500">{request.specialty}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="font-medium text-gray-900">{request.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Numéro RPPS</p>
                                            <p className="font-medium text-gray-900">{request.rpps_number}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Spécialité</p>
                                            <p className="font-medium text-gray-900">{request.specialty}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Date de demande</p>
                                            <p className="font-medium text-gray-900">{request.requested_at}</p>
                                        </div>
                                    </div>

                                    {request.diploma_path && (
                                        <div className="mb-4">
                                            <p className="text-sm text-gray-500 mb-2">Diplôme</p>
                                            <a 
                                                href={`/storage/${request.diploma_path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                                            >
                                                📄 Télécharger le diplôme PDF
                                            </a>
                                        </div>
                                    )}
                                </div>

                                <div className="ml-4 flex flex-col space-y-2">
                                    <button
                                        onClick={() => handleApprove(request.id)}
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                                    >
                                        ✅ Valider
                                    </button>
                                    <button
                                        onClick={() => handleReject(request.id)}
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                                    >
                                        ❌ Rejeter
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune demande en attente</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Toutes les demandes de comptes médecins ont été traitées.
                    </p>
                </div>
            )}
        </AdminLayout>
    );
}