import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  pulse: number;
  pulseSpeed: number;
}

export const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
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

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.3 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
      pulse: 0,
      pulseSpeed: Math.random() * 0.02 + 0.01
    });

    const initParticles = () => {
      const particleCount = window.innerWidth < 768 ? 50 : 100;
      particles = Array.from({ length: particleCount }, createParticle);
    };

    const drawParticle = (particle: Particle) => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * (1 + Math.sin(particle.pulse) * 0.2), 0, Math.PI * 2);
      ctx.fillStyle = `${particle.color}${Math.round(particle.opacity * 255).toString(16).padStart(2, '0')}`;
      ctx.fill();
    };

    const drawConnections = () => {
      const maxDistance = 100;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.15;
            ctx.strokeStyle = `rgba(45, 156, 219, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const updateParticle = (particle: Particle) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      particle.pulse += particle.pulseSpeed;

      // Wrap around screen edges
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;

      // Pulsing opacity
      particle.opacity = 0.2 + Math.sin(particle.pulse) * 0.1;
    };

    const animate = (timestamp: number) => {
      const deltaTime = timestamp - lastTime;
      
      if (deltaTime > 16) { // Cap at ~60fps
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw connections first
        drawConnections();
        
        // Then draw particles
        particles.forEach(particle => {
          updateParticle(particle);
          drawParticle(particle);
        });
        
        lastTime = timestamp;
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initParticles();
    animate(0);

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-30"
      style={{ zIndex: 0 }}
    />
  );
};