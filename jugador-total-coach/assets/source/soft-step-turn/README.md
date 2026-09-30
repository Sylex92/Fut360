# Fuente editable: soft-step-turn

Fase 06, 2026-09-30. Derivada localmente de [hip-hinge](../hip-hinge/hip-hinge-v1.blend), con avatar Quaternius, rig de 65 huesos, pesos, ropa y correcciones de hombros/brazos ya incorporados. Componentes originales CC0-1.0: [licencia conservada](../hip-hinge/QUATERNIUS_LICENSE.txt). Aportaciones del proyecto sin nueva licencia pública elegida. Sin descarga, modelo generado por IA ni paquete Source de pago.

Autoría: poses específicas mediante IK, bake y exportador glTF integrado de Blender 4.5.14 LTS. No se crea un rig, solver ni exportador. Comando desde jugador-total-coach:

```powershell
node tools/blender.mjs tools/build_standing_movements.py
```

- [EX_soft-step-turn__left__v1](soft-step-turn-left-v1.blend): 10 s, 30 FPS, finito. SHA-256 fuente: `39c6279e7011d4bf3c38d1fd87d95e228314541b24576929d9511d0fb5facdfc`.
- [EX_soft-step-turn__right__v1](soft-step-turn-right-v1.blend): 10 s, 30 FPS, finito. SHA-256 fuente: `80d223af326a2a6a18b7a095ddac3cd9bcf3abb92e7e6c6bfdb29a8c6ef563e5`.

Inicio y final explícitos; sin ciclo automático ni transición entre ejercicios. El script de grupo puede reexportar ambos lados/otros patrones: revisar hashes antes de aceptar cambios.

[Mediciones de recursos](../../../docs/reviews/evidence/phase06/asset-validation.json), [fundamento y límites internos](../../../docs/training/PHASE06_DOCUMENTARY_REVIEW.md). Estado deportivo draft. La exportación o la lectura de fuentes no acredita revisión profesional.
