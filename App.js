import React, { Component } from 'react';
import { View } from 'react-native';
import { GLView } from 'expo-gl';
import GLDraw from './src/common/GLDraw'
import './src/gltest/RegDraw'

export default class App extends Component {
  render() {
    return (
      <View>
      <GLView onContextCreate={this._onGLContextCreate}
              style={{ width: '100%', height: '100%' }}/>
      </View>
    );
  }

  async _onGLContextCreate(gl : WebGL2RenderingContext) {
    gl.clearColor(0.2, 0.2, 0.3, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    const render = async () => {
      requestAnimationFrame(render);
      await GLDraw.draw(gl);
      gl.endFrameEXP();
    };
    await render();
  }
}
