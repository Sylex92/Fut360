"""Refine existing clips with coordinated support, torso and arms in Blender.

Reuse authored foot/ball paths and sampled CC0 Walk arm angles. Blender supplies
IK, pose baking and glTF export. This is authored illustration, not a gait solver.
"""
import bpy
import json
import math
import sys
from pathlib import Path
from mathutils import Matrix, Vector

ROOT = Path(__file__).resolve().parents[1]
REFERENCE = json.loads((ROOT / 'assets/source/active-march/walk-arm-reference.json').read_text())['samples']
CASES = [('active-march', '', 8), ('mini-squat', '', 5.2),
         ('soft-step-turn', 'left', 7.2), ('soft-step-turn', 'right', 7.2),
         ('inside-inside', '', 6.5), ('lateral-sole-roll', 'left', 6.5),
         ('lateral-sole-roll', 'right', 6.5), ('inside-outside', 'left', 6.5),
         ('inside-outside', 'right', 6.5)]
selected = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
if selected:
    CASES = [case for case in CASES if case[0] + ('-' + case[1] if case[1] else '') in selected]
    if not CASES: raise ValueError('No matching authored movement')


def smooth(value):
    value = max(0, min(1, value))
    return value * value * (3 - 2 * value)


def walk_angles(phase, side):
    value = (phase % 1) * 128
    index = int(value)
    a, b = REFERENCE[index][side], REFERENCE[index + 1][side]
    return {key: a[key] + (b[key] - a[key]) * (value - index) for key in a}


def source_time(kind, t, duration):
    if kind == 'active-march':
        if t <= .5: return 0
        if t >= 7.1: return 8
        step = (t - .5) / 1.1
        return (1 if int(step) % 2 == 0 else 4.5) + (step % 1) * 2.5
    if kind == 'inside-inside':
        if t <= .35: return 0
        if t >= 6.15: return 8
        return ((t - .35) / 2.9 % 1) * 8
    # Trim long neutral holds; retain finite entrance and exit with no abrupt cut.
    return 10 * t / duration if kind not in ['mini-squat'] else 8 * t / duration


def rotate_about_head(bone, rotation):
    bone.matrix = (Matrix.Translation(bone.head) @ rotation
                   @ Matrix.Translation(-bone.head) @ bone.matrix)
    bpy.context.view_layer.update()


def arm_pitch(bone, yaw):
    direction = Matrix.Rotation(-yaw, 3, 'Z') @ (bone.tail - bone.head)
    return math.atan2(-direction.y, -direction.z)


def set_pitch(bone, target, yaw):
    delta = target - arm_pitch(bone, yaw)
    rotation = (Matrix.Rotation(yaw, 4, 'Z') @ Matrix.Rotation(-delta, 4, 'X')
                @ Matrix.Rotation(-yaw, 4, 'Z'))
    rotate_about_head(bone, rotation)


for kind, variant, duration in CASES:
    stem = kind + ('-' + variant if variant else '')
    bpy.ops.wm.open_mainfile(filepath=str(ROOT / f'assets/source/{kind}/{stem}-v1.blend'))
    scene = bpy.context.scene
    rig = next(o for o in scene.objects if o.type == 'ARMATURE')
    ball = bpy.data.objects.get('TutorialBall')
    meshes = [o for o in scene.objects if o.type == 'MESH' and any(
        m.type == 'ARMATURE' and m.object == rig for m in o.modifiers)]
    frames = round(duration * 30)
    poses = []
    for frame in range(frames + 1):
        t = frame / 30
        old = source_time(kind, t, duration)
        f = old * 30
        scene.frame_set(int(f), subframe=f - int(f))
        bpy.context.view_layer.update()
        shoulder_line = rig.pose.bones['upperarm_l'].head - rig.pose.bones['upperarm_r'].head
        poses.append({'basis': {b.name: b.matrix_basis.copy() for b in rig.pose.bones},
                      'feet': {s: (rig.matrix_world @ rig.pose.bones['foot_' + s].matrix).copy() for s in ['l', 'r']},
                      'yaw': math.atan2(shoulder_line.y, shoulder_line.x),
                      'ball': ball.matrix_world.copy() if ball else None, 'old': old})
    rig.animation_data_clear()
    if ball: ball.animation_data_clear()
    targets, poles = {}, []
    for side, sign in [('l', 1), ('r', -1)]:
        target = bpy.data.objects.new('Fixed authored ankle ' + side, None)
        scene.collection.objects.link(target)
        target.rotation_mode = 'QUATERNION'
        pole = bpy.data.objects.new('Knee guide ' + side, None)
        scene.collection.objects.link(pole)
        ik = rig.pose.bones['calf_' + side].constraints.new('IK')
        ik.target, ik.pole_target, ik.chain_count = target, pole, 2
        ik.pole_angle, ik.use_stretch = -math.pi / 2, False
        rotation = rig.pose.bones['foot_' + side].constraints.new('COPY_ROTATION')
        rotation.target, rotation.target_space, rotation.owner_space = target, 'WORLD', 'WORLD'
        targets[side] = target
        poles.append(pole)
    scene.render.fps, scene.frame_start, scene.frame_end = 30, 0, frames
    for frame, pose in enumerate(poses):
        scene.frame_set(frame)
        t, old = frame / 30, pose['old']
        for bone in rig.pose.bones:
            bone.rotation_mode = 'QUATERNION'
            bone.matrix_basis = pose['basis'][bone.name]
        yaw = pose['yaw']
        envelope = smooth(t / .45) * smooth((duration - t) / .45)
        for i, side in enumerate(['l', 'r']):
            targets[side].matrix_world = pose['feet'][side]
            if kind == 'inside-inside':
                local = old - (4 if side == 'l' else 0)
                contact = smooth((local - .8) / .6) * smooth((3.4 - local) / 1)
                targets[side].location.x -= (1 if side == 'l' else -1) * .03 * contact
            if kind == 'inside-outside' and side == ('l' if variant == 'left' else 'r'):
                approach = smooth((old - 4.5) / .5) * smooth((7.5 - old) / .5)
                targets[side].location.x += (1 if side == 'l' else -1) * .005 * approach
            poles[i].location = Matrix.Rotation(yaw, 4, 'Z') @ Vector(((1 if side == 'l' else -1) * .4, -1, .55))
            for prop in ['location', 'rotation_quaternion']:
                targets[side].keyframe_insert(data_path=prop)
            poles[i].keyframe_insert(data_path='location')
        bpy.context.view_layer.update()
        step = (t - .5) / 1.1
        balance = math.sin(math.pi * step) * envelope
        if kind == 'active-march':
            lift = .007 * (1 - math.cos(2 * math.pi * step)) * envelope
            rig.pose.bones['pelvis'].matrix = Matrix.Translation((0, 0, lift)) @ rig.pose.bones['pelvis'].matrix
            chest_yaw = -math.radians(3) * balance
            phase = step / 2 + .25
        elif kind == 'soft-step-turn':
            step = max(0, min(8, old - 1))
            balance = math.sin(math.pi * step) * envelope
            shift = Matrix.Rotation(yaw, 3, 'Z') @ Vector((-.045 * balance, 0, 0))
            rig.pose.bones['pelvis'].matrix = Matrix.Translation(shift) @ rig.pose.bones['pelvis'].matrix
            chest_yaw = -math.radians(2) * balance
            phase = step / 2 + .75
        elif ball:
            phase = old / 8 + .25
            if kind == 'inside-inside':
                balance = math.sin(math.pi * old / 4) * envelope
            else:
                sign = 1 if variant == 'left' else -1
                support = smooth(old / 1) * smooth((10 - old) / 1.2)
                # Transfer gradually: do not overextend the working leg before it lifts.
                transfer = .03 * support + .15 * smooth(old - 1) * smooth((9 - old) / 2)
                rig.pose.bones['pelvis'].matrix = Matrix.Translation((-sign * transfer, 0, -.035 * support)) @ rig.pose.bones['pelvis'].matrix
                balance = sign * math.sin(math.pi * old / 5) * envelope
            chest_yaw = -math.radians(4) * balance
        else:
            chest_yaw, phase = 0, 0
        bpy.context.view_layer.update()
        if chest_yaw:
            rotate_about_head(rig.pose.bones['spine_02'], Matrix.Rotation(chest_yaw, 4, 'Z'))
            rotate_about_head(rig.pose.bones['neck_01'], Matrix.Rotation(-chest_yaw * .65, 4, 'Z'))
        for side, sign in [('l', 1), ('r', -1)]:
            upper, lower = rig.pose.bones['upperarm_' + side], rig.pose.bones['lowerarm_' + side]
            current = arm_pitch(upper, yaw + chest_yaw)
            if kind in ['active-march', 'soft-step-turn']:
                angles = walk_angles(phase, side)
                amplitude = 1 if kind == 'active-march' else .65
                target = current + (angles['swing'] * amplitude - current) * envelope
                elbow = angles['elbow'] * envelope
            elif ball:
                target = current + (math.radians(10 + sign * 8 * balance) - current) * envelope
                elbow = math.radians(24 + sign * 5 * balance) * envelope
            else:
                # Existing squat arm lift retained; relax elbows as the arms come forward.
                target = current
                elbow = math.radians(14) * math.sin(math.pi * t / duration) ** 2
            set_pitch(upper, target, yaw + chest_yaw)
            set_pitch(lower, target + elbow, yaw + chest_yaw)
        for bone in rig.pose.bones:
            for prop in ['location', 'rotation_quaternion', 'scale']:
                bone.keyframe_insert(data_path=prop)
        if ball:
            ball.matrix_world = pose['ball']
            for prop in ['location', 'rotation_euler', 'scale']:
                ball.keyframe_insert(data_path=prop)
    old_clip = scene.name
    clip = old_clip.rsplit('__v', 1)[0] + '__v2'
    scene.name = clip
    rig.animation_data.action.name = clip
    if ball: ball.animation_data.action.name = clip + '_ball'
    bpy.ops.object.select_all(action='DESELECT')
    rig.select_set(True)
    bpy.context.view_layer.objects.active = rig
    bpy.ops.object.mode_set(mode='POSE')
    bpy.ops.pose.select_all(action='SELECT')
    bpy.ops.nla.bake(frame_start=0, frame_end=frames, step=1, only_selected=True,
                    visual_keying=True, clear_constraints=True, use_current_action=True, bake_types={'POSE'})
    bpy.ops.object.mode_set(mode='OBJECT')
    for obj in list(targets.values()) + poles: bpy.data.objects.remove(obj, do_unlink=True)
    scene.frame_set(0)
    bpy.ops.object.select_all(action='DESELECT')
    for obj in [rig] + meshes + ([ball] if ball else []): obj.select_set(True)
    bpy.context.view_layer.objects.active = rig
    bpy.ops.export_scene.gltf(filepath=str(ROOT / f'assets/runtime/{stem}-v2.glb'),
        export_format='GLB', use_selection=True, export_animations=True, export_animation_mode='SCENE',
        export_anim_scene_split_object=False, export_nla_strips_merged_animation_name=clip,
        export_force_sampling=True, export_frame_range=True, export_yup=True, export_cameras=False, export_lights=False)
    bpy.ops.wm.save_as_mainfile(filepath=str(ROOT / f'assets/source/{kind}/{stem}-v2.blend'), compress=True)
    print('COORDINATED_EXPORTED', stem, duration, clip)
