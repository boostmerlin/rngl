#version 300 es
precision lowp int;
precision mediump float;
precision mediump sampler2DArray;
layout (location = 0) in vec3 aPos;
layout (location = 1) in vec3 aColor;
layout (location = 2) in vec2 aTexCoord;

out vec4 ourColor;
out vec2 ourTexCoord;
void main()
{
    gl_Position = vec4(aPos, 1.0);
    ourColor = vec4(aColor, 1.0);
    ourTexCoord = aTexCoord;
}