# Fuentes y alcance de la revisión

Consulta: 24 de septiembre de 2026. Fuentes primarias. Las licencias corresponden al repositorio/documento consultado, no a una instalación concreta. No se descargaron assets, no se fijaron versiones ni se auditó un lockfile.

## S01 — Rapier: cuerpos rígidos, cinemáticos y formas de moverlos

Fuente: https://rapier.rs/docs/user_guides/javascript/rigid_bodies/

Distingue simulación dinámica y control cinemático; no certifica técnicas deportivas.

## S02 — Rapier: colliders, formas, fricción y restitución

Fuente: https://rapier.rs/docs/user_guides/javascript/colliders/

Se reutilizan APIs existentes, no se desarrolla solver propio.

## S03 — Rapier: licencia Apache-2.0 del repositorio

Fuente: https://raw.githubusercontent.com/dimforge/rapier/master/LICENSE

Verificada la licencia del repositorio; falta fijar/auditar versión npm y transitivas.

## S04 — react-three-rapier: integración y paso de tiempo

Fuente: https://github.com/pmndrs/react-three-rapier

Paso fijo y advertencia de timestep variable; no sustituye pruebas multidispositivo.

## S05 — react-three-rapier: MIT

Fuente: https://raw.githubusercontent.com/pmndrs/react-three-rapier/main/LICENSE

Revisar versión seleccionada.

## S06 — Three.js: MIT

Fuente: https://raw.githubusercontent.com/mrdoob/three.js/dev/LICENSE

Revisar versión seleccionada.

## S07 — Three.js: AnimationMixer

Fuente: https://threejs.org/docs/pages/AnimationMixer.html

Reproducción, pausa y evaluación de clips a tiempo concreto.

## S08 — React Three Fiber: MIT

Fuente: https://raw.githubusercontent.com/pmndrs/react-three-fiber/master/LICENSE

Revisar versión seleccionada.

## S09 — Blender: proyecto libre GNU GPL

Fuente: https://www.blender.org/

Se verificó la descripción oficial indexada. No se pudo recuperar la página específica de licencia ni el manual de Rigify con el navegador de investigación; no se aprobaron plugins por esa vía.

## S10 — Quaternius: Universal Base Characters

Fuente: https://quaternius.com/packs/universalbasecharacters.html

CC0 y rig descritos en página; diferenciar subconjunto gratis y Source de pago. No se descargaron ni inspeccionaron archivos.

## S11 — Quaternius: Universal Animation Library

Fuente: https://quaternius.com/packs/universalanimationlibrary.html

Candidato para clips; verificar contenido y licencia de cada archivo gratis.

## S12 — Kenney: política CC0 de páginas de assets

Fuente: https://kenney.nl/support

No extrapolar a toda herramienta/producto. No se descargaron packs.

## S13 — Remotion: licencia especial

Fuente: https://raw.githubusercontent.com/remotion-dev/remotion/main/LICENSE.md

La exclusión FOSS anterior quedó sustituida. Ver ADR 0008 y REMOTION_LICENSE_REVIEW.md; no inferir veto ni aprobación universal.

## S14 — FFmpeg: licencia y consideraciones de distribución

Fuente: https://ffmpeg.org/legal.html

LGPL/GPL depende de componentes y compilación; verificar antes de distribuir. No prometer neutralidad de patentes/codecs.

## S15 — React: MIT

Fuente: https://raw.githubusercontent.com/facebook/react/main/LICENSE

Auditoría de versión/transitivas pendiente.

## S16 — Vite: MIT

Fuente: https://raw.githubusercontent.com/vitejs/vite/main/LICENSE

Auditoría de versión/transitivas pendiente.

## S17 — TypeScript: Apache-2.0

Fuente: https://raw.githubusercontent.com/microsoft/TypeScript/main/LICENSE.txt

Auditoría de versión/transitivas pendiente.

## S18 — Playwright: Apache-2.0

Fuente: https://raw.githubusercontent.com/microsoft/playwright/main/LICENSE

Navegadores/binarios descargados tienen avisos propios; revisar distribución.

## S19 — Codex: AGENTS.md

Fuente: https://developers.openai.com/codex/guides/agents-md/

Documentación oficial de instrucciones por repositorio; no se requiere suscripción a Codex para ejecutar la app.

## S20 — Creative Commons: licencias de contenido

Fuente: https://creativecommons.org/cc-licenses/

Distingue atribución, compartir igual, NC y ND. Política del proyecto prefiere CC0 o CC BY.


## Revisión adicional v3 — 2026-09-24
Estas fuentes se consultaron para aclarar Remotion e iniciar en Codex; no son una auditoría de paquetes instalados.
- Remotion pricing: https://www.remotion.dev/docs/license/pricing
- Remotion FAQ (Free License; Is Remotion open source?): https://www.remotion.dev/docs/license/faq
- Remotion license: https://raw.githubusercontent.com/remotion-dev/remotion/main/LICENSE.md
- Remotion Three: https://www.remotion.dev/docs/three
- OpenAI, plan y acceso Codex: https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan
- OpenAI, Windows: https://learn.chatgpt.com/docs/windows/windows-app
- OpenAI, entorno Local/Worktree/Cloud: https://learn.chatgpt.com/docs/environments/modes
- OpenAI, AGENTS.md: https://learn.chatgpt.com/docs/agent-configuration/agents-md
- Node.js LTS/download: https://nodejs.org/en/download
- Git Windows: https://git-scm.com/install/windows

Las referencias de componentes 3D de la revisión anterior se conservan como antecedentes. Antes de instalar se debe verificar la versión y licencia efectivamente seleccionadas.

## Revisión v4 — 2026-09-24

Reconsultadas FAQ, Pricing, LICENSE y Terms de Remotion; véase REMOTION_LICENSE_REVIEW.md. Reconsultada la guía AGENTS.md de OpenAI. Esta revisión no revalida versiones/archivos del resto de candidatos: Codex debe hacerlo antes de instalar. No se descargaron modelos, no se instalaron dependencias, no se midió rendimiento 3D. La consulta pública no es un dictamen jurídico.

- Remotion Terms: https://www.remotion.dev/docs/terms
- OpenAI AGENTS.md: https://developers.openai.com/codex/guides/agents-md/
