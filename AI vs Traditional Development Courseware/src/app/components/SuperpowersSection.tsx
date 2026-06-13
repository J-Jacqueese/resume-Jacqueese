import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { phases, type Skill, type Phase } from "./superpowers/workflowData";

function SkillCard({ skill }: { skill: Skill }) {
  return (
    <Card className="flex-1 min-w-[220px] max-w-[320px]">
      <CardContent className="flex flex-col gap-2 py-5">
        <Badge variant="secondary" className="w-fit text-xs">
          /{skill.name}
        </Badge>
        <p className="text-sm leading-relaxed">{skill.description}</p>
        <p className="text-xs text-muted-foreground mt-auto">
          <span className="font-medium">何时用：</span>
          {skill.whenToUse}
        </p>
      </CardContent>
    </Card>
  );
}

function PhaseHeader({
  phase,
  isExpanded,
  skillCount,
  onClick,
}: {
  phase: Phase;
  isExpanded: boolean;
  skillCount: number;
  onClick: () => void;
}) {
  const Icon = phase.icon;

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left w-full
        ${isExpanded ? "bg-primary/5 border-l-[3px] border-l-primary pl-[13px]" : "hover:bg-muted/50 border-l-[3px] border-l-transparent pl-[13px]"}
      `}
    >
      <Icon
        className={`size-5 shrink-0 ${isExpanded ? "text-primary" : "text-muted-foreground"}`}
      />
      <span
        className={`font-medium ${isExpanded ? "text-primary" : "text-foreground"}`}
      >
        {phase.label}
      </span>
      <Badge variant="outline" className="text-[10px] px-1.5 py-0 ml-auto">
        {skillCount} 个技能
      </Badge>
    </button>
  );
}

export function SuperpowersSection() {
  const [expandedKey, setExpandedKey] = useState<string>(phases[0].key);

  const togglePhase = (key: string) => {
    setExpandedKey((prev) => (prev === key ? prev : key));
  };

  return (
    <section id="superpowers" className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-8">
        <Badge>模块 02 · 工具链</Badge>
        <h2 className="mt-2">Superpowers 技能生态</h2>
        <p className="text-muted-foreground">
          Superpowers 是一套可组合的技能框架，覆盖从构思到交付的完整开发周期。每个阶段都有对应的技能加持，让 AI 从"代码生成器"进化为成熟的软件开发者。
        </p>
      </div>

      {/* Desktop: horizontal phases with dashed connectors */}
      <div className="hidden md:block">
        <div className="flex items-start gap-0">
          {phases.map((phase, index) => {
            const isExpanded = expandedKey === phase.key;
            const isLast = index === phases.length - 1;

            return (
              <div key={phase.key} className="flex items-start flex-1">
                <div className="flex-1 min-w-0">
                  <PhaseHeader
                    phase={phase}
                    isExpanded={isExpanded}
                    skillCount={phase.skills.length}
                    onClick={() => togglePhase(phase.key)}
                  />
                  {isExpanded && (
                    <div className="mt-4 ml-4">
                      <div className="flex flex-wrap gap-3">
                        {phase.skills.map((skill) => (
                          <SkillCard key={skill.name} skill={skill} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {!isLast && (
                  <div className="flex-shrink-0 w-8 flex items-center justify-center pt-6">
                    <div className="w-full border-t border-dashed border-border" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: vertical phases with dashed connectors */}
      <div className="md:hidden space-y-0">
        {phases.map((phase, index) => {
          const isExpanded = expandedKey === phase.key;
          const isLast = index === phases.length - 1;

          return (
            <div key={phase.key}>
              <PhaseHeader
                phase={phase}
                isExpanded={isExpanded}
                skillCount={phase.skills.length}
                onClick={() => togglePhase(phase.key)}
              />
              {isExpanded && (
                <div className="mt-3 ml-4 pl-4 border-l border-dashed border-border">
                  <div className="flex flex-col gap-3">
                    {phase.skills.map((skill) => (
                      <SkillCard key={skill.name} skill={skill} />
                    ))}
                  </div>
                </div>
              )}
              {!isLast && !isExpanded && (
                <div className="ml-[23px] h-6 w-0 border-l border-dashed border-border" />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
