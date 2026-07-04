"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import type { Project, BimDiscipline } from "@/lib/data";

interface Props {
  project: Project | null;
  onClose: () => void;
}

type ViewerMode = "loading" | "glb" | "iframe" | "placeholder" | "error";

export default function ProjectBimModal({ project, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<any>(null);
  const sceneRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const controlsRef = useRef<any>(null);
  const frameRef = useRef<number>(0);
  const modelRef = useRef<any>(null); // loaded GLTF scene root

  const [activeDiscipline, setActiveDiscipline] = useState<string>("arxitektura");
  const [viewerMode, setViewerMode] = useState<ViewerMode>("loading");
  const [loadProgress, setLoadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Lock scroll
  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
      setActiveDiscipline("arxitektura");
      setViewerMode("loading");
      setLoadProgress(0);
      setErrorMsg("");
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [project]);

  // Determine viewer mode from modelUrl
  useEffect(() => {
    if (!project) return;
    const url = project.modelUrl;
    if (!url) {
      setViewerMode("placeholder");
      return;
    }
    if (url.startsWith("http") || url.startsWith("//")) {
      setViewerMode("iframe");
      return;
    }
    // It's a local file path — will be handled by Three.js init below
    setViewerMode("glb");
  }, [project]);

  // Three.js initializer for GLB files
  const initThree = useCallback(async (modelUrl: string) => {
    if (!canvasRef.current) return;
    let THREE: any, mounted = true;
    try {
      THREE = await import("three");
      const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
      const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
      const { DRACOLoader } = await import("three/examples/jsm/loaders/DRACOLoader.js");

      if (!mounted || !canvasRef.current) return;

      // Renderer
      const canvas = canvasRef.current;
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
      rendererRef.current = renderer;

      // Scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0a1520);
      scene.fog = new THREE.FogExp2(0x0a1520, 0.005);
      sceneRef.current = scene;

      // Camera
      const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 2000);
      camera.position.set(30, 20, 40);
      cameraRef.current = camera;

      // Controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.07;
      controls.screenSpacePanning = false;
      controlsRef.current = controls;

      // Lights
      const ambient = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambient);
      const sun = new THREE.DirectionalLight(0xfff5e0, 1.4);
      sun.position.set(50, 80, 40);
      sun.castShadow = true;
      sun.shadow.mapSize.set(2048, 2048);
      sun.shadow.camera.near = 1;
      sun.shadow.camera.far = 500;
      sun.shadow.camera.left = -100;
      sun.shadow.camera.right = 100;
      sun.shadow.camera.top = 100;
      sun.shadow.camera.bottom = -100;
      scene.add(sun);
      const fill = new THREE.DirectionalLight(0x8ab4ff, 0.4);
      fill.position.set(-40, 30, -30);
      scene.add(fill);

      // Grid helper
      const grid = new THREE.GridHelper(200, 40, 0x1a3a5c, 0x112233);
      (grid.material as any).opacity = 0.5;
      (grid.material as any).transparent = true;
      scene.add(grid);

      // DRACO decoder (for compressed Revit exports)
      const draco = new DRACOLoader();
      draco.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");

      // GLTF Loader
      const loader = new GLTFLoader();
      loader.setDRACOLoader(draco);

      loader.load(
        modelUrl,
        (gltf: any) => {
          if (!mounted) return;
          const model = gltf.scene;

          // Center & scale the model
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 30 / maxDim; // normalize to ~30 units
          model.scale.setScalar(scale);
          model.position.sub(center.multiplyScalar(scale));
          model.position.y += size.y * scale / 2; // sit on grid

          // Enable shadows on all meshes
          model.traverse((child: any) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          scene.add(model);
          modelRef.current = model;

          // Fit camera
          const newBox = new THREE.Box3().setFromObject(model);
          const newSize = newBox.getSize(new THREE.Vector3());
          const newCenter = newBox.getCenter(new THREE.Vector3());
          const dist = Math.max(newSize.x, newSize.y, newSize.z) * 1.8;
          camera.position.set(newCenter.x + dist, newCenter.y + dist * 0.6, newCenter.z + dist);
          controls.target.copy(newCenter);
          controls.minDistance = dist * 0.2;
          controls.maxDistance = dist * 5;
          controls.update();

          setViewerMode("glb");
        },
        (progress: ProgressEvent) => {
          if (progress.total > 0) {
            setLoadProgress(Math.round((progress.loaded / progress.total) * 100));
          }
        },
        (err: any) => {
          console.error("GLB load error:", err);
          if (mounted) {
            setErrorMsg("3D fayl yuklanmadi. Fayl mavjud emasmi yoki noto'g'ri format.");
            setViewerMode("error");
          }
        }
      );

      // Animate
      const animate = () => {
        frameRef.current = requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      // Resize
      const onResize = () => {
        if (!canvasRef.current) return;
        const w = canvasRef.current.clientWidth;
        const h = canvasRef.current.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);
      return () => {
        mounted = false;
        window.removeEventListener("resize", onResize);
        cancelAnimationFrame(frameRef.current);
        renderer.dispose();
      };
    } catch (e) {
      console.error("Three.js init failed:", e);
      if (mounted) {
        setErrorMsg("3D viewer yuklanmadi.");
        setViewerMode("error");
      }
    }
    return () => { mounted = false; };
  }, []);

  // Init Three.js when mode is glb
  useEffect(() => {
    if (viewerMode !== "glb" || !project?.modelUrl) return;
    const cleanup = initThree(project.modelUrl);
    return () => {
      cleanup?.then?.(fn => fn?.());
      cancelAnimationFrame(frameRef.current);
      rendererRef.current?.dispose();
      rendererRef.current = null;
      sceneRef.current = null;
      modelRef.current = null;
    };
  }, [viewerMode, project, initThree]);

  // Switch discipline — filter mesh visibility by name keywords
  useEffect(() => {
    const model = modelRef.current;
    if (!model || !project) return;
    const discipline = project.disciplines.find(d => d.id === activeDiscipline);
    if (!discipline) return;

    const keywords = discipline.meshKeywords;

    model.traverse((child: any) => {
      if (!child.isMesh) return;
      const name = (child.name || "").toLowerCase();
      const parentName = (child.parent?.name || "").toLowerCase();
      const combinedName = name + " " + parentName;

      if (keywords.length === 0) {
        // No keywords = show all
        child.visible = true;
      } else {
        child.visible = keywords.some(kw => combinedName.includes(kw.toLowerCase()));
      }
    });
  }, [activeDiscipline, project]);

  if (!project) return null;

  const discipline = project.disciplines.find(d => d.id === activeDiscipline) ?? project.disciplines[0];
  const isGlb = project.modelUrl && !project.modelUrl.startsWith("http") && !project.modelUrl.startsWith("//");
  const isIframe = project.modelUrl && (project.modelUrl.startsWith("http") || project.modelUrl.startsWith("//"));

  return (
    <div className="bim-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bim-modal">

        {/* ── Header ── */}
        <div className="bim-modal-header">
          <div className="bim-modal-title-group">
            <span className="bim-modal-label">BIM Viewer</span>
            <h2 className="bim-modal-title">{project.fullName}</h2>
            <div className="bim-modal-meta">
              <span>📍 {project.location}</span>
              <span className="bim-meta-sep">·</span>
              <span>📐 {project.area}</span>
              <span className="bim-meta-sep">·</span>
              <span>🏢 {project.floors}</span>
              <span className="bim-meta-sep">·</span>
              <span>📅 {project.year}</span>
            </div>
          </div>
          <button className="bim-modal-close" onClick={onClose} aria-label="Yopish">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ── Body ── */}
        <div className="bim-modal-body">

          {/* ── 3D / iframe / placeholder viewer ── */}
          <div className="bim-viewer-wrap">

            {/* GLB canvas */}
            {isGlb && (
              <>
                {viewerMode === "loading" && (
                  <div className="bim-loading">
                    <div className="bim-loading-spinner" />
                    <span>3D model yuklanmoqda...</span>
                    {loadProgress > 0 && <span className="bim-load-pct">{loadProgress}%</span>}
                  </div>
                )}
                {viewerMode === "error" && (
                  <div className="bim-loading bim-error">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="0.5" fill="currentColor"/>
                    </svg>
                    <span>{errorMsg}</span>
                    <p className="bim-error-hint">
                      GLB faylni <code>/public/models/</code> papkasiga joylashtiring va <code>modelUrl</code> ni data.ts da belgilang.
                    </p>
                  </div>
                )}
                <canvas ref={canvasRef} className="bim-canvas" />
                {viewerMode === "glb" && (
                  <div className="bim-viewer-hint">🖱️ Aylantirish · ⚲ Zoom · ⇧ Siljitish</div>
                )}
              </>
            )}

            {/* iFrame embed (Autodesk APS, Speckle, etc.) */}
            {isIframe && (
              <>
                {viewerMode === "loading" && (
                  <div className="bim-loading">
                    <div className="bim-loading-spinner" />
                    <span>Viewer yuklanmoqda...</span>
                  </div>
                )}
                <iframe
                  src={project.modelUrl}
                  className="bim-iframe"
                  title={project.fullName}
                  allow="fullscreen"
                  onLoad={() => setViewerMode("iframe")}
                />
              </>
            )}

            {/* No file — placeholder instructions */}
            {!project.modelUrl && (
              <div className="bim-placeholder">
                <div className="bim-placeholder-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <h3>3D Model Qo'shish</h3>
                <p>Bu loyiha uchun 3D fayl hali qo'shilmagan.</p>
                <div className="bim-placeholder-options">
                  <div className="bim-placeholder-option">
                    <strong>GLB / GLTF fayl</strong>
                    <span>Revit modelini <code>.glb</code> formatida eksport qiling, <code>/public/models/</code> ga joylashtiring va <code>modelUrl: "/models/fayl.glb"</code> ni data.ts da belgilang.</span>
                  </div>
                  <div className="bim-placeholder-option">
                    <strong>Autodesk APS (Forge Viewer)</strong>
                    <span>Modelni Autodesk Platform Services ga yuklang va embed URL ni <code>modelUrl</code> ga qo'ying.</span>
                  </div>
                  <div className="bim-placeholder-option">
                    <strong>Speckle Viewer</strong>
                    <span><code>https://app.speckle.systems/streams/…</code> embed URL ni <code>modelUrl</code> ga belgilang.</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="bim-sidebar">
            <div className="bim-discipline-label">BIM qismlari</div>
            <div className="bim-discipline-tabs">
              {project.disciplines.map((d) => (
                <button
                  key={d.id}
                  className={`bim-tab${activeDiscipline === d.id ? " active" : ""}`}
                  style={activeDiscipline === d.id
                    ? { "--tab-color": d.color, "--tab-bg": d.accentColor } as React.CSSProperties
                    : {}}
                  onClick={() => setActiveDiscipline(d.id)}
                >
                  <span className="bim-tab-dot" style={{ background: d.color }} />
                  <div className="bim-tab-text">
                    <span className="bim-tab-name">{d.label}</span>
                    <span className="bim-tab-sub">{d.labelUz}</span>
                  </div>
                  {/* Keyword count badge */}
                  {isGlb && (
                    <span className="bim-tab-kw-count">{d.meshKeywords.length}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Active discipline info */}
            <div
              className="bim-discipline-info"
              style={{ "--info-color": discipline.color, "--info-bg": discipline.accentColor } as React.CSSProperties}
            >
              <div className="bim-discipline-info-header">
                <span className="bim-discipline-dot" style={{ background: discipline.color }} />
                <h3>{discipline.label}</h3>
              </div>
              <p>{discipline.description}</p>
              {isGlb && discipline.meshKeywords.length > 0 && (
                <div className="bim-kw-list">
                  {discipline.meshKeywords.map(kw => (
                    <span key={kw} className="bim-kw-chip">{kw}</span>
                  ))}
                </div>
              )}
            </div>

            {/* File info */}
            {project.modelUrl && (
              <div className="bim-file-info">
                <span className="bim-file-type">
                  {isIframe ? "🔗 Iframe embed" : "📦 GLB / GLTF fayl"}
                </span>
                <span className="bim-file-path">{project.modelUrl.length > 40 ? project.modelUrl.slice(0, 38) + "…" : project.modelUrl}</span>
              </div>
            )}

            {/* Stats */}
            <div className="bim-project-stats">
              {[
                { label: "Maydon", value: project.area },
                { label: "Qavatlar", value: project.floors },
                { label: "Kategoriya", value: project.category },
                { label: "Yil", value: project.year },
              ].map(s => (
                <div key={s.label} className="bim-stat">
                  <span className="bim-stat-label">{s.label}</span>
                  <span className="bim-stat-value">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
