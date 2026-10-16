import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        {/* Scene 2, The Sculpture, arrives here in the next review step. */}
        <section className="grid min-h-[60svh] place-items-center px-5 py-32">
          <p className="max-w-md text-center text-[11px] uppercase tracking-[0.22em] text-warm">
            Next scene: The Sculpture
          </p>
        </section>
      </main>
    </>
  );
}
