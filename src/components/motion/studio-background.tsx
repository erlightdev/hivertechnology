/**
 * Animated "silk" shader background (ogl / WebGL2), tinted with the honey brand tokens.
 *
 * - Colors come from CSS custom properties (--brand-vivid, --brand-orange) at mount,
 *   so the shader follows the design tokens instead of hard-coded hex values.
 * - Renders at ≤30 fps, pauses when off-screen or the tab is hidden, and draws a single
 *   still frame when the user prefers reduced motion.
 * - If WebGL2 is unavailable the container stays empty and the parent's CSS gradient shows.
 */
import { Mesh, Program, Renderer, Texture, Triangle } from "ogl";
import { useEffect, useRef } from "react";

const VERTEX_SHADER = "#version 300 es\nin vec2 position;\nvoid main() {\n  gl_Position = vec4(position, 0.0, 1.0);\n}\n";
const FRAGMENT_SHADER = "#version 300 es\nprecision highp float;\n\nuniform vec2 uResolution;\nuniform float uTime;\nuniform float uSpeed;\nuniform float uScale;\nuniform float uDetail;\nuniform float uDistortion;\nuniform sampler2D uTexture;\nuniform float uHasSource;\nuniform float uSourceAspect;\nuniform float uGenerator;\nuniform vec3 uColorA;\nuniform vec3 uColorB;\nuniform vec3 uColorC;\nuniform float uPixelate;\nuniform float uDither;\nuniform float uRgbSplit;\nuniform float uGlitch;\nuniform float uScanlines;\nuniform float uGrain;\nuniform float uDuotone;\nuniform float uEffectsVisible;\nuniform float uBrightness;\nuniform float uContrast;\nuniform float uSaturation;\nuniform float uHue;\nuniform float uGrayscale;\nuniform float uSepia;\nuniform float uInvert;\nuniform float uVignette;\nuniform float uGlow;\nuniform float uPosterize;\nuniform float uEdgeGlow;\nuniform float uPixelSort;\nuniform float uLed;\nuniform float uPixelSize;\nuniform float uDensity;\nuniform float uExposure;\nuniform float uScatter;\nuniform float uPixelOpacity;\nuniform float uDitherAlgorithm;\nuniform float uAnimationPreset;\nuniform float uAnimationPace;\nuniform float uAnimationIntensity;\n\nout vec4 fragColor;\n\nfloat hash21(vec2 p) {\n  p = fract(p * vec2(123.34, 456.21));\n  p += dot(p, p + 45.32);\n  return fract(p.x * p.y);\n}\n\nfloat noise(vec2 p) {\n  vec2 i = floor(p);\n  vec2 f = fract(p);\n  f = f * f * (3.0 - 2.0 * f);\n  return mix(\n    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),\n    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0)), f.x),\n    f.y\n  );\n}\n\nfloat fbm(vec2 p) {\n  float value = 0.0;\n  float amplitude = 0.5;\n  for (int i = 0; i < 4; i++) {\n    value += amplitude * noise(p);\n    p = p * 2.03 + vec2(1.7, 9.2);\n    amplitude *= 0.5;\n  }\n  return value;\n}\n\nfloat bayer8(vec2 p) {\n  vec2 cell = mod(floor(p), 8.0);\n  float x = cell.x;\n  float y = cell.y;\n  float value = mod(x, 2.0) * 32.0 + mod(y, 2.0) * 16.0;\n  value += mod(floor(x / 2.0), 2.0) * 8.0;\n  value += mod(floor(y / 2.0), 2.0) * 4.0;\n  value += mod(floor(x / 4.0), 2.0) * 2.0;\n  value += mod(floor(y / 4.0), 2.0);\n  return (value + 0.5) / 64.0;\n}\n\nmat2 rotate2d(float angle) {\n  float s = sin(angle);\n  float c = cos(angle);\n  return mat2(c, -s, s, c);\n}\n\nvec2 coverUv(vec2 uv, float sourceAspect, float canvasAspect) {\n  vec2 result = uv;\n  if (sourceAspect > canvasAspect) {\n    float scale = canvasAspect / sourceAspect;\n    result.x = (uv.x - 0.5) * scale + 0.5;\n  } else {\n    float scale = sourceAspect / canvasAspect;\n    result.y = (uv.y - 0.5) * scale + 0.5;\n  }\n  return result;\n}\n\nvec3 generatedSource(vec2 uv) {\n  float aspect = uResolution.x / uResolution.y;\n  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);\n  p *= mix(0.72, 1.52, uScale) * mix(0.86, 1.18, uDetail);\n  float t = uTime * mix(0.02, 0.28, uSpeed);\n  p += vec2(sin(p.y * 2.1 + t), cos(p.x * 1.7 - t)) * uDistortion * 0.1;\n  vec3 color;\n\n\n    // Matches the premium auth Silk component: nested sinusoidal folds with\n    // fine grain, rather than a generic domain-warped fluid surface.\n    vec2 tex = uv;\n    float tOffset = t * 4.16;\n    tex.y += 0.03 * sin(8.0 * tex.x - tOffset);\n    float pattern = 0.6 + 0.4 * sin(\n      5.0 * (\n        tex.x + tex.y + cos(3.0 * tex.x + 5.0 * tex.y) + 0.02 * tOffset\n      ) + sin(20.0 * (tex.x + tex.y - 0.1 * tOffset))\n    );\n    float silkGrain = hash21(gl_FragCoord.xy) / 15.0;\n    color = mix(uColorA, uColorB, clamp(pattern, 0.0, 1.0));\n    color = mix(color, uColorC, smoothstep(0.86, 1.0, pattern) * 0.32);\n    color -= silkGrain * 0.11;\n\n\n  return clamp(color, 0.0, 1.0);\n}\n\nvec3 sourceAt(vec2 uv) {\n  if (uHasSource > 0.5) {\n    float canvasAspect = uResolution.x / uResolution.y;\n    return texture(uTexture, coverUv(uv, uSourceAspect, canvasAspect)).rgb;\n  }\n  return generatedSource(uv);\n}\n\nfloat bayer4(vec2 p) {\n  ivec2 cell = ivec2(mod(floor(p), 4.0));\n  int index = cell.y * 4 + cell.x;\n  float matrix[16] = float[16](\n    0.0, 8.0, 2.0, 10.0,\n    12.0, 4.0, 14.0, 6.0,\n    3.0, 11.0, 1.0, 9.0,\n    15.0, 7.0, 13.0, 5.0\n  );\n  return (matrix[index] + 0.5) / 16.0;\n}\n\nvec3 hueShift(vec3 color, float angle) {\n  const mat3 toYiq = mat3(\n    0.299, 0.587, 0.114,\n    0.596, -0.275, -0.321,\n    0.212, -0.523, 0.311\n  );\n  const mat3 toRgb = mat3(\n    1.0, 0.956, 0.621,\n    1.0, -0.272, -0.647,\n    1.0, -1.107, 1.705\n  );\n  vec3 yiq = toYiq * color;\n  float hue = atan(yiq.z, yiq.y) + angle;\n  float chroma = length(yiq.yz);\n  return clamp(toRgb * vec3(yiq.x, chroma * cos(hue), chroma * sin(hue)), 0.0, 1.0);\n}\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / uResolution.xy;\n  vec2 treatedUv = uv;\n  float visible = uEffectsVisible;\n  float animated = 0.0;\n  if (uAnimationPreset > 0.5) {\n    float phase = uTime * mix(0.3, 3.2, uAnimationPace);\n    animated = sin(phase);\n    vec2 centeredUv = treatedUv - 0.5;\n    if (uAnimationPreset < 1.5) {\n      treatedUv = centeredUv * (1.0 + animated * 0.035 * uAnimationIntensity) + 0.5;\n    } else if (uAnimationPreset < 2.5) {\n      treatedUv += vec2(phase * 0.012, phase * -0.006) * uAnimationIntensity;\n    } else if (uAnimationPreset < 3.5) {\n      treatedUv.y += sin(uv.x * 7.0 - phase) * 0.035 * uAnimationIntensity;\n    } else if (uAnimationPreset < 4.5) {\n      float ring = sin(length(centeredUv) * 24.0 - phase * 2.0);\n      treatedUv += normalize(centeredUv + vec2(0.0001)) * ring * 0.018 * uAnimationIntensity;\n    } else if (uAnimationPreset < 5.5) {\n      treatedUv = rotate2d(phase * 0.08 * uAnimationIntensity) * centeredUv + 0.5;\n    } else if (uAnimationPreset < 6.5) {\n      float twist = length(centeredUv) * animated * 0.8 * uAnimationIntensity;\n      treatedUv = rotate2d(twist) * centeredUv + 0.5;\n    } else {\n      treatedUv += vec2(\n        sin(uv.y * 6.0 + phase),\n        cos(uv.x * 5.0 - phase * 0.8)\n      ) * 0.022 * uAnimationIntensity;\n    }\n  }\n\n  if (uGlitch * visible > 0.001) {\n    float band = floor(uv.y * mix(18.0, 62.0, uGlitch));\n    float jump = hash21(vec2(band, floor(uTime * 10.0)));\n    float activation = step(0.72 - uGlitch * 0.22, jump);\n    treatedUv.x += (jump - 0.5) * 0.13 * uGlitch * activation;\n  }\n\n  if (uPixelate * visible > 0.001) {\n    float blockSize = mix(2.0, 42.0, uPixelSize) * mix(0.9, 1.1, animated * uAnimationIntensity + 0.5);\n    vec2 cells = max(vec2(1.0), floor(uResolution / blockSize));\n    treatedUv = (floor(treatedUv * cells) + 0.5) / cells;\n  }\n\n  vec3 color;\n  if (uRgbSplit * visible > 0.001) {\n    float offset = mix(0.001, 0.018, uRgbSplit);\n    float red = sourceAt(treatedUv + vec2(offset, 0.0)).r;\n    float green = sourceAt(treatedUv).g;\n    float blue = sourceAt(treatedUv - vec2(offset, 0.0)).b;\n    color = vec3(red, green, blue);\n  } else {\n    color = sourceAt(treatedUv);\n  }\n\n  if (abs(uBrightness - 1.0) > 0.001) color *= uBrightness;\n  if (abs(uContrast - 1.0) > 0.001) color = (color - 0.5) * uContrast + 0.5;\n  float baseLuma = dot(color, vec3(0.2126, 0.7152, 0.0722));\n  if (abs(uSaturation - 1.0) > 0.001) color = mix(vec3(baseLuma), color, uSaturation);\n  if (abs(uHue) > 0.001) color = hueShift(color, uHue);\n  if (uGrayscale > 0.001) color = mix(color, vec3(baseLuma), uGrayscale);\n  if (uSepia > 0.001) {\n    vec3 sepiaColor = vec3(\n      dot(color, vec3(0.393, 0.769, 0.189)),\n      dot(color, vec3(0.349, 0.686, 0.168)),\n      dot(color, vec3(0.272, 0.534, 0.131))\n    );\n    color = mix(color, sepiaColor, uSepia);\n  }\n  if (uInvert > 0.001) color = mix(color, 1.0 - color, uInvert);\n\n  if (uPixelSort * visible > 0.001) {\n    float sortAmount = uPixelSort * visible;\n    float row = floor(uv.y * mix(48.0, 220.0, uDensity));\n    float rowSeed = hash21(vec2(row, floor(uTime * 1.8)));\n    float sourceLight = dot(color, vec3(0.2126, 0.7152, 0.0722));\n    float sortGate = smoothstep(0.24, 0.78, sourceLight) * step(0.22, rowSeed);\n    float direction = rowSeed > 0.5 ? 1.0 : -1.0;\n    vec2 sortUv = treatedUv + vec2(\n      direction * mix(0.006, 0.19, sortAmount) * sortGate,\n      0.0\n    );\n    vec3 sorted = sourceAt(clamp(sortUv, 0.0, 1.0));\n    float streak = smoothstep(0.08, 0.92, hash21(vec2(floor(uv.x * 9.0), row)));\n    color = mix(color, sorted, sortAmount * sortGate * mix(0.45, 1.0, streak));\n  }\n\n  if (uPosterize * visible > 0.001) {\n    float posterizeAmount = uPosterize * visible;\n    float levels = floor(mix(10.0, 2.0, posterizeAmount) + 0.5);\n    vec3 posterized = floor(color * levels + 0.5) / levels;\n    color = mix(color, posterized, smoothstep(0.08, 0.4, posterizeAmount));\n  }\n\n  if (uGlow > 0.001) {\n    vec2 texel = 2.5 / uResolution;\n    vec3 bloom = sourceAt(treatedUv + vec2(texel.x, 0.0));\n    bloom += sourceAt(treatedUv - vec2(texel.x, 0.0));\n    bloom += sourceAt(treatedUv + vec2(0.0, texel.y));\n    bloom += sourceAt(treatedUv - vec2(0.0, texel.y));\n    color = mix(color, bloom * 0.25 + color * 0.2, uGlow * 0.55);\n  }\n\n  float luminance = dot(color, vec3(0.2126, 0.7152, 0.0722));\n\n  if (uDuotone * visible > 0.001) {\n    vec3 mapped = luminance < 0.5\n      ? mix(uColorA, uColorB, luminance * 2.0)\n      : mix(uColorB, uColorC, (luminance - 0.5) * 2.0);\n    color = mix(color, mapped, uDuotone);\n    luminance = dot(color, vec3(0.2126, 0.7152, 0.0722));\n  }\n\n  if (uEdgeGlow * visible > 0.001) {\n    vec2 edgeTexel = mix(1.0, 3.2, uEdgeGlow) / uResolution;\n    vec3 leftSample = sourceAt(clamp(treatedUv - vec2(edgeTexel.x, 0.0), 0.0, 1.0));\n    vec3 rightSample = sourceAt(clamp(treatedUv + vec2(edgeTexel.x, 0.0), 0.0, 1.0));\n    vec3 downSample = sourceAt(clamp(treatedUv - vec2(0.0, edgeTexel.y), 0.0, 1.0));\n    vec3 upSample = sourceAt(clamp(treatedUv + vec2(0.0, edgeTexel.y), 0.0, 1.0));\n    float horizontalEdge = length(rightSample - leftSample);\n    float verticalEdge = length(upSample - downSample);\n    float edgeStrength = smoothstep(0.08, 0.72, horizontalEdge + verticalEdge);\n    vec3 edgeColor = mix(uColorB, uColorC, clamp(luminance + 0.2, 0.0, 1.0));\n    color += edgeColor * edgeStrength * uEdgeGlow * 1.35;\n    color *= 1.0 - edgeStrength * uEdgeGlow * 0.16;\n  }\n\n  if (uDither * visible > 0.001) {\n    vec2 matrixPoint = gl_FragCoord.xy / mix(1.0, 4.2, uPixelSize);\n    float threshold = uDitherAlgorithm < 0.5\n      ? bayer4(matrixPoint)\n      : uDitherAlgorithm < 1.5\n        ? bayer8(matrixPoint)\n        : hash21(floor(matrixPoint));\n    float value = luminance + uExposure + (threshold - 0.5) * mix(0.12, 0.82, uDensity);\n    vec3 dithered = value < 0.34 ? uColorA : value < 0.68 ? uColorB : uColorC;\n    color = mix(color, dithered, uPixelOpacity * smoothstep(0.05, 0.32, uDither));\n  }\n\n  if (uLed * visible > 0.001) {\n    float cellSize = mix(5.0, 44.0, uPixelSize);\n    vec2 cell = floor(gl_FragCoord.xy / cellSize);\n    vec2 point = fract(gl_FragCoord.xy / cellSize) - 0.5;\n    point += (hash21(cell) - 0.5) * uScatter * 0.38;\n    float radius = mix(0.08, 0.48, clamp(luminance + uExposure, 0.0, 1.0));\n    float ring = abs(length(point) - radius * 0.7);\n    float mask = 1.0 - smoothstep(0.035, 0.09, ring);\n    vec3 ink = mix(uColorA, uColorC, luminance);\n    color = mix(color, mix(uColorA, ink, mask), uPixelOpacity * uLed);\n  }\n\n  if (uScanlines * visible > 0.001) {\n    float line = 0.5 + 0.5 * sin(gl_FragCoord.y * 3.14159);\n    color *= 1.0 - line * uScanlines * 0.34;\n  }\n\n  if (uGrain * visible > 0.001) {\n    float grain = hash21(gl_FragCoord.xy + floor(uTime * 24.0)) - 0.5;\n    color += grain * uGrain * 0.22;\n  }\n\n  if (uVignette > 0.001) {\n    float edge = smoothstep(0.82, 0.18, length((uv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0)));\n    color *= mix(1.0, edge, uVignette * 0.72);\n  }\n\n  fragColor = vec4(clamp(color, 0.0, 1.0), 1.0);\n}\n";

const PRESET = {
  generator: 3,
  settings: {
    speed: 18,
    scale: 62,
    detail: 44,
    distortion: 30,
    glow: 24,
    vignette: 16,
    brightness: 100,
    contrast: 104,
    saturation: 92,
    hue: 0,
  },
  grain: 0.18,
  pixelSettings: { size: 34, density: 56, exposure: 50, scatter: 0, opacity: 100 },
  ditherAlgorithm: 0,
  animation: { preset: 0, pace: 0.36, intensity: 0.28 },
} as const;

type Uniform = { value: unknown };
type Rgb = [number, number, number];

function hexToRgb(hex: string): Rgb {
  const clean = hex.trim().replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean.slice(0, 6);
  const value = Number.parseInt(full, 16);
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
}

/** Honey palette from the design tokens: deep honey shadow → orange → amber highlight. */
function brandPalette(): [Rgb, Rgb, Rgb] {
  const styles = getComputedStyle(document.documentElement);
  const token = (name: string, fallback: string) => styles.getPropertyValue(name).trim() || fallback;
  const amber = hexToRgb(token("--brand-vivid", "#f59e0b"));
  const orange = hexToRgb(token("--brand-orange", "#f97316"));
  const shadow = orange.map((c) => c * 0.16) as Rgb; // the orange, deepened to a dark honey
  return [shadow, orange, amber];
}

export function StudioBackground({ className = "", paused = false }: { className?: string; paused?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: Renderer;
    try {
      renderer = new Renderer({ webgl: 2, alpha: false, antialias: false, dpr: 1 });
      if (!renderer.isWebgl2) throw new Error("WebGL2 unavailable");
    } catch {
      return; // Keep the CSS gradient fallback.
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const [colorA, colorB, colorC] = brandPalette();
    const gl = renderer.gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    Object.assign(canvas.style, { width: "100%", height: "100%", display: "block", opacity: "0", transition: "opacity 600ms ease" });
    container.appendChild(canvas);

    const texture = new Texture(gl, {
      image: new Uint8Array([8, 8, 8, 255]),
      width: 1,
      height: 1,
      generateMipmaps: false,
    });
    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: VERTEX_SHADER,
      fragment: FRAGMENT_SHADER,
      uniforms: {
        uResolution: { value: new Float32Array([1, 1]) },
        uTime: { value: 7.5 },
        uTexture: { value: texture },
        uHasSource: { value: 0 },
        uSourceAspect: { value: 1 },
        uGenerator: { value: PRESET.generator },
        uColorA: { value: new Float32Array(colorA) },
        uColorB: { value: new Float32Array(colorB) },
        uColorC: { value: new Float32Array(colorC) },
        uSpeed: { value: PRESET.settings.speed / 100 },
        uScale: { value: PRESET.settings.scale / 100 },
        uDetail: { value: PRESET.settings.detail / 100 },
        uDistortion: { value: PRESET.settings.distortion / 100 },
        uGlow: { value: PRESET.settings.glow / 100 },
        uGrain: { value: PRESET.grain },
        uVignette: { value: PRESET.settings.vignette / 100 },
        uBrightness: { value: PRESET.settings.brightness / 100 },
        uContrast: { value: PRESET.settings.contrast / 100 },
        uSaturation: { value: PRESET.settings.saturation / 100 },
        uHue: { value: (PRESET.settings.hue / 180) * Math.PI },
        uGrayscale: { value: 0 },
        uSepia: { value: 0 },
        uInvert: { value: 0 },
        uPixelate: { value: 0 },
        uDither: { value: 0 },
        uPosterize: { value: 0 },
        uEdgeGlow: { value: 0 },
        uPixelSort: { value: 0 },
        uLed: { value: 0 },
        uRgbSplit: { value: 0 },
        uGlitch: { value: 0 },
        uScanlines: { value: 0 },
        uDuotone: { value: 0 },
        uPixelSize: { value: PRESET.pixelSettings.size / 100 },
        uDensity: { value: PRESET.pixelSettings.density / 100 },
        uExposure: { value: (PRESET.pixelSettings.exposure - 50) / 100 },
        uScatter: { value: PRESET.pixelSettings.scatter / 100 },
        uPixelOpacity: { value: PRESET.pixelSettings.opacity / 100 },
        uDitherAlgorithm: { value: PRESET.ditherAlgorithm },
        uAnimationPreset: { value: PRESET.animation.preset },
        uAnimationPace: { value: PRESET.animation.pace },
        uAnimationIntensity: { value: PRESET.animation.intensity },
        uEffectsVisible: { value: 1 },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    const draw = () => renderer.render({ scene: mesh });

    const resize = () => {
      const bounds = container.getBoundingClientRect();
      const width = Math.max(1, Math.round(bounds.width));
      const height = Math.max(1, Math.round(bounds.height));
      const pixelBudget = 1280 * 720;
      const budgetDpr = Math.sqrt(pixelBudget / (width * height));
      renderer.dpr = Math.max(0.5, Math.min(window.devicePixelRatio || 1, 2, budgetDpr));
      renderer.setSize(width, height);
      const resolution = (program.uniforms.uResolution as Uniform).value as Float32Array;
      resolution[0] = gl.drawingBufferWidth;
      resolution[1] = gl.drawingBufferHeight;
      if (reduceMotion) draw();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();

    let frame = 0;
    let elapsed = 7500;
    let previous = 0;
    let lastRenderedAt = 0;
    let pageVisible = !document.hidden;
    let stageVisible = true;
    const render = (now: number) => {
      if (!previous) previous = now;
      const delta = Math.min(40, now - previous);
      previous = now;
      if (pageVisible && stageVisible && !pausedRef.current && now - lastRenderedAt >= 1000 / 30 - 1) {
        elapsed += delta;
        lastRenderedAt = now;
        (program.uniforms.uTime as Uniform).value = elapsed / 1000;
        draw();
      }
      frame = requestAnimationFrame(render);
    };
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      stageVisible = entry?.isIntersecting ?? true;
    });
    intersectionObserver.observe(container);
    const handleVisibilityChange = () => {
      pageVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    draw();
    canvas.style.opacity = "1";
    if (!reduceMotion) frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      program.remove();
      geometry.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    };
  }, []);

  return <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true" />;
}

export default StudioBackground;
