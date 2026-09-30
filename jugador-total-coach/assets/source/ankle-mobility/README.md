# Fuente editable: ankle-mobility

Fase 06, 2026-09-30. Derivada localmente de [hip-hinge](../hip-hinge/hip-hinge-v1.blend), con avatar Quaternius, rig de 65 huesos, pesos, ropa y correcciones de hombros/brazos ya incorporados. Componentes originales CC0-1.0: [licencia conservada](../hip-hinge/QUATERNIUS_LICENSE.txt). Aportaciones del proyecto sin nueva licencia pública elegida. Sin descarga, modelo generado por IA ni paquete Source de pago.

Autoría: poses específicas mediante IK, bake y exportador glTF integrado de Blender 4.5.14 LTS. No se crea un rig, solver ni exportador. Comando desde jugador-total-coach:

```powershell
node tools/blender.mjs tools/build_standing_movements.py
```

- [EX_ankle-mobility__left__v1](ankle-mobility-left-v1.blend): 8 s, 30 FPS, finito. SHA-256 fuente: `1fe3d2b6ecb513eec378fde4126dd3d1ae039d645b4dbe5157dd42a8da490fdc`.
- [EX_ankle-mobility__right__v1](ankle-mobility-right-v1.blend): 8 s, 30 FPS, finito. SHA-256 fuente: `9abb5dbdeaf53cbdcffe129b0f23110a22740e74d9e573d2ebf529146a1511c8`.

Inicio y final explícitos; sin ciclo automático ni transición entre ejercicios. El script de grupo puede reexportar ambos lados/otros patrones: revisar hashes antes de aceptar cambios.

[Mediciones de recursos](../../../docs/reviews/evidence/phase06/asset-validation.json), [fundamento y límites internos](../../../docs/training/PHASE06_DOCUMENTARY_REVIEW.md). Estado deportivo draft. La exportación o la lectura de fuentes no acredita revisión profesional.
