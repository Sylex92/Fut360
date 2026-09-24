# Prompt 00 — Inicio desde cero: auditar antes de programar

Lee AGENTS.md, README.md, PROJECT_STATUS.md, START_HERE.md y los documentos referenciados. Este proyecto no ha empezado; no hay una migración que ejecutar.

Por ahora solo autorizo inspección, investigación y escritura de documentos. No generes código de aplicación, no inicialices Vite, no instales paquetes, no descargues modelos ni ejecutes scripts externos. Puedes utilizar herramientas ya disponibles para cálculos/verificación de solo lectura. No cambies políticas de seguridad, configuración global ni archivos fuera del proyecto.

Entregas:
1. docs/reviews/environment-report.md: sistema operativo, versiones/rutas detectables de Git, Node, npm, pnpm, Blender y navegador. Distingue no instalado de no encontrado en PATH. No instales nada. No recopiles secretos ni archivos personales. Las limitaciones gráficas no medidas deben quedar pendientes.
2. docs/reviews/spec-audit.md: coherencia del PRD, esquema, alcance, seguridad del contenido, 2×2 real y decisiones faltantes.
3. docs/reviews/license-audit.md: versiones/candidatos, acceso gratuito, licencias y fuentes primarias. Desconocido significa pendiente, nunca aprobado por inferencia. Aplicar ADR 0008: no excluir software por no ser abierto. Remotion es candidato condicionado a evaluar; no instalar en esta fase. Registrar costo, elegibilidad y cambios que forzarían pago o permiso.
4. docs/reviews/reuse-audit.md: alternativas concretas de avatar riggeado, animaciones, motor físico y props. Verifica archivos realmente gratuitos, no solo anuncios de packs. No reinventes motores/rig/editores. No afirmar que el catálogo incluye ejercicios que no viste.
5. docs/reviews/feature-cost-matrix.md: para cada ampliación prevista, identificar dependencia/proveedor, costo actual verificado, límites, disparadores de pago, ruta local y alternativa. Ver FEATURE_COST_REVIEW.md. Desconocido no se presenta como gratuito.
6. docs/plans/mvp1-execution-plan.md: plan corto 00–09, criterios comprobables, riesgos, orden de instalación mínimo y próximos comandos propuestos.

Recalcula duración del JSON (resultado esperado 3,600 s). Si una herramienta falta, informa sin bloquear toda la auditoría.
No rediseñes todo el producto ni introduzcas nuevas dependencias por anticipación. Prioriza decisiones necesarias para el primer ejercicio visible.

Actualiza PROJECT_STATUS.md. Resume verificaciones realizadas, pendientes y siguiente paso. Detente antes de implementar.
