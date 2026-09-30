"""Author only the missing contact clip on the existing CC0 rig, with Blender IK."""
import bpy
import json
import math
from pathlib import Path
from mathutils import Matrix, Vector

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/source/inside-inside'
OUT.mkdir(parents=True, exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(ROOT / 'assets/source/hip-hinge/hip-hinge-v1.blend'))
scene = bpy.context.scene
scene.frame_set(0)
rig = next(o for o in scene.objects if o.type == 'ARMATURE')
meshes = [o for o in scene.objects if o.type == 'MESH' and any(
    m.type == 'ARMATURE' and m.object == rig for m in o.modifiers)]
base = {b.name: b.matrix.copy() for b in rig.pose.bones}
basis = {b.name: b.matrix_basis.copy() for b in rig.pose.bones}
feet = {s: (rig.matrix_world @ rig.pose.bones['foot_' + s].matrix).copy() for s in ('l', 'r')}
rig.animation_data_clear()
for b in rig.pose.bones:
    b.rotation_mode = 'QUATERNION'

targets = {}
poles = []
for side, sign in [('l', 1), ('r', -1)]:
    target = bpy.data.objects.new('Ankle target ' + side, None)
    scene.collection.objects.link(target)
    target.matrix_world = feet[side]
    target.rotation_mode = 'QUATERNION'
    pole = bpy.data.objects.new('Knee pole ' + side, None)
    scene.collection.objects.link(pole)
    pole.location = (sign * .4, -1, .5)
    ik = rig.pose.bones['calf_' + side].constraints.new('IK')
    ik.target, ik.pole_target = target, pole
    ik.chain_count, ik.pole_angle, ik.use_stretch = 2, -math.pi / 2, False
    rotation = rig.pose.bones['foot_' + side].constraints.new('COPY_ROTATION')
    rotation.target, rotation.target_space, rotation.owner_space = target, 'WORLD', 'WORLD'
    targets[side] = target
    poles.append(pole)

def smooth(a):
    a = min(1, max(0, a))
    return a * a * (3 - 2 * a)

def stroke(t):
    if t < .8 or t >= 3.4:
        return 0, 0
    if t <= 2.4:
        return .16 * smooth((t - .8) / 1.6), .02 * smooth((t - .8) / .35)
    return .16 * (1 - smooth(t - 2.4)), .02 * (1 - smooth(t - 2.4))

def ball_x(t):
    # Authored illustration, not a simulation: follow the medial contact region
    # during the push, then a continuous tangent into the opposite receiving side.
    if t >= 8:
        return -.15
    sign, local = (1, t) if t < 4 else (-1, t - 4)
    if local <= 2:
        return sign * max(-.15, -.34 + stroke(local)[0] + .138)
    u = (local - 2) / 2
    start = -.34 + stroke(2)[0] + .138
    return sign * ((2*u**3 - 3*u**2 + 1) * start
                   + (u**3 - 2*u**2 + u) * 2 * .1125
                   + (-2*u**3 + 3*u**2) * .15)

bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=16, radius=.11)
ball = bpy.context.object
ball.name = 'TutorialBall'
while ball.data.uv_layers:
    ball.data.uv_layers.remove(ball.data.uv_layers[0])
for name, color in [('Ball ivory', (.92, .86, .64, 1)), ('Ball dark bands', (.04, .17, .15, 1))]:
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = color
    mat.use_nodes = True
    mat.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = color
    mat.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value = .8
    ball.data.materials.append(mat)
for polygon in ball.data.polygons:
    polygon.material_index = 1 if abs(polygon.center.z) < .018 else 0
ball.rotation_mode = 'XYZ'
scene.render.fps, scene.frame_start, scene.frame_end = 30, 0, 300
samples = []
for frame in range(301):
    scene.frame_set(frame)
    t = frame / 30
    for b in rig.pose.bones:
        b.matrix_basis = basis[b.name]
    bpy.context.view_layer.update()
    pelvis = rig.pose.bones['pelvis']
    shift = .08 * math.sin(math.pi * min(t, 8) / 4)
    pelvis.matrix = Matrix.Translation((shift, 0, -.1)) @ base['pelvis']
    for side, sign in [('l', 1), ('r', -1)]:
        amount, lift = stroke(t - (4 if side == 'l' else 0))
        position = Vector((sign * (.34 - amount), feet[side].translation.y, feet[side].translation.z + lift))
        targets[side].matrix_world = Matrix.Translation(position) @ Matrix.Rotation(sign * math.radians(15), 4, 'Z') @ feet[side].to_quaternion().to_matrix().to_4x4()
        targets[side].keyframe_insert(data_path='location')
        targets[side].keyframe_insert(data_path='rotation_quaternion')
    bpy.context.view_layer.update()
    for b in rig.pose.bones:
        b.keyframe_insert(data_path='location')
        b.keyframe_insert(data_path='rotation_quaternion')
        b.keyframe_insert(data_path='scale')
    ball.location = (ball_x(t), -.035, .11)
    ball.rotation_euler.y = (ball_x(t) + .15) / .11
    ball.keyframe_insert(data_path='location')
    ball.keyframe_insert(data_path='rotation_euler')
    samples.append({'frame': frame, 'ball': list(ball.location), 'feet': {
        s: list(rig.matrix_world @ rig.pose.bones['foot_' + s].head) for s in ('l', 'r')}})

clip = 'EX_inside-inside__alternating__v1'
scene.name = clip
rig.animation_data.action.name = clip
ball.animation_data.action.name = clip + '_ball'
bpy.ops.object.select_all(action='DESELECT')
rig.select_set(True)
bpy.context.view_layer.objects.active = rig
bpy.ops.object.mode_set(mode='POSE')
bpy.ops.pose.select_all(action='SELECT')
bpy.ops.nla.bake(frame_start=0, frame_end=300, step=1, only_selected=True,
                 visual_keying=True, clear_constraints=True, use_current_action=True,
                 bake_types={'POSE'})
bpy.ops.object.mode_set(mode='OBJECT')
for obj in list(targets.values()) + poles:
    bpy.data.objects.remove(obj, do_unlink=True)
scene.frame_set(0)
# Export scene mode produces one timeline including avatar and ball.
bpy.ops.object.select_all(action='DESELECT')
for obj in [rig, ball] + meshes:
    obj.select_set(True)
bpy.context.view_layer.objects.active = rig
bpy.ops.export_scene.gltf(filepath=str(ROOT / 'assets/runtime/inside-inside-v1.glb'),
    export_format='GLB', use_selection=True, export_animations=True,
    export_animation_mode='SCENE', export_anim_scene_split_object=False,
    export_nla_strips_merged_animation_name=clip,
    export_force_sampling=True, export_frame_range=True, export_yup=True,
    export_cameras=False, export_lights=False)
bpy.ops.wm.save_as_mainfile(filepath=str(OUT / 'inside-inside-v1.blend'), compress=True)
(ROOT / '.cache/phase05/authoring.json').write_text(json.dumps({
    'blenderVersion': bpy.app.version_string, 'clip': clip, 'samples': samples}, indent=2))
print('CONTACT_CLIP_EXPORTED')
