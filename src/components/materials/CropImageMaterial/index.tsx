import { shaderMaterial } from "@react-three/drei"
import * as THREE from "three"
import glsl from "glslify"
import vertexShader from "./vertex.glsl"
import fragmentShader from "./fragment.glsl"
import { extend, ShaderMaterialProps } from "@react-three/fiber"
import { animated } from "@react-spring/three"

export const CropImageMaterial = shaderMaterial(
  {
    u_image: new THREE.Texture(),
    u_inset: new THREE.Vector4(0, 0, 0, 0),
  },
  glsl(vertexShader),
  glsl(fragmentShader)
)

extend({ CropImageMaterial })

type CropImageMaterialProps = Omit<ShaderMaterialProps, "uniforms"> & {
  uniforms?: {
    u_image?: {
      value: THREE.Texture
    }
    u_inset?: {
      value: THREE.Vector4
    }
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      cropImageMaterial: CropImageMaterialProps
    }
  }
}
export const AnimatedCropImageMaterial = animated(
  (props: CropImageMaterialProps) => <cropImageMaterial {...props} />
)
export default CropImageMaterial
