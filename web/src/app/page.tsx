import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Collections } from "@/components/Collections";
import { Craftsmanship } from "@/components/Craftsmanship";
import { Hero } from "@/components/Hero";
import { Invitation } from "@/components/Invitation";
import { Ritual } from "@/components/Ritual";
import { Sculpture } from "@/components/Sculpture";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Sculpture />
        <Craftsmanship />
        <Ritual />
        <Collections />
        <Invitation />
      </main>
      <Footer />
    </>
  );
}
