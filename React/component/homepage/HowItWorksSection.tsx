import { useEffect, useRef } from 'react';

interface Step {
    number: string;
    title: string;
    description: string;
    tag: string;
    colorClass: {
        card: string;
        badge: string;
        num: string;
        text: string;
    };
}

const STEPS: Step[] = [
    {
        number: '01',
        title: 'Catat Transaksi',
        description: 'Masukin gaji masuk atau duit jajan yang keluar. Cuma butuh 5 detik.',
        tag: '5 detik aja',
        colorClass: {
            card: 'hover:bg-white/70',
            badge: 'bg-primary/10 text-primary',
            num: 'bg-primary/10 text-primary',
            text: 'text-primary',
        },
    },
    {
        number: '02',
        title: 'Dianalisis AI',
        description: 'Sistem otomatis ngitung sisa saldo dan ngirim datanya ke otak AI.',
        tag: 'Otomatis',
        colorClass: {
            card: 'hover:bg-white/70',
            badge: 'bg-secondary/20 text-secondary',
            num: 'bg-secondary/20 text-secondary',
            text: 'text-secondary',
        },
    },
    {
        number: '03',
        title: 'Terima Insight',
        description: 'Baca masukan dari AI biar lu makin semangat nabung (atau tobat jajan).',
        tag: 'Real-time',
        colorClass: {
            card: 'hover:bg-white/70',
            badge: 'bg-tertiary/40 text-yellow-800',
            num: 'bg-tertiary/40 text-yellow-800',
            text: 'text-yellow-700',
        },
    },
];

const StepCard = ({ step, index }: { step: Step; index: number }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                setTimeout(() => {
                    el.classList.add('opacity-100', 'translate-x-0');
                    el.classList.remove('opacity-0', 'translate-x-8');
                }, index * 120);
                observer.disconnect();
            },
            { threshold: 0.2 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [index]);

    return (
        <div
            ref={ref}
            className={`
                group flex items-start gap-5 px-6 py-5 rounded-2xl cursor-default
                opacity-0 translate-x-8
                transition-all duration-500 ease-[cubic-bezier(.34,1.56,.64,1)]
                ${step.colorClass.card}
            `}
        >
            <div
                className={`
                    w-13 h-13 rounded-2xl flex items-center justify-center shrink-0
                    text-lg font-black select-none
                    transition-all duration-300 ease-[cubic-bezier(.34,1.56,.64,1)]
                    group-hover:rotate-[-8deg] group-hover:scale-110 group-hover:rounded-full
                    ${step.colorClass.num}
                `}
            >
                {step.number}
            </div>

            <div className="flex-1 pt-1">
                <h3 className="text-base font-bold text-gray-800 mb-1 tracking-tight">
                    {step.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                    {step.description}
                </p>

                <span
                    className={`
                        inline-flex items-center gap-1.5 mt-3 px-3 py-1
                        rounded-full text-[11px] font-semibold
                        opacity-0 translate-y-1
                        transition-all duration-300 ease-out
                        group-hover:opacity-100 group-hover:translate-y-0
                        ${step.colorClass.badge}
                    `}
                >
                    <span className={`w-1.5 h-1.5 rounded-full bg-current`} />
                    {step.tag}
                </span>
            </div>
        </div>
    );
};

export const HowItWorksSection = () => (
    <section className="py-20 bg-surface">
        <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20">

                <div className="md:w-2/5 shrink-0">
                    <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">
                        Cara mainnya
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-black text-gray-800 tracking-tight leading-tight mb-4">
                        Gampang banget.<br />
                        <span className="text-primary">3 langkah</span> doang.
                    </h2>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Ngga perlu mikir keras atau belajar akuntansi.
                        Biarin sistem yang kerja buat lu.
                    </p>
                </div>

                <div className="flex-1 flex flex-col gap-0 w-full">
                    {STEPS.map((step, i) => (
                        <div key={step.number}>
                            <StepCard step={step} index={i} />
                            {i < STEPS.length - 1 && (
                                <div className="w-0.5 h-6 bg-gray-200 rounded-full ml-[42px]" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
);