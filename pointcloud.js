/**
 * TASK - Description (?): Add an 1-line short description of this task
 * TASK - Give yourself some credit: Add your name as an author
 * Author: Rebeca Nunes Rodrigues (rebeca.n.rod@gmail.com)
 */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { PCDLoader } from "three/addons/loaders/PCDLoader.js";

let camera, renderer, controls;
// TASK - MeaningNames: Rename l to leftScene, r to rightScene, load to leftSpinner, loading to rightSpinner
let l, r;
let load, loading;

// TASK - Comments: Add a comment for this group of variables
let slider;
let sliderPos;

// point cloud data files
// TASK - Intention-Revealing, Avoid the Chaos: Fix the dates in the variables names
const url2017 = "./aariver_2018.pcd";
const url2020 = "./aariver_2024.pcd";

document.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  // TASK - Avoid Train Wrecks: Declare variables for the container and for the slider
  // TASK - Abstraction: Create the function initializeVariables()
  // container = document.querySelector(".container");
  slider = document.querySelector(".slider");

  sliderPos = document.querySelector(".container").clientWidth / 2;
  load = document.querySelector(".loading-left");
  loading = document.querySelector(".loading-right");

  // TASK - Small Function, Do One Thing, Abstraction: Create function prepareScenes()
  l = new THREE.Scene();
  l.background = new THREE.Color(0xbcd48f);
  r = new THREE.Scene();
  r.background = new THREE.Color(0x8fbcd4);

  // TASK - Small Function, Do One Thing, Abstraction: Create function prepareCamera()
  camera = new THREE.PerspectiveCamera(
    50, // fov gives a fish eye effect
    document.querySelector(".container").clientWidth /
      document.querySelector(".container").clientHeight,
    0.1,
    2000
  );
  // sets the camera to Top View and adjust initial zoom
  camera.position.set(0, 0, 300);

  // TASK - Small Function, Do One Thing, Abstraction: Create function prepareRenderer()
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(
    document.querySelector(".container").clientWidth,
    document.querySelector(".container").clientHeight
  );
  renderer.setScissorTest(true);
  document.querySelector(".container").appendChild(renderer.domElement);

  // TASK - Small Function, Do One Thing, Abstraction: Create function prepareControls()
  controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener("change", animate);

  window.addEventListener("resize", onWindowResize);

  drawSlider();

  drawPointclouds();
}

// FOR ME: ADD COMMENT
function drawSlider() {
  slider.style.visibility = "hidden";

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

  // FOR ME: ADD COMMENT
  function onPointerMove(e) {
    if (event.isPrimary === false) return;

    // FOR ME: CREATE TASK ABOUT REMOVING COMMENTS
    // Check if pointer position (pageX) is inside the container
    // sliderPos = Math.max(0, Math.min(window.innerWidth, e.pageX));

    // FOR ME: CREATE TASK ABOUT TRAIN WRECKS
    const leftContainer = document.querySelector(".container").offsetLeft;
    const rightContainer =
      document.querySelector(".container").clientWidth +
      document.querySelector(".container").offsetLeft;
    sliderPos = Math.max(0, Math.min(rightContainer, e.pageX) - leftContainer);

    slider.style.left = sliderPos - slider.offsetWidth / 4 + "px";

    animate();
  }

  // FOR ME: ADD COMMENT
  slider.style.touchAction = "none"; // disable touch scroll
  slider.addEventListener("pointerdown", onPointerDown);
}

// FOR ME: ADD COMMENT
function drawPointclouds() {
  const loader = new PCDLoader();

  // rotationZ is 55 to make it horizontal rectangle from top view
  drawPointcloud(load, loader, url2017, l, 10, -6, 55);

  drawPointcloud(loading, loader, url2020, r, 0, 0, 55);
}

// FOR ME: CREATE TASK
function drawPointcloud(
  loadingSpinner,
  loader,
  url,
  scene,
  translateX,
  translateY,
  rotationZ
) {
  loadingSpinner.style.visibility = "visible";

  // 'points' is an Object3D
  loader.load(url, function (points) {
    points.geometry.center();

    adjustPosition(points, translateX, translateY, rotationZ);

    // Set static size
    points.material.size = 1.2;

    scene.add(points);
    animate();
    loadingSpinner.style.visibility = "hidden";
  });
}

// FOR ME: CREATE TASK
function adjustPosition(pointcloud, translateX, translateY, rotationZ) {
  const deg_to_rad = (deg) => (deg * Math.PI) / 180.0;

  // Rotation uses Euler angle in rad
  // z rotation: positive is counter-clockwise, negative is clockwise
  pointcloud.rotation.z = deg_to_rad(rotationZ);
  pointcloud.translateX(translateX);
  pointcloud.translateY(translateY);
}

// FOR ME: ADD COMMENT
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

// FOR ME: ADD COMMENT
function animate() {
  slider.style.visibility = "visible";

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
