import * as THREE from 'three';
import * as _3d from './3d.js';
import * as _properties from './properties.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

var draggedObject = null;
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
var selected = null;



// Mouse position offset for smoother dragging
function register_handler(ele, data) {

    function onMaterialMouseDown(event) {
        event.preventDefault();

        // Create a new mesh based on the material clicked in the sidebar
        if (data.type === 'raw_material') {
            var size = new THREE.BoxGeometry(data.properties.size.default_width, data.properties.size.default_height, data.properties.size.default_depth)
            if (data.properties.colors !== "all") {
                var color = new THREE.Color("#"+data.properties.colors[0])
                
            } else {
                var color = new THREE.Color("red")
            }
            var material = new THREE.MeshBasicMaterial({ color: color, transparent: data.properties.opacity !== 1, opacity:data.properties.opacity});
            draggedObject = new THREE.Mesh(size, material);
            draggedObject.userData.data = data;
            // Calculate the offset between the mouse click position and the center of the dragged object
            draggedObject.position.set(0, 0, data.properties.size.default_depth / 2);
            _3d.camera.position.z = 20 + draggedObject.position.z;
            // Add the object to the scene
            _3d.blocks.push(draggedObject);
            _3d.scene.add(draggedObject);
            _properties.set_materials_manager(draggedObject.userData.data,draggedObject);
        } else if (data.type === 'obj') {
            let mtlLoader = new MTLLoader();
            mtlLoader.load(data.properties.mtl_file, function(materials)
            {
                materials.preload();
                var objLoader = new OBJLoader();
                var mats = {};
                Object.keys(materials.materials).forEach(function (key) {
                    let mat = materials.materials[key];
                    mat.color = new THREE.Color(mat.color.r * 255, mat.color.g * 255, mat.color.b * 255);
                    mats[key] = mat;
                });
                materials.materials = mats;
                objLoader.setMaterials(materials);
                
                objLoader.load(data.properties.obj_file, function(object)
                {    
                    var group = new THREE.Mesh();
                    var geom = [];
                    object.traverse(function(child) {
                        if (child instanceof THREE.Mesh) {
                            // if (child.material.color.r + child.material.color.g + child.material.color.b < 3) {
                                
                            //     child.material.color.set(child.material.color.r * 255, child.material.color.g * 255, child.material.color.b * 255);
                            // }
                            console.log(child.material.color)
                            var mesh = new THREE.Mesh( child.geometry, new THREE.MeshBasicMaterial({color: 0xff0000}));
                            group.add(mesh);
                            geom.push(mesh.geometry);
                        }
                        
                    });
                    geom = BufferGeometryUtils.mergeGeometries(geom);
                    geom.computeBoundingBox();
                    
                    group.userData.data = data;
                    console.log(geom)
                    group.position.set(0,0,(geom.boundingBox.max.z));
                    group.rotation.set(THREE.MathUtils.degToRad(data.properties.rotation.x),THREE.MathUtils.degToRad(data.properties.rotation.y),THREE.MathUtils.degToRad(data.properties.rotation.z));
                    group.geometry = geom;
                    _3d.camera.position.z = 20 + group.position.z;
                    _3d.blocks.push(group);
                    
                    _3d.scene.add( group );
                    _properties.set_materials_manager(data,group);
                });
            });
        }
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
            if (intersects.length === 0 || intersects[0] === null) {
                return;
            }
            
            if (!(intersects[0].object instanceof THREE.LineSegments)) {
                if (intersects[0].object.parent instanceof THREE.Group) {
                    intersects[0] = {object:intersects[0].object.parent,distance:intersects[0].distance}
                    console.log(intersects[0].object)
                }
                break;
            }
        
            intersects.pop()
        } while (true)
        if (selected) { if (selected.object.uuid === intersects[0].object.uuid) { return; } } //dont't call it if it's already selected
        selected = intersects[0];
        _properties.set_materials_manager(selected.object.userData.data, selected.object);
        _3d.camera.position.set(selected.object.position.x, selected.object.position.y, selected.object.parent.position.x + 20);
        _3d.camera.rotation.set(0,0,0);
        _3d.camera.rotation.needsUpdate = true;
        console.log(_3d.camera)
        _3d.controls.update();
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
            if (selected !== null && event.srcElement === document.body) {
                event.preventDefault();
                let UUID = selected.object.uuid;
                let id=-1;
                for (let i=0;i<_3d.blocks.length;i++) {
                    if (_3d.blocks[i].uuid === UUID) {
                        id = 1
                    }
                }
                _properties.unregister_materials(selected);
                _3d.scene.remove(selected.object);
                console.log(id)
                _3d.blocks.pop(id);
                selected = null;
            }
        } 
        _3d.renderer.render(_3d.scene, _3d.camera);
    }
}
function save(blob, filename) {
    const link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    document.body.removeChild(link);
  
    // URL.revokeObjectURL( url ); breaks Firefox...
  }
function ondownload() {
    const exporter = new GLTFExporter();
    for (let i =0; i < _3d.scene.children.length;i++){
        let child = _3d.scene.children[i];
        if(child instanceof _3d.Sky) {
            child.visible = false;
        }
    }
    
    exporter.parse(
        _3d.scene,
        // called when the gltf has been generated
        function ( gltf ) {
    
            console.log( gltf );
            save(new Blob([gltf], { type: 'application/octet-stream' }), "world.glb");
            for (let i =0; i < _3d.scene.children.length;i++){
                let child = _3d.scene.children[i];
                if(child instanceof _3d.Sky) {
                    child.visible = false;
                }
            }
    
        },
        // called when there is an error in the generation
        function ( error ) {
    
            console.log( 'An error happened' );
    
        },
        { binary: true}
    );
    
}
_3d.renderer.domElement.addEventListener("mousemove", onpointermove, false);
document.addEventListener("keydown", handle_keyboard);
document.getElementById("download").addEventListener("click", ondownload);
_3d.renderer.domElement.addEventListener("click", selected_func)
export { register_handler, pointer, selected };

