import GLDraw from '../common/GLDraw'
import SimpleShape from './SimpleShape'
import Texture from './Texture'

async function initSimpleShape(gl) {
    const s = new SimpleShape(gl);
    return s;
}

async function drawSimpleShape(gl, s) {
    s.triangle();
}
//GLDraw.Add(drawSimpleShape, initSimpleShape)

async function initTexture(gl) {
    const t = new Texture(gl);
    return t;
}
async function drawTexture(gl, t) {
    t.triangle()
}

GLDraw.Add(drawTexture, initTexture)