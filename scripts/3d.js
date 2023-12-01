
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { Sky } from 'three/addons/objects/Sky.js';

const _3d_viewer = document.getElementById('3d-viewer');
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, _3d_viewer.offsetWidth / document.body.offsetHeight, 0.1, 1000);
var blocks = [];
var map = "";
function init_sky() {
    let sky = new Sky();
    let sun = new THREE.Vector3();
    sky.scale.setScalar( 450000 );
    const uniforms = sky.material.uniforms;
    uniforms[ 'turbidity' ].value = 10;
    uniforms[ 'rayleigh' ].value = 3;
    uniforms[ 'mieCoefficient' ].value = 0.005;
    uniforms[ 'mieDirectionalG' ].value = 0.7;

    const phi = THREE.MathUtils.degToRad( 90 - 2 );
    const theta = THREE.MathUtils.degToRad( 0 );

    sun.setFromSphericalCoords( 1, phi, theta );

    uniforms[ 'sunPosition' ].value.copy( sun );

    scene.add( sky );
}
init_sky();
// Specify the 3D viewer div as the container for the renderer
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(_3d_viewer.offsetWidth, document.body.offsetHeight);
_3d_viewer.appendChild(renderer.domElement);
renderer.toneMappingExposure = 0.5
renderer.toneMapping = THREE.ACESFilmicToneMapping;
// Add OrbitControls
var controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxDistance = 1000;
var planeGeometry = new THREE.PlaneGeometry(100,100.2,1,1); //size of plot in meters followed by grid size 100m/10=10m spacing
var planeMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, side: THREE.DoubleSide,wireframe: true});
var planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);

camera.position.z = 120;

var animate = function () {
    requestAnimationFrame(animate);

    // Update controls
    controls.update();
    
    // camera.rotation.y ++;
    renderer.render(scene, camera);
};
if ( WebGL.isWebGLAvailable() ) {

	// Initiate function or other initializations here
	animate();

} else {

	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );

}

function modify_plane(data_block) {
    let dimensions = data_block.dimensions;
    planeMesh.scale.set(dimensions[1]/100,dimensions[0]/100,1);
    console.log(data_block);
    console.log(planeMesh);
    new THREE.TextureLoader().load(
        data_block.url, 
        texture => { 
                planeMesh.material = new THREE.MeshBasicMaterial({map:texture});
                planeMesh.material.map.needsUpdate = true;
        }
    )
}

export {camera,renderer,scene,blocks,modify_plane};