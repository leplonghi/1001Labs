import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { SAOPass } from 'three/examples/jsm/postprocessing/SAOPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';

const vertexShader = `
  varying vec2 vUv;
  varying float vDisplacement;
  varying float vMouseProximity;
  varying float vTopHover;
  uniform float uTime;
  uniform vec3 uMouseWorld;
  uniform vec3 uTopHoverPos;
  uniform float uTopHover;
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
    
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    // Smoothly mask the center area
    float distFromCenter = length(worldPos.xyz);
    float centerCleanFactor = smoothstep(1.0, 50.0, distFromCenter);
    
    // Mouse interaction based on World position
    float distFromMouse = length(worldPos.xyz - uMouseWorld);
    
    // Disable mouse interaction for the top mesh (sky) as requested
    float interactionScale = worldPos.y > 5.0 ? 0.0 : 1.0;
    
    float mousePush = exp(-distFromMouse * 0.1) * 8.0 * interactionScale;
    
    // Immersive time: progress faster when scrolling
    float speedTime = uTime + uScroll * 8.0;
    
    // Smooth liquid ripple effect propagating from mouse
    float ripple = sin(distFromMouse * 0.8 - speedTime * 3.0) * exp(-distFromMouse * 0.15) * 4.0 * interactionScale;

    float n1 = noise(vec3(worldPos.xy * 0.015, speedTime * 0.25)) * 14.0;
    float n2 = noise(vec3(worldPos.xy * 0.05, speedTime * 0.45)) * 7.0;
    float liquid = sin(worldPos.x * 0.03 + speedTime * 0.7) * cos(worldPos.y * 0.03 + speedTime * 0.7) * 5.0;
    float displacement = (n1 + n2 + liquid + ripple) * centerCleanFactor + mousePush;
    
    // Evaluate top mesh hover effect
    float isTopMesh = worldPos.y > 5.0 ? 1.0 : 0.0;
    float distToTopHover = length(worldPos.xyz - uTopHoverPos);
    float topHoverEffect = exp(-distToTopHover * 0.15) * uTopHover * isTopMesh;
    vTopHover = topHoverEffect;
    
    // Add custom top mesh displacement
    float topDisplacement = sin(distToTopHover * 3.0 - speedTime * 12.0) * topHoverEffect * 8.0;
    displacement += topDisplacement;
    
    vDisplacement = displacement;
    vMouseProximity = exp(-distFromMouse * 0.08) * interactionScale;
    
    vec3 pos = position;
    pos.z += displacement;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying float vDisplacement;
  varying float vMouseProximity;
  varying float vTopHover;
  uniform vec3 uColorCyan;
  uniform vec3 uColorMagenta;
  uniform vec3 uColorIndigo;
  
  void main() {
    float height = vDisplacement / 12.0;
    vec3 color = vec3(0.04); // Reduced from 0.12 for a more subtle base
    
    // Always show some activity even with low displacement
    float activity = smoothstep(-1.0, 1.0, height);
    vec3 baseAccent = mix(uColorIndigo * 0.05, uColorMagenta * 0.1, vUv.y);
    color += baseAccent * activity;

    if (height > 0.01) {
      float mixFactor = smoothstep(0.01, 1.2, height);
      // More balanced colors
      vec3 accent = mix(uColorMagenta * 0.7, uColorCyan * 0.7, vUv.x);
      color = mix(color, accent, mixFactor * 0.5);
    }
    
    // Add Mouse Glow and brighten lines based on proximity
    vec3 glowColor = mix(uColorMagenta, uColorCyan, vUv.y);
    color += glowColor * (vMouseProximity * 1.5); // Slightly reduced interaction intensity (from 2.0)
    
    // Explicit top mesh hover color shift (vibrant golden/orange pulse)
    vec3 topHoverShift = vec3(1.1, 0.65, 0.15);
    color += topHoverShift * vTopHover * 1.2; // Reduced from 1.5
    
    // Smooth edge fade - tighter for focus
    float edgeFade = smoothstep(0.5, 0.15, abs(vUv.x - 0.5)) * smoothstep(0.5, 0.15, abs(vUv.y - 0.5));
    
    float dist = length(vUv - 0.5);
    color = mix(color, uColorIndigo * 0.05, smoothstep(0.0, 1.0, dist));
    
    // Cinematic Vignette
    float vignette = 1.0 - smoothstep(0.35, 0.75, dist);
    color *= vignette;
    
    gl_FragColor = vec4(color, edgeFade * 0.9);
  }
`;

export default function Background3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    // Background is transparent to show the video behind
    scene.fog = new THREE.FogExp2(0x000000, 0.012); // Increased fog density for better depth and subtle look (from 0.005)

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    
    renderer.setClearColor(0x000000, 0); // Explicitly set transparent clear color
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    let bgPlane: THREE.Mesh | null = null;
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/bg.png', (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      const bgGeo = new THREE.PlaneGeometry(1, 1);
      const bgMat = new THREE.MeshBasicMaterial({ 
        map: texture, 
        transparent: true, 
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false // Background plane should not be obscured by fog
      });
      bgPlane = new THREE.Mesh(bgGeo, bgMat);
      bgPlane.position.z = -500;
      scene.add(bgPlane);
      
      // Trigger resize to scale the background initially
      handleResize();
    });

    // 1. Shader-based Topographic Mesh (Huge to hide edges)
    const geometry = new THREE.PlaneGeometry(600, 600, 250, 250);
    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouseWorld: { value: new THREE.Vector3(0, 0, 0) },
        uTopHoverPos: { value: new THREE.Vector3(0, 0, 0) },
        uTopHover: { value: 0 },
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
      depthWrite: true, // Enable depth for SAOPass/AO
      blending: THREE.AdditiveBlending
    });

    const mesh = new THREE.Mesh(geometry, shaderMaterial);
    mesh.rotation.x = -Math.PI / 2.5;
    mesh.position.y = -10;
    scene.add(mesh);

    // Mirrored top mesh - now uses the SAME material but shader handles world pos
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
      size: 0.04, // Slightly larger
      color: 0x4f46e5,
      transparent: true,
      opacity: 0.35, // Increased from 0.15
      blending: THREE.AdditiveBlending
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // 2.2 Subtle Nebula Flow Particle System
    const nebulaCount = 1500;
    const nebulaGeometry = new THREE.BufferGeometry();
    const nebulaPosArray = new Float32Array(nebulaCount * 3);
    const nebulaColors = new Float32Array(nebulaCount * 3);
    const nebulaSizes = new Float32Array(nebulaCount);
    
    // Store varying speeds for each particle
    const nebulaSpeeds = new Float32Array(nebulaCount);
    const nebulaSwirls = new Float32Array(nebulaCount);
    
    for(let i = 0; i < nebulaCount; i++) {
        nebulaPosArray[i*3] = (Math.random() - 0.5) * 800; // Wide horizontal spread
        nebulaPosArray[i*3+1] = (Math.random() - 0.5) * 500; // Vertical spread
        nebulaPosArray[i*3+2] = (Math.random() - 0.5) * 600 - 100; // Deeper Z spread
        
        // Deeper blues and purples
        nebulaColors[i*3] = 0.1 + Math.random() * 0.25; // R (Darker red/purple)
        nebulaColors[i*3+1] = 0.02 + Math.random() * 0.1; // G (Very little green)
        nebulaColors[i*3+2] = 0.5 + Math.random() * 0.5; // B (Strong deep blue to violet)

        // Varied sizes for depth
        nebulaSizes[i] = 1.0 + Math.random() * 7.0;

        // Dynamics variation
        nebulaSpeeds[i] = 0.1 + Math.random() * 0.8;
        nebulaSwirls[i] = (Math.random() - 0.5) * 0.2;
    }
    
    nebulaGeometry.setAttribute('position', new THREE.BufferAttribute(nebulaPosArray, 3));
    nebulaGeometry.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3));
    nebulaGeometry.setAttribute('size', new THREE.BufferAttribute(nebulaSizes, 1));
    
    // Custom ShaderMaterial to support individual sizes smoothly
    const nebulaMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          // Size attenuation
          gl_PointSize = size * (400.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          // Soft circular particle with glow
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          float alpha = smoothstep(0.5, 0.1, dist) * 0.5; // Increased from 0.3
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    const nebulaMesh = new THREE.Points(nebulaGeometry, nebulaMaterial);
    scene.add(nebulaMesh);

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

    // Ambient Occlusion for depth and realism
    const saoPass = new SAOPass(scene, camera, new THREE.Vector2(window.innerWidth, window.innerHeight));
    saoPass.params.saoIntensity = 0.08; // slightly increased
    saoPass.params.saoScale = 12;
    saoPass.params.saoKernelRadius = 30;
    saoPass.params.saoMinResolution = 0;
    saoPass.params.saoBlur = true;
    composer.addPass(saoPass);

    composer.addPass(new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.4, // Reduced bloom intensity from 1.0
      0.3, // Smoother radius
      0.9  // Higher threshold to only bloom the brightest areas
    ));

    // Depth of Field was causing too much blur - disabled as requested
    /*
    const bokehPass = new BokehPass(scene, camera, {
      focus: 30.0,
      aperture: 0.025,
      maxblur: 0.015
    });
    composer.addPass(bokehPass);
    */

    // Film grain and scanlines for that classic texture
    const filmPass = new FilmPass(0.15, false);
    composer.addPass(filmPass);

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
      
      const aspect = width / height;
      camera.aspect = aspect;
      
      // Adapt FOV based on aspect ratio to maintain visual integrity across devices
      // On narrow screens (mobile), widen the FOV so the scene doesn't look zoomed in
      camera.fov = aspect < 1 ? 75 + (1 - aspect) * 35 : 75;
      
      camera.updateProjectionMatrix();
      
      // Keep background plane covering the camera view
      if (bgPlane) {
        const dist = camera.position.z - bgPlane.position.z;
        const visibleHeight = 2 * Math.tan((camera.fov * Math.PI) / 360) * dist;
        bgPlane.scale.set(visibleHeight * aspect * 1.5, visibleHeight * 1.5, 1);
      }

      renderer.setSize(width, height);
      composer.setSize(width, height);
      
      // Optionally update passes for aspect ratio
      saoPass.resolution.set(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let topHoverStrength = 0;

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
      
      // Calculate world mouse position on a virtual plane
      const mX = mouseRef.current.x * 60;
      const mY = mouseRef.current.y * 50;
      const targetMouseWorld = new THREE.Vector3(mX, mY, -20);
      shaderMaterial.uniforms.uMouseWorld.value.lerp(targetMouseWorld, 0.05);

      // Raycast top mesh for direct hover effects
      pointer.set(mouseRef.current.x, mouseRef.current.y);
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObject(topMesh);
      
      if (intersects.length > 0) {
        topHoverStrength = THREE.MathUtils.lerp(topHoverStrength, 1.0, 0.15);
        shaderMaterial.uniforms.uTopHoverPos.value.lerp(intersects[0].point, 0.2);
      } else {
        topHoverStrength = THREE.MathUtils.lerp(topHoverStrength, 0.0, 0.05);
      }
      shaderMaterial.uniforms.uTopHover.value = topHoverStrength;

      const lightX = mouseRef.current.x * 25;
      const lightY = mouseRef.current.y * 25;

      // Pulse lights with rhythmic movement
      lights[0].position.set(Math.sin(slowTime) * 40 + lightX, 10 + Math.cos(time) * 5, Math.cos(slowTime) * 40);
      lights[1].position.set(Math.cos(slowTime * 0.8) * 50, 15 + lightY, Math.sin(slowTime * 0.8) * 50 - lightX);
      lights[2].position.set(lightX * 0.5, 5, Math.sin(slowTime * 0.5) * 60);

      mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, mouseRef.current.x * 0.08 + Math.sin(slowTime * 0.1) * 0.02, 0.02);
      mesh.rotation.z = Math.cos(slowTime * 0.05) * 0.01;
      // Cinematic mesh floating
      mesh.position.y = -10 + Math.sin(slowTime * 0.15) * 2.0;
      
      topMesh.rotation.y = mesh.rotation.y;
      topMesh.rotation.z = -mesh.rotation.z;
      topMesh.position.y = 20 - Math.sin(slowTime * 0.15) * 2.0;

      particlesMesh.rotation.y = time * 0.008 + mouseRef.current.x * 0.05;
      particlesMesh.rotation.z = scrollRef.current * 0.1 + Math.sin(slowTime * 0.03) * 0.03;
      
      // Gently pulsate galactic particles brightness
      particlesMaterial.opacity = 0.35 + Math.sin(time * 0.5) * 0.1;

      nebulaMesh.rotation.y = time * 0.005;
      nebulaMesh.position.y = Math.sin(time * 0.1) * 20;
      nebulaMesh.position.x = Math.cos(time * 0.08) * 15;
      
      nebulaMaterial.uniforms.uTime.value = time;
      
      // Introduce subtle swirling and forward motion to nebula particles for hyperspace feel
      const nebulaPositions = nebulaGeometry.attributes.position.array as Float32Array;
      for(let i = 0; i < nebulaCount; i++) {
        const i3 = i * 3;
        
        const swirl = nebulaSwirls[i];
        const speed = nebulaSpeeds[i];
        
        // Swirling motion based on unique swirl speed
        nebulaPositions[i3] += Math.sin(time * swirl * 2.0 + i) * 0.02 * speed;
        nebulaPositions[i3 + 1] += Math.cos(time * swirl * 2.0 + i) * 0.02 * speed;
        
        // Move towards camera with unique speed
        nebulaPositions[i3 + 2] += speed * (1.0 + scrollRef.current * 5.0); 
        
        if (nebulaPositions[i3 + 2] > 200) {
          nebulaPositions[i3 + 2] = -600; // Reset deep back
        }
      }
      nebulaGeometry.attributes.position.needsUpdate = true;

      // Make galactic particles also fly towards camera
      const posArray = particlesGeometry.attributes.position.array as Float32Array;
      for(let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        posArray[i3 + 2] += 0.2 + scrollRef.current * 1.5;
        if (posArray[i3 + 2] > 300) {
          posArray[i3 + 2] = -300;
        }
      }
      particlesGeometry.attributes.position.needsUpdate = true;

      // Cinematic expansive camera with immersive deep inertia and roll
      const targetCamX = mouseRef.current.x * 25 + Math.sin(slowTime * 0.15) * 6.0;
      const targetCamY = 8 + scrollRef.current * 30 + Math.cos(slowTime * 0.25) * 5.0;
      const targetCamZ = 20 - scrollRef.current * 50 - Math.abs(mouseRef.current.x) * 10.0;
      
      // Ultra-smooth inertia
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamX, 0.012);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamY, 0.012);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCamZ, 0.012);
      
      // Dynamic camera roll (banking) based on mouse X for flying sensation
      const targetUpX = -mouseRef.current.x * 0.15;
      camera.up.set(targetUpX, 1, 0).normalize();
      
      if (bgPlane && window.innerWidth < 768) {
        bgPlane.position.x = Math.sin(slowTime * 0.2) * 50;
        bgPlane.position.y = Math.cos(slowTime * 0.15) * 30;
      } else if (bgPlane) {
        // Reset to center on desktop
        bgPlane.position.x = 0;
        bgPlane.position.y = 0;
      }
      
      // More dynamic target aim that follows mouse and scroll with varied offsets
      const targetAim = new THREE.Vector3(
        mouseRef.current.x * 12 + Math.sin(slowTime * 0.15) * 4.0, 
        -15 + scrollRef.current * 35 + Math.cos(slowTime * 0.25) * 3.0, 
        Math.sin(slowTime * 0.1) * 8.0 - scrollRef.current * 20.0 
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
      nebulaGeometry.dispose();
      nebulaMaterial.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      if (containerRef.current) containerRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 -z-10 bg-black pointer-events-none" />
  );
}

