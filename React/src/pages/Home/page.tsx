import { HeroSection } from '../../../component/homepage/HeroSection';
import { FeaturesSection } from '../../../component/homepage/FeaturesSection';
import { HowItWorksSection } from '../../../component/homepage/HowItWorksSection';
import { CTASection } from '../../../component/homepage/CTASection';
import { LanguageSwitcher } from '../../../component/ui/LanguageSwitcher';

export const Home = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="absolute top-6 right-4 sm:right-8 z-50">
                <LanguageSwitcher />
            </div>
            <HeroSection />
            <FeaturesSection />
            <HowItWorksSection />
            <CTASection />
        </div>
    );
};