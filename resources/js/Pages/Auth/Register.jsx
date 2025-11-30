import { Head, useForm, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        birth_date: '',
        phone: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        console.log('📤 Envoi du formulaire patient...', data);
        
        post(route('register'), {
            onSuccess: () => {
                console.log('✅ Inscription réussie !');
            },
            onError: (errors) => {
                console.error('❌ Erreurs:', errors);
            }
        });
    };

    return (
        <GuestLayout>
            <Head title="Inscription Patient" />

            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                Inscription Patient
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Nom complet *
                    </label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                    {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Email *
                    </label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                    {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Date de naissance *
                    </label>
                    <input
                        type="date"
                        value={data.birth_date}
                        onChange={(e) => setData('birth_date', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                    {errors.birth_date && <p className="text-red-600 text-sm mt-1">{errors.birth_date}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Téléphone
                    </label>
                    <input
                        type="tel"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        placeholder="0612345678"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Mot de passe *
                    </label>
                    <input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Min 8 caractères, 1 majuscule, 1 chiffre
                    </p>
                    {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Confirmer mot de passe *
                    </label>
                    <input
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                    {errors.password_confirmation && <p className="text-red-600 text-sm mt-1">{errors.password_confirmation}</p>}
                </div>

                {errors.error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                        <p className="text-sm text-red-800">{errors.error}</p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {processing ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Inscription en cours...
                        </>
                    ) : (
                        "S'inscrire"
                    )}
                </button>

                <p className="text-center text-sm text-gray-600">
                    Déjà un compte ?{' '}
                    <Link href={route('login')} className="text-blue-600 hover:underline font-medium">
                        Se connecter
                    </Link>
                </p>

                <p className="text-center text-sm text-gray-600">
                    Vous êtes médecin ?{' '}
                    <Link href={route('register.doctor')} className="text-blue-600 hover:underline font-medium">
                        Demander un compte
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}