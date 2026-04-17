import React, { useEffect, useRef } from 'react';

const WebGLBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const vertexShaderSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Competitive Programming P2P Graph Topology Shader
    const fragmentShaderSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;

      // Random hash for node coordinates
      vec2 hash( vec2 p ) {
          p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) );
          return -1.0 + 2.0*fract(sin(p)*43758.5453123);
      }

      void main() {
          vec2 uv = gl_FragCoord.xy / u_resolution.xy;
          vec2 centered_uv = uv * 2.0 - 1.0;
          centered_uv.x *= u_resolution.x / u_resolution.y;

          // Base space vector for scaling the computational network
          vec2 p = uv * 6.0; 
          
          // Slow algorithm camera pan (Data stream flow)
          p.x += u_time * 0.15;
          p.y -= u_time * 0.1;

          vec2 i = floor(p);
          vec2 f = fract(p);

          // Locate closest adjacent nodes (calculating network topology)
          float md1 = 100.0;
          float md2 = 100.0;
          vec2 c1 = vec2(0.0), c2 = vec2(0.0);
          vec2 global_c1 = vec2(0.0);

          for(int y = -1; y <= 1; y++){
              for(int x = -1; x <= 1; x++){
                  vec2 n = vec2(float(x), float(y));
                  vec2 rnd = hash(i + n);
                  
                  // Nodes organically drift to simulate active peers processing logic
                  vec2 node = n + 0.4*sin(u_time * 0.8 + 6.2831*rnd) + 0.5;
                  
                  float d = length(f - node);
                  
                  if(d < md1){
                      md2 = md1;
                      c2 = c1;
                      md1 = d;
                      c1 = node;
                      global_c1 = i + n; // Track absolute peer ID
                  } else if(d < md2){
                      md2 = d;
                      c2 = node;
                  }
              }
          }

          // Exact math to find the bisector establishing the geometric mesh edges
          float edgeDist = abs(dot(0.5*(c1+c2)-f, normalize(c2-c1)));

          // Base Terminal Background
          vec3 bgCol = vec3(0.015, 0.02, 0.04);
          
          // Draw the Edges (Peer-to-Peer Data Cables / Logic Trees)
          float edgeThickness = 0.025;
          float edges = smoothstep(edgeThickness, 0.0, edgeDist);
          
          // Edges shift color dynamically based on network position
          vec3 edgeCol = mix(vec3(0.1, 0.6, 1.0), vec3(0.6, 0.1, 0.9), sin(global_c1.x*5.0 + u_time)*0.5+0.5);
          bgCol += edgeCol * edges * 0.5;

          // Draw the Nodes (The active CP Users / Data Points)
          float nodeDist = md1;
          float nodeSize = 0.06;
          // Soft outer halo for nodes
          float nodeHalo = smoothstep(nodeSize * 2.0, 0.0, nodeDist);
          bgCol += vec3(0.0, 0.4, 0.8) * nodeHalo * 0.5;
          
          // Sharp inner core
          float nodes = smoothstep(nodeSize, nodeSize * 0.5, nodeDist);
          
          // Peers "Flash" indicating AC Submissions / Data Transfer
          float flash = pow(sin(u_time * 4.0 + (global_c1.x + global_c1.y)*20.0), 30.0);
          vec3 nodeCore = mix(vec3(0.1, 0.8, 1.0), vec3(1.0, 1.0, 1.0), flash);
          
          bgCol += nodeCore * nodes;
          
          // Frame the arena nicely with a heavy cinematic vignette
          bgCol *= 1.0 - smoothstep(1.0, 2.5, length(centered_uv));

          gl_FragColor = vec4(bgCol, 1.0);
      }
    `;

    const compileShader = (source, type) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        return null;
      }
      return shader;
    };

    const program = gl.createProgram();
    gl.attachShader(program, compileShader(vertexShaderSource, gl.VERTEX_SHADER));
    gl.attachShader(program, compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER));
    gl.linkProgram(program);
    gl.useProgram(program);

    const vertices = new Float32Array([
      -1, -1,  1, -1, -1,  1,
      -1,  1,  1, -1,  1,  1
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const resLoc = gl.getUniformLocation(program, 'u_resolution');
    const timeLoc = gl.getUniformLocation(program, 'u_time');

    let startTime = Date.now();
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener('resize', resize);
    resize();

    // Autonomous physics loop (no mouse interference)
    const render = () => {
      const currentTime = (Date.now() - startTime) / 1000;
      
      gl.uniform1f(timeLoc, currentTime);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    // Start animation loop
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full -z-10 bg-[#04050a] pointer-events-none" />;
};

export default WebGLBackground;
