import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { ClipDriver, disposeScene } from './clip-driver';
import { Camera, ContextGuard, SceneBoundary } from './ExerciseScene';
import type { CameraPreset } from './ExerciseScene';

export interface WorkoutSceneProps {
  readonly assets: readonly {
    id: string;
    assetUrl: string;
    clipName: string;
    durationMs: number;
  }[];
  readonly cameraPreset: CameraPreset;
  readonly framing: 'standing' | 'floor';
  readonly getFrame: () => { exerciseId: string; poseMs: number };
  readonly onReady: () => void;
  readonly onFailure: (message: string) => void;
}
function Actors({
  drivers,
  getFrame,
  onReady,
}: { drivers: ReadonlyMap<string, ClipDriver> } & Pick<
  WorkoutSceneProps,
  'getFrame' | 'onReady'
>) {
  const presented = useRef(false);
  useFrame(() => {
    const frame = getFrame();
    const active = drivers.get(frame.exerciseId);
    if (!active) throw new Error('Recurso de la sesión no disponible.');
    for (const [id, driver] of drivers) driver.scene.visible = id === frame.exerciseId;
    active.setTime(frame.poseMs);
    if (!presented.current) {
      presented.current = true;
      onReady();
    }
  });
  return (
    <>
      {[...drivers].map(([id, driver]) => (
        <primitive key={id} object={driver.scene} dispose={null} />
      ))}
    </>
  );
}
/** Owned preload of the finite catalog; switching clips requires no network or clock reset. */
export function WorkoutScene(props: WorkoutSceneProps) {
  const { assets, onFailure, onReady, getFrame } = props;
  const [drivers, setDrivers] = useState<ReadonlyMap<string, ClipDriver> | null>(null);
  useEffect(() => {
    let cancelled = false;
    const owned = new Map<string, ClipDriver>();
    const dispose = () => {
      for (const d of owned.values()) {
        d.dispose();
        disposeScene(d.scene);
      }
      owned.clear();
    };
    const fail = (message: string) => {
      if (cancelled) return;
      cancelled = true;
      window.clearTimeout(timeout);
      dispose();
      onFailure(message);
    };
    const timeout = window.setTimeout(
      () => fail('La carga tardó demasiado. Vuelve a cargar los movimientos.'),
      30000,
    );
    const loader = new GLTFLoader();
    Promise.all(
      assets.map(async (asset) => {
        const gltf = await loader.loadAsync(asset.assetUrl);
        if (cancelled) {
          disposeScene(gltf.scene);
          return;
        }
        try {
          const driver = new ClipDriver(
            gltf.scene,
            gltf.animations,
            asset.clipName,
            asset.durationMs,
          );
          driver.scene.visible = false;
          owned.set(asset.id, driver);
        } catch (error) {
          disposeScene(gltf.scene);
          throw error;
        }
      }),
    )
      .then(() => {
        if (!cancelled) {
          window.clearTimeout(timeout);
          setDrivers(owned);
        }
      })
      .catch(() =>
        fail(
          'Falta un movimiento de la sesión. El reloj está detenido; vuelve a cargar los movimientos.',
        ),
      );
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      dispose();
    };
  }, [assets, onFailure]);
  return (
    <SceneBoundary onFailure={onFailure}>
      <Canvas
        orthographic
        dpr={[1, 1.5]}
        camera={{ near: 0.1, far: 30, position: [4, 1.35, 0], zoom: 150 }}
        gl={{ antialias: true, powerPreference: 'low-power' }}
        fallback={<p>Vista 3D no disponible en este navegador.</p>}
      >
        <color attach="background" args={['#e6ece6']} />
        <ambientLight intensity={1.5} />
        <directionalLight position={[3, 5, 4]} intensity={2.5} />
        <Camera preset={props.cameraPreset} framing={props.framing} />
        <ContextGuard onFailure={onFailure} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]}>
          <planeGeometry args={[2, 2]} />
          <meshStandardMaterial color="#b9c8b5" roughness={1} />
        </mesh>
        <gridHelper args={[2, 2, '#536f58', '#a2b39e']} position={[0, -0.001, 0]} />
        {props.framing === 'floor' && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.0005, 0]}>
            <planeGeometry args={[0.85, 1.85]} />
            <meshStandardMaterial color="#779ea0" roughness={1} />
          </mesh>
        )}
        {drivers && <Actors drivers={drivers} getFrame={getFrame} onReady={onReady} />}
      </Canvas>
    </SceneBoundary>
  );
}
