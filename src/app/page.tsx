"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three-stdlib";

interface MessageData {
  title: string;
  content: string;
  planet: string;
  color: string;
  details: string; // New field for realistic details
}

export default function SolarSystemMessage() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedMessage, setSelectedMessage] = useState<MessageData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showLegend, setShowLegend] = useState(true);

  const messages: MessageData[] = [
    {
      title: "Dear Husaina",
      content:
        "I know we haven't been talking much on Instagram, and I want to understand why. I value our connection and want to make things right.",
      planet: "Mercury",
      color: "#8C7853",
      details:
        "The smallest and innermost planet in the Solar System. Mercury has no atmosphere to retain heat, causing extreme temperature variations.",
    },
    {
      title: "I'm Sorry",
      content:
        "If I've been too much or annoying, I truly apologize. I promise to be a better listener and less focused on 'boys talk'. Meri mummy ki kasam, I will never judge you.",
      planet: "Venus",
      color: "#FFC649",
      details:
        "The second planet from the Sun, often called Earth's 'sister planet' due to similar size. It has a thick, toxic atmosphere and is the hottest planet.",
    },
    {
      title: "I Want to Know You",
      content:
        "I'm genuinely interested in knowing you better - your childhood, your love for basketball and dark romance novels, what makes you smile. I want to understand your world.",
      planet: "Earth",
      color: "#6B93D6",
      details:
        "Our home planet, the third from the Sun. It's the only known celestial body to support life, with 71% of its surface covered by water.",
    },
    {
      title: "Your Beauty",
      content:
        "You are beautiful inside and out. I see your kindness, your interests, your unique personality. I want to appreciate all of who you are.",
      planet: "Mars",
      color: "#CD5C5C",
      details:
        "The fourth planet from the Sun, known as the 'Red Planet' due to iron oxide on its surface. It has the largest dust storms in the Solar System.",
    },
    {
      title: "Understanding You",
      content:
        "I want to know about your childhood experiences, your culture, your journey. I respect that we come from different backgrounds, and I want to learn and understand.",
      planet: "Jupiter",
      color: "#D8CA9D",
      details:
        "The largest planet in our Solar System, a gas giant with a prominent Great Red Spot—a storm larger than Earth. It has 79 known moons.",
    },
    {
      title: "I'm Here for You",
      content:
        "I know I may not be the best listener, but I want to be. You can tell me anything - why you weren't going out, why you don't make online friends. I'll listen without judgment.",
      planet: "Saturn",
      color: "#FAD5A5",
      details:
        "The sixth planet from the Sun, famous for its spectacular ring system made of ice and rock particles. It's the least dense planet, able to float on water.",
    },
    {
      title: "Breaking Barriers",
      content:
        "I understand you don't like texting and can't call. I respect your boundaries. This solar system is my way of reaching out - interactive, visual, and from the heart.",
      planet: "Uranus",
      color: "#4FD0E7",
      details:
        "An ice giant that rotates on its side, making it unique among planets. It has faint rings and 27 known moons, with a pale blue color due to methane.",
    },
    {
      title: "I Don't Want to Let Go",
      content:
        "I care about you and our connection. I'm willing to work on being better, more understanding, and more respectful. You and your love for cats deserve someone who truly listens.",
      planet: "Neptune",
      color: "#4B70DD",
      details:
        "The eighth and farthest known planet from the Sun. It's an ice giant with the strongest winds in the Solar System, reaching speeds of up to 2,100 km/h.",
    },
  ];

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000011, 1);
    mountRef.current.appendChild(renderer.domElement);

    // Add stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: isMobile ? 0.2 : 0.5,
    });

    const starsVertices: number[] = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(starsVertices, 3)
    );
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Create sun with glow effect
    const sunGeometry = new THREE.SphereGeometry(isMobile ? 2 : 3, 32, 32);
    const sunMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      emissive: 0xffd700,
      emissiveIntensity: 1,
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.userData = { pulsePhase: 0 };
    scene.add(sun);

    // Add sun glow
    const glowGeometry = new THREE.SphereGeometry(isMobile ? 2.5 : 4, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 0.1,
    });
    const sunGlow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(sunGlow);

    // Create planets with more realistic data
    const planets: THREE.Mesh[] = [];
    const scaleFactor = isMobile ? 0.6 : 1;
    const distanceFactor = isMobile ? 0.5 : 1;

    const planetData = [
      {
        radius: 0.38 * scaleFactor,
        distance: 5.8 * distanceFactor,
        speed: 0.02,
        color: 0x8c7853,
      }, // Mercury
      {
        radius: 0.95 * scaleFactor,
        distance: 7.2 * distanceFactor,
        speed: 0.015,
        color: 0xffc649,
      }, // Venus
      {
        radius: 1.0 * scaleFactor,
        distance: 8.5 * distanceFactor,
        speed: 0.01,
        color: 0x6b93d6,
      }, // Earth
      {
        radius: 0.53 * scaleFactor,
        distance: 10.0 * distanceFactor,
        speed: 0.008,
        color: 0xcd5c5c,
      }, // Mars
      {
        radius: 2.5 * scaleFactor,
        distance: 13.5 * distanceFactor,
        speed: 0.005,
        color: 0xd8ca9d,
      }, // Jupiter
      {
        radius: 2.0 * scaleFactor,
        distance: 16.5 * distanceFactor,
        speed: 0.003,
        color: 0xfad5a5,
      }, // Saturn
      {
        radius: 1.2 * scaleFactor,
        distance: 19.0 * distanceFactor,
        speed: 0.002,
        color: 0x4fd0e7,
      }, // Uranus
      {
        radius: 1.1 * scaleFactor,
        distance: 21.0 * distanceFactor,
        speed: 0.001,
        color: 0x4b70dd,
      }, // Neptune
    ];

    planetData.forEach((data, index) => {
      const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        color: data.color,
        emissive: data.color,
        emissiveIntensity: 0.4,
        roughness: 0.5,
        metalness: 0.1,
      });
      const planet = new THREE.Mesh(geometry, material);

      planet.userData = {
        messageIndex: index,
        distance: data.distance,
        speed: data.speed,
        angle: Math.random() * Math.PI * 2,
        originalScale: 1,
        radius: data.radius,
      };

      planets.push(planet);
      scene.add(planet);

      // Add orbit ring
      const orbitGeometry = new THREE.RingGeometry(
        data.distance - 0.05,
        data.distance + 0.05,
        64
      );
      const orbitMaterial = new THREE.MeshBasicMaterial({
        color: data.color,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide,
      });
      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.x = Math.PI / 2;
      scene.add(orbit);
    });

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 2, 300);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // OrbitControls for camera
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // an animation loop is required when damping is enabled
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 20;
    controls.maxDistance = 100;
    // Set initial camera position to a top-down view
    camera.position.set(0, 60, 0);
    controls.update();

    let hoveredPlanet: THREE.Mesh | null = null;

    // Raycaster for planet selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerMove = (event: PointerEvent) => {
      // calculate pointer position in normalized device coordinates
      // (-1 to +1) for both components
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Check for planet hover
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(planets);

      // Reset previous hovered planet
      if (hoveredPlanet) {
        hoveredPlanet.scale.set(1, 1, 1);
        hoveredPlanet = null;
      }

      // Highlight new hovered planet
      if (intersects.length > 0) {
        hoveredPlanet = intersects[0].object as THREE.Mesh;
        const targetScale = isMobile ? 1.5 : 1.3;
        hoveredPlanet.scale.set(targetScale, targetScale, targetScale);
        document.body.style.cursor = "pointer";
      } else {
        document.body.style.cursor = "default";
      }
    };

    const onPointerClick = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(planets);

      if (intersects.length > 0) {
        const clickedPlanet = intersects[0].object;
        const messageIndex = clickedPlanet.userData.messageIndex;
        setSelectedMessage(messages[messageIndex]);
      }
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerdown", onPointerClick);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      controls.update(); // only required if controls.enableDamping = true

      // Pulse sun
      sun.userData.pulsePhase += 0.02;
      const pulseScale = 1 + Math.sin(sun.userData.pulsePhase) * 0.1;
      sun.scale.set(pulseScale, pulseScale, pulseScale);
      sunGlow.scale.set(pulseScale * 1.2, pulseScale * 1.2, pulseScale * 1.2);

      // Rotate sun
      sun.rotation.y += 0.005;
      sunGlow.rotation.y += 0.003;

      // Orbit planets and check for collisions
      planets.forEach((planet, index) => {
        planet.userData.angle += planet.userData.speed;
        planet.position.x =
          Math.cos(planet.userData.angle) * planet.userData.distance;
        planet.position.z =
          Math.sin(planet.userData.angle) * planet.userData.distance;
        planet.rotation.y += 0.01;

        // Collision detection
        for (let i = index + 1; i < planets.length; i++) {
          const otherPlanet = planets[i];
          const distance = planet.position.distanceTo(otherPlanet.position);
          const minDistance =
            planet.userData.radius + otherPlanet.userData.radius;

          if (distance < minDistance) {
            // A more stable collision response
            const overlap = minDistance - distance;
            const angle1 = Math.atan2(planet.position.z, planet.position.x);
            const angle2 = Math.atan2(
              otherPlanet.position.z,
              otherPlanet.position.x
            );
            const angleDiff = angle1 - angle2;

            // Adjust angles to move planets apart along their orbits
            const adjustment =
              (overlap / planet.userData.distance) * Math.sign(angleDiff);
            planet.userData.angle += adjustment / 2;
            otherPlanet.userData.angle -= adjustment / 2;
          }
        }
      });

      renderer.render(scene, camera);
    };

    setIsLoading(false);
    animate();

    // Handle window resize
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      const newIsMobile = window.innerWidth < 768;
      if (newIsMobile !== isMobile) {
        setIsMobile(newIsMobile);
        // Potentially re-initialize scene with new mobile settings
      }
    };

    window.addEventListener("resize", onWindowResize);

    return () => {
      window.removeEventListener("resize", onWindowResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerClick);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [isMobile]); // Add isMobile to dependency array

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <div className="text-white text-xl">
            Creating your universe of messages...
          </div>
        </div>
      )}

      <div ref={mountRef} className="w-full h-full" />

      {/* Instructions - Collapsible on Mobile */}
      <div
        className={`absolute top-4 left-4 text-white bg-black bg-opacity-50 p-4 rounded-lg max-w-md backdrop-blur-sm transition-all duration-300 ${
          showInstructions ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="absolute top-1 right-1 text-white text-lg"
        >
          {showInstructions ? "✕" : "ℹ️"}
        </button>
        {!isMobile && showInstructions && (
          <>
            <h2 className="text-lg font-bold mb-2">
              🌟 A Universe of Messages for Husaina
            </h2>
            <p className="text-sm mb-2">
              Each planet holds a piece of my heart. Click on them to discover
              what I want to tell you.
            </p>
            <p className="text-xs text-gray-300">
              Move your mouse to explore our solar system of feelings ✨
            </p>
          </>
        )}
        {isMobile && showInstructions && (
          <>
            <h2 className="text-base font-bold mb-1">
              🌟 Messages for Husaina
            </h2>
            <p className="text-xs mb-1">Tap on planets to read messages.</p>
            <p className="text-xxs text-gray-300">
              Drag to explore the solar system.
            </p>
          </>
        )}
      </div>
      {!showInstructions && (
        <button
          onClick={() => setShowInstructions(true)}
          className="absolute top-4 left-4 text-white bg-black bg-opacity-50 p-2 rounded-full backdrop-blur-sm"
        >
          ℹ️
        </button>
      )}

      {/* Message Modal - Full screen on mobile */}
      {selectedMessage && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-20 backdrop-blur-sm p-4">
          <div
            className={`bg-gradient-to-br from-white to-gray-100 rounded-lg relative shadow-2xl border border-gray-200 ${
              isMobile
                ? "w-full h-full max-h-full overflow-y-auto"
                : "max-w-md mx-4"
            }`}
          >
            <button
              onClick={() => setSelectedMessage(null)}
              className={`absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors ${
                isMobile ? "text-3xl p-2" : "text-xl"
              }`}
            >
              ✕
            </button>

            <div className={`p-6 ${isMobile ? "pt-12" : ""}`}>
              <div className="flex items-center mb-4">
                <div
                  className={`rounded-full mr-3 shadow-lg ${
                    isMobile ? "w-8 h-8" : "w-6 h-6"
                  }`}
                  style={{ backgroundColor: selectedMessage.color }}
                />
                <h3
                  className={`font-bold text-gray-800 ${
                    isMobile ? "text-3xl" : "text-2xl"
                  }`}
                >
                  {selectedMessage.title}
                </h3>
              </div>

              <p
                className={`text-gray-700 leading-relaxed mb-6 ${
                  isMobile ? "text-xl" : "text-lg"
                }`}
              >
                {selectedMessage.content}
              </p>

              {/* Realistic Planet Details */}
              <div
                className="mb-6 p-4 bg-gray-50 rounded-lg border-l-4"
                style={{ borderColor: selectedMessage.color }}
              >
                <h4 className="font-semibold text-gray-800 mb-2">
                  About {selectedMessage.planet}:
                </h4>
                <p className="text-sm text-gray-600">
                  {selectedMessage.details}
                </p>
              </div>

              <div
                className={`flex items-center justify-between text-gray-500 italic ${
                  isMobile ? "text-base" : "text-sm"
                }`}
              >
                <span>From: {selectedMessage.planet} 🪐</span>
                <span>With ❤️</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Planet Legend - Collapsible on Mobile */}
      <div
        className={`absolute bottom-4 right-4 text-white bg-black bg-opacity-50 p-4 rounded-lg backdrop-blur-sm transition-all duration-300 ${
          showLegend ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          onClick={() => setShowLegend(!showLegend)}
          className="absolute top-1 right-1 text-white text-lg"
        >
          {showLegend ? "✕" : "🪐"}
        </button>
        {showLegend && (
          <>
            <h3
              className={`font-bold mb-2 ${isMobile ? "text-sm" : "text-base"}`}
            >
              🌍 Our Planets of Feelings:
            </h3>
            <div className={`space-y-1 ${isMobile ? "text-xxs" : "text-xs"}`}>
              {messages.map((msg, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className={`rounded-full mr-2 ${
                      isMobile ? "w-2 h-2" : "w-2 h-2"
                    }`}
                    style={{ backgroundColor: msg.color }}
                  />
                  <span>{msg.planet}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      {!showLegend && (
        <button
          onClick={() => setShowLegend(true)}
          className="absolute bottom-4 right-4 text-white bg-black bg-opacity-50 p-2 rounded-full backdrop-blur-sm"
        >
          🪐
        </button>
      )}
    </div>
  );
}
