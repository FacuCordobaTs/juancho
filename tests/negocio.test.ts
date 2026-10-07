import { afterEach, describe, expect, test } from 'bun:test'
import { cargarNegocio } from '../src/lib/negocio'

const fetchOriginal = globalThis.fetch
afterEach(() => { globalThis.fetch = fetchOriginal })

function responder(username: string, id = 39) {
  const llamadas: { url: string; opciones?: RequestInit }[] = []
  globalThis.fetch = (async (url, opciones) => {
    llamadas.push({ url: String(url), opciones })
    return Response.json({ success: true, data: { restaurante: { id, username } } })
  }) as typeof fetch
  return llamadas
}

describe('identidad de la tienda por ID', () => {
  test('resuelve de nuevo el username después de que el negocio lo cambia', async () => {
    const antes = responder('juancho-anterior')
    expect(await cargarNegocio()).toEqual({ id: 39, username: 'juancho-anterior' })
    const despues = responder('juancho-nuevo')
    expect(await cargarNegocio()).toEqual({ id: 39, username: 'juancho-nuevo' })
    for (const llamadas of [antes, despues]) {
      expect(llamadas[0].url).toEndWith('/public/restaurante/id/39')
      expect(llamadas[0].opciones?.cache).toBe('no-store')
    }
  })

  test('rechaza datos que pertenecen a otro negocio', async () => {
    responder('chemilanesa', 7)
    await expect(cargarNegocio()).rejects.toThrow('No pudimos identificar la tienda')
  })

  test('rechaza una respuesta fallida o sin identidad para marketing', async () => {
    globalThis.fetch = (async () => new Response(null, { status: 404 })) as typeof fetch
    await expect(cargarNegocio()).rejects.toThrow('No pudimos cargar la tienda')
    responder('')
    await expect(cargarNegocio()).rejects.toThrow('No pudimos identificar la tienda')
  })

  test('pasa la cancelación de la navegación a la API', async () => {
    const llamadas = responder('juancho')
    const abortador = new AbortController()
    await cargarNegocio(abortador.signal)
    expect(llamadas[0].opciones?.signal).toBe(abortador.signal)
  })
})
