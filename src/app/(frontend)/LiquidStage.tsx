"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./page.module.css";

type RenderMode = "smooth" | "dither";

const VERTEX = `#version 300 es
in vec2 aPosition;
void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }`;

const FRAGMENT = `#version 300 es
precision highp float;
uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uLight;
uniform float uDither;
out vec4 outColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  mat2 rotate = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 3; i++) {
    value += amplitude * noise(p);
    p = rotate * p;
    amplitude *= 0.5;
  }
  return value;
}

float pattern(vec2 p, float t, out vec2 r) {
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t));
  r = vec2(fbm(p + 2.6 * q + vec2(1.7, 9.2) + 0.7 * t), fbm(p + 2.6 * q + vec2(8.3, 2.8) - 0.5 * t));
  return fbm(p + 2.6 * r);
}

float bayer4(vec2 p) {
  ivec2 q = ivec2(mod(p, 4.0));
  const float m[16] = float[16](0., 8., 2., 10., 12., 4., 14., 6., 3., 11., 1., 9., 15., 7., 13., 5.);
  return (m[q.x + q.y * 4] + 0.5) / 16.0;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float aspect = uResolution.x / uResolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y) * 1.2;

  float t = uTime * 0.03;
  vec2 r;
  vec2 unused;
  float f = pattern(p, t, r);
  float e = 1.2 / uResolution.y;
  float fx = pattern(p + vec2(e, 0.0), t, unused);
  float fy = pattern(p + vec2(0.0, e), t, unused);

  vec3 normal = normalize(vec3(-(fx - f) / e * 0.07, -(fy - f) / e * 0.07, 1.0));
  vec3 light = normalize(vec3((uLight - uv) * vec2(aspect, 1.0), 0.8));
  float diffuse = max(dot(normal, light), 0.0);
  float specular = pow(max(dot(reflect(-light, normal), vec3(0.0, 0.0, 1.0)), 0.0), 10.0);

  float base = mix(0.03, 0.24, smoothstep(0.2, 0.9, f)) * (0.75 + 0.4 * length(r));
  float tone = base * (0.5 + 0.5 * diffuse) + specular * 0.16;
  tone *= 1.0 - 0.45 * smoothstep(0.35, 1.0, length(uv - vec2(0.5, 0.55)));

  if (uDither > 0.5) {
    tone = floor(tone * 5.0 + bayer4(gl_FragCoord.xy)) / 5.0;
  }

  outColor = vec4(vec3(tone) * vec3(0.97, 0.98, 1.0), 1.0);
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

export function LiquidStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl2", { antialias: false });
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
    const uTime = gl.getUniformLocation(program, "uTime");
    const uLight = gl.getUniformLocation(program, "uLight");
    const uDither = gl.getUniformLocation(program, "uDither");

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let mode: RenderMode = "smooth";
    let frame = 0;

    const resize = () => {
      const scale = mode === "dither" ? 1 / 3 : 0.5;
      canvas.width = Math.max(1, Math.round(window.innerWidth * scale));
      canvas.height = Math.max(1, Math.round(window.innerHeight * scale));
      canvas.dataset.mode = mode;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const draw = (time: number) => {
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, time / 1000);
      gl.uniform2f(
        uLight,
        0.55 + 0.25 * Math.sin(time * 0.00021),
        0.5 + 0.2 * Math.sin(time * 0.00029 + 1.1),
      );
      gl.uniform1f(uDither, mode === "dither" ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (time: number) => {
      frame = requestAnimationFrame(loop);
      draw(time);
    };
    const start = () => {
      if (!frame && !reducedMotion) frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const onResize = () => {
      resize();
      if (reducedMotion) draw(12_000);
    };

    // The hero and footer are never on screen together, so the canvas follows whichever is showing.
    const showing = new Map<Element, boolean>();
    const intersection = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const dithered = (entry.target as HTMLElement).dataset.liquidWindow === "dither";
        if (entry.isIntersecting) showing.set(entry.target, dithered);
        else showing.delete(entry.target);
      }
      const next: RenderMode = [...showing.values()].includes(true) ? "dither" : "smooth";
      if (next !== mode) {
        mode = next;
        onResize();
      }
      if (showing.size > 0) start();
      else stop();
    });
    document.querySelectorAll("[data-liquid-window]").forEach((node) => intersection.observe(node));

    window.addEventListener("resize", onResize);
    onResize();

    return () => {
      stop();
      intersection.disconnect();
      window.removeEventListener("resize", onResize);
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return (
    <canvas
      aria-hidden="true"
      className={styles.liquid}
      data-supported={supported}
      ref={canvasRef}
    />
  );
}
