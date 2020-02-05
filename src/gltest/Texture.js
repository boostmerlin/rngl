import {GetShaderProgramAsync} from '../common/ShaderProgram';
import { get } from '../common/Asset';

export default class Texture {
  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;
    this.textureBinded = false;
    const fs = require('../assets/shaders/texture.fs');
    const vs = require('../assets/shaders/texture.vs');
    GetShaderProgramAsync(gl, vs, fs).then(v => {
      this.shaderProgram = v;
    });

    get(require('../assets/space3.png')).then((image)=>{
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);

      // Set the parameters so we can render any size image.
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

     //Upload the image into the texture.
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image,
      );
    });
  }
  triangle() {
    if (!this.shaderProgram) {
      return;
    }
    const gl = this.gl;
    const vertices = [
      -0.5,
      -0.5,
      0.0,
      1,
      0,
      0,
      0.5,
      -0.5,
      0.0,
      0,
      1,
      0,
      0.0,
      0.5,
      0.0,
      0,
      0,
      1,
    ];
    const texCoord = [0, 0, 0, 1, 0.5, 1];
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 6 * 4, 0);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 6 * 4, 3 * 4);
    gl.enableVertexAttribArray(1);

    const texo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoord), gl.STATIC_DRAW);
    gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(2);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    this.shaderProgram.use();
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.deleteBuffer(vbo);
  }
}
