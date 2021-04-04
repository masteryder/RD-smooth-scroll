import './styles.css'
import * as THREE from 'three';
import gsap from 'gsap';

import * as dat from 'dat.gui'
import { Euler } from 'three';

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas#three-canvas');

// Scene
const scene = new THREE.Scene();


// Texture Loader
const textureLoader = new THREE.TextureLoader();

const geometry = new THREE.PlaneBufferGeometry(1, 1.3);

for(let i = 1; i <=4; i++){
  const material = new THREE.MeshBasicMaterial({
    map: textureLoader.load(`/frogs/${i}.jpg`)
  });
  const img = new THREE.Mesh(geometry, material);
  img.position.set(Math.random()+.3, -i*1.8)
  scene.add(img);
}

let objs = [];

scene.traverse((object)=>{
  if(object.isMesh){
    objs.push(object);
  }
});

// MOUSE
window.addEventListener("wheel", onMouseWheel);

let y = 0;
let position = 0;

function onMouseWheel(e){
  y = e.deltaY;
}

const mouse = new THREE.Vector2();
window.addEventListener('mousemove', (event)=>{
  mouse.x = event.clientX / sizes.width * 2 - 1;
  mouse.y = - (event.clientY / sizes.height)  * 2 + 1;
})

// ANIMATE
const raycaster = new THREE.Raycaster();

// Lights

const light1Color = {
  color: 0xffffff
}

const pointLight = new THREE.PointLight(light1Color.color, .5)
pointLight.position.x = 0
pointLight.position.y = 100
pointLight.position.z = 300
scene.add(pointLight)

const light1folder = gui.addFolder('Light 1');
light1folder.addColor(light1Color, 'color').onChange(()=>{
  pointLight.color.set(light1Color.color);
})
light1folder.add(pointLight.position, 'x')
light1folder.add(pointLight.position, 'y')
light1folder.add(pointLight.position, 'z')
light1folder.add(pointLight, 'intensity')

/**
 * Sizes
 */
 const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () =>
{
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, -4.8, 2)
const cameraFolder = gui.addFolder('Camera');

cameraFolder.add(camera.position, 'x')
cameraFolder.add(camera.position, 'y')
cameraFolder.add(camera.position, 'z')

scene.add(camera)

/**
 * Renderer
 */
 const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
* Animate
*/

const clock = new THREE.Clock()

const tick = () =>
{

  const elapsedTime = clock.getElapsedTime()
  var newPos = camera.position.y - y * 0.004;

  if(newPos < -6.4) newPos = -6.4
  if(newPos > -2.6) newPos = -2.6;
  camera.position.y = newPos;

  y*=0.9;
  // Update Orbital Controls
  // controls.update()

  // Raycaster
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(objs);

  for(const intersect of intersects){
    gsap.to(intersect.object.scale, {x: 1.7, y: 1.7})
    gsap.to(intersect.object.rotation, {y: -.5})
    gsap.to(intersect.object.position, {z: -.9})
    // intersect.object.rotation.set(.3, 0, 0)
  }

  for (const object of objs){
    if(!intersects.find(intersect => intersect.object === object)){
      gsap.to(object.scale, {x: 1, y: 1})
      gsap.to(object.rotation, {y: 0})
      gsap.to(object.position, {z: 0})
      //object.rotation.set(0, 0, 0)
    }
  }

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()