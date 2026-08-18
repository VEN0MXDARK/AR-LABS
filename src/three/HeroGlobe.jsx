import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Instances, Instance, Sparkles } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { usePerfTier } from '../hooks/usePerfTier'

const CYAN = '#00d4ff'
const PURPLE = '#a855f7'
const PURPLE_RING = '#aa44ff'

/* Deduped vertex positions of a subdivided icosahedron, for the node instances. */
function useIcoVertices(detail) {
  return useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.3, detail)
    const pos = geo.attributes.position
    const seen = new Set()
    const verts = []
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i)
      const key = `${x.toFixed(3)}_${y.toFixed(3)}_${z.toFixed(3)}`
      if (!seen.has(key)) {
        seen.add(key)
        verts.push([x, y, z])
      }
    }
    geo.dispose()
    return verts
  }, [detail])
}

function Nodes({ detail }) {
  const verts = useIcoVertices(detail)
  return (
    <Instances limit={verts.length} range={verts.length}>
      <sphereGeometry args={[0.028, 8, 8]} />
      <meshBasicMaterial color="#d2f8ff" toneMapped={false} />
      {verts.map((v, i) => <Instance key={i} position={v} />)}
    </Instances>
  )
}

function Ring({ radiusX, radiusY, color, rotation, opacity }) {
  const geometry = useMemo(() => {
    const pts = []
    for (let i = 0; i <= 128; i++) {
      const t = (i / 128) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(t) * radiusX, Math.sin(t) * radiusY, 0))
    }
    return new THREE.BufferGeometry().setFromPoints(pts)
  }, [radiusX, radiusY])

  return (
    <lineLoop geometry={geometry} rotation={rotation}>
      <lineBasicMaterial color={color} transparent opacity={opacity} toneMapped={false} />
    </lineLoop>
  )
}

function GlobeGroup({ tier }) {
  const group = useRef()
  const pointer = useRef({ x: 0, y: 0 })
  const detail = tier === 'high' ? 1 : 0

  useEffect(() => {
    if (tier === 'low') return
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [tier])

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    g.rotation.y += delta * 0.20
    const baseTilt = 0.18 + Math.sin(state.clock.elapsedTime * 0.07) * 0.04
    const targetX = baseTilt + pointer.current.y * -0.16
    const targetZ = pointer.current.x * 0.10
    g.rotation.x += (targetX - g.rotation.x) * 0.05
    g.rotation.z += (targetZ - g.rotation.z) * 0.05
  })

  const wireGeometry = useMemo(
    () => new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.3, detail)),
    [detail]
  )

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[1.05, 32, 32]} />
        <meshBasicMaterial
          color={PURPLE} transparent opacity={0.35}
          blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false}
        />
      </mesh>

      <lineSegments geometry={wireGeometry}>
        <lineBasicMaterial
          color={CYAN} transparent opacity={0.55}
          blending={THREE.AdditiveBlending} toneMapped={false}
        />
      </lineSegments>

      <Nodes detail={detail} />

      <Ring radiusX={1.7} radiusY={0.27} color={CYAN} rotation={[0, 0, 0]} opacity={0.85} />
      <Ring radiusX={1.9} radiusY={0.68} color={PURPLE_RING} rotation={[0, 0, -0.32]} opacity={0.72} />

      {tier === 'high' && (
        <Sparkles count={60} scale={3.2} size={2} speed={0.25} color={CYAN} opacity={0.5} />
      )}
    </group>
  )
}

export default function HeroGlobe() {
  const { tier, reducedMotion } = usePerfTier()
  const containerRef = useRef(null)
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const frameloop = reducedMotion ? 'demand' : inView ? 'always' : 'never'

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <Canvas
        frameloop={frameloop}
        dpr={tier === 'high' ? [1, 1.5] : [1, 1]}
        camera={{ position: [0, 0, 4.4], fov: 42 }}
        gl={{ alpha: true, antialias: true, toneMapping: THREE.NoToneMapping }}
      >
        <GlobeGroup tier={tier} />
        {tier === 'high' && !reducedMotion && (
          <EffectComposer>
            <Bloom mipmapBlur luminanceThreshold={0.35} intensity={0.55} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  )
}
