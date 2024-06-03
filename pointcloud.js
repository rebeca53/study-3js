/**
 * Code from three.js examples
 */
import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { PCDLoader } from "three/addons/loaders/PCDLoader.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

let camera, scene, renderer;

init();
render();

function init() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );

  camera.position.set(0, 0, 1); // sets the camera to Top View
  // TODO: adjust initial zoom
  // TODO: generate static version to embed on a webpage
  // TODO: reset button to get control to initial state
  // camera.zoom = 0.5;
  scene.add(camera);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener("change", render); // use if there is no animation loop
  controls.minDistance = 10;
  controls.maxDistance = 500;

  const loader = new PCDLoader();
  // points is an Object3D
  loader.load("./odm_georeferenced_model_subsampled.pcd", function (points) {
    points.geometry.center();
    points.name = "River.pcd";

    const gui = new GUI();

    // Set static size
    points.material.size = 1.2;
    points.material.color.setHex(0xffffff); // this set color of point cloud to red
    // gui.add(points.material, "size", 0.05, 1.5).onChange(render);
    // gui.addColor(points.material, "color").onChange(render);
    gui.open();

    scene.add(points);

    render();
  });

  loader.load("./odm_georeferenced_model_subsampled.pcd", function (points) {
    points.geometry.center();
    points.name = "River_past.pcd";

    const gui = new GUI();

    // Set static size
    points.material.size = 1.2;
    points.material.color.setHex(0xff0000); // this set color of point cloud to red
    // gui.add(points.material, "size", 0.05, 1.5).onChange(render);
    // gui.addColor(points.material, "color").onChange(render);
    gui.open();

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
