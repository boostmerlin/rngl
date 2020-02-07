import {GetShaderProgramAsync} from '../../common/ShaderProgram';
import { get } from '../../common/Asset';

export default class Transformation {
  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;
    this.angle = 0;
    const vs = require('../../assets/shaders/transformation.vs');
    const fs = require('../../assets/shaders/simple_texture_basic.fs');
    GetShaderProgramAsync(gl, vs, fs).then(v => {
      this.shaderProgram = v;
    });

    get(require('../../assets/bird.png')).then((image)=>{
      const texture = gl.createTexture();
      //default texture unit
      gl.activeTexture(gl.TEXTURE0);

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

  rect() {
    if (!this.shaderProgram) {
      return;
    }
    const gl = this.gl;

    if (!this.rectVao) {
      this.rectVao = gl.createVertexArray();
      gl.bindVertexArray(this.rectVao);
      const vertices = [
        0.5, 0.5, 0,
        0.5, -0.5, 0,
        -0.5, -0.5, 0,
        -0.5, 0.5, 0];
      const vbo = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(vertices),
        gl.STATIC_DRAW,
      );

      gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 3*4, 0);
      gl.enableVertexAttribArray(0);

      const indices = [0, 1, 3, 1, 2, 3];
      //index drawing use EBO
      const ebo = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
      gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint32Array(indices),
        gl.STATIC_DRAW,
      );

      const texo = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, texo);
      const texCoord = [0, 0, 0, 1, 1, 1, 1, 0];
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoord), gl.STATIC_DRAW);
      gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(2);

      gl.bindVertexArray(null);
    }

    this.shaderProgram.use();
    const matrices = this.rotateMatrices();
    this.shaderProgram.setMat4fv("transform", matrices);
    gl.bindVertexArray(this.rectVao);

    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0);
  }

  /* Rotate about z
      cosθ,-sinθ,0,0,
      sinθ,cosθ,0,0,
      0,0,1,0,
      0,0,0,1,
  */
  rotateMatrices(){
    //radian
    const a = this.angle;

    const matrices = [
      Math.cos(a),-Math.sin(a),0,0,
      Math.sin(a),Math.cos(a),0,0,
      0,0,1,0,
      0,0,0,1,
    ];
    this.angle += 0.01;
    return matrices;
  }
}
