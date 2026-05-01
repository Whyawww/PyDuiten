import { ArrowRight, PlayCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface SlideData {
    id: number;
    image: string;
    badge: string;
    title: string;
    description: string;
}

interface HeroSlideProps {
    slide: SlideData;
    isActive: boolean;
    direction: 'next' | 'prev';
}

export const HeroSlide = ({ slide, isActive, direction }: HeroSlideProps) => {
    const enterClass = direction === 'next'
        ? 'animate-slide-in-right'
        : 'animate-slide-in-left';

    return (
        <div
            className={`
        absolute inset-0 flex flex-col-reverse lg:flex-row items-center
        justify-between px-4 sm:px-8
        transition-opacity duration-300
        ${isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}
      `}
            aria-hidden={!isActive}
        >
            {/* ── Text Column ── */}
            <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left mt-10 lg:mt-0">

                {/* Badge */}
                <div
                    className={`
            inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full
            bg-tertiary/30 text-yellow-800 font-semibold text-sm shadow-sm
            ${isActive ? enterClass : ''}
          `}
                    style={{ animationDelay: '0ms', animationFillMode: 'both' }}
                >
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>{slide.badge}</span>
                </div>

                {/* Title */}
                <h1
                    className={`
            text-4xl sm:text-5xl md:text-6xl font-black text-gray-800
            mb-6 tracking-tight leading-tight
            ${isActive ? enterClass : ''}
          `}
                    style={{ animationDelay: '80ms', animationFillMode: 'both' }}
                >
                    {slide.title}
                </h1>

                {/* Description */}
                <p
                    className={`
            text-lg sm:text-xl text-gray-600 mb-10 max-w-xl font-medium
            ${isActive ? enterClass : ''}
          `}
                    style={{ animationDelay: '160ms', animationFillMode: 'both' }}
                >
                    {slide.description}
                </p>

                {/* CTAs */}
                <div
                    className={`
            flex flex-col sm:flex-row gap-4 w-full sm:w-auto
            ${isActive ? enterClass : ''}
          `}
                    style={{ animationDelay: '240ms', animationFillMode: 'both' }}
                >
                    <Link to="/register" className="
            flex items-center justify-center gap-2
            bg-primary text-white px-8 py-4 rounded-3xl
            shadow-md hover:shadow-lg hover:-translate-y-1
            transition-all duration-300 font-bold text-lg w-full sm:w-auto
            active:scale-95
          ">
                        Mulai Sekarang Gratis
                        <ArrowRight className="w-5 h-5" />
                    </Link>

                    <button className="
            flex items-center justify-center gap-2
            bg-white text-gray-800 border-2 border-gray-200
            px-8 py-4 rounded-3xl
            hover:border-secondary hover:text-secondary hover:-translate-y-1
            transition-all duration-300 font-bold text-lg w-full sm:w-auto
            active:scale-95
          ">
                        <PlayCircle className="w-5 h-5" />
                        Lihat Demo
                    </button>
                </div>
            </div>

            {/* Image Column */}
            <div className="lg:w-1/2 w-full flex justify-center lg:justify-end">
                <img
                    src={slide.image}
                    alt={`Ilustrasi ${slide.badge}`}
                    loading="lazy"
                    decoding="async"
                    className={`
            w-full max-w-[280px] sm:max-w-md lg:max-w-lg
            object-contain drop-shadow-2xl
            ${isActive ? 'animate-image-float' : ''}
          `}
                    style={{ animationDelay: '100ms', animationFillMode: 'both' }}
                />
            </div>
        </div>
    );
};