import { useEffect, useRef } from 'react';

const PremiumBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Configurar dimensiones del canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Variables para la animación
    let animationId: number;
    let time = 0;
    
    // Configuración de colores
    const colors = {
      primary: '#3a1c71',
      secondary: '#d76d77',
      accent: '#ffaf7b',
      dark: '#121212',
      light: '#ffffff'
    };
    
    // Configuración de partículas
    const particleSettings = {
      count: 100,
      minSize: 1,
      maxSize: 4,
      speed: 0.2,
      connectDistance: 150,
      connectOpacity: 0.15
    };
    
    // Clase para las partículas
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      hue: number;
      brightness: number;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * (particleSettings.maxSize - particleSettings.minSize) + particleSettings.minSize;
        
        // Velocidad aleatoria con dirección
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * particleSettings.speed;
        this.speedX = Math.cos(angle) * speed;
        this.speedY = Math.sin(angle) * speed;
        
        // Color
        this.hue = Math.random() * 60 - 30; // Variación de tono
        this.brightness = 50 + Math.random() * 20; // Variación de brillo
      }
      
      update() {
        // Mover partícula
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Rebote en los bordes
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }
      
      draw(ctx: CanvasRenderingContext2D) {
        // Dibujar partícula con brillo
        ctx.beginPath();
        
        // Gradiente radial para efecto de brillo
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size * 2
        );
        
        gradient.addColorStop(0, `hsla(${this.hue}, 100%, ${this.brightness}%, 0.8)`);
        gradient.addColorStop(1, `hsla(${this.hue}, 100%, ${this.brightness}%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Crear partículas
    const particles: Particle[] = [];
    for (let i = 0; i < particleSettings.count; i++) {
      particles.push(new Particle());
    }
    
    // Función para dibujar conexiones entre partículas
    const drawConnections = (particles: Particle[], ctx: CanvasRenderingContext2D) => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < particleSettings.connectDistance) {
            // Opacidad basada en la distancia
            const opacity = 1 - (distance / particleSettings.connectDistance);
            
            // Dibujar línea de conexión
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * particleSettings.connectOpacity})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };
    
    // Función para dibujar ondas de flujo
    const drawFlowWaves = (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
      const waveCount = 3;
      const waveHeight = height * 0.15;
      
      for (let w = 0; w < waveCount; w++) {
        ctx.beginPath();
        
        // Color basado en el índice de la onda
        let alpha: number;
        if (w === 0) {
          ctx.strokeStyle = `rgba(58, 28, 113, 0.2)`; // Primary color
          alpha = 0.2;
        } else if (w === 1) {
          ctx.strokeStyle = `rgba(215, 109, 119, 0.15)`; // Secondary color
          alpha = 0.15;
        } else {
          ctx.strokeStyle = `rgba(255, 175, 123, 0.1)`; // Accent color
          alpha = 0.1;
        }
        
        ctx.lineWidth = 2;
        
        // Parámetros de la onda
        const frequency = 0.005 + w * 0.002;
        const speed = 0.2 + w * 0.1;
        const offset = w * 50;
        
        // Dibujar la onda
        for (let x = 0; x < width; x += 5) {
          const y = Math.sin(x * frequency + time * speed) * waveHeight + height / 2 + offset;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
        
        // Dibujar área bajo la onda
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        
        // Gradiente para el área
        const gradient = ctx.createLinearGradient(0, height / 2, 0, height);
        if (w === 0) {
          gradient.addColorStop(0, `rgba(58, 28, 113, ${alpha})`);
          gradient.addColorStop(1, `rgba(58, 28, 113, 0)`);
        } else if (w === 1) {
          gradient.addColorStop(0, `rgba(215, 109, 119, ${alpha})`);
          gradient.addColorStop(1, `rgba(215, 109, 119, 0)`);
        } else {
          gradient.addColorStop(0, `rgba(255, 175, 123, ${alpha})`);
          gradient.addColorStop(1, `rgba(255, 175, 123, 0)`);
        }
        
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    };
    
    // Función para dibujar círculos concéntricos
    const drawCentricCircles = (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.min(width, height) * 0.4;
      
      // Número de círculos
      const circleCount = 5;
      
      for (let i = 0; i < circleCount; i++) {
        // Radio basado en el tiempo y el índice
        const radiusFactor = 0.2 + (i / circleCount) * 0.8;
        const pulseFactor = Math.sin(time * (0.2 + i * 0.05)) * 0.05;
        const radius = maxRadius * (radiusFactor + pulseFactor);
        
        // Opacidad basada en el índice
        const baseOpacity = 0.03 + (i / circleCount) * 0.02;
        const opacityFactor = Math.sin(time * 0.3 + i) * 0.01;
        const opacity = baseOpacity + opacityFactor;
        
        // Color basado en el índice
        let color;
        if (i % 3 === 0) {
          color = `rgba(58, 28, 113, ${opacity})`; // Primary
        } else if (i % 3 === 1) {
          color = `rgba(215, 109, 119, ${opacity})`; // Secondary
        } else {
          color = `rgba(255, 175, 123, ${opacity})`; // Accent
        }
        
        // Dibujar círculo
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1 + (i / circleCount) * 2;
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    };
    
    // Función para dibujar efecto de viñeta
    const drawVignette = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      const gradient = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, Math.max(width, height) / 1.5
      );
      
      gradient.addColorStop(0, 'rgba(18, 18, 18, 0)');
      gradient.addColorStop(1, 'rgba(18, 18, 18, 0.7)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    };
    
    // Función para dibujar líneas de cuadrícula
    const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
      const gridSize = 50;
      const lineOpacity = 0.05;
      
      // Líneas horizontales
      for (let y = 0; y < height; y += gridSize) {
        const yOffset = (y + time * 10) % height;
        
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 255, 255, ${lineOpacity})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(0, yOffset);
        ctx.lineTo(width, yOffset);
        ctx.stroke();
      }
      
      // Líneas verticales
      for (let x = 0; x < width; x += gridSize) {
        const xOffset = (x + time * 5) % width;
        
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 255, 255, ${lineOpacity})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(xOffset, 0);
        ctx.lineTo(xOffset, height);
        ctx.stroke();
      }
    };
    
    // Función de animación principal
    const animate = () => {
      // Limpiar canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Fondo con gradiente
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, colors.dark);
      gradient.addColorStop(1, '#1a1a2e');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Dibujar cuadrícula
      drawGrid(ctx, canvas.width, canvas.height, time);
      
      // Dibujar círculos concéntricos
      drawCentricCircles(ctx, canvas.width, canvas.height, time);
      
      // Dibujar ondas de flujo
      drawFlowWaves(ctx, canvas.width, canvas.height, time);
      
      // Actualizar y dibujar partículas
      particles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });
      
      // Dibujar conexiones entre partículas
      drawConnections(particles, ctx);
      
      // Dibujar efecto de viñeta
      drawVignette(ctx, canvas.width, canvas.height);
      
      // Actualizar tiempo
      time += 0.01;
      
      // Continuar animación
      animationId = requestAnimationFrame(animate);
    };
    
    // Iniciar animación
    animate();
    
    // Limpieza al desmontar
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default PremiumBackground;
