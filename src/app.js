import * as THREE from 'three'

window.THREE = THREE

// ---------------------------------------------------------
// Custom pipeline module — sets up the Three.js scene
// ---------------------------------------------------------
const initScenePipelineModule = () => {
  let scene, camera, renderer, cube

  return {
    name: 'my-ar-scene',

    onStart: ({ canvas, canvasWidth, canvasHeight }) => {
      // Get the Three.js scene and camera created by XR8.Threejs.pipelineModule()
      const { scene: xrScene, camera: xrCamera, renderer: xrRenderer } =
        XR8.Threejs.xrScene()

      scene = xrScene
      camera = xrCamera
      renderer = xrRenderer

      // Add lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
      scene.add(ambientLight)

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
      directionalLight.position.set(1, 2, 1)
      scene.add(directionalLight)

      // Add a simple cube to the scene
      const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1)
      const material = new THREE.MeshStandardMaterial({ color: 0x00aaff })
      cube = new THREE.Mesh(geometry, material)
      cube.position.set(0, 0, -0.5) // Place it 0.5m in front of camera
      scene.add(cube)

      // Allow tap to place / interact
      canvas.addEventListener('touchstart', () => {
        cube.material.color.set(0xff6600) // Change colour on tap
      })
    },

    onRender: () => {
      // Runs every frame — good place for animations
      if (cube) {
        cube.rotation.y += 0.01
      }
    },
  }
}

// ---------------------------------------------------------
// Boot 8th Wall once the engine is loaded
// ---------------------------------------------------------
const onxrloaded = () => {
  XR8.addCameraPipelineModules([
    XR8.GlTextureRenderer.pipelineModule(),   // Draws the camera feed
    XR8.Threejs.pipelineModule(),             // Creates the Three.js AR scene
    XR8.XrController.pipelineModule(),        // Enables SLAM world tracking
    XRExtras.FullWindowCanvas.pipelineModule(), // Makes canvas fill the window
    XRExtras.Loading.pipelineModule(),        // Loading screen on startup
    XRExtras.RuntimeError.pipelineModule(),   // Shows error on crash
    initScenePipelineModule(),                // Your custom scene
  ])

  // Insert the camera canvas into the page
  document.body.insertAdjacentHTML(
    'beforeend',
    '<canvas id="camerafeed"></canvas>'
  )

  XR8.run({
    canvas: document.getElementById('camerafeed'),
    allowedDevices: XR8.XrConfig.device().ANY,
  })
}

// Wait for the engine to be ready before starting
window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)