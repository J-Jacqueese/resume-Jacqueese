import { useState } from "react";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent } from "./ui/dialog";
import { Sparkles } from "lucide-react";
import traditionalDevImg from "../../imports/traditional-dev.png";
import aiDevImg from "../../imports/ai-dev.png";

export function Hero() {
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  return (
    <section className="relative overflow-hidden bg-secondary">
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-10">
        <div className="text-center space-y-4">
          <Badge className="bg-primary text-primary-foreground">
            <Sparkles className="size-3.5 mr-1.5" /> Vibe Coding 教学课件
          </Badge>
          <h1 className="text-3xl md:text-4xl font-semibold">AI 辅助开发 与 传统开发模式对比</h1>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div
            className="rounded-xl overflow-hidden border border-border shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setPreviewSrc(traditionalDevImg)}
          >
            <img
              src={traditionalDevImg}
              alt="传统开发的整体流程质量管理体系"
              className="w-full h-auto object-cover"
            />
          </div>
          <div
            className="rounded-xl overflow-hidden border border-border shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setPreviewSrc(aiDevImg)}
          >
            <img
              src={aiDevImg}
              alt="AI开发的整体流程质量管理体系"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>

      <Dialog open={!!previewSrc} onOpenChange={() => setPreviewSrc(null)}>
        <DialogContent className="max-w-none w-screen h-screen p-0 border-none bg-white/95 backdrop-blur-sm flex items-center justify-center [&>button]:top-4 [&>button]:right-4">
          {previewSrc && (
            <img
              src={previewSrc}
              alt="预览大图"
              className="max-w-[95vw] max-h-[95vh] object-contain rounded-lg shadow-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
