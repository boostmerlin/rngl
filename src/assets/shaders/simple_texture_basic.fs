#version 300 es
precision lowp int;
precision mediump float;
precision mediump sampler2DArray;

out vec4 FragColor;
in vec2 ourTexCoord;
uniform sampler2D ourTexture;
void main()
{
    FragColor = texture(ourTexture, ourTexCoord);
}