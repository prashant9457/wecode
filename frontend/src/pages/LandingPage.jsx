import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Rocket, ShieldCheck, Zap, Users, Code, Trophy, Cpu, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

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

    // Amazing cosmic fractal neon shader with MOUSE PARALLAX
    const fragmentShaderSource = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;

      vec3 palette( in float t ) {
        vec3 a = vec3(0.5, 0.5, 0.5);
        vec3 b = vec3(0.5, 0.5, 0.5);
        vec3 c = vec3(1.0, 1.0, 1.0);
        vec3 d = vec3(2.263, 0.416, 0.557); // shifted palette for cool purple/cyan
        return a + b*cos( 6.28318*(c*t+d) );
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
        
        // Base center slightly shifted by mouse
        vec2 uv0 = uv - (u_mouse * 0.15);
        vec3 finalColor = vec3(0.0);
        
        for (float i = 0.0; i < 4.0; i++) {
            // Parallax effect: each iteration moves slightly based on mouse, creating 3D depth
            uv = fract(uv * 1.5) - 0.5 + (u_mouse * 0.05 * float(i));
            
            float d = length(uv) * exp(-length(uv0));
            // Shift colors slightly on Mouse X
            vec3 col = palette(length(uv0) + float(i)*0.4 + u_time*0.2 + (u_mouse.x * 0.2));
            
            // Wobble reacts to Mouse Y
            float speed = 8.0 + (u_mouse.y * 2.0);
            d = sin(d*speed + u_time)/8.0;
            d = abs(d);
            d = pow(0.012 / d, 1.1);
            
            finalColor += col * d;
        }
        
        // Add dark vignette to allow UI readability
        float vignette = smoothstep(2.5, 0.0, length(uv0));
        gl_FragColor = vec4(finalColor * vignette * 0.15, 1.0);
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
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const resLoc = gl.getUniformLocation(program, 'u_resolution');
    const mouseLoc = gl.getUniformLocation(program, 'u_mouse');

    let startTime = Date.now();
    let animationFrameId;

    // Mouse Tracking Logic
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const onMouseMove = (e) => {
      // Normalize mouse coordinates from -1 to 1 based on window dimensions
      targetMouseX = (e.clientX / window.innerWidth) * 2.0 - 1.0;
      targetMouseY = -((e.clientY / window.innerHeight) * 2.0 - 1.0); // Invert Y for WebGL
    };

    window.addEventListener('mousemove', onMouseMove);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener('resize', resize);
    resize();

    const render = () => {
      const currentTime = (Date.now() - startTime) / 1000;

      // Fluid LERP (Linear Interpolation) for buttery smooth mouse movement
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      gl.uniform1f(timeLoc, currentTime);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.uniform2f(mouseLoc, mouseX, mouseY);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full -z-10 bg-black pointer-events-none" />;
};



const FeatureCard = ({ icon, title, desc, delay, gradient, className, imageSrc }) => {
  const divRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    divRef.current.style.setProperty('--mouse-x', `${x}px`);
    divRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "group flex flex-col rounded-[2rem] bg-black/40 backdrop-blur-xl border border-white/10 hover:border-white/30 transition-all duration-500 relative overflow-hidden",
        className,
        delay
      )}
    >
      {/* Super smooth Spotlight overlay moving with mouse */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 mix-blend-screen"
        style={{
          background: `radial-gradient(500px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.1), transparent 40%)`
        }}
      />   {/* ✅ Self-closing — was left open */}

      {/* Background Gradient overlay */}
      <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 bg-gradient-to-br z-0", gradient)} />

      {imageSrc && (
        <div className="relative w-full h-48 md:h-64 overflow-hidden border-b border-white/10 shrink-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent z-10 mix-blend-multiply opacity-50" />
          <img src={imageSrc} alt={title} className="w-full h-full object-cover filter brightness-75 group-hover:scale-110 group-hover:brightness-100 transition-all duration-700 ease-out" />
        </div>
      )}

      <div className="relative z-20 p-8 flex-1 flex flex-col">
        {icon && (
          <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 bg-gradient-to-br shrink-0", gradient)}>
            {icon}
          </div>
        )}
        <h3 className={cn("font-bold text-white mb-3 tracking-tight", imageSrc ? "text-3xl" : "text-2xl")}>{title}</h3>
        <p className="text-zinc-400 font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}; {/* ✅ Properly closes the component */ }

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token && username) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen font-sans text-zinc-100 overflow-x-hidden selection:bg-indigo-500/30">
      <WebGLBackground />

      {/* Header */}
      <header className="px-6 lg:px-12 h-20 flex items-center border-b border-white/10 bg-black/30 backdrop-blur-md z-50 sticky top-0 transition-all duration-300">
        <Link className="flex items-center justify-center group" to="/">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)] group-hover:shadow-[0_0_30px_rgba(34,211,238,0.8)] group-hover:scale-110 transition-all duration-300">
            <Rocket className="h-5 w-5 text-black" />
          </div>
          <span className="ml-4 font-black text-3xl tracking-tighter bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">WeCode</span>
        </Link>
        <nav className="ml-auto flex gap-6 items-center">
          <Link className="text-sm font-bold text-zinc-300 hover:text-white transition-colors uppercase tracking-widest hidden sm:block" to="/login">
            Login
          </Link>
          <Link to="/signup">
            <Button className="bg-white text-black hover:bg-zinc-200 hover:scale-105 transition-transform font-bold rounded-full px-8 h-10 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              ENTER ARENA
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 relative z-10">

        {/* Massive Hero Section */}
        <section className="w-full pt-24 pb-32 md:pt-32 md:pb-40 px-4 md:px-6 relative flex flex-col items-center justify-center">

          {/* Floating animated blobs behind text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/30 rounded-full blur-[120px] pointer-events-none animate-pulse duration-1000"></div>

          <div className="max-w-6xl mx-auto text-center relative z-20">
            <div className="inline-flex justify-center items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-cyan-300 font-bold tracking-widest uppercase mb-8 shadow-xl backdrop-blur-md animate-in slide-in-from-top-4 duration-700">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
              WebGL Immersive Edition v2.0
            </div>

            <h1 className="text-6xl sm:text-7xl md:text-9xl font-black tracking-tighter drop-shadow-2xl text-balance leading-[1.05] mb-8 animate-in zoom-in-95 fade-in duration-1000">
              DOMINATE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 drop-shadow-[0_0_40px_rgba(99,102,241,0.5)]">
                THE ALGORITHM
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-zinc-300 md:text-2xl font-medium leading-relaxed mb-12 animate-in slide-in-from-bottom-8 duration-1000 delay-150">
              The hyper-realistic social network for elite competitive programmers. Track friends, conquer leaderboards, and witness real-time problem solving.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-in slide-in-from-bottom-8 duration-1000 delay-300">
              <Link to="/signup">
                <Button size="lg" className="px-10 h-16 text-lg rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black shadow-[0_0_40px_rgba(99,102,241,0.6)] border-0 hover:scale-110 transition-all duration-300 group flex items-center gap-3">
                  INITIATE RUN <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Massive Bento Grid Layout */}
        <section className="w-full py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-2xl skew-y-3 scale-110 -z-10" />

          <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4">
              THE ULTIMATE <span className="text-cyan-400">CODING MATRIX</span>
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto font-medium">Immerse yourself perfectly in the coding flow state with an asymmetric, deeply interactive layout.</p>
          </div>

          <div className="container px-4 md:px-6 max-w-7xl mx-auto">
            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 auto-rows-min">

              {/* Massive Hero Entry */}
              <FeatureCard
                className="md:col-span-4 lg:col-span-4 shadow-[0_0_50px_rgba(34,211,238,0.15)] group"
                title="Elite Global Leaderboards"
                desc="Experience a real-time WebSockets-powered feed displaying exactly when your connections crack complex logic gates. Watch the global state shift instantly as top minds submit their logic blocks to the arena."
                imageSrc="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000"
                gradient="from-cyan-400 to-blue-600"
                delay="delay-100"
              />

              {/* Tall Vertical Entry */}
              <FeatureCard
                className="md:col-span-2 lg:col-span-2 md:row-span-2 flex-col justify-end"
                icon={<Cpu className="h-10 w-10 text-white" />}
                title="Neural Verification"
                desc="Instantly and securely integrate your entire competitive history from LeetCode. We automatically poll the matrices so you never have to manually sync your algorithmic rating."
                gradient="from-indigo-500 to-purple-600"
                delay="delay-200"
              />

              <FeatureCard
                className="md:col-span-2 lg:col-span-2"
                icon={<Zap className="h-8 w-8 text-white" />}
                title="Hyper-Speed Feed"
                desc="Zero latency streaming of friend activity. You solve it, the entire connected matrix sees it instantly."
                gradient="from-yellow-400 to-orange-500"
                delay="delay-300"
              />

              <FeatureCard
                className="md:col-span-2 lg:col-span-2"
                icon={<Users className="h-8 w-8 text-white" />}
                title="Elite Squads"
                desc="Construct heavily guarded private networks of developers. Form intense rivalries and track daily heatmaps."
                gradient="from-emerald-400 to-cyan-500"
                delay="delay-400"
              />

              <FeatureCard
                className="md:col-span-2 lg:col-span-3"
                icon={<Code className="h-8 w-8 text-white" />}
                title="Logic Vaults"
                desc="Save your most deeply optimized algorithmic solutions strictly linked to your integrated platform identities. A personal library of computational supremacy."
                gradient="from-pink-500 to-rose-600"
                delay="delay-500"
              />

              <FeatureCard
                className="md:col-span-2 lg:col-span-3"
                imageSrc="https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=1000"
                title="Arena Analytics"
                desc="Immersive dynamic charts tracking your progression and accuracy against global competitors."
                gradient="from-blue-500 to-indigo-600"
                delay="delay-600"
              />

            </div>
          </div>
        </section>

      </main>

      <footer className="relative z-10 w-full shrink-0 bg-black/80 backdrop-blur-xl border-t border-white/10 pt-16 pb-8 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link className="flex items-center gap-3 group" to="/">
              <Rocket className="h-6 w-6 text-cyan-400 group-hover:-translate-y-1 transition-transform" />
              <span className="font-black text-2xl tracking-tighter text-white">WeCode Arena</span>
            </Link>
            <p className="text-sm text-zinc-500 font-medium">Architected for the future of competitive mind athletes.</p>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            <Link className="text-sm font-bold text-zinc-400 hover:text-cyan-400 transition-colors uppercase tracking-widest" to="#">Command Center</Link>
            <Link className="text-sm font-bold text-zinc-400 hover:text-cyan-400 transition-colors uppercase tracking-widest" to="#">Directives</Link>
            <Link className="text-sm font-bold text-zinc-400 hover:text-cyan-400 transition-colors uppercase tracking-widest" to="#">Privacy</Link>
          </nav>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 text-center text-zinc-600 text-xs font-bold uppercase tracking-widest">
          © {new Date().getFullYear()} WeCode Arena Protocol. Secure connection established.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
