"""New finite sole pull/push and V illustrations on the existing CC0 rig.

Own keyframe staging, Blender IK/bake/export. Reference: 7mlc e5RxAJM-oxc,
exercise 4; this is a slow isolated variant, not reproduction of a video asset.
"""
import bpy
import math
from pathlib import Path
from mathutils import Matrix, Vector

ROOT = Path(__file__).resolve().parents[1]
def smooth(t):
    t = max(0, min(1, t))
    return t*t*(3-2*t)

for kind in ['sole-pull-push', 'v-pull']:
 for side, sign, label in [('l',1,'left'),('r',-1,'right')]:
    bpy.ops.wm.open_mainfile(filepath=str(ROOT/f'assets/source/lateral-sole-roll/lateral-sole-roll-{label}-v2.blend'))
    scene=bpy.context.scene
    rig=next(o for o in scene.objects if o.type=='ARMATURE')
    ball=scene.objects['TutorialBall']
    poses=[]
    frames=300 if kind=='v-pull' else 240
    for frame in range(frames+1):
        f=frame/frames*195
        scene.frame_set(int(f),subframe=f-int(f))
        poses.append({b.name:b.matrix_basis.copy() for b in rig.pose.bones})
    scene.frame_set(0)
    feet={s:(rig.matrix_world@rig.pose.bones['foot_'+s].matrix).copy() for s in ['l','r']}
    rig.animation_data_clear();ball.animation_data_clear()
    targets={};poles=[]
    for s,k in [('l',1),('r',-1)]:
        target=bpy.data.objects.new('Authored foot '+s,None);scene.collection.objects.link(target);target.rotation_mode='QUATERNION'
        pole=bpy.data.objects.new('Knee guide '+s,None);scene.collection.objects.link(pole);pole.location=(k*.4,-1,.55)
        ik=rig.pose.bones['calf_'+s].constraints.new('IK')
        ik.target,ik.pole_target,ik.chain_count,ik.pole_angle,ik.use_stretch=target,pole,2,-math.pi/2,False
        rotation=rig.pose.bones['foot_'+s].constraints.new('COPY_ROTATION')
        rotation.target,rotation.target_space,rotation.owner_space=target,'WORLD','WORLD'
        targets[s]=target;poles.append(pole)
    start=Vector((sign*.16,-.19,.11));pulled=Vector((sign*.16,.04,.11));exit=Vector((-sign*.16,-.19,.11))
    sole_offset=Vector((0,feet[side].translation.y+.035,feet[side].translation.z+.217-.11))
    # Reach, sole drag, replace foot behind ball, inside push, collect, return by sole.
    if kind=='v-pull':
        contact=pulled+Vector((sign*.105,sole_offset.y,-.11+feet[side].translation.z+.012))
        inside=Vector((sign*.105,sole_offset.y,-.11+feet[side].translation.z+.012))
        points=[(0,start,feet[side].translation,0),(.6,start,feet[side].translation,0),
          (1.4,start,start+sole_offset,0),(2.8,pulled,pulled+sole_offset,0),
          (3.2,pulled,pulled+sole_offset+Vector((0,0,.15)),0),
          (3.6,pulled,pulled+inside+Vector((sign*.13,0,.15)),0),(4,pulled,contact,0),
          (5.2,exit,exit+inside,0),(5.5,exit,exit+inside+Vector((sign*.08,0,.2)),0),
          (5.9,exit,exit+sole_offset+Vector((0,0,.12)),0),(6.3,exit,exit+sole_offset,0),
          (8,start,start+sole_offset,0),(9.4,start,feet[side].translation,0),(10,start,feet[side].translation,0)]
    else:
        points=[(0,start,feet[side].translation,0),(.6,start,feet[side].translation,0),
          (1.4,start,start+sole_offset,0),(3,pulled,pulled+sole_offset,0),
          (4,pulled,pulled+sole_offset,0),(5.8,start,start+sole_offset,0),
          (7.4,start,feet[side].translation,0),(8,start,feet[side].translation,0)]
    scene.frame_start,scene.frame_end,scene.render.fps=0,frames,30
    angle=Vector((0,0,0));last_ball=start.copy()
    for frame in range(frames+1):
        scene.frame_set(frame);t=frame/30
        for b in rig.pose.bones:b.rotation_mode='QUATERNION';b.matrix_basis=poses[frame][b.name]
        a,b=points[-2],points[-1]
        for first,second in zip(points,points[1:]):
            if first[0]<=t<=second[0]:a,b=first,second;break
        u=smooth((t-a[0])/(b[0]-a[0]));bp=a[1].lerp(b[1],u);fp=a[2].lerp(b[2],u)
        # Clearance during initial reach and withdrawal; no weight on the ball.
        if a[0]==.6 or b[0] in (7.4,9.4):
            fp.z+=.30*math.sin(math.pi*u)**2
        for s in ['l','r']:
            targets[s].matrix_world=Matrix.Translation(fp if s==side else feet[s].translation)@feet[s].to_quaternion().to_matrix().to_4x4()
            for prop in ['location','rotation_quaternion']:targets[s].keyframe_insert(data_path=prop)
        bpy.context.view_layer.update()
        for bone in rig.pose.bones:
            for prop in ['location','rotation_quaternion','scale']:bone.keyframe_insert(data_path=prop)
        delta=bp-last_ball;angle.x-=delta.y/.11;angle.y+=delta.x/.11;last_ball=bp.copy()
        ball.location=bp;ball.rotation_euler=angle
        ball.keyframe_insert(data_path='location');ball.keyframe_insert(data_path='rotation_euler')
    clip=f'EX_{kind}__{label}__v1';scene.name=clip;rig.animation_data.action.name=clip;ball.animation_data.action.name=clip+'_ball'
    bpy.ops.object.select_all(action='DESELECT');rig.select_set(True);bpy.context.view_layer.objects.active=rig
    bpy.ops.object.mode_set(mode='POSE');bpy.ops.pose.select_all(action='SELECT')
    bpy.ops.nla.bake(frame_start=0,frame_end=frames,step=1,only_selected=True,visual_keying=True,clear_constraints=True,use_current_action=True,bake_types={'POSE'})
    bpy.ops.object.mode_set(mode='OBJECT')
    for obj in list(targets.values())+poles:bpy.data.objects.remove(obj,do_unlink=True)
    scene.frame_set(0);bpy.ops.object.select_all(action='DESELECT')
    for obj in scene.objects:
        if obj.type in {'ARMATURE','MESH'}:obj.select_set(True)
    bpy.context.view_layer.objects.active=rig
    name=f'{kind}-{label}-v1';directory=ROOT/f'assets/source/{kind}';directory.mkdir(parents=True,exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=str(ROOT/f'assets/runtime/{name}.glb'),export_format='GLB',use_selection=True,export_animations=True,export_animation_mode='SCENE',export_anim_scene_split_object=False,export_nla_strips_merged_animation_name=clip,export_force_sampling=True,export_frame_range=True,export_yup=True,export_cameras=False,export_lights=False)
    bpy.ops.wm.save_as_mainfile(filepath=str(directory/f'{name}.blend'),compress=True)
    print('NEW_CLIP',name,flush=True)
