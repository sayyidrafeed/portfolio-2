"use client";

/*
 * Shader by XorDev (https://x.com/XorDev), from shadercn's ORB-25, which was ported
 * with the author's permission. Non-commercial use only, with attribution to XorDev;
 * keep this notice with the file. This is a GLSL port with neutral grey colours.
 */

import { useEffect, useRef, useState } from "react";

import styles from "./page.module.css";

const VERTEX = `#version 300 es
in vec2 aPosition;
void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }`;

const FRAGMENT = `#version 300 es
precision highp float;
uniform vec2 uResolution;
uniform float uBoil;
uniform float uDrift;
uniform float uSwirl;
out vec4 outColor;

const float RADIUS = 0.9;
const float SCALE = 7.5;
const float BULGE = 0.3;
const float WARP = 0.4;
const float ZOOM = 1.111;
const float RIPPLE = 0.3;
const float EDGE_GAIN = 10.0;
const float RIM_WIDTH = 2.5;
const float FRINGE = 0.09;
const float EXPOSURE = 0.8;
const float CONTRAST = 1.15;
const float SATURATION = 1.5;
const float FLOOR_LEVEL = 0.16;
const float KEY_LIGHT = 0.35;
const float RIM_SHEEN = 0.45;
const vec3 TINT = vec3(0.894, 0.894, 0.91);
const vec3 BODY = vec3(0.055, 0.055, 0.063);
const vec3 SHEEN = vec3(0.725, 0.725, 0.76);

vec2 orbPlane(vec2 fragCoord) {
  vec2 uv = (fragCoord * 2.0 - uResolution) / min(uResolution.x, uResolution.y);
  return uv / RADIUS;
}

vec2 creaseField(vec2 fragCoord) {
  vec2 pl = orbPlane(fragCoord);
  float z = sqrt(max(1.0 - dot(pl, pl), 0.0));
  vec2 p = pl / (z + 1.0 + BULGE) * SCALE;
  float c = cos(uSwirl);
  float s = sin(uSwirl);
  p = mat2(c, -s, s, c) * p + uDrift;
  mat2 octaveRot = mat2(0.6, -0.8, 0.8, 0.6);
  for (int i = 0; i < 8; i++) {
    p += sin(p + uBoil + float(i + 1)) * WARP;
    p = octaveRot * p * ZOOM;
  }
  return p;
}

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  vec2 orbUv = (fragCoord * 2.0 - uResolution) / min(uResolution.x, uResolution.y);
  float mask = smoothstep(0.012, -0.012, length(orbUv) - RADIUS);
  if (mask <= 0.0) {
    outColor = vec4(0.0);
    return;
  }

  vec2 p0 = creaseField(fragCoord);
  vec2 px = creaseField(fragCoord + vec2(RIM_WIDTH, 0.0));
  vec2 py = creaseField(fragCoord + vec2(0.0, RIM_WIDTH));

  vec3 e = vec3(0.0);
  for (int ch = 0; ch < 3; ch++) {
    float phase = float(ch) * FRINGE;
    vec2 v0 = sin(p0 * RIPPLE + phase);
    vec2 delta = abs(sin(px * RIPPLE + phase) - v0) + abs(sin(py * RIPPLE + phase) - v0);
    e[ch] = tanh(length(delta) * EDGE_GAIN / EXPOSURE);
  }
  e = pow(clamp(e, 0.0, 1.0), vec3(CONTRAST));

  vec3 col = TINT * e + BODY * FLOOR_LEVEL;
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(vec3(lum), col, SATURATION);

  vec2 pl = orbPlane(fragCoord);
  float z = sqrt(max(1.0 - dot(pl, pl), 0.0));
  float lambert = clamp(dot(vec3(pl, z), normalize(vec3(-0.45, 0.55, 0.72))), 0.0, 1.0);
  col *= 0.62 + KEY_LIGHT * lambert;
  float fres = 1.0 - z;
  col += SHEEN * RIM_SHEEN * fres * fres * fres;

  outColor = vec4(max(col, 0.0) * mask, mask);
}`;

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  console.error(gl.getShaderInfoLog(shader));
  return null;
}

export function FoldOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl2", { antialias: false, premultipliedAlpha: true });
    const vertex = gl && compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fragment = gl && compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    const program = gl?.createProgram();
    if (!canvas || !gl || !vertex || !fragment || !program) {
      setSupported(false);
      return;
    }
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uBoil = gl.getUniformLocation(program, "uBoil");
    const uDrift = gl.getUniformLocation(program, "uDrift");
    const uSwirl = gl.getUniformLocation(program, "uSwirl");

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // shadercn advances each phase at 0.1 x its value per second while the orb is idle.
    const phase = { boil: Math.random() * 100, drift: Math.random() * 100, swirl: 0 };
    let frame = 0;
    let last = 0;

    const draw = () => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uBoil, phase.boil);
      gl.uniform1f(uDrift, phase.drift);
      gl.uniform1f(uSwirl, phase.swirl);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (time: number) => {
      frame = requestAnimationFrame(loop);
      const dt = last ? Math.min((time - last) / 1000, 0.1) : 0;
      last = time;
      phase.boil += dt * 0.1 * 3;
      phase.drift += dt * 0.1 * 0.6;
      phase.swirl += dt * 0.1 * 0.05;
      draw();
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      draw();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const intersection = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      last = 0;
      frame = entry.isIntersecting && !reducedMotion ? requestAnimationFrame(loop) : 0;
    });
    intersection.observe(canvas);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
    };
  }, []);

  if (!supported) return null;
  return <canvas aria-hidden="true" className={styles.foldOrb} ref={canvasRef} />;
}
