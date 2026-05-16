import { useSlider } from './slider/UseSlider';
import { HeroSlide } from './HeroSlide';
import type { SlideData } from './HeroSlide';
import { SliderDots } from './SliderDots';
import { useTranslation } from 'react-i18next';
import LiatKamera from '../../src/assets/LiatKamera.png';
import LiatLaptop from '../../src/assets/LiatLaptop.png';
import Ayo from '../../src/assets/ayo.png';

export const HeroSection = () => {
    const { t } = useTranslation();
    const SLIDES: SlideData[] = [
        {
            id: 1,
            image: LiatKamera,
            badge: t('hero.slide1_badge'),
            title: t('hero.slide1_title'),
            description: t('hero.slide1_desc'),
        },
        {
            id: 2,
            image: LiatLaptop,
            badge: t('hero.slide2_badge'),
            title: t('hero.slide2_title'),
            description: t('hero.slide2_desc'),
        },
        {
            id: 3,
            image: Ayo,
            badge: t('hero.slide3_badge'),
            title: t('hero.slide3_title'),
            description: t('hero.slide3_desc'),
        },
    ];
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