import { useEffect, useRef, useCallback, useState } from 'react';
import logoImg from '../../src/assets/icons.png';

interface SplashScreenProps {
    onDone: () => void;
}

const COLORS = ['#e07a5f', '#81b29a', '#f2cc8f', '#c9a98e', '#b5cbb8', '#e8c3a0', '#d4896a', '#95c2aa', '#f0b97d', '#c77b5a'];
const SHAPE_TYPES = ['circle', 'ellipse', 'roundRect', 'pill', 'triangle', 'diamond', 'squircle', 'star3', 'arc', 'hexagon'] as const;
type ShapeType = typeof SHAPE_TYPES[number];

interface Shape {
    type: ShapeType; size: number; color: string;
    sx: number; sy: number; tx: number; ty: number;
    speed: number; startTick: number; rot: number; rotSpeed: number;
    alpha: number; scaleVariance: number;
    wobbleAmp: number; wobbleFreq: number; wobbleOff: number;
    t: number; alive: boolean; merging: boolean; mergePeer: Shape | null;
    splitting: boolean; splitT: number;
}

const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

export const SplashScreen = ({ onDone }: SplashScreenProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const brandRef = useRef<HTMLDivElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);
    const rafRef = useRef<number>(0);
    const shapesRef = useRef<Shape[]>([]);
    const tickRef = useRef(0);
    const doneRef = useRef(false);

    const [imgError, setImgError] = useState(false);

    const makeShape = useCallback((W: number, H: number): Shape => {
        const type = pick([...SHAPE_TYPES]);
        const size = rnd(18, 88);
        const color = pick(COLORS);
        const edge = pick(['left', 'right', 'top', 'bottom'] as const);

        let sx = 0, sy = 0, dx = 0, dy = 0;
        const margin = size * 1.5;

        switch (edge) {
            case 'left': sx = -margin; sy = rnd(0, H); dx = 1; dy = rnd(-0.4, 0.4); break;
            case 'right': sx = W + margin; sy = rnd(0, H); dx = -1; dy = rnd(-0.4, 0.4); break;
            case 'top': sy = -margin; sx = rnd(0, W); dy = 1; dx = rnd(-0.4, 0.4); break;
            case 'bottom': sy = H + margin; sx = rnd(0, W); dy = -1; dx = rnd(-0.4, 0.4); break;
        }

        return {
            type, size, color, sx, sy,
            tx: sx + dx * rnd(W * 0.3, W * 0.85),
            ty: sy + dy * rnd(H * 0.3, H * 0.85),
            speed: rnd(0.004, 0.012),
            startTick: rnd(0, 50),
            rot: rnd(0, Math.PI * 2),
            rotSpeed: rnd(-0.012, 0.012),
            alpha: rnd(0.55, 0.92),
            scaleVariance: rnd(0.85, 1.15),
            wobbleAmp: rnd(0, 14),
            wobbleFreq: rnd(0.04, 0.10),
            wobbleOff: rnd(0, Math.PI * 2),
            t: 0, alive: true, merging: false, mergePeer: null,
            splitting: false, splitT: 0,
        };
    }, []);

    const drawShape = useCallback((ctx: CanvasRenderingContext2D, type: ShapeType, size: number, rot: number) => {
        ctx.save();
        ctx.rotate(rot);
        const h = size * 0.5;
        ctx.beginPath();

        if (type === 'circle') {
            ctx.arc(0, 0, h, 0, Math.PI * 2);
        } else if (type === 'ellipse') {
            ctx.ellipse(0, 0, h * 1.55, h * 0.65, 0, 0, Math.PI * 2);
        } else if (type === 'roundRect') {
            ctx.roundRect(-size * 0.55, -size * 0.375, size * 1.1, size * 0.75, size * 0.22);
        } else if (type === 'pill') {
            ctx.roundRect(-size * 0.7, -h * 0.45, size * 1.4, h * 0.9, h * 0.45);
        } else if (type === 'triangle') {
            ctx.moveTo(0, -h); ctx.lineTo(h * 0.9, h * 0.6); ctx.lineTo(-h * 0.9, h * 0.6); ctx.closePath();
        } else if (type === 'diamond') {
            ctx.moveTo(0, -h * 1.1); ctx.lineTo(h * 0.75, 0); ctx.lineTo(0, h * 1.1); ctx.lineTo(-h * 0.75, 0); ctx.closePath();
        } else if (type === 'squircle') {
            const n = 4.5, r = h * 0.88;
            for (let i = 0; i <= 64; i++) {
                const a = (i / 64) * Math.PI * 2;
                const ca = Math.cos(a), sa = Math.sin(a);
                const px = Math.sign(ca) * Math.pow(Math.abs(ca), 2 / n) * r;
                const py = Math.sign(sa) * Math.pow(Math.abs(sa), 2 / n) * r;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
        } else if (type === 'star3') {
            for (let i = 0; i < 6; i++) {
                const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
                const r2 = i % 2 === 0 ? h : h * 0.44;
                const x = Math.cos(a) * r2;
                const y = Math.sin(a) * r2;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
        } else if (type === 'arc') {
            ctx.arc(0, 0, h, 0.2, Math.PI * 1.8);
            ctx.arc(0, 0, h * 0.55, Math.PI * 1.8, 0.2, true);
            ctx.closePath();
        } else if (type === 'hexagon') {
            for (let i = 0; i < 6; i++) {
                const a = (i / 6) * Math.PI * 2 - Math.PI / 6;
                const x = Math.cos(a) * h;
                const y = Math.sin(a) * h;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
        }
        ctx.fill();
        ctx.restore();
    }, []);

    const finish = useCallback(() => {
        if (doneRef.current) return;
        doneRef.current = true;
        cancelAnimationFrame(rafRef.current);

        if (canvasRef.current && canvasRef.current.parentElement) {
            canvasRef.current.parentElement.style.opacity = '0';
        }
        setTimeout(onDone, 600);
    }, [onDone]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d')!;
        const container = canvas.parentElement!;

        const resize = () => {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight || 520;
        };
        resize();

        shapesRef.current = Array.from({ length: 28 }, () => makeShape(canvas.width, canvas.height));
        tickRef.current = 0;
        doneRef.current = false;

        const loop = () => {
            const tick = ++tickRef.current;
            const W = canvas.width, H = canvas.height;
            ctx.clearRect(0, 0, W, H);
            ctx.fillStyle = '#f4f1de';
            ctx.fillRect(0, 0, W, H);

            let live = 0;
            for (let i = shapesRef.current.length - 1; i >= 0; i--) {
                const sh = shapesRef.current[i];
                if (!sh.alive) { shapesRef.current.splice(i, 1); continue; }
                if (tick < sh.startTick) continue;
                sh.t = Math.min(sh.t + sh.speed, 1.4);
                sh.rot += sh.rotSpeed;
                live++;

                const et = easeInOut(Math.min(sh.t, 1));
                const wx = Math.sin(tick * sh.wobbleFreq + sh.wobbleOff) * sh.wobbleAmp;
                const wy = Math.cos(tick * sh.wobbleFreq * 1.3 + sh.wobbleOff) * sh.wobbleAmp * 0.6;
                const cx = lerp(sh.sx, sh.tx, et) + wx;
                const cy = lerp(sh.sy, sh.ty, et) + wy;

                let alpha = sh.alpha;
                if (sh.t < 0.15) alpha *= sh.t / 0.15;
                if (sh.t > 1.1) alpha *= Math.max(0, 1 - (sh.t - 1.1) / 0.3);

                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.translate(cx, cy);
                ctx.scale(sh.scaleVariance, sh.scaleVariance);
                ctx.fillStyle = sh.color;
                drawShape(ctx, sh.type, sh.size, sh.rot);
                ctx.restore();

                if (sh.t >= 1.4) sh.alive = false;
            }

            if (tick > 30 && tick % 22 === 0 && live < 35) {
                shapesRef.current.push(makeShape(W, H));
            }

            if (tick === 90) {
                if (brandRef.current) {
                    brandRef.current.style.opacity = '1';
                    brandRef.current.style.transform = 'scale(1) translateY(0)';
                }
                if (btnRef.current) {
                    btnRef.current.style.opacity = '1';
                    btnRef.current.style.pointerEvents = 'auto';
                }
            }

            if (tick < 420) {
                rafRef.current = requestAnimationFrame(loop);
            } else {
                finish();
            }
        };

        rafRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(rafRef.current);
    }, [makeShape, drawShape, finish]);

    return (
        <div className="fixed inset-0 z-[9999] overflow-hidden transition-opacity duration-500" style={{ background: '#f4f1de' }}>
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

            <div
                ref={brandRef}
                className="relative z-10 flex flex-col items-center justify-center h-full drop-shadow-xl"
                style={{
                    opacity: 0,
                    transform: 'scale(0.8) translateY(30px)',
                    transition: 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
            >
                {imgError ? (
                    <div className="text-6xl md:text-7xl font-black tracking-tighter" style={{ color: '#3d2b1f' }}>
                        Py<span style={{ color: '#e07a5f' }}>Duiten</span>
                    </div>
                ) : (
                    <img
                        src={logoImg}
                        alt="PyDuiten Logo"
                        className="w-62 h-62 md:w-70 md:h-70 object-contain drop-shadow-2xl"
                        onError={() => setImgError(true)}
                    />
                )}

                <p className="text-xs md:text-sm tracking-[0.3em] mt-4 uppercase font-bold" style={{ color: '#9c7b6a' }}>
                    Catat · Analisis · Kendali
                </p>
            </div>

            <button
                ref={btnRef}
                onClick={finish}
                className="absolute bottom-8 right-8 md:bottom-10 md:right-12 z-20 text-sm font-bold px-6 py-3 rounded-full hover:bg-[#e07a5f]/20 active:scale-95 transition-all duration-700"
                style={{
                    background: 'rgba(224,122,95,0.15)',
                    border: '1px solid rgba(224,122,95,0.4)',
                    color: '#e07a5f',
                    opacity: 0,
                    pointerEvents: 'none'
                }}
            >
                Lanjutkan &rarr;
            </button>
        </div>
    );
};