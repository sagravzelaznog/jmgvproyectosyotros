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
          try {
            const response = await fetch("/api/paypal/capture", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                orderID: data.orderID,
              }),
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
              if (result.warning) {
                alert(result.warning);
              } else {
                alert("¡Pago exitoso! Se ha habilitado tu acceso completo.");
                // Refrescar página para que el AuthProvider tome los nuevos permisos
                window.location.href = "/dashboard";
              }
            } else {
              setError(result.error || "Ocurrió un error en el servidor al capturar el pago.");
            }
          } catch (err) {
            setError("Error de red al intentar procesar el pago.");
            console.error(err);
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
