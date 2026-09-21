import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/projects/Projects";
import { Skills } from "@/components/sections/Skills";
import { Journey } from "@/components/sections/Journey";
import { Achievements } from "@/components/sections/Achievements";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Journey />
      <Achievements />
    </>
  );
}
