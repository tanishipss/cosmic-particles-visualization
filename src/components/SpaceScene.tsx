import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const SpaceScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Starfield
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 15000;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      starPositions[i3] = (Math.random() - 0.5) * 800;
      starPositions[i3 + 1] = (Math.random() - 0.5) * 800;
      starPositions[i3 + 2] = (Math.random() - 0.5) * 800;

      const brightness = 0.5 + Math.random() * 0.5;
      starColors[i3] = brightness;
      starColors[i3 + 1] = brightness;
      starColors[i3 + 2] = brightness;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.7,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Galaxy (Spiral)
    const galaxyParams = {
      count: 50000,
      size: 0.01,
      radius: 100,
      branches: 3,
      spin: 1,
      randomness: 0.2,
      randomnessPower: 3,
      insideColor: '#ff6030',
      outsideColor: '#1b3984'
    };

    let galaxyGeometry: THREE.BufferGeometry | null = null;
    let galaxyMaterial: THREE.PointsMaterial | null = null;
    let galaxyPoints: THREE.Points | null = null;

    const generateGalaxy = () => {
      if (galaxyPoints !== null) {
        galaxyGeometry?.dispose();
        galaxyMaterial?.dispose();
        scene.remove(galaxyPoints);
      }

      galaxyGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(galaxyParams.count * 3);
      const colors = new Float32Array(galaxyParams.count * 3);

      const colorInside = new THREE.Color(galaxyParams.insideColor);
      const colorOutside = new THREE.Color(galaxyParams.outsideColor);

      for (let i = 0; i < galaxyParams.count; i++) {
        const i3 = i * 3;

        // Position
        const radius = Math.random() * galaxyParams.radius;
        const spinAngle = radius * galaxyParams.spin;
        const branchAngle = ((i % galaxyParams.branches) / galaxyParams.branches) * Math.PI * 2;

        const randomX = Math.pow(Math.random(), galaxyParams.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * galaxyParams.randomness * radius;
        const randomY = Math.pow(Math.random(), galaxyParams.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * galaxyParams.randomness * radius;
        const randomZ = Math.pow(Math.random(), galaxyParams.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * galaxyParams.randomness * radius;

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

        // Color
        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius / galaxyParams.radius);

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
      }

      galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      galaxyMaterial = new THREE.PointsMaterial({
        size: galaxyParams.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
      });

      galaxyPoints = new THREE.Points(galaxyGeometry, galaxyMaterial);
      scene.add(galaxyPoints);

      // Central Core (Glow)
      const coreGeometry = new THREE.SphereGeometry(2, 32, 32);
      const coreMaterial = new THREE.MeshBasicMaterial({
        color: 0xffccaa,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
      });
      const core = new THREE.Mesh(coreGeometry, coreMaterial);
      scene.add(core);

      // Core Glow
      const glowGeometry = new THREE.SphereGeometry(8, 32, 32);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6600,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      scene.add(glow);
    };

    generateGalaxy();

    // Nebula Particles (Interactive)
    const nebulaCount = 2000;
    const nebulaGeometry = new THREE.BufferGeometry();
    const nebulaPositions = new Float32Array(nebulaCount * 3);
    const nebulaColors = new Float32Array(nebulaCount * 3);
    const nebulaSizes = new Float32Array(nebulaCount);

    for (let i = 0; i < nebulaCount; i++) {
      const i3 = i * 3;
      nebulaPositions[i3] = (Math.random() - 0.5) * 50;
      nebulaPositions[i3 + 1] = (Math.random() - 0.5) * 50;
      nebulaPositions[i3 + 2] = (Math.random() - 0.5) * 50;

      nebulaColors[i3] = Math.random();
      nebulaColors[i3 + 1] = Math.random() * 0.5;
      nebulaColors[i3 + 2] = 0.5 + Math.random() * 0.5;

      nebulaSizes[i] = Math.random() * 2;
    }

    nebulaGeometry.setAttribute('position', new THREE.BufferAttribute(nebulaPositions, 3));
    nebulaGeometry.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3));
    nebulaGeometry.setAttribute('size', new THREE.BufferAttribute(nebulaSizes, 1));

    const nebulaMaterial = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const nebula = new THREE.Points(nebulaGeometry, nebulaMaterial);
    scene.add(nebula);

    // Black Hole
    const blackHoleGroup = new THREE.Group();
    const bhGeometry = new THREE.SphereGeometry(4, 32, 32);
    const bhMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const blackHole = new THREE.Mesh(bhGeometry, bhMaterial);
    blackHoleGroup.add(blackHole);

    // Accretion Disk
    const adGeometry = new THREE.TorusGeometry(8, 0.5, 16, 100);
    const adMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffaa00, 
      transparent: true, 
      opacity: 0.6,
      blending: THREE.AdditiveBlending 
    });
    const accretionDisk = new THREE.Mesh(adGeometry, adMaterial);
    accretionDisk.rotation.x = Math.PI / 2;
    blackHoleGroup.add(accretionDisk);
    scene.add(blackHoleGroup);

    // Planets
    const planets: THREE.Mesh[] = [];
    const planetData = [
      { radius: 1.5, distance: 30, color: 0x4488ff, speed: 0.2 },
      { radius: 2.2, distance: 55, color: 0xff8844, speed: 0.15 },
      { radius: 1.8, distance: 80, color: 0x88ff44, speed: 0.1 },
      { radius: 3.5, distance: 120, color: 0xcc44ff, speed: 0.05 },
    ];

    planetData.forEach(data => {
      const pGeo = new THREE.SphereGeometry(data.radius, 32, 32);
      const pMat = new THREE.MeshPhongMaterial({ color: data.color, shininess: 100 });
      const planet = new THREE.Mesh(pGeo, pMat);
      scene.add(planet);
      planets.push(planet);
    });

    // Asteroid Belt
    const asteroidCount = 3000;
    const asteroidGeometry = new THREE.BufferGeometry();
    const asteroidPositions = new Float32Array(asteroidCount * 3);
    for (let i = 0; i < asteroidCount; i++) {
      const i3 = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const radius = 60 + Math.random() * 15;
      asteroidPositions[i3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 5;
      asteroidPositions[i3 + 1] = (Math.random() - 0.5) * 2;
      asteroidPositions[i3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 5;
    }
    asteroidGeometry.setAttribute('position', new THREE.BufferAttribute(asteroidPositions, 3));
    const asteroidMaterial = new THREE.PointsMaterial({ size: 0.2, color: 0x888888 });
    const asteroids = new THREE.Points(asteroidGeometry, asteroidMaterial);
    scene.add(asteroids);

    // Comets
    const cometCount = 5;
    const comets: { mesh: THREE.Group, speed: number, direction: THREE.Vector3 }[] = [];
    for (let i = 0; i < cometCount; i++) {
      const cometGroup = new THREE.Group();
      const headGeo = new THREE.SphereGeometry(0.5, 8, 8);
      const headMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const head = new THREE.Mesh(headGeo, headMat);
      cometGroup.add(head);

      // Tail
      const tailGeo = new THREE.BufferGeometry();
      const tailPos = new Float32Array(100 * 3);
      for(let j=0; j<100; j++) {
        tailPos[j*3] = 0;
        tailPos[j*3+1] = 0;
        tailPos[j*3+2] = j * 0.1;
      }
      tailGeo.setAttribute('position', new THREE.BufferAttribute(tailPos, 3));
      const tailMat = new THREE.LineBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.5 });
      const tail = new THREE.Line(tailGeo, tailMat);
      cometGroup.add(tail);

      cometGroup.position.set((Math.random()-0.5)*400, (Math.random()-0.5)*400, (Math.random()-0.5)*400);
      scene.add(cometGroup);
      comets.push({ 
        mesh: cometGroup, 
        speed: 0.5 + Math.random(), 
        direction: new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5).normalize() 
      });
    }

    // Interstellar Gas & Dust
    const gasCount = 1000;
    const gasGeometry = new THREE.BufferGeometry();
    const gasPositions = new Float32Array(gasCount * 3);
    const gasColors = new Float32Array(gasCount * 3);
    for (let i = 0; i < gasCount; i++) {
      const i3 = i * 3;
      gasPositions[i3] = (Math.random() - 0.5) * 400;
      gasPositions[i3 + 1] = (Math.random() - 0.5) * 400;
      gasPositions[i3 + 2] = (Math.random() - 0.5) * 400;
      gasColors[i3] = 0.2 + Math.random() * 0.1;
      gasColors[i3 + 1] = 0.1 + Math.random() * 0.1;
      gasColors[i3 + 2] = 0.3 + Math.random() * 0.2;
    }
    gasGeometry.setAttribute('position', new THREE.BufferAttribute(gasPositions, 3));
    gasGeometry.setAttribute('color', new THREE.BufferAttribute(gasColors, 3));
    const gasMaterial = new THREE.PointsMaterial({ 
      size: 15, 
      vertexColors: true, 
      transparent: true, 
      opacity: 0.05, 
      blending: THREE.AdditiveBlending,
      depthWrite: false 
    });
    const gas = new THREE.Points(gasGeometry, gasMaterial);
    scene.add(gas);

    // Cosmic Rays
    const rayCount = 100;
    const rays: THREE.Line[] = [];
    for (let i = 0; i < rayCount; i++) {
      const rayGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 5)
      ]);
      const rayMat = new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.8 });
      const ray = new THREE.Line(rayGeo, rayMat);
      ray.position.set((Math.random()-0.5)*500, (Math.random()-0.5)*500, (Math.random()-0.5)*500);
      scene.add(ray);
      rays.push(ray);
    }

    // Dark Matter / Energy Web
    const dmCount = 5000;
    const dmGeometry = new THREE.BufferGeometry();
    const dmPositions = new Float32Array(dmCount * 3);
    for (let i = 0; i < dmCount; i++) {
      const i3 = i * 3;
      dmPositions[i3] = (Math.random() - 0.5) * 1000;
      dmPositions[i3 + 1] = (Math.random() - 0.5) * 1000;
      dmPositions[i3 + 2] = (Math.random() - 0.5) * 1000;
    }
    dmGeometry.setAttribute('position', new THREE.BufferAttribute(dmPositions, 3));
    const dmMaterial = new THREE.PointsMaterial({ size: 0.5, color: 0x110022, transparent: true, opacity: 0.3 });
    const darkMatter = new THREE.Points(dmGeometry, dmMaterial);
    scene.add(darkMatter);

    // Lights for planets
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 2, 300);
    scene.add(pointLight);

    camera.position.z = 200;
    camera.position.y = 50;
    camera.lookAt(0, 0, 0);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - window.innerWidth / 2) / 100;
      mouseY = (event.clientY - window.innerHeight / 2) / 100;
    };

    window.addEventListener('mousemove', onMouseMove);

    // Animation
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Rotate Galaxy
      if (galaxyPoints) {
        galaxyPoints.rotation.y = elapsedTime * 0.05;
      }

      // Rotate Stars
      stars.rotation.y = elapsedTime * 0.01;
      stars.rotation.x = elapsedTime * 0.005;

      // Animate Black Hole
      blackHoleGroup.rotation.y = elapsedTime * 0.2;
      accretionDisk.rotation.z = elapsedTime * 0.5;

      // Animate Planets
      planetData.forEach((data, i) => {
        const planet = planets[i];
        const angle = elapsedTime * data.speed;
        planet.position.x = Math.cos(angle) * data.distance;
        planet.position.z = Math.sin(angle) * data.distance;
        planet.rotation.y = elapsedTime * 0.5;
      });

      // Animate Asteroids
      asteroids.rotation.y = elapsedTime * 0.02;

      // Animate Comets
      comets.forEach(comet => {
        comet.mesh.position.addScaledVector(comet.direction, comet.speed);
        if (comet.mesh.position.length() > 500) {
          comet.mesh.position.set((Math.random()-0.5)*400, (Math.random()-0.5)*400, (Math.random()-0.5)*400);
        }
        comet.mesh.lookAt(comet.mesh.position.clone().add(comet.direction));
      });

      // Animate Cosmic Rays
      rays.forEach(ray => {
        ray.position.z += 2;
        if (ray.position.z > 500) ray.position.z = -500;
      });

      // Animate Dark Matter (Pulse)
      darkMatter.material.opacity = 0.2 + Math.sin(elapsedTime) * 0.1;

      // Nebula Movement
      nebula.rotation.y = -elapsedTime * 0.08;
      const nebulaPositions = nebula.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < nebulaCount; i++) {
        const i3 = i * 3;
        nebulaPositions[i3 + 1] += Math.sin(elapsedTime + nebulaPositions[i3]) * 0.01;
      }
      nebula.geometry.attributes.position.needsUpdate = true;

      // Smooth Camera Movement
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      camera.position.x += (targetX * 10 - camera.position.x) * 0.02;
      camera.position.y += (-targetY * 10 + 50 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // Resize Handling
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      // Dispose resources
      starGeometry.dispose();
      starMaterial.dispose();
      galaxyGeometry?.dispose();
      galaxyMaterial?.dispose();
      nebulaGeometry.dispose();
      nebulaMaterial.dispose();
      bhGeometry.dispose();
      bhMaterial.dispose();
      adGeometry.dispose();
      adMaterial.dispose();
      asteroidGeometry.dispose();
      asteroidMaterial.dispose();
      gasGeometry.dispose();
      gasMaterial.dispose();
      dmGeometry.dispose();
      dmMaterial.dispose();
      planets.forEach(p => {
        p.geometry.dispose();
        (p.material as THREE.Material).dispose();
      });
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 bg-black overflow-hidden" id="space-canvas-container" />;
};

export default SpaceScene;
