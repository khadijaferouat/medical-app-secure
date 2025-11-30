<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\User;

class NewDoctorRegistration extends Notification
{
    use Queueable;

    protected $doctor;

    public function __construct(User $doctor)
    {
        $this->doctor = $doctor;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        $url = url('/admin/doctors/requests');

        return (new MailMessage)
            ->subject('🔔 Nouvelle demande de compte médecin - Medical App Secure')
            ->greeting('Bonjour Admin,')
            ->line('Une nouvelle demande de compte médecin a été soumise.')
            ->line('**Détails du médecin :**')
            ->line('👤 Nom : ' . $this->doctor->name)
            ->line('📧 Email : ' . $this->doctor->email)
            ->line('🏥 Spécialité : ' . $this->doctor->specialty)
            ->line('🔢 RPPS : ' . $this->doctor->rpps_number)
            ->action('Examiner la demande', $url)
            ->line('Veuillez examiner les documents fournis avant de valider le compte.')
            ->salutation('Cordialement, Le système Medical App Secure');
    }

    public function toArray($notifiable)
    {
        return [
            'doctor_id' => $this->doctor->id,
            'doctor_name' => $this->doctor->name,
            'doctor_email' => $this->doctor->email,
            'specialty' => $this->doctor->specialty,
            'message' => "Nouvelle demande de compte médecin de {$this->doctor->name}"
        ];
    }
}