import * as THREE from 'three';

const width_slider = document.getElementById("material-width-slider")
const height_slider = document.getElementById("material-height-slider")
const depth_slider = document.getElementById("material-depth-slider")

const width_input = document.getElementById("material-width")
const height_input = document.getElementById("material-height")
const depth_input = document.getElementById("material-depth")

function set_materials_manager(data,object) {//call this when we select an object
    let size = data.properties.size
    width_slider.max = size.max_width
    width_slider.min = size.min_width
    height_slider.max = size.max_height
    height_slider.min = size.min_height
    depth_slider.max = size.max_depth
    depth_slider.min = size.min_depth
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
    
    document.getElementById("color-selector").innerHTML=""
    if (data.properties.color !== "all") {
        let select = document.createElement("select")
        data.properties.colors.forEach((hex)=>{
            let option = document.createElement("option")
            option.value = hex
            option.innerHTML = "#"+hex
            option.style.color="#"+hex
            select.appendChild(option)
        })
        document.getElementById("color-selector").appendChild(select);
    
    } else {
        let color_picker = document.createElement("input")
        color_picker.type = "color"
        document.getElementById("color-selector").appendChild(color_picker);
    }
}
function change_length_based_on_slider(slider,input) {
    input.value = slider.value;
}
function load_event_listeners() {
    width_slider.addEventListener("mousemove",()=>change_length_based_on_slider(width_slider,width_input))
    height_slider.addEventListener("mousemove",()=>change_length_based_on_slider(height_slider,height_input))
    depth_slider.addEventListener("mousemove",()=>change_length_based_on_slider(depth_slider,depth_input))
}
export {set_materials_manager,load_event_listeners}