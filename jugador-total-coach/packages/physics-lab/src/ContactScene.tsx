import { Component, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Physics,
  RigidBody,
  CuboidCollider,
  BallCollider,
  useBeforePhysicsStep,
  useAfterPhysicsStep,
} from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';
import { OrthographicCamera } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { ClipDriver, disposeScene } from '@fut360/viewer-3d/clip-driver';
import {
  authority,
  boneFootPose,
  contactClipName,
  contactConfig as cfg,
  debugFootPose,
} from './index';
import type { ContactMode, ContactView, FootSource, LabSample } from './index';

export interface ContactSceneProps {
  assetUrl: string;
  mode: ContactMode;
  source: FootSource;
  speed: number;
  running: boolean;
  debug: boolean;
  view: ContactView;
  seekSeconds: number;
  onReady: () => void;
  onFailure: (message: string) => void;
  onSample: (sample: LabSample) => void;
}
class Boundary extends Component<
  { children: ReactNode; onFailure: (s: string) => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure('No se pudo abrir la prueba 3D. Recarga la página para intentarlo.');
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
function Stage({ view, onFailure }: Pick<ContactSceneProps, 'view' | 'onFailure'>) {
  const { camera, size, gl } = useThree();
  useEffect(() => {
    const positions = {
      front: [0, 1.5, 4],
      threeQuarter: [2.5, 2.1, 4],
      detail: [0, 1.5, 3],
    } as const;
    const [x, y, z] = positions[view];
    camera.position.set(x, y, z);
    camera.lookAt(0, view === 'detail' ? 0.22 : 0.85, 0);
    if (camera instanceof OrthographicCamera) {
      camera.zoom =
        view === 'detail'
          ? Math.min(size.width / 1.3, size.height / 1.1)
          : Math.min(size.width / 2.8, size.height / 2.6);
      camera.updateProjectionMatrix();
    }
  }, [view, camera, size]);
  useEffect(() => {
    const lost = (e: Event) => {
      e.preventDefault();
      onFailure('Se interrumpió la vista 3D. Vuelve a cargar la prueba.');
    };
    gl.domElement.addEventListener('webglcontextlost', lost);
    return () => gl.domElement.removeEventListener('webglcontextlost', lost);
  }, [gl, onFailure]);
  return (
    <>
      <color attach="background" args={['#e6ece6']} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[3, 5, 4]} intensity={2.5} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]}>
        <planeGeometry args={[2, 2]} />
        <meshStandardMaterial color="#b9c8b5" />
      </mesh>
      <gridHelper args={[2, 2, '#536f58', '#a2b39e']} position={[0, -0.001, 0]} />
    </>
  );
}
function Tutorial({
  driver,
  running,
  speed,
  seekSeconds,
  onReady,
  onSample,
  onFailure,
}: ContactSceneProps & { driver: ClipDriver }) {
  const seconds = useRef(0);
  const ready = useRef(false);
  const lastReport = useRef(-1);
  useEffect(() => {
    seconds.current = seekSeconds;
    driver.setTime(seekSeconds * 1000);
  }, [driver, seekSeconds]);
  useFrame((_, delta) => {
    if (!ready.current) {
      ready.current = true;
      onReady();
    }
    if (running && !document.hidden) {
      if (delta > 0.5) {
        onFailure('La imagen se interrumpió. La prueba está detenida; vuelve a cargarla.');
        return;
      }
      seconds.current = Math.min(cfg.duration, seconds.current + delta * speed);
      driver.setTime(seconds.current * 1000);
    }
    if (
      Math.abs(seconds.current - lastReport.current) >= 0.09 ||
      seconds.current === cfg.duration
    ) {
      lastReport.current = seconds.current;
      const ball = driver.scene.getObjectByName('TutorialBall');
      onSample({
        seconds: seconds.current,
        contacts: 0,
        ball: ball?.position.toArray() ?? [],
        ended: seconds.current >= cfg.duration,
        outside: false,
      });
    }
  });
  return <primitive object={driver.scene} dispose={null} />;
}
function Bodies({
  driver,
  source,
  speed,
  onReady,
  onSample,
}: ContactSceneProps & { driver: ClipDriver }) {
  const ball = useRef<RapierRigidBody>(null);
  const right = useRef<RapierRigidBody>(null);
  const left = useRef<RapierRigidBody>(null);
  const steps = useRef(0);
  const contacts = useRef(0);
  const finished = useRef(false);
  const ready = useRef(false);
  const initial = useMemo(() => {
    driver.setTime(0);
    driver.scene.getObjectByName('TutorialBall')!.visible = false;
    return {
      r: source === 'debug' ? debugFootPose(0) : boneFootPose(driver.scene, 'r'),
      l: boneFootPose(driver.scene, 'l'),
    };
  }, [driver, source]);
  useFrame(() => {
    if (!ready.current && ball.current && right.current) {
      ready.current = true;
      onReady();
    }
  });
  useBeforePhysicsStep(() => {
    if (finished.current) return;
    const t = Math.min(cfg.duration, ++steps.current * cfg.step * speed);
    driver.setTime(t * 1000);
    for (const [ref, side] of [
      [right, 'r'],
      [left, 'l'],
    ] as const) {
      if (!ref.current) continue;
      const pose = source === 'debug' ? debugFootPose(t) : boneFootPose(driver.scene, side);
      ref.current.setNextKinematicTranslation(pose.position);
      ref.current.setNextKinematicRotation(pose.rotation);
    }
  });
  useAfterPhysicsStep(() => {
    if (finished.current) return;
    const p = ball.current?.translation();
    if (!p) return;
    const seconds = Math.min(cfg.duration, steps.current * cfg.step * speed);
    const outside = Math.abs(p.x) + cfg.radius > 1 || Math.abs(p.z) + cfg.radius > 1;
    const ended = seconds >= cfg.duration || outside;
    if (ended) {
      // The wrapper may have another fixed step queued in this render frame.
      // Sleep at the exact terminal step so React's later pause cannot add drift.
      finished.current = true;
      ball.current?.sleep();
    }
    if (steps.current % 6 === 0 || outside || seconds >= cfg.duration)
      onSample({
        seconds,
        contacts: contacts.current,
        ball: [p.x, p.y, p.z],
        outside,
        ended,
      });
  });
  return (
    <>
      {source === 'avatar' && <primitive object={driver.scene} dispose={null} />}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider
          args={[1, 0.05, 1]}
          position={[0, -0.05, 0]}
          friction={cfg.groundFriction}
          restitution={cfg.restitution}
        />
      </RigidBody>
      <RigidBody
        ref={ball}
        name="PhysicsBall"
        colliders={false}
        position={[...cfg.ballStart]}
        ccd={cfg.ccd}
        linearDamping={cfg.linearDamping}
        angularDamping={cfg.angularDamping}
      >
        <BallCollider
          args={[cfg.radius]}
          mass={cfg.mass}
          friction={cfg.ballFriction}
          restitution={cfg.restitution}
          onCollisionEnter={({ other }) => {
            if (other.rigidBodyObject?.name.startsWith('Foot')) contacts.current++;
          }}
        />
        <mesh>
          <sphereGeometry args={[cfg.radius, 24, 16]} />
          <meshStandardMaterial color="#e8bc59" roughness={0.8} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[cfg.radius * 0.995, 0.003, 6, 40]} />
          <meshStandardMaterial color="#213e34" />
        </mesh>
      </RigidBody>
      {(['r', 'l'] as const)
        .filter((s) => source === 'avatar' || s === 'r')
        .map((side) => (
          <RigidBody
            key={side}
            ref={side === 'r' ? right : left}
            name={'Foot_' + side}
            type="kinematicPosition"
            colliders={false}
            position={initial[side].position.toArray()}
            quaternion={initial[side].rotation.toArray()}
          >
            <CuboidCollider
              args={[...cfg.footHalfExtents]}
              friction={cfg.footFriction}
              restitution={cfg.restitution}
            />
            {source === 'debug' && (
              <mesh>
                <boxGeometry
                  args={cfg.footHalfExtents.map((x) => x * 2) as [number, number, number]}
                />
                <meshStandardMaterial color="#41635a" />
              </mesh>
            )}
          </RigidBody>
        ))}
    </>
  );
}
export function ContactScene(props: ContactSceneProps) {
  const [driver, setDriver] = useState<ClipDriver | null>(null);
  const { assetUrl, onFailure } = props;
  useEffect(() => {
    let cancelled = false;
    let owned: ClipDriver | null = null;
    const timeout = window.setTimeout(() => {
      cancelled = true;
      onFailure('La carga tardó demasiado. Vuelve a cargar la prueba.');
    }, 25000);
    new GLTFLoader()
      .loadAsync(assetUrl)
      .then((gltf) => {
        if (cancelled) {
          disposeScene(gltf.scene);
          return;
        }
        window.clearTimeout(timeout);
        try {
          if (!gltf.scene.getObjectByName('TutorialBall'))
            throw Error('Falta el balón de la demostración.');
          owned = new ClipDriver(
            gltf.scene,
            gltf.animations,
            contactClipName,
            cfg.duration * 1000,
          );
          setDriver(owned);
        } catch (e) {
          disposeScene(gltf.scene);
          onFailure(e instanceof Error ? e.message : 'Recurso incompatible.');
        }
      })
      .catch(() => {
        window.clearTimeout(timeout);
        if (!cancelled)
          onFailure('No se pudo cargar el recurso local. Vuelve a cargar la prueba.');
      });
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      owned?.dispose();
      if (owned) disposeScene(owned.scene);
    };
  }, [assetUrl, onFailure]);
  return (
    <Boundary onFailure={onFailure}>
      <Canvas
        orthographic
        dpr={[1, 1.5]}
        camera={{ near: 0.1, far: 30, position: [2.5, 2.1, 4], zoom: 150 }}
        gl={{ antialias: true, powerPreference: 'low-power' }}
        fallback={<p>La prueba requiere WebGL 2.</p>}
      >
        <Stage view={props.view} onFailure={onFailure} />
        {driver &&
          (authority(props.mode).ball === 'authored' ? (
            <Tutorial {...props} driver={driver} />
          ) : (
            <Suspense fallback={null}>
              <Physics
                paused={!props.running}
                timeStep={cfg.step}
                gravity={[...cfg.gravity]}
                debug={props.debug}
                maxCcdSubsteps={cfg.maxCcdSubsteps}
                interpolate
              >
                <Bodies {...props} driver={driver} />
              </Physics>
            </Suspense>
          ))}
      </Canvas>
    </Boundary>
  );
}
