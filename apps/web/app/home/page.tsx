import { Navbar } from "@/components/ui/Navbar";
import { HeroSection } from "@/components/3d/HeroSection";
import { JourneySection } from "@/components/3d/JourneySection";
import { DomainsSection } from "@/components/ui/DomainsSection";
import { FreelanceSection } from "@/components/ui/FreelanceSection";
import { ChatSection } from "@/components/chat/ChatSection";
import { Footer } from "@/components/ui/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-void overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <JourneySection />
      <DomainsSection />
      <FreelanceSection />
      <ChatSection />
      <Footer />
    </main>
  );
}
