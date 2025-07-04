
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.z = 40;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const sunLight = new THREE.PointLight(0xffffff, 1.5);
scene.add(sunLight);

const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

const planetsData = [
  { name: 'Mercury', radius: 0.3, distance: 4, color: 0xaaaaaa },
  { name: 'Venus', radius: 0.5, distance: 6, color: 0xffcc88 },
  { name: 'Earth', radius: 0.5, distance: 8, color: 0x3399ff },
  { name: 'Mars', radius: 0.4, distance: 10, color: 0xff5533 },
  { name: 'Jupiter', radius: 1.0, distance: 13, color: 0xffaa66 },
  { name: 'Saturn', radius: 0.9, distance: 16, color: 0xffee99 },
  { name: 'Uranus', radius: 0.7, distance: 19, color: 0x66ffff },
  { name: 'Neptune', radius: 0.7, distance: 22, color: 0x3366ff },
];

const planets = [];
const orbitSpeeds = {};

planetsData.forEach(planet => {
  const geometry = new THREE.SphereGeometry(planet.radius, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: planet.color });
  const mesh = new THREE.Mesh(geometry, material);

  mesh.userData = {
    distance: planet.distance,
    angle: Math.random() * Math.PI * 2
  };

  scene.add(mesh);
  planets.push(mesh);

  orbitSpeeds[planet.name] = 0.01; 
 
  const sliderContainer = document.createElement('div');
  sliderContainer.className = 'slider-container';
  sliderContainer.innerHTML = `
    <label>${planet.name} Speed</label>
    <input type="range" min="0" max="0.05" step="0.001" value="0.01" id="${planet.name}">
  `;
  document.getElementById('sliders').appendChild(sliderContainer);

  document.getElementById(planet.name).addEventListener('input', (e) => {
    orbitSpeeds[planet.name] = parseFloat(e.target.value);
  });
});

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();

  planets.forEach((planet, i) => {
    const { name } = planetsData[i];
    planet.userData.angle += orbitSpeeds[name] * delta;

    const x = Math.cos(planet.userData.angle) * planet.userData.distance;
    const z = Math.sin(planet.userData.angle) * planet.userData.distance;
    planet.position.set(x, 0, z);

    planet.rotation.y += 0.01; 
  });

  sun.rotation.y += 0.002; 

  renderer.render(scene, camera);
}
animate();
