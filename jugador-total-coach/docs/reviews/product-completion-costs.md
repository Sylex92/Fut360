# Costo y reutilización de la ampliación

2026-10-02. Alcance autorizado: inventario, recursos y continuidad local.

| Función | Reutilización | Pago adicional obligatorio / condición |
|---|---|---|
| Observación de fuentes | Reproductor web público y herramientas disponibles | Ninguno para los videos públicos accesibles; privados, retirados o de pago quedan pendientes. No se descarga ni redistribuye el video. |
| Nuevos clips | Rig CC0 ya registrado, Blender portable 4.5.14 y exportador existente | Ninguno para este uso; no implica derechos de copiar la edición, audio o apariencia de los autores. |
| Progreso e historial | Motor propio existente, IndexedDB nativo, React | Ningún proveedor nuevo. Almacenamiento limitado por navegador/disco; borrar datos del navegador puede eliminarlo. Exportación local de respaldo. |
| Offline | Service Worker y Cache API del navegador, Vite existente | Sin dependencia nueva. Requiere HTTPS o localhost; IP LAN por HTTP no habilita PWA móvil. No se modifica firewall ni se instala certificado. |
| Conversación dentro de la app | Viabilidad ya documentada | Pendiente de proveedor/localidad y licencia comprobados. Suscripción a Codex no es una API gratuita para la app. No fingir IA mediante reglas. |

Referencias de plataforma: [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers) y [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB). Consultadas para requisitos de origen seguro, caché y transacciones; las pruebas locales acreditan la implementación concreta. Sin nuevas dependencias, pagos, cambios globales ni publicación.
