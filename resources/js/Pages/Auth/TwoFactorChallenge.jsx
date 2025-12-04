import { Head, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function TwoFactorChallenge() {
    const { data, setData, post, processing, errors } = useForm({
        one_time_password: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('2fa.verify'));
    };

    return (
        <GuestLayout>
            <Head title="Vérification 2FA" />

            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🔐</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Vérification à deux facteurs
                </h3>
                <p className="text-sm text-gray-600">
                    Entrez le code de votre application d'authentification
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="text"
                        value={data.one_time_password}
                        onChange={(e) => setData('one_time_password', e.target.value)}
                        placeholder="000000"
                        maxLength="6"
                        className="w-full px-3 py-3 border border-gray-300 rounded-md text-center text-3xl tracking-widest"
                        autoFocus
                    />
                    {errors.one_time_password && (
                        <p className="text-red-600 text-sm mt-1 text-center">{errors.one_time_password}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold"
                >
                    {processing ? 'Vérification...' : 'Vérifier'}
                </button>

                <p className="text-center text-sm text-gray-600">
                    Vous pouvez aussi utiliser un code de récupération
                </p>
            </form>
        </GuestLayout>
    );
}