
export default class GLDraw {
    static renderCall = []
    static initCall = []
    static async draw(gl) {
        for(const i in GLDraw.renderCall) {
            const init = GLDraw.initCall[i];
            if(typeof init === 'function') {
                context = await init(gl);
                GLDraw.initCall[i] = context;
            }
            await GLDraw.renderCall[i](gl, GLDraw.initCall[i]);
        }
    }

    static Add(render, init = null){
        if(!GLDraw.renderCall.includes(render)) {
            GLDraw.renderCall.push(render);
            GLDraw.initCall.push(init);
        }
    }
}