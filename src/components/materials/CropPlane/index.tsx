import { shaderMaterial } from "@react-three/drei"
import THREE from "three"
import glsl from "glslify"
import vertexShader from "./vertex.glsl"
import fragmentShader from "./fragment.glsl"

const CropPlaneMaterial = shaderMaterial(
  {
    u_image: new THREE.Texture(),
    u_inset: new THREE.Vector4(0, 0, 0, 0),
    u_switch: false,
    u_resolution: new THREE.Vector2(),
  },
  glsl(vertexShader),
  glsl(fragmentShader)
)
