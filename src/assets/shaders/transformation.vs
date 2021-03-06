#version 300 es
precision lowp int;
precision mediump float;
precision mediump sampler2DArray;
layout (location = 0) in vec3 aPos;
layout (location = 2) in vec2 aTexCoord;

out vec2 ourTexCoord;
uniform mat4 transform;

void main()
{
    gl_Position = transform * vec4(aPos, 1.0);
    ourTexCoord = aTexCoord;
}