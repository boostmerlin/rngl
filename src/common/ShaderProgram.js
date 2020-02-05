import loadLocalResource from 'react-native-local-resource';

//just for test
export function GetShaderProgramAsync(
  gl: WebGLRenderingContext,
  vertShader,
  fragShader,
) {
  return Promise.all([
    loadLocalResource(vertShader),
    loadLocalResource(fragShader),
  ]).then(([vert, frag]) => {
    return new ShaderProgram(gl, vert, frag);
  });
}

export default class ShaderProgram {
  constructor(gl: WebGLRenderingContext, vertShaderTxt, fragShaderTxt) {
    this.gl = gl;
    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertShaderTxt);
    gl.compileShader(vertShader);

    if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
      console.log(gl.getShaderInfoLog(vertShader));
      throw new SyntaxError(
        'Error compiling vertex shader: \n' + gl.getShaderInfoLog(vertShader),
      );
    }

    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragShaderTxt);
    gl.compileShader(fragShader);

    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
      console.log(gl.getShaderInfoLog(fragShader));
      throw new SyntaxError(
        'Error compiling fragment shader: \n' + gl.getShaderInfoLog(fragShader),
      );
    }

    this.programHandle = gl.createProgram();
    gl.attachShader(this.programHandle, vertShader);
    gl.attachShader(this.programHandle, fragShader);
    gl.linkProgram(this.programHandle);

    gl.deleteShader(vertShader);
    gl.deleteShader(fragShader);

    if (!gl.getProgramParameter(this.programHandle, gl.LINK_STATUS)) {
      console.log(gl.getProgramInfoLog(this.programHandle));
      throw new SyntaxError(
        'Error linking shader program: \n' +
          gl.getProgramInfoLog(this.programHandle),
      );
    }

    this.attributes = {};
    let nAttributes = gl.getProgramParameter(
      this.programHandle,
      gl.ACTIVE_ATTRIBUTES,
    );
    let names = [];
    for (let i = 0; i < nAttributes; i++) {
      let attr = gl.getActiveAttrib(this.programHandle, i);
      names.push(attr.name);
      this.attributes[attr.name] = gl.getAttribLocation(
        this.programHandle,
        attr.name,
      );
      gl.enableVertexAttribArray(this.attributes[attr.name]);
    }

    this.uniforms = {};
    let nUniforms = gl.getProgramParameter(
      this.programHandle,
      gl.ACTIVE_UNIFORMS,
    );
    names = [];
    for (let i = 0; i < nUniforms; i++) {
      let uniform = gl.getActiveUniform(this.programHandle, i);
      names.push(uniform.name);
      this.uniforms[uniform.name] = gl.getUniformLocation(
        this.programHandle,
        uniform.name,
      );
    }
  }

  use() {
    this.gl.useProgram(this.programHandle);
  }

  setBool(name, value)
  {
    this.gl.uniform1i(this.uniforms[name], value ? 1 : 0); 
  }
  setInt(name, value)
  { 
    if(!Number.isInteger(value)) {
      throw TypeError('Argument should be Int')
    }
    this.gl.uniform1i(this.uniforms[name], value); 
  }
  setFloat(name, value)
  { 
      this.gl.uniform1f(this.uniforms[name], value); 
  } 
}
