"""Join existing coordinated ball demonstrations with Blender; no new rig/solver.

30 fps, two 6.5 s phrases separated by a 0.6 s pose transition.
The ball remains animation-authoritative; timing illustrates rather than prescribes.
"""
from pathlib import Path
import bpy

ROOT = Path(__file__).resolve().parents[1]
KIND = 'inside-outside-sole'
FPS = 30
JOIN_FRAMES = 18


def sample(kind, side):
    bpy.ops.wm.open_mainfile(filepath=str(ROOT / f'assets/source/{kind}/{kind}-{side}-v2.blend'))
    scene = bpy.context.scene
    rig = next(o for o in scene.objects if o.type == 'ARMATURE')
    ball = scene.objects['TutorialBall']
    result = []
    for frame in range(196):
        scene.frame_set(frame)
        result.append((
            {bone.name: bone.matrix_basis.copy() for bone in rig.pose.bones},
            ball.matrix_world.copy(),
        ))
    return result


for side in ['left', 'right']:
    first = sample('inside-outside', side)
    second = sample('lateral-sole-roll', side)
    scene = bpy.context.scene
    rig = next(o for o in scene.objects if o.type == 'ARMATURE')
    ball = scene.objects['TutorialBall']
    sequence = list(first)
    for frame in range(1, JOIN_FRAMES + 1):
        fraction = frame / JOIN_FRAMES
        blend = fraction * fraction * (3 - 2 * fraction)
        sequence.append((
            {name: pose.lerp(second[0][0][name], blend) for name, pose in first[-1][0].items()},
            first[-1][1].lerp(second[0][1], blend),
        ))
    sequence.extend(second[1:])
    for obj in scene.objects:
        obj.animation_data_clear()
    scene.frame_start = 0
    scene.frame_end = len(sequence) - 1
    scene.render.fps = FPS
    scene.render.fps_base = 1
    clip = f'EX_{KIND}__{side}__v1'
    scene.name = clip
    for frame, (bones, ball_pose) in enumerate(sequence):
        scene.frame_set(frame)
        for bone in rig.pose.bones:
            bone.rotation_mode = 'QUATERNION'
            bone.matrix_basis = bones[bone.name]
            for prop in ['location', 'rotation_quaternion', 'scale']:
                bone.keyframe_insert(data_path=prop)
        ball.matrix_world = ball_pose
        for prop in ['location', 'rotation_euler', 'scale']:
            ball.keyframe_insert(data_path=prop)
    rig.animation_data.action.name = clip
    ball.animation_data.action.name = clip + '_ball'
    scene.frame_set(0)
    bpy.ops.object.select_all(action='DESELECT')
    for obj in scene.objects:
        if obj.type in {'ARMATURE', 'MESH'}:
            obj.select_set(True)
    bpy.context.view_layer.objects.active = rig
    stem = f'{KIND}-{side}-v1'
    bpy.ops.export_scene.gltf(
        filepath=str(ROOT / f'assets/runtime/{stem}.glb'),
        export_format='GLB', use_selection=True, export_animations=True,
        export_animation_mode='SCENE', export_anim_scene_split_object=False,
        export_nla_strips_merged_animation_name=clip, export_force_sampling=True,
        export_frame_range=True, export_yup=True, export_cameras=False, export_lights=False,
    )
    source_dir = ROOT / f'assets/source/{KIND}'
    source_dir.mkdir(parents=True, exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=str(source_dir / f'{stem}.blend'), compress=True)
    print('COMBINATION_EXPORTED', stem, scene.frame_end / FPS, flush=True)
