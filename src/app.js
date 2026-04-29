import * as THREE from 'three'
window.THREE = THREE

// Define your image target from code — no dashboard needed
const imageTarget = {
  imagePath: './marker.png',  // your image in public/
  metadata: {},
  name: 'my-marker',
  type: 'PLANAR',
  properties: {
    left: 0,
    top: 0,
    width: 480,
    height: 640,
    originalWidth: 480,
    originalHeight: 640,
    isRotated: false,
  }
}

const initScenePipelineModule = () => {
  let cube

  return {
    name: 'my-ar-scene',

    onStart: () => {
      const { scene } = XR8.Threejs.xrScene()

      // Lighting
      scene.add(new THREE.AmbientLight(0xffffff, 0.6))
      const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
      dirLight.position.set(1, 2, 1)
      scene.add(dirLight)

      // Object to show on the marker
      const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1)
      const material = new THREE.MeshStandardMaterial({ color: 0x00aaff })
      cube = new THREE.Mesh(geometry, material)
      cube.visible = false  // hide until marker is found
      scene.add(cube)

      // Listen for image target events
      window.addEventListener('xrimagefound', ({ detail }) => {
        if (detail.name === 'my-marker') {
          cube.position.copy(detail.position)
          cube.quaternion.copy(detail.rotation)
          cube.scale.setScalar(detail.scale)
          cube.visible = true
        }
      })

      window.addEventListener('xrimageupdated', ({ detail }) => {
        if (detail.name === 'my-marker') {
          cube.position.copy(detail.position)
          cube.quaternion.copy(detail.rotation)
          cube.scale.setScalar(detail.scale)
        }
      })

      window.addEventListener('xrimagelost', ({ detail }) => {
        if (detail.name === 'my-marker') {
          cube.visible = false
        }
      })
    },

    onRender: () => {
      if (cube && cube.visible) {
        cube.rotation.y += 0.01
      }
    },
  }
}

const onxrloaded = () => {
  // Register the image target from code
  XR8.XrController.configure({
    imageTargetData: [imageTarget]
  })

  XR8.addCameraPipelineModules([
    XR8.GlTextureRenderer.pipelineModule(),
    XR8.Threejs.pipelineModule(),
    XR8.XrController.pipelineModule(),
    XRExtras.FullWindowCanvas.pipelineModule(),
    XRExtras.Loading.pipelineModule(),
    XRExtras.RuntimeError.pipelineModule(),
    initScenePipelineModule(),
  ])

  document.body.insertAdjacentHTML('beforeend', '<canvas id="camerafeed"></canvas>')
  XR8.run({
    canvas: document.getElementById('camerafeed'),
    allowedDevices: XR8.XrConfig.device().ANY,
  })
}

window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)