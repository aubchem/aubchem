/**
 * particles.js
 * Molecular node-and-edge network background animation
 */

class ParticleNetwork {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'particles-canvas';
        document.body.prepend(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        this.nodes = [];
        this.nodeCount = 120;
        this.maxDistance = 140;
        this.mouse = { x: null, y: null, radius: 100 };
        
        this.colors = ['#00c9a7', '#f7a325']; // Teal and Amber
        
        this.init();
        this.animate();
        this.handleResize();
        this.handleMouseMove();
    }

    init() {
        this.resize();
        this.nodes = [];
        
        // Adjust density based on screen size
        if (window.innerWidth < 480) this.nodeCount = 30;
        else if (window.innerWidth < 768) this.nodeCount = 60;
        else this.nodeCount = 120;

        for (let i = 0; i < this.nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6,
                radius: Math.random() * 3 + 2,
                color: this.colors[Math.floor(Math.random() * this.colors.length)]
            });
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    handleResize() {
        window.addEventListener('resize', () => {
            this.resize();
            this.init();
        });
    }

    handleMouseMove() {
        if (window.innerWidth > 768) {
            window.addEventListener('mousemove', (e) => {
                this.mouse.x = e.x;
                this.mouse.y = e.y;
            });
            window.addEventListener('mouseout', () => {
                this.mouse.x = null;
                this.mouse.y = null;
            });
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw Edges first
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const dx = this.nodes[i].x - this.nodes[j].x;
                const dy = this.nodes[i].y - this.nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.maxDistance) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist / this.maxDistance * 0.8})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
                    this.ctx.lineTo(this.nodes[j].x, this.nodes[j].y);
                    this.ctx.stroke();
                }
            }
        }

        // Draw Nodes
        for (let node of this.nodes) {
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = node.color;
            
            // Subtle glow
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = node.color;
            
            this.ctx.fill();
            this.ctx.shadowBlur = 0;

            // Move
            node.x += node.vx;
            node.y += node.vy;

            // Mouse Repel
            if (this.mouse.x && window.innerWidth > 768) {
                const dx = node.x - this.mouse.x;
                const dy = node.y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < this.mouse.radius) {
                    const force = (this.mouse.radius - dist) / this.mouse.radius;
                    node.x += dx / dist * force * 2;
                    node.y += dy / dist * force * 2;
                }
            }

            // Boundary Check
            if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;
        }
    }

    animate() {
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    stop() {
        cancelAnimationFrame(this.animationId);
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    window.particleNetwork = new ParticleNetwork();
    
    // Visibility change handling to save performance
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            window.particleNetwork.stop();
        } else {
            window.particleNetwork.animate();
        }
    });
});
