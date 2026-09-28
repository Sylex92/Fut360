# Resultado de fase 02 — base técnica

Fecha: 2026-09-28. El usuario aceptó 01 y autorizó únicamente 02 mediante «De acuerdo y autorizo». Implementación, verificaciones técnicas y recorrido manual básico realizados. El usuario revisó controles, teclado, ancho reducido y consola; aportó una captura que el agente inspeccionó y conservó. Integración Git completada en el punto de control 7ea6b029137b9d85b13bb034eca453bedf2a5e4d. No se declara terminado el MVP1 ni autorizado 03.

## Qué cambió y por qué

- Monorepo pnpm con solo app, domain y exercise-catalog, conforme a la arquitectura. No hay módulos vacíos para las fases siguientes.
- Dominio puro v1 con cálculo de tiempos multiplicados por rondas; catálogo reutiliza Ajv 2020-12 y agrega reglas de versión, identidad de bloques, dimensiones positivas, enteros seguros y duración coherente. No se reescribió el esquema para que aceptara errores.
- Pantalla React/Vite en español: estado de validación, borrador explícito, tiempos reales, distribución por bloques, errores con ruta, nueva comprobación y consulta del archivo original. Los controles usan elementos HTML nativos, foco visible y anuncio de resultado. Teclado/foco de los dos controles principales comprobados manualmente por el usuario; no equivale a certificación integral de accesibilidad.
- Gestor local fijado, manifests privados, configuración estricta, lockfiles, scripts de formato/lint/tipos/tests/build y avisos de terceros. Sin dependencia de Codex para ejecutar los comandos.
- Fixture y esquemas históricos conservados. Se muestra la sesión v1 para diagnóstico; no se reemplaza por el catálogo futuro ni se ofrece como entrenamiento aprobado.

## Verificaciones ejecutadas

| Verificación | Resultado observado |
|---|---|
| pnpm local y rutas | 11.19.0; store/cache/state resueltos dentro del proyecto |
| npm ci offline del gestor | Instalación limpia de pnpm desde package-lock y caché local, correcta |
| pnpm install --frozen-lockfile --ignore-scripts --offline | Correcto tanto sobre instalación existente como en copia nueva dentro de .cache/phase02-repro, sin node_modules previo; 141 contextos reutilizados, cero descargas |
| format:check | Correcto en código/configuración nuevos |
| lint | Correcto; restricciones de imports/plataforma para domain y catálogo |
| typecheck | TypeScript estricto, sin errores |
| test | 24 pruebas en dos archivos, todas correctas |
| build | Correcto, recursos locales y sourcemaps en apps/coach-pwa/dist |
| Seguridad/licencias | Inventario 166 versiones resueltas/137 instaladas; cero avisos reportados por pnpm audit, alcance explicado en el informe de dependencias |
| HTTP del build | 200 en 127.0.0.1:4173, título de la aplicación correcto |
| Comprobación manual del usuario | Confirma que ve la pantalla y que «Volver a comprobar» muestra «Comprobación 1: estructura y duración correctas.»; al pulsar de nuevo, confirma «Comprobación 2: estructura y duración correctas.» |
| Despliegue manual de datos | El usuario confirma que «Ver datos del archivo de referencia» se despliega y se contrae |
| Teclado del botón | El usuario confirma que puede alcanzar «Volver a comprobar» con Tab/Mayús+Tab, distinguir su resaltado y activarlo con Enter para aumentar el contador |
| Teclado del desplegable | El usuario confirma que puede alcanzar «Ver datos del archivo de referencia» con Tab, distinguir su resaltado y abrirlo/cerrarlo con Enter |
| Página con ancho reducido | El usuario no observa problemas de legibilidad, distribución ni acceso a controles al reducir el ancho en la computadora; dimensiones no medidas y sin captura |
| Consola durante el recorrido manual | El usuario responde «no aparece nada» tras la indicación de recargar en Chrome con la consola abierta y usar ambos controles; no reporta errores en ese recorrido |
| Evidencia visual | [Captura aportada por el usuario](evidence/phase02-diagnostic-user.png), inspeccionada por el agente: estado válido, Comprobación 3, Borrador y tiempos 60:00/41:15/18:45; sin incidencias visibles en esa sección |
| Integración Git | Punto de control local 7ea6b029137b9d85b13bb034eca453bedf2a5e4d, 72 archivos revisados; índice comprobado y árbol de trabajo limpio después del commit |

Pruebas: 3600 s = 2475 de trabajo + 1125 de descanso, seis bloques, 60 ocurrencias y 31 IDs; hash original; no mutación ni promoción de draft; rechazo de estructura, campos extra, suma incoherente, versiones no admitidas, nombres/IDs vacíos, bloques duplicados, lado no permitido, espacio no positivo, rondas inválidas y desbordamiento. Descanso cero admitido y rondas calculadas sin expansión masiva. Dos pruebas renderizan la pantalla a HTML para comprobar éxito/borrador y error; **no son pruebas de interacción en navegador**.

Comandos exactos de repetición en [desarrollo local](../setup/LOCAL_DEVELOPMENT.md). Evidencia por paquete en [dependencias](phase02-dependencies.md) y su inventario JSON. No se ejecutó CI remoto.

Comprobación adicional justificada de reproducción: copia de 23 archivos fuente/configuración/datos en .cache/phase02-repro, sin dependencias previas; node tools/pnpm.mjs --dir .cache/phase02-repro install --frozen-lockfile --ignore-scripts --offline, seguido de run test y run build. Ambas verificaciones volvieron a pasar (24 pruebas), con los mismos nombres/tamaños de recursos JS/CSS. Prueba local en esta máquina con caché disponible, no prueba en otro sistema operativo ni de PWA offline.

Control documental final: 66 documentos Markdown UTF-8, 183 enlaces locales sin roturas; integridad original del fixture y dos esquemas; hashes del inventario de avisos comprobados. Git diff --check sin errores de espacios (solo aviso de normalización LF/CRLF en .gitignore). Los 71 archivos acumulados modificados/nuevos de 00–02 quedan dentro del proyecto; dependencias, caché y build excluidos de Git. No se reescribió el manifiesto histórico para ocultar cambios.

## Límites de verificación

Incidencia posterior a la entrega, 2026-09-28: el usuario informó ERR_CONNECTION_REFUSED en 127.0.0.1:4173. Se comprobó ausencia de servidor escuchando en ese puerto. Preview se reinició como proceso independiente mediante Start-Process con ventana oculta, directorio y registros dentro del proyecto. En una llamada posterior se verificaron listener limitado a 127.0.0.1, HTTP 200 y título correcto. Causa exacta de la detención anterior no determinada; no se promete persistencia tras reiniciar Windows. La recuperación se explica en desarrollo local. No cambió código ni dependencias y no se repitieron las pruebas de aplicación por este reinicio. La herramienta browser volvió a fallar al conectar; la revisión visual continúa pendiente.

La habilidad browser no pudo conectar con el navegador integrado en dos intentos, incluido después de solicitar abrir la URL. El control alternativo indicó que Chrome no estaba disponible como superficie automatizable, aunque su instalación se había detectado. No se instalaron extensiones ni se alteró el equipo para resolverlo. Abrir la URL en Codex quedó en cola, sin confirmación visual.

El agente no ha controlado directamente el navegador, pulsado sus controles, probado teclado real ni inspeccionado su consola. El usuario confirma el mensaje «Comprobación 1: estructura y duración correctas.» y, al pulsar de nuevo, «Comprobación 2: estructura y duración correctas.». Confirma también apertura/cierre del desplegable y foco visible/activación con Enter de ambos controles. Al reducir el ancho informa «si, no noto ningún problema». En el recorrido de consola en Chrome, tras recargar y usar los controles, responde «no aparece nada». Son comprobaciones manuales del usuario, registradas como tales.

Después el usuario aporta una captura y el agente la inspecciona directamente. La copia conservada en evidence/phase02-diagnostic-user.png tiene 1349×603 píxeles y 59141 bytes; SHA-256 4714f2c74c6ea9ebd570c7d73f32afab4c9a81c33befe61a4ed32f12bd51f973. Se copió sin editar desde el adjunto y se comprobó igualdad de hashes. Se observan título legible, estado «Archivo de referencia válido», botón, «Comprobación 3: estructura y duración correctas.», etiqueta «BORRADOR» y 60:00 = 41:15 + 18:45. No se aprecian superposiciones ni controles cortados en la sección capturada. La imagen no incluye toda la página, el desplegable o la consola, ni prueba interacción o dimensiones del viewport.

El recorrido manual básico y la evidencia visual solicitada quedan completos con estos límites. No equivalen a certificación de accesibilidad, pruebas de todos los tamaños ni ausencia de errores en todos los recorridos. El servidor HTTP y el render HTML sí se comprobaron mediante herramientas. El ancho de la prueba manual no está medido; no se atribuye a la captura ni se generaliza al Samsung. Rendimiento móvil, PWA/offline y entrenamiento real siguen para sus fases.

Finalizado el repaso manual, ante la propuesta concreta del punto de control local, el usuario indica «ya podemos avanzar con normalidad, solo interrumpir con preguntas muy necesarias por favor». Se retoma el avance autónomo y el commit propuesto dentro de 02. La revisión previa observa como último commit «33ce029 fase 00», índice vacío, autor configurado y ningún hook activo detectado. El alcance reúne 72 archivos de documentación acumulada, base técnica, configuración/lockfiles locales y evidencia; excluye dependencias instaladas, cachés, build y rutas privadas. Búsqueda de patrones comunes de credenciales sin coincidencias, sin presentarla como auditoría exhaustiva. Comparación de 22 archivos fuente/configuración/datos con la copia de reproducción probada: hashes idénticos. La instrucción no se interpreta como autorización de publicar ni de ejecutar 03.

No hay motor de sesión, preparación temporizada, avatar, física, fichas aprobadas, historial ni exportación. Los textos de pendientes en la pantalla explican este estado; no sustituyen esas funciones.

Se conservan los cambios documentales previos del proyecto en el commit local 7ea6b029137b9d85b13bb034eca453bedf2a5e4d, «Completar base tecnica de fase 02 y consolidar documentacion previa», creado en la rama main existente: 72 archivos, 8184 inserciones y 436 eliminaciones, incluida la captura sin modificaciones. git diff --cached --check correcto antes de crearlo y git status --porcelain sin cambios después. No se publicó ni se cambió configuración global; safe.directory se proporcionó únicamente a cada comando de Git. Los avisos LF/CRLF proceden de la configuración existente y no se alteró esa configuración.

El cierre técnico de 02 queda completo dentro de las verificaciones y límites descritos. Este documento registra posteriormente el resultado real del commit, sin inventar un identificador previo ni reescribir ese historial. No se repiten pruebas de aplicación porque no cambió su código; la comparación contra la copia ya probada mantiene evidencia de los 22 archivos idénticos. El siguiente alcance sigue siendo 03, pendiente de autorización conjunta.
