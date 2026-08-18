import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["firebase-admin"],
  async headers() {
    return [
      {
        // Aplicar a todas las rutas
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.geogebra.org https://cdn.geogebra.org https://cdn.tailwindcss.com https://fonts.googleapis.com https://cdn.jsdelivr.net https://www.gstatic.com https://apis.google.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
              "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net data:",
              "img-src 'self' data: blob: https: http:",
              "frame-src 'self' https://www.geogebra.org https://geogebra.org https://www.youtube.com https://player.vimeo.com https://www.desmos.com",
              "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.firebase.com wss://*.firebaseio.com https://www.geogebra.org",
              "worker-src 'self' blob:",
              "media-src 'self' blob: https:",
            ].join("; "),
          },
          {
            // Permitir que nuestra propia plataforma sea embebida en iframes
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
