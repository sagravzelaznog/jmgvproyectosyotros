import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["firebase-admin"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Scripts: GeoGebra, PayPal, Firebase, Tailwind CDN, Google Fonts, KaTeX, MathJax
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'" +
                " https://www.geogebra.org https://cdn.geogebra.org https://geo.geogebra.org" +
                " https://www.paypal.com https://js.braintreegateway.com https://c.paypal.com" +
                " https://cdn.tailwindcss.com" +
                " https://fonts.googleapis.com" +
                " https://cdn.jsdelivr.net" +
                " https://www.gstatic.com https://apis.google.com" +
                " https://*.firebaseapp.com https://*.firebase.com",
              // Estilos
              "style-src 'self' 'unsafe-inline'" +
                " https://fonts.googleapis.com https://cdn.jsdelivr.net",
              // Fuentes
              "font-src 'self' data:" +
                " https://fonts.gstatic.com https://cdn.jsdelivr.net",
              // Imágenes
              "img-src 'self' data: blob: https: http:",
              // Iframes permitidos
              "frame-src 'self'" +
                " https://www.geogebra.org https://geogebra.org" +
                " https://www.paypal.com https://c.paypal.com" +
                " https://www.youtube.com https://player.vimeo.com" +
                " https://www.desmos.com",
              // Conexiones de red (Firebase, GeoGebra, PayPal)
              "connect-src 'self'" +
                " https://*.googleapis.com https://*.firebaseio.com https://*.firebase.com" +
                " wss://*.firebaseio.com" +
                " https://www.geogebra.org https://cdn.geogebra.org https://geo.geogebra.org" +
                " https://www.paypal.com https://api.paypal.com" +
                " https://identitytoolkit.googleapis.com",
              // Workers y media
              "worker-src 'self' blob:",
              "media-src 'self' blob: https:",
              // GeoGebra carga objetos desde su CDN
              "object-src 'none'",
            ].join("; "),
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

