// ── Graph Visualiser ──
// Force-directed layout with canvas rendering

const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');
const graphInput = document.getElementById('graphInput');
const directedToggle = document.getElementById('directedToggle');
const drawBtn = document.getElementById('drawBtn');
const clearBtn = document.getElementById('clearBtn');
const errorBox = document.getElementById('errorBox');

let nodes = [];
let edges = [];
let isDirected = false;
let animationId = null;

// Dragging state
let dragNode = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

// Panning state
let panX = 0;
let panY = 0;
let isPanning = false;
let panStartX = 0;
let panStartY = 0;

// Colors
const NODE_RADIUS = 22;
const NODE_FILL = '#667eea';
const NODE_STROKE = '#4c63d2';
const NODE_TEXT = '#ffffff';
const EDGE_COLOR = '#94a3b8';
const EDGE_WEIGHT_COLOR = '#4a5568';
const ARROW_SIZE = 10;
const BG_COLOR = '#fafbfc';

// ── Resize canvas to fill container ──
function resizeCanvas() {
  const panel = canvas.parentElement;
  canvas.width = panel.clientWidth;
  canvas.height = panel.clientHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// ── Parse input ──
function parseInput() {
  const text = graphInput.value.trim();
  if (!text) {
    showError('Please enter graph data.');
    return false;
  }

  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length === 0) {
    showError('Input is empty.');
    return false;
  }

  // First line: number of nodes (and optionally edges)
  const firstLineParts = lines[0].split(/\s+/).map(Number);
  const numNodes = firstLineParts[0];

  if (isNaN(numNodes) || numNodes < 1 || numNodes > 200) {
    showError('First line must be the number of nodes (1-200).');
    return false;
  }

  // Create nodes
  nodes = [];
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const radius = Math.min(cx, cy) * 0.6;

  for (let i = 1; i <= numNodes; i++) {
    const angle = (2 * Math.PI * (i - 1)) / numNodes - Math.PI / 2;
    nodes.push({
      id: i,
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
      vx: 0,
      vy: 0,
    });
  }

  // Parse edges from remaining lines
  edges = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(/\s+/).map(Number);
    if (parts.length < 2) continue;

    const u = parts[0];
    const v = parts[1];
    const hasExplicitWeight = parts.length >= 3;
    const w = hasExplicitWeight ? parts[2] : 1;

    if (isNaN(u) || isNaN(v) || u < 1 || v < 1 || u > numNodes || v > numNodes) {
      showError(`Edge on line ${i + 1}: nodes must be between 1 and ${numNodes}.`);
      return false;
    }

    if (hasExplicitWeight && (w === null || w === undefined || Number.isNaN(w))) {
      showError(`Edge on line ${i + 1}: weight must be a number.`);
      return false;
    }

    edges.push({ u, v, w, hasExplicitWeight });
  }

  hideError();
  return true;
}

// ── Force-directed layout simulation ──
let simulating = false;
let simSteps = 0;
const MAX_SIM_STEPS = 300;

function simulate() {
  if (!simulating) return;
  simSteps++;

  const repulsionStrength = 5000;
  const attractionStrength = 0.005;
  const idealLength = 120;
  const damping = 0.85;
  const centerGravity = 0.01;
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  // Reset forces
  for (const node of nodes) {
    node.vx = (node.vx || 0);
    node.vy = (node.vy || 0);
    let fx = 0;
    let fy = 0;

    // Repulsion from all other nodes
    for (const other of nodes) {
      if (other.id === node.id) continue;
      let dx = node.x - other.x;
      let dy = node.y - other.y;
      let dist = Math.sqrt(dx * dx + dy * dy) || 1;
      let force = repulsionStrength / (dist * dist);
      fx += (dx / dist) * force;
      fy += (dy / dist) * force;
    }

    // Attraction along edges
    for (const edge of edges) {
      let otherId = null;
      if (edge.u === node.id) otherId = edge.v;
      else if (edge.v === node.id) otherId = edge.u;
      if (otherId === null) continue;

      const other = nodes[otherId - 1];
      let dx = other.x - node.x;
      let dy = other.y - node.y;
      let dist = Math.sqrt(dx * dx + dy * dy) || 1;
      let force = attractionStrength * (dist - idealLength);
      fx += (dx / dist) * force;
      fy += (dy / dist) * force;
    }

    // Center gravity
    fx += (cx - node.x) * centerGravity;
    fy += (cy - node.y) * centerGravity;

    node.vx = (node.vx + fx) * damping;
    node.vy = (node.vy + fy) * damping;
  }

  // Update positions (skip dragged node)
  for (const node of nodes) {
    if (dragNode && node.id === dragNode.id) continue;
    node.x += node.vx;
    node.y += node.vy;

    // Keep inside bounds with some padding
    node.x = Math.max(NODE_RADIUS + 10, Math.min(canvas.width - NODE_RADIUS - 10, node.x));
    node.y = Math.max(NODE_RADIUS + 10, Math.min(canvas.height - NODE_RADIUS - 10, node.y));
  }

  draw();

  if (simSteps < MAX_SIM_STEPS) {
    animationId = requestAnimationFrame(simulate);
  } else {
    simulating = false;
  }
}

// ── Drawing ──
function draw() {
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Dot grid
  ctx.fillStyle = '#e2e8f0';
  for (let x = 20; x < canvas.width; x += 30) {
    for (let y = 20; y < canvas.height; y += 30) {
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Draw edges
  for (const edge of edges) {
    const from = nodes[edge.u - 1];
    const to = nodes[edge.v - 1];
    drawEdge(from, to, edge.w, edge.hasExplicitWeight);
  }

  // Draw nodes
  for (const node of nodes) {
    drawNode(node);
  }

  ctx.restore();
}

function drawNode(node) {
  // Shadow
  ctx.shadowColor = 'rgba(102, 126, 234, 0.25)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2;

  // Circle fill
  ctx.beginPath();
  ctx.arc(node.x, node.y, NODE_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = NODE_FILL;
  ctx.fill();
  ctx.strokeStyle = NODE_STROKE;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;

  // Label
  ctx.fillStyle = NODE_TEXT;
  ctx.font = '700 14px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(node.id, node.x, node.y);
}

function drawEdge(from, to, weight, showWeightLabel) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;

  // Shorten by node radius so line meets edge of circle
  const startX = from.x + ux * NODE_RADIUS;
  const startY = from.y + uy * NODE_RADIUS;
  const endX = to.x - ux * NODE_RADIUS;
  const endY = to.y - uy * NODE_RADIUS;

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.strokeStyle = EDGE_COLOR;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Arrow for directed graphs
  if (isDirected) {
    const angle = Math.atan2(endY - startY, endX - startX);
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(
      endX - ARROW_SIZE * Math.cos(angle - Math.PI / 6),
      endY - ARROW_SIZE * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      endX - ARROW_SIZE * Math.cos(angle + Math.PI / 6),
      endY - ARROW_SIZE * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fillStyle = EDGE_COLOR;
    ctx.fill();
  }

  // Weight label
  if (showWeightLabel) {
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;

    // Offset perpendicular to the edge
    const perpX = -uy * 14;
    const perpY = ux * 14;

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    const textW = ctx.measureText(String(weight)).width;
    const padX = 6;
    const padY = 4;
    roundRect(ctx, midX + perpX - textW / 2 - padX, midY + perpY - 8 - padY, textW + padX * 2, 16 + padY * 2, 4);
    ctx.fill();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = EDGE_WEIGHT_COLOR;
    ctx.font = '600 12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(weight), midX + perpX, midY + perpY);
  }
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ── Mouse interaction (dragging nodes) ──
function getMousePos(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}

function findNodeAt(mx, my) {
  for (let i = nodes.length - 1; i >= 0; i--) {
    const n = nodes[i];
    const dx = mx - n.x;
    const dy = my - n.y;
    if (dx * dx + dy * dy <= NODE_RADIUS * NODE_RADIUS) {
      return n;
    }
  }
  return null;
}

canvas.addEventListener('mousedown', (e) => {
  const pos = getMousePos(e);
  const node = findNodeAt(pos.x, pos.y);
  if (node) {
    dragNode = node;
    dragOffsetX = pos.x - node.x;
    dragOffsetY = pos.y - node.y;
    canvas.style.cursor = 'grabbing';
  }
});

canvas.addEventListener('mousemove', (e) => {
  const pos = getMousePos(e);
  if (dragNode) {
    dragNode.x = pos.x - dragOffsetX;
    dragNode.y = pos.y - dragOffsetY;
    dragNode.vx = 0;
    dragNode.vy = 0;
    if (!simulating) draw();
  } else {
    const node = findNodeAt(pos.x, pos.y);
    canvas.style.cursor = node ? 'grab' : 'default';
  }
});

canvas.addEventListener('mouseup', () => {
  dragNode = null;
  canvas.style.cursor = 'default';
});

canvas.addEventListener('mouseleave', () => {
  dragNode = null;
});

// ── Button handlers ──
drawBtn.addEventListener('click', () => {
  isDirected = directedToggle.checked;

  if (parseInput()) {
    // Start simulation
    if (animationId) cancelAnimationFrame(animationId);
    simSteps = 0;
    simulating = true;
    simulate();
  }
});

clearBtn.addEventListener('click', () => {
  graphInput.value = '';
  nodes = [];
  edges = [];
  if (animationId) cancelAnimationFrame(animationId);
  simulating = false;
  hideError();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Dot grid
  ctx.fillStyle = '#e2e8f0';
  for (let x = 20; x < canvas.width; x += 30) {
    for (let y = 20; y < canvas.height; y += 30) {
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }
});

// ── Keyboard shortcut: Ctrl+Enter to draw ──
graphInput.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    drawBtn.click();
  }
});

// ── Error helpers ──
function showError(msg) {
  errorBox.textContent = msg;
  errorBox.classList.add('show');
}

function hideError() {
  errorBox.classList.remove('show');
}

// ── Initial draw ──
draw();
