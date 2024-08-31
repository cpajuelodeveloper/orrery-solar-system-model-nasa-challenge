'use client'
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const SistemaSolar = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Configurar la escena, cámara y renderizador
    const scene = new THREE.Scene();
    const textureLoader = new THREE.TextureLoader();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    //Configurar BloomPass
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,  // strength
      0.4,  // radius
      0.85  // threshold
    );
    composer.addPass(bloomPass);

    // Añadir OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Crear fondo de estrellas
    /*const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });

    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);*/

    const starTexture = new THREE.TextureLoader().load('images/stars_milky_way_texture.jpg');
    const starMaterial = new THREE.MeshBasicMaterial({ map: starTexture, side: THREE.BackSide });
    const starGeometry = new THREE.SphereGeometry(500, 32, 32);
    const starBackground = new THREE.Mesh(starGeometry, starMaterial);
    scene.add(starBackground);
        

    // Crear el Sol
    const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
    const sunTexture = textureLoader.load('images/sun_texture.jpg');
    const sunMaterial = new THREE.MeshBasicMaterial({
      map: sunTexture
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);

    
    // Agregar luz del sol
    const sunLight = new THREE.PointLight(0xffffff, 20, 100, 1);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;
    sun.add(sunLight);
    scene.add(sun);

    // Crear la Tierra con textura
    const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
    const earthTexture = textureLoader.load('images/earth_texture.jpg'); // Asegúrate de tener esta imagen en tu carpeta public
    const earthBump = textureLoader.load('images/earth_texture.jpg'); 
    const earthspecular = textureLoader.load('images/earth_specular.jpg'); 
    const earthMaterial = new THREE.MeshPhongMaterial({ 
      map: earthTexture,
      bumpMap: earthBump,
      bumpScale: 0.05,
      specularMap: earthspecular,
      specular: new THREE.Color('grey'),
      shininess: 10
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.position.set(10, 0, 0);
    scene.add(earth);

    // Crear la Luna
    const moonGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const moonMaterial = new THREE.MeshPhongMaterial({ color: 0x888888, emissive: 0x222222, specular: 0x333333, shininess: 5 });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(2, 0, 0);
    earth.add(moon);

    // Añadir luz ambiental
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // Añadir luz puntual (Sol)
    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    scene.add(pointLight);

    // Posicionar la cámara
    camera.position.z = 30;

    // Función de animación
    const animate = () => {
      requestAnimationFrame(animate);

      // Actualizar los controles de la órbita
      controls.update();

      // Rotar el Sol
      sun.rotation.y += 0.001;

      // Rotar la Tierra alrededor del Sol
      earth.position.x = Math.cos(Date.now() * 0.0001) * 10;
      earth.position.z = Math.sin(Date.now() * 0.0001) * 10;

      // Rotar la Tierra sobre su eje
      earth.rotation.y += 0.005;

      // Rotar la Luna alrededor de la Tierra
      moon.position.x = Math.cos(Date.now() * 0.001) * 2;
      moon.position.z = Math.sin(Date.now() * 0.001) * 2;

      // Rotar la Luna sobre su eje
      moon.rotation.y += 0.01;

      composer.render();
    };

    // Manejar el redimensionamiento de la ventana
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      composer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    animate();

    // Limpieza
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
};

export default SistemaSolar;