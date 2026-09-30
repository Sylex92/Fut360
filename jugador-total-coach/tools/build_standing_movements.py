"""Pose only missing simple standing gestures; reuse Blender IK, rig and exporter."""
import bpy
import math
from pathlib import Path
from mathutils import Matrix, Vector

ROOT = Path(__file__).resolve().parents[1]
variants = [('active-march', 'alternate'), ('mini-squat', 'bilateral'),
            ('ankle-mobility', 'left'), ('ankle-mobility', 'right'),
            ('soft-step-turn', 'left'), ('soft-step-turn', 'right'),
            ('slow-breathing', 'comfortable-standing')]

def smooth(v):
    v = max(0, min(1, v))
    return v*v*(3-2*v)

def pulse(t):
    if t < 1: return 0
    if t < 3: return smooth((t-1)/2)
    if t < 4: return 1
    if t < 6: return 1-smooth((t-4)/2)
    return 0

for kind, variant in variants:
    bpy.ops.wm.open_mainfile(filepath=str(ROOT / 'assets/source/hip-hinge/hip-hinge-v1.blend'))
    scene = bpy.context.scene
    scene.frame_set(0)
    rig = next(o for o in scene.objects if o.type == 'ARMATURE')
    meshes = [o for o in scene.objects if o.type == 'MESH' and any(
        m.type == 'ARMATURE' and m.object == rig for m in o.modifiers)]
    base = {b.name: b.matrix.copy() for b in rig.pose.bones}
    basis = {b.name: b.matrix_basis.copy() for b in rig.pose.bones}
    feet = {s: (rig.matrix_world @ base['foot_'+s]).copy() for s in ('l','r')}
    rig.animation_data_clear()
    targets, poles = {}, []
    for side, sign in [('l',1),('r',-1)]:
        target = bpy.data.objects.new('Ankle '+side,None)
        scene.collection.objects.link(target)
        target.matrix_world = feet[side]
        target.rotation_mode = 'QUATERNION'
        pole = bpy.data.objects.new('Knee '+side,None)
        scene.collection.objects.link(pole)
        pole.location = (sign*.25,-1,.6)
        ik = rig.pose.bones['calf_'+side].constraints.new('IK')
        ik.target, ik.pole_target, ik.chain_count = target,pole,2
        ik.pole_angle,ik.use_stretch = -math.pi/2,False
        rotation = rig.pose.bones['foot_'+side].constraints.new('COPY_ROTATION')
        rotation.target,rotation.target_space,rotation.owner_space = target,'WORLD','WORLD'
        targets[side]=target
        poles.append(pole)
    duration = 10 if kind == 'soft-step-turn' else 8
    scene.render.fps,scene.frame_start,scene.frame_end=30,0,duration*30
    for frame in range(duration*30+1):
        scene.frame_set(frame)
        t=frame/30
        for b in rig.pose.bones:
            b.rotation_mode='QUATERNION'
            b.matrix_basis=basis[b.name]
        bpy.context.view_layer.update()
        p=pulse(t)
        pelvis_shift=Vector((0,0,0))
        pitch,yaw=0,0
        footposes={s:feet[s].copy() for s in feet}
        if kind=='mini-squat':
            pelvis_shift=Vector((0,.055*p,-.17*p))
            pitch=math.radians(10)*p
        elif kind=='active-march':
            for side,sign,start in [('r',-1,1),('l',1,4.5)]:
                local=(t-start)/2.5
                lift=math.sin(math.pi*local)**2 if 0<local<1 else 0
                footposes[side].translation += Vector((0,-.04*lift,.14*lift))
                pelvis_shift.x-=sign*.065*lift
            pelvis_shift.z=-.025
        elif kind=='ankle-mobility':
            lead='l' if variant=='left' else 'r'
            for side in feet:
                footposes[side].translation.y += -.20 if side==lead else .20
            pelvis_shift=Vector(((.03 if lead=='l' else -.03)*p,-.12*p,-.05-.07*p))
        elif kind=='soft-step-turn':
            # Four short repositioning steps out, four back; rotate a foot only while lifted.
            sign=1 if variant=='left' else -1
            local=max(0,min(8,t-1))
            step=min(7,int(local))
            blend=smooth(local-step) if local<8 else 1
            angles=[0,0]
            orders=[0,1,0,1,0,1,0,1]
            goals=[22.5,22.5,45,45,22.5,22.5,0,0]
            for done in range(step): angles[orders[done]]=goals[done]
            active=orders[step]
            angles[active]+=(goals[step]-angles[active])*blend
            yaw=math.radians(sum(angles)/2)*sign
            for i,side in enumerate(['l','r']):
                rotation=Matrix.Rotation(math.radians(angles[i])*sign,4,'Z')
                footposes[side]=rotation@feet[side]
                if i==active and 0<local<8:
                    footposes[side].translation.z+=.05*math.sin(math.pi*(local-step))**2
            pelvis_shift.z=-.03
        rot=Matrix.Rotation(yaw,4,'Z')@Matrix.Rotation(pitch,4,'X')
        rig.pose.bones['pelvis'].matrix=(Matrix.Translation(base['pelvis'].translation+pelvis_shift)
                @rot@base['pelvis'].to_quaternion().to_matrix().to_4x4())
        for i,side in enumerate(['l','r']):
            targets[side].matrix_world=footposes[side]
            targets[side].keyframe_insert(data_path='location')
            targets[side].keyframe_insert(data_path='rotation_quaternion')
            poles[i].location=Matrix.Rotation(yaw,4,'Z')@Vector(((1 if side=='l' else -1)*.25,-1,.6))
            poles[i].keyframe_insert(data_path='location')
        bpy.context.view_layer.update()
        if kind=='mini-squat':
            for side in ['l','r']:
                b=rig.pose.bones['upperarm_'+side]
                b.matrix=(Matrix.Translation(b.head)@Matrix.Rotation(math.radians(-35)*p,4,'X')
                     @base[b.name].to_quaternion().to_matrix().to_4x4())
                bpy.context.view_layer.update()
        for b in rig.pose.bones:
            for prop in ['location','rotation_quaternion','scale']:b.keyframe_insert(data_path=prop)
    clip=f'EX_{kind}__{variant}__v1'
    scene.name=clip
    rig.animation_data.action.name=clip
    bpy.ops.object.select_all(action='DESELECT')
    rig.select_set(True);bpy.context.view_layer.objects.active=rig
    bpy.ops.object.mode_set(mode='POSE');bpy.ops.pose.select_all(action='SELECT')
    bpy.ops.nla.bake(frame_start=0,frame_end=duration*30,step=1,only_selected=True,
        visual_keying=True,clear_constraints=True,use_current_action=True,bake_types={'POSE'})
    bpy.ops.object.mode_set(mode='OBJECT')
    for obj in list(targets.values())+poles:bpy.data.objects.remove(obj,do_unlink=True)
    scene.frame_set(0)
    bpy.ops.object.select_all(action='DESELECT')
    for obj in [rig]+meshes:obj.select_set(True)
    bpy.context.view_layer.objects.active=rig
    suffix='-'+variant if kind in ['ankle-mobility','soft-step-turn'] else ''
    filename=f'{kind}{suffix}-v1'
    bpy.ops.export_scene.gltf(filepath=str(ROOT/f'assets/runtime/{filename}.glb'),
        export_format='GLB',use_selection=True,export_animations=True,export_animation_mode='SCENE',
        export_anim_scene_split_object=False,export_nla_strips_merged_animation_name=clip,
        export_force_sampling=True,export_frame_range=True,export_yup=True,export_cameras=False,export_lights=False)
    out=ROOT/'assets/source'/kind;out.mkdir(parents=True,exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=str(out/f'{filename}.blend'),compress=True)
    print('EXPORTED',filename)
