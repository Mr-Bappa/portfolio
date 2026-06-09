"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { JOURNEY } from "@/lib/constants";
import { cn } from "@/lib/utils";

const STOP_POSITIONS: [number, number, number][] = [
  [-5,  0, 0],
  [-1.5, 0, 0],
  [ 1.5, 0, 0],
  [ 5,   0, 0],
];

const PATH_POINTS = STOP_POSITIONS.map((p) => new THREE.Vector3(...p));

export function JourneySection() {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const sceneRef    = useRef<{
    charGroup: THREE.Group | null;
    targetIdx: number;
    currentPos: THREE.Vector3;
    animId: number;
    stops: THREE.Mesh[];
  }>({
    charGroup: null, targetIdx: 0,
    currentPos: new THREE.Vector3(-5, 0, 0),
    animId: 0, stops: [],
  });

  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [started,   setStarted]   = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50, canvas.clientWidth / canvas.clientHeight, 0.1, 100
    );
    camera.position.set(0, 2.5, 10);
    camera.lookAt(0, 0, 0);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const keyLight = new THREE.DirectionalLight(0x5dcaa5, 1.5);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0x534ab7, 0.8);
    fillLight.position.set(-5, 3, 5);
    scene.add(fillLight);

    // ---- PATH (tube along curve) ----
    const curve = new THREE.CatmullRomCurve3(PATH_POINTS);
    const tubeGeo = new THREE.TubeGeometry(curve, 80, 0.04, 8, false);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: "#0d2a3a", emissive: "#0d2a3a", emissiveIntensity: 0.5,
    });
    scene.add(new THREE.Mesh(tubeGeo, tubeMat));

    // Dashed overlay line
    const dashPoints = curve.getPoints(120);
    const dashGeo = new THREE.BufferGeometry().setFromPoints(dashPoints);
    const dashMat = new THREE.LineDashedMaterial({
      color: "#1d9e75", dashSize: 0.15, gapSize: 0.2, opacity: 0.4, transparent: true,
    });
    const dashLine = new THREE.Line(dashGeo, dashMat);
    dashLine.computeLineDistances();
    scene.add(dashLine);

    // ---- STOP MARKERS (hex platforms) ----
    const STOP_COLORS = ["#534ab7", "#1d9e75", "#ef9f27", "#1d9e75"];
    const stopMeshes: THREE.Mesh[] = [];

    STOP_POSITIONS.forEach((pos, i) => {
      const geo = new THREE.CylinderGeometry(0.35, 0.35, 0.08, 6);
      const mat = new THREE.MeshStandardMaterial({
        color: STOP_COLORS[i],
        emissive: STOP_COLORS[i],
        emissiveIntensity: i === 0 ? 0.8 : 0.2,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...pos);
      scene.add(mesh);
      stopMeshes.push(mesh);

      // Floating number above stop
      const ringGeo = new THREE.RingGeometry(0.4, 0.45, 6);
      const ringMat = new THREE.MeshBasicMaterial({
        color: STOP_COLORS[i], side: THREE.DoubleSide,
        transparent: true, opacity: 0.3,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(pos[0], 0.3, pos[2]);
      ring.rotation.x = -Math.PI / 2;
      scene.add(ring);
    });

    sceneRef.current.stops = stopMeshes;

    // ---- CHARACTER (low-poly humanoid) ----
    const charGroup = new THREE.Group();

    const bodyMat = new THREE.MeshStandardMaterial({
      color: "#1d9e75", emissive: "#1d9e75", emissiveIntensity: 0.3,
    });
    const headMat = new THREE.MeshStandardMaterial({
      color: "#5dcaa5", emissive: "#5dcaa5", emissiveIntensity: 0.4,
    });

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), headMat);
    head.position.y = 0.75;
    charGroup.add(head);

    // Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.35, 0.18), bodyMat);
    body.position.y = 0.43;
    charGroup.add(body);

    // Arms
    [-0.22, 0.22].forEach((x) => {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.28, 0.1), bodyMat);
      arm.position.set(x, 0.43, 0);
      charGroup.add(arm);
    });

    // Legs
    [-0.09, 0.09].forEach((x) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.28, 0.1), bodyMat);
      leg.position.set(x, 0.12, 0);
      charGroup.add(leg);
    });

    charGroup.position.copy(sceneRef.current.currentPos);
    charGroup.position.y = 0.1;
    scene.add(charGroup);
    sceneRef.current.charGroup = charGroup;

    // Ground grid
    const gridHelper = new THREE.GridHelper(20, 20, "#0d2a3a", "#060e1c");
    gridHelper.position.y = -0.05;
    scene.add(gridHelper);

    // ---- ANIMATION LOOP ----
    let frame = 0;
    const WALK_SPEED = 0.04;

    const animate = () => {
      sceneRef.current.animId = requestAnimationFrame(animate);
      frame++;

      const target = PATH_POINTS[sceneRef.current.targetIdx];
      const current = sceneRef.current.currentPos;
      const dist = current.distanceTo(target);

      if (dist > 0.05) {
        // Walk toward target
        const dir = target.clone().sub(current).normalize();
        current.addScaledVector(dir, WALK_SPEED);
        charGroup.position.copy(current);
        charGroup.position.y = 0.1 + Math.abs(Math.sin(frame * 0.3)) * 0.05;

        // Arm swing while walking
        charGroup.children.forEach((c, i) => {
          if (i > 1) c.rotation.x = Math.sin(frame * 0.3 + i) * 0.3;
        });

        // Face direction of travel
        charGroup.rotation.y = dir.x > 0 ? 0 : Math.PI;
      } else {
        // Idle breathing
        charGroup.position.y = 0.1 + Math.sin(frame * 0.04) * 0.015;
        charGroup.children.forEach((c) => (c.rotation.x = 0));
      }

      // Stop pulse
      stopMeshes.forEach((m, i) => {
        const mat = m.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity =
          i === sceneRef.current.targetIdx
            ? 0.6 + Math.sin(frame * 0.08) * 0.3
            : 0.15;
      });

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!canvas) return;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(sceneRef.current.animId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  const advance = () => {
    if (!started) setStarted(true);
    const next = Math.min(sceneRef.current.targetIdx + 1, JOURNEY.length - 1);
    sceneRef.current.targetIdx = next;
    setActiveIdx(next);
  };

  const goTo = (idx: number) => {
    if (!started) setStarted(true);
    sceneRef.current.targetIdx = idx;
    setActiveIdx(idx);
  };

  const activeStop = JOURNEY[activeIdx];

  const accentColor = {
    teal:   "border-teal",
    violet: "border-violet",
    amber:  "border-amber",
  }[activeStop.color];

  const gpaColor = {
    teal:   "bg-teal-dark/30 border-teal/30 text-teal-light",
    violet: "bg-violet-dark/30 border-violet/30 text-violet-light",
    amber:  "bg-amber-dark/30 border-amber-dark/30 text-amber",
  }[activeStop.color];

  return (
    <section id="journey" className="py-20 bg-void">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <p className="text-dim font-mono text-xs text-center tracking-widest uppercase mb-2">
          Interactive 3D
        </p>
        <h2 className="text-2xl font-medium text-center text-white/90 mb-8">
          My education & career journey
        </h2>

        {/* Canvas */}
        <div
          className="relative rounded-xl overflow-hidden border border-border cursor-pointer group"
          style={{ height: "320px" }}
          onClick={advance}
        >
          <canvas ref={canvasRef} className="canvas-full" />

          {/* Click overlay — shown before first click */}
          {!started && (
            <div className="canvas-full flex flex-col items-center justify-center pointer-events-none">
              <div className="glass px-8 py-5 text-center">
                <p className="text-teal-light font-mono text-sm mb-1">
                  Click to see my journey
                </p>
                <p className="text-dim text-xs">
                  character walks through each milestone
                </p>
              </div>
            </div>
          )}

          {/* Stop selector buttons */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {JOURNEY.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); goTo(i); }}
                className={cn(
                  "w-6 h-6 rounded-full font-mono text-xs border transition-all",
                  i === activeIdx
                    ? "bg-teal border-teal text-white"
                    : "bg-surface/80 border-border text-dim hover:border-teal"
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-dim text-xs font-mono mt-2">
          Click scene to advance · click numbers to jump · character idles between stops
        </p>

        {/* Popup cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {JOURNEY.map((stop, i) => (
            <div
              key={stop.id}
              onClick={() => goTo(i)}
              className={cn(
                "glass p-4 rounded-xl cursor-pointer border-l-2 transition-all duration-300",
                i === activeIdx
                  ? `${accentColor} opacity-100 scale-[1.02]`
                  : "border-border opacity-40 hover:opacity-70"
              )}
            >
              <p className="font-mono text-dim text-[10px] tracking-widest mb-2">
                STOP {stop.stop} · {stop.period}
              </p>
              <p className="text-white/90 text-sm font-medium mb-0.5">{stop.institution}</p>
              <p className="text-dim text-xs mb-3">{stop.degree}</p>

              <span className={cn(
                "inline-block border text-[10px] px-2 py-0.5 rounded-full font-mono mb-3",
                i === activeIdx ? gpaColor : "bg-surface border-border text-dim"
              )}>
                {stop.gpa}
              </span>

              <div className="flex flex-wrap gap-1">
                {stop.coursework.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="bg-void border border-border text-dim text-[9px] px-1.5 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
                {stop.coursework.length > 3 && (
                  <span className="text-dim text-[9px] self-center">
                    +{stop.coursework.length - 3}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
