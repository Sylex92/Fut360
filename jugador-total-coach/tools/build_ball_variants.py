"""Finite illustrations: sole roll and inside/outside on each anatomical side.

Only authored keyframes; no physical prediction, rig, or contact solver is implemented.
"""
import bpy
import math
from pathlib import Path
from mathutils import Matrix, Vector

ROOT=Path(__file__).resolve().parents[1]
def smooth(t):
    t=max(0,min(1,t));return t*t*(3-2*t)
def mix(a,b,t):return a+(b-a)*smooth(t)

for kind in ['lateral-sole-roll','inside-outside']:
 for side,sign,variant in [('r',-1,'right'),('l',1,'left')]:
    bpy.ops.wm.open_mainfile(filepath=str(ROOT/'assets/source/inside-inside/inside-inside-v1.blend'))
    scene=bpy.context.scene;scene.frame_set(0)
    rig=next(o for o in scene.objects if o.type=='ARMATURE')
    ball=bpy.data.objects['TutorialBall']
    meshes=[o for o in scene.objects if o.type=='MESH' and any(m.type=='ARMATURE' and m.object==rig for m in o.modifiers)]
    base={b.name:b.matrix.copy() for b in rig.pose.bones}
    basis={b.name:b.matrix_basis.copy() for b in rig.pose.bones}
    feet={s:(rig.matrix_world@base['foot_'+s]).copy() for s in ['l','r']}
    rig.animation_data_clear();ball.animation_data_clear()
    targets={};poles=[]
    for s,k in [('l',1),('r',-1)]:
        target=bpy.data.objects.new('Ankle '+s,None);scene.collection.objects.link(target)
        target.matrix_world=feet[s];target.rotation_mode='QUATERNION'
        pole=bpy.data.objects.new('Knee '+s,None);scene.collection.objects.link(pole);pole.location=(k*.3,-1,.6)
        ik=rig.pose.bones['calf_'+s].constraints.new('IK')
        ik.target,ik.pole_target,ik.chain_count,ik.pole_angle,ik.use_stretch=target,pole,2,-math.pi/2,False
        rotation=rig.pose.bones['foot_'+s].constraints.new('COPY_ROTATION')
        rotation.target,rotation.target_space,rotation.owner_space=target,'WORLD','WORLD'
        targets[s]=target;poles.append(pole)
    scene.render.fps,scene.frame_start,scene.frame_end=30,0,300
    for frame in range(301):
        scene.frame_set(frame);t=frame/30
        for b in rig.pose.bones:b.rotation_mode='QUATERNION';b.matrix_basis=basis[b.name]
        bpy.context.view_layer.update()
        rig.pose.bones['pelvis'].matrix=Matrix.Translation((-sign*.065,0,0))@base['pelvis']
        foot=feet[side].copy();x=sign*.34;y=feet[side].translation.y;z=feet[side].translation.z;bx=sign*.15
        yaw=0
        if kind=='lateral-sole-roll':
            if t<1:pass
            elif t<2:
                u=t-1;x=mix(sign*.34,sign*.15,u);z+=.217*smooth(u)+.10*math.sin(math.pi*u)**2
            elif t<7:
                u=smooth((t-2)/2) if t<4 else 1 if t<5 else 1-smooth((t-5)/2)
                bx=sign*(.15-.2*u);x=bx;z+=.217
            elif t<9:
                u=(t-7)/2;x=mix(sign*.15,sign*.34,u);z+=.217*(1-smooth(u))+.1*math.sin(math.pi*u)**2
            # Sole level rather than the outward-turned foot of inside-inside.
            yaw=-sign*math.radians(15)*smooth(min(t,10-t))
        else:
            if t<1:pass
            elif t<3:
                u=smooth((t-1)/2);x=sign*(.34-.213*u);bx=sign*min(.15,.34-.213*u-.105);z+=.012*smooth((t-1)/.4)
            elif t<5:
                # Withdraw before crossing behind the ball, then approach its other side.
                # Staged keyframes keep the shoe from sweeping through the sphere.
                bx=sign*.022;z+=.012
                if t<3.5:
                    u=(t-3)/.5;x=sign*.127;y+=.30*smooth(u);z+=.05*smooth(u)
                elif t<4.5:
                    u=t-3.5;x=mix(sign*.127,-sign*.116,u);y+=.30;z+=.05
                    yaw=-sign*math.radians(30)*smooth(u)
                else:
                    u=(t-4.5)/.5;x=-sign*.116;y+=.30*(1-smooth(u));z+=.05*(1-smooth(u))
                    yaw=-sign*math.radians(30)
            elif t<7:
                u=smooth((t-5)/2);x=(-sign*.116)*(1-u)+(sign*.022)*u
                bx=sign*(.022+.128*u);z+=.012;yaw=-sign*math.radians(30)
            elif t<9:
                if t<7.5:
                    u=(t-7)/.5;x=sign*.022;y+=.30*smooth(u);z+=.012+.05*smooth(u)
                    yaw=-sign*math.radians(30)
                elif t<8.5:
                    u=t-7.5;x=mix(sign*.022,sign*.34,u);y+=.30;z+=.062
                    yaw=-sign*math.radians(30)*(1-smooth(u))
                else:
                    u=(t-8.5)/.5;x=sign*.34;y+=.30*(1-smooth(u));z+=.062*(1-smooth(u))
        foot=Matrix.Translation((x,y,z))@Matrix.Rotation(yaw,4,'Z')@feet[side].to_quaternion().to_matrix().to_4x4()
        for s in targets:
            targets[s].matrix_world=foot if s==side else feet[s]
            targets[s].keyframe_insert(data_path='location');targets[s].keyframe_insert(data_path='rotation_quaternion')
        bpy.context.view_layer.update()
        for b in rig.pose.bones:
            for prop in ['location','rotation_quaternion','scale']:b.keyframe_insert(data_path=prop)
        ball.location=(bx,-.035,.11);ball.rotation_euler=(0,(bx-sign*.15)/.11,0)
        ball.keyframe_insert(data_path='location');ball.keyframe_insert(data_path='rotation_euler')
    clip=f'EX_{kind}__{variant}__v1';scene.name=clip;rig.animation_data.action.name=clip;ball.animation_data.action.name=clip+'_ball'
    bpy.ops.object.select_all(action='DESELECT');rig.select_set(True);bpy.context.view_layer.objects.active=rig
    bpy.ops.object.mode_set(mode='POSE');bpy.ops.pose.select_all(action='SELECT')
    bpy.ops.nla.bake(frame_start=0,frame_end=300,step=1,only_selected=True,visual_keying=True,
        clear_constraints=True,use_current_action=True,bake_types={'POSE'})
    bpy.ops.object.mode_set(mode='OBJECT')
    for obj in list(targets.values())+poles:bpy.data.objects.remove(obj,do_unlink=True)
    scene.frame_set(0);bpy.ops.object.select_all(action='DESELECT')
    for obj in [rig,ball]+meshes:obj.select_set(True)
    bpy.context.view_layer.objects.active=rig
    filename=f'{kind}-{variant}-v1'
    bpy.ops.export_scene.gltf(filepath=str(ROOT/f'assets/runtime/{filename}.glb'),export_format='GLB',use_selection=True,
        export_animations=True,export_animation_mode='SCENE',export_anim_scene_split_object=False,
        export_nla_strips_merged_animation_name=clip,export_force_sampling=True,export_frame_range=True,
        export_yup=True,export_cameras=False,export_lights=False)
    out=ROOT/'assets/source'/kind;out.mkdir(parents=True,exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=str(out/f'{filename}.blend'),compress=True)
    print('EXPORTED',filename)
