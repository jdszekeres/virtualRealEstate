import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
window.type = true; //bugfix
function until(conditionFunction) {

  const poll = resolve => {
    if(conditionFunction()) resolve();
    else setTimeout(_ => poll(resolve), 400);
  }

  return new Promise(poll);
}
async function stitchTiles(tilemapUrl, zoom, bounds) {
  // Calculate the width and height of the resulting image
  const tileSize = 512; // Assuming standard tile size
  let minLat = bounds[0];
  let minLng = bounds[1];
  let maxLat = bounds[2];
  let maxLng = bounds[3];
  
  let minX = Math.floor((minLng + 180) / 360 * Math.pow(2, zoom));
  let maxX = Math.floor((maxLng + 180) / 360 * Math.pow(2, zoom));
  let minY = Math.floor((1 - Math.log(Math.tan(maxLat * Math.PI / 180) + 1 / Math.cos(maxLat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
  let maxY = Math.floor((1 - Math.log(Math.tan(minLat * Math.PI / 180) + 1 / Math.cos(minLat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));

  let iX = Math.min(minX, maxX);
  let iY = Math.min(minY,maxY);
  let aX = Math.max(minX, maxX);
  let aY = Math.max(minY,maxY);
  minX = iX;
  minY = iY;
  maxX = aX;
  maxY = aY;
  console.log(`${maxX-minX} x ${maxY-minY} = ${(maxX-minX)*(maxY-minY)} tiles`);
  

  let done = new Array(maxX - minX + 1).fill(false).map(() => new Array(maxY - minY + 1).fill(false));
    const width = (maxX - minX + 1) * tileSize;
  const height = (maxY - minY + 1) * tileSize;

  // Create a canvas to draw the stitched image
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');

  // Loop through each tile and draw it onto the canvas
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      const tileUrl = tilemapUrl.replace("{z}",zoom).replace("{x}",x).replace("{y}",y);
      // Fetch the tile image
      // const response = await fetch(tileUrl);
      // const blob = await response.blob();

      // Create an Image object from the blob
      const image = new Image();
        image.onload = () => {
          context.drawImage(image, (x - minX) * tileSize, (y - minY) * tileSize, tileSize, tileSize);
          done[x - minX][y - minY] = true;
        }
      image.src = tileUrl;
      image.crossOrigin = "";

      // Draw the tile onto the canvas
     
     }
  }

  // Convert the canvas to a base64 URL
    await until(_=>done.flat().every(x => x === true));
    return canvas.toDataURL();
}
function openMapPopup() {
    let dialog = document.createElement('dialog');
    dialog.style="position:absolute;width:50%;height:50%;top:25%;left:25%"
    let map_div = document.createElement("div");
    dialog.appendChild(map_div);
    map_div.style="height:calc(100% - 50px);width:100%"
    const map = new L.Map(map_div, {
        center: [34.118222, -118.300389],
        zoom: 20,
    })
    
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    var editableLayers = new L.FeatureGroup();
    map.addLayer(editableLayers);

    var options = {
        draw: {
            polygon:false,
            polyline:false,
            circle:false,
            rectangle: {shapeOptions: {
                clickable: false
            }},
            marker: false,
            circlemarker:false
        },
        
        edit: {
            featureGroup: editableLayers, //REQUIRED!!
            remove: true
        }
    }
    var drawControlEditOnly = new L.Control.Draw({
        edit: {
            featureGroup: editableLayers
        },
        draw: false
    });
    var drawControl = new L.Control.Draw(options);
    map.addControl(drawControl);
    map.on(L.Draw.Event.CREATED, function (e) {
    var layer = e.layer;


        layer.addTo(editableLayers);
        drawControl.remove(map);
        drawControlEditOnly.addTo(map)
    });
    map.on("draw:deleted", function(e) {
        drawControlEditOnly.remove(map);
        drawControl.addTo(map);
    });
    document.body.appendChild(dialog);
    dialog.show();
    dialog.focus();
    map.invalidateSize();
    
}
export {stitchTiles,openMapPopup};