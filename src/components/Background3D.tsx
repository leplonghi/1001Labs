import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const vertexShader = `
  varying vec2 vUv;
  varying float vDisplacement;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uScroll;

  // GLSL Noise function
  float hash(float n) { return fract(sin(n) * 43758.5453123); }
  float noise(vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);
    float n = p.x + p.y*57.0 + 113.0*p.z;
    return mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
                   mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y),
               mix(mix( hash(n+113.0), hash(n+114.0),f.x),
                   mix( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z);
  }

  void main() {
    vUv = uv;
    
    vec3 pos = position;
    float distFromCenter = length(pos.xy);
    float centerCleanFactor = smoothstep(2.0, 60.0, distFromCenter);
    
    // Scroll tilt effect
    float scrollTilt = uScroll * 15.0;
    pos.z += sin(pos.y * 0.05 + uScroll * 5.0) * 10.0;

    float distFromMouse = length(pos.xy - uMouse * 80.0);
    float mousePush = exp(-distFromMouse * 0.12) * 12.0;

    float n1 = noise(vec3(pos.xy * 0.03, uTime * 0.5)) * 16.0;
    float n2 = noise(vec3(pos.xy * 0.08, uTime * 0.8)) * 8.0;
    float liquid = sin(pos.x * 0.05 + uTime * 1.2) * cos(pos.y * 0.05 + uTime * 1.2) * 6.0;
    float secondary = sin(pos.x * 0.1 - uTime * 0.4) * 2.0;
    float displacement = (n1 + n2 + liquid + secondary) * centerCleanFactor + mousePush;
    
    vDisplacement = displacement;
    pos.z += displacement;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying float vDisplacement;
  uniform vec3 uColorCyan;
  uniform vec3 uColorMagenta;
  uniform vec3 uColorIndigo;
  
  void main() {
    float height = vDisplacement / 12.0;
    vec3 color = vec3(0.0005); // Even darker base
    
    if (height > 0.01) {
      float mixFactor = smoothstep(0.01, 1.2, height);
      // More subtle, deeper colors
      vec3 accent = mix(uColorMagenta * 0.3, uColorCyan * 0.3, vUv.x);
      color = mix(color, accent, mixFactor * 0.4);
    }
    
    // Smooth edge fade - very tight
    float edgeFade = smoothstep(0.5, 0.05, abs(vUv.x - 0.5)) * smoothstep(0.5, 0.05, abs(vUv.y - 0.5));
    
    float dist = length(vUv - 0.5);
    color = mix(color, uColorIndigo * 0.05, smoothstep(0.0, 1.0, dist));
    
    gl_FragColor = vec4(color, edgeFade * 0.8);
  }
`;

export default function Background3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.04);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 1. Shader-based Topographic Mesh (Huge to hide edges)
    const geometry = new THREE.PlaneGeometry(600, 600, 250, 250);
    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uScroll: { value: 0 },
        uColorCyan: { value: new THREE.Color(0x00ffff) },
        uColorMagenta: { value: new THREE.Color(0xff00ff) },
        uColorIndigo: { value: new THREE.Color(0x4b0082) }
      },
      vertexShader,
      fragmentShader,
      wireframe: true,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false, // Better for overlapping transparent objects
      blending: THREE.AdditiveBlending
    });

    const mesh = new THREE.Mesh(geometry, shaderMaterial);
    mesh.rotation.x = -Math.PI / 2.5;
    mesh.position.y = -10;
    scene.add(mesh);

    // Mirrored top mesh for "infinite digital valley" immersion
    const topMesh = mesh.clone();
    topMesh.rotation.x = Math.PI / 2.5;
    topMesh.position.y = 20;
    scene.add(topMesh);

    // 2. High-Density Galactic Particle System
    const particlesCount = 8000;
    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particlesCount * 3);
    for(let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 600; // Much wider field
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.03,
      color: 0x4f46e5,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // 3. Dynamic Ambient Environment
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    const lights: THREE.PointLight[] = [
      new THREE.PointLight(0x00ffff, 8, 80),
      new THREE.PointLight(0xff00ff, 8, 80),
      new THREE.PointLight(0x4b0082, 5, 100)
    ];
    lights.forEach(l => scene.add(l));

    // 4. Cinema Post-Processing
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.5, // Even lower intensity
      0.4, 
      0.9 
    ));

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    const handleScroll = () => {
      scrollRef.current = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    };
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      composer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    camera.position.set(0, 8, 20);
    camera.lookAt(0, 0, 0);

    const clock = new THREE.Clock();

    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const time = clock.getElapsedTime(); 
      const slowTime = time * 0.5;
      
      shaderMaterial.uniforms.uTime.value = time;
      shaderMaterial.uniforms.uScroll.value = scrollRef.current;
      shaderMaterial.uniforms.uMouse.value.lerp(new THREE.Vector2(mouseRef.current.x, mouseRef.current.y), 0.05);

      const mX = mouseRef.current.x * 25;
      const mY = mouseRef.current.y * 25;

      // Pulse lights with rhythmic movement
      lights[0].position.set(Math.sin(slowTime) * 40 + mX, 10 + Math.cos(time) * 5, Math.cos(slowTime) * 40);
      lights[1].position.set(Math.cos(slowTime * 0.8) * 50, 15 + mY, Math.sin(slowTime * 0.8) * 50 - mX);
      lights[2].position.set(mX * 0.5, 5, Math.sin(slowTime * 0.5) * 60);

      mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, mouseRef.current.x * 0.15 + Math.sin(slowTime * 0.15) * 0.03, 0.02);
      mesh.rotation.z = Math.cos(slowTime * 0.08) * 0.015;
      topMesh.rotation.y = mesh.rotation.y;
      topMesh.rotation.z = -mesh.rotation.z;

      particlesMesh.rotation.y = time * 0.01 + mouseRef.current.x * 0.1;
      particlesMesh.rotation.z = scrollRef.current * 0.2 + Math.sin(slowTime * 0.05) * 0.05;

      // Silky smooth camera with higher inertia
      const targetCamX = mouseRef.current.x * 10 + Math.sin(slowTime * 0.25) * 1.5;
      const targetCamY = 12 + scrollRef.current * 15 + Math.cos(slowTime * 0.35) * 1.2;
      
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamX, 0.02);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamY, 0.02);
      
      const targetAim = new THREE.Vector3(
        mouseRef.current.x * 6 + Math.sin(slowTime * 0.15) * 2, 
        -8 + scrollRef.current * 10 + Math.cos(slowTime * 0.25) * 1.5, 
        0
      );
      camera.lookAt(targetAim);

      composer.render();
    };

    animate();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      shaderMaterial.dispose();
      geometry.dispose();
      if (containerRef.current) containerRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 -z-10 bg-black pointer-events-none" />;
}

