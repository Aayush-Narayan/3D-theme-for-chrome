import WindowManager from "./WindowManager.js";

const t = THREE;
const state = {
  camera: null,
  scene: null,
  renderer: null,
  world: null,
  graphs: [],
  sceneOffset: { x: 0, y: 0 },
  sceneOffsetTarget: { x: 0, y: 0 },
  windowManager: null,
  initialized: false,
  pixR: window.devicePixelRatio || 1,
  today: new Date().setHours(0, 0, 0, 0),
  animationFalloff: 0.05,
  mouseX: 0,
  mouseY: 0,
  isIdle: false,
  idleTimeout: null,
  trendingTopics: [
    "web development",
    "AI technology",
    "programming tutorials",
    "Three.js examples",
    "Digital marketing strategies",
    "cloud computing",
    "data science",
    "blockchain technology",
    "cybersecurity trends",
    "metaverse applications",
  ],
  clock: new t.Clock()
};

function init() {
  state.initialized = true;
  setTimeout(() => {
    setupScene();
    setupWindowManager();
    resize();
    updateWindowShape(false);
    render();
    window.addEventListener("resize", resize);
    createSearchWidget();
    createShortcutBar();
    document.addEventListener("mousemove", onMouseMove, false);
  }, 500);
}

function setupScene() {
  state.camera = new t.OrthographicCamera(
    0,
    window.innerWidth,
    0,
    window.innerHeight,
    -10000,
    10000
  );
  state.camera.position.z = 2.5;

  state.scene = new t.Scene();
  state.scene.background = new t.Color(0.0);
  state.scene.add(state.camera);

  state.renderer = new t.WebGLRenderer({ antialias: true, depthBuffer: true });
  state.renderer.setPixelRatio(state.pixR);

  state.world = new t.Object3D();
  state.scene.add(state.world);

  state.renderer.domElement.setAttribute("id", "scene");
  document.body.appendChild(state.renderer.domElement);
}

function setupWindowManager() {
  state.windowManager = new WindowManager();
  state.windowManager.setWinShapeChangeCallback(updateWindowShape);
  state.windowManager.setWinChangeCallback(windowsUpdated);
  state.windowManager.init({ foo: "bar" });
  windowsUpdated();
}

function windowsUpdated() {
  updateNumberOfGraphs();
}

function updateNumberOfGraphs() {
  const wins = state.windowManager.getWindows();

  // Clear existing graphs
  state.graphs.forEach((graph) => state.world.remove(graph));
  state.graphs = [];

  // Create new F54 graphs with increased size
  wins.forEach((win, i) => {
    const graph = createF54Graph(i);
    graph.position.set(
      win.shape.x + win.shape.w * 0.5,
      win.shape.y + win.shape.h * 0.5,
      0
    );
    state.world.add(graph);
    state.graphs.push(graph);
  });
}

function createF54Graph(index) {
  // Create F54 Cubic Symmetric Graph geometry
  const graphGeometry = new t.BufferGeometry();

  // Define vertices (simplified representation)
  const vertices = [];
  for (let j = 0; j < 54; j++) {
    const radius = (50 + index * 20 + 30) * 2;
    const theta = (j / 54) * Math.PI * 2;
    const phi = ((j % 3) * Math.PI) / 6;

    vertices.push(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi)
    );
  }

  // Define edges (simplified connections)
  const edges = [];
  for (let j = 0; j < 54; j++) {
    edges.push(j, (j + 1) % 54);
    edges.push(j, (j + 3) % 54);
    edges.push(j, (j + 9) % 54);
  }

  graphGeometry.setAttribute(
    "position",
    new t.Float32BufferAttribute(vertices, 3)
  );
  graphGeometry.setIndex(new t.Uint16BufferAttribute(edges, 1));

  // Create the graph mesh
  const graphMaterial = new t.LineBasicMaterial({
    color: new t.Color().setHSL(index * 0.1, 1.0, 0.5),
    transparent: true,
    opacity: 0.7,
  });

  // Create glowing particle sprite
  const spriteMaterial = new t.SpriteMaterial({
    color: new t.Color().setHSL(index * 0.1, 1.0, 0.8),
    transparent: true,
    opacity: 0.6,
  });
  const sprite = new t.Sprite(spriteMaterial);
  sprite.scale.set(20, 20, 1);

  const group = new t.Group();
  group.add(new t.LineSegments(graphGeometry, graphMaterial));
  group.add(sprite);
  return group;
}

function updateWindowShape(easing = true) {
  Object.assign(state.sceneOffsetTarget, {
    x: -window.screenX,
    y: -window.screenY,
  });
  if (!easing) Object.assign(state.sceneOffset, state.sceneOffsetTarget);
}

function render() {
  state.windowManager.update();

  // Smooth position update
  state.sceneOffset.x +=
    (state.sceneOffsetTarget.x - state.sceneOffset.x) * state.animationFalloff;
  state.sceneOffset.y +=
    (state.sceneOffsetTarget.y - state.sceneOffset.y) * state.animationFalloff;
  state.world.position.set(state.sceneOffset.x, state.sceneOffset.y, 0);

  // Get time once per frame using a persistent clock
  const elapsed = state.clock.getElapsedTime();

  // Update graphs
  const wins = state.windowManager.getWindows();
  state.graphs.forEach((graph, i) => {
    if (wins[i]) {
      const targetPos = {
        x: wins[i].shape.x + wins[i].shape.w * 0.5,
        y: wins[i].shape.y + wins[i].shape.h * 0.5,
      };

      if (state.isIdle) {
        // Smooth 3D circular orbit animation
        const time = elapsed + i * 0.5;
        const radius = 60 + i * 10;
        const speed = 0.5 + i * 0.1;

        const x = radius * Math.cos(time * speed);
        const y = radius * Math.sin(time * speed) * 0.7;
        const z = radius * Math.sin(time * speed * 0.5);

        const targetX = targetPos.x + x;
        const targetY = targetPos.y + y;
        const targetZ = z;

        graph.position.x += (targetX - graph.position.x) * state.animationFalloff;
        graph.position.y += (targetY - graph.position.y) * state.animationFalloff;
        graph.position.z += (targetZ - graph.position.z) * state.animationFalloff;

        const direction = new t.Vector3(x, y, z);
        if (direction.length() > 0) {
          direction.normalize();
          graph.rotation.set(
            Math.atan2(direction.y, direction.z),
            Math.atan2(direction.x, direction.z),
            Math.atan2(direction.y, direction.x)
          );
        }

        const sprite = graph.children.find(child => child instanceof t.Sprite);
        if (sprite) sprite.position.set(0, 0, 0);

      } else {
        // Animate towards center and rotate based on cursor
        graph.position.x += (targetPos.x - graph.position.x) * state.animationFalloff;
        graph.position.y += (targetPos.y - graph.position.y) * state.animationFalloff;
        graph.position.z += (0 - graph.position.z) * state.animationFalloff;

        const center = new t.Vector3(targetPos.x, targetPos.y, 0);
        const mousePos = new t.Vector3(state.mouseX, state.mouseY, 0);
        const direction = new t.Vector3().subVectors(mousePos, center);

        if (direction.length() > 0) {
          direction.normalize();
          graph.rotation.set(0, Math.atan2(direction.y, direction.x), 0);
        }
      }
    }
  });

  state.renderer.render(state.scene, state.camera);
  requestAnimationFrame(render);
}

function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  state.camera.left = 0;
  state.camera.right = width;
  state.camera.top = 0;
  state.camera.bottom = height;
  state.camera.updateProjectionMatrix();
  state.renderer.setSize(width, height);
}

function createSearchWidget() {
  const widgetContainer = document.createElement("div");
  widgetContainer.id = "search-widget";
  widgetContainer.style.position = "fixed";
  widgetContainer.style.top = "20px";
  widgetContainer.style.left = "50%";
  widgetContainer.style.transform = "translateX(-50%)";
  widgetContainer.style.width = "60%";
  widgetContainer.style.maxWidth = "600px";
  widgetContainer.style.backgroundColor = "#1a1a1a";
  widgetContainer.style.borderRadius = "8px";
  widgetContainer.style.padding = "15px";
  widgetContainer.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.5)";
  widgetContainer.style.zIndex = "1000";

  const searchForm = document.createElement("form");
  searchForm.setAttribute("action", "https://www.google.com/search");
  searchForm.setAttribute("target", "_blank");
  searchForm.style.display = "flex";
  searchForm.style.position = "relative";

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.name = "q";
  searchInput.style.flex = "1";
  searchInput.style.padding = "10px 15px";
  searchInput.style.border = "none";
  searchInput.style.borderRadius = "4px 0 0 4px";
  searchInput.style.fontSize = "16px";
  searchInput.style.backgroundColor = "#2a2a2a";
  searchInput.style.color = "#ffffff";
  searchInput.style.outline = "none";
  searchInput.placeholder = "Search...";
  searchInput.style.boxSizing = "border-box";

  const searchButton = document.createElement("button");
  searchButton.type = "submit";
  searchButton.style.backgroundColor = "#4285f4";
  searchButton.style.border = "none";
  searchButton.style.borderRadius = "0 4px 4px 0";
  searchButton.style.padding = "10px 20px";
  searchButton.style.cursor = "pointer";
  searchButton.style.color = "white";
  searchButton.innerHTML = '<i class="fas fa-search"></i>';
  searchButton.title = "Search";

  searchForm.appendChild(searchInput);
  searchForm.appendChild(searchButton);
  widgetContainer.appendChild(searchForm);

  document.body.appendChild(widgetContainer);
}

function createShortcutBar() {
  const shortcutBar = document.createElement("div");
  shortcutBar.id = "shortcut-bar";
  shortcutBar.style.position = "fixed";
  shortcutBar.style.bottom = "0";
  shortcutBar.style.left = "0";
  shortcutBar.style.width = "100%";
  shortcutBar.style.height = "60px";
  shortcutBar.style.backgroundColor = "#1a1a1a";
  shortcutBar.style.display = "flex";
  shortcutBar.style.alignItems = "center";
  shortcutBar.style.justifyContent = "center";
  shortcutBar.style.zIndex = "1000";
  shortcutBar.style.boxShadow = "0 -2px 10px rgba(0, 0, 0, 0.5)";

  const shortcuts = [
    { name: "GitHub", url: "https://www.github.com", icon: "fa-github" },
    { name: "LinkedIn", url: "https://www.linkedin.com", icon: "fa-linkedin" },
    { name: "YouTube", url: "https://www.youtube.com", icon: "fa-youtube" },
    { name: "BlackBox", url: "https://www.blackbox.ai", icon: "fa-lock" },
    { name: "ChatGPT", url: "https://www.chatgpt.com", icon: "fa-robot" },
    { name: "Kimi.ai", url: "https://kimi.ai", icon: "fa-brain" },
    { name: "HiAnimez.to", url: "https://hianimez.to/", icon: "fa-theater-masks" },
    { name: "W3Schools", url: "https://www.w3schools.com", icon: "fa-graduation-cap" }
  ];

  shortcuts.forEach((shortcut) => {
    const shortcutItem = document.createElement("div");
    shortcutItem.style.margin = "0 15px";
    shortcutItem.style.cursor = "pointer";
    shortcutItem.style.color = "#fff";
    shortcutItem.style.fontSize = "1.2em";
    shortcutItem.style.transition = "transform 0.2s, color 0.2s";

    const link = document.createElement("a");
    link.href = shortcut.url;
    link.target = "_blank";
    link.style.textDecoration = "none";
    link.style.color = "#fff";
    link.style.display = "flex";
    link.style.alignItems = "center";

    const icon = document.createElement("i");
    icon.className = `fab ${shortcut.icon}`;
    icon.style.marginRight = "8px";
    icon.style.width = "20px";
    icon.style.textAlign = "center";

    const text = document.createTextNode(shortcut.name);

    link.appendChild(icon);
    link.appendChild(text);
    shortcutItem.appendChild(link);
    shortcutBar.appendChild(shortcutItem);

    shortcutItem.addEventListener("mouseenter", () => {
      shortcutItem.style.transform = "scale(1.1)";
      shortcutItem.style.color = "#3498db";
    });

    shortcutItem.addEventListener("mouseleave", () => {
      shortcutItem.style.transform = "scale(1)";
      shortcutItem.style.color = "#fff";
    });
  });

  document.body.appendChild(shortcutBar);
}

function onMouseMove(event) {
  state.mouseX = event.clientX;
  state.mouseY = event.clientY;

  clearTimeout(state.idleTimeout);
  state.isIdle = false;

  state.idleTimeout = setTimeout(() => {
    state.isIdle = true;
  }, 5000);
}

// Initialization
if (new URLSearchParams(window.location.search).get("clear")) {
  localStorage.clear();
} else {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "hidden" && !state.initialized) init();
  });

  document.addEventListener("DOMContentLoaded", () => {
    if (document.visibilityState !== "hidden") init();
  });
}
