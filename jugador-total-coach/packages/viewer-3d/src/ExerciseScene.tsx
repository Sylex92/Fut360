import { Component, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrthographicCamera } from 'three';
import { ClipDriver, disposeScene } from './clip-driver';

export type CameraPreset = 'side' | 'front' | 'threeQuarter' | 'detail';
export interface ExerciseSceneProps {
  readonly assetUrl: string;
  readonly clipName: string;
  readonly durationMs: number;
  readonly cameraPreset: CameraPreset;
  readonly getPoseMs: () => number;
  readonly onReady: () => void;
  readonly onFailure: (message: string) => void;
  readonly framing?: 'standing' | 'floor';
}

export function Camera({
  preset,
  framing,
}: {
  preset: CameraPreset;
  framing?: 'standing' | 'floor';
}) {
  const { camera, size } = useThree();
  useEffect(() => {
    const positions = {
      side: [4, 1.35, 0],
      front: [0, 1.35, 4],
      threeQuarter: [3, 2.1, 4],
      detail: [0, 1.5, 3],
    } as const;
    const [x, y, z] = positions[preset];
    camera.position.set(x, y, z);
    if (framing === 'floor') camera.position.y = preset === 'threeQuarter' ? 2.1 : 0.9;
    camera.lookAt(0, preset === 'detail' ? 0.22 : framing === 'floor' ? 0.25 : 0.85, 0);
    if (camera instanceof OrthographicCamera) {
      // Fit both a 2 m floor and a 1.82 m avatar even in a narrow portrait viewport.
      camera.zoom =
        preset === 'detail'
          ? Math.min(size.width / 1.3, size.height / 1.1)
          : framing === 'floor'
            ? Math.min(size.height / 2.1, size.width / 2.35)
            : Math.min(size.height / 2.6, size.width / 2.8);
      camera.updateProjectionMatrix();
    }
  }, [camera, preset, size, framing]);
  return null;
}

export function ContextGuard({ onFailure }: Pick<ExerciseSceneProps, 'onFailure'>) {
  const { gl } = useThree();
  useEffect(() => {
    const lost = (event: Event) => {
      event.preventDefault();
      onFailure(
        'Se interrumpió la vista 3D. La prueba está pausada; vuelve a cargar el avatar.',
      );
    };
    gl.domElement.addEventListener('webglcontextlost', lost);
    return () => gl.domElement.removeEventListener('webglcontextlost', lost);
  }, [gl, onFailure]);
  return null;
}

function Avatar({
  driver,
  getPoseMs,
  onReady,
}: {
  driver: ClipDriver;
} & Pick<ExerciseSceneProps, 'getPoseMs' | 'onReady'>) {
  const presented = useRef(false);
  useFrame(() => {
    driver.setTime(getPoseMs());
    if (!presented.current) {
      presented.current = true;
      onReady();
    }
  });
  return <primitive object={driver.scene} dispose={null} />;
}

export class SceneBoundary extends Component<
  { children: ReactNode; onFailure: (message: string) => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure('No se pudo dibujar el avatar. La prueba queda detenida.');
  }
  render() {
    return this.state.failed ? <p>Vista 3D interrumpida.</p> : this.props.children;
  }
}

export function ExerciseScene(props: ExerciseSceneProps) {
  const { assetUrl, clipName, durationMs, onFailure, onReady, getPoseMs, cameraPreset } =
    props;
  const [driver, setDriver] = useState<ClipDriver | null>(null);
  useEffect(() => {
    let cancelled = false;
    let owned: ClipDriver | null = null;
    const timeout = window.setTimeout(() => {
      cancelled = true;
      onFailure('La carga del avatar tardó demasiado. Puedes volver a intentarlo.');
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
          owned = new ClipDriver(gltf.scene, gltf.animations, clipName, durationMs);
          setDriver(owned);
        } catch (error) {
          disposeScene(gltf.scene);
          onFailure(error instanceof Error ? error.message : 'Archivo 3D incompatible.');
        }
      })
      .catch(() => {
        window.clearTimeout(timeout);
        if (!cancelled) onFailure('No se pudo cargar el avatar local. Vuelve a intentarlo.');
      });
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      owned?.dispose();
      if (owned) disposeScene(owned.scene);
    };
  }, [assetUrl, clipName, durationMs, onFailure]);
  return (
    <SceneBoundary onFailure={onFailure}>
      <Canvas
        orthographic
        dpr={[1, 1.5]}
        camera={{ near: 0.1, far: 30, position: [4, 1.35, 0], zoom: 150 }}
        gl={{ antialias: true, powerPreference: 'low-power' }}
        // Fiber mounts this HTML fallback even when WebGL works; keep it side-effect free.
        fallback={<p>Tu navegador no puede mostrar este contenido 3D.</p>}
      >
        <color attach="background" args={['#e6ece6']} />
        <ambientLight intensity={1.5} />
        <directionalLight position={[3, 5, 4]} intensity={2.5} />
        <Camera preset={cameraPreset} framing={props.framing ?? 'standing'} />
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
        {driver && <Avatar driver={driver} getPoseMs={getPoseMs} onReady={onReady} />}
      </Canvas>
    </SceneBoundary>
  );
}
