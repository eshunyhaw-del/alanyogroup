import { Collections } from "@/components/Collections";
import { Craftsmanship } from "@/components/Craftsmanship";
import { Hero } from "@/components/Hero";
import { Invitation } from "@/components/Invitation";
import { Reviews } from "@/components/Reviews";
import { Ritual } from "@/components/Ritual";
import { Sculpture } from "@/components/Sculpture";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Sculpture />
        <Craftsmanship />
        <Ritual />
        <Collections />
        <Reviews />
        <Invitation />
      </main>
    </>
  );
}
