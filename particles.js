// particles.js – simple floating particle background
export function startParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  function resize() {
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = [];
  const maxParticles = 80;
  const colors = ['#ffda79', '#ffd1dc', '#ff9a9e'];

  function createParticle() {
    const size = Math.random() * 3 + 1;
    return {
      x: Math.random() * canvas.offsetWidth,
      y: canvas.offsetHeight + size,
      vy: -(Math.random() * 0.5 + 0.2), // upward speed
      size,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
  }

  for (let i = 0; i < maxParticles; i++) particles.push(createParticle());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.y += p.vy;
      if (p.y < -p.size) {
        // reset to bottom
        p.x = Math.random() * canvas.offsetWidth;
        p.y = canvas.offsetHeight + p.size;
        p.vy = -(Math.random() * 0.5 + 0.2);
        p.size = Math.random() * 3 + 1;
        p.color = colors[Math.floor(Math.random() * colors.length)];
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
}
