# Fuente del ejemplo interior-interior

`inside-inside-v1.blend` creado con Blender 4.5.14 portable, a partir de `../hip-hinge/hip-hinge-v1.blend`. Malla, rig, ropa y correcciones de hombros/brazos reutilizados. Base Quaternius CC0; conservar `../hip-hinge/QUATERNIUS_LICENSE.txt`. Aportaciones nuevas del proyecto sin elegir nueva licencia pública.

Autoría reproducible: `tools/build_inside_inside.py` desde la raíz de la aplicación, con la copia portable ya autorizada y configuración/temporales locales. Usa IK de Blender y bake sobre el rig existente; no hay rig nuevo ni solver propio. El script **reescribe solo este ejemplo y su GLB**, nunca la bisagra de origen.

30 FPS, fotogramas 0–300; clip finito de dos toques. AnimationMixer comparte el mismo cursor entre cuerpo y TutorialBall. La escena se exporta como un clip único con `export_anim_scene_split_object=False`. La curva y el giro del balón son ilustrativos, no salida de una simulación calibrada.

Estado: draft. El `.blend` conserva la acción horneada y el balón animado; el script conserva la preparación IK. Fuente, runtime y herramienta con hashes en `docs/reviews/phase05-asset-evidence.json`. Pruebas y límites en `docs/reviews/phase05-contact-review.md`.

## Coordinación v2

Corrección de movimiento del 2026-09-30, conservando v1 como origen. Cuatro toques, brazos/tronco, corrección medial de contacto de 3 cm. Mallas/pesos/materiales/texturas y huesos conservados; autoría con Blender IK/bake y exportador existente. [Informe y evidencia](../../../docs/reviews/phase06-natural-motion-review.md), [licencias y hashes](../../../ASSET_LICENSES.md). Las fuentes/GLB v2 están identificadas en los manifiestos; no equivalen a dosis deportiva aprobada.

```powershell
node tools/blender.mjs tools/build_coordinated_movements.py inside-inside
node tools/review_movements.mjs --version=2
```

El constructor lee las versiones v1, escribe únicamente v2 y reutiliza `../active-march/walk-arm-reference.json` para los brazos de marcha/giro. La referencia CC0 ya está conservada; `tools/extract_walk_reference.py` permite reproducirla desde el GLB Standard adquirido, sin descargarlo. Consultar el pipeline antes de aceptar una nueva reexportación.
