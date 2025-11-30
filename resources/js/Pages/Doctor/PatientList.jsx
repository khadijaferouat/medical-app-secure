import { Head, Link } from '@inertiajs/react';
import DoctorLayout from '@/Layouts/DoctorLayout';

export default function PatientList({ patients }) {
    return (
        <DoctorLayout>
            <Head title="Mes Patients" />

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Mes Patients</h1>
                <p className="mt-2 text-sm text-gray-600">
                    Liste des patients pour lesquels vous avez une autorisation d'accès
                </p>
            </div>

            {/* Search & Filters */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <input
                            type="text"
                            placeholder="Rechercher un patient..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                            <option value="">Tous les patients</option>
                            <option value="recent">Vus récemment</option>
                            <option value="urgent">Cas urgents</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Patients List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {patients && patients.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                        {patients.map((patient) => (
                            <div key={patient.id} className="border rounded-lg p-4 hover:shadow-lg transition">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-bold text-gray-900">{patient.name}</h3>
                                        <p className="text-sm text-gray-500">{patient.email}</p>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                            {patient.blood_type}
                                        </span>
                                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                            🔒
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span>Date de naissance:</span>
                                        <span className="font-medium">{patient.birth_date}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Dernière visite:</span>
                                        <span className="font-medium">{patient.last_visit || 'Jamais'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Téléphone:</span>
                                        <span className="font-medium">{patient.phone}</span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-gray-500">Niveau d'accès:</span>
                                        <span className={`px-2 py-1 text-xs rounded ${
                                            patient.authorization_level === 'write' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {patient.authorization_level === 'write' ? 'Lecture/Écriture' : 'Lecture seule'}
                                        </span>
                                    </div>
                                    <Link
                                        href={`/doctor/patients/${patient.id}`}
                                        className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm block text-center"
                                    >
                                        Voir le Dossier
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun patient</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Vous n'avez pas encore de patients autorisés ou aucun patient ne vous a donné accès à son dossier.
                        </p>
                    </div>
                )}
            </div>
        </DoctorLayout>
    );
}