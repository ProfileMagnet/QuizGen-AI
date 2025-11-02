import React, { useEffect, useRef, useState, useMemo } from 'react';

const ProfessionalAnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  const colors = useMemo(() => [
    '#0EA5E9', '#7C3AED', '#22C55E', '#E2E8F0'
  ], []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Particle system with enhanced visuals
    class Particle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: string;
      life: number;
      maxLife: number;

      constructor() {
        this.x = 0;
        this.y = 0;
        this.baseX = 0;
        this.baseY = 0;
        this.size = 0;
        this.speedX = 0;
        this.speedY = 0;
        this.opacity = 0;
        this.color = '';
        this.life = 0;
        this.maxLife = 0;
        this.reset();
      }

      reset() {
        if (!canvas) return;
        this.baseX = Math.random() * canvas.width;
        this.baseY = Math.random() * canvas.height;
        this.x = this.baseX;
        this.y = this.baseY;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.4 + 0.3;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.maxLife = Math.random() * 200 + 200;
        this.life = 0;
      }

      update() {
        if (!canvas) return;
        
        // Smooth floating motion
        this.x += this.speedX;
        this.y += this.speedY;
        this.life++;

        // Gentle drift back to base position
        const driftForce = 0.001;
        this.x += (this.baseX - this.x) * driftForce;
        this.y += (this.baseY - this.y) * driftForce;

        // Wrap around screen
        if (this.x < -50) this.x = canvas.width + 50;
        if (this.x > canvas.width + 50) this.x = -50;
        if (this.y < -50) this.y = canvas.height + 50;
        if (this.y > canvas.height + 50) this.y = -50;

        // Mouse interaction - subtle attraction
        const dx = mousePos.x - this.x;
        const dy = mousePos.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const force = (100 - distance) / 100 * 0.2;
          this.x += (dx / distance) * force;
          this.y += (dy / distance) * force;
        }

        // Reset if life exceeded
        if (this.life > this.maxLife) {
          this.reset();
        }
      }

      draw() {
        if (!ctx) return;
        
        // Fade in/out effect
        let alpha = this.opacity;
        if (this.life < 30) {
          alpha *= this.life / 30;
        } else if (this.life > this.maxLife - 30) {
          alpha *= (this.maxLife - this.life) / 30;
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
    
    // Create particles - reduced from 80 to 40 for better performance
    const particles = Array.from({ length: 40 }, () => new Particle());

    // Enhanced connection lines
    const drawConnections = () => {
      if (!ctx) return;
      
      particles.forEach((p1, i) => {
        particles.slice(i + 1, i + 8).forEach(p2 => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 80) {
            const alpha = (1 - distance / 80) * 0.1;
            
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p1.color;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        });
      });
    };

    // Animated mesh background
    let lastTime = 0;
    const frameRate = 1000 / 30; // 30 FPS instead of 60
    
    const animate = (timestamp: number) => {
      if (!ctx || !canvas) return;
      
      // Frame rate limiting
      if (timestamp - lastTime < frameRate) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      lastTime = timestamp;
      
      // Simplified gradient background - less calculations
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawConnections();
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      animationId = requestAnimationFrame(animate);
    };

    let animationId: number;
    animate(0); // Pass initial timestamp

    // Handle resize
    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles.forEach(p => p.reset());
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [mousePos, colors]); // Added colors to dependency array

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
      background: '#0F172A',
      zIndex: -1
    }}>
      {/* Reduced animations in style tag */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-10px) translateX(5px);
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.05);
          }
        }
      `}</style>
      
      {/* Main animated canvas */}
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1
        }}
      />

      {/* Simplified cyber grid overlay - reduced opacity */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(14, 165, 233, 0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(14, 165, 233, 0.02) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px', // Increased from 60px to reduce density
        opacity: 0.3, // Reduced from 0.4
        zIndex: 2
      }} />

      {/* Reduced floating accent dots - from 10 to 5 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 3
      }}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${6 + (i % 2) * 2}px`,
              height: `${6 + (i % 2) * 2}px`,
              backgroundColor: colors[i % colors.length],
              borderRadius: '50%',
              left: `${15 + i * 15}%`,
              top: `${20 + (i * 12) % 60}%`,
              animation: `float ${6 + i * 0.8}s ease-in-out infinite, pulse ${4 + i * 0.3}s ease-in-out infinite`,
              animationDelay: `${i * 0.6}s`
            }}
          />
        ))}
      </div>

      {/* Removed cyber orbs for better performance */}
      
      {/* Simplified vignette effect */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at center, transparent 0%, rgba(15, 23, 42, 0.4) 100%)',
        pointerEvents: 'none',
        zIndex: 4
      }} />
    </div>
  );
};

export default ProfessionalAnimatedBackground;