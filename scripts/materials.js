import * as handlers from './drag_handler.js';
export var materials;
export var non_class = [];
export function loadMaterials(_THREE) {
    fetch("/materials.json").then((x)=>x.json()).then((y)=>{materials = y}).then(()=>{createDetails(materials,document.getElementById("materials-list"),_THREE);});
}
function createDetails(jsonData, parentDetails,_THREE,depth = 0) {
    jsonData.forEach(item => {
        
        if (item.children) {
            const details = document.createElement("details");
            const summary = document.createElement("summary");
            const propertyList = document.createElement("ul");
            details.style.paddingLeft = depth*5+"px";
            details.id=item.id;
            summary.textContent = item.name;
            details.appendChild(summary);

            if (item.properties) {
                for (const [key, value] of Object.entries(item.properties)) {
                    const listItem = document.createElement("li");
                    listItem.textContent = `${key}: ${JSON.stringify(value)}`;
                    propertyList.appendChild(listItem);
                }
                details.appendChild(propertyList);
            }

            parentDetails.appendChild(details);

        
            createDetails(item.children, details, depth + 1);
        } else {
                jsonData.forEach(function (child) {
                let div = document.createElement('div');
                div.id=child.id;
                div.innerHTML = child.name;
                div.style.paddingLeft = depth*5+"px";
                child.element = div;
                
                handlers.register_handler(div,child,_THREE);
                parentDetails.appendChild(div); 
                non_class.push(child);
                
                
            })
        }
    });
}