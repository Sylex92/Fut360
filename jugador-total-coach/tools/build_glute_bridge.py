"""Author a finite bilateral bridge on the existing Quaternius rig using Blender IK.

This clip starts/ends supine; getting down/up is not part of the demonstration.
The authored range is illustrative, not an anatomical target or prescription.
"""
import bpy
import json
import math
import sys
from pathlib import Path
from mathutils import Matrix, Vector

ROOT = Path(__file__).resolve().parents[1]
args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
kind = args[0] if args else 'glute-bridge'
if kind not in ('glute-bridge', 'dead-bug'):
    raise ValueError('Only the reviewed floor variants are supported')
duration = 14 if kind == 'dead-bug' else 8
OUT = ROOT / 'assets/source' / kind
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
for b in rig.pose.bones:
    b.rotation_mode = 'QUATERNION'

supine = Matrix.Rotation(-math.pi / 2, 4, 'X')
# Transform the corrected standing pose as a whole, then hold ankles with IK.
origin = Vector((0, 0, .119))
neutral = Matrix.Translation(origin) @ supine @ Matrix.Translation(-base['pelvis'].translation)
pivot = neutral @ Vector((0, .05, 1.43))
targets, poles = {}, []
for side, sign in [('l', 1), ('r', -1)]:
    target = bpy.data.objects.new('Ankle support ' + side, None)
    scene.collection.objects.link(target)
    target.matrix_world = (Matrix.Translation((sign * .14, -.55, .096))
                           @ base['foot_' + side].to_quaternion().to_matrix().to_4x4())
    pole = bpy.data.objects.new('Knee forward ' + side, None)
    scene.collection.objects.link(pole)
    pole.location = (sign * .14, -.4, 1.2)
    ik = rig.pose.bones['calf_' + side].constraints.new('IK')
    ik.target, ik.pole_target = target, pole
    ik.chain_count, ik.pole_angle, ik.use_stretch = 2, -math.pi / 2, False
    rotation = rig.pose.bones['foot_' + side].constraints.new('COPY_ROTATION')
    rotation.target, rotation.target_space, rotation.owner_space = target, 'WORLD', 'WORLD'
    targets[side] = target
    poles.append(pole)

def smooth(x):
    x = max(0, min(1, x))
    return x*x*(3-2*x)

def amount_at(t):
    if t < 1: return 0
    if t < 3: return smooth((t-1)/2)
    if t < 4: return 1
    if t < 6: return 1-smooth((t-4)/2)
    return 0

scene.render.fps, scene.frame_start, scene.frame_end = 30, 0, duration * 30
for frame in range(duration * 30 + 1):
    scene.frame_set(frame)
    for bone in rig.pose.bones:
        bone.matrix_basis = basis[bone.name]
    bpy.context.view_layer.update()
    t = frame / 30
    angle = math.radians(-3 + (29 * amount_at(t) if kind == 'glute-bridge' else 0))
    tilt = Matrix.Translation(pivot) @ Matrix.Rotation(-angle, 4, 'X') @ Matrix.Translation(-pivot)
    rig.pose.bones['pelvis'].matrix = tilt @ neutral @ base['pelvis']
    bpy.context.view_layer.update()
    # Keep neck/head resting with a small upper-thoracic articulation.
    neck = rig.pose.bones['neck_01']
    neck.matrix = (Matrix.Translation(neutral @ base['neck_01'].translation)
                   @ Matrix.Rotation(math.radians(-43), 4, 'X') @ supine
                   @ base['neck_01'].to_quaternion().to_matrix().to_4x4())
    bpy.context.view_layer.update()
    head = rig.pose.bones['Head']
    head.matrix = Matrix.Translation(head.head) @ supine @ base['Head'].to_quaternion().to_matrix().to_4x4()
    bpy.context.view_layer.update()
    for side in ('l', 'r'):
        lift = amount_at(t - (6 if side == 'l' else 0)) if kind == 'dead-bug' else 0
        targets[side].location.y = -.55 + .12 * lift
        targets[side].location.z = .096 + .15 * lift
        targets[side].keyframe_insert(data_path='location')
        bpy.context.view_layer.update()
        name = 'upperarm_' + side
        bone = rig.pose.bones[name]
        bone.matrix = Matrix.Translation(bone.head) @ (supine @ base[name].to_quaternion().to_matrix().to_4x4())
        bpy.context.view_layer.update()
        forearm = rig.pose.bones['lowerarm_' + side]
        # Turn the relaxed forearm so the palm faces the mat, with a slight descent.
        forearm.matrix = (Matrix.Translation(forearm.head)
            @ Matrix.Rotation(math.radians(7), 4, 'X')
            @ supine @ base['lowerarm_' + side].to_quaternion().to_matrix().to_4x4()
            @ Matrix.Rotation(math.radians(-90 if side == 'l' else 90), 4, 'Y'))
        bpy.context.view_layer.update()
    for bone in rig.pose.bones:
        for prop in ['location', 'rotation_quaternion', 'scale']:
            bone.keyframe_insert(data_path=prop)

clip = 'EX_glute-bridge__bilateral__v1' if kind == 'glute-bridge' else 'EX_dead-bug__arms-supported__v1'
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
for obj in list(targets.values()) + poles:
    bpy.data.objects.remove(obj, do_unlink=True)

report = []
for frame in range(0, duration * 30 + 1, 30):
    scene.frame_set(frame)
    graph = bpy.context.evaluated_depsgraph_get()
    points = []
    for obj in meshes:
        ev = obj.evaluated_get(graph)
        mesh = ev.to_mesh()
        points.extend(ev.matrix_world @ v.co for v in mesh.vertices)
        ev.to_mesh_clear()
    report.append({'frame': frame,
        'bounds': [[min(p[i] for p in points) for i in range(3)], [max(p[i] for p in points) for i in range(3)]],
        'joints': {name: list(rig.matrix_world @ rig.pose.bones[name].head) for name in ['pelvis', 'Head', 'neck_01', 'foot_l', 'foot_r', 'calf_l', 'calf_r', 'upperarm_l', 'hand_l']}})
(ROOT / f'.cache/phase06/{kind}-authoring.json').write_text(json.dumps(report, indent=2))

scene.frame_set(0)
bpy.ops.object.select_all(action='DESELECT')
for obj in [rig] + meshes:
    obj.select_set(True)
bpy.context.view_layer.objects.active = rig
bpy.ops.export_scene.gltf(filepath=str(ROOT / f'assets/runtime/{kind}-v1.glb'),
    export_format='GLB', use_selection=True, export_animations=True,
    export_animation_mode='SCENE', export_anim_scene_split_object=False,
    export_nla_strips_merged_animation_name=clip, export_force_sampling=True,
    export_frame_range=True, export_yup=True, export_cameras=False, export_lights=False)
bpy.ops.wm.save_as_mainfile(filepath=str(OUT / f'{kind}-v1.blend'), compress=True)
print('BRIDGE_EXPORTED', json.dumps(report))
