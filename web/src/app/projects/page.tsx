import type { Metadata } from "next";
import { EnquiryPage } from "@/components/EnquiryPage";
import { projectFaqs } from "@/lib/faqs";

export const metadata: Metadata = {
  title: "Major Projects | Alanyo Group",
  description:
    "Bathroom and kitchen fixtures for homes, developments, hotels and offices. Talk to Alanyo Group early in your project.",
};

export default function ProjectsPage() {
  return (
    <EnquiryPage
      kicker="Major projects"
      title="Fixtures for homes, developments and hotels."
      intro="Planning a building or a larger project? Talk to us early. Our team can help you choose bathroom and kitchen fixtures that work together across the whole project."
      topic="projects"
      cta="Discuss your project"
      note="Send us a few details about your project and the quantities you have in mind. Our team will review them and come back to you with pricing and availability."
      faqs={projectFaqs}
      blocks={[
        {
          title: "Who we work with",
          items: [
            "Home builders and owners building or renovating.",
            "Real estate developers.",
            "Hotels and serviced apartments.",
            "Offices and commercial buildings.",
          ],
        },
        {
          title: "What to send us",
          items: [
            "The type of project and where it is.",
            "The products or collections you need, with quantities if you know them.",
            "Your timeline, and when the fixtures are needed on site.",
            "Plans or drawings, if you have them.",
          ],
        },
        {
          title: "How we help",
          numbered: true,
          items: [
            "You tell us about the project.",
            "Our team reviews your list and confirms availability and pricing.",
            "We agree the order and arrange delivery to your site.",
          ],
        },
      ]}
    />
  );
}
