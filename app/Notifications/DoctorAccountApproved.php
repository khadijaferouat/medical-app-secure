<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DoctorAccountApproved extends Notification
{
    use Queueable;

    protected $tempPassword;

    public function __construct($tempPassword = null)
    {
        $this->tempPassword = $tempPassword;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $url = url('/login');

        $message = (new MailMessage)
            ->subject('✅ Votre compte médecin a été approuvé - Medical App Secure')
            ->greeting('Bonjour Dr. ' . $notifiable->name . ',')
            ->line('Bonne nouvelle ! Votre demande de compte médecin a été approuvée par notre équipe.')
            ->line('Vous pouvez maintenant vous connecter à votre espace médecin sécurisé.');

        if ($this->tempPassword) {
            $message->line('**Vos identifiants de connexion :**')
                ->line('📧 Email : ' . $notifiable->email)
                ->line('🔑 Mot de passe : ' . $this->tempPassword)
                ->line('⚠️ **Important** : Pour votre sécurité, veuillez changer votre mot de passe dès votre première connexion.');
        } else {
            $message->line('**Vos identifiants de connexion :**')
                ->line('📧 Email : ' . $notifiable->email)
                ->line('🔑 Mot de passe : Celui que vous avez choisi lors de l\'inscription');
        }

        $message->action('Se connecter maintenant', $url)
            ->line('Merci de rejoindre Medical App Secure !')
            ->line('Si vous avez des questions, n\'hésitez pas à nous contacter.')
            ->salutation('Cordialement, L\'équipe Medical App Secure');

        return $message;
    }
}