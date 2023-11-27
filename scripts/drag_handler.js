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
        draggedObject.position.set(0,0,data.properties.size.default_depth/2);

        // Add the object to the scene
        _3d.blocks.push(draggedObject);
        _3d.scene.add(draggedObject);
    }
    // Add event listeners
    ele.addEventListener('mousedown', onMaterialMouseDown, false);

}
function onpointermove(event) {
    const rect = _3d.renderer.domElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    pointer.x = ( x / rect.width ) *  2 - 1;
    pointer.y = ( y / rect.height) * - 2 + 1
    
}
function selected_func() {
    
    raycaster.setFromCamera( pointer, _3d.camera ); 
    let intersects = raycaster.intersectObjects( _3d.blocks );
    if ( intersects.length > 0) {
        selected = intersects[0];
        _3d.renderer.render( _3d.scene, _3d.camera );
    } else {
        selected = null;
    }
}
function handle_keyboard(event) {
    event.preventDefault();
    
    if ( selected ) {
        console.log(event);
        if (event.which === 38) {
            selected.object.position.y += 0.05;
        } else if (event.which === 40) {
            selected.object.position.y -= 0.05;
        } else if (event.which === 39) {
            selected.object.position.x += 0.05;
        } else if (event.which === 38) {
            selected.object.position.x -= 0.05;
        }
    }
}
_3d.renderer.domElement.addEventListener("mousemove",onpointermove,false);
document.addEventListener("keydown",handle_keyboard);
setInterval(selected_func,10)
export {register_handler,pointer,selected};

