import * as _THREE from "./3d.js";
import * as _Materials from "./materials.js";
import * as _drag_handler from "./drag_handler.js";
import * as _properties from './properties.js';
_Materials.loadMaterials(_drag_handler.register_handler,_THREE);