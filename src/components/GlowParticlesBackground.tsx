import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import { useEffect, useState } from "react"

export default function GlowParticlesBackground() {

  const [init, setInit] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => setInit(true))
  }, [])

  if (!init) return null

  return (
    <Particles
      className="absolute inset-0 pointer-events-none"
      options={{
        fullScreen: { enable: false },

        particles: {
          number: {
            value: 40
          },

          color: {
            value: ["#8b5cf6", "#f59e0b"]
          },

          shape: {
            type: "circle"
          },

          opacity: {
            value: 0.8,
            animation: {
              enable: true,
              speed: 0.5
            }
          },

          size: {
            value: { min: 2, max: 6 },
            animation: {
              enable: true,
              speed: 2
            }
          },

          move: {
            enable: true,
            speed: 0.3
          },

          links: {
            enable: true,
            distance: 160,
            opacity: 0.5,
            color: "#8b5cf6"
          }
        },

        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "grab"
            }
          },

          modes: {
            grab: {
              distance: 140,
              links: {
                opacity: 1
              }
            }
          }
        }
      }}
    />
  )
}