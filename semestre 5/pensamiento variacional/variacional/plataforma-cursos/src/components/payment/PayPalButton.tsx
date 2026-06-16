"use client";

import { PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";

export default function PayPalButton() {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const coursePrice = "99.00"; // Precio de ejemplo en MXN

  return (
    <div className="w-full relative z-10 flex flex-col items-center">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}
      
      <PayPalButtons
        style={{ layout: "vertical", shape: "rect", color: "blue" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                description: "Curso: Pensamiento Variacional I",
                custom_id: user?.uid || "guest", // Enviamos el UID al webhook
                amount: {
                  currency_code: "MXN",
                  value: coursePrice,
                },
              },
            ],
          });
        }}
        onApprove={async (data, actions) => {
          if (!actions.order) return;
          try {
            const details = await actions.order.capture();
            // Aquí enviarás el webhook o llamado a tu API de Firebase para
            // otorgar acceso al curso a este usuario.
            alert("¡Pago exitoso! Bienvenido al curso, " + details.payer.name?.given_name);
          } catch (err) {
            setError("Ocurrió un error al procesar el pago.");
          }
        }}
        onError={(err) => {
          setError("No se pudo iniciar PayPal. Revisa tu conexión.");
          console.error(err);
        }}
      />
    </div>
  );
}
