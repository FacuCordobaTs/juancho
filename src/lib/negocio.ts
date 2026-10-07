import { useRouteLoaderData } from 'react-router'

export const RESTAURANTE_ID = 39
export const RESTAURANTE_ENDPOINT = `/public/restaurante/id/${RESTAURANTE_ID}`
export const CARRITO_KEY = `deliveryCart_${RESTAURANTE_ID}`
const API_URL = (import.meta.env.VITE_API_URL || 'https://api.piru.app/api').replace(/\/$/, '')

export type Negocio = { id: number; username: string }

// Se resuelve en cada carga de la app, sin guardar el username en localStorage.
// Los links de marketing usan este username actual; el catálogo siempre usa el ID.
export async function cargarNegocio(signal?: AbortSignal): Promise<Negocio> {
  const response = await fetch(`${API_URL}${RESTAURANTE_ENDPOINT}`, { signal, cache: 'no-store' })
  if (!response.ok) throw new Error('No pudimos cargar la tienda')
  const resultado = await response.json()
  const restaurante = resultado.data?.restaurante
  if (!resultado.success || restaurante?.id !== RESTAURANTE_ID || typeof restaurante.username !== 'string' || !restaurante.username.trim()) {
    throw new Error('No pudimos identificar la tienda')
  }
  return { id: restaurante.id, username: restaurante.username }
}

export function useNegocio(): Negocio {
  return useRouteLoaderData('negocio') as Negocio
}
