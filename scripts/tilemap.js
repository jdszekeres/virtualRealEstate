import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import haversine from 'haversine-distance'

window.type = true; //bugfix
function until(conditionFunction) {

  const poll = resolve => {
    if(conditionFunction()) resolve();
    else setTimeout(_ => poll(resolve), 400);
  }

  return new Promise(poll);
}
async function stitchTiles(apikey, zoom, bounds) {
  // Calculate the width and height of the resulting image
  const tileSize = 512; // Assuming standard tile size
  let minLat = bounds[0];
  let minLng = bounds[1];
  let maxLat = bounds[2];
  let maxLng = bounds[3];

  var dimensions = [
      haversine([minLat, minLng], [minLat, maxLng]),
      haversine([minLat,minLng], [maxLat, minLng])
  ]
    return {url:`https://www.mapquestapi.com/staticmap/v5/map?boundingBox=${minLat},${minLng},${maxLat},${maxLng}&size=${Math.ceil(dimensions[1]*10)},${Math.ceil(dimensions[0]*10)}&type=sat&key=${apikey}`,dimensions:dimensions};
}

function openMapPopup(THREE) {
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

    var bbox = null;
    map.addControl(drawControl);
    map.on(L.Draw.Event.CREATED, function (e) {
    var layer = e.layer;
    if ( L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]) < 20000) { 
        bbox=layer.getBounds();
        layer.addTo(editableLayers);
        drawControl.remove(map);
        drawControlEditOnly.addTo(map)
    } else {
        alert("object cannot be larger that 20,000m²")
    }
    });
    map.on("draw:deleted", function(e) {
        drawControlEditOnly.remove(map);
        drawControl.addTo(map);
        bbox=null;
    });
    document.body.appendChild(dialog);
    let cancel_button = document.createElement("button")
    cancel_button.innerText = "cancel";
    cancel_button.addEventListener("click",()=>{map.off();map.remove();dialog.remove();})
    let submit_button = document.createElement("button")
    submit_button.innerText = "submit";
    submit_button.addEventListener("click",()=>{
        if (bbox === null) {return;}
        let bbox_ne = bbox.getNorthEast();
        let bbox_sw = bbox.getSouthWest();
        let bbox_arr = [bbox_ne.lat,bbox_ne.lng,bbox_sw.lat,bbox_sw.lng];
        stitchTiles("HVHZRmOGq3tIWjbcCdhJOGcEF6qA0AOj",22,bbox_arr).then((response)=>{THREE.modify_plane(response)});
        map.off();
        map.remove();
        dialog.remove();
    
            
        }
    )
    dialog.appendChild(cancel_button);
    dialog.append(submit_button);
    dialog.show();
    dialog.focus();
    map.invalidateSize();
    
}
export {stitchTiles,openMapPopup};