import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// Simple Perlin-like noise function for organic movement
const noise = (x: number, y: number, t: number) => {
  return (
    Math.sin(x * 0.2 + t * 0.5) * Math.cos(y * 0.2 + t * 0.3) * 0.5 +
    Math.sin(x * 0.5 - t * 0.2) * Math.sin(y * 0.4 + t * 0.4) * 0.25 +
    Math.cos(x * 0.1 + y * 0.1 + t * 0.1) * 0.8
  );
};

export default function Background3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.05);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 1. Premium Topographic Mesh
    const planeSize = 80;
    const segments = 120;
    const geometry = new THREE.PlaneGeometry(planeSize, planeSize, segments, segments);
    
    const material = new THREE.MeshStandardMaterial({
      color: 0x000000,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0x000000,
      vertexColors: true,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2.2;
    mesh.position.y = -2;
    scene.add(mesh);

    // 2. Sophisticated Lighting System
    const ambientLight = new THREE.AmbientLight(0x000000, 0);
    scene.add(ambientLight);

    // Dynamic accent lights
    const light1 = new THREE.PointLight(0x00ffff, 15, 40); // Cyan
    const light2 = new THREE.PointLight(0x0066ff, 12, 50); // Electric Blue
    const light3 = new THREE.PointLight(0x4b0082, 10, 40); // Subtle Violet
    
    scene.add(light1, light2, light3);

    // 3. Post-Processing for Atmosphere
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.8, // subtle strength
      0.5, // radius
      0.9  // high threshold to only catch peaks
    );
    composer.addPass(bloomPass);

    camera.position.set(0, 4, 12);
    camera.lookAt(0, 0, 0);

    // Vertex attribute references
    const positions = geometry.attributes.position;
    const colors = new Float32Array(positions.count * 3);
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handleScroll = () => {
      scrollRef.current = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    const colorCyan = new THREE.Color(0x00ffff);
    const colorBlue = new THREE.Color(0x0044ff);
    const colorViolet = new THREE.Color(0x220044);
    const colorBlack = new THREE.Color(0x000000);

    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const time = Date.now() * 0.0004; // Slow, hypnotic speed
      
      // Update Lights
      light1.position.set(
        Math.sin(time * 0.7) * 20,
        5 + Math.cos(time * 0.5) * 2,
        Math.cos(time * 0.7) * 10
      );
      light2.position.set(
        Math.cos(time * 0.4) * 25,
        4 + Math.sin(time * 0.6) * 3,
        Math.sin(time * 0.4) * 15
      );
      light3.position.set(
        Math.sin(time * 0.3) * 15,
        3,
        Math.cos(time * 0.3) * 20
      );

      // Update Mesh Geometry & Colors
      const posArray = positions.array as Float32Array;
      const colorArray = geometry.attributes.color.array as Float32Array;

      for (let i = 0; i < posArray.length; i += 3) {
        const x = posArray[i];
        const y = posArray[i + 1];
        
        // Radial falloff to keep center clean for text
        const distFromCenter = Math.sqrt(x * x + y * y);
        const centerCleanFactor = THREE.MathUtils.smoothstep(distFromCenter, 5, 25);
        
        // Mouse influence (subtle push)
        const mouseX = mouseRef.current.x * 30;
        const mouseY = mouseRef.current.y * 30;
        const distFromMouse = Math.sqrt(Math.pow(x - mouseX, 2) + Math.pow(y - mouseY, 2));
        const mousePush = Math.exp(-distFromMouse * 0.15) * 0.5;

        // Topographic displacement
        const n = noise(x * 0.15, y * 0.15, time) * 2.5;
        const displacement = n * centerCleanFactor + mousePush;
        
        posArray[i + 2] = displacement;

        // Sophisticated Color Mapping
        const colorIdx = i;
        const height = displacement / 2.5;
        
        // Base color is black, adding accents based on height and position
        let finalColor = colorBlack.clone();
        
        if (height > 0.2) {
          const mixFactor = (height - 0.2) * centerCleanFactor;
          const accentColor = x > 0 ? colorCyan : colorBlue;
          finalColor.lerp(accentColor, mixFactor * 0.4);
        }
        
        if (distFromCenter > 20) {
          finalColor.lerp(colorViolet, (distFromCenter - 20) * 0.01);
        }

        colorArray[colorIdx] = finalColor.r;
        colorArray[colorIdx + 1] = finalColor.g;
        colorArray[colorIdx + 2] = finalColor.b;
      }

      positions.needsUpdate = true;
      geometry.attributes.color.needsUpdate = true;

      // Smooth camera sway
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouseRef.current.x * 2, 0.02);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 4 + scrollRef.current * 3, 0.02);
      camera.lookAt(0, 0, 0);

      composer.render();
    };

    animate();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 -z-10 bg-black pointer-events-none"
      id="bg-3d-canvas"
    />
  );
}

