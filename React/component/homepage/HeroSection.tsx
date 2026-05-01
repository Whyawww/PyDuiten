import { useSlider } from './slider/UseSlider';
import { HeroSlide } from './HeroSlide';
import type { SlideData } from './HeroSlide';
import { SliderDots } from './SliderDots';

import LiatKamera from '../../src/assets/LiatKamera.png';
import LiatLaptop from '../../src/assets/LiatLaptop.png';
import Ayo from '../../src/assets/ayo.png';

const SLIDES: SlideData[] = [
    {
        id: 1,
        image: LiatKamera,
        badge: 'Didukung oleh Gemini AI',
        title: 'Berani Liat Saldo Akhir Bulan?',
        description:
            'Udah siap di-roasting AI gara-gara kebanyakan jajan? Catat pengeluaran lu sekarang dan buktiin ke sistem kalo lu bisa hemat.',
    },
    {
        id: 2,
        image: LiatLaptop,
        badge: 'Real-time Tracking',
        title: 'Fokus Cari Cuan, Biar AI Yang Ngitung.',
        description:
            'Pantau cashflow lu sambil rebahan. PyDuiten bantu lu ngelacak setiap rupiah yang masuk dan keluar lewat dashboard yang clean abis.',
    },
    {
        id: 3,
        image: Ayo,
        badge: 'Gratis 100% Buat Lu',
        title: 'Nunggu Apa Lagi Cuy? Gas Cobain!',
        description:
            'Ribuan Gen Z udah mulai melek finansial. Jangan sampe lu doang yang tobatnya telat. Yuk wujudkan kebebasan finansial lu sekarang juga!',
    },
];

export const HeroSection = () => {
    const { current, direction, goTo, setIsPaused } = useSlider({
        total: SLIDES.length,
        interval: 4000,
    });

    return (
        <section
            className="
        relative w-full max-w-7xl mx-auto px-4 py-12 lg:py-20
        min-h-[700px] lg:min-h-[600px] flex items-center overflow-hidden
        animate-hero-mount
      "
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            aria-label="Hero carousel"
        >
            {/* ── Slides ── */}
            {SLIDES.map((slide, index) => (
                <HeroSlide
                    key={slide.id}
                    slide={slide}
                    isActive={index === current}
                    direction={direction}
                />
            ))}

            {/* Dot Navigation */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20">
                <SliderDots
                    total={SLIDES.length}
                    current={current}
                    onSelect={goTo}
                />
            </div>
        </section>
    );
};