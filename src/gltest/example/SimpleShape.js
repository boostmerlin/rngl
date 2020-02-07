export default class SimpleShape {
  constructor(gl) {
    this.gl = gl;
  }

  checkShaderError(shader) {
    const gl = this.gl;
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.log(gl.getShaderInfoLog(shader));
      throw new SyntaxError(
        'Error compiling shader: \n' + gl.getShaderInfoLog(shader),
      );
    }
  }

  triangle() {
    const gl = this.gl;
    const vertices = [
      -0.5,
      -0.5,
      0.0,
      1,
      0,
      1,
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
    const vbo = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    const vertexShaderSource = `#version 300 es
    precision lowp int;
    precision mediump float;
    precision mediump sampler2DArray;
    layout (location = 0) in vec3 aPos;
    layout (location = 1) in vec3 aColor;

    out vec3 ourColor;
    void main()
    {
       gl_Position = vec4(aPos.x, aPos.y, aPos.z, 1.0);
       ourColor = aColor;
    }`;
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    this.checkShaderError(vertexShader);

    const fragShaderSource = `#version 300 es
    precision lowp int;
    precision mediump float;
    precision mediump sampler2DArray;
    
    out vec4 FragColor;
    in vec3 ourColor;
    void main()
    {
        FragColor = vec4(ourColor, 1.0f);
    }`;
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragShaderSource);
    gl.compileShader(fragmentShader);
    this.checkShaderError(fragmentShader);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error(
        'Failed to link program:' + gl.getProgramInfoLog(shaderProgram),
      );
      return;
    }
    gl.deleteShader(fragmentShader);
    gl.deleteShader(vertexShader);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 6 * 4, 0);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 6 * 4, 3 * 4);
    gl.enableVertexAttribArray(1);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.useProgram(shaderProgram);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.deleteBuffer(vbo);
  }

  rect() {
    const gl = this.gl;

    if (!this.rectVao) {
      //use VAO 
      /*
      A vertex array object stores the following:
      Calls to glEnableVertexAttribArray or glDisableVertexAttribArray.
      Vertex attribute configurations via glVertexAttribPointer.
      Vertex buffer objects associated with vertex attributes by calls to glVertexAttribPointer.
      */
      this.rectVao = gl.createVertexArray();
      gl.bindVertexArray(this.rectVao);

      const vertices = [0.5, 0.5, 0, 0.5, -0.5, 0, -0.5, -0.5, 0, -0.5, 0.5, 0];
      const indices = [0, 1, 3, 1, 2, 3];

      //index drawing use EBO
      const ebo = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
      gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint32Array(indices),
        gl.STATIC_DRAW,
      );

      const vbo = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(vertices),
        gl.STATIC_DRAW,
      );

      gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 12, 0);
      gl.enableVertexAttribArray(0);
      // gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindVertexArray(null);
      const vertexShaderSource = `#version 300 es
      #define M_PI 3.1415926535897932384626433832795
      precision lowp int;
      precision mediump float;
      precision mediump sampler2DArray;
      layout (location = 0) in vec3 aPos;
      void main()
      {
         gl_Position = vec4(aPos.x, aPos.y, aPos.z, 1.0);
      }`;
      const vertexShader = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(vertexShader, vertexShaderSource);
      gl.compileShader(vertexShader);
      this.checkShaderError(vertexShader);

      const fragShaderSource = `#version 300 es
      #define M_PI 3.1415926535897932384626433832795
      precision lowp int;
      precision mediump float;
      precision mediump sampler2DArray;
      
      out vec4 FragColor;
      uniform vec4 ourColor;
      void main()
      {
          FragColor = ourColor;
      }`;
      const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fragmentShader, fragShaderSource);
      gl.compileShader(fragmentShader);
      this.checkShaderError(fragmentShader);

      const shaderProgram = gl.createProgram();
      gl.attachShader(shaderProgram, vertexShader);
      gl.attachShader(shaderProgram, fragmentShader);
      gl.linkProgram(shaderProgram);
      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error(
          'Failed to link program:' + gl.getProgramInfoLog(shaderProgram),
        );
        return;
      }
      gl.deleteShader(fragmentShader);
      gl.deleteShader(vertexShader);
      this.shaderProgram = shaderProgram;
    }

    const vertexColorLoc = gl.getUniformLocation(
      this.shaderProgram,
      'ourColor',
    );
    gl.useProgram(this.shaderProgram);
    gl.uniform4f(vertexColorLoc, 0.0, Math.sin(Date.now()) / 2.0 + 0.5, 0.0, 1);
    gl.bindVertexArray(this.rectVao);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0);
  }
}
