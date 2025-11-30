<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DoctorAccountRejected extends Notification
{
    use Queueable;

    protected $reason;

    public function __construct($reason = null)
    {
        $this->reason = $reason;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $message = (new MailMessage)
            ->subject('❌ Demande de compte médecin - Medical App Secure')
            ->greeting('Bonjour ' . $notifiable->name . ',')
            ->line('Nous avons examiné votre demande de compte médecin.')
            ->line('Malheureusement, nous ne pouvons pas l\'approuver pour le moment.');

        if ($this->reason) {
            $message->line('**Raison :** ' . $this->reason);
        }

        $message->line('Si vous pensez qu\'il s\'agit d\'une erreur ou si vous souhaitez plus d\'informations, n\'hésitez pas à nous contacter.')
            ->line('Vous pouvez soumettre une nouvelle demande avec des documents mis à jour.')
            ->salutation('Cordialement, L\'équipe Medical App Secure');

        return $message;
    }
}