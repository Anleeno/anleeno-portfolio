import React, { useEffect, useRef } from "react";

const palettes = {
  deck: ["#6682c7", "#c5a6d8", "#e6edf6", "#575c9d", "#9b91c5", "#d8d4e8"],
  bloom: ["#9e806e", "#d9b7ae", "#e8ddd0", "#6682c7", "#c5a6d8", "#e6edf6"],
  compass: ["#5898b8", "#d2ad76", "#dbe9ee", "#575c9d", "#9b91c5", "#d8d4e8"],
  star: ["#6682c7", "#c5a6d8", "#e6edf6", "#5898b8", "#d2ad76", "#dbe9ee"],
  moon: ["#575c9d", "#9b91c5", "#d8d4e8", "#9e806e", "#d9b7ae", "#e8ddd0"]
};

const seeded = (seed) => {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
};

function ArcanaField({ activeWorld }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const pointerRef = useRef({ x: .5, y: .45, pulse: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const field = canvas?.parentElement;
    if (!canvas || !field) return undefined;
    const context = canvas.getContext("2d");
    const colors = palettes[activeWorld] || palettes.deck;
    const seedValue = activeWorld.split("").reduce((sum, character) => sum + character.charCodeAt(0), 197);
    const random = seeded(seedValue);
    const particles = Array.from({ length: 125 }, () => ({
      angle: random() * Math.PI * 2,
      radius: .08 + random() * .48,
      speed: (.025 + random() * .095) * (random() > .5 ? 1 : -1),
      size: .4 + random() * 1.5,
      color: colors[Math.floor(random() * colors.length)],
      phase: random() * Math.PI * 2
    }));
    const points = Array.from({ length: 14 }, () => ({ angle: random() * Math.PI * 2, radius: .12 + random() * .35 }));
    const sides = 6 + Math.floor(random() * 4);
    const phase = random() * Math.PI * 2;
    let started = performance.now();

    const resize = () => {
      const bounds = field.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(bounds.width * ratio);
      canvas.height = Math.round(bounds.height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const movePointer = (event) => {
      const bounds = field.getBoundingClientRect();
      pointerRef.current.x = (event.clientX - bounds.left) / bounds.width;
      pointerRef.current.y = (event.clientY - bounds.top) / bounds.height;
    };
    const pulse = () => { pointerRef.current.pulse = 1; };

    const draw = (now) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const unit = Math.min(width, height);
      const time = (now - started) / 1000;
      const pointer = pointerRef.current;
      const isCompact = width <= 767;
      const centerX = width * (isCompact ? .72 : .77);
      const centerY = height * (isCompact ? .24 : .3);
      pointer.pulse *= .94;
      context.clearRect(0, 0, width, height);

      const glow = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, unit * .65);
      glow.addColorStop(0, `${colors[1]}48`);
      glow.addColorStop(.42, `${colors[3]}20`);
      glow.addColorStop(1, "rgba(255,255,255,0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

      context.save();
      context.translate(centerX, centerY);
      context.rotate(time * .018);
      for (let ring = 0; ring < 7; ring += 1) {
        context.beginPath();
        context.arc(0, 0, unit * (.16 + ring * .055) + pointer.pulse * ring * 2.5, 0, Math.PI * 2);
        context.strokeStyle = `${colors[ring % colors.length]}${ring === 3 ? "5e" : "2b"}`;
        context.lineWidth = ring === 3 ? 1.1 : .65;
        context.stroke();
      }
      context.restore();

      context.save();
      context.translate(centerX, centerY);
      context.rotate(-time * .04 + phase);
      for (let layer = 0; layer < 3; layer += 1) {
        context.beginPath();
        const radius = unit * (.14 + layer * .04) + pointer.pulse * 2;
        for (let index = 0; index <= sides * 2; index += 1) {
          const angle = (index / (sides * 2)) * Math.PI * 2;
          const pointRadius = index % 2 ? radius * (.43 + layer * .08) : radius;
          const x = Math.cos(angle) * pointRadius;
          const y = Math.sin(angle) * pointRadius;
          if (!index) context.moveTo(x, y); else context.lineTo(x, y);
        }
        context.closePath();
        context.strokeStyle = `${colors[(layer + 2) % colors.length]}70`;
        context.lineWidth = .75;
        context.stroke();
      }
      context.restore();

      context.beginPath();
      points.forEach((point, index) => {
        const angle = point.angle + Math.sin(time * .1 + index) * .08;
        const x = centerX + Math.cos(angle) * point.radius * unit;
        const y = centerY + Math.sin(angle) * point.radius * unit;
        if (!index) context.moveTo(x, y); else context.lineTo(x, y);
      });
      context.strokeStyle = `${colors[0]}2d`;
      context.lineWidth = .7;
      context.stroke();

      particles.forEach((particle) => {
        const angle = particle.angle + time * particle.speed;
        const wobble = Math.sin(time * .6 + particle.phase) * .012;
        const x = centerX + Math.cos(angle) * (particle.radius + wobble) * unit;
        const y = centerY + Math.sin(angle) * (particle.radius + wobble) * unit;
        const distance = Math.hypot(pointer.x * width - x, pointer.y * height - y);
        const lift = Math.max(0, 1 - distance / 150);
        context.beginPath();
        context.arc(x, y, particle.size + lift * 2 + pointer.pulse * .012, 0, Math.PI * 2);
        context.fillStyle = particle.color;
        context.globalAlpha = .24 + lift * .55;
        context.fill();
      });
      context.globalAlpha = 1;

      const core = context.createRadialGradient(centerX - unit * .025, centerY - unit * .03, 0, centerX, centerY, unit * .09);
      core.addColorStop(0, "rgba(255,255,255,.95)");
      core.addColorStop(.45, `${colors[2]}a8`);
      core.addColorStop(1, `${colors[4]}12`);
      context.beginPath();
      context.arc(centerX, centerY, unit * .09 + pointer.pulse * .15, 0, Math.PI * 2);
      context.fillStyle = core;
      context.fill();

      frameRef.current = requestAnimationFrame(draw);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(field);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", movePointer);
    window.addEventListener("pointerdown", pulse);
    frameRef.current = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", movePointer);
      window.removeEventListener("pointerdown", pulse);
      resizeObserver.disconnect();
      cancelAnimationFrame(frameRef.current);
    };
  }, [activeWorld]);

  return <div className="arcana-field" aria-hidden="true"><canvas ref={canvasRef} /></div>;
}

export default ArcanaField;
