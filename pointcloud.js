/**
 * Point Cloud Comparison using Three.js
 * Author: Rebeca Nunes Rodrigues (rebeca.n.rod@gmail.com)
 */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { PCDLoader } from "three/addons/loaders/PCDLoader.js";

// HELPER/UTIL FUNCTIONS
const deg_to_rad = (deg) => (deg * Math.PI) / 180.0;

let container, camera, renderer, controls;
let sceneL, sceneR;
let sliderPos;
const url2022 = "./odm_georeferenced_model_subsampled.pcd";
const url2024 = "./cloud8786d920b00cdd1a_subsampled.pcd";
document.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  container = document.querySelector(".container");
  sliderPos = window.innerWidth / 2;

  sceneL = new THREE.Scene();
  sceneL.background = new THREE.Color(0xbcd48f);

  sceneR = new THREE.Scene();
  sceneR.background = new THREE.Color(0x8fbcd4);

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
  renderer.setScissorTest(true);
  container.appendChild(renderer.domElement);

  // TODO: reset button to get control to initial state
  controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener("change", animate);

  initSlider();
  initMeshes();

  window.addEventListener("resize", onWindowResize);
}

function initSlider() {
  const slider = document.querySelector(".slider");

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
    sliderPos = Math.max(0, Math.min(window.innerWidth, e.pageX));
    // const leftContainer = container.offsetLeft;
    // const rightContainer = container.clientWidth + container.offsetLeft;
    // sliderPos = Math.max(0, Math.min(rightContainer, e.pageX) - leftContainer);

    slider.style.left = sliderPos - slider.offsetWidth / 2 + "px";
    animate();
  }

  slider.style.touchAction = "none"; // disable touch scroll
  slider.addEventListener("pointerdown", onPointerDown);
}

function initMeshes() {
  const loader = new PCDLoader();
  // 'points' is an Object3D
  loader.load(url2022, function (points) {
    // loader.load("./odm_georeferenced_model_subsampled.pcd", function (points) {
    points.geometry.center();
    points.name = "river.pcd";

    // Rotation uses Euler angle in rad
    // z rotation: positive is counter-clockwise, negative is clockwise
    points.rotation.z = deg_to_rad(55); // make it horizontal rectangle from top view
    // x rotation: positive rotates towards user view, negative increases the angle away from the user view
    // points.rotation.x = -deg_to_rad(90);
    // y rotation: at this point, like the pitch angle
    // points.rotation.y = deg_to_rad(10);

    points.translateX(10);
    points.translateY(-6);

    let scale = 1.1;
    points.scale.set(scale, scale, scale);
    // Set static size
    points.material.size = 1.2;

    sceneL.add(points);
    animate();
  });

  // 'points' is an Object3D
  loader.load(url2024, function (points) {
    // loader.load("./cloud8786d920b00cdd1a_subsampled.pcd", function (points) {
    points.geometry.center();
    points.name = "river2024.pcd";

    // Rotation uses Euler angle in rad
    // z rotation: positive is counter-clockwise, negative is clockwise
    points.rotation.z = deg_to_rad(55); // make it horizontal rectangle from top view
    // x rotation: positive rotates towards user view, negative increases the angle away from the user view
    // points.rotation.x = -deg_to_rad(90);
    // y rotation: at this point, like the pitch angle
    // points.rotation.y = deg_to_rad(10);

    // Set static size
    points.material.size = 1.2;

    sceneR.add(points);
    animate();
  });
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  renderer.setScissor(0, 0, sliderPos, window.innerHeight);
  renderer.render(sceneL, camera);

  renderer.setScissor(sliderPos, 0, window.innerWidth, window.innerHeight);
  renderer.render(sceneR, camera);
}
