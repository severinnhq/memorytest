'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Brain, Eraser } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"

interface MirrorTracingTaskProps {
  onComplete: (success: boolean) => void;
}

const BUTTERFLY_SHAPE = Array.from({ length: 360 }, (_, i) => {
  const t = i * Math.PI / 180;
  return [
    75 + 50 * Math.sin(t) * (Math.exp(Math.cos(t)) - 2 * Math.cos(4*t) - Math.pow(Math.sin(t/12), 5)),
    75 + 50 * Math.cos(t) * (Math.exp(Math.cos(t)) - 2 * Math.cos(4*t) - Math.pow(Math.sin(t/12), 5))
  ];
});

export default function MirrorTracingTask({ onComplete }: MirrorTracingTaskProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mirrorCanvasRef = useRef<HTMLCanvasElement>(null);
  const lastPositionRef = useRef<{ x: number, y: number } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      drawShape();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const drawShape = () => {
    const mirrorCanvas = mirrorCanvasRef.current;
    if (mirrorCanvas) {
      const mirrorCtx = mirrorCanvas.getContext('2d');
      if (mirrorCtx) {
        mirrorCtx.clearRect(0, 0, mirrorCanvas.width, mirrorCanvas.height);
        mirrorCtx.beginPath();
        mirrorCtx.strokeStyle = '#000000';
        mirrorCtx.lineWidth = 2;
        BUTTERFLY_SHAPE.forEach((point, index) => {
          const [x, y] = point;
          if (index === 0) {
            mirrorCtx.moveTo(x, y);
          } else {
            mirrorCtx.lineTo(x, y);
          }
        });
        mirrorCtx.stroke();
      }
    }

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const drawDot = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.beginPath();
    ctx.arc(x, y, 1, 0, 2 * Math.PI);
    ctx.fill();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    drawAtPosition(offsetX, offsetY);
    lastPositionRef.current = { x: offsetX, y: offsetY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawing) {
      const { offsetX, offsetY } = e.nativeEvent;
      drawAtPosition(offsetX, offsetY);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    lastPositionRef.current = null;
  };

  const drawAtPosition = (x: number, y: number) => {
    const canvas = canvasRef.current;
    const mirrorCanvas = mirrorCanvasRef.current;
    if (canvas && mirrorCanvas) {
      const ctx = canvas.getContext('2d');
      const mirrorCtx = mirrorCanvas.getContext('2d');
      if (ctx && mirrorCtx) {
        ctx.fillStyle = '#FF0000';
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 2;
        mirrorCtx.fillStyle = '#FF0000';
        mirrorCtx.strokeStyle = '#FF0000';
        mirrorCtx.lineWidth = 2;

        drawDot(ctx, x, y);
        drawDot(mirrorCtx, mirrorCanvas.width - x, y);

        if (lastPositionRef.current) {
          ctx.beginPath();
          ctx.moveTo(lastPositionRef.current.x, lastPositionRef.current.y);
          ctx.lineTo(x, y);
          ctx.stroke();

          mirrorCtx.beginPath();
          mirrorCtx.moveTo(mirrorCanvas.width - lastPositionRef.current.x, lastPositionRef.current.y);
          mirrorCtx.lineTo(mirrorCanvas.width - x, y);
          mirrorCtx.stroke();
        }

        lastPositionRef.current = { x, y };
      }
    }
  };

  const handleClear = () => {
    drawShape();
  };

  const handleFinish = () => {
    setGameOver(true);
  };

  if (gameOver) {
    return (
      <Card className="w-full max-w-xs mx-auto">
        <CardContent className="p-4">
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-4"
          >
            <Brain className="w-12 h-12 mx-auto text-primary" />
            <p className="text-lg font-bold">Challenge Completed!</p>
            <p className="text-xs">
              You completed the butterfly mirror tracing task.
            </p>
            <Button onClick={() => onComplete(true)} className="w-full mt-2">Finish</Button>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-xs mx-auto">
      <CardContent className="p-4">
        <h2 className="text-lg font-bold mb-2 text-center">Mirror Tracing Challenge</h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <Alert className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Trace the butterfly shape on the left while looking at the right (mirrored) canvas.
            </AlertDescription>
          </Alert>
          <div className="text-xs font-medium text-center">Shape: Butterfly</div>
          <div className="flex justify-between">
            <canvas
              ref={canvasRef}
              width={150}
              height={150}
              className="border border-gray-300"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
            <canvas
              ref={mirrorCanvasRef}
              width={150}
              height={150}
              className="border border-gray-300"
            />
          </div>
          <div className="flex justify-between">
            <Button onClick={handleClear} variant="outline" size="sm" className="text-xs px-2 py-1">
              <Eraser className="w-3 h-3 mr-1" />
              Clear
            </Button>
            <Button onClick={handleFinish} size="sm" className="text-xs px-2 py-1">
              Finish
            </Button>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}