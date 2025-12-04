import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function RecoveryCodes({ recoveryCodes }) {
    const downloadCodes = () => {
        const text = recoveryCodes.join('\n');
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'recovery-codes.txt';
        a.click();
    };

    return (
        <GuestLayout>
            <Head title="Codes de récupération" />

            <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">✅</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    2FA activé avec succès !
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                    Sauvegardez ces codes de récupération en lieu sûr
                </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                <p className="text-sm text-yellow-800">
                    ⚠️ Ces codes ne seront affichés qu'une seule fois ! Sauvegardez-les maintenant.
                </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-2 gap-2">
                    {recoveryCodes.map((code, index) => (
                        <div key={index} className="font-mono text-sm text-center p-2 bg-white rounded">
                            {code}
                        </div>
                    ))}
                </div>
            </div>

            <button
                onClick={downloadCodes}
                className="w-full py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 mb-3"
            >
                📥 Télécharger les codes
            </button>

            <Link
                href={route('login')}
                className="block text-center text-blue-600 hover:underline"
            >
                Continuer vers la connexion
            </Link>
        </GuestLayout>
    );
}