"""Render candidates through Blender/Cycles for visual selection, without changing originals."""
import bpy
from pathlib import Path
from mathutils import Vector

root = Path(__file__).resolve().parents[1]
sources = {
    'base-male': root / 'assets/downloads/universal-base-characters/Universal Base Characters[Standard]/Base Characters/Godot - UE/Superhero_Male_FullBody.gltf',
    'ual-mannequin': root / 'assets/downloads/universal-animation-library/Universal Animation Library[Standard]/Unreal-Godot/UAL1_Standard.glb',
}
for name, source in sources.items():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=str(source))
    for obj in bpy.context.scene.objects:
        obj.animation_data_clear()
    meshes = [o for o in bpy.context.scene.objects if o.type == 'MESH']
    pts = [o.matrix_world @ Vector(c) for o in meshes for c in o.bound_box]
    height = max(p.z for p in pts) - min(p.z for p in pts)
    center = Vector((0, 0, height * .5))
    scene = bpy.context.scene
    scene.render.engine = 'CYCLES'
    scene.cycles.device = 'CPU'
    scene.cycles.samples = 12
    scene.render.resolution_x = 512
    scene.render.resolution_y = 512
    scene.render.resolution_percentage = 100
    scene.world = bpy.data.worlds.new('Neutral world')
    scene.world.use_nodes = True
    scene.world.node_tree.nodes['Background'].inputs[0].default_value = (.7, .75, .72, 1)
    scene.world.node_tree.nodes['Background'].inputs[1].default_value = .7
    bpy.ops.object.light_add(type='AREA', location=(height, -height, height * 2))
    bpy.context.object.data.energy = 500
    bpy.context.object.data.size = 4
    bpy.ops.object.camera_add(location=(height * .8, -height * 2, height * 1.1))
    camera = bpy.context.object
    camera.rotation_euler = (center - camera.location).to_track_quat('-Z', 'Y').to_euler()
    camera.data.type = 'ORTHO'
    camera.data.ortho_scale = height * 1.5
    scene.camera = camera
    scene.render.filepath = str(root / '.cache/phase04' / (name + '.png'))
    bpy.ops.render.render(write_still=True)
