import * as THREE from 'three';
import * as _3d from './3d.js';
import * as _properties from './properties.js';
var draggedObject = null;
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
var selected = null;

// Mouse position offset for smoother dragging
function register_handler(ele, data) {

    function onMaterialMouseDown(event) {
        event.preventDefault();

        // Create a new mesh based on the material clicked in the sidebar
        var size = new THREE.BoxGeometry(data.properties.size.default_width, data.properties.size.default_height, data.properties.size.default_depth)
        if (data.properties.colors !== "all") {
            var material = new THREE.MeshBasicMaterial({ color: "#" + data.properties.colors[0] });
        } else {
            var material = new THREE.MeshBasicMaterial({ color: "red" });
        }
        draggedObject = new THREE.Mesh(size, material);
        draggedObject.userData.data = data;
        // Calculate the offset between the mouse click position and the center of the dragged object
        draggedObject.position.set(0, 0, data.properties.size.default_depth / 2);
        _3d.camera.position.z = 20 + draggedObject.position.z;
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

    pointer.x = (x / rect.width) * 2 - 1;
    pointer.y = (y / rect.height) * - 2 + 1

}
function selected_func() {

    raycaster.setFromCamera(pointer, _3d.camera);
    let intersects = raycaster.intersectObjects(_3d.blocks);
    _properties.unregister_materials(selected);//don't actually delete it, just remove it from materials manager
    if (intersects.length > 0) {
        do {
            if (intersects.length === 0) {
                intersects.push(selected)
            }
            if (intersects[0].object.userData.hasOwnProperty("data")) {
                break;
            }
            intersects.pop()
        } while (true)
        if (selected) { if (selected.object.uuid === intersects[0].object.uuid) { return; } } //dont't call it if it's already selected
        selected = intersects[0];
        _properties.set_materials_manager(selected.object.userData.data, selected.object);
        _3d.renderer.render(_3d.scene, _3d.camera);
    } else {

        selected = null;
    }
}
function handle_keyboard(event) {//move object


    if (selected) {
        if (event.keyCode === 38) {
            event.preventDefault();
            selected.object.position.y += 0.05;
        } else if (event.keyCode === 40) {
            event.preventDefault();
            selected.object.position.y -= 0.05;
        } else if (event.keyCode === 39) {
            event.preventDefault();
            selected.object.position.x += 0.05;
        } else if (event.keyCode === 37) {
            event.preventDefault();
            selected.object.position.x -= 0.05;
        } else if (event.keyCode === 8) {
            event.preventDefault();
            let UUID = selected.object.uuid;
            let id=-1;
            for (let i=0;i<_3d.blocks.length;i++) {
                if (_3d.blocks[i].uuid === UUID) {
                    id = 1
                }
            }
            _properties.unregister_materials(selected.object);
            _3d.scene.remove(selected.object);
            console.log(id)
            _3d.blocks.pop(id);
            selected = null;
        
        } 
        _3d.renderer.render(_3d.scene, _3d.camera);
    }
}
_3d.renderer.domElement.addEventListener("mousemove", onpointermove, false);
document.addEventListener("keydown", handle_keyboard);
_3d.renderer.domElement.addEventListener("click", selected_func)
export { register_handler, pointer, selected };

