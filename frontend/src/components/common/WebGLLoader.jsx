import React, { useEffect, useRef } from 'react';

const WebGLLoader = ({ size = 64, color = [0.39, 0.45, 1.0] }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const vs = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fs = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec3 u_color;

      float ring(vec2 uv, float outer, float inner) {
        float d = length(uv);
        return smoothstep(outer, outer - 0.01, d) * smoothstep(inner - 0.01, inner, d);
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
        
        // Background alpha
        vec4 finalColor = vec4(0.0);

        // Rotating orbital nodes
        for(float i=0.0; i<3.0; i++) {
          float t = u_time * (1.0 + i * 0.5);
          vec2 p = vec2(sin(t), cos(t)) * (0.3 + i * 0.05);
          float d = length(uv - p);
          float glow = 0.02 / d;
          finalColor += vec4(u_color * glow, glow);
        }

        // Pulse ring
        float r = ring(uv, 0.4, 0.38);
        finalColor += vec4(u_color * r * (0.5 + 0.5 * sin(u_time * 2.0)), r);

        gl_FragColor = finalColor;
      }
    `;

    const createShader = (gl, type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const program = gl.createProgram();
    gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vs));
    gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(program);
    gl.useProgram(program);

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const posAttr = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const resLoc = gl.getUniformLocation(program, 'u_resolution');
    const colorLoc = gl.getUniformLocation(program, 'u_color');

    let animationFrame;
    const render = (time) => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform1f(timeLoc, time * 0.001);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.uniform3f(colorLoc, color[0], color[1], color[2]);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrame = requestAnimationFrame(render);
    };

    render(0);

    return () => cancelAnimationFrame(animationFrame);
  }, [color]);

  return (
    <canvas 
      ref={canvasRef} 
      width={size * 2} 
      height={size * 2} 
      style={{ width: size, height: size, filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.3))' }}
    />
  );
};

export default WebGLLoader;
