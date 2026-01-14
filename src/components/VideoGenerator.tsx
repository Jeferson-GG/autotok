import { useEffect, useRef, useState } from "react";
import { VideoScript, VideoScene } from "@/lib/gemini";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { toast } from "sonner";
import { Card } from "./ui/card";

interface VideoGeneratorProps {
    script: VideoScript | null;
    onVideoGenerated: (file: Blob) => void;
}

const CANVAS_WIDTH = 1080 / 2; // Preview size (half resolution for performance/display)
const CANVAS_HEIGHT = 1920 / 2;
const FPS = 30;

export const VideoGenerator = ({ script, onVideoGenerated }: VideoGeneratorProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isRendering, setIsRendering] = useState(false);
    const [progress, setProgress] = useState(0);

    const drawScene = (ctx: CanvasRenderingContext2D, scene: VideoScene, frameProgress: number) => {
        // Background
        ctx.fillStyle = scene.backgroundColor;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Text configuration
        ctx.fillStyle = scene.textColor;
        ctx.font = "bold 40px Inter, sans-serif"; // Adjusted for half-res
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Split text into lines
        const words = scene.text.split(" ");
        let line = "";
        const lines = [];

        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + " ";
            const metrics = ctx.measureText(testLine);
            if (metrics.width > ctx.canvas.width * 0.8 && i > 0) {
                lines.push(line);
                line = words[i] + " ";
            } else {
                line = testLine;
            }
        }
        lines.push(line);

        // Animation Logic
        let alpha = 1;
        let yOffset = 0;

        if (scene.animation === "fade") {
            alpha = Math.min(frameProgress * 2, 1);
        } else if (scene.animation === "slide-up") {
            yOffset = (1 - Math.min(frameProgress * 3, 1)) * 100;
            alpha = Math.min(frameProgress * 3, 1);
        } else if (scene.animation === "pop") {
            const scale = Math.min(frameProgress * 4, 1.2);
            const finalScale = scale > 1 ? Math.max(1, 2.2 - scale) : scale;
            // Simple scaling simulation via font size would be complex here, keeping it simple
            yOffset = 0;
        }

        ctx.globalAlpha = alpha;

        // Draw Text Lines
        const lineHeight = 50;
        const startY = (ctx.canvas.height - (lines.length * lineHeight)) / 2 + yOffset;

        lines.forEach((l, i) => {
            ctx.fillText(l.trim(), ctx.canvas.width / 2, startY + (i * lineHeight));
        });

        ctx.globalAlpha = 1;

        // Watermark
        ctx.font = "14px sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.textAlign = "center";
        ctx.fillText("AutoTok AI", ctx.canvas.width / 2, ctx.canvas.height - 40);
    };

    const startRendering = async () => {
        if (!script || !canvasRef.current) return;
        setIsRendering(true);
        setProgress(0);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Setup MediaRecorder
        const stream = canvas.captureStream(FPS);
        const mediaRecorder = new MediaRecorder(stream, {
            mimeType: "video/webm;codecs=vp9" // Chrome supports this well
        });

        const chunks: Blob[] = [];
        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: "video/webm" });
            onVideoGenerated(blob);
            setIsRendering(false);
            toast.success("Vídeo gerado com sucesso!");
        };

        mediaRecorder.start();

        // Rendering Loop
        let currentSceneIndex = 0;
        let sceneStartTime = 0;
        let totalDuration = script.scenes.reduce((acc, s) => acc + s.duration, 0);
        let framesProcessed = 0;
        const totalFrames = totalDuration * FPS;

        const renderFrame = () => {
            if (currentSceneIndex >= script.scenes.length) {
                mediaRecorder.stop();
                return;
            }

            const scene = script.scenes[currentSceneIndex];
            const frameDuration = 1000 / FPS;

            // Calculate progress within the scene (0 to 1)
            if (sceneStartTime === 0) sceneStartTime = Date.now();

            // We simulate time using frames to ensure constant FPS for recording
            framesProcessed++;
            const currentSceneFrame = framesProcessed - (previousScenesDuration(script.scenes, currentSceneIndex) * FPS);
            const sceneProgress = currentSceneFrame / (scene.duration * FPS);

            drawScene(ctx, scene, sceneProgress);

            setProgress(Math.round((framesProcessed / totalFrames) * 100));

            if (framesProcessed >= (previousScenesDuration(script.scenes, currentSceneIndex + 1) * FPS)) {
                currentSceneIndex++;
            }

            if (currentSceneIndex < script.scenes.length) {
                requestAnimationFrame(renderFrame);
                // For stricter recording, we might use setTimeout logic or offscreen canvas, 
                // but requestAnimationFrame is usually fine for simple visual capture.
            } else {
                mediaRecorder.stop();
            }
        };

        const previousScenesDuration = (scenes: VideoScene[], index: number) => {
            return scenes.slice(0, index).reduce((acc, s) => acc + s.duration, 0);
        }

        renderFrame();
    };

    return (
        <Card className="p-4 flex flex-col items-center gap-4 bg-gray-900 border-gray-800">
            <div className="relative border border-gray-700 rounded-lg overflow-hidden bg-black shadow-2xl">
                <canvas
                    ref={canvasRef}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    className="w-[270px] h-[480px] object-cover" // Visual size
                />
                {script && !isRendering && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/30 transition-all cursor-pointer" onClick={startRendering}>
                        <div className="bg-white/10 p-4 rounded-full backdrop-blur-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                        </div>
                    </div>
                )}
            </div>

            <div className="w-full space-y-2">
                {isRendering ? (
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>Gerando vídeo...</span>
                            <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div>
                ) : (
                    <div className="text-center text-sm text-muted-foreground">
                        {script ? "Clique no player para gerar o vídeo" : "Aguardando roteiro..."}
                    </div>
                )}
            </div>
        </Card>
    );
};
