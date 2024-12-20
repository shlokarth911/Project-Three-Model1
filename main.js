import "./style.css"; //import style
import * as THREE from "three"; //import three.js
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"; //import EffectComposer
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"; //import RenderPass
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"; //import UnrealBloomPass
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"; //import GLTFLoader
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; //import OrbitControls

// Initialize Lenis
const lenis = new Lenis();

// Use requestAnimationFrame to continuously update the scroll
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

raf();

//scene
const scene = new THREE.Scene();
//camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.z = 1.9;
camera.position.y = 0.05;

//renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#canvas"),
  antialias: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

//composer
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

//bloom
const bloomPass = new UnrealBloomPass();
bloomPass.threshold = 0.5;
bloomPass.strength = 1;
bloomPass.radius = 0.5;
composer.addPass(bloomPass);

//controls
let controls;
if (
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
) {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
}

let model;
let targetRotationX = 0;
let targetRotationY = 0;
let currentRotationX = 0;
let currentRotationY = 0;
const rotationSpeed = 0.06;

// Load GLTF model
const loader = new GLTFLoader();
loader.load(
  "./DamagedHelmet.gltf",
  (gltf) => {
    model = gltf.scene;
    scene.add(model);
  },
  undefined,
  (error) => {
    console.error("An error occurred while loading the model", error);
  }
);

// Add lighting
const ambientLight = new THREE.AmbientLight("#2f1bc4", 3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight("#6117d1", 3);
directionalLight.position.set(10, 10, 7.5);
scene.add(directionalLight);
const directionalLight2 = new THREE.RectAreaLight("#028dff", 7);
directionalLight2.position.set(0, 5, 2);
scene.add(directionalLight2);
const directionalLight3 = new THREE.DirectionalLight("#252ce8", 3);
directionalLight3.position.set(10, 5, 0);
scene.add(directionalLight3);

//animation
function animate() {
  requestAnimationFrame(animate);

  if (model) {
    currentRotationX += (targetRotationX - currentRotationX) * rotationSpeed;
    currentRotationY += (targetRotationY - currentRotationY) * rotationSpeed;
    model.rotation.x = currentRotationX;
    model.rotation.y = currentRotationY;
  }

  if (controls) {
    controls.update();
  }

  composer.render();
}
animate();

window.addEventListener("mousemove", (event) => {
  const mouseX = (window.innerWidth / 2 - event.clientX) / 1000;
  const mouseY = (window.innerHeight / 2 - event.clientY) / 1000;
  targetRotationX = -mouseY;
  targetRotationY = -mouseX;
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

//animation using gsap
const navBtn = document.querySelector(".nav-btn");
let flag = true;
navBtn.addEventListener("click", () => {
  if (flag == false) {
    flag = true;
    navBtn.textContent = "OPEN";
    let tl = gsap.timeline();

    tl.to(".nav-main a ", {
      fontSize: 0,
      duration: 0.1,
    });

    tl.to(".nav-main", {
      height: "2vw",
      width: "2vw",
      padding: "0vw",
      duration: 0.5,
      ease: "power1.out",
    });

    tl.to(".nav-main", {
      height: "0vw",
      width: "0vw",
      padding: "0vw",
      transform: "translate(0vw, -10vw)",
      duration: 0.5,
      ease: "power1.out",
    });
  } else if (flag == true) {
    flag = false;
    let tl = gsap.timeline();
    navBtn.textContent = "CLOSE";

    tl.to(".nav-main", {
      height: "2vw",
      width: "2vw",
      padding: "0vw",
      transform: "translate(0vw, 0vw)",
      duration: 0.5,
      ease: "power1.out",
    });

    tl.to(".nav-main", {
      height: "auto",
      width: "auto",
      padding: "1vw 3vw",
      duration: 0.5,
    });

    tl.to(".nav-main a ", {
      fontSize: "1.5vw",
      duration: 0.1,
    });
  }
});
