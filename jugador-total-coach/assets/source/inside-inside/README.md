# Fuente del ejemplo interior-interior

`inside-inside-v1.blend` creado con Blender 4.5.14 portable, a partir de `../hip-hinge/hip-hinge-v1.blend`. Malla, rig, ropa y correcciones de hombros/brazos reutilizados. Base Quaternius CC0; conservar `../hip-hinge/QUATERNIUS_LICENSE.txt`. Aportaciones nuevas del proyecto sin elegir nueva licencia pública.

Autoría reproducible: `tools/build_inside_inside.py` desde la raíz de la aplicación, con la copia portable ya autorizada y configuración/temporales locales. Usa IK de Blender y bake sobre el rig existente; no hay rig nuevo ni solver propio. El script **reescribe solo este ejemplo y su GLB**, nunca la bisagra de origen.

30 FPS, fotogramas 0–300; clip finito de dos toques. AnimationMixer comparte el mismo cursor entre cuerpo y TutorialBall. La escena se exporta como un clip único con `export_anim_scene_split_object=False`. La curva y el giro del balón son ilustrativos, no salida de una simulación calibrada.

Estado: draft. El `.blend` conserva la acción horneada y el balón animado; el script conserva la preparación IK. Fuente, runtime y herramienta con hashes en `docs/reviews/phase05-asset-evidence.json`. Pruebas y límites en `docs/reviews/phase05-contact-review.md`.
