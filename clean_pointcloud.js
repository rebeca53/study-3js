/**
 * Point Cloud Comparison using Three.js
 * Author: Rebeca Nunes Rodrigues (rebeca.n.rod@gmail.com)
 */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { PCDLoader } from "three/addons/loaders/PCDLoader.js";

// Three.js related
let container, camera, renderer, controls;
let loadingLeft, loadingRight;
let leftScene, rightScene;
let slider;
let sliderPos;

const url2018 = "./odm_georeferenced_model_subsampled.pcd";
const url2024 = "./cloud8786d920b00cdd1a_subsampled.pcd";

document.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  prepareCanvas();

  drawSlider();

  drawPointclouds();
}

function prepareCanvas() {
  initializeVariables();

  prepareScenes();

  prepareCamera();

  prepareRenderer();

  prepareControls();

  window.addEventListener("resize", onWindowResize);
}

function initializeVariables() {
  container = document.querySelector(".container");
  sliderPos = container.clientWidth / 2;
  loadingLeft = document.querySelector(".loading-left");
  loadingRight = document.querySelector(".loading-right");
  slider = document.querySelector(".slider");
}

function prepareScenes() {
  leftScene = new THREE.Scene();
  leftScene.background = new THREE.Color(0xbcd48f);

  rightScene = new THREE.Scene();
  rightScene.background = new THREE.Color(0x8fbcd4);
}

function prepareCamera() {
  camera = new THREE.PerspectiveCamera(
    50, // fov gives a fish eye effect
    container.clientWidth / container.clientHeight,
    0.1,
    2000
  );
  // sets the camera to Top View and adjust initial zoom
  camera.position.set(0, 0, 300);
}

function prepareRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setScissorTest(true);
  container.appendChild(renderer.domElement);
}

function prepareControls() {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener("change", animate);
}

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

  function onPointerMove(e) {
    if (event.isPrimary === false) return;

    // Check if pointer position (pageX) is inside the container
    // sliderPos = Math.max(0, Math.min(window.innerWidth, e.pageX));

    const leftContainer = container.offsetLeft;
    const rightContainer = container.clientWidth + container.offsetLeft;
    sliderPos = Math.max(0, Math.min(rightContainer, e.pageX) - leftContainer);

    slider.style.left = sliderPos - slider.offsetWidth / 4 + "px";

    animate();
  }

  slider.style.touchAction = "none"; // disable touch scroll
  slider.addEventListener("pointerdown", onPointerDown);
}

function drawPointclouds() {
  const loader = new PCDLoader();

  // rotationZ is 55 to make it horizontal rectangle from top view
  const leftLoadablePointCloud = {
    url: url2018,
    translateX: 10,
    translateY: -6,
    rotationZ: 55,
  };
  drawPointcloud(loadingLeft, loader, url2018, leftScene, 10, -6, 55);

  const rightLoadablePointCloud = {
    url: url2024,
    translateX: 0,
    translateY: 0,
    rotationZ: 55,
  };
  drawPointcloud(loadingRight, loader, url2024, rightScene, 0, 0, 55);
}

function drawPointcloud(loadingSpinner, loader, scene, loadablePointCloud) {
  let url = loadablePointCloud.url;
  let translateX = loadablePointCloud.translateX;
  let translateY = loadablePointCloud.translateY;
  let rotationZ = loadablePointCloud.rotationZ;

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

function adjustPosition(pointcloud, translateX, translateY, rotationZ) {
  const deg_to_rad = (deg) => (deg * Math.PI) / 180.0;

  // Rotation uses Euler angle in rad
  // z rotation: positive is counter-clockwise, negative is clockwise
  pointcloud.rotation.z = deg_to_rad(rotationZ);
  pointcloud.translateX(translateX);
  pointcloud.translateY(translateY);
}

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
}

function animate() {
  slider.style.visibility = "visible";

  renderer.setScissor(0, 0, sliderPos, container.clientHeight);
  renderer.render(leftScene, camera);

  renderer.setScissor(
    sliderPos,
    0,
    container.clientWidth,
    container.clientHeight
  );
  renderer.render(rightScene, camera);
}
