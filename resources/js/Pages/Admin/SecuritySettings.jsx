import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function SecuritySettings({ user }) {
    return (
        <AdminLayout user={user}>
            <Head title="Paramètres de sécurité" />

            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                🔒 Paramètres de sécurité
            </h1>

            {/* Section 2FA */}
            <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                    🔐 Authentification à deux facteurs (2FA)
                </h3>
                
                {user.google2fa_enabled ? (
                    <div>
                        <div className="flex items-center mb-4">
                            <span className="text-green-600 mr-3 text-3xl">✅</span>
                            <div>
                                <p className="text-lg text-green-600 font-semibold">
                                    L'authentification à deux facteurs est activée
                                </p>
                                <p className="text-sm text-gray-600">
                                    Votre compte administrateur est protégé par le 2FA
                                </p>
                            </div>
                        </div>
                        
                        <div className="bg-green-50 border border-green-200 rounded-md p-4 mt-4">
                            <p className="text-sm text-green-800">
                                ✅ Excellent ! La sécurité de tous les comptes et données sensibles est renforcée.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-800 font-semibold">
                                        ⚠️ Attention : Votre compte administrateur n'est pas protégé par le 2FA
                                    </p>
                                    <p className="text-sm text-red-700 mt-2">
                                        En tant qu'administrateur, vous avez accès à tous les comptes et données sensibles. 
                                        Il est fortement recommandé d'activer l'authentification à deux facteurs.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                            <h4 className="font-semibold text-blue-900 mb-2">Pourquoi activer le 2FA ?</h4>
                            <ul className="text-sm text-blue-800 space-y-2">
                                <li>✅ Protection contre le vol de mot de passe</li>
                                <li>✅ Sécurité renforcée pour l'accès admin</li>
                                <li>✅ Conformité RGPD pour les données de santé</li>
                                <li>✅ Traçabilité et audit de sécurité</li>
                            </ul>
                        </div>

                        <Link
                            href={route('2fa.setup')}
                            className="inline-block px-8 py-4 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold text-lg"
                        >
                            🔐 Activer le 2FA maintenant
                        </Link>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}