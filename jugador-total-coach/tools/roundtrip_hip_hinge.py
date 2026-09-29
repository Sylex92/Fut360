"""Verify that the exported GLB remains importable/editable using Blender's tools."""
import bpy
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.context.scene.render.fps = 30
bpy.ops.import_scene.gltf(filepath=str(root / 'assets/runtime/hip-hinge-v1.glb'))
rig = next(obj for obj in bpy.context.scene.objects if obj.type == 'ARMATURE')
assert len(rig.data.bones) == 65
assert any(action.name == 'EX_hip-hinge__neutral__v1' for action in bpy.data.actions)
assert len(bpy.data.images) == 1
assert bpy.data.images[0].size[0] == 512
scene = bpy.context.scene
scene.frame_start, scene.frame_end = 0, 240
scene.frame_set(0)
meshes = [o for o in scene.objects if o.type == 'MESH' and any(m.type == 'ARMATURE' for m in o.modifiers)]
for obj in meshes:
    matrix = obj.matrix_world.copy()
    obj.parent = None
    obj.matrix_world = matrix
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
bpy.ops.object.select_all(action='DESELECT')
for obj in [rig] + meshes:
    obj.select_set(True)
bpy.context.view_layer.objects.active = rig
bpy.ops.export_scene.gltf(filepath=str(root / '.cache/phase04/hip-hinge-roundtrip.glb'),
                          export_format='GLB', use_selection=True, export_animations=True,
                          export_animation_mode='ACTIONS', export_force_sampling=True,
                          export_frame_range=True, export_yup=True)
report = {'blenderVersion': bpy.app.version_string, 'bones': len(rig.data.bones),
          'meshes': len(meshes), 'images': len(bpy.data.images),
          'actions': [a.name for a in bpy.data.actions], 'source': 'assets/runtime/hip-hinge-v1.glb',
          'result': '.cache/phase04/hip-hinge-roundtrip.glb', 'passedImportExport': True}
(root / '.cache/phase04/roundtrip.json').write_text(json.dumps(report, indent=2), encoding='utf8')
print('ROUNDTRIP_IMPORT_EXPORT_OK')
