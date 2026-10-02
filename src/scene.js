/**
 * scene.js
 * Three.js Calm Ocean 3D Scene
 * Includes animated water surface, god rays, bubbles, plankton particles,
 * gentle sea creatures (school of fish, pulsing jellyfish, gliding sea turtle),
 * floating interactive project orbs with raycasting, and scroll-linked camera depth.
 */

import * as THREE from "three";
import { projectsData } from "./data/portfolioData.js";
import { projectModal } from "./modal.js";

export class OceanScene {
  constructor(containerEl) {
    this.container = containerEl;
    this.isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.isMobile = window.innerWidth < 768;
    this.scrollProgress = 0;
    this.targetScrollProgress = 0;
    this.mouse = new THREE.Vector2(0, 0);
    this.targetMouse = new THREE.Vector2(0, 0);
    this.raycaster = new THREE.Raycaster();
    this.hoveredOrb = null;
    this.isTabVisible = true;
    this.clock = new THREE.Clock();
    this.projectOrbs = [];
    this.bubbles = [];
    this.fishList = [];
    this.tentacles = [];
    this.activeHoveredId = null;

    // Ocean color gradient stops: [progress, hex]
    this.colorStops = [
      { p: 0.00, hex: "#4ecdc4", fog: "#4ecdc4" }, // Surface sunlit aqua
      { p: 0.20, hex: "#30a6b7", fog: "#30a6b7" }, // Shallows teal
      { p: 0.50, hex: "#1c6d8c", fog: "#1c6d8c" }, // Reef tranquil blue
      { p: 0.80, hex: "#0f3e5b", fog: "#0f3e5b" }, // Deep aquatic navy
      { p: 1.00, hex: "#071c2b", fog: "#071c2b" }, // Seabed tranquil deep
    ];

    this.init();
  }

  isWebGLAvailable() {
    try {
      const canvas = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
    } catch {
      return false;
    }
  }

  init() {
    if (!this.isWebGLAvailable()) {
      document.body.classList.add("no-webgl");
      console.warn("WebGL not available, fallback applied.");
      return;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Scene & Renderer
    this.scene = new THREE.Scene();
    this.currentColor = new THREE.Color(this.colorStops[0].hex);
    this.scene.background = this.currentColor;
    this.scene.fog = new THREE.FogExp2(this.currentColor, 0.014);

    this.camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 400);
    this.camera.position.set(0, 4, 18);
    this.cameraTargetY = 4;
    this.cameraBaseX = 0;

    this.renderer = new THREE.WebGLRenderer({
      powerPreference: "high-performance",
      antialias: true,
      alpha: false
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    this.container.appendChild(this.renderer.domElement);

    // Build scene elements
    this.setupLighting();
    this.createWaterSurface();
    this.createGodRays();
    this.createPlankton();
    this.createBubbles();
    this.createProjectOrbs();
    this.createFishSchool();
    this.createJellyfish();
    this.createSeaTurtle();
    this.createSeabed();

    // Event listeners
    this.setupEvents();

    // Start loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  setupLighting() {
    // Soft ambient light
    this.ambientLight = new THREE.AmbientLight(0x9fe8e0, 1.4);
    this.scene.add(this.ambientLight);

    // Warm sun directional light from top right
    this.sunLight = new THREE.DirectionalLight(0xfff5e6, 2.2);
    this.sunLight.position.set(15, 30, 15);
    this.scene.add(this.sunLight);

    // Soft teal fill light from below for gentle illumination
    this.fillLight = new THREE.DirectionalLight(0x288b9c, 0.9);
    this.fillLight.position.set(-15, -20, -10);
    this.scene.add(this.fillLight);
  }

  createWaterSurface() {
    // Calm animated water surface at the top
    const geom = new THREE.PlaneGeometry(80, 80, 48, 48);
    geom.rotateX(-Math.PI / 2);

    const mat = new THREE.MeshStandardMaterial({
      color: 0x6be5d9,
      roughness: 0.15,
      metalness: 0.1,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide
    });

    this.waterMesh = new THREE.Mesh(geom, mat);
    this.waterMesh.position.y = 7.5;
    this.scene.add(this.waterMesh);

    // Store original vertex positions for sine waves
    const pos = geom.attributes.position;
    this.waterOrigY = new Float32Array(pos.count);
    for (let i = 0; i < pos.count; i++) {
      this.waterOrigY[i] = pos.getY(i);
    }
  }

  createGodRays() {
    // Soft volumetric light rays angled through the water from surface
    this.godRaysGroup = new THREE.Group();
    const rayMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.11,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    for (let i = 0; i < 5; i++) {
      const coneGeo = new THREE.ConeGeometry(3.5 + i * 0.8, 38, 16, 1, true);
      const cone = new THREE.Mesh(coneGeo, rayMat);
      cone.position.set(-8 + i * 4.5, 3 - i * 1.5, -4 - i * 2.5);
      cone.rotation.z = -0.22 + (i * 0.04);
      cone.rotation.x = 0.12;
      cone.scale.set(1 + i * 0.15, 1, 0.6);
      this.godRaysGroup.add(cone);
    }

    this.scene.add(this.godRaysGroup);
  }

  createPlankton() {
    // Floating glowing marine plankton / particles
    const count = this.isMobile ? 220 : 650;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 45;
      positions[i * 3 + 1] = 10 - Math.random() * 130; // spans surface to seabed
      positions[i * 3 + 2] = (Math.random() - 0.5) * 35;
      scales[i] = Math.random() * 0.7 + 0.3;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1));

    // Particle sprite using canvas
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, "rgba(255, 255, 255, 1)");
    grad.addColorStop(0.35, "rgba(180, 245, 240, 0.75)");
    grad.addColorStop(1, "rgba(180, 245, 240, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(16, 16, 16, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 0.35,
      map: texture,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.plankton = new THREE.Points(geometry, material);
    this.scene.add(this.plankton);
  }

  createBubbles() {
    // Rising spherical bubbles
    const count = this.isMobile ? 35 : 100;
    this.bubblesGroup = new THREE.Group();

    const bubbleGeo = new THREE.SphereGeometry(0.22, 16, 16);
    const bubbleMat = new THREE.MeshPhysicalMaterial({
      color: 0xe6ffff,
      transmission: 0.85,
      opacity: 0.75,
      transparent: true,
      roughness: 0.1,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });

    for (let i = 0; i < count; i++) {
      const bubble = new THREE.Mesh(bubbleGeo, bubbleMat);
      const scale = Math.random() * 0.9 + 0.3;
      bubble.scale.set(scale, scale * 1.08, scale);
      bubble.position.set(
        (Math.random() - 0.5) * 36,
        10 - Math.random() * 125,
        (Math.random() - 0.5) * 24
      );

      bubble.userData = {
        speed: 0.025 + Math.random() * 0.04,
        swaySpeed: 1.2 + Math.random() * 2,
        swayAmp: 0.015 + Math.random() * 0.025,
        offset: Math.random() * Math.PI * 2,
        origX: bubble.position.x
      };

      this.bubbles.push(bubble);
      this.bubblesGroup.add(bubble);
    }

    this.scene.add(this.bubblesGroup);
  }

  createProjectOrbs() {
    // 4 Floating interactive 3D orbs for the projects in the REEF zone (y = -34 to -50)
    this.orbsGroup = new THREE.Group();

    // Coordinates tailored for desktop & mobile
    const positions = [
      { x: -5.5, y: -34, z: 2 },
      { x: 5.2, y: -39, z: 0 },
      { x: -5.0, y: -45, z: 1.5 },
      { x: 4.8, y: -50, z: -1 },
    ];

    projectsData.forEach((project, idx) => {
      const pos = positions[idx] || { x: 0, y: -35 - idx * 5, z: 0 };
      const orbContainer = new THREE.Group();
      orbContainer.position.set(pos.x, pos.y, pos.z);

      // Outer frosted glass orb
      const outerGeo = new THREE.SphereGeometry(1.35, 32, 32);
      const outerMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(project.orbColor),
        transmission: 0.75,
        roughness: 0.2,
        metalness: 0.1,
        transparent: true,
        opacity: 0.72,
        clearcoat: 0.8
      });
      const outerSphere = new THREE.Mesh(outerGeo, outerMat);
      orbContainer.add(outerSphere);

      // Inner glowing core
      const coreGeo = new THREE.SphereGeometry(0.72, 24, 24);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: new THREE.Color(project.orbColor),
        emissiveIntensity: 0.8,
        roughness: 0.4
      });
      const coreSphere = new THREE.Mesh(coreGeo, coreMat);
      orbContainer.add(coreSphere);

      // Gentle orbital ring
      const ringGeo = new THREE.RingGeometry(1.6, 1.82, 36);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(project.orbColor),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2.6;
      orbContainer.add(ring);

      // Metadata for raycaster & bobbing
      orbContainer.userData = {
        projectId: project.id,
        projectTitle: project.title,
        baseY: pos.y,
        baseScale: 1,
        targetScale: 1,
        pulseOffset: idx * 1.4,
        ringMesh: ring,
        coreMesh: coreSphere,
        outerMesh: outerSphere,
        isHovered: false
      };

      this.projectOrbs.push(orbContainer);
      this.orbsGroup.add(orbContainer);
    });

    this.scene.add(this.orbsGroup);
  }

  createFishSchool() {
    // School of 7 gentle fish swimming gracefully in the SHALLOWS zone (y = -12 to -22)
    this.fishSchoolGroup = new THREE.Group();
    this.fishSchoolGroup.position.set(0, -16, 0);

    const fishMat = new THREE.MeshStandardMaterial({
      color: 0xb5f3eb,
      metalness: 0.4,
      roughness: 0.3,
      emissive: 0x1a666e,
      emissiveIntensity: 0.25
    });

    const count = 7;
    for (let i = 0; i < count; i++) {
      const fish = new THREE.Group();

      // Fish body (stretched sphere / cone)
      const bodyGeo = new THREE.ConeGeometry(0.24, 1.1, 8);
      bodyGeo.rotateX(Math.PI / 2);
      const body = new THREE.Mesh(bodyGeo, fishMat);
      fish.add(body);

      // Tail fin
      const tailGeo = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        0, 0, -0.55,
        0, 0.3, -0.95,
        0, -0.3, -0.95
      ]);
      tailGeo.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
      tailGeo.computeVertexNormals();
      const tailMat = new THREE.MeshBasicMaterial({
        color: 0x76dcd1,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const tail = new THREE.Mesh(tailGeo, tailMat);
      fish.add(tail);

      // Offsets inside the school
      const angle = (i / count) * Math.PI * 2;
      const radius = 2.2 + (i % 3) * 0.7;
      const yOffset = (i % 4) * 0.45 - 0.9;

      fish.position.set(Math.cos(angle) * radius, yOffset, Math.sin(angle) * (radius * 0.7));
      fish.userData = {
        orbitAngle: angle,
        orbitRadius: radius,
        yOffset: yOffset,
        tail: tail,
        tailSpeed: 5 + i * 0.4,
        speed: 0.35 + (i % 2) * 0.05
      };

      this.fishList.push(fish);
      this.fishSchoolGroup.add(fish);
    }

    this.scene.add(this.fishSchoolGroup);
  }

  createJellyfish() {
    // Gentle translucent pulsing jellyfish in the DEEP zone (y = -68)
    this.jellyfish = new THREE.Group();
    this.jellyfish.position.set(-3.5, -68, -2);

    // Bell (dome)
    const bellGeo = new THREE.SphereGeometry(1.6, 24, 16, 0, Math.PI * 2, 0, Math.PI / 1.7);
    const bellMat = new THREE.MeshPhysicalMaterial({
      color: 0xa8f5eb,
      transmission: 0.85,
      opacity: 0.7,
      transparent: true,
      roughness: 0.2,
      emissive: 0x228b99,
      emissiveIntensity: 0.35,
      side: THREE.DoubleSide
    });
    this.jellyBell = new THREE.Mesh(bellGeo, bellMat);
    this.jellyBell.rotation.x = Math.PI; // Opening downwards
    this.jellyfish.add(this.jellyBell);

    // Inner glowing core
    const innerBellGeo = new THREE.SphereGeometry(0.85, 16, 12, 0, Math.PI * 2, 0, Math.PI / 1.8);
    const innerBellMat = new THREE.MeshBasicMaterial({
      color: 0xd4ffff,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    });
    const innerBell = new THREE.Mesh(innerBellGeo, innerBellMat);
    innerBell.rotation.x = Math.PI;
    this.jellyfish.add(innerBell);

    // Flowing tentacles
    const tentacleMat = new THREE.LineBasicMaterial({
      color: 0x86eae0,
      transparent: true,
      opacity: 0.55
    });

    const tentacleCount = 8;
    for (let i = 0; i < tentacleCount; i++) {
      const angle = (i / tentacleCount) * Math.PI * 2;
      const r = 1.05;
      const points = [];
      const segmentCount = 14;
      for (let s = 0; s < segmentCount; s++) {
        points.push(new THREE.Vector3(Math.cos(angle) * r, -s * 0.45, Math.sin(angle) * r));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geo, tentacleMat);
      line.userData = {
        baseAngle: angle,
        baseRadius: r,
        points: points
      };
      this.tentacles.push(line);
      this.jellyfish.add(line);
    }

    this.scene.add(this.jellyfish);
  }

  createSeaTurtle() {
    // Stylized peaceful sea turtle gliding calmly at y = -28
    this.turtle = new THREE.Group();
    this.turtle.position.set(7, -28, -5);
    this.turtle.rotation.y = -Math.PI / 3;

    const turtleMat = new THREE.MeshStandardMaterial({
      color: 0x2e8b82,
      roughness: 0.6,
      metalness: 0.1
    });

    // Shell
    const shellGeo = new THREE.SphereGeometry(1.5, 16, 12);
    shellGeo.scale(1.2, 0.5, 1.5);
    const shell = new THREE.Mesh(shellGeo, turtleMat);
    this.turtle.add(shell);

    // Head
    const headGeo = new THREE.SphereGeometry(0.45, 12, 10);
    headGeo.scale(0.8, 0.6, 1.2);
    const head = new THREE.Mesh(headGeo, turtleMat);
    head.position.set(0, 0.1, 1.9);
    this.turtle.add(head);

    // Flippers
    const flipperMat = new THREE.MeshStandardMaterial({
      color: 0x369c92,
      roughness: 0.7
    });

    this.turtleFlippers = [];
    const flipperGeo = new THREE.BoxGeometry(1.6, 0.08, 0.55);

    // Front Left
    const flFrontLeft = new THREE.Mesh(flipperGeo, flipperMat);
    flFrontLeft.position.set(-1.6, -0.1, 0.7);
    flFrontLeft.rotation.y = -0.4;
    this.turtle.add(flFrontLeft);
    this.turtleFlippers.push({ mesh: flFrontLeft, side: -1 });

    // Front Right
    const flFrontRight = new THREE.Mesh(flipperGeo, flipperMat);
    flFrontRight.position.set(1.6, -0.1, 0.7);
    flFrontRight.rotation.y = 0.4;
    this.turtle.add(flFrontRight);
    this.turtleFlippers.push({ mesh: flFrontRight, side: 1 });

    this.scene.add(this.turtle);
  }

  createSeabed() {
    // Gentle seabed terrain at the bottom (y = -108)
    const geom = new THREE.PlaneGeometry(80, 80, 40, 40);
    geom.rotateX(-Math.PI / 2);

    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const height = Math.sin(x * 0.1) * Math.cos(z * 0.1) * 1.8 + Math.sin(x * 0.04) * 1.2;
      pos.setY(i, height);
    }
    geom.computeVertexNormals();

    const mat = new THREE.MeshStandardMaterial({
      color: 0x092b42,
      roughness: 0.9,
      metalness: 0.1
    });

    this.seabedMesh = new THREE.Mesh(geom, mat);
    this.seabedMesh.position.y = -108;
    this.scene.add(this.seabedMesh);

    // Subtle gentle sea kelp strands
    const kelpMat = new THREE.MeshStandardMaterial({
      color: 0x18565e,
      roughness: 0.7,
      side: THREE.DoubleSide
    });

    for (let k = 0; k < 18; k++) {
      const kelpGeo = new THREE.CylinderGeometry(0.12, 0.22, 6 + Math.random() * 4, 6);
      const kelp = new THREE.Mesh(kelpGeo, kelpMat);
      kelp.position.set(
        (Math.random() - 0.5) * 40,
        -105 + Math.random() * 2,
        (Math.random() - 0.5) * 30
      );
      kelp.rotation.z = (Math.random() - 0.5) * 0.2;
      this.scene.add(kelp);
    }
  }

  setupEvents() {
    // Resize handler
    this.onResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      this.isMobile = width < 768;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", this.onResize);

    // Pointer move for parallax and raycasting
    this.onPointerMove = (e) => {
      this.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      this.checkRaycast();
    };
    window.addEventListener("pointermove", this.onPointerMove);

    // Pointer click for project orbs
    this.onPointerClick = () => {
      if (this.hoveredOrb) {
        const id = this.hoveredOrb.userData.projectId;
        if (id) {
          projectModal.open(id);
        }
      }
    };
    this.renderer.domElement.addEventListener("click", this.onPointerClick);

    // Page visibility to pause rendering when tab is hidden
    this.onVisibilityChange = () => {
      this.isTabVisible = !document.hidden;
      if (this.isTabVisible) {
        this.clock.start();
      } else {
        this.clock.stop();
      }
    };
    document.addEventListener("visibilitychange", this.onVisibilityChange);

    // Prefers reduced motion query
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    motionQuery.addEventListener("change", (e) => {
      this.isReducedMotion = e.matches;
    });
  }

  checkRaycast() {
    this.raycaster.setFromCamera(this.targetMouse, this.camera);
    const meshes = [];
    this.projectOrbs.forEach(orb => {
      meshes.push(orb.userData.outerMesh);
    });

    const intersects = this.raycaster.intersectObjects(meshes);

    if (intersects.length > 0) {
      const hitOrb = intersects[0].object.parent;
      if (this.hoveredOrb !== hitOrb) {
        this.setHoveredOrb(hitOrb);
      }
    } else {
      if (this.hoveredOrb) {
        this.setHoveredOrb(null);
      }
    }
  }

  setHoveredOrb(orb) {
    if (this.hoveredOrb && this.hoveredOrb !== orb) {
      this.hoveredOrb.userData.isHovered = false;
      this.hoveredOrb.userData.targetScale = 1;
    }

    this.hoveredOrb = orb;

    if (orb) {
      orb.userData.isHovered = true;
      orb.userData.targetScale = 1.22;
      document.body.style.cursor = "pointer";
      this.activeHoveredId = orb.userData.projectId;
      this.showTooltip(orb.userData.projectTitle);
    } else {
      document.body.style.cursor = "default";
      this.activeHoveredId = null;
      this.hideTooltip();
    }

    // Sync highlight with DOM project cards
    this.syncCardHighlight(this.activeHoveredId);
  }

  highlightOrbById(projectId) {
    const orb = this.projectOrbs.find(o => o.userData.projectId === projectId);
    if (orb) {
      this.setHoveredOrb(orb);
    } else {
      this.setHoveredOrb(null);
    }
  }

  showTooltip(title) {
    let tooltip = document.getElementById("orb-tooltip");
    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.id = "orb-tooltip";
      tooltip.className = "orb-tooltip";
      document.body.appendChild(tooltip);
    }
    tooltip.textContent = `${title} (Click to inspect)`;
    tooltip.classList.add("visible");

    // Position near mouse
    const updatePos = (e) => {
      if (tooltip) {
        tooltip.style.left = `${e.clientX + 16}px`;
        tooltip.style.top = `${e.clientY + 16}px`;
      }
    };
    window.addEventListener("pointermove", updatePos, { once: true });
  }

  hideTooltip() {
    const tooltip = document.getElementById("orb-tooltip");
    if (tooltip) {
      tooltip.classList.remove("visible");
    }
  }

  syncCardHighlight(activeId) {
    const cards = document.querySelectorAll(".project-card");
    cards.forEach(card => {
      if (activeId && card.dataset.projectId === activeId) {
        card.classList.add("highlighted-by-orb");
      } else {
        card.classList.remove("highlighted-by-orb");
      }
    });
  }

  updateScroll(progress) {
    this.targetScrollProgress = THREE.MathUtils.clamp(progress, 0, 1);
  }

  interpolateOceanColor(progress) {
    const stops = this.colorStops;
    let lower = stops[0];
    let upper = stops[stops.length - 1];

    for (let i = 0; i < stops.length - 1; i++) {
      if (progress >= stops[i].p && progress <= stops[i + 1].p) {
        lower = stops[i];
        upper = stops[i + 1];
        break;
      }
    }

    const range = upper.p - lower.p;
    const factor = range === 0 ? 0 : (progress - lower.p) / range;

    const c1 = new THREE.Color(lower.hex);
    const c2 = new THREE.Color(upper.hex);
    c1.lerp(c2, factor);
    return c1;
  }

  animate() {
    if (!this.isTabVisible) {
      requestAnimationFrame(this.animate);
      return;
    }

    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // Smooth scroll interpolation
    this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.08;

    // Mouse lerp for gentle parallax
    this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
    this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

    // Camera positioning based on scroll depth:
    // Surface (p=0): y = 4
    // Shallows (p=0.25): y = -16
    // Reef (p=0.5): y = -42
    // Deep (p=0.75): y = -70
    // Seabed (p=1.0): y = -104
    const depthY = 4 - (this.scrollProgress * 108);
    const parallaxX = this.isReducedMotion ? 0 : this.mouse.x * 2.2;
    const parallaxY = this.isReducedMotion ? 0 : this.mouse.y * 1.2;

    this.camera.position.y = depthY + parallaxY;
    this.camera.position.x = parallaxX;
    this.camera.lookAt(parallaxX * 0.4, depthY - 1, 0);

    // Update background color & fog smoothly
    const targetOceanColor = this.interpolateOceanColor(this.scrollProgress);
    this.currentColor.lerp(targetOceanColor, 0.08);
    this.scene.background = this.currentColor;
    if (this.scene.fog) {
      this.scene.fog.color.copy(this.currentColor);
      // Slightly denser fog deeper down for depth sensation
      this.scene.fog.density = 0.012 + this.scrollProgress * 0.008;
    }

    // Dynamic light shifts
    if (this.ambientLight) {
      const ambientIntensity = 1.4 - this.scrollProgress * 0.6;
      this.ambientLight.intensity = Math.max(0.65, ambientIntensity);
    }
    if (this.sunLight) {
      const sunIntensity = 2.2 - this.scrollProgress * 1.8;
      this.sunLight.intensity = Math.max(0.2, sunIntensity);
    }

    // Water surface waves animation
    if (this.waterMesh && !this.isReducedMotion) {
      const pos = this.waterMesh.geometry.attributes.position;
      const count = pos.count;
      for (let i = 0; i < count; i++) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        const wave = Math.sin(x * 0.35 + time * 1.2) * 0.16 +
                     Math.cos(z * 0.35 + time * 0.9) * 0.14;
        pos.setY(i, this.waterOrigY[i] + wave);
      }
      pos.needsUpdate = true;
    }

    // God rays gentle swaying
    if (this.godRaysGroup && !this.isReducedMotion) {
      this.godRaysGroup.children.forEach((ray, i) => {
        ray.rotation.z = -0.22 + Math.sin(time * 0.6 + i) * 0.035;
      });
    }

    // Plankton drifting
    if (this.plankton && !this.isReducedMotion) {
      const pos = this.plankton.geometry.attributes.position;
      const count = pos.count;
      for (let i = 0; i < count; i++) {
        let py = pos.getY(i) + 0.015;
        if (py > 12) py = -115; // Reset to seabed
        pos.setY(i, py);
      }
      pos.needsUpdate = true;
    }

    // Rising bubbles animation
    if (this.bubbles.length > 0 && !this.isReducedMotion) {
      this.bubbles.forEach(b => {
        b.position.y += b.userData.speed;
        b.position.x = b.userData.origX + Math.sin(time * b.userData.swaySpeed + b.userData.offset) * b.userData.swayAmp * 15;
        // Reset when reaching surface
        if (b.position.y > 8) {
          b.position.y = -115;
        }
      });
    }

    // Project Orbs bobbing, ring rotation & scale lerp
    this.projectOrbs.forEach(orb => {
      const data = orb.userData;
      if (!this.isReducedMotion) {
        orb.position.y = data.baseY + Math.sin(time * 1.5 + data.pulseOffset) * 0.35;
        if (data.ringMesh) {
          data.ringMesh.rotation.z += data.isHovered ? 0.035 : 0.012;
        }
      }
      // Scale lerp
      const currentScale = orb.scale.x;
      const nextScale = currentScale + (data.targetScale - currentScale) * 0.12;
      orb.scale.set(nextScale, nextScale, nextScale);

      // Emissive core pulse
      if (data.coreMesh && data.coreMesh.material) {
        const baseIntensity = data.isHovered ? 1.5 : 0.8;
        data.coreMesh.material.emissiveIntensity = baseIntensity + Math.sin(time * 2 + data.pulseOffset) * 0.2;
      }
    });

    // School of Fish swimming in orbit
    if (this.fishList.length > 0 && !this.isReducedMotion) {
      this.fishList.forEach(fish => {
        const d = fish.userData;
        d.orbitAngle += delta * d.speed;
        const x = Math.cos(d.orbitAngle) * d.orbitRadius;
        const z = Math.sin(d.orbitAngle) * (d.orbitRadius * 0.7);
        fish.position.x = x;
        fish.position.z = z;

        // Face forward tangent to path
        const tangentAngle = d.orbitAngle + Math.PI / 2;
        fish.rotation.y = -tangentAngle;

        // Tail wag
        if (d.tail) {
          d.tail.rotation.y = Math.sin(time * d.tailSpeed) * 0.35;
        }
      });
    }

    // Jellyfish gentle pulse and tentacle undulation
    if (this.jellyfish && !this.isReducedMotion) {
      const pulse = Math.sin(time * 1.6);
      const bellScale = 1 + pulse * 0.12;
      this.jellyBell.scale.set(bellScale, 1 - pulse * 0.08, bellScale);
      this.jellyfish.position.y = -68 + Math.sin(time * 0.8) * 0.9;

      // Tentacle wave motion
      this.tentacles.forEach((t, ti) => {
        const pos = t.geometry.attributes.position;
        const segCount = pos.count;
        for (let s = 1; s < segCount; s++) {
          const sway = Math.sin(time * 2.2 - s * 0.4 + ti) * (s * 0.04);
          pos.setX(s, t.userData.points[s].x + sway);
          pos.setZ(s, t.userData.points[s].z + sway * 0.5);
        }
        pos.needsUpdate = true;
      });
    }

    // Sea turtle gliding calmly
    if (this.turtle && !this.isReducedMotion) {
      this.turtle.position.x = 6 + Math.cos(time * 0.25) * 4;
      this.turtle.position.z = -5 + Math.sin(time * 0.25) * 3;
      this.turtle.position.y = -28 + Math.sin(time * 0.4) * 0.6;
      this.turtle.rotation.y = -Math.PI / 3 + Math.sin(time * 0.25) * 0.25;

      // Flipper flaps
      this.turtleFlippers.forEach(f => {
        f.mesh.rotation.z = Math.sin(time * 1.4) * 0.35 * f.side;
      });
    }

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate);
  }

  destroy() {
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("pointermove", this.onPointerMove);
    document.removeEventListener("visibilitychange", this.onVisibilityChange);
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.remove();
    }
  }
}
