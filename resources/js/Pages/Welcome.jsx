import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="Bienvenue" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="mb-8">
                        <div className="inline-block w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6">
                            <span className="text-6xl">🏥</span>
                        </div>
                        <h1 className="text-5xl font-bold text-white mb-4">
                            Medical App Secure
                        </h1>
                        <p className="text-xl text-blue-100 mb-8">
                            Gestion sécurisée de dossiers médicaux avec chiffrement AES-256
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6">
                            <div className="text-4xl mb-3">🔒</div>
                            <h3 className="text-lg font-bold text-white mb-2">Chiffrement AES-256</h3>
                            <p className="text-sm text-blue-100">
                                Toutes vos données médicales sont chiffrées
                            </p>
                        </div>

                        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6">
                            <div className="text-4xl mb-3">🛡️</div>
                            <h3 className="text-lg font-bold text-white mb-2">Authentification 2FA</h3>
                            <p className="text-sm text-blue-100">
                                Double protection pour votre compte
                            </p>
                        </div>

                        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6">
                            <div className="text-4xl mb-3">✅</div>
                            <h3 className="text-lg font-bold text-white mb-2">Conforme RGPD</h3>
                            <p className="text-sm text-blue-100">
                                Respect total de vos données personnelles
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/login"
                                className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition"
                            >
                                Se connecter
                            </Link>
                            <Link
                                href="/register"
                                className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-400 transition"
                            >
                                S'inscrire (Patient)
                            </Link>
                        </div>
                        
                        <p className="text-blue-100">
                            Vous êtes médecin ?{' '}
                            <Link href="/register/doctor" className="text-white font-semibold hover:underline">
                                Demander un compte
                            </Link>
                        </p>
                    </div>

                    <div className="mt-12 text-blue-100 text-sm">
                        <p>© 2025 Medical App Secure - Projet Académique</p>
                    </div>
                </div>
            </div>
        </>
    );
}