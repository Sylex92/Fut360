"""One wall press-up on the existing rig; Blender IK/bake/glTF, no custom solver.

NHS technique is the documentary reference. Distances and 8 s are authoring
choices for this avatar, not user measurements or an individual prescription.
"""
import bpy
import json
import math
from pathlib import Path
from mathutils import Matrix, Vector

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/source/wall-push-up'
OUT.mkdir(parents=True, exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(ROOT / 'assets/source/hip-hinge/hip-hinge-v1.blend'))
scene = bpy.context.scene
scene.frame_set(0)
rig = next(o for o in scene.objects if o.type == 'ARMATURE')
meshes = [o for o in scene.objects if o.type == 'MESH' and any(
    m.type == 'ARMATURE' and m.object == rig for m in o.modifiers)]
base = {b.name: b.matrix.copy() for b in rig.pose.bones}
basis = {b.name: b.matrix_basis.copy() for b in rig.pose.bones}
rig.animation_data_clear()
WALL_Y = -.40
helpers = []

def empty(name, matrix):
    obj = bpy.data.objects.new(name, None)
    scene.collection.objects.link(obj)
    obj.matrix_world = matrix
    helpers.append(obj)
    return obj

for side, sign in [('l', 1), ('r', -1)]:
    foot = rig.matrix_world @ base['foot_' + side]
    foot.translation.y += .10
    target = empty('Foot support ' + side, foot)
    pole = empty('Knee guide ' + side, Matrix.Translation((sign * .16, -.9, .55)))
    ik = rig.pose.bones['calf_' + side].constraints.new('IK')
    ik.target, ik.pole_target, ik.chain_count = target, pole, 2
    ik.pole_angle, ik.use_stretch = -math.pi / 2, False
    rotation = rig.pose.bones['foot_' + side].constraints.new('COPY_ROTATION')
    rotation.target, rotation.target_space, rotation.owner_space = target, 'WORLD', 'WORLD'

    # Local Y runs toward fingers. Local X is the palm normal on the left;
    # mirrored on the right. Both palms face the wall, thumbs point inward.
    hand_rotation = (Matrix.Rotation(math.radians(6), 3, 'X')
                     @ Matrix(((0, 0, -sign), (-sign, 0, 0), (0, 1, 0))))
    wrist = Matrix.Translation((sign * .235, WALL_Y + .0465, 1.29)) @ hand_rotation.to_4x4()
    target = empty('Palm support ' + side, wrist)
    pole = empty('Elbow guide ' + side, Matrix.Translation((sign * .43, .25, 1.0)))
    ik = rig.pose.bones['lowerarm_' + side].constraints.new('IK')
    ik.target, ik.pole_target, ik.chain_count = target, pole, 2
    ik.pole_angle, ik.use_stretch = -math.pi / 2, False
    rotation = rig.pose.bones['hand_' + side].constraints.new('COPY_ROTATION')
    rotation.target, rotation.target_space, rotation.owner_space = target, 'WORLD', 'WORLD'

# Single-sided plane: outside view looks through it, preserving the frontal
# teaching view. Thin perimeter remains visible; this is a visual guide only.
material = bpy.data.materials.new('Wall reference')
material.diffuse_color = (.46, .60, .59, 1)
material.use_nodes = True
material.use_backface_culling = True
material.node_tree.nodes.get('Principled BSDF').inputs['Base Color'].default_value = (.46, .60, .59, 1)
material.node_tree.nodes.get('Principled BSDF').inputs['Roughness'].default_value = 1
data = bpy.data.meshes.new('Wall reference plane')
data.from_pydata([(-.75, WALL_Y, 0), (-.75, WALL_Y, 1.9),
                 (.75, WALL_Y, 1.9), (.75, WALL_Y, 0)], [], [(0, 1, 2, 3)])
wall = bpy.data.objects.new('TutorialWall', data)
scene.collection.objects.link(wall)
wall.data.materials.append(material)
props = [wall]
for x, z, sx, sz in [(-.75, .95, .008, 1.9), (.75, .95, .008, 1.9),
                     (0, 1.9, 1.5, .008), (0, .004, 1.5, .008)]:
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x, WALL_Y, z))
    obj = bpy.context.object
    obj.name = 'Wall edge'
    obj.scale = (sx, .008, sz)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(material)
    props.append(obj)

def smooth(v):
    v = max(0, min(1, v))
    return v * v * (3 - 2 * v)

def pulse(t):
    if t < 1: return 0
    if t < 3.5: return smooth((t - 1) / 2.5)
    if t < 4: return 1
    if t < 6.5: return 1 - smooth((t - 4) / 2.5)
    return 0

duration = 8
scene.render.fps, scene.frame_start, scene.frame_end = 30, 0, duration * 30
pivot = Vector((0, .0875, .0865))
for frame in range(duration * 30 + 1):
    scene.frame_set(frame)
    for bone in rig.pose.bones:
        bone.rotation_mode = 'QUATERNION'
        bone.matrix_basis = basis[bone.name]
    bpy.context.view_layer.update()
    tilt = (Matrix.Translation(pivot + Vector((0, .10, 0)))
            @ Matrix.Rotation(math.radians(2.1 + 8.9 * pulse(frame / 30)), 4, 'X')
            @ Matrix.Translation(-pivot))
    rig.pose.bones['pelvis'].matrix = tilt @ base['pelvis']
    bpy.context.view_layer.update()
    for side, sign in [('l', 1), ('r', -1)]:
        # The neutral rig's thumbs curl into the palm plane. Open the existing
        # thumb joints so the pads can rest alongside the fingers on the wall.
        thumb = rig.pose.bones['thumb_01_' + side]
        direction = (thumb.tail - thumb.head).normalized()
        turn = direction.rotation_difference(Vector((-sign * .70, .25, .71)).normalized())
        thumb.matrix = (Matrix.Translation(thumb.head) @ turn.to_matrix().to_4x4()
                        @ thumb.matrix.to_quaternion().to_matrix().to_4x4())
        bpy.context.view_layer.update()
    for bone in rig.pose.bones:
        for prop in ['location', 'rotation_quaternion', 'scale']:
            bone.keyframe_insert(data_path=prop)

clip = 'EX_wall-push-up__bilateral__v1'
scene.name = clip
rig.animation_data.action.name = clip
bpy.ops.object.select_all(action='DESELECT')
rig.select_set(True)
bpy.context.view_layer.objects.active = rig
bpy.ops.object.mode_set(mode='POSE')
bpy.ops.pose.select_all(action='SELECT')
bpy.ops.nla.bake(frame_start=0, frame_end=duration * 30, step=1, only_selected=True,
    visual_keying=True, clear_constraints=True, use_current_action=True, bake_types={'POSE'})
bpy.ops.object.mode_set(mode='OBJECT')
for obj in helpers:
    bpy.data.objects.remove(obj, do_unlink=True)

# Put the wall perimeter just inside the edge of the existing 2×2 floor.
# Apply the same translation to rest geometry and rig, keeping skinned nodes
# at scene root with identity transforms as required by portable glTF skinning.
for obj in [rig] + meshes + props:
    obj.location.y -= .5959
for obj in meshes:
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.transform_apply(location=True, rotation=False, scale=False)
bpy.context.view_layer.update()

report = []
for frame in [0, 105, 240]:
    scene.frame_set(frame)
    report.append({'frame': frame, 'joints': {n: list(rig.matrix_world @ rig.pose.bones[n].head)
        for n in ['Head', 'pelvis', 'upperarm_l', 'lowerarm_l', 'hand_l',
                  'upperarm_r', 'lowerarm_r', 'hand_r', 'middle_03_l', 'middle_03_r']}})
(ROOT / '.cache/phase06/wall-authoring.json').write_text(json.dumps(report, indent=2), encoding='utf8')
scene.frame_set(0)
bpy.ops.object.select_all(action='DESELECT')
for obj in [rig] + meshes + props:
    obj.select_set(True)
bpy.context.view_layer.objects.active = rig
bpy.ops.export_scene.gltf(filepath=str(ROOT / 'assets/runtime/wall-push-up-v1.glb'),
    export_format='GLB', use_selection=True, export_animations=True,
    export_animation_mode='SCENE', export_anim_scene_split_object=False,
    export_nla_strips_merged_animation_name=clip, export_force_sampling=True,
    export_frame_range=True, export_yup=True, export_cameras=False, export_lights=False)
bpy.ops.wm.save_as_mainfile(filepath=str(OUT / 'wall-push-up-v1.blend'), compress=True)
print('WALL_PUSH_EXPORTED', json.dumps(report))
