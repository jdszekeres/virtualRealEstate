import * as THREE from 'three';
import * as _3d from './3d.js';
const name = document.getElementById("mat-name");
const width_slider = document.getElementById("material-width-slider")
const height_slider = document.getElementById("material-height-slider")
const depth_slider = document.getElementById("material-depth-slider")

const width_input = document.getElementById("material-width")
const height_input = document.getElementById("material-height")
const depth_input = document.getElementById("material-depth")

function set_materials_manager(data,object) {//call this when we select an object
    const edges = new THREE.EdgesGeometry( object.geometry ); 
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) ); 
    object.add( line );
    console.log("called")
    name.innerHTML = data["name"]
    let size = data.properties.size
    function setup_sliders() {
    width_slider.max = size.max_width
    width_slider.min = size.min_width
    height_slider.max = size.max_height
    height_slider.min = size.min_height
    depth_slider.max = size.max_depth
    depth_slider.min = size.min_depth
    if (object.scale === new THREE.Vector3(1,1,1)) {
        width_slider.value = size.default_width
        height_slider.value = size.default_height
        depth_slider.value = size.default_depth
    } else {
        width_slider.value = object.scale.x * size.default_width
        height_slider.value = object.scale.y * size.default_height
        depth_slider.value = object.scale.z * size.default_depth
    }
    if (size.max_width - size.min_width < 10) {
        width_slider.step = 0.025
    }
    if (size.max_height - size.min_height < 10) {
        height_slider.step = 0.025
    }
    if (size.max_depth - size.min_depth < 10) {
        depth_slider.step = 0.025
    }
    change_length_based_on_slider(width_slider,width_input)
    change_length_based_on_slider(height_slider,height_input)
    change_length_based_on_slider(depth_slider,depth_input)
    }
    setup_sliders()
    function change_all() {
        change_length_based_on_slider(width_slider,width_input)
        change_length_based_on_slider(height_slider,height_input)
        change_length_based_on_slider(depth_slider,depth_input)
        change_object_size(object,data.properties.size,width_input.innerText,height_input.innerText,depth_input.innerText)

    }
    width_slider.addEventListener("change",change_all)
    height_slider.addEventListener("change",change_all)
    depth_slider.addEventListener("change",change_all)
    
    document.getElementById("color-selector").innerHTML=""
    if (data.properties.colors !== "all") {
        let select = document.createElement("select")
        select.id="option-color-selector"
        data.properties.colors.forEach((hex)=>{
            let option = document.createElement("option")
            option.value = hex
            option.innerHTML = "#"+hex
            option.style.color="#"+hex
            select.appendChild(option)
            
        })
        select.addEventListener("change",function () {
            object.material = new THREE.MeshBasicMaterial({ color: "#" + data.properties.colors[0] });
        })
        document.getElementById("color-selector").appendChild(select);
    
    } 
    else {
        let color_picker = document.createElement("input")
        color_picker.type = "color"
        color_picker.value = "#ff0000"
        color_picker.addEventListener("input",function () {
            object.material = new THREE.MeshBasicMaterial({ color: color_picker.value });
        
        })
        document.getElementById("color-selector").appendChild(color_picker);
    }
}
function change_length_based_on_slider(slider,input) {
    input.innerText = slider.value;
}
function change_object_size(object,size,width,height,depth) {
    width = parseFloat(width)
    height = parseFloat(height)
    depth = parseFloat(depth)
    console.log(width,height,depth)
    let default_width = size.default_width
    let default_height = size.default_height
    let default_depth = size.default_depth
    object.scale.set(
        width / default_width,
        height / default_height,
        depth / default_depth
    
    ); //set the size proportional to the default size
}

export {set_materials_manager}