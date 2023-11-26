
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import WebGL from 'three/addons/capabilities/WebGL.js';

const _3d_viewer = document.getElementById('3d-viewer');
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, _3d_viewer.offsetWidth / document.body.offsetHeight, 0.1, 1000);

// Specify the 3D viewer div as the container for the renderer
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(_3d_viewer.offsetWidth, document.body.offsetHeight);
_3d_viewer.appendChild(renderer.domElement);

// Add OrbitControls
var controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;

var planeGeometry = new THREE.PlaneGeometry(1,1);
var planeMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, side: THREE.DoubleSide });
var planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);

camera.position.z = 5;
camera.rotation.z = 50;
var animate = function () {
    requestAnimationFrame(animate);

    // Update controls
    controls.update();

    renderer.render(scene, camera);
};
if ( WebGL.isWebGLAvailable() ) {

	// Initiate function or other initializations here
	animate();

} else {

	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );

}