import * as THREE from 'three'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera()
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Hand control of the camera to 8th Wall
window.XR8.addCameraPipelineModules([
  window.XR8.GlTextureRenderer.pipelineModule(),
  window.XR8.Threejs.pipelineModule(),
  window.XRExtras.Loading.pipelineModule(),
])

// Your scene setup goes here
const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1)
const material = new THREE.MeshStandardMaterial({ color: 0x00aaff })
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

window.XR8.run({ canvas: renderer.domElement })