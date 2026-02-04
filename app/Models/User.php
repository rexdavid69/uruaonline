<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'company_name',
        'job_title',
        'country',
        'state',
        'city',
        'address_line1',
        'address_line2',
        'postal_code',
        'preferred_contact',
        'timezone',
        'locale',
        'notification_preferences',
    ];
    
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'notification_preferences' => 'array',
    ];

    // Check if user is admin
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
}
