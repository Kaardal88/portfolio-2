/**
 * The brain: a canvas of drifting "thoughts" (particles), connections and impulses.
 * Hovering or focusing a project node slows everything down, dims the rest and
 * lights up one thread from the centre out to that project.
 *
 * Plain Canvas 2D, no libraries. Respects prefers-reduced-motion and pauses
 * when the brain is off screen.
 */

type Point = {
  bx: number; by: number; x: number; y: number;
  amp: number; f: number; ph: number; r: number; c: number; adj: number[];
};
type NodeInfo = { id: string; el: HTMLElement; x: number; y: number; anchors: number[]; thread: number[] };
type Pulse = { a: number; b: number; t: number; v: number };

const VIOLET = '155,140,255';
const GREEN = '139,227,122';
const FOCUS_SPEED = 0.12;
const COMPACT_BREAKPOINT = 560;

function hexToRgb(hex: string): string {
  let h = hex.trim().replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h.slice(0, 6), 16);
  if (Number.isNaN(n)) return '94,230,208';
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}

// Small seeded random, so the brain looks the same on every visit.
function seeded(seed: number) {
  let s = seed;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class Brain {
  private root: HTMLElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private status: HTMLElement | null;
  private nodeEls: HTMLElement[];

  private W = 0;
  private H = 0;
  private pts: Point[] = [];
  private edges: [number, number][] = [];
  private nodes: NodeInfo[] = [];
  private pulses: Pulse[] = [];

  private focusId: string | null = null;
  // What was focused when the current press started (before any focus event it caused).
  private pressFocus: string | null | undefined;
  private speed = 1;
  private target = 1;
  private dim = 0;
  private t = 0;
  private rt = 0;
  private last = 0;
  private raf = 0;
  private visible = true;
  private motion = true;
  private compact = false;
  private accent = '94,230,208';

  constructor(root: HTMLElement) {
    this.root = root;
    this.canvas = root.querySelector('canvas')!;
    this.ctx = this.canvas.getContext('2d')!;
    this.status = root.querySelector('[data-brain-status]');
    this.nodeEls = [...root.querySelectorAll<HTMLElement>('[data-brain-node]')];
    this.accent = hexToRgb(getComputedStyle(root).getPropertyValue('--color-accent') || '#5ee6d0');

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.motion = !media.matches;
    media.addEventListener('change', (e) => {
      this.motion = !e.matches;
      if (this.motion) this.start();
      else this.draw(0);
    });

    this.bindNodes();
    this.build();
    const initialHint = this.status?.querySelector('.brain__hint');
    if (initialHint) initialHint.textContent = this.hintText();

    new ResizeObserver(() => this.build()).observe(this.canvas);
    new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      if (this.visible) this.start();
    }).observe(this.canvas);

    this.start();
  }

  private hintText() {
    const touch = window.matchMedia('(hover: none)').matches;
    return (touch ? this.status?.dataset.hintTouch : this.status?.dataset.hint) || '';
  }

  private bindNodes() {
    this.nodeEls.forEach((el) => {
      const id = el.dataset.id!;
      el.addEventListener('pointerenter', (e) => {
        if (e.pointerType !== 'touch') this.focus(id);
      });
      el.addEventListener('pointerleave', (e) => {
        if (e.pointerType !== 'touch') this.focus(null);
      });
      el.addEventListener('pointerdown', () => {
        this.pressFocus = this.focusId;
      });
      el.addEventListener('focus', () => this.focus(id));
      el.addEventListener('blur', () => this.focus(null));
      // Touch: first tap focuses, second tap follows the link. Tapping a link
      // focuses it before the click lands, so compare with the state at pointerdown.
      el.addEventListener('click', (e) => {
        const before = this.pressFocus === undefined ? this.focusId : this.pressFocus;
        this.pressFocus = undefined;
        if (before !== id) {
          e.preventDefault();
          this.focus(id);
        }
      });
    });
  }

  private build() {
    const rect = this.canvas.getBoundingClientRect();
    const W = Math.round(rect.width);
    const H = Math.round(rect.height);
    if (!W || !H || (W === this.W && H === this.H)) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = W * dpr;
    this.canvas.height = H * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.W = W;
    this.H = H;
    this.compact = W < COMPACT_BREAKPOINT;
    this.root.classList.toggle('is-compact', this.compact);

    const rnd = seeded(1337);
    const count = this.compact ? 150 : 290;
    const pts: Point[] = [];
    let guard = 0;
    while (pts.length < count && guard++ < 30000) {
      const x = rnd();
      const y = rnd();
      // Two overlapping lobes, denser towards the middle.
      const d1 = ((x - 0.4) / 0.3) ** 2 + ((y - 0.5) / 0.37) ** 2;
      const d2 = ((x - 0.6) / 0.3) ** 2 + ((y - 0.48) / 0.37) ** 2;
      const d = Math.min(d1, d2);
      if (d > 1 || rnd() < d * 0.55) continue;
      const r = rnd();
      pts.push({
        bx: x * W, by: y * H, x: x * W, y: y * H,
        amp: 1.5 + rnd() * 4.5, f: 0.25 + rnd() * 0.6, ph: rnd() * Math.PI * 2,
        r: 0.6 + rnd() * 1.5, c: r < 0.55 ? 0 : r < 0.8 ? 1 : 2, adj: [],
      });
    }

    const T = Math.min(W, H) * (this.compact ? 0.1 : 0.085);
    const edges: [number, number][] = [];
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        if (pts[i].adj.length >= 5) break;
        if (pts[j].adj.length >= 5) continue;
        const dx = pts[i].bx - pts[j].bx;
        const dy = pts[i].by - pts[j].by;
        if (dx * dx + dy * dy < T * T) {
          pts[i].adj.push(j);
          pts[j].adj.push(i);
          edges.push([i, j]);
        }
      }
    }

    const cx = W / 2;
    const cy = H / 2;
    const dist = (p: Point, x: number, y: number) => Math.hypot(p.bx - x, p.by - y);

    this.nodes = this.nodeEls.map((el) => {
      const nx = Number(this.compact ? el.dataset.mx : el.dataset.x) * W;
      const ny = Number(this.compact ? el.dataset.my : el.dataset.y) * H;
      const anchors = pts
        .map((p, k) => [k, dist(p, nx, ny)] as const)
        .sort((a, b) => a[1] - b[1])
        .slice(0, 3)
        .map(([k]) => k);
      // A thread from the node inwards: always step to the neighbour closest to the centre.
      let cur = anchors[0];
      const thread = [cur];
      for (let k = 0; k < 18; k++) {
        let best = -1;
        let bd = dist(pts[cur], cx, cy) - 2;
        for (const n of pts[cur].adj) {
          const dd = dist(pts[n], cx, cy);
          if (dd < bd) { bd = dd; best = n; }
        }
        if (best < 0) break;
        thread.push(best);
        cur = best;
      }
      return { id: el.dataset.id!, el, x: nx, y: ny, anchors, thread };
    });

    const pulses: Pulse[] = [];
    for (let m = 0; m < (this.compact ? 26 : 48); m++) {
      const a = Math.floor(rnd() * pts.length);
      const adj = pts[a].adj;
      pulses.push({ a, b: adj.length ? adj[Math.floor(rnd() * adj.length)] : a, t: rnd(), v: 0.35 + rnd() * 0.7 });
    }

    this.pts = pts;
    this.edges = edges;
    this.pulses = pulses;
    this.draw(0);
  }

  private start() {
    if (!this.motion || !this.visible || this.raf) return;
    this.last = 0;
    this.raf = requestAnimationFrame(this.tick);
  }

  private tick = (ts: number) => {
    this.raf = 0;
    const dt = this.last ? Math.min(0.05, (ts - this.last) / 1000) : 1 / 60;
    this.last = ts;
    this.speed += (this.target - this.speed) * Math.min(1, dt * 3);
    this.dim += ((this.focusId ? 1 : 0) - this.dim) * Math.min(1, dt * 5);
    this.t += dt * this.speed;
    this.rt += dt;
    this.draw(dt * this.speed);
    if (this.visible && this.motion) this.raf = requestAnimationFrame(this.tick);
  };

  private focus(id: string | null) {
    if (id === this.focusId) return;
    this.focusId = id;
    this.target = id ? FOCUS_SPEED : 1;
    this.root.classList.toggle('is-focused', !!id);
    this.nodeEls.forEach((el) => el.classList.toggle('is-on', el.dataset.id === id));

    if (this.status) {
      const el = this.nodeEls.find((n) => n.dataset.id === id);
      this.status.innerHTML = '';
      if (el) {
        const label = document.createElement('span');
        label.className = 'brain__status-label mono';
        label.textContent = 'Focus acquired';
        const link = document.createElement('a');
        link.className = 'link-arrow';
        link.href = el.getAttribute('href') || '#';
        link.textContent = `Open ${el.dataset.name} →`;
        this.status.append(label, link);
      } else {
        const hint = document.createElement('span');
        hint.className = 'mono brain__hint';
        hint.textContent = this.hintText();
        this.status.append(hint);
      }
    }

    if (!this.motion) {
      this.dim = id ? 1 : 0;
      this.draw(0);
    }
  }

  private draw(step: number) {
    const { ctx, W, H, pts } = this;
    if (!W) return;
    const t = this.t;
    const A = this.accent;
    const cols = [A, VIOLET, GREEN];
    const k = 1 - this.dim * 0.62;

    for (const p of pts) {
      p.x = p.bx + Math.sin(t * p.f + p.ph) * p.amp;
      p.y = p.by + Math.cos(t * p.f * 0.8 + p.ph) * p.amp;
    }

    ctx.clearRect(0, 0, W, H);

    // Faint nebula behind everything
    const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.min(W, H) * 0.55);
    g.addColorStop(0, `rgba(${A},${0.1 * k})`);
    g.addColorStop(0.5, `rgba(${VIOLET},${0.05 * k})`);
    g.addColorStop(1, 'rgba(7,9,13,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Connections
    ctx.lineWidth = 0.6;
    ctx.strokeStyle = `rgba(160,205,235,${0.17 * k})`;
    ctx.beginPath();
    for (const [a, b] of this.edges) {
      ctx.moveTo(pts[a].x, pts[a].y);
      ctx.lineTo(pts[b].x, pts[b].y);
    }
    ctx.stroke();

    // Thoughts
    for (const p of pts) {
      ctx.fillStyle = `rgba(${cols[p.c]},${(0.5 + 0.4 * Math.sin(t * 2.2 * p.f + p.ph)) * k})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Impulses travelling along connections
    ctx.globalCompositeOperation = 'lighter';
    for (const q of this.pulses) {
      q.t += step * q.v * 1.6;
      while (q.t >= 1) {
        q.t -= 1;
        q.a = q.b;
        const adj = pts[q.a].adj;
        q.b = adj.length ? adj[Math.floor(Math.random() * adj.length)] : Math.floor(Math.random() * pts.length);
      }
      const pa = pts[q.a];
      const pb = pts[q.b];
      const x = pa.x + (pb.x - pa.x) * q.t;
      const y = pa.y + (pb.y - pa.y) * q.t;
      const c = cols[pa.c];
      ctx.strokeStyle = `rgba(${c},${0.4 * k})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pa.x, pa.y);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.fillStyle = `rgba(${c},${0.2 * k})`;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(255,255,255,${0.85 * k})`;
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';

    // Project nodes and the focused thread
    for (const nd of this.nodes) {
      const on = nd.id === this.focusId;
      ctx.strokeStyle = `rgba(${A},${on ? 0.9 : this.focusId ? 0.1 : 0.32})`;
      ctx.lineWidth = on ? 1.3 : 0.8;
      ctx.beginPath();
      for (const a of nd.anchors) {
        ctx.moveTo(nd.x, nd.y);
        ctx.lineTo(pts[a].x, pts[a].y);
      }
      if (on) {
        ctx.moveTo(nd.x, nd.y);
        for (const a of nd.thread) ctx.lineTo(pts[a].x, pts[a].y);
        ctx.shadowColor = `rgba(${A},0.9)`;
        ctx.shadowBlur = 12;
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      if (!on) continue;
      ctx.fillStyle = `rgba(${A},0.95)`;
      for (const a of nd.thread) {
        ctx.beginPath();
        ctx.arc(pts[a].x, pts[a].y, pts[a].r + 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
      // One thought travelling from the centre out to the project
      const path = [...nd.thread].reverse().map((a) => pts[a] as { x: number; y: number });
      path.push({ x: nd.x, y: nd.y });
      if (path.length > 1) {
        const u = ((this.rt * 0.5) % 1) * (path.length - 1);
        const s = Math.floor(u);
        const f = u - s;
        const px = path[s].x + (path[s + 1].x - path[s].x) * f;
        const py = path[s].y + (path[s + 1].y - path[s].y) * f;
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = `rgba(${A},0.35)`;
        ctx.beginPath();
        ctx.arc(px, py, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        ctx.beginPath();
        ctx.arc(px, py, 2.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
      }
    }
  }
}
