import type { NextConfig } from 'next'
import { join } from 'path'

const nextConfig: NextConfig = {
  // Cache Components deshabilitado por ahora para simplificar migración
  // Se puede habilitar después con configuración de caché apropiada
  // cacheComponents: true,

  // Configurar Turbopack root para evitar warning de múltiples lockfiles
  turbopack: {
    root: join(__dirname),
  },
}

export default nextConfig
