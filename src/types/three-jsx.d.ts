
import { ReactThreeFiber } from '@react-three/fiber'
import { FC, ReactNode } from 'react'

// This file fixes TypeScript errors with JSX elements in React Three Fiber
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: ReactThreeFiber.Object3DNode<THREE.Group, typeof THREE.Group>
      mesh: ReactThreeFiber.Object3DNode<THREE.Mesh, typeof THREE.Mesh>
      sphereGeometry: ReactThreeFiber.BufferGeometryNode<THREE.SphereGeometry, typeof THREE.SphereGeometry>
      boxGeometry: ReactThreeFiber.BufferGeometryNode<THREE.BoxGeometry, typeof THREE.BoxGeometry>
      cylinderGeometry: ReactThreeFiber.BufferGeometryNode<THREE.CylinderGeometry, typeof THREE.CylinderGeometry>
      ringGeometry: ReactThreeFiber.BufferGeometryNode<THREE.RingGeometry, typeof THREE.RingGeometry>
      ellipseCurve: ReactThreeFiber.Node<THREE.EllipseCurve, typeof THREE.EllipseCurve> & {
        asGeometry: boolean,
        extrudeGeometry?: {
          steps: number,
          depth: number,
          bevelEnabled: boolean,
          bevelThickness: number,
          bevelSize: number,
          bevelSegments: number
        }
      }
      meshStandardMaterial: ReactThreeFiber.MaterialNode<THREE.MeshStandardMaterial, typeof THREE.MeshStandardMaterial>
      meshBasicMaterial: ReactThreeFiber.MaterialNode<THREE.MeshBasicMaterial, typeof THREE.MeshBasicMaterial>
      ambientLight: ReactThreeFiber.LightNode<THREE.AmbientLight, typeof THREE.AmbientLight>
      pointLight: ReactThreeFiber.LightNode<THREE.PointLight, typeof THREE.PointLight>
      directionalLight: ReactThreeFiber.LightNode<THREE.DirectionalLight, typeof THREE.DirectionalLight>
    }
  }
}
