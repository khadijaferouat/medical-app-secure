import { Head, Link, router } from '@inertiajs/react';
import DoctorLayout from '@/Layouts/DoctorLayout';

export default function Activity({ user, activity }) {
    
    const getActivityIcon = (type) => {
        switch (type) {
            case 'medical_record':
                return '📋';
            case 'prescription':
                return '💊';
            case 'appointment':
                return '📅';
            default:
                return '📌';
        }
    };

    const getActivityColor = (type) => {
        switch (type) {
            case 'medical_record':
                return 'bg-blue-50 border-blue-200';
            case 'prescription':
                return 'bg-purple-50 border-purple-200';
            case 'appointment':
                return 'bg-green-50 border-green-200';
            default:
                return 'bg-gray-50 border-gray-200';
        }
    };

    return (
        <DoctorLayout user={user}>
            <Head title="Mon Activité" />

            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                📈 Mon Activité
            </h1>

            {/* Stats rapides */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Actions totales</p>
                            <p className="text-3xl font-bold text-blue-600">{activity.length}</p>
                        </div>
                        <div className="bg-blue-100 rounded-full p-3">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Dossiers médicaux</p>
                            <p className="text-3xl font-bold text-green-600">
                                {activity.filter(a => a.type === 'medical_record').length}
                            </p>
                        </div>
                        <div className="bg-green-100 rounded-full p-3">
                            <span className="text-3xl">📋</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Ordonnances</p>
                            <p className="text-3xl font-bold text-purple-600">
                                {activity.filter(a => a.type === 'prescription').length}
                            </p>
                        </div>
                        <div className="bg-purple-100 rounded-full p-3">
                            <span className="text-3xl">💊</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Liste d'activité */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b">
                    <h2 className="text-lg font-bold text-gray-900">Activité récente</h2>
                    <p className="text-sm text-gray-500 mt-1">Vos 20 dernières actions</p>
                </div>

                {activity.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                        {activity.map((item, index) => (
                            <div key={index} className={`p-4 hover:bg-gray-50 transition border-l-4 ${getActivityColor(item.type)}`}>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3 flex-1">
                                        <div className="mt-1">
                                            <span className="text-2xl">{getActivityIcon(item.type)}</span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">{item.title}</h3>
                                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                            <p className="text-xs text-gray-500 mt-2">
                                                📅 {item.date}
                                            </p>
                                        </div>
                                    </div>
                                    {item.link && (
                                        <Link
                                            href={item.link}
                                            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm whitespace-nowrap"
                                        >
                                            Voir détails
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune activité</h3>
                        <p className="mt-1 text-sm text-gray-500">Vos actions récentes apparaîtront ici</p>
                    </div>
                )}
            </div>
        </DoctorLayout>
    );
}