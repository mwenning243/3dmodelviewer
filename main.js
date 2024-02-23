import * as THREE from '../node_modules/three/build/three.module.js';
import { GLTFLoader } from './three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from './three/addons/controls/OrbitControls.js';

/*

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let mixer;
const clock = new THREE.Clock();

const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set( 0, 0.5, 0 );
controls.update();
controls.enablePan = false;
controls.enableDamping = true;

const loader = new GLTFLoader();

loader.load( 'ratCharacter.glb', function ( gltf ) {
    const model = gltf.scene;
	model.position.set( 1, 1, 0 );
	model.scale.set( 0.1, 0.1, 0.1 );
	scene.add( model );
    mixer = new THREE.AnimationMixer( model );
	mixer.clipAction( gltf.animations[ 1 ] ).play();
	animate();

}, undefined, function ( error ) {

	console.error( error );

} );

camera.position.z = 5;

function animate() {
	requestAnimationFrame( animate );
    const delta = clock.getDelta();
    mixer.update( delta );
    controls.update();
	renderer.render( scene, camera );
}
animate();

*/

let clock, controls, scene, camera, renderer, mixer, container, model;
let clip, action;


initScene();
animate();

let currentType = "Idle";

function initScene() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    1,
    0.1,
    1000
  );
  
  clock = new THREE.Clock();
  renderer = new THREE.WebGLRenderer();
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.target = new THREE.Vector3(0, 1, 0);
  controls.update();

  container = document.getElementById("container");

  container.appendChild(renderer.domElement);
  renderer.setSize(container.clientWidth, container.clientWidth);
}

scene.background = new THREE.Color("#433473");

//GLTF START

const GLTFloader = new GLTFLoader();

GLTFloader.load("/ratCharacter.glb", function (gltf) {
    const geometry = new THREE.CircleGeometry( 5, 32 ); 
    geometry.rotateX(-1.57);
    const material = new THREE.MeshBasicMaterial( { color: 0x2e1f4d } ); 
    const circle = new THREE.Mesh( geometry, material ); scene.add( circle );
    
    model = gltf;
    mixer = new THREE.AnimationMixer(model.scene);
    scene.add(model.scene);

    clip = THREE.AnimationClip.findByName(model.animations, currentType);
    action = mixer.clipAction(clip);
    action.play();

});


camera.position.set(4, 4, -4);

function animate() {
  requestAnimationFrame(animate);

  let delta = clock.getDelta();

  if (mixer) {
    mixer.update(delta);
  }

  camera.lookAt( 0, 2.5, 0 );
  renderer.render(scene, camera);

 
}
document.getElementById(currentType).style.backgroundColor = "#a3a7bf";

function ChangeAnimation(type) {
    if (type == currentType) return;
    document.getElementById(currentType).style.backgroundColor = "#6b6b99";
    currentType = type;
    document.getElementById(currentType).style.backgroundColor = "#a3a7bf";
    action.stop();
    clip = THREE.AnimationClip.findByName(model.animations, type);
    action = mixer.clipAction(clip);
    action.play();
}


document.getElementById("Idle").addEventListener("click", function() { ChangeAnimation("Idle") });
document.getElementById("Running").addEventListener("click", function() { ChangeAnimation("Running")});
document.getElementById("Falling").addEventListener("click", function() { ChangeAnimation("Falling")});
document.getElementById("Rising").addEventListener("click", function() { ChangeAnimation("Rising")});


window.addEventListener("resize", function() {onWindowResize()});

function onWindowResize(){

    camera.aspect = 1;
    camera.updateProjectionMatrix();

    renderer.setSize(container.clientWidth, container.clientWidth);

}
