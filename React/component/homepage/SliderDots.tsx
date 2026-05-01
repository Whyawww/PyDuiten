interface SliderDotsProps {
    total: number;
    current: number;
    onSelect: (index: number) => void;
}

export const SliderDots = ({ total, current, onSelect }: SliderDotsProps) => {
    return (
        <div className="flex items-center justify-center gap-2 z-20">
            {Array.from({ length: total }).map((_, index) => (
                <button
                    key={index}
                    onClick={() => onSelect(index)}
                    aria-label={`Slide ${index + 1}`}
                    className={`
              h-2.5 rounded-full transition-all duration-500 ease-out
              ${index === current
                            ? 'w-8 bg-primary shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.5)]'
                            : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                        }
            `}
                />
            ))}
        </div>
    );
};