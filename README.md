# Tienda Juancho Sandwichería

Réplica de `chemilanesa/` para el restaurante **39**, con entrada en la raíz de
`https://juanchosandwicheria.com`. Mantiene el menú, delivery, retiro, salas,
checkout, seguimiento de pedidos y links de marketing del clon original.

La identidad se carga desde `GET /api/public/restaurante/id/39` al abrir la app.
El catálogo y los ajustes se consultan por ID; campañas, recetas y tracking usan
el username actual devuelto por el backend. No hay un username fijo ni guardado
en el navegador. El carrito se guarda como `deliveryCart_39`, para conservarlo
cuando el negocio cambie de username.

## Desarrollo

```sh
bun install
bun run dev
bun run build
bun test
```

Las variables públicas de Vite están documentadas en `.env.example`.
La API predeterminada es `https://api.piru.app/api`.

## Publicación

Publicar `dist/` como SPA con fallback a `index.html` (incluido en `public/_redirects`).
El backend debe tener desplegada la ruta por ID y el CORS para el dominio antes
de publicar la tienda. Aplicar `backend/migrations/set_dominio_tienda_juancho.sql`
para que los links generados por el backend usen el dominio propio del restaurante
39 (`dominio_tienda`). La migración está preparada; no se aplicó a la DB.

El icono estático es una inicial de Juancho; el logo, las fotos, los colores y el
resto del catálogo del negocio se cargan desde la API.
