import React from "react";
import { usePage, router } from "@inertiajs/react";
import BackendLayout from "@/layouts/backend/backend-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Define your cart item type
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

// Extend Inertia's built-in PageProps type safely
import { PageProps as InertiaPageProps } from "@inertiajs/core";

interface PageProps extends InertiaPageProps {
  cart: CartItem[];
}

const CartPage: React.FC = () => {
  const { cart } = usePage<PageProps>().props;

  const handleRemove = (id: number) => {
    router.delete(`/cart/${id}`);
  };

  const handleCheckout = () => {
    router.post("/checkout");
  };

  return (
    <BackendLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Shopping Cart</h1>

        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cart.map((item) => (
              <Card key={item.id} className="shadow-md rounded-2xl">
                <CardContent className="p-4">
                  {item.image && (
                    <img
                      src={`/${item.image}`}
                      alt={item.name}
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                  )}
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-gray-700">₦{item.price}</p>
                  <p className="text-gray-500">Qty: {item.quantity}</p>
                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="destructive"
                      onClick={() => handleRemove(item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {cart.length > 0 && (
          <div className="mt-6 flex justify-end">
            <Button onClick={handleCheckout}>Proceed to Checkout</Button>
          </div>
        )}
      </div>
    </BackendLayout>
  );
};

export default CartPage;
