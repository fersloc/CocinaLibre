// Torta 3D interactiva de "Arma tu torta": 4 capas (bizcocho, relleno, bizcocho, cubierta).
// Gira sola, se arrastra con inercia y las capas se juntan al bajar con el scroll.
// Si algo falla (sin WebGL, error de carga) no pasa nada: la pagina deja las fotos de siempre.
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const root = document.getElementById("cake3d");
const canvas = root.querySelector("canvas");
const labels = [...root.querySelectorAll(".cake3d-lbl")];   // cubierta, bizcocho, relleno, bizcocho
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const asset = (p) => new URL(p, import.meta.url).href;

// Medidas (px) de las fotos recortadas: elipse de la tapa (centro cx,cy, semiejes a,b)
// y franja del costado frontal que se repite alrededor del cilindro.
const DISCS = {
  base:  { file: asset("../builder-cake-base-trim.png"),  W: 1174, H: 563, cx: 588, cy: 176, a: 560, b: 154, strip: [300, 345, 880, 505], h: 0.31 },
  cream: { file: asset("../builder-cake-cream-trim.png"), W: 1149, H: 474, cx: 575, cy: 148, a: 550, b: 126, strip: [300, 285, 850, 428], h: 0.27 },
};
const TOPPING_WIDTH = 2.15;
const SEP = 0.8;                         // separacion entre capas con la torta abierta

const loadImage = (src) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);

function tex(source) {
  const t = new THREE.Texture(source);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
  t.needsUpdate = true;
  return t;
}

function buildDisc(d, img) {
  const g = new THREE.Group();
  const [x0, y0, x1, y1] = d.strip;
  const c = document.createElement("canvas");
  c.width = x1 - x0; c.height = y1 - y0;
  c.getContext("2d").drawImage(img, x0, y0, c.width, c.height, 0, 0, c.width, c.height);
  const side = tex(c);
  side.wrapS = THREE.MirroredRepeatWrapping;
  side.repeat.set(6, 1);
  const wall = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, d.h, 96, 1, true), new THREE.MeshBasicMaterial({ map: side }));
  wall.position.y = d.h / 2;
  g.add(wall);

  const geo = new THREE.CircleGeometry(1, 96);
  const pos = geo.attributes.position, uv = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, (d.cx + d.a * pos.getX(i)) / d.W, 1 - (d.cy - d.b * pos.getY(i)) / d.H);
  }
  const top = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tex(img) }));
  top.rotation.x = -Math.PI / 2;
  top.position.y = d.h + 0.001;
  g.add(top);

  const bottom = new THREE.Mesh(new THREE.CircleGeometry(1, 48), new THREE.MeshBasicMaterial({ map: side }));
  bottom.rotation.x = Math.PI / 2;
  g.add(bottom);
  return g;
}

async function build() {
  const [imgBase, imgCream] = await Promise.all([loadImage(DISCS.base.file), loadImage(DISCS.cream.file)]);

  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  const key = new THREE.DirectionalLight(0xffffff, 1.2);
  key.position.set(2, 4, 3);
  scene.add(key);

  const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(asset("./topping.glb"));
  const model = gltf.scene;
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3()), ctr = box.getCenter(new THREE.Vector3());
  const k = TOPPING_WIDTH / Math.max(size.x, size.z);
  model.scale.setScalar(k);
  model.position.set(-ctr.x * k, -box.min.y * k, -ctr.z * k);   // centrada y apoyada en y=0

  const cake = new THREE.Group();
  const base1 = buildDisc(DISCS.base, imgBase);    // abajo: bizcocho
  const cream = buildDisc(DISCS.cream, imgCream);  // relleno
  const base2 = buildDisc(DISCS.base, imgBase);    // bizcocho
  const topping = new THREE.Group();               // arriba: cubierta
  topping.add(model);
  cake.add(base1, cream, base2, topping);
  scene.add(cake);
  return { cake, base1, cream, base2, topping, hB: DISCS.base.h, hC: DISCS.cream.h, toppingH: size.y * k };
}

const parts = await build();
const { cake, base1, cream, base2, topping, hB, hC, toppingH } = parts;

// --- interaccion: giro lento en reposo + arrastre con inercia ---
let yaw = 0.5, pitch = 0.40, pitchTarget = 0.40;
const AUTO = reduceMotion ? 0 : 0.22;
let vel = AUTO, dragging = false, lastX = 0, lastY = 0, lastT = 0;
canvas.addEventListener("pointerdown", (e) => { dragging = true; vel = 0; lastX = e.clientX; lastY = e.clientY; lastT = performance.now(); canvas.setPointerCapture(e.pointerId); });
canvas.addEventListener("pointermove", (e) => {
  if (!dragging) return;
  const now = performance.now(), dtm = Math.max(now - lastT, 8) / 1000;
  const dyaw = (e.clientX - lastX) * 0.008;
  yaw += dyaw;
  vel = THREE.MathUtils.lerp(vel, dyaw / dtm, 0.35);
  if (e.pointerType === "mouse") pitchTarget = THREE.MathUtils.clamp(pitchTarget + (e.clientY - lastY) * 0.004, 0.12, 1.0);
  lastX = e.clientX; lastY = e.clientY; lastT = now;
});
["pointerup", "pointercancel"].forEach((t) => canvas.addEventListener(t, () => { dragging = false; vel = THREE.MathUtils.clamp(vel, -6, 6); }));

// --- tamano y scroll ---
const TX = 0.7;                           // la torta queda a la izquierda; las etiquetas, a la derecha
function resize() {
  const w = root.clientWidth, h = root.clientHeight;
  if (!w || !h) return;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.userData.t = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(root);

// p = 0 (capas abiertas) al llegar a la seccion; p = 1 (torta junta) tras bajar un poco
function progress() {
  const vh = innerHeight, r = root.getBoundingClientRect();
  const docCenter = r.top + scrollY + r.height / 2;
  const D = THREE.MathUtils.clamp(docCenter - 0.35 * vh, 0.3 * vh, 0.6 * vh);
  return THREE.MathUtils.clamp(scrollY / D, 0, 1);
}
const ease = (t) => t * t * (3 - 2 * t);

let visible = false, running = false, last = 0;
new IntersectionObserver((es) => { visible = es[0].isIntersecting; if (visible && !running) { running = true; last = performance.now(); requestAnimationFrame(frame); } }).observe(root);

const v = new THREE.Vector3();
function frame(now) {
  if (!visible || !root.offsetParent) { running = false; return; }   // sin gastar bateria si no se ve
  const dt = Math.min((now - last) / 1000, 0.05); last = now;

  if (!dragging) { vel += (AUTO - vel) * (1 - Math.exp(-dt * 1.2)); yaw += vel * dt; }
  pitch += (pitchTarget - pitch) * (1 - Math.exp(-dt * 8));

  const p = ease(progress()), s = (1 - p) * SEP;
  base1.position.y = 0;
  cream.position.y = hB + s;
  base2.position.y = hB + hC + 2 * s;
  topping.position.y = 2 * hB + hC + 3 * s;
  cake.rotation.y = yaw;

  // abierta: se ve todo y la torta queda a la izquierda (etiquetas a la derecha); junta: se acerca y se centra
  // el encuadre se calcula con la altura real de la torta (que cambia al juntarse), para que nunca se corte
  const yTop = topping.position.y + toppingH;
  const t = camera.userData.t, needW = 3.8 - 0.8 * p;
  const needH = yTop * Math.cos(pitch) + 2.2 * Math.sin(pitch) + 0.6;
  const d = Math.max(needH / t, needW / (t * camera.aspect));
  const lookY = yTop / 2, tx = TX * (1 - p);
  camera.position.set(tx, lookY + Math.sin(pitch) * d, Math.cos(pitch) * d);
  camera.lookAt(tx, lookY, 0);

  const centers = [topping.position.y + toppingH * 0.3, base2.position.y + hB / 2, cream.position.y + hC / 2, base1.position.y + hB / 2];
  const h = root.clientHeight;
  centers.forEach((y, i) => {
    v.set(0, y, 0).project(camera);
    labels[i].style.top = ((1 - v.y) / 2 * h) + "px";
    labels[i].style.opacity = String(1 - p);
  });

  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}

root.classList.add("is-ready");           // mostrar el 3D y ocultar las fotos de respaldo
resize();
