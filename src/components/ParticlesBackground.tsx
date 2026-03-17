import Particles from "@tsparticles/react"
import { useEffect, useState } from "react"
import { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"

export default function ParticlesBackground() {

  const [init, setInit] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => setInit(true))
  }, [])

  if (!init) return null

  return (
    <Particles
      id="tsparticles"
      className="absolute inset-0 pointer-events-none"
      options={{
        fullScreen: { enable: false },

        particles: {
          number: { value: 60 },

          color: {
            value: ["#8b5cf6", "#f59e0b", "#3b82f6"]
          },

          links: {
            enable: true,
            distance: 180,
            opacity: 0.25,
            color: "#8b5cf6"
          },

          move: {
            enable: true,
            speed: 0.4
          },

          size: {
            value: { min: 1, max: 3 }
          },

          opacity: {
            value: 0.4
          }
        }
      }}
    />
  )
}