import { useEffect, useRef, useCallback } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface WelcomeOverlayProps {
    username: string;
    onDone?: () => void;
}

export const WelcomeOverlay = ({ username, onDone }: WelcomeOverlayProps) => {
    const panelLeftRef = useRef<HTMLDivElement>(null);
    const panelRightRef = useRef<HTMLDivElement>(null);
    const centerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();

    const ease = (t: number, p = 4) =>
        t < 0.5 ? Math.pow(2 * t, p) / 2 : 1 - Math.pow(2 * (1 - t), p) / 2;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const anim = (duration: number, tick: (t: number) => void) =>
        new Promise<void>((res) => {
            const start = performance.now();
            const frame = (now: number) => {
                const t = Math.min((now - start) / duration, 1);
                tick(t);
                if (t < 1) {
                    requestAnimationFrame(frame);
                } else {
                    res();
                }
            };
            requestAnimationFrame(frame);
        });

    const run = useCallback(async () => {
        const pl = panelLeftRef.current!;
        const pr = panelRightRef.current!;
        const cc = centerRef.current!;
        const sc = sceneRef.current!;

        await anim(520, (t) => {
            const et = ease(t);
            pl.style.transform = `translateX(${lerp(-110, 0, et)}%)`;
            pr.style.transform = `translateX(${lerp(110, 0, et)}%)`;
        });

        await anim(380, (t) => {
            const et = ease(t, 3);
            cc.style.opacity = String(lerp(0, 1, et));
            cc.style.transform = `scale(${lerp(0.6, 1, et)})`;
        });

        await new Promise((r) => setTimeout(r, 1800));

        await anim(700, (t) => {
            const et = ease(t);
            sc.style.transformOrigin = 'left center';
            sc.style.transform = `translateX(${lerp(0, -340, et)}px) scale(${lerp(1, 0.05, et)})`;
            sc.style.opacity = String(t > 0.5 ? lerp(1, 0, (t - 0.5) * 2) : 1);
        });

        onDone?.();
    }, [onDone]);

    useEffect(() => { run(); }, [run]);

    return (
        <div
            ref={sceneRef}
            className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden"
            style={{ background: '#f4f1de' }}
        >
            <div ref={panelLeftRef} className="absolute top-0 bottom-0 left-0 w-1/2 flex items-center justify-center" style={{ background: '#e07a5f', borderRadius: '0 60% 60% 0 / 0 40% 40% 0', transform: 'translateX(-110%)', boxShadow: '20px 0 50px rgba(0,0,0,0.1)' }} />
            <div ref={panelRightRef} className="absolute top-0 bottom-0 right-0 w-1/2 flex items-center justify-center" style={{ background: '#81b29a', borderRadius: '60% 0 0 60% / 40% 0 0 40%', transform: 'translateX(110%)', boxShadow: '-20px 0 50px rgba(0,0,0,0.1)' }} />

            <div
                ref={centerRef}
                className="relative z-10 text-center flex flex-col items-center"
                style={{ opacity: 0, transform: 'scale(0.6)' }}
            >
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white border-4 border-[#e07a5f] mb-6 flex items-center justify-center shadow-2xl animate-pulse">
                    <ShieldCheck className="w-12 h-12 md:w-16 md:h-16 text-[#e07a5f]" strokeWidth={2.5} />
                </div>

                <p className="text-xs md:text-sm tracking-[0.4em] text-white/90 uppercase mb-3 font-black drop-shadow-md">
                    {t('welcome.authenticated')}
                </p>

                <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter drop-shadow-2xl mb-4">
                    {t('welcome.hello')} <span className="text-[#f6d195] drop-shadow-lg">{username}</span>!
                </h2>

                <p className="text-base md:text-lg text-white/95 font-bold drop-shadow-md">
                    {t('welcome.ready')}
                </p>
            </div>
        </div>
    );
};