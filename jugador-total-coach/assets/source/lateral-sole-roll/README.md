# Fuente editable: lateral-sole-roll

Fase 06, 2026-09-30. Derivada localmente de [inside-inside](../inside-inside/inside-inside-v1.blend), con avatar Quaternius, rig de 65 huesos, pesos, ropa y correcciones de hombros/brazos ya incorporados. Componentes originales CC0-1.0: [licencia conservada](../hip-hinge/QUATERNIUS_LICENSE.txt). Aportaciones del proyecto sin nueva licencia pública elegida. Sin descarga, modelo generado por IA ni paquete Source de pago.

Autoría: poses específicas mediante IK, bake y exportador glTF integrado de Blender 4.5.14 LTS. No se crea un rig, solver ni exportador. Comando desde jugador-total-coach:

```powershell
node tools/blender.mjs tools/build_ball_variants.py
```

- [EX_lateral-sole-roll__left__v1](lateral-sole-roll-left-v1.blend): 10 s, 30 FPS, finito. SHA-256 fuente: `9b0ad00e8bda03a9f0ba8fc1b7d241f1b082addce526b6eb523daa2e6fcbe9c1`.
- [EX_lateral-sole-roll__right__v1](lateral-sole-roll-right-v1.blend): 10 s, 30 FPS, finito. SHA-256 fuente: `976709dea4ede140233bde7ac0013698bddd5257d5524518d176778f25359915`.

Inicio y final explícitos; sin ciclo automático ni transición entre ejercicios. El script de grupo puede reexportar ambos lados/otros patrones: revisar hashes antes de aceptar cambios.

[Mediciones de recursos](../../../docs/reviews/evidence/phase06/asset-validation.json), [fundamento y límites internos](../../../docs/training/PHASE06_DOCUMENTARY_REVIEW.md). Estado deportivo draft. La exportación o la lectura de fuentes no acredita revisión profesional.

## Coordinación v2

Corrección de movimiento del 2026-09-30, conservando v1 como origen. Transferencia hacia apoyo, brazos y tronco. Mallas/pesos/materiales/texturas y huesos conservados; autoría con Blender IK/bake y exportador existente. [Informe y evidencia](../../../docs/reviews/phase06-natural-motion-review.md), [licencias y hashes](../../../ASSET_LICENSES.md). Las fuentes/GLB v2 están identificadas en los manifiestos; no equivalen a dosis deportiva aprobada.

```powershell
node tools/blender.mjs tools/build_coordinated_movements.py lateral-sole-roll-left lateral-sole-roll-right
node tools/review_movements.mjs --version=2
```

El constructor lee las versiones v1, escribe únicamente v2 y reutiliza `../active-march/walk-arm-reference.json` para los brazos de marcha/giro. La referencia CC0 ya está conservada; `tools/extract_walk_reference.py` permite reproducirla desde el GLB Standard adquirido, sin descargarlo. Consultar el pipeline antes de aceptar una nueva reexportación.
