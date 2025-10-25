import React, { useEffect, useRef, useState } from 'react';

const ProfessionalAnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  const colors = ['#0EA5E9', '#7C3AED', '#22C55E', '#E2E8F0'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Color palette
    

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
        const driftForce = 0.002;
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
        
        if (distance < 200) {
          const force = (200 - distance) / 200 * 0.5;
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
        if (this.life < 50) {
          alpha *= this.life / 50;
        } else if (this.life > this.maxLife - 50) {
          alpha *= (this.maxLife - this.life) / 50;
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
        
        // Soft glow
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }
    }
    // Create particles
    const particles = Array.from({ length: 80 }, () => new Particle());

    // Enhanced connection lines
    const drawConnections = () => {
      if (!ctx) return;
      
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const alpha = (1 - distance / 150) * 0.2;
            
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            
            // Gradient line
            const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
            gradient.addColorStop(0, p1.color);
            gradient.addColorStop(1, p2.color);
            
            ctx.strokeStyle = gradient;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        });
      });
    };

    // Animated mesh background
    let time = 0;
    const animate = () => {
      if (!ctx || !canvas) return;
      
      time += 0.005;
      
      // Dynamic gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2 + Math.sin(time) * 100,
        canvas.height / 2 + Math.cos(time) * 100,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) * 0.7
      );
      
      gradient.addColorStop(0, '#1e293b');
      gradient.addColorStop(0.5, '#0F172A');
      gradient.addColorStop(1, '#020617');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Secondary gradient overlay with cyber colors
      const overlayGradient = ctx.createLinearGradient(
        0, 0,
        canvas.width, canvas.height
      );
      overlayGradient.addColorStop(0, 'rgba(14, 165, 233, 0.05)');
      overlayGradient.addColorStop(0.5, 'rgba(124, 58, 237, 0.03)');
      overlayGradient.addColorStop(1, 'rgba(34, 197, 94, 0.05)');
      
      ctx.fillStyle = overlayGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawConnections();
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      animationId = requestAnimationFrame(animate);
    };

    let animationId: number;
    animate();

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
  }, [mousePos]);

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
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          33% {
            transform: translateY(-25px) translateX(15px);
          }
          66% {
            transform: translateY(15px) translateX(-15px);
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px currentColor, 0 0 40px currentColor;
          }
          50% {
            box-shadow: 0 0 30px currentColor, 0 0 60px currentColor;
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

      {/* Cyber grid overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(14, 165, 233, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(14, 165, 233, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        opacity: 0.4,
        zIndex: 2
      }} />

      {/* Floating accent dots */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 3
      }}>
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${8 + (i % 3) * 3}px`,
              height: `${8 + (i % 3) * 3}px`,
              backgroundColor: colors[i % colors.length],
              borderRadius: '50%',
              left: `${8 + i * 10}%`,
              top: `${15 + (i * 8) % 70}%`,
              animation: `float ${5 + i * 0.5}s ease-in-out infinite, pulse ${3 + i * 0.4}s ease-in-out infinite, glow ${4 + i * 0.3}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
              color: colors[i % colors.length]
            }}
          />
        ))}
      </div>

      {/* Cyber orbs */}
      <div className="background-container">
        <div className="orbs-container">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>
      </div>

      {/* Vignette effect */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at center, transparent 0%, rgba(15, 23, 42, 0.6) 100%)',
        pointerEvents: 'none',
        zIndex: 4
      }} />
    </div>
  );
};

export default ProfessionalAnimatedBackground;