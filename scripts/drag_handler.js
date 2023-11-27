import * as THREE from 'three';
import * as _3d from './3d.js';
var draggedObject = null;
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
var selected = null;

// Mouse position offset for smoother dragging
var mouseOffset = new THREE.Vector3();
function register_handler(ele,data) {
    
    function onMaterialMouseDown(event) {
        event.preventDefault();

        // Create a new mesh based on the material clicked in the sidebar
        var size = new THREE.BoxGeometry(data.properties.size.default_width, data.properties.size.default_height, data.properties.size.default_depth)
        var material = new THREE.MeshBasicMaterial({ color: "#"+data.properties.colors[0] });
        draggedObject = new THREE.Mesh(size, material);

        // Calculate the offset between the mouse click position and the center of the dragged object
        draggedObject.position.set(0,0,0);

        // Add the object to the scene
        _3d.blocks.push(draggedObject);
        _3d.scene.add(draggedObject);
    }
    // Add event listeners
    ele.addEventListener('mousedown', onMaterialMouseDown, false);

}
function onpointermove(event) {
    pointer.x = ( event.clientX / _3d.renderer.domElement.offsetWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / _3d.renderer.domElement.offsetHeight ) * 2 + 1;
    console.log( pointer.x, pointer.y );
}
function selected_func() {

    raycaster.setFromCamera( pointer, _3d.camera ); 
    let intersects = raycaster.intersectObjects( _3d.blocks );
    if ( intersects.length > 0) {
        console.log(intersects);
        console.log(_3d.blocks);
        intersects[ 0 ].material = THREE.MeshBasicMaterial({color: 0xff00ff})
        _3d.renderer.render( scene, camera );
    }
    

}
_3d.renderer.domElement.addEventListener("mousemove",onpointermove,false);
setInterval(selected_func,10)
export {register_handler,pointer,selected};

