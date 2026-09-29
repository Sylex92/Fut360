"""Inspect imported assets using Blender's existing glTF importer. No rig creation."""
import bpy
import json
from pathlib import Path
from mathutils import Vector

root = Path(__file__).resolve().parents[1]
source = root / 'assets/downloads/universal-base-characters/Universal Base Characters[Standard]/Base Characters/Godot - UE/Superhero_Male_FullBody.gltf'
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(source))
report = {'objects': [], 'actions': [a.name for a in bpy.data.actions]}
for obj in bpy.context.scene.objects:
    item = {'name': obj.name, 'type': obj.type, 'scale': list(obj.scale), 'location': list(obj.location)}
    if obj.type == 'MESH':
        corners = [obj.matrix_world @ Vector(c) for c in obj.bound_box]
        item['vertices'] = len(obj.data.vertices)
        item['bounds'] = [[min(c[i] for c in corners) for i in range(3)], [max(c[i] for c in corners) for i in range(3)]]
    if obj.type == 'ARMATURE':
        item['bones'] = [{'name': b.name, 'parent': b.parent.name if b.parent else None,
                          'head': list(b.head_local), 'tail': list(b.tail_local),
                          'rotation': list(b.matrix_local.to_quaternion())} for b in obj.data.bones]
    report['objects'].append(item)
out = root / '.cache/phase04/avatar-inspection.json'
out.write_text(json.dumps(report, indent=2), encoding='utf8')
print('INSPECTION_SAVED', out)
