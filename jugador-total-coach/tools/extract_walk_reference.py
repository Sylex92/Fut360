"""Extract editable arm angle curves from the already audited CC0 Standard clip."""
import bpy
import hashlib
import json
import math
from pathlib import Path

root = Path(__file__).resolve().parents[1]
source = root / 'assets/downloads/universal-animation-library/Universal Animation Library[Standard]/Unreal-Godot/UAL1_Standard.glb'
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(source))
rig = next(o for o in bpy.context.scene.objects if o.type == 'ARMATURE')
rig.animation_data_create()
for track in rig.animation_data.nla_tracks: track.mute = True
action = bpy.data.actions['Walk_Loop']
rig.animation_data.action = action
rig.animation_data.action_slot = action.slots[0]
samples = []
for index in range(129):
    frame = action.frame_range[0] + index / 128 * (action.frame_range[1] - action.frame_range[0])
    bpy.context.scene.frame_set(int(frame), subframe=frame - int(frame))
    bpy.context.view_layer.update()
    sample = {'phase': index / 128}
    for side in ['l', 'r']:
        upper, lower = rig.pose.bones['upperarm_' + side], rig.pose.bones['lowerarm_' + side]
        u, v = (upper.tail - upper.head).normalized(), (lower.tail - lower.head).normalized()
        sample[side] = {'swing': math.atan2(-u.y, -u.z), 'elbow': u.angle(v)}
    samples.append(sample)
output = {'source': 'Quaternius Universal Animation Library Standard / UAL1_Standard.glb',
          'sourceSha256': hashlib.sha256(source.read_bytes()).hexdigest(), 'license': 'CC0-1.0',
          'clip': 'Walk_Loop',
          'method': 'sagittal upper-arm angle and elbow flexion sampled from existing clip; no lower-body retargeting',
          'samples': samples}
(root / 'assets/source/active-march/walk-arm-reference.json').write_text(
    json.dumps(output, indent=2) + '\n', encoding='utf-8', newline='\n')
