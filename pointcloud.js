/**
 * Point Cloud Comparison using Three.js
 * TASK 12 - Documentation, Authorship: Add your name as a co-author
 * Co-author: Rebeca Nunes Rodrigues (rebeca.n.rod@gmail.com)
 */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { PCDLoader } from "three/addons/loaders/PCDLoader.js";

let camera, renderer, controls;
// TASK 1 - Distinct and Searchable Names: Rename l to leftScene, r to rightScene, load to leftSpinner, loading to rightSpinner
let l, r;
let load, loading;
// TASK 11 - Avoid Train Wrecks: Declare variables for the container and for the slider
let sliderPos;

// point cloud data files
// TASK 2 - Intention-Revealing, Avoid the Chaos: Fix the dates in the variables names
const url2017 = "./aariver_2018.pcd";
const url2020 = "./aariver_2024.pcd";

document.addEventListener("DOMContentLoaded", () => {
  init();
});

// TASK 13 - Redundant and mandated comments: Remove the comment below
/**
 * Initialize
 */
function init() {
  // TASK 11 - Avoid Train Wrecks: Declare variables for the container and for the slider
  // TASK 3 - Small Function, Do One Thing, Abstraction: Create function initializeVariables()
  sliderPos = document.querySelector(".container").clientWidth / 2;
  load = document.querySelector(".loading-left");
  loading = document.querySelector(".loading-right");

  // TASK 4 - Small Function, Do One Thing, Abstraction: Create function prepareScenes()
  l = new THREE.Scene();
  l.background = new THREE.Color(0xbcd48f);
  r = new THREE.Scene();
  r.background = new THREE.Color(0x8fbcd4);

  // TASK 5 - Small Function, Do One Thing, Abstraction: Create function prepareCamera()
  camera = new THREE.PerspectiveCamera(
    50, // fov gives a fish eye effect
    document.querySelector(".container").clientWidth /
      document.querySelector(".container").clientHeight,
    0.1,
    2000
  );
  // sets the camera to Top View and adjust initial zoom
  camera.position.set(0, 0, 300);

  // TASK 6 - Small Function, Do One Thing, Abstraction: Create function prepareRenderer()
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(
    document.querySelector(".container").clientWidth,
    document.querySelector(".container").clientHeight
  );
  renderer.setScissorTest(true);
  document.querySelector(".container").appendChild(renderer.domElement);

  // TASK 7 - Small Function, Do One Thing, Abstraction: Create function prepareControls()
  controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener("change", animate);

  window.addEventListener("resize", onWindowResize);

  // TASK 8 - Small Function, Do One Thing, Abstraction: Create function prepareCanvas()
  drawSlider();

  drawPointclouds();
}

function drawSlider() {
  document.querySelector(".slider").style.visibility = "hidden";

  function onPointerDown() {
    if (event.isPrimary === false) return;

    controls.enabled = false;

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  }

  function onPointerUp() {
    controls.enabled = true;

    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
  }

  function onPointerMove(e) {
    if (event.isPrimary === false) return;

    // Check if pointer position (pageX) is inside the container
    // TASK 14 - TODO, Commented-out code: Complete the TODO task
    // TODO: Remove commented-out code
    // sliderPos = Math.max(0, Math.min(window.innerWidth, e.pageX));
    const leftContainer = document.querySelector(".container").offsetLeft;
    const rightContainer =
      document.querySelector(".container").clientWidth +
      document.querySelector(".container").offsetLeft;
    sliderPos = Math.max(0, Math.min(rightContainer, e.pageX) - leftContainer);

    document.querySelector(".slider").style.left =
      sliderPos - document.querySelector(".slider").offsetWidth / 4 + "px";

    animate();
  }

  document.querySelector(".slider").style.touchAction = "none"; // disable touch scroll
  document
    .querySelector(".slider")
    .addEventListener("pointerdown", onPointerDown);
}

function drawPointclouds() {
  const loader = new PCDLoader();

  // TASK 9 - Don't Repeat Yourself: Create function drawPointCloud and call it for each point cloud
  // TASK 10 - Data Structure: Use a data structure to represent a loadablePointCloud
  load.style.visibility = "visible";
  loading.style.visibility = "visible";

  // 'points' is an Object3D
  loader.load(url2017, function (points) {
    points.geometry.center();

    // rotationZ is 55 to make it horizontal rectangle from top view
    adjustPosition(points, 10, -6, 55);

    // Set static size
    points.material.size = 1.2;

    l.add(points);
    animate();
    load.style.visibility = "hidden";
  });

  // 'points' is an Object3D
  loader.load(url2020, function (points) {
    points.geometry.center();

    // rotationZ is 55 to make it horizontal rectangle from top view
    adjustPosition(points, 0, 0, 55);

    // Set static size
    points.material.size = 1.2;

    r.add(points);
    animate();
    loading.style.visibility = "hidden";
  });
}

// TASK 15 - Documentation, JSDoc: Add a comment describing what adjustPosition is doing
function adjustPosition(points, translateX, translateY, rotationZ) {
  const deg_to_rad = (deg) => (deg * Math.PI) / 180.0;

  // Rotation uses Euler angle in rad
  // z rotation: positive is counter-clockwise, negative is clockwise
  points.rotation.z = deg_to_rad(rotationZ);
  points.translateX(translateX);
  points.translateY(translateY);
}

// TASK 16 - Documentation, JSDoc: Add a comment describing what onWindowResize is doing
function onWindowResize() {
  camera.aspect =
    document.querySelector(".container").clientWidth /
    document.querySelector(".container").clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(
    document.querySelector(".container").clientWidth,
    document.querySelector(".container").clientHeight
  );
}

/**
 * Update slider position and render the scenes
 */
function animate() {
  document.querySelector(".slider").style.visibility = "visible";

  renderer.setScissor(
    0,
    0,
    sliderPos,
    document.querySelector(".container").clientHeight
  );
  renderer.render(l, camera);

  renderer.setScissor(
    sliderPos,
    0,
    document.querySelector(".container").clientWidth,
    document.querySelector(".container").clientHeight
  );
  renderer.render(r, camera);
}
