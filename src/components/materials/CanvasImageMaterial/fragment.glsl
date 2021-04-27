#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
uniform sampler2D u_image;
uniform vec4 u_inset;
uniform vec4 u_edge_color;
uniform vec4 u_vertex_color;

void main() {
  vec4 texture = texture2D(u_image, vUv);
  float xMask = step(vUv.x, 1.0 - u_inset.y) * step(u_inset.w, vUv.x);
  float yMask = step(vUv.y, 1.0 - u_inset.x) * step(u_inset.z, vUv.y);
  float gap = 0.3;
  float thickness = 0.05;

  bool edgeLeft = vUv.x < thickness + u_inset.w;
  bool edgeRight = vUv.x > 1.0 - thickness - u_inset.y;
  bool edgeBottom = vUv.y < thickness + u_inset.z;
  bool edgeTop = vUv.y > 1.0 - thickness - u_inset.x;

  bool gapLeft = vUv.x > u_inset.w + gap;
  bool gapRight = vUv.x < 1.0 - u_inset.y - gap;
  bool gapBottom = vUv.y > u_inset.z + gap;
  bool gapTop = vUv.y < 1.0 - u_inset.x - gap;

  bool edges = u_edge_color.w > 0.0;

  if (edges) {
    if (edgeLeft || edgeRight) {
      if (gapTop && gapBottom) {
        gl_FragColor = u_edge_color;
      } else {
        gl_FragColor = vec4(xMask * yMask) * texture;
      }
    } else if (edgeBottom || edgeTop) {
      if (gapLeft && gapRight) {
        gl_FragColor = u_edge_color;
      } else {
        gl_FragColor = vec4(xMask * yMask) * texture;
      }
    } else {
      gl_FragColor = vec4(xMask * yMask) * texture;
    }
  } else {
    gl_FragColor = vec4(xMask * yMask) * texture;
  }
}
