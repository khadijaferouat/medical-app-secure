import { Head, useForm, usePage } from '@inertiajs/react';
import DoctorLayout from '@/Layouts/DoctorLayout';
import { useState } from 'react';

export default function Profile({ user, stats }) {
    const { flash } = usePage().props;
    const [editingProfile, setEditingProfile] = useState(false);
    const [editingPassword, setEditingPassword] = useState(false);

    const profileForm = useForm({
        name: user.name,
        email: user.email,
        specialty: user.specialty,
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        profileForm.put('/doctor/profile', {
            onSuccess: () => {
                setEditingProfile(false);
            },
        });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        passwordForm.put('/doctor/profile/password', {
            onSuccess: () => {
                setEditingPassword(false);
                passwordForm.reset();
            },
        });
    };

    return (
        <DoctorLayout user={user}>
            <Head title="Mon Profil" />

            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                ⚙️ Mon Profil
            </h1>

            {/* Messages Flash */}
            {flash?.success && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-800">{flash.success}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Statistiques */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">📊 Statistiques</h2>
                        
                        <div className="space-y-4">
                            <div className="border-b pb-3">
                                <p className="text-sm text-gray-500">Patients suivis</p>
                                <p className="text-2xl font-bold text-blue-600">{stats.total_patients}</p>
                            </div>
                            <div className="border-b pb-3">
                                <p className="text-sm text-gray-500">Consultations</p>
                                <p className="text-2xl font-bold text-green-600">{stats.total_consultations}</p>
                            </div>
                            <div className="border-b pb-3">
                                <p className="text-sm text-gray-500">Ordonnances</p>
                                <p className="text-2xl font-bold text-purple-600">{stats.total_prescriptions}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Actif depuis</p>
                                <p className="text-lg font-semibold text-gray-900">{stats.active_since}</p>
                                <p className="text-xs text-gray-500">({stats.days_active} jours)</p>
                            </div>
                        </div>
                    </div>

                    {/* Infos système */}
                    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">🔒 Informations système</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Statut</span>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    user.status === 'active' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {user.status === 'active' ? '✅ Actif' : '❌ Inactif'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">N° RPPS</span>
                                <span className="font-mono text-gray-900">{user.rpps_number}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Inscrit le</span>
                                <span className="text-gray-900">{user.created_at}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Informations personnelles */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Profil */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-900">👨‍⚕️ Informations personnelles</h2>
                            {!editingProfile && (
                                <button
                                    onClick={() => setEditingProfile(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                                >
                                    ✏️ Modifier
                                </button>
                            )}
                        </div>

                        {editingProfile ? (
                            <form onSubmit={handleProfileSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                                    <input
                                        type="text"
                                        value={profileForm.data.name}
                                        onChange={(e) => profileForm.setData('name', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {profileForm.errors.name && (
                                        <p className="text-red-600 text-sm mt-1">{profileForm.errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={profileForm.data.email}
                                        onChange={(e) => profileForm.setData('email', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {profileForm.errors.email && (
                                        <p className="text-red-600 text-sm mt-1">{profileForm.errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Spécialité</label>
                                    <input
                                        type="text"
                                        value={profileForm.data.specialty}
                                        onChange={(e) => profileForm.setData('specialty', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {profileForm.errors.specialty && (
                                        <p className="text-red-600 text-sm mt-1">{profileForm.errors.specialty}</p>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        disabled={profileForm.processing}
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                                    >
                                        ✅ Enregistrer
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingProfile(false);
                                            profileForm.reset();
                                        }}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                    >
                                        Annuler
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500">Nom complet</p>
                                    <p className="text-lg font-semibold text-gray-900">{user.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="text-lg font-semibold text-gray-900">{user.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Spécialité</p>
                                    <p className="text-lg font-semibold text-gray-900">{user.specialty}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Changer mot de passe */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-900">🔐 Sécurité</h2>
                            {!editingPassword && (
                                <button
                                    onClick={() => setEditingPassword(true)}
                                    className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 text-sm"
                                >
                                    🔑 Changer mot de passe
                                </button>
                            )}
                        </div>

                        {editingPassword ? (
                            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Mot de passe actuel
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordForm.data.current_password}
                                        onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                                        required
                                    />
                                    {passwordForm.errors.current_password && (
                                        <p className="text-red-600 text-sm mt-1">{passwordForm.errors.current_password}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nouveau mot de passe
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordForm.data.password}
                                        onChange={(e) => passwordForm.setData('password', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Min. 8 caractères, majuscules, minuscules et chiffres
                                    </p>
                                    {passwordForm.errors.password && (
                                        <p className="text-red-600 text-sm mt-1">{passwordForm.errors.password}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirmer le mot de passe
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordForm.data.password_confirmation}
                                        onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                                        required
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        disabled={passwordForm.processing}
                                        className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
                                    >
                                        ✅ Changer le mot de passe
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingPassword(false);
                                            passwordForm.reset();
                                        }}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                    >
                                        Annuler
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <p className="text-gray-600">
                                Votre mot de passe est sécurisé. Cliquez sur "Changer mot de passe" pour le modifier.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </DoctorLayout>
    );
}