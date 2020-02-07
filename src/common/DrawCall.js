
export default class DrawCall {
    static renderCall = []
    static initCall = []
    static async draw(gl) {
        for(const i in DrawCall.renderCall) {
            const init = DrawCall.initCall[i];
            if(typeof init === 'function') {
                context = await init(gl);
                DrawCall.initCall[i] = context;
            }
            await DrawCall.renderCall[i](gl, DrawCall.initCall[i]);
        }
    }

    static Add(render, init = null){
        if(!DrawCall.renderCall.includes(render)) {
            DrawCall.renderCall.push(render);
            DrawCall.initCall.push(init);
        }
    }
}