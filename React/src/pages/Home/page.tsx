import { HeroSection } from '../../../component/homepage/HeroSection';
import { FeaturesSection } from '../../../component/homepage/FeaturesSection';
import { HowItWorksSection } from '../../../component/homepage/HowItWorksSection';
import { CTASection } from '../../../component/homepage/CTASection';

export const Home = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <HeroSection />
            <FeaturesSection />
            <HowItWorksSection />
            <CTASection />
        </div>
    );
};