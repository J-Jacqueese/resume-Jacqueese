import { Hero } from "./components/Hero";
import { CourseOverview } from "./components/CourseOverview";
import { ComparisonSection } from "./components/ComparisonSection";
import { VibeCodingIntro } from "./components/VibeCodingIntro";
import { SuperpowersSection } from "./components/SuperpowersSection";
import { ProjectBrief } from "./components/ProjectBrief";
import { StepByStepManual } from "./components/StepByStepManual";
import { HandoutsSection } from "./components/HandoutsSection";
import { AssessmentSection } from "./components/AssessmentSection";
import { Footer } from "./components/Footer";
import { Sparkles } from "lucide-react";

const navLinks = [
  { href: "#overview", label: "课程概览" },
  { href: "#comparison", label: "模式对比" },
  { href: "#vibe", label: "Vibe Coding" },
  { href: "#superpowers", label: "Superpowers" },
  { href: "#project", label: "实验项目" },
  { href: "#manual", label: "实验手册" },
  { href: "#handouts", label: "课程讲义" },
  { href: "#assessment", label: "考核评估" },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 backdrop-blur bg-background/80 border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <span>Vibe Coding 教学课件</span>
          </button>
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href.slice(1))}
                className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                {l.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <Hero />
        <CourseOverview />
        <ComparisonSection />
        <VibeCodingIntro />
        <SuperpowersSection />
        <ProjectBrief />
        <StepByStepManual />
        <HandoutsSection />
        <AssessmentSection />
      </main>

      <Footer />
    </div>
  );
}
