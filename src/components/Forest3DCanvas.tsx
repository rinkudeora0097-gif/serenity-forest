import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Wind, Play, Pause, Sparkles, Volume2, VolumeX } from 'lucide-react';

interface Forest3DCanvasProps {
  isDarkMode: boolean;
}

export default function Forest3DCanvas({ isDarkMode }: Forest3DCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // State to manage quality settings (for low-end devices)
  const [highQuality, setHighQuality] = useState(true);
  const [isRotating, setIsRotating] = useState(true);

  // Audio state & refs for high-fidelity procedurally synthesized waterfall sound
  const [isSoundOn, setIsSoundOn] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mainGainRef = useRef<GainNode | null>(null);
  const sourcesRef = useRef<AudioBufferSourceNode[]>([]);

  const startWaterfallAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) {
        console.warn("Web Audio API not supported in this browser");
        return;
      }
      
      let context = audioContextRef.current;
      if (!context) {
        context = new AudioCtx();
        audioContextRef.current = context;
      }

      if (context.state === 'suspended') {
        context.resume();
      }

      // Safeguard: Ensure we don't start duplicate players
      if (sourcesRef.current.length > 0) return;

      const sampleRate = context.sampleRate;
      const bufferSize = sampleRate * 3; // 3 seconds loop buffer
      
      // 1. Generate Brownian Noise Buffer (warm deep rolling nature background)
      const brownNoiseBuffer = context.createBuffer(1, bufferSize, sampleRate);
      const bData = brownNoiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        bData[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = bData[i];
        bData[i] *= 3.5; // Compensate for natural power loss under integration
      }

      // 2. Generate White Noise Buffer (bright high-pitch splash shimmer)
      const whiteNoiseBuffer = context.createBuffer(1, bufferSize, sampleRate);
      const wData = whiteNoiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        wData[i] = Math.random() * 2 - 1;
      }

      // Create master output channel gain
      const masterGain = context.createGain();
      masterGain.gain.setValueAtTime(0, context.currentTime);
      masterGain.connect(context.destination);
      mainGainRef.current = masterGain;

      // --- Deep Rumble Path ---
      const rumbleSource = context.createBufferSource();
      rumbleSource.buffer = brownNoiseBuffer;
      rumbleSource.loop = true;

      const rumbleFilter = context.createBiquadFilter();
      rumbleFilter.type = 'lowpass';
      rumbleFilter.frequency.setValueAtTime(140, context.currentTime);
      rumbleFilter.Q.setValueAtTime(1.2, context.currentTime);

      const rumbleGain = context.createGain();
      rumbleGain.gain.setValueAtTime(0.45, context.currentTime);

      rumbleSource.connect(rumbleFilter);
      rumbleFilter.connect(rumbleGain);
      rumbleGain.connect(masterGain);

      // --- Custom Midrange Splashing Path ---
      const splashSource = context.createBufferSource();
      splashSource.buffer = brownNoiseBuffer;
      splashSource.loop = true;

      const splashFilter = context.createBiquadFilter();
      splashFilter.type = 'bandpass';
      splashFilter.frequency.setValueAtTime(450, context.currentTime);
      splashFilter.Q.setValueAtTime(1.0, context.currentTime);

      const splashGain = context.createGain();
      splashGain.gain.setValueAtTime(0.35, context.currentTime);

      splashSource.connect(splashFilter);
      splashFilter.connect(splashGain);
      splashGain.connect(masterGain);

      // --- Shimmer/Atmosphere Spray Path ---
      const spraySource = context.createBufferSource();
      spraySource.buffer = whiteNoiseBuffer;
      spraySource.loop = true;

      const sprayFilter = context.createBiquadFilter();
      sprayFilter.type = 'bandpass';
      sprayFilter.frequency.setValueAtTime(1550, context.currentTime);
      sprayFilter.Q.setValueAtTime(0.9, context.currentTime);

      const sprayGain = context.createGain();
      sprayGain.gain.setValueAtTime(0.14, context.currentTime);

      spraySource.connect(sprayFilter);
      sprayFilter.connect(sprayGain);
      sprayGain.connect(masterGain);

      // --- Organic slow breeze modulator (LFO) ---
      const osc = context.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(0.12, context.currentTime); // ~8.3 sec breeze cycle

      const oscGain = context.createGain();
      oscGain.gain.setValueAtTime(0.045, context.currentTime); // modulation depth

      osc.connect(oscGain);
      oscGain.connect(sprayGain.gain);

      // Fire off all synthesis units
      rumbleSource.start(0);
      splashSource.start(0);
      spraySource.start(0);
      osc.start(0);

      // High quality fade-in over 1.5s
      masterGain.gain.linearRampToValueAtTime(0.7, context.currentTime + 1.5);

      // Track source instances
      sourcesRef.current = [rumbleSource, splashSource, spraySource];
      setIsSoundOn(true);
    } catch (err) {
      console.error("Unable to synthesize waterfall nature sound:", err);
    }
  };

  const stopWaterfallAudio = () => {
    const context = audioContextRef.current;
    const masterGain = mainGainRef.current;
    
    if (context && masterGain) {
      try {
        const currVal = masterGain.gain.value;
        masterGain.gain.setValueAtTime(currVal, context.currentTime);
        // Clean fade out over 0.8s
        masterGain.gain.linearRampToValueAtTime(0, context.currentTime + 0.8);
        
        const instances = [...sourcesRef.current];
        sourcesRef.current = [];
        
        setTimeout(() => {
          instances.forEach(s => {
            try { s.stop(); } catch(err){}
          });
          setIsSoundOn(false);
        }, 850);
      } catch (err) {
        console.warn("Direct stop as fallback:", err);
        setIsSoundOn(false);
      }
    } else {
      setIsSoundOn(false);
    }
  };

  const toggleWaterfallSound = () => {
    if (isSoundOn) {
      stopWaterfallAudio();
    } else {
      startWaterfallAudio();
    }
  };

  // Safe audio unmount hook
  useEffect(() => {
    return () => {
      sourcesRef.current.forEach(s => {
        try { s.stop(); } catch(err){}
      });
      if (audioContextRef.current) {
        try { audioContextRef.current.close(); } catch(err){}
      }
    };
  }, []);
  
  // Refs to easily update materials/lights on dark mode change
  const materialsRef = useRef<{
    skyMat?: THREE.MeshBasicMaterial;
    mountainMat?: THREE.MeshStandardMaterial;
    groundMat?: THREE.MeshStandardMaterial;
    foliageMats?: THREE.MeshStandardMaterial[];
    mistParticles?: THREE.Points;
  }>({});

  const lightsRef = useRef<{
    ambient?: THREE.AmbientLight;
    directional?: THREE.DirectionalLight;
    moonGlow?: THREE.PointLight;
  }>({});

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(isDarkMode ? 0x050d0a : 0xebf2f1, 0.04);

    // --- CAMERA SETUP ---
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 550;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 12);
    camera.lookAt(0, 0.6, 0);

    // --- RENDERER SETUP ---
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    // --- MATERIALS COLLECTION ---
    const isDark = isDarkMode;
    
    // Ambient Atmosphere Colors
    const skyColor = isDark ? 0x050d0a : 0xebf2f1;
    const foliageColors = isDark 
      ? [0x0c2718, 0x081e12, 0x143c22, 0x071b0f] 
      : [0x2d5a27, 0x1e3f1a, 0x3e7537, 0x35602e];
    
    const groundColor = isDark ? 0x051a0d : 0x3d6634;
    const mountainColor = isDark ? 0x081310 : 0x5a7065;
    const trunkColor = 0x4a3424;
    const rockColor = isDark ? 0x121a18 : 0x6e7570;

    // Reusable Materials
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: groundColor,
      roughness: 0.9,
      metalness: 0.1,
    });

    const mountainMaterial = new THREE.MeshStandardMaterial({
      color: mountainColor,
      roughness: 0.8,
      metalness: 0.2,
      flatShading: true
    });

    const rockMaterial = new THREE.MeshStandardMaterial({
      color: rockColor,
      roughness: 0.75,
      metalness: 0.1,
      flatShading: true
    });

    const trunkMaterial = new THREE.MeshStandardMaterial({
      color: trunkColor,
      roughness: 0.9,
    });

    const foliageMaterials = foliageColors.map(c => new THREE.MeshStandardMaterial({
      color: c,
      roughness: 0.85,
      metalness: 0.05,
      flatShading: true
    }));

    // Keep references for dynamic theme switching
    materialsRef.current = {
      groundMat: groundMaterial,
      mountainMat: mountainMaterial,
      foliageMats: foliageMaterials
    };

    // --- WORLD ENVIRONMENT MESHES ---

    // 1. Terrain Ground
    const groundGeo = new THREE.PlaneGeometry(35, 35, 24, 24);
    // Displace vertices to create organic hilly bumps
    const pos = groundGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      // Gentle sine peaks
      const zNoise = Math.sin(vx * 0.3) * Math.cos(vy * 0.3) * 0.4 + Math.sin(vx * 0.1) * 0.3;
      pos.setZ(i, zNoise);
    }
    groundGeo.computeVertexNormals();

    const groundMesh = new THREE.Mesh(groundGeo, groundMaterial);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -0.5;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // 2. Basil / Mountain Backdrop (Low-poly)
    const backgroundGroup = new THREE.Group();
    const mountainPositions = [
      { x: -14, z: -15, scale: { x: 8, y: 12, z: 8 }, rx: 0.1 },
      { x: -7, z: -18, scale: { x: 10, y: 15, z: 10 }, rx: -0.05 },
      { x: 6, z: -16, scale: { x: 11, y: 14, z: 11 }, rx: 0.05 },
      { x: 15, z: -14, scale: { x: 8, y: 11, z: 8 }, rx: -0.1 }
    ];

    mountainPositions.forEach(m => {
      const mountainGeo = new THREE.ConeGeometry(1, 1, 5);
      const mountain = new THREE.Mesh(mountainGeo, mountainMaterial);
      mountain.position.set(m.x, m.scale.y * 0.5 - 2, m.z);
      mountain.scale.set(m.scale.x, m.scale.y, m.scale.z);
      mountain.rotation.y = Math.random() * Math.PI;
      mountain.rotation.x = m.rx;
      mountain.castShadow = true;
      mountain.receiveShadow = true;
      backgroundGroup.add(mountain);
    });
    scene.add(backgroundGroup);

    // 3. Basalt Rocks & Waterfall Cliff Structure
    const rockGroup = new THREE.Group();
    const rockPlacements = [
      // Left Cliff Wall supporting waterfall
      { x: -2.3, y: 1.0, z: -4, sx: 1.8, sy: 4.2, sz: 2.2, r: 0.2 },
      { x: -3.5, y: 0.4, z: -3.5, sx: 1.5, sy: 2.5, sz: 1.8, r: -0.3 },
      // Right Cliff Wall
      { x: 2.3, y: 1.2, z: -4.2, sx: 1.9, sy: 4.5, sz: 2.0, r: -0.1 },
      { x: 3.4, y: 0.5, z: -3.8, sx: 1.4, sy: 2.8, sz: 1.7, r: 0.4 },
      // Waterfall top shelf rock
      { x: 0, y: 2.4, z: -4.5, sx: 3.2, sy: 0.8, sz: 1.5, r: 0 },
      // Waterfall basin rocks (where water crashes)
      { x: -1.2, y: -0.4, z: -2.2, sx: 1.0, sy: 0.6, sz: 1.1, r: 0.5 },
      { x: 1.1, y: -0.4, z: -2.4, sx: 0.9, sy: 0.7, sz: 1.0, r: -0.5 },
      { x: 0.0, y: -0.6, z: -1.8, sx: 1.4, sy: 0.4, sz: 1.2, r: 0.1 }
    ];

    rockPlacements.forEach((rp) => {
      // Create interesting low poly boulders utilizing Dodecahedron
      const geo = new THREE.DodecahedronGeometry(1, 1);
      const boulder = new THREE.Mesh(geo, rockMaterial);
      boulder.position.set(rp.x, rp.y, rp.z);
      boulder.scale.set(rp.sx, rp.sy, rp.sz);
      boulder.rotation.set(Math.random() * 0.2, rp.r, Math.random() * 0.2);
      boulder.castShadow = true;
      boulder.receiveShadow = true;
      rockGroup.add(boulder);
    });
    scene.add(rockGroup);


    // 4. Procedural Stylized Forest Trees
    const treesGroup = new THREE.Group();
    const treePositions = [
      // Left foreground thicket
      { x: -4.8, z: -2, s: 1.1 },
      { x: -6.2, z: -3, s: 1.3 },
      { x: -5.5, z: -5, s: 1.5 },
      { x: -7.5, z: -4, s: 1.4 },
      // Right foreground thicket
      { x: 4.6, z: -1.8, s: 1.0 },
      { x: 5.8, z: -3.2, s: 1.4 },
      { x: 5.0, z: -5.5, s: 1.6 },
      { x: 7.2, z: -4.5, s: 1.3 },
      // Midground Scattered trees
      { x: -8.0, z: -9, s: 1.6 },
      { x: -10.5, z: -8, s: 1.8 },
      { x: 8.5, z: -8, s: 1.7 },
      { x: 10.0, z: -10, s: 2.0 },
      // Background dense border
      { x: -13.0, z: -14, s: 2.2 },
      { x: -11.0, z: -16, s: 2.4 },
      { x: 11.5, z: -15, s: 2.3 },
      { x: 13.5, z: -13, s: 2.1 }
    ];

    const treeMeshes: THREE.Group[] = [];

    treePositions.forEach((posInfo) => {
      const tree = new THREE.Group();
      tree.position.set(posInfo.x, -0.3, posInfo.z);
      tree.scale.set(posInfo.s, posInfo.s, posInfo.s);

      // Oak/Pine Trunk
      const trunkGeo = new THREE.CylinderGeometry(0.08, 0.14, 0.9, 5);
      const trunk = new THREE.Mesh(trunkGeo, trunkMaterial);
      trunk.position.y = 0.45;
      trunk.castShadow = true;
      trunk.receiveShadow = true;
      tree.add(trunk);

      // Stacked Pine Cones (foliage layers)
      const layersCount = 3;
      const foliageGroup = new THREE.Group();
      foliageGroup.name = "foliage";
      
      for (let j = 0; j < layersCount; j++) {
        const layerGeo = new THREE.ConeGeometry(0.55 - j * 0.12, 0.75, 5);
        // Distribute materials randomly among foliage variations
        const mat = foliageMaterials[Math.floor(Math.random() * foliageMaterials.length)];
        const layerMesh = new THREE.Mesh(layerGeo, mat);
        
        // Stack cones vertically
        layerMesh.position.y = 0.9 + j * 0.5;
        layerMesh.castShadow = true;
        layerMesh.receiveShadow = true;
        foliageGroup.add(layerMesh);
      }
      tree.add(foliageGroup);
      treesGroup.add(tree);
      treeMeshes.push(tree);
    });
    scene.add(treesGroup);


    // --- 5. THE 3D WATERFALL SYSTEM ---
    
    // Static glowing backing plane for vertical water texture
    const waterBackGeo = new THREE.PlaneGeometry(0.9, 3.1);
    const waterBackMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x0a3b2b : 0xa4ecd6,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide
    });
    const waterPlane = new THREE.Mesh(waterBackGeo, waterBackMat);
    // Place vertically, coming down from top basalt ledger towards basin
    waterPlane.position.set(0, 0.8, -3.4);
    scene.add(waterPlane);

    // Dynamic Waterfall Particle system (Cascading Water droplets)
    const waterfallParticlesCount = highQuality ? 140 : 60;
    const waterfallGeo = new THREE.BufferGeometry();
    const waterfallPositions = new Float32Array(waterfallParticlesCount * 3);
    const waterfallVelocities: number[] = [];
    
    // Spawn initial states
    for (let i = 0; i < waterfallParticlesCount; i++) {
      // Randomly distributed across width of ledger
      const x = (Math.random() - 0.5) * 0.75;
      // Staggered initial heights along the path
      const y = 2.4 - Math.random() * 3.2;
      const z = -3.4 + (Math.random() - 0.5) * 0.1;

      waterfallPositions[i * 3] = x;
      waterfallPositions[i * 3 + 1] = y;
      waterfallPositions[i * 3 + 2] = z;

      // Vertical speed, horizontal drift velocity
      waterfallVelocities.push(); // custom tracker below
    }

    waterfallGeo.setAttribute('position', new THREE.BufferAttribute(waterfallPositions, 3));
    
    // Glowing cyan droplet particles
    const waterfallParticleMaterial = new THREE.PointsMaterial({
      color: isDark ? 0x9bfbe1 : 0xd2fbf0,
      size: 0.16,
      transparent: true,
      opacity: 0.85,
    });
    
    const waterfallSystem = new THREE.Points(waterfallGeo, waterfallParticleMaterial);
    scene.add(waterfallSystem);

    // Custom data array to update particle behavior
    interface DropInfo {
      x: number;
      y: number;
      z: number;
      speedY: number;
      speedX: number;
      life: number;
    }
    const dropsList: DropInfo[] = Array.from({ length: waterfallParticlesCount }).map(() => ({
      x: (Math.random() - 0.5) * 0.75,
      y: 2.4 - Math.random() * 3.0,
      z: -3.4 + (Math.random() - 0.5) * 0.08,
      speedY: 1.0 + Math.random() * 1.5,
      speedX: (Math.random() - 0.5) * 0.15,
      life: Math.random()
    }));


    // --- 6. WATERFALL SPLASH & FOAM particles ---
    const splashParticlesCount = highQuality ? 80 : 30;
    const splashGeo = new THREE.BufferGeometry();
    const splashPositions = new Float32Array(splashParticlesCount * 3);
    
    for (let i = 0; i < splashParticlesCount; i++) {
      splashPositions[i * 3] = 0;
      splashPositions[i * 3 + 1] = -99; // hides them initially
      splashPositions[i * 3 + 2] = 0;
    }
    
    splashGeo.setAttribute('position', new THREE.BufferAttribute(splashPositions, 3));
    
    const splashMaterial = new THREE.PointsMaterial({
      color: isDark ? 0x76eccf : 0xffffff,
      size: 0.12,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });
    
    const splashSystem = new THREE.Points(splashGeo, splashMaterial);
    scene.add(splashSystem);

    interface SplashInfo {
      x: number;
      y: number;
      z: number;
      vX: number;
      vY: number;
      vZ: number;
      life: number;
    }
    const splashList: SplashInfo[] = Array.from({ length: splashParticlesCount }).map(() => ({
      x: 0, y: -99, z: 0,
      vX: 0, vY: 0, vZ: 0,
      life: 0
    }));


    // --- 7. MAGICAL DRIFTING 3D LEAVES ---
    const leavesCount = highQuality ? 25 : 10;
    const leafGroup = new THREE.Group();
    const leavesList: {
      mesh: THREE.Mesh;
      speedY: number;
      angle: number;
      swaySpeed: number;
      rotSpeed: { x: number; y: number; z: number };
    }[] = [];

    // Organic Leaf Shape Geometry
    const leafGeo = new THREE.ConeGeometry(0.05, 0.14, 4);

    const leafMaterials = [
      new THREE.MeshStandardMaterial({ color: isDark ? 0x0d3c1a : 0x4a7e37, roughness: 0.9, side: THREE.DoubleSide }),
      new THREE.MeshStandardMaterial({ color: isDark ? 0x22551a : 0x739c47, roughness: 0.8, side: THREE.DoubleSide }),
      new THREE.MeshStandardMaterial({ color: isDark ? 0x5a3e1a : 0xc7923e, roughness: 0.9, side: THREE.DoubleSide }) // autumn golden hints
    ];

    for (let i = 0; i < leavesCount; i++) {
      const mat = leafMaterials[i % leafMaterials.length];
      const leafMesh = new THREE.Mesh(leafGeo, mat);
      
      // Random starting coordinates
      const rx = (Math.random() - 0.5) * 14;
      const ry = 2.0 + Math.random() * 4.0;
      const rz = -6 + Math.random() * 8;
      
      leafMesh.position.set(rx, ry, rz);
      // Give initial random rotation
      leafMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      leafMesh.castShadow = true;
      
      leafGroup.add(leafMesh);
      
      leavesList.push({
        mesh: leafMesh,
        speedY: 0.015 + Math.random() * 0.015,
        angle: Math.random() * Math.PI * 2,
        swaySpeed: 1 + Math.random() * 1.5,
        rotSpeed: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.03,
          z: (Math.random() - 0.5) * 0.02
        }
      });
    }
    scene.add(leafGroup);


    // --- 8. FLOATING MAGICAL FIREFLIES (BIOLUMINESCENT LIGHTS) ---
    const fireflyCount = highQuality ? 22 : 9;
    const firefliesGroup = new THREE.Group();
    const firefliesList: {
      mesh: THREE.Mesh;
      baseX: number;
      baseY: number;
      baseZ: number;
      noiseOffset: number;
      speed: number;
    }[] = [];

    const fireflyGeo = new THREE.SphereGeometry(0.04, 3, 3);
    const fireflyMaterial = new THREE.MeshBasicMaterial({
      color: 0x9be04c,
    });

    for (let i = 0; i < fireflyCount; i++) {
      const fireflyMesh = new THREE.Mesh(fireflyGeo, fireflyMaterial);
      
      // Distribute in beautiful 3D volume around forest
      const x = (Math.random() - 0.5) * 12;
      const y = 0.2 + Math.random() * 2.2;
      const z = -4 + Math.random() * 8;
      
      fireflyMesh.position.set(x, y, z);
      
      // Create a small helper point light for the first 5 fireflies on high quality
      if (highQuality && i < 4) {
        const glowLight = new THREE.PointLight(0xa5f340, 0.4, 2);
        glowLight.position.set(0, 0, 0);
        fireflyMesh.add(glowLight);
      }

      firefliesGroup.add(fireflyMesh);

      firefliesList.push({
        mesh: fireflyMesh,
        baseX: x,
        baseY: y,
        baseZ: z,
        noiseOffset: Math.random() * 50,
        speed: 0.3 + Math.random() * 0.5
      });
    }
    scene.add(firefliesGroup);


    // --- 9. LIGHTING TRANSITIONS & AMBIENT SETUP ---
    
    // Dynamic lights configured seamlessly based on theme
    const ambientLight = new THREE.AmbientLight(
      isDark ? 0x0c1524 : 0xdfede4, // Dark deep blue vs soft golden forest green
      isDark ? 0.6 : 0.85
    );
    scene.add(ambientLight);
    lightsRef.current.ambient = ambientLight;

    // Scenic Sun Light
    const dirLight = new THREE.DirectionalLight(
      isDark ? 0x2244bb : 0xfff6dd, // Bioluminescent moonbeam vs warm sun
      isDark ? 0.8 : 1.4
    );
    dirLight.position.set(5, 8, 4);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = highQuality ? 1024 : 512;
    dirLight.shadow.mapSize.height = highQuality ? 1024 : 512;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 25;
    dirLight.shadow.camera.left = -10;
    dirLight.shadow.camera.right = 10;
    dirLight.shadow.camera.top = 10;
    dirLight.shadow.camera.bottom = -10;
    dirLight.shadow.bias = -0.001;
    scene.add(dirLight);
    lightsRef.current.directional = dirLight;

    // Soft Moonlight/Sun glow point light above the waterfall cliff edge
    const pointLight = new THREE.PointLight(
      isDark ? 0xa6f3e0 : 0xffd27f, 
      isDark ? 1.2 : 0.8,
      8
    );
    pointLight.position.set(0, 2.5, -3.2);
    scene.add(pointLight);
    lightsRef.current.moonGlow = pointLight;


    // --- 10. REAL-TIME MIST EFFECTS ---
    let mistSystem: THREE.Points | undefined;
    if (highQuality) {
      const mistCount = 20;
      const mistGeo = new THREE.BufferGeometry();
      const mistPositions = new Float32Array(mistCount * 3);
      
      for (let i = 0; i < mistCount; i++) {
        mistPositions[i * 3] = (Math.random() - 0.5) * 8;
        mistPositions[i * 3 + 1] = -0.1 + Math.random() * 0.4; // near waterfall base splash pool
        mistPositions[i * 3 + 2] = -3.2 + (Math.random() - 0.5) * 1.5;
      }
      
      mistGeo.setAttribute('position', new THREE.BufferAttribute(mistPositions, 3));
      
      const mistMaterial = new THREE.PointsMaterial({
        color: isDark ? 0x3d6e5a : 0xebf2f1,
        size: 2.2,
        transparent: true,
        opacity: isDark ? 0.12 : 0.22,
        depthWrite: false
      });
      
      mistSystem = new THREE.Points(mistGeo, mistMaterial);
      scene.add(mistSystem);
      materialsRef.current.mistParticles = mistSystem;
    }


    // --- 11. RENDERING ANIMATION LOOP ---
    const startTime = performance.now();
    let animationFrameId: number;

    const tick = () => {
      const elapsedTime = (performance.now() - startTime) / 1000;

      // Slow dynamic camera rotation if enabled
      if (isRotating) {
        const speed = 0.04;
        camera.position.x = Math.sin(elapsedTime * speed) * 3.5;
        camera.position.z = 10 + Math.cos(elapsedTime * speed) * 2;
        camera.lookAt(0, 0.8, -1.0);
      }

      // Wind movement: sway forests & tree foliage
      const windForce = Math.sin(elapsedTime * 1.5) * 0.04;
      const windSubForce = Math.cos(elapsedTime * 2.2) * 0.015;
      
      treeMeshes.forEach((tree, idx) => {
        const foliage = tree.getObjectByName("foliage");
        if (foliage) {
          // Stagger foliage swaying using index offsets
          foliage.rotation.z = windForce * (0.6 + (idx % 3) * 0.2);
          foliage.rotation.x = windSubForce * (0.5 + (idx % 2) * 0.35);
        }
      });

      // Waterfall simulation logic
      const positionAttr = waterfallSystem.geometry.attributes.position as THREE.BufferAttribute;
      
      for (let i = 0; i < waterfallParticlesCount; i++) {
        const drop = dropsList[i];
        
        // Progress down
        drop.y -= drop.speedY * 0.045;
        drop.x += drop.speedX * 0.03;

        // Apply gravity acceleration
        drop.speedY += 0.08;

        // If water hits rock basin
        if (drop.y <= -0.45) {
          // Trigger rock splash foam particles
          const splashIndex = Math.floor(Math.random() * splashParticlesCount);
          const splash = splashList[splashIndex];
          splash.x = drop.x;
          splash.y = -0.45;
          splash.z = drop.z + (Math.random() - 0.5) * 0.3;
          
          // Random explosive upwards/sideways vector
          splash.vX = (Math.random() - 0.5) * 0.2;
          splash.vY = 0.2 + Math.random() * 0.4;
          splash.vZ = Math.random() * 0.15;
          splash.life = 1.0;

          // Recycle waterfall droplet back to ledger top
          drop.x = (Math.random() - 0.5) * 0.72;
          drop.y = 2.4;
          drop.z = -3.4 + (Math.random() - 0.5) * 0.08;
          drop.speedY = 1.2 + Math.random() * 1.2;
        }

        positionAttr.setXYZ(i, drop.x, drop.y, drop.z);
      }
      positionAttr.needsUpdate = true;

      // Waterfall Splash update loop
      const splashAttr = splashSystem.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < splashParticlesCount; i++) {
        const s = splashList[i];
        if (s.life > 0) {
          // Physics
          s.x += s.vX * 0.15;
          s.y += s.vY * 0.15;
          s.z += s.vZ * 0.15;
          
          // Pull down
          s.vY -= 0.03;
          s.life -= 0.055; // life decr

          splashAttr.setXYZ(i, s.x, s.y, s.z);
        } else {
          // hide
          splashAttr.setXYZ(i, 0, -99, 0);
        }
      }
      splashAttr.needsUpdate = true;


      // Drifting Leaves Simulation
      leavesList.forEach(leaf => {
        leaf.mesh.position.y -= leaf.speedY;
        // Sway movement left to right
        leaf.mesh.position.x += Math.sin(elapsedTime * leaf.swaySpeed + leaf.angle) * 0.012;
        
        // Custom rotations
        leaf.mesh.rotation.x += leaf.rotSpeed.x;
        leaf.mesh.rotation.y += leaf.rotSpeed.y;
        leaf.mesh.rotation.z += leaf.rotSpeed.z;

        // Reset if leaf hits ground or wanders out of frame bounds
        if (leaf.mesh.position.y < -0.6) {
          leaf.mesh.position.y = 3.5 + Math.random() * 4.0;
          leaf.mesh.position.x = (Math.random() - 0.5) * 14;
          leaf.mesh.position.z = -6 + Math.random() * 8;
        }
      });


      // Bioluminescent Flying Fireflies
      firefliesList.forEach(f => {
        // Organic floating animation using sine wave combinations
        const t = elapsedTime * f.speed + f.noiseOffset;
        f.mesh.position.x = f.baseX + Math.sin(t * 0.8) * 0.85;
        f.mesh.position.y = f.baseY + Math.cos(t * 1.1) * 0.45;
        f.mesh.position.z = f.baseZ + Math.sin(t * 0.5) * 0.5;

        // Subtle scale pulses reflecting biological breathing
        const scaleVal = 0.8 + Math.sin(t * 2.0) * 0.25;
        f.mesh.scale.set(scaleVal, scaleVal, scaleVal);
      });

      // Slowly shift mist clouds
      if (mistSystem) {
        mistSystem.rotation.y = elapsedTime * 0.015;
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    // --- RESPONSIVE ADJUSTMENTS ---
    const handleResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 550;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // CLEANUP
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      scene.clear();
    };
  }, [highQuality, isDarkMode]);


  // Dynamic update when ONLY DarkMode/Theme toggles (without full rebuild)
  useEffect(() => {
    const isDark = isDarkMode;
    // Ambient Atmosphere Light update
    const lights = lightsRef.current;
    if (lights.ambient) {
      lights.ambient.color.setHex(isDark ? 0x0c1524 : 0xdfede4);
      lights.ambient.intensity = isDark ? 0.6 : 0.85;
    }
    if (lights.directional) {
      lights.directional.color.setHex(isDark ? 0x2244bb : 0xfff6dd);
      lights.directional.intensity = isDark ? 0.8 : 1.4;
    }
    if (lights.moonGlow) {
      lights.moonGlow.color.setHex(isDark ? 0xa6f3e0 : 0xffd27f);
      lights.moonGlow.intensity = isDark ? 1.2 : 0.8;
    }

    // Material color changes
    const mats = materialsRef.current;
    if (mats.groundMat) {
      mats.groundMat.color.setHex(isDark ? 0x051a0d : 0x3d6634);
    }
    if (mats.mountainMat) {
      mats.mountainMat.color.setHex(isDark ? 0x081310 : 0x5a7065);
    }
    if (mats.foliageMats) {
      const colors = isDark 
        ? [0x0c2718, 0x081e12, 0x143c22, 0x071b0f] 
        : [0x2d5a27, 0x1e3f1a, 0x3e7537, 0x35602e];
      mats.foliageMats.forEach((mat, i) => {
        mat.color.setHex(colors[i % colors.length]);
      });
    }
    if (mats.mistParticles) {
      const mistMat = mats.mistParticles.material as THREE.PointsMaterial;
      if (mistMat) {
        mistMat.color.setHex(isDark ? 0x3d6e5a : 0xebf2f1);
        mistMat.opacity = isDark ? 0.12 : 0.22;
      }
    }
  }, [isDarkMode]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full z-0 overflow-hidden select-none"
      id="forest-3d-scene"
    >
      {/* Background Gradient matching current theme perfectly */}
      <div className={`absolute inset-0 transition-all duration-700 bg-gradient-to-b ${
        isDarkMode 
          ? 'from-[#030a08] via-[#051410] to-stone-900' 
          : 'from-[#ebf2f1]/80 via-[#f5f8f6] to-beige-50'
      }`} />

      {/* The canvas target object */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block relative z-10 select-none pointer-events-none" 
      />

      {/* Interactive dashboard overlay control widget */}
      <div className="absolute right-5 bottom-5 z-20 flex gap-2 items-center pointer-events-auto bg-white/70 dark:bg-stone-900/80 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-forest-800/10 dark:border-white/10 shadow-lg text-[10px] sm:text-xs">
        
        {/* Quality preset slider button */}
        <button
          onClick={() => setHighQuality(!highQuality)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border font-mono transition duration-200 cursor-pointer ${
            highQuality 
              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-800 dark:text-emerald-300' 
              : 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-500'
          }`}
          title="Toggle high particle count & realistic dynamic mist"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{highQuality ? 'High Performance 3D' : 'Eco Mode 3D'}</span>
        </button>

        {/* Rotate toggle */}
        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`p-1.5 rounded-lg border transition duration-200 cursor-pointer ${
            isRotating 
              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-800 dark:text-emerald-300' 
              : 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-500'
          }`}
          title="Toggle camera panoramic panning"
        >
          {isRotating ? (
            <Play className="w-3.5 h-3.5 fill-current" />
          ) : (
            <Pause className="w-3.5 h-3.5" />
          )}
        </button>

        <button
          onClick={toggleWaterfallSound}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border font-mono transition-all duration-300 cursor-pointer ${
            isSoundOn 
              ? 'bg-blue-500/15 border-blue-500 text-blue-800 dark:text-blue-300 shadow-md shadow-blue-500/10 animate-pulse' 
              : 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-500 hover:bg-stone-200 hover:text-stone-700 dark:hover:bg-stone-700 dark:hover:text-stone-300'
          }`}
          title="Toggle peaceful procedural waterfall sound effect"
        >
          {isSoundOn ? (
            <Volume2 className="w-3.5 h-3.5 text-blue-500" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-stone-400" />
          )}
          <span>{isSoundOn ? 'Waterfall Audio: On' : 'Waterfall Audio: Off'}</span>
        </button>
      </div>

      {/* Overlay decorative tree outlines pointing upwards along sides to reinforce height */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-beige-50 dark:from-stone-950 via-beige-50/10 dark:via-stone-950/10 to-transparent pointer-events-none z-10" />
    </div>
  );
}
