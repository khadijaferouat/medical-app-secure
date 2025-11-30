import { Head, useForm, Link } from '@inertiajs/react';
import PatientLayout from '@/Layouts/PatientLayout';

export default function CreateAppointment({ user, authorizedDoctors }) {
    const { data, setData, post, processing, errors } = useForm({
        doctor_id: '',
        appointment_date: '',
        appointment_time: '',
        location: 'cabinet',
        reason: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('patient.appointments.store'));
    };

    // Générer les créneaux horaires (8h-18h, toutes les 30min)
    const timeSlots = [];
    for (let hour = 8; hour <= 18; hour++) {
        timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
        if (hour < 18) {
            timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
        }
    }

    return (
        <PatientLayout user={user}>
            <Head title="Prendre Rendez-vous" />

            <div className="max-w-3xl mx-auto">
                <Link 
                    href="/patient/appointments"
                    className="text-blue-600 hover:underline mb-4 inline-block"
                >
                    ← Retour aux rendez-vous
                </Link>

                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">
                        📅 Prendre un Rendez-vous
                    </h1>

                    {/* Info sécurité */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-blue-800">
                            🔒 <strong>Sécurité :</strong> Vos données sont chiffrées et sécurisées. 
                            Seuls les médecins autorisés peuvent voir ce rendez-vous.
                        </p>
                    </div>

                    {/* Erreur globale */}
                    {errors.error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-red-800">{errors.error}</p>
                        </div>
                    )}

                    {/* Vérifier si médecins autorisés */}
                    {authorizedDoctors.length === 0 ? (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                            <svg className="mx-auto h-12 w-12 text-yellow-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <h3 className="text-lg font-medium text-yellow-900 mb-2">
                                Aucun médecin autorisé
                            </h3>
                            <p className="text-sm text-yellow-800 mb-4">
                                Vous devez d'abord autoriser un médecin avec <strong>accès en écriture</strong> 
                                pour pouvoir prendre rendez-vous.
                            </p>
                            <Link
                                href="/patient/access-management"
                                className="inline-block px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
                            >
                                Autoriser un médecin
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Médecin */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    👨‍⚕️ Médecin *
                                </label>
                                <select
                                    value={data.doctor_id}
                                    onChange={(e) => setData('doctor_id', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                    required
                                >
                                    <option value="">Choisir un médecin...</option>
                                    {authorizedDoctors.map((doctor) => (
                                        <option key={doctor.id} value={doctor.id}>
                                            Dr. {doctor.name} - {doctor.specialty}
                                        </option>
                                    ))}
                                </select>
                                {errors.doctor_id && (
                                    <p className="text-red-600 text-sm mt-1">{errors.doctor_id}</p>
                                )}
                            </div>

                            {/* Date & Heure */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        📅 Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={data.appointment_date}
                                        onChange={(e) => setData('appointment_date', e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                        required
                                    />
                                    {errors.appointment_date && (
                                        <p className="text-red-600 text-sm mt-1">{errors.appointment_date}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        🕐 Heure *
                                    </label>
                                    <select
                                        value={data.appointment_time}
                                        onChange={(e) => setData('appointment_time', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                        required
                                    >
                                        <option value="">Choisir l'heure...</option>
                                        {timeSlots.map((time) => (
                                            <option key={time} value={time}>
                                                {time}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.appointment_time && (
                                        <p className="text-red-600 text-sm mt-1">{errors.appointment_time}</p>
                                    )}
                                </div>
                            </div>

                            {/* Lieu */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    📍 Lieu *
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <label className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition ${
                                        data.location === 'cabinet' 
                                            ? 'border-green-500 bg-green-50' 
                                            : 'border-gray-300 hover:border-green-300'
                                    }`}>
                                        <input
                                            type="radio"
                                            name="location"
                                            value="cabinet"
                                            checked={data.location === 'cabinet'}
                                            onChange={(e) => setData('location', e.target.value)}
                                            className="sr-only"
                                        />
                                        <div className="text-center">
                                            <span className="text-2xl mb-2 block">🏥</span>
                                            <span className="text-sm font-medium">Cabinet</span>
                                        </div>
                                    </label>

                                    <label className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition ${
                                        data.location === 'teleconsultation' 
                                            ? 'border-green-500 bg-green-50' 
                                            : 'border-gray-300 hover:border-green-300'
                                    }`}>
                                        <input
                                            type="radio"
                                            name="location"
                                            value="teleconsultation"
                                            checked={data.location === 'teleconsultation'}
                                            onChange={(e) => setData('location', e.target.value)}
                                            className="sr-only"
                                        />
                                        <div className="text-center">
                                            <span className="text-2xl mb-2 block">💻</span>
                                            <span className="text-sm font-medium">Téléconsultation</span>
                                        </div>
                                    </label>

                                    <label className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition ${
                                        data.location === 'domicile' 
                                            ? 'border-green-500 bg-green-50' 
                                            : 'border-gray-300 hover:border-green-300'
                                    }`}>
                                        <input
                                            type="radio"
                                            name="location"
                                            value="domicile"
                                            checked={data.location === 'domicile'}
                                            onChange={(e) => setData('location', e.target.value)}
                                            className="sr-only"
                                        />
                                        <div className="text-center">
                                            <span className="text-2xl mb-2 block">🏠</span>
                                            <span className="text-sm font-medium">Domicile</span>
                                        </div>
                                    </label>
                                </div>
                                {errors.location && (
                                    <p className="text-red-600 text-sm mt-1">{errors.location}</p>
                                )}
                            </div>

                            {/* Motif */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    📝 Motif de la consultation (optionnel)
                                </label>
                                <textarea
                                    value={data.reason}
                                    onChange={(e) => setData('reason', e.target.value)}
                                    rows="4"
                                    maxLength="1000"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                    placeholder="Ex: Consultation de suivi, douleurs abdominales, renouvellement ordonnance..."
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    🔒 Ce motif sera chiffré et accessible uniquement par le médecin
                                </p>
                                {errors.reason && (
                                    <p className="text-red-600 text-sm mt-1">{errors.reason}</p>
                                )}
                            </div>

                            {/* Avertissement limites */}
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-sm text-yellow-800">
                                    ⚠️ <strong>Limites de sécurité :</strong>
                                </p>
                                <ul className="text-xs text-yellow-700 mt-2 space-y-1 ml-4 list-disc">
                                    <li>Maximum 3 rendez-vous par jour</li>
                                    <li>Maximum 5 créations par heure</li>
                                    <li>Détection automatique d'activité suspecte</li>
                                </ul>
                            </div>

                            {/* Boutons */}
                            <div className="flex gap-4 pt-6 border-t">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 font-medium"
                                >
                                    {processing ? 'Création en cours...' : '✅ Confirmer le rendez-vous'}
                                </button>
                                <Link
                                    href="/patient/appointments"
                                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
                                >
                                    Annuler
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </PatientLayout>
    );
}