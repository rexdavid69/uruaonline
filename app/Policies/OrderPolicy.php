<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;

class OrderPolicy
{
    public function view(User $user, Order $order): bool
    {
        return (int) $user->id === (int) $order->user_id;
    }

    public function updatePaymentMethod(User $user, Order $order): bool
    {
        return (int) $user->id === (int) $order->user_id
            && strtolower((string) $order->payment_status) !== 'successful';
    }
}
