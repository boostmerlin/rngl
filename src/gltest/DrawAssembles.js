import DrawCall from '../common/DrawCall'
import SimpleShape from './example/SimpleShape'
import Texture from './example/Texture'
import Transformation from './example/Transformation'

async function initSimpleShape(gl) {
    const s = new SimpleShape(gl);
    return s;
}

async function drawSimpleShape(gl, s) {
    s.triangle();
}
//DrawCall.Add(drawSimpleShape, initSimpleShape)

async function initTexture(gl) {
    const t = new Texture(gl);
    return t;
}
async function drawTexture(gl, t) {
    t.rect()
}

//DrawCall.Add(drawTexture, initTexture)

async function initTransformation(gl) {
    const t = new Transformation(gl);
    return t;
}
async function drawTransformation(gl, t) {
    t.rect()
}

DrawCall.Add(drawTransformation, initTransformation)