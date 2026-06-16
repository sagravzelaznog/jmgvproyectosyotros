"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";

export default function PayPalProvider({ children }: { children: React.ReactNode }) {
  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
    currency: "MXN", // Basado en el contexto de Torreón, Coahuila
    intent: "capture",
    // Recuerda que los pagos se enviarán a la cuenta configurada en tu PayPal Developer Dashboard
    // la cual está enlazada al correo primomanuel@hotmail.com
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      {children}
    </PayPalScriptProvider>
  );
}
