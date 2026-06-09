"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import Link from "next/link";
import { PROFILE } from "@/lib/constants";

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    // --- Scene & Camera ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);

    // --- Colors ---
    const TEAL   = new THREE.Color("#1d9e75");
    const VIOLET = new THREE.Color("#534ab7");
    const TEAL_L = new THREE.Color("#5dcaa5");

    // ============================================================
    // 1. PARTICLE FIELD (data stream effect)
    // ============================================================
    const PARTICLE_COUNT = 900;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const pColors   = new Float32Array(PARTICLE_COUNT * 3);
    const speeds    = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      speeds[i] = 0.002 + Math.random() * 0.004;

      const c = Math.random() > 0.5 ? TEAL_L : VIOLET;
      pColors[i * 3]     = c.r;
      pColors[i * 3 + 1] = c.g;
      pColors[i * 3 + 2] = c.b;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute("color",    new THREE.BufferAttribute(pColors,   3));

    const pMat = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
    });

    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ============================================================
    // 2. KNOWLEDGE GRAPH NODES
    // ============================================================
    const nodeData = [
      { pos: [0,    0,   0],    label: "ETL",    color: TEAL,   radius: 0.22, pulse: true  },
      { pos: [-1.8, 1.2, -0.5], label: "dbt",    color: VIOLET, radius: 0.14, pulse: false },
      { pos: [1.6,  1.0, -0.5], label: "RAG",    color: VIOLET, radius: 0.14, pulse: false },
      { pos: [1.8, -0.8, -0.3], label: "GCP",    color: TEAL,   radius: 0.13, pulse: false },
      { pos: [-1.6,-1.0, -0.3], label: "Airflow",color: TEAL,   radius: 0.12, pulse: false },
      { pos: [0,   -1.8, -0.2], label: "LLM",    color: VIOLET, radius: 0.14, pulse: false },
    ];

    const nodes: THREE.Mesh[] = [];

    nodeData.forEach((n) => {
      const geo  = new THREE.SphereGeometry(n.radius, 20, 20);
      const mat  = new THREE.MeshStandardMaterial({
        color: n.color,
        emissive: n.color,
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.85,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...(n.pos as [number, number, number]));
      scene.add(mesh);
      nodes.push(mesh);

      // Edge ring
      const ringGeo = new THREE.RingGeometry(n.radius + 0.02, n.radius + 0.05, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: n.color,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(mesh.position);
      scene.add(ring);
    });

    // Edges between nodes
    const edgePairs = [[0,1],[0,2],[0,3],[0,4],[0,5],[1,2],[2,3]];
    edgePairs.forEach(([a, b]) => {
      const points = [nodes[a].position.clone(), nodes[b].position.clone()];
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color: "#0d2a3a",
        transparent: true,
        opacity: 0.5,
      });
      scene.add(new THREE.Line(geo, mat));
    });

    // ============================================================
    // 3. AURORA PLANE (background glow)
    // ============================================================
    const auroraGeo = new THREE.PlaneGeometry(16, 10);
    const auroraMat = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;
        void main() {
          float t = uTime * 0.3;
          float wave1 = sin(vUv.x * 3.0 + t) * 0.5 + 0.5;
          float wave2 = sin(vUv.y * 2.0 + t * 0.7) * 0.5 + 0.5;
          float mask  = smoothstep(0.0, 0.4, vUv.y) * smoothstep(1.0, 0.6, vUv.y);
          vec3 teal   = vec3(0.114, 0.620, 0.459);
          vec3 violet = vec3(0.325, 0.290, 0.718);
          vec3 col    = mix(teal, violet, wave1 * wave2);
          gl_FragColor = vec4(col, mask * 0.07);
        }
      `,
    });
    const aurora = new THREE.Mesh(auroraGeo, auroraMat);
    aurora.position.z = -3;
    scene.add(aurora);

    // ============================================================
    // 4. LIGHTING
    // ============================================================
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const dirLight = new THREE.DirectionalLight(0x5dcaa5, 1.2);
    dirLight.position.set(3, 5, 5);
    scene.add(dirLight);
    const fillLight = new THREE.DirectionalLight(0x534ab7, 0.6);
    fillLight.position.set(-5, -3, 3);
    scene.add(fillLight);

    // ============================================================
    // 5. MOUSE PARALLAX
    // ============================================================
    let mouseX = 0, mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    // ============================================================
    // 6. ANIMATION LOOP
    // ============================================================
    let frame = 0;
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      frame++;
      const t = frame * 0.01;

      // Aurora
      auroraMat.uniforms.uTime.value = t;

      // Particles drift
      const pos = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        pos[i * 3 + 1] += speeds[i];
        if (pos[i * 3 + 1] > 5) pos[i * 3 + 1] = -5;
      }
      pGeo.attributes.position.needsUpdate = true;

      // Node pulse & float
      nodes.forEach((n, i) => {
        n.rotation.y += 0.005;
        n.position.y += Math.sin(t + i * 1.2) * 0.001;
        const mat = n.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 0.3 + Math.sin(t * 2 + i) * 0.15;
      });

      // Gentle camera parallax
      camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 0.2 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      // Particle opacity idle pulse
      pMat.opacity = 0.45 + Math.sin(t * 0.5) * 0.15;

      renderer.render(scene, camera);
    };
    animate();

    // ============================================================
    // 7. RESIZE
    // ============================================================
    const onResize = () => {
      if (!canvas) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center overflow-hidden bg-void"
    >
      {/* Three.js canvas */}
      <canvas
        ref={canvasRef}
        className="canvas-full"
        style={{ width: "100%", height: "100%" }}
      />

      {/* Background void gradient */}
      <div className="canvas-full bg-void-gradient pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          {/* Tag */}
          <div className="inline-flex items-center gap-2 bg-teal-dark/30 border border-teal/30
                          rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-light animate-pulse" />
            <span className="font-mono text-teal-light text-xs tracking-widest">
              {PROFILE.tagline}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl font-medium leading-tight mb-4 text-white">
            Turning raw data into{" "}
            <span className="gradient-text">intelligent systems</span>
          </h1>

          <p className="text-muted text-base leading-relaxed mb-8 max-w-md">
            ETL pipelines · dbt models · LLM-assisted analytics · RAG applications —
            production-grade, built from scratch.
          </p>

          {/* CTA buttons */}
          <div className="flex gap-4 flex-wrap mb-10">
            <a
              href="#domains"
              className="bg-teal text-white px-6 py-3 rounded-lg text-sm font-medium
                         hover:bg-teal-dark transition-all hover:scale-105"
            >
              View my work
            </a>
            <Link
              href="/freelance"
              className="border border-teal/40 text-teal-light px-6 py-3 rounded-lg text-sm
                         font-medium hover:bg-teal/10 transition-all"
            >
              Hire me for a project
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-8">
            {[
              { num: PROFILE.stats.experience + " yrs", label: "Experience"       },
              { num: PROFILE.stats.savings,             label: "Client savings"   },
              { num: PROFILE.stats.records,             label: "Records processed"},
            ].map((s) => (
              <div key={s.label}>
                <div className="text-teal-light font-mono text-xl font-medium">{s.num}</div>
                <div className="text-dim text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side — empty space for 3D nodes to show through */}
        <div className="hidden md:block h-80" />
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="text-dim font-mono text-xs">scroll to explore</span>
        <div className="w-0.5 h-8 bg-gradient-to-b from-teal/40 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
