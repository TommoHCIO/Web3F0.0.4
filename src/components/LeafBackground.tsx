import React, { useEffect, useRef } from 'react';

interface Leaf {
  x: number;
  y: number;
  size: number;
  rotation: number;
  speed: number;
  rotationSpeed: number;
  color: string;
  opacity: number;
  swayAmount: number;
  swaySpeed: number;
  swayOffset: number;
}

export const LeafBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let leaves: Leaf[] = [];
    let animationFrameId: number;
    let lastTime = 0;

    const colors = [
      '#2D9CDB', // Blue
      '#4B94DC', // Light Blue
      '#6A75DB', // Purple Blue
      '#7F56D9', // Purple
      '#F43F5E', // Pink
      '#10B981'  // Green
    ];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createLeaf = (): Leaf => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 15 + 10, // Larger leaves
      rotation: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.5 + 0.5, // Slower fall speed
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.3 + 0.2,
      swayAmount: Math.random() * 2 + 1,
      swaySpeed: Math.random() * 0.02 + 0.01,
      swayOffset: Math.random() * Math.PI * 2
    });

    const initLeaves = () => {
      const leafCount = window.innerWidth < 768 ? 20 : 40;
      leaves = Array.from({ length: leafCount }, createLeaf);
    };

    const drawLeaf = (ctx: CanvasRenderingContext2D, leaf: Leaf) => {
      ctx.save();
      ctx.translate(leaf.x, leaf.y);
      ctx.rotate(leaf.rotation);
      ctx.globalAlpha = leaf.opacity;

      // Draw a more detailed leaf shape
      ctx.beginPath();
      ctx.moveTo(0, -leaf.size / 2);
      ctx.bezierCurveTo(
        leaf.size / 4, -leaf.size / 2,
        leaf.size / 2, -leaf.size / 4,
        leaf.size / 2, 0
      );
      ctx.bezierCurveTo(
        leaf.size / 2, leaf.size / 4,
        leaf.size / 4, leaf.size / 2,
        0, leaf.size / 2
      );
      ctx.bezierCurveTo(
        -leaf.size / 4, leaf.size / 2,
        -leaf.size / 2, leaf.size / 4,
        -leaf.size / 2, 0
      );
      ctx.bezierCurveTo(
        -leaf.size / 2, -leaf.size / 4,
        -leaf.size / 4, -leaf.size / 2,
        0, -leaf.size / 2
      );

      ctx.fillStyle = leaf.color;
      ctx.fill();

      // Add a stem
      ctx.beginPath();
      ctx.moveTo(0, -leaf.size / 2);
      ctx.lineTo(0, leaf.size / 2);
      ctx.strokeStyle = leaf.color;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();
    };

    const updateLeaf = (leaf: Leaf, deltaTime: number) => {
      // Update vertical position with varying speed
      leaf.y += leaf.speed * deltaTime * 0.05;

      // Add horizontal swaying motion
      leaf.x += Math.sin(leaf.swayOffset) * leaf.swayAmount * 0.1;
      leaf.swayOffset += leaf.swaySpeed;

      // Update rotation
      leaf.rotation += leaf.rotationSpeed * deltaTime * 0.05;

      // Reset leaf when it goes off screen
      if (leaf.y > canvas.height + leaf.size) {
        leaf.y = -leaf.size;
        leaf.x = Math.random() * canvas.width;
      }

      // Wrap around horizontally
      if (leaf.x > canvas.width + leaf.size) leaf.x = -leaf.size;
      if (leaf.x < -leaf.size) leaf.x = canvas.width + leaf.size;
    };

    const animate = (timestamp: number) => {
      const deltaTime = timestamp - lastTime;
      
      if (deltaTime > 16) { // Cap at ~60fps
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        leaves.forEach(leaf => {
          updateLeaf(leaf, deltaTime);
          drawLeaf(ctx, leaf);
        });
        
        lastTime = timestamp;
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initLeaves();
    animate(0);

    window.addEventListener('resize', () => {
      resizeCanvas();
      initLeaves();
    });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-40"
      style={{ zIndex: 1 }}
    />
  );
};