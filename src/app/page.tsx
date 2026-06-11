import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { AboutStats } from "@/components/sections/about-stats";
import { CompanyShowcase } from "@/components/sections/company-showcase";
import { FeaturesTable } from "@/components/sections/features-table";
import { OurPartners } from "@/components/sections/our-partners";
import { TrustedCompanies } from "@/components/sections/trusted-companies";
import { Testimonials } from "@/components/sections/testimonials";
import { BlogNews } from "@/components/sections/blog-news";
import { UsaMapCta } from "@/components/sections/usa-map-cta";
import { EldChatbot } from "@/components/widgets/eld-chatbot";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <AboutStats />
        <CompanyShowcase />
        <FeaturesTable />
        <OurPartners />
        <TrustedCompanies />
        <Testimonials />
        <BlogNews />
        <UsaMapCta />
      </main>
      <Footer />
      <EldChatbot />
    </>
  );
}
