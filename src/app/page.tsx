'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface MessageData {
  title: string
  content: string
  planet: string
  color: string
}

export default function SolarSystemMessage() {
  const mountRef = useRef<HTMLDivElement>(null)
  const [selectedMessage, setSelectedMessage] = useState<MessageData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const messages: MessageData[] = [
    {
      title: "Dear Husaina",
      content: "I know we haven't been talking much on Instagram, and I want to understand why. I value our connection and want to make things right.",
      planet: "Mercury",
      color: "#8C7853"
    },
    {
      title: "I'm Sorry",
      content: "If I've been too much or annoying, I truly apologize. I promise to be a better listener and less focused on 'boys talk'. Meri mummy ki kasam, I will never judge you.",
      planet: "Venus",
      color: "#FFC649"
    },
    {
      title: "I Want to Know You",
      content: "I'm genuinely interested in knowing you better - your childhood, your love for basketball and dark romance novels, what makes you smile. I want to understand your world.",
      planet: "Earth",
      color: "#6B93D6"
    },
    {
      title: "Your Beauty",
      content: "You are beautiful inside and out. I see your kindness, your interests, your unique personality. I want to appreciate all of who you are.",
      planet: "Mars",
      color: "#CD5C5C"
    },
    {
      title: "Understanding You",
      content: "I want to know about your childhood experiences, your culture, your journey. I respect that we come from different backgrounds, and I want to learn and understand.",
      planet: "Jupiter",
      color: "#D8CA9D"
    },
    {
      title: "I'm Here for You",
      content: "I know I may not be the best listener, but I want to be. You can tell me anything - why you weren't going out, why you don't make online friends. I'll listen without judgment.",
      planet: "Saturn",
      color: "#FAD5A5"
    },
    {
      title: "Breaking Barriers",
      content: "I understand you don't like texting and can't call. I respect your boundaries. This solar system is my way of reaching out - interactive, visual, and from the heart.",
      planet: "Uranus",
      color: "#4FD0E7"
    },
    {
      title: "I Don't Want to Let Go",
      content: "I care about you and our connection. I'm willing to work on being better, more understanding, and more respectful. You and your love for cats deserve someone who truly listens.",
      planet: "Neptune",
      color: "#4B70DD"
    }
  ]

  useEffect(() => {
    if (!mountRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000011, 1)
    mountRef.current.appendChild(renderer.domElement)

    // Add stars
    const starsGeometry = new THREE.BufferGeometry()
    const starsMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.5 })
    
    const starsVertices = []
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000
      const y = (Math.random() - 0.5) * 2000
      const z = (Math.random() - 0.5) * 2000
      starsVertices.push(x, y, z)
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3))
    const stars = new THREE.Points(starsGeometry, starsMaterial)
    scene.add(stars)

    // Create sun with glow effect
    const sunGeometry = new THREE.SphereGeometry(3, 32, 32)
    const sunMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xFFD700,
      emissive: 0xFFD700,
      emissiveIntensity: 0.3
    })
    const sun = new THREE.Mesh(sunGeometry, sunMaterial)
    sun.userData = { pulsePhase: 0 }
    scene.add(sun)

    // Add sun glow
    const glowGeometry = new THREE.SphereGeometry(4, 32, 32)
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFD700,
      transparent: true,
      opacity: 0.1
    })
    const sunGlow = new THREE.Mesh(glowGeometry, glowMaterial)
    scene.add(sunGlow)

    // Create planets
    const planets: THREE.Mesh[] = []
    const planetData = [
      { radius: 0.4, distance: 6, speed: 0.02, color: 0x8C7853 },
      { radius: 0.6, distance: 8, speed: 0.015, color: 0xFFC649 },
      { radius: 0.7, distance: 10, speed: 0.01, color: 0x6B93D6 },
      { radius: 0.5, distance: 12, speed: 0.008, color: 0xCD5C5C },
      { radius: 1.5, distance: 16, speed: 0.005, color: 0xD8CA9D },
      { radius: 1.2, distance: 20, speed: 0.003, color: 0xFAD5A5 },
      { radius: 0.8, distance: 24, speed: 0.002, color: 0x4FD0E7 },
      { radius: 0.8, distance: 28, speed: 0.001, color: 0x4B70DD }
    ]

    planetData.forEach((data, index) => {
      const geometry = new THREE.SphereGeometry(data.radius, 32, 32)
      const material = new THREE.MeshLambertMaterial({ color: data.color })
      const planet = new THREE.Mesh(geometry, material)
      
      planet.userData = { 
        messageIndex: index, 
        distance: data.distance, 
        speed: data.speed,
        angle: Math.random() * Math.PI * 2,
        originalScale: 1
      }
      
      planets.push(planet)
      scene.add(planet)

      // Add orbit ring
      const orbitGeometry = new THREE.RingGeometry(data.distance - 0.1, data.distance + 0.1, 64)
      const orbitMaterial = new THREE.MeshBasicMaterial({ 
        color: data.color, 
        transparent: true, 
        opacity: 0.2,
        side: THREE.DoubleSide
      })
      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial)
      orbit.rotation.x = Math.PI / 2
      scene.add(orbit)
    })

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4)
    scene.add(ambientLight)
    
    const pointLight = new THREE.PointLight(0xFFFFFF, 1, 100)
    pointLight.position.set(0, 0, 0)
    scene.add(pointLight)

    // Simple camera controls
    let mouseX = 0
    let mouseY = 0
    let targetX = 0
    let targetY = 0
    let hoveredPlanet: THREE.Mesh | null = null

    const onMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1

      // Check for planet hover
      mouse.x = mouseX
      mouse.y = mouseY
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(planets)

      // Reset previous hovered planet
      if (hoveredPlanet) {
        hoveredPlanet.scale.set(1, 1, 1)
        hoveredPlanet = null
      }

      // Highlight new hovered planet
      if (intersects.length > 0) {
        hoveredPlanet = intersects[0].object as THREE.Mesh
        const targetScale = 1.3
        hoveredPlanet.scale.set(targetScale, targetScale, targetScale)
        document.body.style.cursor = 'pointer'
      } else {
        document.body.style.cursor = 'default'
      }
    }

    window.addEventListener('mousemove', onMouseMove)

    camera.position.set(0, 10, 30)

    // Raycaster for planet selection
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const onMouseClick = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(planets)

      if (intersects.length > 0) {
        const clickedPlanet = intersects[0].object
        const messageIndex = clickedPlanet.userData.messageIndex
        setSelectedMessage(messages[messageIndex])
      }
    }

    window.addEventListener('click', onMouseClick)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      // Smooth camera movement
      targetX += (mouseX - targetX) * 0.05
      targetY += (mouseY - targetY) * 0.05
      
      camera.position.x = targetX * 10
      camera.position.y = 10 + targetY * 5
      camera.lookAt(scene.position)

      // Pulse sun
      sun.userData.pulsePhase += 0.02
      const pulseScale = 1 + Math.sin(sun.userData.pulsePhase) * 0.1
      sun.scale.set(pulseScale, pulseScale, pulseScale)
      sunGlow.scale.set(pulseScale * 1.2, pulseScale * 1.2, pulseScale * 1.2)

      // Rotate sun
      sun.rotation.y += 0.005
      sunGlow.rotation.y += 0.003

      // Orbit planets
      planets.forEach((planet) => {
        planet.userData.angle += planet.userData.speed
        planet.position.x = Math.cos(planet.userData.angle) * planet.userData.distance
        planet.position.z = Math.sin(planet.userData.angle) * planet.userData.distance
        planet.rotation.y += 0.01
      })

      renderer.render(scene, camera)
    }

    setIsLoading(false)
    animate()

    // Handle window resize
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', onWindowResize)

    return () => {
      window.removeEventListener('resize', onWindowResize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('click', onMouseClick)
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <div className="text-white text-xl">Creating your universe of messages...</div>
        </div>
      )}
      
      <div ref={mountRef} className="w-full h-full" />
      
      {/* Instructions */}
      <div className="absolute top-4 left-4 text-white bg-black bg-opacity-50 p-4 rounded-lg max-w-md backdrop-blur-sm">
        <h2 className="text-lg font-bold mb-2">🌟 A Universe of Messages for Husaina</h2>
        <p className="text-sm mb-2">
          Each planet holds a piece of my heart. Click on them to discover what I want to tell you.
        </p>
        <p className="text-xs text-gray-300">
          Move your mouse to explore our solar system of feelings ✨
        </p>
      </div>

      {/* Message Modal */}
      {selectedMessage && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-20 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-white to-gray-100 rounded-lg p-6 max-w-md mx-4 relative shadow-2xl border border-gray-200">
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl transition-colors"
            >
              ✕
            </button>
            
            <div className="flex items-center mb-4">
              <div 
                className="w-6 h-6 rounded-full mr-3 shadow-lg"
                style={{ backgroundColor: selectedMessage.color }}
              />
              <h3 className="text-2xl font-bold text-gray-800">{selectedMessage.title}</h3>
            </div>
            
            <p className="text-gray-700 leading-relaxed mb-6 text-lg">
              {selectedMessage.content}
            </p>
            
            <div className="flex items-center justify-between text-sm text-gray-500 italic">
              <span>From: {selectedMessage.planet} 🪐</span>
              <span>With ❤️</span>
            </div>
          </div>
        </div>
      )}

      {/* Planet Legend */}
      <div className="absolute bottom-4 right-4 text-white bg-black bg-opacity-50 p-4 rounded-lg backdrop-blur-sm">
        <h3 className="text-sm font-bold mb-2">🌍 Our Planets of Feelings:</h3>
        <div className="space-y-1 text-xs">
          {messages.map((msg, index) => (
            <div key={index} className="flex items-center">
              <div 
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: msg.color }}
              />
              <span>{msg.planet}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}