"""Bounded authoring of one draft clip on Quaternius' existing rig.

Run with project-local Blender 4.5 LTS, --background --factory-startup
--disable-autoexec. Uses Blender IK, baking and glTF exporter, not a new rig/solver.
All output stays in this project. The original imported file is retained unchanged.
"""
import bpy
import json
import math
import shutil
from pathlib import Path
from mathutils import Vector, Matrix

ROOT = Path(__file__).resolve().parents[1]
DOWNLOAD = ROOT / 'assets/downloads/universal-base-characters/Universal Base Characters[Standard]'
SOURCE = ROOT / 'assets/source/hip-hinge'
ORIGINAL = SOURCE / 'original/Superhero_Male_FullBody.gltf'
if not ORIGINAL.is_file():
    ORIGINAL = DOWNLOAD / 'Base Characters/Godot - UE/Superhero_Male_FullBody.gltf'
RUNTIME = ROOT / 'assets/runtime'
EVIDENCE = ROOT / '.cache/phase04'
for directory in (SOURCE / 'original', RUNTIME, EVIDENCE):
    directory.mkdir(parents=True, exist_ok=True)

document = json.loads(ORIGINAL.read_text(encoding='utf8'))
references = [ORIGINAL.name] + [b['uri'] for b in document['buffers']] + [i['uri'] for i in document.get('images', [])]
missing = []
for reference in references:
    if Path(reference).name != reference:
        raise ValueError('Only the audited flat filenames are accepted')
    origin = ORIGINAL.parent / reference
    if origin.is_file():
        destination = SOURCE / 'original' / reference
        if origin.resolve() != destination.resolve():
            shutil.copyfile(origin, destination)
    else:
        missing.append(reference)
if not (SOURCE / 'QUATERNIUS_LICENSE.txt').is_file():
    shutil.copyfile(DOWNLOAD / 'License_Standard.txt', SOURCE / 'QUATERNIUS_LICENSE.txt')

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(SOURCE / 'original' / ORIGINAL.name))
rig = next(o for o in bpy.context.scene.objects if o.type == 'ARMATURE')
meshes = [o for o in bpy.context.scene.objects if o.type == 'MESH' and any(m.type == 'ARMATURE' and m.object == rig for m in o.modifiers)]
rig.name = 'Fut360_Quaternius_65'

def material(name, color):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value = (*color, 1)
    bsdf.inputs['Roughness'].default_value = .85
    return mat

skin = material('Skin', (.43, .23, .12))
shirt = material('Neutral teal shirt', (.025, .24, .26))
shorts = material('Neutral navy shorts', (.025, .045, .075))
eyes = material('Eyes', (.11, .08, .06))
# Material-only adaptation on the supplied mesh: no added clothing topology or rig.
for obj in meshes:
    obj.data.materials.clear()
    for mat in (skin, shirt, shorts, eyes):
        obj.data.materials.append(mat)
    is_body = len(obj.data.vertices) > 2000
    for face in obj.data.polygons:
        center = sum((obj.data.vertices[i].co for i in face.vertices), Vector()) / len(face.vertices)
        x, y, z = obj.matrix_world @ center
        face.material_index = 0 if is_body else 3
        if is_body and .68 < z < 1.05:
            face.material_index = 2
        if is_body and 1.05 <= z < 1.57 and abs(x) < .38:
            face.material_index = 1

# Bake smooth garment boundaries through Blender's existing UV bake operation.
# Assigning whole triangles above is only the initial fallback while authoring.
body = next(o for o in meshes if len(o.data.vertices) > 2000)
garment = bpy.data.materials.new('Neutral sportswear')
garment.use_nodes = True
nodes, links = garment.node_tree.nodes, garment.node_tree.links
nodes.clear()
coord = nodes.new('ShaderNodeTexCoord')
xyz = nodes.new('ShaderNodeSeparateXYZ')
links.new(coord.outputs['Object'], xyz.inputs[0])
def compare(output, operation, value):
    node = nodes.new('ShaderNodeMath')
    node.operation = operation
    links.new(output, node.inputs[0])
    node.inputs[1].default_value = value
    return node.outputs[0]
def multiply(a, b):
    node = nodes.new('ShaderNodeMath')
    node.operation = 'MULTIPLY'
    links.new(a, node.inputs[0])
    links.new(b, node.inputs[1])
    return node.outputs[0]
shirt_mask = multiply(compare(xyz.outputs['Z'], 'GREATER_THAN', 1.05), compare(xyz.outputs['Z'], 'LESS_THAN', 1.57))
abs_x = compare(xyz.outputs['X'], 'ABSOLUTE', 0)
shirt_mask = multiply(shirt_mask, compare(abs_x, 'LESS_THAN', .38))
shorts_mask = multiply(compare(xyz.outputs['Z'], 'GREATER_THAN', .68), compare(xyz.outputs['Z'], 'LESS_THAN', 1.05))
colors = nodes.new('ShaderNodeMixRGB')
colors.inputs[1].default_value = skin.diffuse_color
colors.inputs[2].default_value = shorts.diffuse_color
links.new(shorts_mask, colors.inputs[0])
top_colors = nodes.new('ShaderNodeMixRGB')
links.new(colors.outputs[0], top_colors.inputs[1])
top_colors.inputs[2].default_value = shirt.diffuse_color
links.new(shirt_mask, top_colors.inputs[0])
emission = nodes.new('ShaderNodeEmission')
links.new(top_colors.outputs[0], emission.inputs['Color'])
output = nodes.new('ShaderNodeOutputMaterial')
links.new(emission.outputs[0], output.inputs[0])
baked = bpy.data.images.new('NeutralSportswear', width=512, height=512)
texture = nodes.new('ShaderNodeTexImage')
texture.image = baked
nodes.active = texture
body.data.materials.clear()
body.data.materials.append(garment)
for face in body.data.polygons:
    face.material_index = 0
bpy.ops.object.select_all(action='DESELECT')
body.select_set(True)
bpy.context.view_layer.objects.active = body
bpy.context.scene.render.engine = 'CYCLES'
bpy.context.scene.cycles.device = 'CPU'
bpy.context.scene.cycles.samples = 1
bpy.context.scene.render.bake.margin = 8
bpy.ops.object.bake(type='EMIT')
baked.filepath_raw = str(SOURCE / 'neutral-sportswear.png')
baked.file_format = 'PNG'
baked.save()
baked.pack()
nodes.clear()
texture = nodes.new('ShaderNodeTexImage')
texture.image = baked
bsdf = nodes.new('ShaderNodeBsdfPrincipled')
bsdf.inputs['Roughness'].default_value = .85
links.new(texture.outputs['Color'], bsdf.inputs['Base Color'])
output = nodes.new('ShaderNodeOutputMaterial')
links.new(bsdf.outputs[0], output.inputs[0])

# Lift by the actual sole minimum. Imported bone widgets are not avatar geometry.
points = [o.matrix_world @ v.co for o in meshes for v in o.data.vertices]
ground_lift = -min(p.z for p in points)
rig.location.z += ground_lift
bpy.context.view_layer.update()

targets = []
for side in ('l', 'r'):
    foot = rig.pose.bones['foot_' + side]
    target = bpy.data.objects.new('IK ankle ' + side, None)
    bpy.context.collection.objects.link(target)
    target.matrix_world = rig.matrix_world @ foot.matrix
    pole = bpy.data.objects.new('IK knee pole ' + side, None)
    bpy.context.collection.objects.link(pole)
    pole.location = (foot.head.x, -1.0, .55)
    ik = rig.pose.bones['calf_' + side].constraints.new('IK')
    ik.target = target
    ik.pole_target = pole
    ik.chain_count = 2
    ik.pole_angle = -math.pi / 2
    ik.use_stretch = False
    rotation = foot.constraints.new('COPY_ROTATION')
    rotation.target = target
    rotation.target_space = 'WORLD'
    rotation.owner_space = 'WORLD'
    targets.extend([target, pole])

scene = bpy.context.scene
scene.render.fps = 30
scene.frame_start = 0
scene.frame_end = 240
rest = {b.name: b.matrix_local.copy() for b in rig.data.bones}

def place_pose(amount):
    pelvis = rig.pose.bones['pelvis']
    rotation = Matrix.Rotation(math.radians(40) * amount, 4, 'X')
    position = rest['pelvis'].translation + Vector((0, .25 * amount, -.075 * amount))
    pelvis.matrix = Matrix.Translation(position) @ rotation @ rest['pelvis'].to_quaternion().to_matrix().to_4x4()
    bpy.context.view_layer.update()
    for side, sign in (('l', 1), ('r', -1)):
        bone = rig.pose.bones['upperarm_' + side]
        # Arms stay beside the body and drop slightly forward with the torso.
        arm_rotation = Matrix.Rotation(math.radians(10) * amount, 4, 'X') @ Matrix.Rotation(math.radians(78) * sign, 4, 'Y')
        bone.matrix = Matrix.Translation(bone.head) @ arm_rotation @ rest[bone.name].to_quaternion().to_matrix().to_4x4()
        bpy.context.view_layer.update()
    for bone in rig.pose.bones:
        bone.keyframe_insert(data_path='location')
        bone.keyframe_insert(data_path='rotation_quaternion')
        bone.keyframe_insert(data_path='scale')

for frame, amount in ((0, 0), (30, 0), (90, 1), (120, 1), (180, 0), (240, 0)):
    scene.frame_set(frame)
    place_pose(amount)

rig.animation_data.action.name = 'EX_hip-hinge__neutral__v1'
scene.frame_set(0)
bpy.ops.object.select_all(action='DESELECT')
rig.select_set(True)
bpy.context.view_layer.objects.active = rig
bpy.ops.object.mode_set(mode='POSE')
bpy.ops.pose.select_all(action='SELECT')
# Blender evaluates its IK and bakes the final bone transforms into the existing rig.
bpy.ops.nla.bake(frame_start=0, frame_end=240, step=1, only_selected=True,
                 visual_keying=True, clear_constraints=True, use_current_action=True,
                 bake_types={'POSE'})
bpy.ops.object.mode_set(mode='OBJECT')
for obj in targets:
    bpy.data.objects.remove(obj, do_unlink=True)
scene.frame_set(0)
rig.animation_data.action.name = 'EX_hip-hinge__neutral__v1'

# Keep skinned meshes as identity-transform scene roots per glTF validation guidance.
for obj in meshes:
    world = obj.matrix_world.copy()
    obj.parent = None
    obj.matrix_world = world
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    keep_uv_layers = 1 if obj == body else 0
    while len(obj.data.uv_layers) > keep_uv_layers:
        obj.data.uv_layers.remove(obj.data.uv_layers[-1])

def evaluated_bounds():
    graph = bpy.context.evaluated_depsgraph_get()
    points = []
    for obj in meshes:
        evaluated = obj.evaluated_get(graph)
        mesh = evaluated.to_mesh()
        points.extend(evaluated.matrix_world @ v.co for v in mesh.vertices)
        evaluated.to_mesh_clear()
    return [[min(p[i] for p in points) for i in range(3)], [max(p[i] for p in points) for i in range(3)]]

samples = []
for frame in range(241):
    scene.frame_set(frame)
    samples.append({'frame': frame, 'boundsBlenderXYZ': evaluated_bounds(),
                    'feet': {s: list(rig.matrix_world @ rig.pose.bones['foot_' + s].head) for s in ('l', 'r')},
                    'knees': {s: list(rig.matrix_world @ rig.pose.bones['calf_' + s].head) for s in ('l', 'r')}})
report = {'blenderVersion': bpy.app.version_string, 'sourceMissingImages': missing,
          'groundLiftMeters': ground_lift, 'samples': samples,
          'bones': [b.name for b in rig.data.bones], 'meshVertices': sum(len(o.data.vertices) for o in meshes)}
(EVIDENCE / 'clip-authoring-report.json').write_text(json.dumps(report, indent=2), encoding='utf8')

scene.frame_set(0)
bpy.ops.object.select_all(action='DESELECT')
for obj in [rig] + meshes:
    obj.select_set(True)
bpy.context.view_layer.objects.active = rig
bpy.ops.export_scene.gltf(filepath=str(RUNTIME / 'hip-hinge-v1.glb'), export_format='GLB',
                          use_selection=True, export_animations=True, export_animation_mode='ACTIONS',
                          export_force_sampling=True, export_frame_range=True, export_yup=True,
                          export_cameras=False, export_lights=False)
bpy.data.orphans_purge(do_recursive=True)
bpy.ops.wm.save_as_mainfile(filepath=str(SOURCE / 'hip-hinge-v1.blend'), compress=True)

# CPU stills for technical review. These are not browser screenshots or sports approval.
scene.render.engine = 'CYCLES'
scene.cycles.device = 'CPU'
scene.cycles.samples = 16
scene.render.resolution_x = 640
scene.render.resolution_y = 640
scene.render.resolution_percentage = 100
scene.world = bpy.data.worlds.new('Review world')
scene.world.use_nodes = True
scene.world.node_tree.nodes['Background'].inputs[0].default_value = (.72, .77, .74, 1)
scene.world.node_tree.nodes['Background'].inputs[1].default_value = .7
bpy.ops.object.light_add(type='AREA', location=(2, -3, 4))
bpy.context.object.data.energy = 450
bpy.context.object.data.size = 4
bpy.ops.mesh.primitive_plane_add(size=2, location=(0, 0, -.002))
bpy.context.object.data.materials.append(material('2 by 2 floor', (.34, .42, .36)))
bpy.ops.object.camera_add()
camera = bpy.context.object
camera.data.type = 'ORTHO'
camera.data.ortho_scale = 2.55
scene.camera = camera
for view, position in {'side': (4, 0, 1.35), 'front': (0, -4, 1.35), 'threeQuarter': (3, -4, 2.1)}.items():
    camera.location = position
    camera.rotation_euler = (Vector((0, 0, .85)) - camera.location).to_track_quat('-Z', 'Y').to_euler()
    for frame in (0, 60, 105, 150, 240):
        scene.frame_set(frame)
        scene.render.filepath = str(EVIDENCE / f'hinge-{view}-{frame:03}.png')
        bpy.ops.render.render(write_still=True)
print('CLIP_EXPORTED', RUNTIME / 'hip-hinge-v1.glb')
