/**
 * Code from three.js examples
 */
import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { PCDLoader } from "three/addons/loaders/PCDLoader.js";

// HELPER/UTIL FUNCTIONS
const deg_to_rad = (deg) => (deg * Math.PI) / 180.0;

let container, camera, scene, renderer;
let sceneL, sceneR;

init();
render();

function init() {
  container = document.querySelector(".container");

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    50, // fov gives a fish eye effect
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  // sets the camera to Top View and adjust initial zoom
  camera.position.set(0, 0, 300);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // TODO: reset button to get control to initial state
  scene.add(camera);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener("change", render); // use if there is no animation loop
  controls.minDistance = 10;
  controls.maxDistance = 500;

  const loader = new PCDLoader();
  // 'points' is an Object3D
  loader.load("./odm_georeferenced_model_subsampled.pcd", function (points) {
    points.geometry.center();
    points.name = "river.pcd";

    // Rotation uses Euler angle in rad
    // z rotation: positive is counter-clockwise, negative is clockwise
    points.rotation.z = deg_to_rad(55); // make it horizontal rectangle from top view
    // x rotation: positive rotates towards user view, negative increases the angle away from the user view
    // points.rotation.x = -deg_to_rad(90);
    // y rotation: at this point, like the pitch angle
    points.rotation.y = deg_to_rad(10);

    // Set static size
    points.material.size = 1.2;
    points.material.color.setHex(0xff0000); // this set color of point cloud to red

    scene.add(points);

    render();
  });

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render();
}

function render() {
  renderer.render(scene, camera);
}
