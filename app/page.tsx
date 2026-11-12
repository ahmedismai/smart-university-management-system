import HeroSection from "@/components/ui/HeroSection";
import AboutSection from "@/components/ui/AboutSection";
import FeaturesSection from "@/components/ui/FeaturesSection";
import NewsSection from "@/components/ui/NewsSection";
import EventsAndNoticesSection from "@/components/ui/EventsAndNoticesSection";
import StudentAchievementsSection from "@/components/ui/StudentAchievementsSection";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col">
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <EventsAndNoticesSection />
      <StudentAchievementsSection />
      <NewsSection />
    </main>
  );
}
