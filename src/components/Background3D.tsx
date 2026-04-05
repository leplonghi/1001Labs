import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { SAOPass } from 'three/examples/jsm/postprocessing/SAOPass.js';

export default function Background3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);
  const hoverZoomRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.08); // Subtle black fog for depth
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 1. Main Mesh/Grid - Increased size for desktop/ultra-wide coverage
    const planeSize = 60;
    const geometry = new THREE.PlaneGeometry(planeSize, planeSize, 160, 160);
    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.15, // Subtle background mesh
      emissive: 0x444444,
      emissiveIntensity: 0.5,
      vertexColors: true,
    });

    // Add vertex colors to the grid for a rainbow effect
    const count = geometry.attributes.position.count;
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const x = geometry.attributes.position.getX(i);
      color.setHSL((x + planeSize / 2) / planeSize, 0.7, 0.5);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2.5;
    scene.add(mesh);

    // 2. Glowing Nodes (Points)
    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.1,
      transparent: true,
      opacity: 0.15, // Subtle glowing nodes
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0x88ccff, // Complementary soft blue tint to enhance the "light" feel
    });
    const points = new THREE.Points(geometry, pointsMaterial);
    points.rotation.x = -Math.PI / 2.5;
    scene.add(points);

    // Track sparkle state for nodes
    const sparkleArray = new Float32Array(count);
    for (let i = 0; i < count; i++) sparkleArray[i] = Math.random();

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 5, 30);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // 5. Post-Processing
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // SAO (Ambient Occlusion)
    const saoPass = new SAOPass(scene, camera);
    saoPass.params.saoIntensity = 0.02;
    saoPass.params.saoScale = 10;
    saoPass.params.saoKernelRadius = 20;
    composer.addPass(saoPass);

    // Bloom
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5, // strength
      0.4, // radius
      0.85 // threshold
    );
    composer.addPass(bloomPass);

    camera.position.z = 6;
    camera.position.y = 2;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const mousePos3D = new THREE.Vector3(); // Cache for performance
    let isHovering = false;

    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
      mouse.x = mouseRef.current.x;
      mouse.y = mouseRef.current.y;
    };

    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      scrollRef.current = scrollPercent;
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

    const animate = () => {
      requestAnimationFrame(animate);

      const time = Date.now() * 0.001;
      
      // Update Grid
      const positions = geometry.attributes.position.array as Float32Array;
      const colors = geometry.attributes.color.array as Float32Array;
      const pulse = Math.sin(time * 0.5) * 0.1; // Gentle global height pulse
      material.emissiveIntensity = 0.4 + Math.sin(time * 0.8) * 0.2; // Pulsing light effect

      // Subtle breathing scale and rotation sway for the mesh
      mesh.scale.setScalar(1 + Math.sin(time * 0.3) * 0.02);
      mesh.rotation.z += 0.0005 + scrollRef.current * 0.002;
      mesh.rotation.y = Math.sin(time * 0.2) * 0.05;
      
      // Sync points with mesh and add pulsing "emissive" effect
      points.scale.copy(mesh.scale);
      points.rotation.copy(mesh.rotation);
      
      const nodePulse = Math.sin(time * 1.5) * 0.5 + 0.5;
      pointsMaterial.opacity = 0.1 + nodePulse * 0.2;
      pointsMaterial.size = 0.07 + nodePulse * 0.06;

      const colorObj = new THREE.Color();

      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        const vertexIdx = i / 3;
        
        // Base waves - layered for organic feel (more fluid)
        const wave1 = Math.sin(x * 0.3 + time * 0.8 + scrollRef.current * 4) * 0.35;
        const wave2 = Math.cos(y * 0.25 - time * 0.6) * 0.25;
        const swell = Math.sin(x * 0.08 + y * 0.08 + time * 0.3) * 0.5; // Large slow swell
        
        // Secondary subtle noise wave
        const noiseWave = Math.sin(x * 0.7 - time * 0.4) * Math.cos(y * 0.7 + time * 0.2) * 0.18;
        
        // Mouse interaction (ripple and distortion)
        const mouseX = mouseRef.current.x * (planeSize / 3);
        const mouseY = mouseRef.current.y * (planeSize / 3);
        const dist = Math.sqrt(Math.pow(x - mouseX, 2) + Math.pow(y - mouseY, 2));
        
        // Ripple effect centered on mouse
        const ripple = Math.sin(dist * 2 - time * 5) * Math.max(0, 1 - dist / 5) * 0.4;
        
        // Static mouse push/pull
        const mouseEffect = Math.max(0, 1 - dist / 4) * 0.5;
        
        positions[i + 2] = wave1 + wave2 + swell + noiseWave + ripple + mouseEffect + pulse;

        // Subtle color shift based on height and time
        const colorIdx = i;
        const heightFactor = (positions[i + 2] + 1) / 2;
        
        // Random sparkle logic for nodes (made less frequent)
        if (Math.random() > 0.9997) sparkleArray[vertexIdx] = 1.0;
        sparkleArray[vertexIdx] *= 0.94; // Fade out slightly faster
        const sparkle = sparkleArray[vertexIdx] * 0.5;

        colorObj.setHSL(((x + planeSize / 2) / planeSize + time * 0.04) % 1, 0.7, 0.35 + heightFactor * 0.25 + sparkle);
        colors[colorIdx] = colorObj.r;
        colors[colorIdx + 1] = colorObj.g;
        colors[colorIdx + 2] = colorObj.b;
      }
      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.color.needsUpdate = true;

      // Raycasting for hover zoom
      raycaster.setFromCamera(mouse, camera);
      
      // Smooth camera movement (Scroll + Hover Zoom)
      const targetY = 2 + scrollRef.current * 2;
      const targetZ = 6 - scrollRef.current * 2 + hoverZoomRef.current;
      
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);

      composer.render();
    };

    animate();

    return () => {
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
