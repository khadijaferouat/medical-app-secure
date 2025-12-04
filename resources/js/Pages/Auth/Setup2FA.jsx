import { Head, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react'; // ← AJOUTEZ CETTE LIGNE

export default function Setup2FA({ qrCodeUrl, secret }) {
    const { data, setData, post, processing, errors } = useForm({
        secret: secret,
        one_time_password: '',
    });

    const [showSecret, setShowSecret] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('2fa.enable'));
    };

    return (
        <GuestLayout>
            <Head title="Configuration 2FA" />

            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                Activer l'authentification à deux facteurs
            </h3>

            <div className="space-y-6">
                {/* Étape 1 */}
                <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                        1️⃣ Installer Google Authenticator
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                        Téléchargez l'application sur votre smartphone :
                    </p>
                    <div className="flex space-x-4">
                        <a 
                            href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
                            target="_blank"
                            className="text-sm text-blue-600 hover:underline"
                        >
                            📱 Android
                        </a>
                        <a 
                            href="https://apps.apple.com/app/google-authenticator/id388497605"
                            target="_blank"
                            className="text-sm text-blue-600 hover:underline"
                        >
                            🍎 iOS
                        </a>
                    </div>
                </div>

                {/* Étape 2 - QR CODE CORRIGÉ */}
                <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                        2️⃣ Scanner le QR Code
                    </h4>
                    <div className="bg-white p-6 rounded-lg border-2 border-gray-200 flex justify-center">
                        <QRCodeSVG 
                            value={qrCodeUrl} 
                            size={200}
                            level="H"
                            includeMargin={true}
                        />
                    </div>
                    
                    <div className="mt-3 text-center">
                        <button
                            type="button"
                            onClick={() => setShowSecret(!showSecret)}
                            className="text-sm text-blue-600 hover:underline"
                        >
                            {showSecret ? '🙈 Masquer' : '👁️ Afficher'} la clé secrète
                        </button>
                        {showSecret && (
                            <div className="mt-3 p-3 bg-gray-100 rounded text-sm font-mono break-all">
                                {secret}
                            </div>
                        )}
                    </div>
                </div>

                {/* Étape 3 */}
                <form onSubmit={handleSubmit}>
                    <h4 className="font-semibold text-gray-900 mb-2">
                        3️⃣ Entrer le code de vérification
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                        Entrez le code à 6 chiffres affiché dans Google Authenticator
                    </p>
                    <input
                        type="text"
                        value={data.one_time_password}
                        onChange={(e) => setData('one_time_password', e.target.value.replace(/\D/g, ''))}
                        placeholder="000000"
                        maxLength="6"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md text-center text-3xl tracking-widest font-mono"
                        autoFocus
                    />
                    {errors.one_time_password && (
                        <p className="text-red-600 text-sm mt-2 text-center">{errors.one_time_password}</p>
                    )}

                    <button
                        type="submit"
                        disabled={processing || data.one_time_password.length !== 6}
                        className="w-full mt-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                    >
                        {processing ? 'Vérification...' : 'Activer le 2FA 🔐'}
                    </button>
                </form>
            </div>
        </GuestLayout>
    );
}