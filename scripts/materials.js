var materials;

fetch("/materials.json").then((x)=>x.json()).then((y)=>{materials = y}).then(()=>{createDetails(materials,document.getElementById("materials-list"));});

function createDetails(jsonData, parentDetails, depth = 0) {
    jsonData.forEach(item => {
        padding = depth*5+"px"
        if (item.children) {
            const details = document.createElement("details");
            const summary = document.createElement("summary");
            const propertyList = document.createElement("ul");
            details.style.paddingLeft = padding;
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
                div = document.createElement('div');
                div.innerHTML = child.name;
                div.style.paddingLeft = padding
                parentDetails.appendChild(div); 
            })
        }
    });
}