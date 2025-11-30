import { Head, useForm, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function RegisterDoctor() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        rpps_number: '',
        specialty: '',
        diploma: null,
    });

const handleSubmit = (e) => {
    e.preventDefault();
    
    // Créer un FormData pour envoyer le fichier
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('password_confirmation', data.password_confirmation);
    formData.append('rpps_number', data.rpps_number);
    formData.append('specialty', data.specialty);
    
    if (data.diploma) {
        formData.append('diploma', data.diploma);
    }
    
    // Envoyer avec post (Inertia gère FormData automatiquement)
    post(route('register.doctor'), {
        data: formData,
        forceFormData: true,
        onSuccess: () => {
            console.log('Inscription réussie !');
        },
        onError: (errors) => {
            console.error('Erreurs:', errors);
        }
    });
};

    return (
        <GuestLayout>
            <Head title="Demande Compte Médecin" />

            <h3 className="text-xl font-bold text-gray-900 mb-6">
                Demande de Compte Médecin
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
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Email professionnel *
                    </label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Numéro RPPS *
                    </label>
                    <input
                        type="text"
                        value={data.rpps_number}
                        onChange={(e) => setData('rpps_number', e.target.value)}
                        placeholder="11 chiffres"
                        maxLength="11"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Répertoire Partagé des Professionnels de Santé
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Spécialité *
                    </label>
                    <select
                        value={data.specialty}
                        onChange={(e) => setData('specialty', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                    >
                        <option value="">Sélectionner...</option>
                        <option value="Généraliste">Médecin Généraliste</option>
                        <option value="Cardiologue">Cardiologue</option>
                        <option value="Dermatologue">Dermatologue</option>
                        <option value="Pédiatre">Pédiatre</option>
                        <option value="Pneumologue">Pneumologue</option>
                        <option value="Gynécologue">Gynécologue</option>
                        <option value="ORL">ORL</option>
                        <option value="Ophtalmologue">Ophtalmologue</option>
                        <option value="Autre">Autre</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Diplôme (PDF) *
                    </label>
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setData('diploma', e.target.files[0])}
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Maximum 5 Mo
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Mot de passe *
                    </label>
                    <input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Confirmer mot de passe *
                    </label>
                    <input
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                    <p className="text-sm text-yellow-800">
                        ℹ️ Votre demande sera examinée par un administrateur. Vous recevrez un email de confirmation.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    {processing ? 'Envoi...' : 'Envoyer la demande'}
                </button>

                <p className="text-center text-sm text-gray-600">
                    <Link href="/login" className="text-blue-600 hover:underline">
                        Retour à la connexion
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}