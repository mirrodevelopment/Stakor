document.addEventListener('DOMContentLoaded', () => {
    // --- 0B. RESPONSIVE SIDEBAR-RIGHT POSITION RE-ORDERING ---
    function adjustSidebarPosition() {
        const isMobile = window.innerWidth <= 1024;
        const sidebarRight = document.querySelector('.sidebar-right');
        const aiRecCard = document.querySelector('.ai-rec-card');
        const aiAnalyzerCard = document.querySelector('.ai-analyzer-card');
        const stackBuilderCard = document.querySelector('.stack-builder-card');
        const healthUniverseSection = document.getElementById('health-universe');
        const mainContent = document.querySelector('.main-content');
        const appContainer = document.querySelector('.app-container');
        
        if (isMobile) {
            // Mobile positioning:
            // 1. Move ai-rec-card and ai-analyzer-card after the first section (before health-universe section)
            if (aiRecCard && healthUniverseSection && aiRecCard.parentNode !== mainContent) {
                mainContent.insertBefore(aiRecCard, healthUniverseSection);
            }
            if (aiAnalyzerCard && healthUniverseSection && aiAnalyzerCard.parentNode !== mainContent) {
                mainContent.insertBefore(aiAnalyzerCard, healthUniverseSection);
            }
            // 2. Move stack-builder-card after explore-section, before timeline-section
            const timelineSection = document.getElementById('insights');
            if (stackBuilderCard && timelineSection && stackBuilderCard.parentNode !== mainContent) {
                mainContent.insertBefore(stackBuilderCard, timelineSection);
            }
            
            // Hide the empty sidebar-right on mobile
            if (sidebarRight) {
                sidebarRight.style.display = 'none';
            }
        } else {
            // Desktop positioning: put them back in the sidebar-right in original order
            if (sidebarRight) {
                sidebarRight.style.display = '';
                if (aiRecCard && aiRecCard.parentNode !== sidebarRight) {
                    sidebarRight.appendChild(aiRecCard);
                }
                if (aiAnalyzerCard && aiAnalyzerCard.parentNode !== sidebarRight) {
                    sidebarRight.appendChild(aiAnalyzerCard);
                }
                if (stackBuilderCard && stackBuilderCard.parentNode !== sidebarRight) {
                    sidebarRight.appendChild(stackBuilderCard);
                }
            }
        }
    }
    window.addEventListener('resize', adjustSidebarPosition);
    adjustSidebarPosition();

    // --- 0C. INTERACTIVE MOUSE GLOW & PARALLAX FOR EDITORIAL HERO ---
    let targetTeaserMouseOffset = { x: 0, y: 0 };
    let teaserMouseOffset = { x: 0, y: 0 };
    let targetTeaserTiltOffset = 0;
    let teaserTiltOffset = 0;

    const editorialHero = document.querySelector('.editorial-intro');
    if (editorialHero) {
        editorialHero.addEventListener('mousemove', (e) => {
            const rect = editorialHero.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2; // relative to center
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Limit motion slightly (e.g. max 90px displacement)
            const dx = (x / (rect.width / 2)) * 90;
            const dy = (y / (rect.height / 2)) * 90;
            
            editorialHero.style.setProperty('--mx', `${dx}px`);
            editorialHero.style.setProperty('--my', `${dy}px`);
            
            // 3D parallax tilt effect (up to 12 degrees)
            const rotateX = -(y / rect.height) * 12;
            const rotateY = (x / rect.width) * 12;
            editorialHero.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            
            // Shifting drop shadow based on mouse angle
            const shadowX = -(x / (rect.width / 2)) * 18;
            const shadowY = -(y / (rect.height / 2)) * 18;
            editorialHero.style.boxShadow = `${shadowX}px ${shadowY}px 70px rgba(36, 72, 255, 0.16), 0 10px 30px rgba(8, 27, 75, 0.02), inset 0 1px 0 rgba(255, 255, 255, 0.9)`;
            
            // Pop children forward and slide slightly in X/Y for true depth
            const introLeft = editorialHero.querySelector('.intro-left');
            const introRight = editorialHero.querySelector('.intro-right');
            if (introLeft) {
                introLeft.style.transform = `translate3d(${dx * 0.15}px, ${dy * 0.15}px, 40px)`;
            }
            if (introRight) {
                introRight.style.transform = `translate3d(${dx * 0.3}px, ${dy * 0.3}px, 80px)`;
            }

            // Move glass bubbles reactively to mouse
            const bubbles = editorialHero.querySelectorAll('.glass-bubble');
            bubbles.forEach((bubble, idx) => {
                const depthMult = [ -0.4, 0.5, -0.2 ][idx] || 0.3;
                const zDepth = [ 110, 60, 90 ][idx] || 50;
                bubble.style.transform = `translate3d(${dx * depthMult}px, ${dy * depthMult}px, ${zDepth}px)`;
            });

            // Update holographic offset targets for teaser canvas
            targetTeaserMouseOffset.x = (x / rect.width) * 45; // max 45px offset
            targetTeaserMouseOffset.y = (y / rect.height) * 45;
            targetTeaserTiltOffset = -(y / rect.height) * 0.18; // tilt up to 0.18 deviation
        });
        
        editorialHero.addEventListener('mouseleave', () => {
            // Smoothly reset all transformations
            editorialHero.style.setProperty('--mx', '0px');
            editorialHero.style.setProperty('--my', '0px');
            editorialHero.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)';
            editorialHero.style.boxShadow = '';
            
            const introLeft = editorialHero.querySelector('.intro-left');
            const introRight = editorialHero.querySelector('.intro-right');
            if (introLeft) {
                introLeft.style.transform = 'translate3d(0, 0, 0)';
            }
            if (introRight) {
                introRight.style.transform = 'translate3d(0, 0, 0)';
            }

            const bubbles = editorialHero.querySelectorAll('.glass-bubble');
            bubbles.forEach((bubble) => {
                bubble.style.transform = 'translate3d(0, 0, 0)';
            });

            // Reset holographic offsets for teaser canvas
            targetTeaserMouseOffset.x = 0;
            targetTeaserMouseOffset.y = 0;
            targetTeaserTiltOffset = 0;
        });
    }

    // --- 0D. SLIDING HOVER PILL FOR NAVBAR (Apple Liquid Glass Effect) ---
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        let hoverPill = navLinks.querySelector('.nav-hover-pill');
        if (!hoverPill) {
            hoverPill = document.createElement('div');
            hoverPill.className = 'nav-hover-pill';
            navLinks.appendChild(hoverPill);
        }

        const links = navLinks.querySelectorAll('li');
        
        function positionPill(targetLi) {
            const rect = targetLi.getBoundingClientRect();
            const containerRect = navLinks.getBoundingClientRect();
            hoverPill.style.width = `${rect.width}px`;
            hoverPill.style.left = `${rect.left - containerRect.left}px`;
            hoverPill.style.opacity = '1';
        }

        function resetPill() {
            const activeLi = navLinks.querySelector('.nav-active');
            if (activeLi) {
                positionPill(activeLi);
            } else {
                hoverPill.style.opacity = '0';
                hoverPill.style.width = '0px';
            }
        }

        links.forEach(li => {
            li.addEventListener('mouseenter', () => {
                positionPill(li);
            });
        });

        navLinks.addEventListener('mouseleave', () => {
            resetPill();
        });

        setTimeout(resetPill, 150);
        window.addEventListener('resize', resetPill);
    }

    // Function to hide Spline branding logo in shadow DOM
    function hideSplineLogo(viewer) {
        if (viewer && viewer.shadowRoot) {
            if (!viewer.shadowRoot.querySelector('#hide-logo-style')) {
                const style = document.createElement('style');
                style.id = 'hide-logo-style';
                style.textContent = `
                    #logo {
                        display: none !important;
                        visibility: hidden !important;
                        opacity: 0 !important;
                        pointer-events: none !important;
                    }
                `;
                viewer.shadowRoot.appendChild(style);
            }
            const logo = viewer.shadowRoot.querySelector('#logo');
            if (logo) {
                logo.style.display = 'none';
            }
        }
    }

    // Remove the Spline logo watermark from all spline-viewer shadow DOMs on the page
    let splineLogoAttempts = 0;
    const globalSplineLogoInterval = setInterval(() => {
        const viewers = document.querySelectorAll('spline-viewer');
        viewers.forEach(v => {
            hideSplineLogo(v);
        });
        splineLogoAttempts++;
        if (splineLogoAttempts > 150) {
            clearInterval(globalSplineLogoInterval);
        }
    }, 100);

    // --- 1. HEALTH SCORE RING ANIMATION ---
    const targetScore = 87;
    const maxOffset = 264; // matches stroke-dasharray

    setTimeout(() => {
        const scoreCircles = document.querySelectorAll('.ring-progress');
        const scoreNumbers = document.querySelectorAll('.score-number');

        scoreCircles.forEach(circle => {
            const offset = maxOffset - (maxOffset * targetScore) / 100;
            circle.style.strokeDashoffset = offset;
        });

        // Animate counter
        let count = 0;
        const countInterval = setInterval(() => {
            if (count >= targetScore) {
                clearInterval(countInterval);
            } else {
                count++;
                scoreNumbers.forEach(num => {
                    num.textContent = count;
                });
            }
        }, 15);
    }, 500);

    // --- 2. PROGRESS BARS SLIDE ANIMATION ---
    const progressFills = document.querySelectorAll('.progress-bar-fill');
    setTimeout(() => {
        progressFills.forEach(fill => {
            const targetVal = fill.getAttribute('data-target');
            fill.style.width = targetVal + '%';
        });
    }, 600);

    // --- 3. GLASS ORB CANVAS SIMULATION ---
    const canvas = document.getElementById('orb-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = canvas.offsetWidth;
        let height = canvas.height = canvas.offsetHeight;

        window.addEventListener('resize', () => {
            if (canvas.offsetWidth > 0) {
                width = canvas.width = canvas.offsetWidth;
                height = canvas.height = canvas.offsetHeight;
            }
        });

        // Simulating floating glowing blobs inside the orb
        class GlowBlob {
            constructor(x, y, radius, color, speedX, speedY) {
                this.x = x;
                this.y = y;
                this.radius = radius;
                this.color = color;
                this.speedX = speedX;
                this.speedY = speedY;
                this.angle = Math.random() * Math.PI * 2;
            }

            update() {
                this.angle += 0.01;
                this.x += this.speedX + Math.sin(this.angle) * 0.2;
                this.y += this.speedY + Math.cos(this.angle) * 0.2;

                // Bounce boundaries
                if (this.x - this.radius < 0 || this.x + this.radius > width) this.speedX *= -1;
                if (this.y - this.radius < 0 || this.y + this.radius > height) this.speedY *= -1;
            }

            draw() {
                const gradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.radius
                );
                gradient.addColorStop(0, this.color);
                gradient.addColorStop(1, 'rgba(36, 72, 255, 0)');

                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
            }
        }

        const blobs = [
            new GlowBlob(width * 0.3, height * 0.4, 35, 'rgba(36, 72, 255, 0.4)', 0.3, -0.2),
            new GlowBlob(width * 0.6, height * 0.5, 40, 'rgba(99, 102, 241, 0.35)', -0.2, 0.3),
            new GlowBlob(width * 0.5, height * 0.3, 30, 'rgba(6, 182, 212, 0.3)', 0.15, 0.15)
        ];

        function animateOrb() {
            ctx.clearRect(0, 0, width, height);
            
            // Draw background glow
            ctx.fillStyle = 'rgba(244, 245, 247, 0.1)';
            ctx.fillRect(0, 0, width, height);

            blobs.forEach(blob => {
                blob.update();
                blob.draw();
            });

            requestAnimationFrame(animateOrb);
        }
        animateOrb();
    }

    // --- 3B. PREMIUM TEASER CANVAS VISUALIZATION ---
    const teaserCanvas = document.getElementById('teaser-canvas');
    if (teaserCanvas) {
        const tCtx = teaserCanvas.getContext('2d');
        let tWidth = teaserCanvas.width = teaserCanvas.offsetWidth || 400;
        let tHeight = teaserCanvas.height = teaserCanvas.offsetHeight || 400;

        window.addEventListener('resize', () => {
            if (teaserCanvas.offsetWidth > 0) {
                tWidth = teaserCanvas.width = teaserCanvas.offsetWidth;
                tHeight = teaserCanvas.height = teaserCanvas.offsetHeight;
            }
        });

        // Particle class for orbiting rings
        class TeaserParticle {
            constructor(angle, radius, speed, size, color) {
                this.angle = angle;
                this.radius = radius;
                this.speed = speed;
                this.size = size;
                this.color = color;
            }

            update() {
                this.angle += this.speed;
            }

            draw(centerX, centerY, currentTilt = 0.35) {
                // Project tilted to look 3D
                const x = centerX + Math.cos(this.angle) * this.radius;
                const y = centerY + Math.sin(this.angle) * this.radius * currentTilt; // tilt

                tCtx.beginPath();
                tCtx.arc(x, y, this.size, 0, Math.PI * 2);
                tCtx.fillStyle = this.color;
                tCtx.shadowBlur = 10;
                tCtx.shadowColor = this.color;
                tCtx.fill();
                tCtx.shadowBlur = 0; // reset
            }
        }

        const teaserParticles = [];
        const teaserColors = ['#2448FF', '#6366F1', '#10B981', '#06B6D4', '#7C3AED', '#FF8A00'];
        
        // Populate particles in 3 concentric/tilted rings
        for (let rIdx = 0; rIdx < 3; rIdx++) {
            const radius = 90 + rIdx * 25;
            const pCount = 15 + rIdx * 8;
            const speed = (0.005 - rIdx * 0.001) * (rIdx % 2 === 0 ? 1 : -1);
            
            for (let i = 0; i < pCount; i++) {
                const angle = (i / pCount) * Math.PI * 2 + Math.random() * 0.2;
                const size = 1.2 + Math.random() * 1.5;
                const color = teaserColors[(i + rIdx) % teaserColors.length];
                teaserParticles.push(new TeaserParticle(angle, radius, speed, size, color));
            }
        }

        let pulseTime = 0;
        function animateTeaser() {
            tCtx.clearRect(0, 0, tWidth, tHeight);
            pulseTime += 0.012;

            // Smoothly interpolate mouse offsets for organic float
            teaserMouseOffset.x += (targetTeaserMouseOffset.x - teaserMouseOffset.x) * 0.08;
            teaserMouseOffset.y += (targetTeaserMouseOffset.y - teaserMouseOffset.y) * 0.08;
            teaserTiltOffset += (targetTeaserTiltOffset - teaserTiltOffset) * 0.08;

            const centerX = tWidth / 2 + teaserMouseOffset.x;
            const centerY = tHeight / 2 + Math.sin(pulseTime * 0.8) * 8 + teaserMouseOffset.y;
            const currentTilt = 0.35 + teaserTiltOffset;

            // Draw glowing core halo layers
            for (let i = 4; i > 0; i--) {
                const radius = (35 + Math.sin(pulseTime * 1.5) * 3) * i * 0.5;
                const opacity = 0.07 / i;
                const grad = tCtx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
                grad.addColorStop(0, `rgba(36, 72, 255, ${opacity * 4})`);
                grad.addColorStop(0.5, `rgba(99, 102, 241, ${opacity * 2})`);
                grad.addColorStop(1, 'rgba(36, 72, 255, 0)');

                tCtx.beginPath();
                tCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                tCtx.fillStyle = grad;
                tCtx.fill();
            }

            // Draw central solid glass core
            const coreGrad = tCtx.createRadialGradient(
                centerX - 6, centerY - 6, 2,
                centerX, centerY, 28
            );
            coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
            coreGrad.addColorStop(0.2, 'rgba(240, 244, 255, 0.8)');
            coreGrad.addColorStop(0.7, 'rgba(36, 72, 255, 0.18)');
            coreGrad.addColorStop(1, 'rgba(36, 72, 255, 0.08)');

            tCtx.beginPath();
            tCtx.arc(centerX, centerY, 28, 0, Math.PI * 2);
            tCtx.fillStyle = coreGrad;
            tCtx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
            tCtx.lineWidth = 1;
            tCtx.stroke();
            tCtx.fill();

            // Draw orbit line paths
            tCtx.strokeStyle = 'rgba(36, 72, 255, 0.08)';
            tCtx.lineWidth = 1;
            for (let rIdx = 0; rIdx < 3; rIdx++) {
                const radius = 90 + rIdx * 25;
                tCtx.beginPath();
                tCtx.ellipse(centerX, centerY, radius, radius * currentTilt, 0, 0, Math.PI * 2);
                tCtx.stroke();
            }

            // Update & Draw particles
            teaserParticles.forEach(p => {
                p.update();
                p.draw(centerX, centerY, currentTilt);
            });

            requestAnimationFrame(animateTeaser);
        }
        animateTeaser();
    }

    // --- 3C. INTERACTIVE SMOOTH SCROLL ---
    const scrollBtn = document.getElementById('scroll-to-universe');
    if (scrollBtn) {
        scrollBtn.addEventListener('click', () => {
            const universeSection = document.getElementById('health-universe');
            if (universeSection) {
                universeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    // --- 4. THREE.JS HOLOGRAM VIEWPORT NAVIGATION & 3D Anatomy ---
    let clickedDimension = null;
    let targetCameraY = 0;
    let targetCameraZ = 3.5;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let currentYRotation = 0;
    let currentXRotation = 0;
    let velocityY = 0.005; // initial rotation drift
    let velocityX = 0;
    let autoRotateMode = true;

    // --- ADAPTIVE LAYOUT SYSTEM STATE ---
    let currentViewMode = 'focus'; // 'dashboard' | 'focus'
    let healthScoreClone = null;
    let currentOrbitRadius = 2.1;
    let targetOrbitRadius = 2.1;
    let targetModelScale = 1.35;
    let currentModelScale = 1.35;

    const viewModeScales = {
        dashboard: { cameraZ: 4.0, orbitRadius: 1.75, modelScale: 1.0 },
        focus:     { cameraZ: 3.5, orbitRadius: 2.1,  modelScale: 1.35 }
    };

    let currentProfile = 'male';
    let activeGoal = 'none';
    let chatOpen = false;

    const activeSystems = {
        sleep: false,
        recovery: false,
        immunity: false,
        energy: false,
        metabolism: false,
        foundation: false,
        performance: false,
        strength: false,
        longevity: false,
        balance: false,
        hormonal: false,
        wellness: false
    };

    let activeStack = [null, null, null, null]; // holds product IDs in slots

    const orbitPositions = [
        { theta: Math.PI * 0.18, phi: 0.35 * Math.PI },      // Upper right
        { theta: Math.PI * 0.48, phi: 0.50 * Math.PI },       // Far right
        { theta: Math.PI * 0.76, phi: 0.65 * Math.PI },       // Lower right
        { theta: Math.PI * 1.24, phi: 0.62 * Math.PI },       // Lower left
        { theta: Math.PI * 1.52, phi: 0.48 * Math.PI },       // Mid left
        { theta: Math.PI * 1.82, phi: 0.35 * Math.PI }        // Upper left
    ];

    const profiles = {
        unisex: {
            dimensions: [
                { id: 'sleep', title: 'SLEEP', icon: 'moon', meta: 'Daily Rest', orbiting: true, orbitIdx: 0, baseVal: 72 },
                { id: 'recovery', title: 'RECOVERY', icon: 'award', meta: '1 Product', orbiting: true, orbitIdx: 1, baseVal: 68 },
                { id: 'immunity', title: 'IMMUNITY', icon: 'shield', meta: 'System Support', orbiting: true, orbitIdx: 5, baseVal: 76 },
                { id: 'energy', title: 'ENERGY', icon: 'zap', meta: '2 Products', orbiting: true, orbitIdx: 4, baseVal: 81 },
                { id: 'metabolism', title: 'METABOLISM', icon: 'activity', meta: '2 Products', orbiting: true, orbitIdx: 2, baseVal: 69 },
                { id: 'foundation', title: 'FOUNDATION', icon: 'layers', meta: '1 Product', orbiting: false, baseVal: 63 }
            ],
            aiRecText: "Recommended for sleep, immunity and long-term wellness.",
            healthScoreBase: 87,
            productsFilter: ['p1', 'p2', 'p3', 'p4']
        },
        male: {
            dimensions: [
                { id: 'performance', title: 'PERFORMANCE', icon: 'rocket', meta: '1 Product', orbiting: true, orbitIdx: 0, baseVal: 76 },
                { id: 'recovery', title: 'RECOVERY', icon: 'award', meta: '1 Product', orbiting: true, orbitIdx: 1, baseVal: 68 },
                { id: 'strength', title: 'STRENGTH', icon: 'dumbbell', meta: '1 Product', orbiting: true, orbitIdx: 2, baseVal: 74 },
                { id: 'energy', title: 'ENERGY', icon: 'zap', meta: '2 Products', orbiting: true, orbitIdx: 3, baseVal: 81 },
                { id: 'metabolism', title: 'METABOLISM', icon: 'activity', meta: '2 Products', orbiting: true, orbitIdx: 4, baseVal: 69 },
                { id: 'longevity', title: 'LONGEVITY', icon: 'shield-alert', meta: '1 Product', orbiting: true, orbitIdx: 5, baseVal: 70 }
            ],
            aiRecText: "Recommended for recovery, strength and energy.",
            healthScoreBase: 85,
            productsFilter: ['p1', 'p2', 'p3', 'p4']
        },
        female: {
            dimensions: [
                { id: 'balance', title: 'BALANCE', icon: 'scale', meta: '1 Product', orbiting: true, orbitIdx: 0, baseVal: 63 },
                { id: 'recovery', title: 'RECOVERY', icon: 'award', meta: '1 Product', orbiting: true, orbitIdx: 1, baseVal: 68 },
                { id: 'energy', title: 'ENERGY', icon: 'zap', meta: '2 Products', orbiting: true, orbitIdx: 2, baseVal: 81 },
                { id: 'hormonal', title: 'HORMONAL', icon: 'droplet', meta: '1 Product', orbiting: true, orbitIdx: 3, baseVal: 75 },
                { id: 'metabolism', title: 'METABOLISM', icon: 'activity', meta: '2 Products', orbiting: true, orbitIdx: 4, baseVal: 69 },
                { id: 'wellness', title: 'WELLNESS', icon: 'heart', meta: '2 Products', orbiting: true, orbitIdx: 5, baseVal: 78 }
            ],
            aiRecText: "Recommended for hormonal balance, recovery and daily vitality.",
            healthScoreBase: 88,
            productsFilter: ['p1', 'p2', 'p3', 'p4', 'p5']
        }
    };

    // Programmatic Wireframe & Glass Anatomical Human Generator
    function createAnatomicalModel() {
        const mainGroup = new THREE.Group();

        // --- 0. 360-DEGREE SCAN SYSTEM SPRITE ---
        const textureLoader = new THREE.TextureLoader();
        const bodyTextures = {
            0: textureLoader.load('/images/human(1).png'),
            60: textureLoader.load('/images/human(2).png'),
            90: textureLoader.load('/images/human(3).png'),
            135: textureLoader.load('/images/human(4).png'),
            180: textureLoader.load('/images/human(5).png'),
            225: textureLoader.load('/images/human(6).png'),
            270: textureLoader.load('/images/human(7).png')
        };

        const bodyPlaneGeom = new THREE.PlaneGeometry(2.1, 3.15);
        const bodyPlaneMat = new THREE.ShaderMaterial({
            uniforms: {
                map: { value: bodyTextures[0] },
                opacity: { value: 0.78 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D map;
                uniform float opacity;
                varying vec2 vUv;
                void main() {
                    vec4 texelColor = texture2D(map, vUv);
                    float brightness = max(texelColor.r, max(texelColor.g, texelColor.b));
                    float alpha = smoothstep(0.04, 0.15, brightness);
                    if (alpha < 0.01) {
                        discard;
                    }
                    gl_FragColor = vec4(texelColor.rgb, texelColor.a * alpha * opacity);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
            blending: THREE.NormalBlending
        });
        const bodyPlane = new THREE.Mesh(bodyPlaneGeom, bodyPlaneMat);
        bodyPlane.position.set(0, 0.085, 0);
        bodyPlane.visible = false; // Hide body textures silhouette
        mainGroup.add(bodyPlane);
        
        // --- 1. SKELETON & GLASS SKIN SHELL ---
        const skinGroup = new THREE.Group();
        mainGroup.add(skinGroup);
        
        const skinMat = new THREE.MeshBasicMaterial({
            color: 0x2448FF,
            transparent: true,
            opacity: 0.065,
            blending: THREE.AdditiveBlending
        });
        
        const skinOutlineMat = new THREE.MeshBasicMaterial({
            color: 0x2448FF,
            transparent: true,
            opacity: 0.12,
            wireframe: true,
            blending: THREE.AdditiveBlending
        });
        
        // Programmatic body geometries
        const parts = [
            { id: 'head', geom: new THREE.SphereGeometry(0.25, 12, 12), pos: [0, 1.45, 0] }, // Head
            { id: 'neck', geom: new THREE.CylinderGeometry(0.08, 0.09, 0.18, 8), pos: [0, 1.25, 0] }, // Neck
            { id: 'chest', geom: new THREE.CylinderGeometry(0.22, 0.18, 0.5, 8), pos: [0, 0.95, 0] }, // Chest
            { id: 'abdomen', geom: new THREE.CylinderGeometry(0.18, 0.20, 0.38, 8), pos: [0, 0.51, 0] }, // Abdomen
            { id: 'pelvis', geom: new THREE.CylinderGeometry(0.20, 0.15, 0.3, 8), pos: [0, 0.17, 0] }, // Pelvis
            
            // Left Arm
            { id: 'l_shoulder', geom: new THREE.SphereGeometry(0.06, 6, 6), pos: [0.28, 1.15, 0] }, // shoulder
            { id: 'l_arm_up', geom: new THREE.CylinderGeometry(0.06, 0.05, 0.35, 8), pos: [0.38, 0.95, 0], rot: [0, 0, -0.3] }, // upper arm
            { id: 'l_elbow', geom: new THREE.SphereGeometry(0.05, 6, 6), pos: [0.47, 0.76, 0] }, // elbow
            { id: 'l_arm_fore', geom: new THREE.CylinderGeometry(0.05, 0.045, 0.32, 8), pos: [0.55, 0.58, 0], rot: [0, 0, -0.25] }, // forearm
            { id: 'l_wrist', geom: new THREE.SphereGeometry(0.04, 6, 6), pos: [0.62, 0.42, 0] }, // wrist
            
            // Right Arm
            { id: 'r_shoulder', geom: new THREE.SphereGeometry(0.06, 6, 6), pos: [-0.28, 1.15, 0] }, // shoulder
            { id: 'r_arm_up', geom: new THREE.CylinderGeometry(0.06, 0.05, 0.35, 8), pos: [-0.38, 0.95, 0], rot: [0, 0, 0.3] }, // upper arm
            { id: 'r_elbow', geom: new THREE.SphereGeometry(0.05, 6, 6), pos: [-0.47, 0.76, 0] }, // elbow
            { id: 'r_arm_fore', geom: new THREE.CylinderGeometry(0.05, 0.045, 0.32, 8), pos: [-0.55, 0.58, 0], rot: [0, 0, 0.25] }, // forearm
            { id: 'r_wrist', geom: new THREE.SphereGeometry(0.04, 6, 6), pos: [-0.62, 0.42, 0] }, // wrist
            
            // Left Leg
            { id: 'l_hip', geom: new THREE.SphereGeometry(0.08, 6, 6), pos: [0.15, 0.02, 0] }, // hip
            { id: 'l_thigh', geom: new THREE.CylinderGeometry(0.095, 0.075, 0.6, 8), pos: [0.17, -0.28, 0] }, // thigh
            { id: 'l_knee', geom: new THREE.SphereGeometry(0.07, 6, 6), pos: [0.17, -0.58, 0] }, // knee
            { id: 'l_shin', geom: new THREE.CylinderGeometry(0.075, 0.05, 0.62, 8), pos: [0.17, -0.89, 0] }, // shin
            { id: 'l_foot', geom: new THREE.BoxGeometry(0.08, 0.06, 0.18), pos: [0.17, -1.22, 0.05] }, // foot
            
            // Right Leg
            { id: 'r_hip', geom: new THREE.SphereGeometry(0.08, 6, 6), pos: [-0.15, 0.02, 0] }, // hip
            { id: 'r_thigh', geom: new THREE.CylinderGeometry(0.095, 0.075, 0.6, 8), pos: [-0.17, -0.28, 0] }, // thigh
            { id: 'r_knee', geom: new THREE.SphereGeometry(0.07, 6, 6), pos: [-0.17, -0.58, 0] }, // knee
            { id: 'r_shin', geom: new THREE.CylinderGeometry(0.075, 0.05, 0.62, 8), pos: [-0.17, -0.89, 0] }, // shin
            { id: 'r_foot', geom: new THREE.BoxGeometry(0.08, 0.06, 0.18), pos: [-0.17, -1.22, 0.05] } // foot
        ];
        
        const skinMeshes = [];
        parts.forEach(part => {
            const mesh = new THREE.Mesh(part.geom, skinMat);
            const outline = new THREE.Mesh(part.geom, skinOutlineMat);
            
            mesh.name = part.id;
            outline.name = part.id + '_outline';
            
            mesh.position.set(...part.pos);
            outline.position.set(...part.pos);
            
            mesh.userData = { originalPos: [...part.pos], originalScale: [1, 1, 1], type: 'mesh' };
            outline.userData = { originalPos: [...part.pos], originalScale: [1, 1, 1], type: 'outline' };
            
            if (part.rot) {
                mesh.rotation.set(...part.rot);
                outline.rotation.set(...part.rot);
            }
            skinGroup.add(mesh);
            skinGroup.add(outline);
            
            skinMeshes.push(mesh, outline);
        });

        // --- 2. BIOLOGICAL SYSTEMS (High Detail) ---
        
        // -- NEURAL SYSTEM (Sleep / Purple-Violet) --
        const neuralGroup = new THREE.Group();
        mainGroup.add(neuralGroup);
        
        const neuralMat = new THREE.LineBasicMaterial({
            color: 0x7C3AED,
            transparent: true,
            opacity: 0.15,
            blending: THREE.AdditiveBlending
        });
        
        // Brain dense point cloud inside head
        const brainGeom = new THREE.BufferGeometry();
        const brainCount = 120;
        const brainVerts = new Float32Array(brainCount * 3);
        for (let i = 0; i < brainCount; i++) {
            const u = Math.random();
            const v = Math.random();
            const theta = u * 2.0 * Math.PI;
            const phi = Math.acos(2.0 * v - 1.0);
            const r = 0.18 * Math.cbrt(Math.random()); // sphere distribution
            brainVerts[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            brainVerts[i * 3 + 1] = 1.45 + r * Math.sin(phi) * Math.sin(theta);
            brainVerts[i * 3 + 2] = r * Math.cos(phi);
        }
        brainGeom.setAttribute('position', new THREE.BufferAttribute(brainVerts, 3));
        const brainMat = new THREE.PointsMaterial({
            color: 0x7C3AED,
            size: 0.018,
            transparent: true,
            opacity: 0.25,
            blending: THREE.AdditiveBlending
        });
        const brainPoints = new THREE.Points(brainGeom, brainMat);
        neuralGroup.add(brainPoints);
        
        // Spinal Cord Pathway
        const spineSpline = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 1.4, 0),
            new THREE.Vector3(0, 1.15, 0),
            new THREE.Vector3(0.015, 0.9, 0.02),
            new THREE.Vector3(-0.015, 0.6, -0.01),
            new THREE.Vector3(0, 0.3, 0.01),
            new THREE.Vector3(0, 0.05, 0)
        ]);
        const spineNeuralGeom = new THREE.BufferGeometry().setFromPoints(spineSpline.getPoints(40));
        const spineNeuralLine = new THREE.Line(spineNeuralGeom, neuralMat);
        neuralGroup.add(spineNeuralLine);
        
        // Branching Nerves (Arms & legs)
        const neuralPaths = [
            // Left Arm
            [0, 1.15, 0, 0.28, 1.15, 0, 0.38, 0.95, 0, 0.47, 0.76, 0, 0.62, 0.42, 0],
            // Right Arm
            [0, 1.15, 0, -0.28, 1.15, 0, -0.38, 0.95, 0, -0.47, 0.76, 0, -0.62, 0.42, 0],
            // Left Leg
            [0, 0.17, 0, 0.15, 0.02, 0, 0.17, -0.28, 0, 0.17, -0.58, 0, 0.17, -0.89, 0, 0.17, -1.22, 0.05],
            // Right Leg
            [0, 0.17, 0, -0.15, 0.02, 0, -0.17, -0.28, 0, -0.17, -0.58, 0, -0.17, -0.89, 0, -0.17, -1.22, 0.05]
        ];
        neuralPaths.forEach(pts => {
            const spline = new THREE.CatmullRomCurve3(
                pts.reduce((acc, _, i) => {
                    if (i % 3 === 0) acc.push(new THREE.Vector3(pts[i], pts[i+1], pts[i+2]));
                    return acc;
                }, [])
            );
            const geom = new THREE.BufferGeometry().setFromPoints(spline.getPoints(24));
            const line = new THREE.Line(geom, neuralMat);
            neuralGroup.add(line);
        });

        // Violet Head Aura (Sleep Aura Mesh - initially invisible)
        const headAuraGeom = new THREE.SphereGeometry(0.35, 16, 16);
        const headAuraMat = new THREE.MeshBasicMaterial({
            color: 0x7C3AED,
            transparent: true,
            opacity: 0.0,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending
        });
        const headAuraMesh = new THREE.Mesh(headAuraGeom, headAuraMat);
        headAuraMesh.position.set(0, 1.45, 0);
        neuralGroup.add(headAuraMesh);

        // -- JOINT RECOVERY (Recovery / Indigo-Blue) --
        const jointGroup = new THREE.Group();
        mainGroup.add(jointGroup);
        
        const jointMat = new THREE.MeshBasicMaterial({
            color: 0x6366F1,
            transparent: true,
            opacity: 0.22,
            wireframe: true,
            blending: THREE.AdditiveBlending
        });
        
        const jointPositions = [
            new THREE.Vector3(0.28, 1.15, 0), new THREE.Vector3(-0.28, 1.15, 0), // shoulders
            new THREE.Vector3(0.47, 0.76, 0), new THREE.Vector3(-0.47, 0.76, 0), // elbows
            new THREE.Vector3(0.62, 0.42, 0), new THREE.Vector3(-0.62, 0.42, 0), // wrists
            new THREE.Vector3(0.15, 0.02, 0), new THREE.Vector3(-0.15, 0.02, 0), // hips
            new THREE.Vector3(0.17, -0.58, 0), new THREE.Vector3(-0.17, -0.58, 0), // knees
            new THREE.Vector3(0.17, -0.89, 0), new THREE.Vector3(-0.17, -0.89, 0) // ankles
        ];
        
        const jointSpheres = [];
        jointPositions.forEach(pos => {
            const geom = new THREE.SphereGeometry(0.045, 8, 8);
            const mesh = new THREE.Mesh(geom, jointMat.clone());
            mesh.position.copy(pos);
            jointGroup.add(mesh);
            jointSpheres.push(mesh);
        });

        // -- MUSCLE GROUPS (Energy / Orange) --
        const muscleGroup = new THREE.Group();
        mainGroup.add(muscleGroup);
        
        const muscleMat = new THREE.LineBasicMaterial({
            color: 0xFF8A00,
            transparent: true,
            opacity: 0.15,
            blending: THREE.AdditiveBlending
        });
        
        const muscleFibers = [
            // Chest Pectorals left
            [0.02, 1.05, 0.12, 0.2, 1.0, 0.08],
            [0.02, 0.95, 0.12, 0.2, 0.9, 0.08],
            [0.02, 0.85, 0.11, 0.18, 0.8, 0.07],
            // Chest Pectorals right
            [-0.02, 1.05, 0.12, -0.2, 1.0, 0.08],
            [-0.02, 0.95, 0.12, -0.2, 0.9, 0.08],
            [-0.02, 0.85, 0.11, -0.18, 0.8, 0.07],
            // Abs vertical
            [0.05, 0.65, 0.15, 0.05, 0.35, 0.13],
            [0.10, 0.65, 0.14, 0.10, 0.35, 0.12],
            [-0.05, 0.65, 0.15, -0.05, 0.35, 0.13],
            [-0.10, 0.65, 0.14, -0.10, 0.35, 0.12],
            // Thighs
            [0.13, -0.15, 0.07, 0.14, -0.5, 0.06],
            [0.20, -0.15, 0.05, 0.20, -0.5, 0.04],
            [-0.13, -0.15, 0.07, -0.14, -0.5, 0.06],
            [-0.20, -0.15, 0.05, -0.20, -0.5, 0.04]
        ];
        muscleFibers.forEach(pts => {
            const geom = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
            const line = new THREE.Line(geom, muscleMat);
            muscleGroup.add(line);
        });
        
        // -- CARDIOVASCULAR (Foundation / Royal Blue/Red) --
        const cardioGroup = new THREE.Group();
        mainGroup.add(cardioGroup);
        
        // Pulsing Heart Core
        const heartMat = new THREE.MeshBasicMaterial({
            color: 0xEF4444,
            transparent: true,
            opacity: 0.25,
            wireframe: true,
            blending: THREE.AdditiveBlending
        });
        const heartGeom = new THREE.SphereGeometry(0.065, 8, 8);
        const heartMesh = new THREE.Mesh(heartGeom, heartMat);
        heartMesh.position.set(0, 0.95, 0.06);
        cardioGroup.add(heartMesh);
        
        // Red arteries / Blue veins side-by-side
        const arteryMat = new THREE.LineBasicMaterial({ color: 0xEF4444, transparent: true, opacity: 0.16 });
        const veinMat = new THREE.LineBasicMaterial({ color: 0x2448FF, transparent: true, opacity: 0.16 });
        
        const circulatoryLines = [
            // Spine parallel
            { pts: [0.02, 1.2, 0.02, 0.02, 0.1, 0.02], mat: arteryMat },
            { pts: [-0.02, 1.2, 0.02, -0.02, 0.1, 0.02], mat: veinMat },
            // Left Arm
            { pts: [0.02, 0.95, 0.02, 0.28, 1.15, 0, 0.47, 0.76, 0, 0.62, 0.42, 0], mat: arteryMat },
            // Right Arm
            { pts: [-0.02, 0.95, 0.02, -0.28, 1.15, 0, -0.47, 0.76, 0, -0.62, 0.42, 0], mat: veinMat },
            // Left Leg
            { pts: [0.02, 0.17, 0.02, 0.17, -0.28, 0, 0.17, -0.89, 0], mat: arteryMat },
            // Right Leg
            { pts: [-0.02, 0.17, 0.02, -0.17, -0.28, 0, -0.17, -0.89, 0], mat: veinMat }
        ];
        
        circulatoryLines.forEach(c => {
            const spline = new THREE.CatmullRomCurve3(
                c.pts.reduce((acc, _, i) => {
                    if (i % 3 === 0) acc.push(new THREE.Vector3(c.pts[i], c.pts[i+1], c.pts[i+2]));
                    return acc;
                }, [])
            );
            const geom = new THREE.BufferGeometry().setFromPoints(spline.getPoints(16));
            const line = new THREE.Line(geom, c.mat);
            cardioGroup.add(line);
        });
        
        // -- LYMPH NODES (Immunity / Green) --
        const lymphGroup = new THREE.Group();
        mainGroup.add(lymphGroup);
        
        const lymphMat = new THREE.MeshBasicMaterial({
            color: 0x10B981,
            transparent: true,
            opacity: 0.22,
            blending: THREE.AdditiveBlending
        });
        
        const lymphNodes = [
            new THREE.Vector3(0.08, 1.25, 0.04), new THREE.Vector3(-0.08, 1.25, 0.04), // neck
            new THREE.Vector3(0.24, 1.05, 0.04), new THREE.Vector3(-0.24, 1.05, 0.04), // armpits
            new THREE.Vector3(0.12, 0.12, 0.05), new THREE.Vector3(-0.12, 0.12, 0.05),  // groin
            new THREE.Vector3(0.06, 0.52, 0.08), new THREE.Vector3(-0.06, 0.52, 0.08)   // belly
        ];
        lymphNodes.forEach(pos => {
            const geom = new THREE.SphereGeometry(0.026, 6, 6);
            const mesh = new THREE.Mesh(geom, lymphMat);
            mesh.position.copy(pos);
            lymphGroup.add(mesh);
        });
        
        // -- METABOLISM (Digestive Helix / Cyan) --
        const metabolismGroup = new THREE.Group();
        mainGroup.add(metabolismGroup);
        
        // Double helix representing active intestinal metabolism
        const p1 = [];
        const p2 = [];
        for (let theta = 0; theta < Math.PI * 6; theta += 0.18) {
            const r = 0.12 * (1 - (theta / (Math.PI * 9))); // taper downwards
            const y = 0.52 - (theta / (Math.PI * 6)) * 0.36;
            p1.push(new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r));
            p2.push(new THREE.Vector3(Math.cos(theta + Math.PI) * r, y, Math.sin(theta + Math.PI) * r));
        }
        
        const digestiveSpline1 = new THREE.CatmullRomCurve3(p1);
        const digestiveSpline2 = new THREE.CatmullRomCurve3(p2);
        
        const digestiveGeom1 = new THREE.BufferGeometry().setFromPoints(digestiveSpline1.getPoints(60));
        const digestiveGeom2 = new THREE.BufferGeometry().setFromPoints(digestiveSpline2.getPoints(60));
        
        const digestiveMat = new THREE.LineBasicMaterial({
            color: 0x06B6D4,
            transparent: true,
            opacity: 0.18,
            blending: THREE.AdditiveBlending
        });
        
        const digestiveLine1 = new THREE.Line(digestiveGeom1, digestiveMat);
        const digestiveLine2 = new THREE.Line(digestiveGeom2, digestiveMat);
        
        metabolismGroup.add(digestiveLine1);
        metabolismGroup.add(digestiveLine2);
        
        // Store lines inside group for independent animation
        metabolismGroup.userData = { l1: digestiveLine1, l2: digestiveLine2 };

        // --- 3. FUTURISTIC GLASS PEDESTAL ---
        const pedestalGroup = new THREE.Group();
        mainGroup.add(pedestalGroup);
        
        const pedestalMat1 = new THREE.MeshBasicMaterial({
            color: 0x2448FF,
            transparent: true,
            opacity: 0.1,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });
        
        const pedestalMat2 = new THREE.MeshBasicMaterial({
            color: 0x2448FF,
            transparent: true,
            opacity: 0.2,
            wireframe: true,
            blending: THREE.AdditiveBlending
        });
        
        // Disk 1 (Outer)
        const disk1Geom = new THREE.CylinderGeometry(0.72, 0.75, 0.03, 24);
        const disk1 = new THREE.Mesh(disk1Geom, pedestalMat1);
        disk1.position.y = -1.42;
        pedestalGroup.add(disk1);
        
        // Disk 2 (Inner, elevated)
        const disk2Geom = new THREE.CylinderGeometry(0.52, 0.54, 0.03, 24);
        const disk2 = new THREE.Mesh(disk2Geom, pedestalMat1);
        disk2.position.y = -1.36;
        pedestalGroup.add(disk2);
        
        const disk2Outline = new THREE.Mesh(disk2Geom, pedestalMat2);
        disk2Outline.position.y = -1.36;
        pedestalGroup.add(disk2Outline);
        
        // Glowing base cylinder
        const baseProjGeom = new THREE.CylinderGeometry(0.32, 0.32, 0.08, 16);
        const baseProj = new THREE.Mesh(baseProjGeom, new THREE.MeshBasicMaterial({
            color: 0x2448FF,
            transparent: true,
            opacity: 0.08,
            blending: THREE.AdditiveBlending
        }));
        baseProj.position.y = -1.47;
        pedestalGroup.add(baseProj);
        
        // Rotating energy ring on the pedestal
        const baseEnergyGeom = new THREE.BufferGeometry();
        const energyVertices = [];
        const energyPointsCount = 50;
        for (let i = 0; i < energyPointsCount; i++) {
            const angle = (i / energyPointsCount) * Math.PI * 2;
            energyVertices.push(Math.cos(angle) * 0.48, -1.35, Math.sin(angle) * 0.48);
        }
        baseEnergyGeom.setAttribute('position', new THREE.Float32BufferAttribute(energyVertices, 3));
        const baseEnergyMat = new THREE.PointsMaterial({
            color: 0x2448FF,
            size: 0.02,
            transparent: true,
            opacity: 0.65,
            blending: THREE.AdditiveBlending
        });
        const baseEnergyPoints = new THREE.Points(baseEnergyGeom, baseEnergyMat);
        pedestalGroup.add(baseEnergyPoints);

        // --- 4. ADVANCED TILTED ORBITS ---
        const orbitGroup = new THREE.Group();
        mainGroup.add(orbitGroup);
        
        const orbitsData = [
            { radius: 1.2, tiltX: 0.3, tiltZ: 0.2, speed: 0.007, color: 0x2448FF, opacity: 0.18, count: 35 },
            { radius: 1.5, tiltX: -0.4, tiltZ: -0.15, speed: -0.005, color: 0x7C3AED, opacity: 0.14, count: 45 },
            { radius: 1.8, tiltX: 0.2, tiltZ: -0.5, speed: 0.004, color: 0x10B981, opacity: 0.12, count: 55 }
        ];
        
        const orbitParticles = [];
        orbitsData.forEach(orb => {
            // Ring Line
            const ringGeom = new THREE.BufferGeometry();
            const ringVerts = [];
            for (let i = 0; i <= 64; i++) {
                const angle = (i / 64) * Math.PI * 2;
                ringVerts.push(Math.cos(angle) * orb.radius, 0, Math.sin(angle) * orb.radius);
            }
            ringGeom.setAttribute('position', new THREE.Float32BufferAttribute(ringVerts, 3));
            
            const ringMat = new THREE.LineBasicMaterial({
                color: orb.color,
                transparent: true,
                opacity: orb.opacity,
                blending: THREE.AdditiveBlending
            });
            const ringLine = new THREE.Line(ringGeom, ringMat);
            ringLine.rotation.x = orb.tiltX;
            ringLine.rotation.z = orb.tiltZ;
            orbitGroup.add(ringLine);
            
            // Orbit particles
            const pGeom = new THREE.BufferGeometry();
            const pPositions = new Float32Array(orb.count * 3);
            const pAngles = [];
            for (let i = 0; i < orb.count; i++) {
                const angle = (i / orb.count) * Math.PI * 2 + Math.random() * 0.1;
                pAngles.push(angle);
                pPositions[i * 3] = Math.cos(angle) * orb.radius;
                pPositions[i * 3 + 1] = 0;
                pPositions[i * 3 + 2] = Math.sin(angle) * orb.radius;
            }
            pGeom.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
            const pMat = new THREE.PointsMaterial({
                color: orb.color,
                size: 0.02,
                transparent: true,
                opacity: 0.6,
                blending: THREE.AdditiveBlending
            });
            const pPoints = new THREE.Points(pGeom, pMat);
            pPoints.rotation.x = orb.tiltX;
            pPoints.rotation.z = orb.tiltZ;
            orbitGroup.add(pPoints);
            
            orbitParticles.push({
                points: pPoints,
                angles: pAngles,
                radius: orb.radius,
                speed: orb.speed
            });
        });

        // Floating Ambient Particles (Solar Dust)
        const ambientCount = 90;
        const ambientGeom = new THREE.BufferGeometry();
        const ambPositions = new Float32Array(ambientCount * 3);
        const ambVels = [];
        for (let i = 0; i < ambientCount; i++) {
            ambPositions[i * 3] = (Math.random() - 0.5) * 2.2;
            ambPositions[i * 3 + 1] = (Math.random() - 0.5) * 3.0;
            ambPositions[i * 3 + 2] = (Math.random() - 0.5) * 2.2;
            ambVels.push({
                x: (Math.random() - 0.5) * 0.003,
                y: Math.random() * 0.004 + 0.001,
                z: (Math.random() - 0.5) * 0.003
            });
        }
        ambientGeom.setAttribute('position', new THREE.BufferAttribute(ambPositions, 3));
        const ambMat = new THREE.PointsMaterial({
            color: 0x2448FF,
            size: 0.015,
            transparent: true,
            opacity: 0.35,
            blending: THREE.AdditiveBlending
        });
        const ambientPoints = new THREE.Points(ambientGeom, ambMat);
        mainGroup.add(ambientPoints);

        // --- 5. PROTECTIVE ENERGY SHIELD FORCEFIELD ---
        const shieldGeom = new THREE.IcosahedronGeometry(1.68, 2);
        const shieldMat = new THREE.MeshBasicMaterial({
            color: 0x10B981,
            transparent: true,
            opacity: 0.0,
            wireframe: true,
            blending: THREE.AdditiveBlending
        });
        const shieldMesh = new THREE.Mesh(shieldGeom, shieldMat);
        mainGroup.add(shieldMesh);

        return {
            mainGroup,
            skinGroup,
            neuralGroup,
            jointGroup,
            muscleGroup,
            cardioGroup,
            lymphGroup,
            metabolismGroup,
            heartMesh,
            jointSpheres,
            digestiveLines: [digestiveLine1, digestiveLine2],
            baseEnergyPoints,
            orbitParticles,
            ambientPoints,
            ambVels,
            ambientCount,
            headAuraMesh,
            shieldMesh,
            skinMeshes,
            bodyPlane,
            bodyTextures
        };
    }

    // Initialize WebGL Three.js Scene
    const hologramContainer = document.getElementById('hologram-3d-viewport');
    let modelObjects = null;
    let camera, scene, renderer;

    if (hologramContainer) {
        const width = hologramContainer.clientWidth || 400;
        const height = hologramContainer.clientHeight || 700;

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(0, 0, 3.5);

        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        hologramContainer.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0x2448FF, 0.85);
        directionalLight.position.set(2, 4, 5);
        scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0x7C3AED, 1.2, 10);
        pointLight.position.set(-2, 2, 2);
        scene.add(pointLight);

        modelObjects = createAnatomicalModel();
        scene.add(modelObjects.mainGroup);
        modelObjects.mainGroup.position.set(0, 0.15, 0); // vertically center full model shifted slightly up to avoid controls

        // Resize
        window.addEventListener('resize', () => {
            const w = hologramContainer.clientWidth;
            const h = hologramContainer.clientHeight;
            if (camera && renderer) {
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
                renderer.setSize(w, h);
            }

            // Adjust ThreeD targets on resize as well
            const isMobile = window.innerWidth <= 1024;
            const scales = viewModeScales[currentViewMode];
            if (scales) {
                targetCameraZ = isMobile ? scales.cameraZ + 0.65 : scales.cameraZ;
                targetOrbitRadius = isMobile ? scales.orbitRadius * 0.70 : scales.orbitRadius;
                targetModelScale = isMobile ? scales.modelScale * 0.70 : scales.modelScale;
            }
        });

        // Mouse Drag to Rotate
        hologramContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            autoRotateMode = false;
            previousMousePosition = { x: e.clientX, y: e.clientY };
            updateHUDControlsUI();
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;

            velocityY = deltaX * 0.005;
            velocityX = deltaY * 0.005;

            currentYRotation += velocityY;
            currentXRotation += velocityX;
            currentXRotation = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, currentXRotation));

            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Touch drag support
        hologramContainer.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                isDragging = true;
                autoRotateMode = false;
                previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                updateHUDControlsUI();
            }
        });

        window.addEventListener('touchmove', (e) => {
            if (!isDragging || e.touches.length !== 1) return;
            const deltaX = e.touches[0].clientX - previousMousePosition.x;
            const deltaY = e.touches[0].clientY - previousMousePosition.y;

            velocityY = deltaX * 0.005;
            velocityX = deltaY * 0.005;

            currentYRotation += velocityY;
            currentXRotation += velocityX;
            currentXRotation = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, currentXRotation));

            previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        });

        window.addEventListener('touchend', () => {
            isDragging = false;
        });

        // Wheel to Zoom
        hologramContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            targetCameraZ += e.deltaY * 0.003;
            targetCameraZ = Math.max(2.0, Math.min(6.0, targetCameraZ));
        }, { passive: false });
    }

    // Set up active glows on Three.js system groups
    function updateThreeJSSystems(states) {
        if (!modelObjects) return;
        
        const systemGroups = {
            neural: false,
            joint: false,
            muscle: false,
            lymph: false,
            metabolism: false,
            cardio: false
        };

        if (currentProfile === 'male') {
            if (states.performance || clickedDimension === 'performance') systemGroups.muscle = true;
            if (states.recovery || clickedDimension === 'recovery') systemGroups.joint = true;
            if (states.energy || clickedDimension === 'energy') systemGroups.cardio = true;
            if (states.strength || clickedDimension === 'strength') {
                systemGroups.muscle = true;
                systemGroups.joint = true;
            }
            if (states.metabolism || clickedDimension === 'metabolism') systemGroups.metabolism = true;
            if (states.longevity || clickedDimension === 'longevity') systemGroups.cardio = true;
        } else if (currentProfile === 'female') {
            if (states.balance || clickedDimension === 'balance') systemGroups.neural = true;
            if (states.recovery || clickedDimension === 'recovery') systemGroups.joint = true;
            if (states.energy || clickedDimension === 'energy') systemGroups.cardio = true;
            if (states.hormonal || clickedDimension === 'hormonal') {
                systemGroups.neural = true;
                systemGroups.lymph = true;
            }
            if (states.metabolism || clickedDimension === 'metabolism') systemGroups.metabolism = true;
            if (states.wellness || clickedDimension === 'wellness') {
                systemGroups.neural = true;
                systemGroups.cardio = true;
            }
        } else {
            // Unisex
            if (states.sleep || clickedDimension === 'sleep') systemGroups.neural = true;
            if (states.recovery || clickedDimension === 'recovery') systemGroups.joint = true;
            if (states.immunity || clickedDimension === 'immunity') systemGroups.lymph = true;
            if (states.energy || clickedDimension === 'energy') systemGroups.muscle = true;
            if (states.metabolism || clickedDimension === 'metabolism') systemGroups.metabolism = true;
            if (states.foundation || clickedDimension === 'foundation') systemGroups.cardio = true;
        }

        updateGroupAppearance(modelObjects.neuralGroup, systemGroups.neural, 0x7C3AED, 0xA78BFA);
        updateGroupAppearance(modelObjects.jointGroup, systemGroups.joint, 0x6366F1, 0x818CF8);
        updateGroupAppearance(modelObjects.muscleGroup, systemGroups.muscle, 0xFF8A00, 0xFBAF5D);
        updateGroupAppearance(modelObjects.lymphGroup, systemGroups.lymph, 0x10B981, 0x34D399);
        updateGroupAppearance(modelObjects.metabolismGroup, systemGroups.metabolism, 0x06B6D4, 0x22D3EE);
        updateGroupAppearance(modelObjects.cardioGroup, systemGroups.cardio, 0xEF4444, 0xFF5B7F);
        
        const anyActive = Object.values(systemGroups).some(v => v);
        modelObjects.skinGroup.traverse(child => {
            if (child.material) {
                child.material.opacity = anyActive ? 0.035 : 0.065;
                if (child.material.wireframe) {
                    child.material.opacity = anyActive ? 0.08 : 0.12;
                }
                child.material.needsUpdate = true;
            }
        });
    }

    function updateGroupAppearance(group, isActive, baseColorHex, activeColorHex) {
        group.traverse(child => {
            if (child.material) {
                child.material.transparent = true;
                if (child === modelObjects.headAuraMesh) return;
                
                const targetOpacity = isActive ? 0.95 : (child.isPoints ? 0.22 : 0.18);
                const targetColor = isActive ? activeColorHex : baseColorHex;
                
                child.material.color.setHex(targetColor);
                child.userData.targetOpacity = targetOpacity;
                child.material.needsUpdate = true;
            }
        });
    }

    function interpolateOpacities(group) {
        group.traverse(child => {
            if (child.material && child.userData.targetOpacity !== undefined && child !== modelObjects.headAuraMesh) {
                child.material.opacity += (child.userData.targetOpacity - child.material.opacity) * 0.08;
            }
        });
    }

    // Projected HTML Orbit Nodes Logic
    const orbitNodes = document.querySelectorAll('.orbit-node');
    const productCards = document.querySelectorAll('.product-card');
    const aiRecText = document.querySelector('.ai-rec-text');
    const aiRecOrbText = document.querySelector('.orb-text');

    const tempV = new THREE.Vector3();
    function updateOrbitNodesProjection() {
        if (!hologramContainer || !camera) return;

        const width = hologramContainer.clientWidth;
        const height = hologramContainer.clientHeight;

        const activeDims = profiles[currentProfile].dimensions;
        activeDims.forEach(dim => {
            const node = document.querySelector(`.orbit-node[data-dimension="${dim.id}"]`);
            if (!node) return;

            if (dim.orbiting) {
                const pos = orbitPositions[dim.orbitIdx];
                const theta = pos.theta + currentYRotation;
                const phi = pos.phi;
                const radius = (dim.id === 'sleep' || dim.id === 'immunity' || dim.id === 'longevity' || dim.id === 'wellness') ? currentOrbitRadius * 1.06 : currentOrbitRadius;

                tempV.setFromSphericalCoords(radius, phi, theta);
                tempV.y += 0.05;

                tempV.project(camera);

                const x = (tempV.x * 0.5 + 0.5) * width;
                const y = (-tempV.y * 0.5 + 0.5) * height;

                node.style.left = `${x}px`;
                node.style.top = `${y}px`;

                const depth = tempV.z;
                const opacity = Math.max(0.80, Math.min(1.0, 1.0 - (depth + 1.0) * 0.1));
                const scale = Math.max(0.82, Math.min(1.05, 1.02 - (depth + 1.0) * 0.09));

                node.style.opacity = opacity;

                if (depth > 0.05) {
                    node.style.zIndex = '1';
                    node.style.pointerEvents = 'none';
                } else {
                    node.style.zIndex = '5';
                    node.style.pointerEvents = 'auto';
                }

                if (node.classList.contains('active-dimension')) {
                    node.style.transform = `translate(-50%, -50%) scale(${scale * 1.06})`;
                } else {
                    node.style.transform = `translate(-50%, -50%) scale(${scale})`;
                }
            } else {
                tempV.set(0, -1.35, 0);
                tempV.project(camera);

                const x = (tempV.x * 0.5 + 0.5) * width;
                const y = (-tempV.y * 0.5 + 0.5) * height;

                node.style.left = `${x}px`;
                node.style.top = `${y}px`;
                node.style.zIndex = '6';
                node.style.opacity = '1.0';
                
                if (node.classList.contains('active-dimension')) {
                    node.style.transform = `translate(-50%, -50%) scale(1.05)`;
                } else {
                    node.style.transform = `translate(-50%, -50%) scale(0.95)`;
                }
            }
        });
    }

    function getMorphTargets(profileKey) {
        const targets = {};
        if (profileKey === 'male') {
            targets['chest'] = { scale: [1.32, 1.0, 1.25], pos: [0, 0.95, 0] };
            targets['abdomen'] = { scale: [0.95, 1.0, 0.95], pos: [0, 0.51, 0] };
            targets['pelvis'] = { scale: [0.90, 1.0, 0.90], pos: [0, 0.17, 0] };
            targets['l_shoulder'] = { scale: [1.15, 1.15, 1.15], pos: [0.34, 1.15, 0] };
            targets['r_shoulder'] = { scale: [1.15, 1.15, 1.15], pos: [-0.34, 1.15, 0] };
            targets['l_arm_up'] = { scale: [1.2, 1.0, 1.2], pos: [0.42, 0.95, 0] };
            targets['r_arm_up'] = { scale: [1.2, 1.0, 1.2], pos: [-0.42, 0.95, 0] };
            targets['l_thigh'] = { scale: [1.15, 1.0, 1.15], pos: [0.18, -0.28, 0] };
            targets['r_thigh'] = { scale: [1.15, 1.0, 1.15], pos: [-0.18, -0.28, 0] };
        } else if (profileKey === 'female') {
            targets['chest'] = { scale: [0.86, 1.0, 0.86], pos: [0, 0.92, 0] };
            targets['abdomen'] = { scale: [0.72, 1.0, 0.72], pos: [0, 0.49, 0] };
            targets['pelvis'] = { scale: [1.16, 1.0, 1.16], pos: [0, 0.16, 0] };
            targets['l_shoulder'] = { scale: [0.85, 0.85, 0.85], pos: [0.23, 1.10, 0] };
            targets['r_shoulder'] = { scale: [0.85, 0.85, 0.85], pos: [-0.23, 1.10, 0] };
            targets['l_arm_up'] = { scale: [0.85, 1.0, 0.85], pos: [0.32, 0.91, 0] };
            targets['r_arm_up'] = { scale: [0.85, 1.0, 0.85], pos: [-0.32, 0.91, 0] };
            targets['head'] = { scale: [0.95, 0.95, 0.95], pos: [0, 1.40, 0] };
            targets['neck'] = { scale: [0.85, 1.05, 0.85], pos: [0, 1.21, 0] };
        }
        return targets;
    }

    // Main animation frame loop
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        if (modelObjects) {
            // Smooth dynamic hologram silhouette morphing
            const targets = getMorphTargets(currentProfile);
            modelObjects.skinMeshes.forEach(mesh => {
                const id = mesh.name.replace('_outline', '');
                const target = targets[id] || { scale: [1, 1, 1], pos: mesh.userData.originalPos };
                
                // Interpolate scale
                mesh.scale.x += (target.scale[0] - mesh.scale.x) * 0.08;
                mesh.scale.y += (target.scale[1] - mesh.scale.y) * 0.08;
                mesh.scale.z += (target.scale[2] - mesh.scale.z) * 0.08;
                
                // Interpolate position
                mesh.position.x += (target.pos[0] - mesh.position.x) * 0.08;
                mesh.position.y += (target.pos[1] - mesh.position.y) * 0.08;
                mesh.position.z += (target.pos[2] - mesh.position.z) * 0.08;
            });

            interpolateOpacities(modelObjects.neuralGroup);
            interpolateOpacities(modelObjects.jointGroup);
            interpolateOpacities(modelObjects.muscleGroup);
            interpolateOpacities(modelObjects.lymphGroup);
            interpolateOpacities(modelObjects.metabolismGroup);
            interpolateOpacities(modelObjects.cardioGroup);

            // Rotate energy rings in pedestal base
            if (modelObjects.baseEnergyPoints) {
                modelObjects.baseEnergyPoints.rotation.y += 0.012;
            }

            // Animate advanced orbit particles along tilted paths
            modelObjects.orbitParticles.forEach(orbP => {
                const positions = orbP.points.geometry.attributes.position.array;
                for (let i = 0; i < orbP.angles.length; i++) {
                    orbP.angles[i] += orbP.speed;
                    positions[i * 3] = Math.cos(orbP.angles[i]) * orbP.radius;
                    positions[i * 3 + 2] = Math.sin(orbP.angles[i]) * orbP.radius;
                }
                orbP.points.geometry.attributes.position.needsUpdate = true;
            });

            // Float ambient particles gently upwards
            if (modelObjects.ambientPoints) {
                const positions = modelObjects.ambientPoints.geometry.attributes.position.array;
                for (let i = 0; i < modelObjects.ambientCount; i++) {
                    positions[i * 3] += modelObjects.ambVels[i].x;
                    positions[i * 3 + 1] += modelObjects.ambVels[i].y;
                    positions[i * 3 + 2] += modelObjects.ambVels[i].z;

                    if (positions[i * 3 + 1] > 1.8) {
                        positions[i * 3 + 1] = -1.4; // warp to base
                        positions[i * 3] = (Math.random() - 0.5) * 2.2;
                        positions[i * 3 + 2] = (Math.random() - 0.5) * 2.2;
                    }
                }
                modelObjects.ambientPoints.geometry.attributes.position.needsUpdate = true;
            }

            // Auto-rotation and dragging damping
            if (autoRotateMode) {
                currentYRotation += 0.0035;
            } else if (!isDragging) {
                currentYRotation += velocityY;
                currentXRotation += velocityX;
                velocityY *= 0.95;
                velocityX *= 0.95;
            }

            modelObjects.mainGroup.rotation.y = currentYRotation;
            modelObjects.mainGroup.rotation.x = currentXRotation;

            // Update 360-degree scan texture to match Y rotation angle
            if (modelObjects.bodyPlane && modelObjects.bodyTextures) {
                // Cancel group rotation on the plane so it behaves like a billboard
                modelObjects.bodyPlane.rotation.y = -currentYRotation;
                modelObjects.bodyPlane.rotation.x = -currentXRotation;

                // Normalize rotation angle
                let normalizedAngle = currentYRotation % (Math.PI * 2);
                if (normalizedAngle < 0) normalizedAngle += Math.PI * 2;
                let deg = (normalizedAngle * 180) / Math.PI;

                // Map to closest degrees among: 0, 60, 90, 135, 180, 225, 270
                const degreeKeys = [0, 60, 90, 135, 180, 225, 270];
                let closest = 0;
                let minDiff = Infinity;
                degreeKeys.forEach(k => {
                    let diff = Math.abs(deg - k);
                    if (diff > 180) diff = 360 - diff;
                    if (diff < minDiff) {
                        minDiff = diff;
                        closest = k;
                    }
                });

                if (modelObjects.bodyTextures[closest]) {
                    if (modelObjects.bodyPlane.material.uniforms && modelObjects.bodyPlane.material.uniforms.map) {
                        modelObjects.bodyPlane.material.uniforms.map.value = modelObjects.bodyTextures[closest];
                    } else {
                        modelObjects.bodyPlane.material.map = modelObjects.bodyTextures[closest];
                        modelObjects.bodyPlane.material.needsUpdate = true;
                    }
                }
            }

            // Circulatory heart beat core pulse
            if (modelObjects.heartMesh) {
                const isCardioActive = activeSystems.foundation || clickedDimension === 'foundation';
                const beatSpeed = isCardioActive ? 9.2 : 2.4;
                const beatScale = isCardioActive ? (1.0 + 0.22 * Math.sin(time * beatSpeed)) : (1.0 + 0.06 * Math.sin(time * beatSpeed));
                modelObjects.heartMesh.scale.set(beatScale, beatScale, beatScale);
                modelObjects.heartMesh.material.opacity = isCardioActive ? (0.6 + 0.4 * Math.sin(time * beatSpeed)) : 0.25;
            }

            // Recovery joint glow/pulse
            if (modelObjects.jointSpheres) {
                const isRecoveryActive = activeSystems.recovery || clickedDimension === 'recovery';
                const pulseScale = isRecoveryActive ? (1.0 + 0.20 * Math.sin(time * 6.0)) : 1.0;
                modelObjects.jointSpheres.forEach(sphere => {
                    sphere.scale.set(pulseScale, pulseScale, pulseScale);
                });
            }

            // Metabolic digestive helix speed animation
            if (modelObjects.digestiveLines) {
                const isMetabolismActive = activeSystems.metabolism || clickedDimension === 'metabolism';
                const rotationSpeed = isMetabolismActive ? 0.035 : 0.008;
                modelObjects.digestiveLines[0].rotation.y += rotationSpeed;
                modelObjects.digestiveLines[1].rotation.y += rotationSpeed;
            }

            // Sleep soft violet head aura animation
            if (modelObjects.headAuraMesh) {
                const isSleepActive = activeSystems.sleep || clickedDimension === 'sleep';
                const targetAuraOpacity = isSleepActive ? 0.45 : 0.0;
                modelObjects.headAuraMesh.material.opacity += (targetAuraOpacity - modelObjects.headAuraMesh.material.opacity) * 0.05;
                
                if (modelObjects.headAuraMesh.material.opacity > 0.01) {
                    const auraPulse = 1.0 + 0.15 * Math.sin(time * 3.5);
                    modelObjects.headAuraMesh.scale.set(auraPulse, auraPulse, auraPulse);
                }
            }

            // Daily essentials energy forcefield shield
            if (modelObjects.shieldMesh) {
                const isDailyStacked = activeStack.includes('p5');
                const targetShieldOpacity = isDailyStacked ? 0.22 : 0.0;
                modelObjects.shieldMesh.material.opacity += (targetShieldOpacity - modelObjects.shieldMesh.material.opacity) * 0.05;
                
                if (modelObjects.shieldMesh.material.opacity > 0.01) {
                    modelObjects.shieldMesh.rotation.y += 0.004;
                    modelObjects.shieldMesh.rotation.x += 0.002;
                    const shieldScale = 1.0 + 0.03 * Math.sin(time * 1.8);
                    modelObjects.shieldMesh.scale.set(shieldScale, shieldScale, shieldScale);
                }
            }

            // Camera shift interpolation
            camera.position.z += (targetCameraZ - camera.position.z) * 0.06;
            camera.position.y += (targetCameraY - camera.position.y) * 0.06;
            camera.lookAt(new THREE.Vector3(0, targetCameraY * 0.5, 0));

            // Adaptive Layout: Orbit radius interpolation
            currentOrbitRadius += (targetOrbitRadius - currentOrbitRadius) * 0.06;

            // Adaptive Layout: Model scale interpolation
            currentModelScale += (targetModelScale - currentModelScale) * 0.06;
            if (modelObjects && modelObjects.mainGroup) {
                modelObjects.mainGroup.scale.set(currentModelScale, currentModelScale, currentModelScale);
            }

            // Adaptive Layout: Update product animations or projection (no immersive view)

            updateOrbitNodesProjection();
        }

        if (renderer && scene && camera) {
            renderer.render(scene, camera);
        }
    }
    animate();

    // HUD controls click events
    const btnAutoRotate = document.getElementById('btn-auto-rotate');
    const btnPauseRotate = document.getElementById('btn-pause-rotate');
    const btnResetView = document.getElementById('btn-reset-view');

    if (btnAutoRotate && btnPauseRotate && btnResetView) {
        btnAutoRotate.addEventListener('click', () => {
            autoRotateMode = true;
            updateHUDControlsUI();
        });

        btnPauseRotate.addEventListener('click', () => {
            autoRotateMode = false;
            velocityY = 0;
            velocityX = 0;
            updateHUDControlsUI();
        });

        btnResetView.addEventListener('click', () => {
            currentYRotation = 0;
            currentXRotation = 0;
            targetCameraY = 0;
            targetCameraZ = viewModeScales[currentViewMode].cameraZ;
            velocityY = 0;
            velocityX = 0;
            autoRotateMode = true;
            if (modelObjects) {
                modelObjects.mainGroup.rotation.set(0, 0, 0);
            }
            updateHUDControlsUI();
        });
    }

    function updateHUDControlsUI() {
        if (!btnAutoRotate || !btnPauseRotate) return;
        if (autoRotateMode) {
            btnAutoRotate.classList.add('active');
            btnPauseRotate.classList.remove('active');
        } else {
            btnPauseRotate.classList.add('active');
            btnAutoRotate.classList.remove('active');
        }
    }

    // Recommendation Mapping
    const dimensionRecs = {
        sleep: {
            text: "Based on your focus on <strong class='highlight-blue'>Sleep</strong>, we recommend combining Balance and Core to regulate cortisol levels and support overnight recovery.",
            orb: "Sleep"
        },
        recovery: {
            text: "Focusing on <strong class='highlight-blue'>Recovery</strong>? We recommend our Protein and Balance stack to repair muscles and manage stress.",
            orb: "Recover"
        },
        metabolism: {
            text: "Optimizing <strong class='highlight-blue'>Metabolism</strong>. We recommend Satiety and Glucose for blood sugar control and appetite regulation.",
            orb: "Active"
        },
        foundation: {
            text: "Strengthening your <strong class='highlight-blue'>Foundation</strong>. Our recommendation: Core for daily nutritional base and metabolic support.",
            orb: "Core"
        },
        balance: {
            text: "Restoring <strong class='highlight-blue'>Balance</strong>. We suggest Balance for adaptogenic wellness and mood support.",
            orb: "Adapt"
        },
        energy: {
            text: "Boosting <strong class='highlight-blue'>Energy</strong> levels. Try Core and Glucose for stable energy without crashes.",
            orb: "Power"
        },
        immunity: {
            text: "Enhancing <strong class='highlight-blue'>Immunity</strong> defense. Core and Balance support systemic stress reduction and immune vitality.",
            orb: "Shield"
        },
        performance: {
            text: "Focused on <strong class='highlight-blue'>Performance</strong>? We recommend Protein and Core for strength and cellular energy.",
            orb: "Peak"
        },
        strength: {
            text: "Building <strong class='highlight-blue'>Strength</strong>. Combine Protein and Core for optimal amino acid delivery.",
            orb: "Force"
        },
        longevity: {
            text: "Prioritizing <strong class='highlight-blue'>Longevity</strong>. We recommend Core for daily DNA repair and antioxidant protection.",
            orb: "Life"
        },
        hormonal: {
            text: "Supporting <strong class='highlight-blue'>Hormonal Health</strong>. Try Balance and Core for cellular nourishment and hormone balance.",
            orb: "Flow"
        },
        wellness: {
            text: "Nurturing overall <strong class='highlight-blue'>Wellness</strong>. We suggest Core and Balance for daily physical and mental harmony.",
            orb: "Glow"
        }
    };

    // Orbit Nodes Events
    orbitNodes.forEach(node => {
        node.addEventListener('click', () => {
            const dimension = node.getAttribute('data-dimension');

            if (node.classList.contains('active-dimension')) {
                node.classList.remove('active-dimension');
                resetProductFilters();
                clickedDimension = null;
                targetCameraY = 0;
                targetCameraZ = 4.0;

                const defaultAITexts = {
                    unisex: "Based on your health data, we recommend focusing on <strong class='highlight-blue'>Sleep</strong> and <strong class='highlight-blue'>Recovery</strong> this week.",
                    male: "Based on your health data, we recommend focusing on <strong class='highlight-blue'>Recovery</strong> and <strong class='highlight-blue'>Strength</strong> this week.",
                    female: "Based on your health data, we recommend focusing on <strong class='highlight-blue'>Hormonal Balance</strong> and <strong class='highlight-blue'>Recovery</strong> this week."
                };
                if (aiRecText) aiRecText.innerHTML = defaultAITexts[currentProfile];
                if (aiRecOrbText) {
                    const defaultAIOrbs = { unisex: "Zzz", male: "Sync", female: "Flow" };
                    aiRecOrbText.textContent = defaultAIOrbs[currentProfile];
                }
            } else {
                orbitNodes.forEach(n => n.classList.remove('active-dimension'));
                node.classList.add('active-dimension');
                filterProductsByDimension(dimension);
                highlightSidebarDimension(dimension);

                clickedDimension = dimension;
                
                // Camera focus coordinates per dimension
                const cameraFocus = {
                    sleep: { y: 0.35, z: 2.7 },
                    recovery: { y: -0.22, z: 3.0 },
                    metabolism: { y: -0.08, z: 2.8 },
                    foundation: { y: -0.5, z: 2.7 },
                    balance: { y: 0.0, z: 3.4 },
                    energy: { y: -0.28, z: 3.1 },
                    immunity: { y: 0.25, z: 2.9 },
                    performance: { y: -0.25, z: 2.9 },
                    strength: { y: -0.28, z: 3.1 },
                    longevity: { y: -0.4, z: 2.8 },
                    hormonal: { y: 0.1, z: 3.0 },
                    wellness: { y: 0.0, z: 3.2 }
                };

                if (cameraFocus[dimension]) {
                    targetCameraY = cameraFocus[dimension].y;
                    targetCameraZ = cameraFocus[dimension].z;
                }

                if (dimensionRecs[dimension]) {
                    if (aiRecText) aiRecText.innerHTML = dimensionRecs[dimension].text;
                    if (aiRecOrbText) aiRecOrbText.textContent = dimensionRecs[dimension].orb;
                }
            }
            updateThreeJSSystems(activeSystems);
        });
    });

    function filterProductsByDimension(dimension) {
        productCards.forEach(card => {
            const cat = card.getAttribute('data-category');
            if (cat === dimension || dimension === 'all') {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }

    function resetProductFilters() {
        productCards.forEach(card => card.classList.remove('hidden'));
    }

    function highlightSidebarDimension(dimension) {
        const rows = document.querySelectorAll('.progress-row');
        rows.forEach(row => {
            const rowDim = row.getAttribute('data-dimension');
            if (rowDim === dimension) {
                row.style.borderColor = 'var(--primary-blue)';
                row.style.backgroundColor = 'rgba(36, 72, 255, 0.04)';
            } else {
                row.style.borderColor = 'var(--gray-border)';
                row.style.backgroundColor = 'var(--gray-bg)';
            }
        });
    }

    // --- 5. PRODUCT FILTER CHIPS ---
    const filterChips = document.querySelectorAll('.filter-chip');
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            const filterVal = chip.getAttribute('data-filter');
            productCards.forEach(card => {
                const tags = card.getAttribute('data-tags');
                if (filterVal === 'all' || tags.includes(filterVal)) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // AI Recommendation Card Close Event
    const closeCardBtn = document.querySelector('.ai-rec-card .close-card-btn');
    if (closeCardBtn) {
        closeCardBtn.addEventListener('click', () => {
            const aiCard = document.querySelector('.ai-rec-card');
            if (aiCard) {
                aiCard.style.opacity = '0';
                aiCard.style.transform = 'scale(0.95)';
                aiCard.style.transition = 'all 0.3s ease';
                setTimeout(() => {
                    aiCard.style.display = 'none';
                }, 300);
            }
        });
    }

    // Health Dimensions Panel Collapse/Dropdown Event
    const panelHeader = document.querySelector('.health-dimensions-panel .panel-header');
    if (panelHeader) {
        panelHeader.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-goals-btn')) return;
            const panel = document.querySelector('.health-dimensions-panel');
            if (panel) {
                panel.classList.toggle('collapsed');
            }
        });
    }

    // --- 6. INTERACTIVE STACK BUILDER ---
    const addBtns = document.querySelectorAll('.add-to-stack-btn');
    const slots = document.querySelectorAll('.stack-slot');
    const benefitSleep = document.getElementById('benefit-sleep');
    const benefitRecovery = document.getElementById('benefit-recovery');
    const benefitEnergy = document.getElementById('benefit-energy');
    const benefitFocus = document.getElementById('benefit-focus');
    const buildStackBtn = document.getElementById('build-stack-submit');

    // Product benefit statistics mapping across all dimensions
    const productBenefits = {
        p1: { name: "Core", sleep: 5, recovery: 10, energy: 20, immunity: 15, metabolism: 12, foundation: 25, performance: 12, strength: 8, longevity: 20, balance: 10, hormonal: 10, wellness: 15, focus: 15, color: "#2448FF", img: "Core" },
        p2: { name: "Satiety", sleep: 5, recovery: 5, energy: 10, immunity: 8, metabolism: 25, foundation: 10, performance: 5, strength: 5, longevity: 12, balance: 15, hormonal: 12, wellness: 12, focus: 5, color: "#EC4899", img: "Satiety" },
        p3: { name: "Protein", sleep: 5, recovery: 25, energy: 15, immunity: 10, metabolism: 8, foundation: 12, performance: 25, strength: 25, longevity: 8, balance: 5, hormonal: 5, wellness: 10, focus: 5, color: "#FF8A00", img: "Protein" },
        p4: { name: "Glucose", sleep: 5, recovery: 10, energy: 20, immunity: 8, metabolism: 25, foundation: 12, performance: 10, strength: 8, longevity: 15, balance: 12, hormonal: 10, wellness: 12, focus: 10, color: "#06B6D4", img: "Glucose" },
        p5: { name: "Balance", sleep: 15, recovery: 15, energy: 10, immunity: 12, metabolism: 10, foundation: 12, performance: 8, strength: 8, longevity: 12, balance: 25, hormonal: 25, wellness: 18, focus: 10, color: "#7C3AED", img: "Balance" }
    };

    addBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.product-card');
            const pId = card.getAttribute('data-id');
            addToStack(pId);
        });
    });

    // Handle clicking empty slots to suggest adding
    slots.forEach(slot => {
        slot.addEventListener('click', (e) => {
            if (slot.classList.contains('empty')) {
                // Focus user on the product list
                const container = document.getElementById('products-container');
                if (container) {
                    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    // Highlight cards with a brief animation
                    productCards.forEach(c => {
                        c.style.transform = 'scale(1.03)';
                        setTimeout(() => c.style.transform = 'none', 300);
                    });
                }
            }
        });
    });

    function addToStack(productId) {
        // Find first empty slot
        const emptyIdx = activeStack.indexOf(null);
        if (emptyIdx === -1) {
            // Stack is full, replace the first slot
            removeFromStack(0);
            activeStack[0] = productId;
            fillSlotUI(0, productId);
        } else {
            activeStack[emptyIdx] = productId;
            fillSlotUI(emptyIdx, productId);
        }
        updateStackBenefits();
    }

    function removeFromStack(slotIdx) {
        activeStack[slotIdx] = null;
        const slot = document.querySelector(`.stack-slot[data-slot="${slotIdx}"]`);
        slot.classList.remove('filled');
        slot.classList.add('empty');
        
        const content = slot.querySelector('.slot-filled-content');
        content.innerHTML = '';
        updateStackBenefits();
    }

    function fillSlotUI(slotIdx, productId) {
        const slot = document.querySelector(`.stack-slot[data-slot="${slotIdx}"]`);
        slot.classList.remove('empty');
        slot.classList.add('filled');

        const product = productBenefits[productId];
        const content = slot.querySelector('.slot-filled-content');
        
        // Render a small preview of the product bottle
        content.innerHTML = `
            <svg class="slot-bottle-thumb" viewBox="0 0 100 150">
                <rect x="35" y="15" width="30" height="15" rx="3" fill="#08142E" />
                <rect x="20" y="38" width="60" height="95" rx="12" fill="#F4F5F7" stroke="${product.color}" stroke-width="2" />
                <rect x="26" y="70" width="48" height="40" rx="2" fill="#FFFFFF" />
                <text x="50" y="95" font-family="'Outfit', sans-serif" font-size="7" font-weight="700" fill="#08142E" text-anchor="middle">${product.img}</text>
            </svg>
            <button class="slot-remove-btn">&times;</button>
        `;

        // Handle remove click
        const removeBtn = content.querySelector('.slot-remove-btn');
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent triggering slot click
            removeFromStack(slotIdx);
        });
    }

    function updateStackBenefits() {
        const stackTotals = {};
        const allDims = ['sleep', 'recovery', 'immunity', 'energy', 'metabolism', 'foundation', 'performance', 'strength', 'longevity', 'balance', 'hormonal', 'wellness', 'focus'];
        allDims.forEach(id => stackTotals[id] = 0);

        activeStack.forEach(pId => {
            if (pId && productBenefits[pId]) {
                allDims.forEach(id => {
                    if (productBenefits[pId][id] !== undefined) {
                        stackTotals[id] += productBenefits[pId][id];
                    }
                });
            }
        });

        const activeDims = profiles[currentProfile].dimensions;

        // 1. Update Stack Preview static benefit values (Sleep, Recovery, Energy, Focus)
        const sleepEl = document.getElementById('benefit-sleep');
        const recoveryEl = document.getElementById('benefit-recovery');
        const energyEl = document.getElementById('benefit-energy');
        const focusEl = document.getElementById('benefit-focus');

        if (sleepEl) animateBenefitVal(sleepEl, stackTotals.sleep, '%');
        if (recoveryEl) animateBenefitVal(recoveryEl, stackTotals.recovery, '%');
        if (energyEl) animateBenefitVal(energyEl, stackTotals.energy, '%');
        if (focusEl) animateBenefitVal(focusEl, stackTotals.focus, '%');

        // 2. Toggle active classes on holographic body overlay SVG systems
        // Clear all first
        const allSVGIds = ['sleep', 'recovery', 'energy', 'metabolism', 'immunity', 'foundation'];
        allSVGIds.forEach(id => {
            const el = document.getElementById(`system-${id}`);
            if (el) el.classList.remove('active');
        });

        // Toggle DOM overlay SVG lines depending on profile and active stack totals
        if (currentProfile === 'male') {
            if (stackTotals.performance > 0) toggleBodySystemDOM('energy', true);
            if (stackTotals.recovery > 0) toggleBodySystemDOM('recovery', true);
            if (stackTotals.energy > 0) toggleBodySystemDOM('foundation', true);
            if (stackTotals.strength > 0) {
                toggleBodySystemDOM('energy', true);
                toggleBodySystemDOM('recovery', true);
            }
            if (stackTotals.metabolism > 0) toggleBodySystemDOM('metabolism', true);
            if (stackTotals.longevity > 0) toggleBodySystemDOM('immunity', true);
        } else if (currentProfile === 'female') {
            if (stackTotals.balance > 0) toggleBodySystemDOM('sleep', true);
            if (stackTotals.recovery > 0) toggleBodySystemDOM('recovery', true);
            if (stackTotals.energy > 0) toggleBodySystemDOM('foundation', true);
            if (stackTotals.hormonal > 0) {
                toggleBodySystemDOM('sleep', true);
                toggleBodySystemDOM('immunity', true);
            }
            if (stackTotals.metabolism > 0) toggleBodySystemDOM('metabolism', true);
            if (stackTotals.wellness > 0) {
                toggleBodySystemDOM('sleep', true);
                toggleBodySystemDOM('foundation', true);
            }
        } else {
            // Unisex
            if (stackTotals.sleep > 0) toggleBodySystemDOM('sleep', true);
            if (stackTotals.recovery > 0) toggleBodySystemDOM('recovery', true);
            if (stackTotals.energy > 0) toggleBodySystemDOM('energy', true);
            if (stackTotals.metabolism > 0) toggleBodySystemDOM('metabolism', true);
            if (stackTotals.immunity > 0) toggleBodySystemDOM('immunity', true);
            if (stackTotals.foundation > 0) toggleBodySystemDOM('foundation', true);
        }

        // Update activeSystems state for WebGL system glows
        allDims.forEach(id => {
            activeSystems[id] = stackTotals[id] > 0;
        });
        updateThreeJSSystems(activeSystems);

        // 3. Update Orbit nodes with percentage badges
        // Clear all badge elements in DOM first to prevent remnants from other modes
        document.querySelectorAll('.node-improvement-badge').forEach(b => {
            b.classList.remove('visible');
            b.textContent = '+0%';
        });
        
        activeDims.forEach(dim => {
            updateOrbitNodeBadge(dim.id, stackTotals[dim.id]);
        });
        
        // Balance or specialty averages (e.g. for Unisex/Male/Female orbit badge calculations)
        if (currentProfile === 'unisex') {
            const balanceVal = Math.round((stackTotals.sleep + stackTotals.recovery + stackTotals.energy) / 2.5);
            updateOrbitNodeBadge('balance', balanceVal);
        }

        // 4. Update Left Sidebar Health Score
        const filledCount = activeStack.filter(x => x !== null).length;
        const baseScore = profiles[currentProfile].healthScoreBase;
        const newHealthScore = baseScore + Math.min(100 - baseScore, filledCount * 3);
        updateHealthScore(newHealthScore);

        // 5. Update Right Sidebar progress bars
        activeDims.forEach(dim => {
            updateSidebarProgressBar(dim.id, dim.baseVal, stackTotals[dim.id]);
        });

        // 6. Update combined stack benefits text in AI card
        updateAICard(filledCount, stackTotals);

        // Style the CTA button
        if (filledCount >= 3) {
            buildStackBtn.classList.add('pulse-glow');
            buildStackBtn.style.backgroundColor = 'var(--primary-blue)';
            buildStackBtn.querySelector('span').textContent = 'Checkout Custom Stack';
        } else {
            buildStackBtn.classList.remove('pulse-glow');
            buildStackBtn.style.backgroundColor = '';
            buildStackBtn.querySelector('span').textContent = 'Build Your Stack';
        }
    }

    function getBenefitIconBgClass(i) {
        if (i === 0) return 'blue-bg';
        if (i === 1) return 'indigo-bg';
        return 'orange-bg';
    }

    function toggleBodySystemDOM(id, active) {
        const system = document.getElementById(`system-${id}`);
        if (system) {
            if (active) {
                system.classList.add('active');
            } else {
                system.classList.remove('active');
            }
        }
    }

    function toggleBodySystem(systemId, active) {
        if (activeSystems[systemId] !== undefined) {
            activeSystems[systemId] = active;
            updateThreeJSSystems(activeSystems);
        }
    }

    function updateOrbitNodeBadge(dimension, value) {
        const badge = document.getElementById(`badge-${dimension}`);
        if (badge) {
            if (value > 0) {
                badge.textContent = `+${value}%`;
                badge.classList.add('visible');
            } else {
                badge.classList.remove('visible');
            }
        }
    }

    let currentScore = 87;
    function updateHealthScore(newScore) {
        if (currentScore === newScore) return;
        const scoreNumbers = document.querySelectorAll('.score-number');
        const scoreCircles = document.querySelectorAll('.ring-progress');
        const maxOffset = 264;

        const step = newScore > currentScore ? 1 : -1;
        const interval = setInterval(() => {
            if (currentScore === newScore) {
                clearInterval(interval);
            } else {
                currentScore += step;
                scoreNumbers.forEach(num => {
                    num.textContent = currentScore;
                });
                scoreCircles.forEach(circle => {
                    const offset = maxOffset - (maxOffset * currentScore) / 100;
                    circle.style.strokeDashoffset = offset;
                });
            }
        }, 40);
    }

    function updateSidebarProgressBar(dimension, baseVal, stackVal) {
        const row = document.querySelector(`.progress-row[data-dimension="${dimension}"]`);
        if (!row) return;

        const fill = row.querySelector('.progress-bar-fill');
        const valText = row.querySelector('.progress-val');
        const tag = row.querySelector('.status-tag');

        const newVal = Math.min(100, baseVal + stackVal);
        
        if (fill) fill.style.width = newVal + '%';
        if (valText) valText.textContent = newVal;

        if (tag) {
            if (newVal >= 85) {
                tag.textContent = 'Excellent';
                tag.className = 'status-tag excellent';
            } else if (newVal >= 70) {
                tag.textContent = 'Good';
                tag.className = 'status-tag good';
            } else {
                tag.textContent = 'Fair';
                tag.className = 'status-tag fair';
            }
        }
    }

    function updateAICard(filledCount, stackTotals) {
        const aiCard = document.querySelector('.ai-rec-card');
        if (!aiCard) return;

        const recText = document.getElementById('ai-rec-text');
        const orbText = document.getElementById('ai-orb-text');
        const scoresPanel = document.getElementById('ai-scores-panel');
        const stackScoreFill = document.getElementById('stack-score-fill');
        const stackScoreNum = document.getElementById('stack-score-num');
        const synergyScoreFill = document.getElementById('synergy-score-fill');
        const synergyScoreNum = document.getElementById('synergy-score-num');
        const impactSection = document.getElementById('ai-impact-section');
        const impactList = document.getElementById('ai-impact-list');
        const suggestionBox = document.getElementById('ai-suggestion-box');
        const aiCta = document.getElementById('ai-cta');

        function applyChatVisibility() {
            const consoleEl = document.querySelector('.wellness-advisor-console');
            console.log("applyChatVisibility called. chatOpen:", chatOpen);
            if (consoleEl) {
                if (chatOpen) {
                    consoleEl.style.display = 'flex';
                    if (aiCta) aiCta.style.display = 'none';
                    console.log("Console visible, CTA hidden");
                } else {
                    consoleEl.style.display = 'none';
                    if (aiCta) aiCta.style.display = 'flex';
                    console.log("Console hidden, CTA visible");
                }
            } else {
                console.warn("wellness-advisor-console not found in page!");
            }
        }

        const goalNames = {
            none: "General Wellness",
            weight: "Weight Management",
            sleep: "Better Sleep",
            energy: "More Energy",
            muscle: "Muscle Growth",
            recovery: "Recovery",
            hormonal: "Hormonal Balance",
            metabolic: "Metabolic Health",
            longevity: "Longevity"
        };

        const goalTargets = {
            weight: ['p2', 'p4'],      // Satiety, Glucose
            sleep: ['p5', 'p1'],       // Balance, Core
            energy: ['p1', 'p4'],      // Core, Glucose
            muscle: ['p3', 'p1'],      // Protein, Core
            recovery: ['p3', 'p5'],    // Protein, Balance
            hormonal: ['p5', 'p1'],    // Balance, Core
            metabolic: ['p4', 'p2'],   // Glucose, Satiety
            longevity: ['p1', 'p5']    // Core, Balance
        };

        // Determine if a goal is selected
        const isGoalActive = activeGoal && activeGoal !== 'none';

        // 1. EMPTY STATE (No products, no goal)
        if (filledCount === 0 && !isGoalActive) {
            if (recText) recText.innerHTML = profiles[currentProfile].aiRecText;
            if (orbText) {
                const defaultOrbs = { unisex: "Zzz", male: "Sync", female: "Flow" };
                orbText.textContent = defaultOrbs[currentProfile] || "Sync";
            }
            if (scoresPanel) scoresPanel.style.display = 'none';
            if (impactSection) impactSection.style.display = 'none';
            if (suggestionBox) suggestionBox.style.display = 'none';
            applyChatVisibility();
            return;
        }

        // 2. GOAL SELECTED BUT STACK EMPTY
        if (filledCount === 0 && isGoalActive) {
            if (orbText) orbText.textContent = "Goal";
            const available = profiles[currentProfile].productsFilter;
            const targets = (goalTargets[activeGoal] || []).filter(id => available.includes(id));
            const productNames = targets.map(id => productBenefits[id] ? productBenefits[id].name : id).join(" + ");
            if (recText) {
                recText.innerHTML = `Optimize for <strong>${goalNames[activeGoal]}</strong> by building the recommended STAKOR stack: <span class="highlight-blue">${productNames}</span>.`;
            }
            if (scoresPanel) scoresPanel.style.display = 'none';
            if (impactSection) impactSection.style.display = 'none';

            // Show recommendation to load the stack
            if (suggestionBox) {
                suggestionBox.style.display = 'flex';
                suggestionBox.innerHTML = `
                    <span class="suggestion-header">RECOMMENDED COMBINATION</span>
                    <span class="suggestion-name">${goalNames[activeGoal]} Stack</span>
                    <span class="suggestion-reason">Load the scientifically formulated STAKOR stack for ${goalNames[activeGoal]}.</span>
                    <button class="suggestion-add-btn" id="btn-load-rec-stack">Apply Recommended Stack</button>
                `;
                const loadBtn = document.getElementById('btn-load-rec-stack');
                if (loadBtn) {
                    loadBtn.addEventListener('click', () => {
                        // Clear stack and load targets
                        for (let i = 0; i < 4; i++) removeFromStack(i);
                        targets.forEach(id => addToStack(id));
                    });
                }
            }
            applyChatVisibility();
            return;
        }

        // 3. PRODUCTS SELECTED (Evaluate stack dynamically)
        if (scoresPanel) scoresPanel.style.display = 'flex';
        if (impactSection) impactSection.style.display = 'flex';
        if (suggestionBox) suggestionBox.style.display = 'flex';

        // Filter out nulls
        const currentProducts = activeStack.filter(x => x !== null);

        // --- Calculate Synergy Score ---
        let synergy = 0;
        if (currentProducts.length === 1) {
            synergy = 50;
        } else if (currentProducts.length > 1) {
            // Base score based on stack size
            synergy = currentProducts.length === 2 ? 65 : (currentProducts.length === 3 ? 80 : 92);

            // Combination Synergy checks
            const contains = (id) => currentProducts.includes(id);
            let bonuses = 0;

            if (contains('p1') && contains('p3')) bonuses += 12; // Core + Protein
            if (contains('p2') && contains('p4')) bonuses += 20; // Satiety + Glucose (Metabolism Synergy)
            if (contains('p2') && contains('p1')) bonuses += 10; // Satiety + Core
            if (contains('p4') && contains('p1')) bonuses += 10; // Glucose + Core
            if (contains('p3') && contains('p5')) bonuses += 12; // Protein + Balance
            if (contains('p5') && contains('p1')) bonuses += 15; // Balance + Core
            if (contains('p5') && contains('p4')) bonuses += 10; // Balance + Glucose

            synergy = Math.min(100, synergy + bonuses);

            // Duplication Penalty
            const uniqueProducts = [...new Set(currentProducts)];
            const duplicatesCount = currentProducts.length - uniqueProducts.length;
            if (duplicatesCount > 0) {
                synergy = Math.max(20, synergy - duplicatesCount * 15);
            }
        }

        // --- Calculate Stack Score ---
        let stackScore = 0;
        if (isGoalActive) {
            const targets = goalTargets[activeGoal] || [];
            let matchedTargets = 0;
            targets.forEach(id => {
                if (currentProducts.includes(id)) matchedTargets++;
            });

            // Base score for starting, plus coverage bonus
            stackScore = 30 + (matchedTargets / targets.length) * 55;
            if (currentProducts.includes('p1')) {
                stackScore += 15; // Core foundation bonus
            }
            stackScore = Math.min(100, Math.round(stackScore));
        } else {
            // Generic stack score based on diversity and foundation
            stackScore = 40 + currentProducts.length * 10;
            if (currentProducts.includes('p1')) stackScore += 15; // Core bonus
            if (currentProducts.includes('p3')) stackScore += 10; // Protein bonus
            stackScore = Math.min(100, stackScore);
        }

        // Update Orb & Score Meters
        if (orbText) orbText.textContent = `${synergy}%`;
        
        if (stackScoreNum) stackScoreNum.textContent = stackScore;
        if (stackScoreFill) stackScoreFill.style.width = `${stackScore}%`;
        
        if (synergyScoreNum) synergyScoreNum.textContent = synergy;
        if (synergyScoreFill) synergyScoreFill.style.width = `${synergy}%`;

        // --- Dynamic Health Dimension Impact percentages ---
        if (impactList) {
            impactList.innerHTML = '';
            const trackedDims = ['energy', 'recovery', 'sleep', 'immunity', 'metabolism', 'balance', 'foundation'];
            trackedDims.forEach(dim => {
                const val = stackTotals[dim];
                if (val > 0) {
                    const badge = document.createElement('div');
                    badge.className = 'impact-badge';
                    badge.innerHTML = `
                        <span class="dim-name">${dim.charAt(0).toUpperCase() + dim.slice(1)}</span>
                        <span class="impact-val">+${val}%</span>
                    `;
                    impactList.appendChild(badge);
                }
            });
        }

        // --- Dynamic AI Insight text ---
        let insight = '';
        const contains = (id) => currentProducts.includes(id);

        if (contains('p2') && contains('p4')) {
            insight = "This stack provides excellent metabolic and weight management support. Satiety regulates appetite control while Glucose helps maintain stable blood sugar levels.";
        } else if (contains('p1') && contains('p3')) {
            insight = "A strong foundation for muscle recovery and performance. Core supports cellular health and daily energy production while Protein enhances muscle tissue repair.";
        } else if (contains('p5') && contains('p1')) {
            insight = "Excellent for stress adaptation and cellular harmony. Balance manages cortisol levels while Core supplies foundational nutrients for daily vitality.";
        } else {
            insight = "This combination provides strong recovery and daily vitality support. Core forms a highly effective baseline, enabling targeted supplement synergy across active dimensions.";
        }
        if (recText) recText.innerHTML = insight;

        // --- Dynamic Suggested Additions ---
        let suggestedId = null;
        let suggestionReason = '';

        if (isGoalActive) {
            const available = profiles[currentProfile].productsFilter;
            const targets = (goalTargets[activeGoal] || []).filter(id => available.includes(id));
            const missingTarget = targets.find(id => !currentProducts.includes(id));
            if (missingTarget) {
                suggestedId = missingTarget;
                suggestionReason = `To complete your ${goalNames[activeGoal]} stack and maximize target effectiveness.`;
            }
        }

        // Fallbacks if no goal active or all goal targets are met
        if (!suggestedId) {
            const available = profiles[currentProfile].productsFilter;
            if (!contains('p1') && available.includes('p1')) {
                suggestedId = 'p1';
                suggestionReason = "Core is the daily foundation layer of every STAKOR stack to support daily energy and nutritional base.";
            } else if (!contains('p4') && available.includes('p4')) {
                suggestedId = 'p4';
                suggestionReason = "Adding Glucose may improve metabolic efficiency and energy stability.";
            } else if (!contains('p5') && available.includes('p5')) {
                suggestedId = 'p5';
                suggestionReason = "Adding Balance supports hormonal harmony and stress management.";
            } else {
                // Default fallback if stack contains available products
                const missingAny = available.find(id => !currentProducts.includes(id));
                if (missingAny) {
                    suggestedId = missingAny;
                    suggestionReason = "Expand your stack synergy with this clinically proven formulation.";
                }
            }
        }

        if (suggestedId && productBenefits[suggestedId] && suggestionBox) {
            const product = productBenefits[suggestedId];
            suggestionBox.innerHTML = `
                <span class="suggestion-header">SUGGESTED ADDITION</span>
                <span class="suggestion-name">${product.name}</span>
                <span class="suggestion-reason">${suggestionReason}</span>
                <button class="suggestion-add-btn" id="btn-add-suggested">Add to Stack</button>
            `;
            const addSuggestedBtn = document.getElementById('btn-add-suggested');
            if (addSuggestedBtn) {
                addSuggestedBtn.addEventListener('click', () => {
                    addToStack(suggestedId);
                });
            }
        } else if (suggestionBox) {
            suggestionBox.style.display = 'none';
        }

        applyChatVisibility();
    }

    function animateBenefitVal(element, target, suffix = '') {
        const current = parseInt(element.textContent.replace('+', '').replace('%', '')) || 0;
        if (current === target) return;

        let val = current;
        const step = target > current ? 1 : -1;
        const interval = setInterval(() => {
            if (val === target) {
                clearInterval(interval);
            } else {
                val += step;
                element.textContent = `+${val}${suffix}`;
            }
        }, 15);
    }

    function filterCatalogByProfile(profileKey) {
        const config = profiles[profileKey];
        if (!config) return;

        const cards = document.querySelectorAll('.product-card');
        cards.forEach(card => {
            const pId = card.getAttribute('data-id');
            if (config.productsFilter.includes(pId)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
                
                const stackIdx = activeStack.indexOf(pId);
                if (stackIdx !== -1) {
                    removeFromStack(stackIdx);
                }
            }
        });
    }

    function applyProfileConfig(profileKey) {
        currentProfile = profileKey;
        const config = profiles[profileKey];
        if (!config) return;

        // 1. Update Orbit Nodes
        const orbitNodeElements = document.querySelectorAll('.orbit-node');
        config.dimensions.forEach((dim, idx) => {
            const node = orbitNodeElements[idx];
            if (!node) return;
            node.style.display = 'flex';
            node.setAttribute('data-dimension', dim.id);
            node.classList.remove('active-dimension');
            
            const badge = node.querySelector('.node-improvement-badge');
            if (badge) {
                badge.id = `badge-${dim.id}`;
                badge.textContent = '+0%';
                badge.classList.remove('visible');
            }

            const iconWrapper = node.querySelector('.node-icon-wrapper');
            if (iconWrapper) {
                iconWrapper.innerHTML = `<i data-lucide="${dim.icon}"></i>`;
            }

            const titleSpan = node.querySelector('.node-title');
            if (titleSpan) titleSpan.textContent = dim.title;

            const metaSpan = node.querySelector('.node-meta');
            if (metaSpan) metaSpan.textContent = dim.meta;
        });

        // Hide 7th node since only 6 dimensions are displayed per profile
        if (orbitNodeElements[6]) {
            orbitNodeElements[6].style.display = 'none';
        }

        // 2. Update Right Sidebar Progress Rows
        const progressRows = document.querySelectorAll('.progress-row');
        config.dimensions.forEach((dim, idx) => {
            const row = progressRows[idx];
            if (!row) return;
            row.setAttribute('data-dimension', dim.id);
            row.style.borderColor = 'var(--gray-border)';
            row.style.backgroundColor = 'var(--gray-bg)';
            
            const labelDiv = row.querySelector('.progress-label');
            if (labelDiv) {
                labelDiv.innerHTML = `
                    <span class="name"><i data-lucide="${dim.icon}"></i> ${dim.title}</span>
                    <span class="status-tag good">Good</span>
                `;
            }

            const fill = row.querySelector('.progress-bar-fill');
            if (fill) {
                fill.className = `progress-bar-fill ${dim.id}-fill`;
                fill.setAttribute('data-target', dim.baseVal);
                fill.style.width = '0%';
            }

            const valSpan = row.querySelector('.progress-val');
            if (valSpan) valSpan.textContent = dim.baseVal;
        });

        // 3. Reinitialize Lucide Icons
        if (window.lucide) {
            window.lucide.createIcons();
        }

        // 4. Update Product Catalog Filtering
        filterCatalogByProfile(profileKey);

        // 5. Reset click highlights and selections
        clickedDimension = null;
        targetCameraY = 0;
        targetCameraZ = viewModeScales[currentViewMode].cameraZ;

        // 6. Update AI Recommendation base text
        if (aiRecText) aiRecText.innerHTML = config.aiRecText;
        if (aiRecOrbText) {
            const orbs = { unisex: "Zzz", male: "Sync", female: "Flow" };
            aiRecOrbText.textContent = orbs[profileKey] || "Sync";
        }

        // 7. Refresh stack benefits, scores, and sidebar values
        updateStackBenefits();
    }

    // Profile Selector Click Events
    const profileBtns = document.querySelectorAll('.profile-btn');
    profileBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            profileBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const targetProfile = btn.getAttribute('data-profile');
            applyProfileConfig(targetProfile);
        });
    });



    // Run dynamic filter once at start to enforce male mode initially
    applyProfileConfig('male');
    createHealthScoreClone();

    // ================================================================
    // ADAPTIVE LAYOUT SYSTEM — View Mode Controller
    // ================================================================

    const appContainer = document.querySelector('.app-container');
    const viewModeBtns = document.querySelectorAll('.view-mode-btn');
    const immersiveOrbitContainer = document.getElementById('immersive-products-orbit');

    // Product data for immersive orbit modules
    const productModuleData = [
        { id: 'p1', name: 'Core', price: '₹2,499', icon: 'activity', category: 'foundation' },
        { id: 'p2', name: 'Satiety', price: '₹2,199', icon: 'scale', category: 'metabolism' },
        { id: 'p3', name: 'Protein', price: '₹3,499', icon: 'dumbbell', category: 'recovery' },
        { id: 'p4', name: 'Glucose', price: '₹2,299', icon: 'activity', category: 'metabolism' },
        { id: 'p5', name: 'Balance', price: '₹2,699', icon: 'scale', category: 'balance' }
    ];

    function createImmersiveProductModules() {
        if (!immersiveOrbitContainer) return;
        immersiveOrbitContainer.innerHTML = '';

        const filteredProducts = productModuleData.filter(p =>
            profiles[currentProfile].productsFilter.includes(p.id)
        );

        filteredProducts.forEach((product, idx) => {
            const module = document.createElement('div');
            module.className = 'immersive-product-module';
            module.setAttribute('data-product-id', product.id);
            module.setAttribute('data-orbit-idx', idx);
            module.style.animationDelay = `${idx * 0.1}s`;

            module.innerHTML = `
                <div class="product-module-icon">
                    <i data-lucide="${product.icon}"></i>
                </div>
                <div class="product-module-info">
                    <span class="product-module-name">${product.name}</span>
                    <span class="product-module-price">${product.price}</span>
                </div>
                <button class="product-module-add" data-product-id="${product.id}">
                    <i data-lucide="plus"></i>
                </button>
            `;

            immersiveOrbitContainer.appendChild(module);

            // Wire up the add button to use the existing addToStack logic
            const addBtn = module.querySelector('.product-module-add');
            if (addBtn) {
                addBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const productId = addBtn.getAttribute('data-product-id');
                    // Find the corresponding product card's add button and click it
                    const cardAddBtn = document.querySelector(`.product-card[data-id="${productId}"] .add-to-stack-btn`);
                    if (cardAddBtn) cardAddBtn.click();
                });
            }
        });

        // Initialize lucide icons for newly created elements
        if (window.lucide) window.lucide.createIcons();

        // Fade them in with a short delay
        setTimeout(() => {
            const modules = immersiveOrbitContainer.querySelectorAll('.immersive-product-module');
            modules.forEach(m => m.classList.add('visible'));
        }, 100);
    }

    function removeImmersiveProductModules() {
        if (!immersiveOrbitContainer) return;
        const modules = immersiveOrbitContainer.querySelectorAll('.immersive-product-module');
        modules.forEach(m => {
            m.style.opacity = '0';
            m.style.transform = 'translate(-50%, -50%) scale(0.5)';
        });
        setTimeout(() => {
            immersiveOrbitContainer.innerHTML = '';
        }, 400);
    }

    function updateImmersiveProductModules() {
        if (!hologramContainer || !camera || !immersiveOrbitContainer) return;

        const width = hologramContainer.clientWidth;
        const height = hologramContainer.clientHeight;
        const modules = immersiveOrbitContainer.querySelectorAll('.immersive-product-module');
        const productOrbitRadius = currentOrbitRadius * 1.65; // Wider than dimension orbits
        const total = modules.length;

        modules.forEach((module, idx) => {
            const orbitIdx = parseInt(module.getAttribute('data-orbit-idx'));
            const angleOffset = (orbitIdx / total) * Math.PI * 2;
            const theta = angleOffset + currentYRotation * 0.7; // Slower rotation than dimension nodes
            const phi = 0.5 * Math.PI + Math.sin(orbitIdx) * 0.05; // gentle wave tilt

            tempV.setFromSphericalCoords(productOrbitRadius, phi, theta);
            tempV.y += 0.1;
            tempV.project(camera);

            const x = (tempV.x * 0.5 + 0.5) * width;
            const y = (-tempV.y * 0.5 + 0.5) * height;

            module.style.left = `${x}px`;
            module.style.top = `${y}px`;

            // Depth-based opacity and z-index
            const depth = tempV.z;
            const opacity = Math.max(0.55, Math.min(1.0, 1.0 - (depth + 1.0) * 0.2));
            module.style.opacity = opacity;

            if (depth > 0.05) {
                module.style.zIndex = '1';
                module.style.pointerEvents = 'none';
            } else {
                module.style.zIndex = '7';
                module.style.pointerEvents = 'auto';
            }
        });
    }

    // Health Score Clone for Focus Mode

    function createHealthScoreClone() {
        const original = document.querySelector('.health-score-container');
        const heroViewport = document.querySelector('.health-universe-section');
        if (!original || !heroViewport) return;

        // Don't create if already exists
        if (heroViewport.querySelector('.focus-health-score-clone')) return;

        healthScoreClone = document.createElement('div');
        healthScoreClone.className = 'focus-health-score-clone';

        const scoreNum = document.getElementById('health-score-num');
        const currentScore = scoreNum ? scoreNum.textContent : '87';

        healthScoreClone.innerHTML = `
            <div class="score-header">
                <span>Health Score</span>
            </div>
            <div class="score-ring-wrapper">
                <svg class="score-ring" viewBox="0 0 100 100">
                    <circle class="ring-bg" cx="50" cy="50" r="42" />
                    <circle class="ring-progress" cx="50" cy="50" r="42" style="stroke-dashoffset: ${264 - (264 * parseInt(currentScore)) / 100}" />
                </svg>
                <div class="score-text">
                    <span class="score-number">${currentScore}</span>
                    <span class="score-label">Excellent</span>
                </div>
            </div>
        `;

        heroViewport.appendChild(healthScoreClone);
    }

    function removeHealthScoreClone() {
        if (healthScoreClone) {
            healthScoreClone.style.opacity = '0';
            healthScoreClone.style.transform = 'translateX(-20px)';
            setTimeout(() => {
                if (healthScoreClone && healthScoreClone.parentNode) {
                    healthScoreClone.parentNode.removeChild(healthScoreClone);
                }
                healthScoreClone = null;
            }, 350);
        }
    }

    function setViewMode(mode) {
        currentViewMode = mode;

        // Update CSS classes on app container
        appContainer.classList.remove('focus-mode');
        if (mode === 'focus') {
            appContainer.classList.add('focus-mode');
        }

        // Update button active states
        viewModeBtns.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
        });

        // Update 3D scene targets
        const isMobile = window.innerWidth <= 1024;
        const scales = viewModeScales[mode];
        if (scales) {
            targetCameraZ = isMobile ? scales.cameraZ + 0.65 : scales.cameraZ;
            targetOrbitRadius = isMobile ? scales.orbitRadius * 0.70 : scales.orbitRadius;
            targetModelScale = isMobile ? scales.modelScale * 0.70 : scales.modelScale;
        }

        // Handle health score clone
        if (mode === 'focus') {
            createHealthScoreClone();
        } else {
            removeHealthScoreClone();
        }

        // Trigger Three.js renderer resize after CSS transition completes
        setTimeout(() => {
            if (hologramContainer && camera && renderer) {
                const w = hologramContainer.clientWidth;
                const h = hologramContainer.clientHeight;
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
                renderer.setSize(w, h);
            }
        }, 500);
    }

    // Initialize focus mode explicitly at startup
    setViewMode('focus');

    // --- 7. STAKOR WELLNESS CONCIERGE CHAT ENGINE ---
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send-btn');
    const chatHistory = document.getElementById('chat-history');

    if (chatInput && chatSendBtn && chatHistory) {
        const handleSend = () => {
            const query = chatInput.value.trim();
            if (!query) return;

            // Append User message
            appendChatBubble(query, 'user-bubble');
            chatInput.value = '';

            // Concierge Advisor Typing / Response
            setTimeout(() => {
                const response = solveStakorQuery(query);
                appendChatBubble(response, 'advisor-bubble');
                chatHistory.scrollTop = chatHistory.scrollHeight;
            }, 550);
        };

        chatSendBtn.addEventListener('click', handleSend);
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleSend();
        });

        const aiCta = document.getElementById('ai-cta');
        if (aiCta) {
            aiCta.addEventListener('click', (e) => {
                console.log("AI CTA button clicked!");
                chatOpen = true;
                updateStackBenefits();
                setTimeout(() => {
                    if (chatHistory) chatHistory.scrollTop = chatHistory.scrollHeight;
                    if (chatInput) chatInput.focus();
                }, 100);
            });
        }
    }

    function appendChatBubble(text, className) {
        if (!chatHistory) return;
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${className}`;
        bubble.innerHTML = text;
        chatHistory.appendChild(bubble);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function solveStakorQuery(query) {
        const lower = query.toLowerCase();

        // 1. Core
        if (lower.includes('core')) {
            return "<strong>STAKOR Core</strong> is the foundation of every stack. It provides daily nutrition, energy production, and cellular vitality support.<br><br>⏱ <strong>Serving Size:</strong> 2 capsules daily<br>📅 <strong>Best Time:</strong> In the morning with breakfast.";
        }
        // 2. Satiety
        if (lower.includes('satiety')) {
            return "<strong>STAKOR Satiety</strong> regulates healthy eating behaviors by supporting craving control and appetite control. Pairs exceptionally well with Glucose.<br><br>⏱ <strong>Serving Size:</strong> 1 capsule<br>📅 <strong>Best Time:</strong> 30-45 minutes before your largest meal (lunch or dinner).";
        }
        // 3. Protein
        if (lower.includes('protein')) {
            return "<strong>STAKOR Protein</strong> utilizes pure whey isolate to facilitate rapid muscle repair, lean muscle growth, and performance recovery.<br><br>⏱ <strong>Serving Size:</strong> 1 scoop (30g) in 250ml water/milk<br>📅 <strong>Best Time:</strong> Post-workout (within 45 mins) or as a morning protein source.";
        }
        // 4. Glucose
        if (lower.includes('glucose')) {
            return "<strong>STAKOR Glucose</strong> supports metabolic efficiency and stable, long-term energy levels by regulating blood sugar and insulin sensitivity.<br><br>⏱ <strong>Serving Size:</strong> 1 capsule<br>📅 <strong>Best Time:</strong> 15-20 minutes before carbohydrate-heavy meals.";
        }
        // 5. Balance
        if (lower.includes('balance')) {
            return "<strong>STAKOR Balance</strong> supports hormonal wellness, mood stabilization, and cortisol management for overall adaptogenic wellness.<br><br>⏱ <strong>Serving Size:</strong> 1 capsule<br>📅 <strong>Best Time:</strong> In the evening before bed or during periods of elevated stress.";
        }
        // 6. Rejection of removed products / redirection
        if (lower.includes('magnesium') || lower.includes('glycinate')) {
            return "Magnesium Glycinate is no longer in our direct catalog. We suggest <strong>STAKOR Balance</strong> to support muscle relaxation, mood, and stress wellness.<br><br>⏱ <strong>Balance Serving:</strong> 1 capsule daily<br>📅 <strong>Best Time:</strong> In the evening before bed.";
        }
        if (lower.includes('omega') || lower.includes('fish oil')) {
            return "Omega 3 Fish Oil has been replaced in our health universe. We recommend <strong>STAKOR Core</strong> for your daily cell protective and cardiovascular foundations.<br><br>⏱ <strong>Core Serving:</strong> 2 capsules daily<br>📅 <strong>Best Time:</strong> Morning with breakfast.";
        }
        if (lower.includes('sleep support') || (lower.includes('sleep') && (lower.includes('support') || lower.includes('night') || lower.includes('rest')))) {
            return "For sleep optimization, we suggest combining <strong>STAKOR Balance</strong> (for adaptogenic cortisol management) and <strong>STAKOR Core</strong> (for foundational recovery).<br><br>⏱ <strong>STAKOR Balance:</strong> 1 capsule before bed<br>⏱ <strong>STAKOR Core:</strong> 2 capsules in the morning.";
        }
        if (lower.includes('daily essentials') || lower.includes('bundle') || lower.includes('pack')) {
            return "Our essentials package has been consolidated into the unified <strong>STAKOR Core</strong> daily baseline.<br><br>⏱ <strong>Core Serving:</strong> 2 capsules daily<br>📅 <strong>Best Time:</strong> Morning with breakfast.";
        }
        // 7. Stack / Synergy questions
        if (lower.includes('stack') || lower.includes('synergy') || lower.includes('combine') || lower.includes('combination')) {
            return "STAKOR stack building follows a layered methodology: establish a <strong>Foundation</strong> (Core), target specific <strong>Goals</strong> (Metabolism/Recovery with Satiety, Protein, or Glucose), and adapt with <strong>Hormonal Wellness</strong> (Balance).<br><br>⏱ <strong>Core (Foundation):</strong> 2 capsules in the morning<br>⏱ <strong>Satiety/Glucose (Metabolic Goal):</strong> Pre-meal as directed<br>⏱ <strong>Protein (Recovery Goal):</strong> Post-workout<br>⏱ <strong>Balance (Hormonal Support):</strong> 1 capsule before bed";
        }
        // 8. Health dimensions
        if (lower.includes('metabol') || lower.includes('blood sugar')) {
            return "Metabolic health is tracked via stable energy. Combining <strong>STAKOR Satiety</strong> and <strong>STAKOR Glucose</strong> creates the optimal metabolic synergy.<br><br>⏱ <strong>Satiety:</strong> 1 capsule 30-45 minutes before your largest meal<br>⏱ <strong>Glucose:</strong> 1 capsule 15-20 minutes before a carb-heavy meal";
        }
        if (lower.includes('sleep') || lower.includes('insomnia')) {
            return "For sleep and night-time recovery, we recommend combining <strong>STAKOR Balance</strong> and <strong>STAKOR Core</strong>.<br><br>⏱ <strong>Balance:</strong> 1 capsule before bed (cortisol control)<br>⏱ <strong>Core:</strong> 2 capsules with breakfast (micronutrient recovery)";
        }
        if (lower.includes('recovery') || lower.includes('sore') || lower.includes('muscle')) {
            return "Optimal physical recovery combines <strong>STAKOR Protein</strong> for muscle tissue repair and <strong>STAKOR Balance</strong> to manage physiological stress and cortisol.<br><br>⏱ <strong>Protein:</strong> 1 scoop post-workout or in the morning<br>⏱ <strong>Balance:</strong> 1 capsule before bed";
        }
        if (lower.includes('hormon') || lower.includes('pcos') || lower.includes('stress')) {
            return "Hormonal Wellness is best supported by <strong>STAKOR Balance</strong>, which pairs well with <strong>STAKOR Core</strong> for foundational cellular thyroid support.<br><br>⏱ <strong>Balance:</strong> 1 capsule before bed or under high stress<br>⏱ <strong>Core:</strong> 2 capsules in the morning";
        }
        if (lower.includes('energy') || lower.includes('tired') || lower.includes('fatigue')) {
            return "Energy levels are stabilized by combining <strong>STAKOR Core</strong> (daily baseline) and <strong>STAKOR Glucose</strong> (blood sugar regulation) to prevent post-meal crashes.<br><br>⏱ <strong>Core:</strong> 2 capsules with breakfast<br>⏱ <strong>Glucose:</strong> 1 capsule 15-20 minutes before a carb-heavy meal";
        }
        if (lower.includes('longevity') || lower.includes('heart') || lower.includes('aging')) {
            return "Longevity optimization utilizes <strong>STAKOR Core</strong> and <strong>STAKOR Balance</strong> to support cardiovascular wellness and reduce oxidative stress.<br><br>⏱ <strong>Core:</strong> 2 capsules with breakfast<br>⏱ <strong>Balance:</strong> 1 capsule before bed";
        }
        if (lower.includes('immunity') || lower.includes('sick') || lower.includes('cold')) {
            return "Immune defense is bolstered by <strong>STAKOR Core</strong> (rich in zinc and cellular antioxidants) and <strong>STAKOR Balance</strong> (for cortisol/immune balance).<br><br>⏱ <strong>Core:</strong> 2 capsules with breakfast<br>⏱ <strong>Balance:</strong> 1 capsule before bed";
        }
        // 9. Hello / Greetings
        if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('greetings')) {
            return "Welcome. I am your premium STAKOR Wellness Concierge. How can I optimize your health stack today?";
        }

        // 10. Rejection of unrelated prompts
        return "As your STAKOR Health Concierge, my knowledge is strictly focused on the STAKOR ecosystem, health dimensions, and stack-building science. I cannot assist with unrelated queries. Please ask me about STAKOR products or stack synergy.";
    }

    // ================================================================
    // INTERACTIVE HEALTH GOAL ASSESSMENT SYSTEM
    // ================================================================
    const modal = document.getElementById('assessment-modal');
    const openTopBarBtn = document.getElementById('top-bar-assessment-btn');
    const openSidebarBtn = document.getElementById('nav-assessment-btn');
    const closeBtn = document.getElementById('close-assessment');
    
    // Step inputs state
    let answers = {
        gender: null,
        age: 25,
        goals: [],
        sleep: null,
        energy: null,
        weight: null,
        recovery: null
    };

    if (modal) {
        const steps = modal.querySelectorAll('.assessment-step');
        
        const showModal = () => {
            modal.classList.add('active');
            resetAssessment();
        };

        const hideModal = () => {
            modal.classList.remove('active');
        };

        if (openTopBarBtn) openTopBarBtn.addEventListener('click', showModal);
        if (openSidebarBtn) openSidebarBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showModal();
        });
        if (closeBtn) closeBtn.addEventListener('click', hideModal);

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) hideModal();
        });

        // Initialize Option Buttons & Slider
        const ageSlider = document.getElementById('age-slider');
        const ageVal = document.getElementById('age-val-display');
        if (ageSlider && ageVal) {
            ageSlider.addEventListener('input', () => {
                ageVal.textContent = ageSlider.value;
                answers.age = parseInt(ageSlider.value);
            });
        }

        // Setup individual steps navigation & selection handlers
        steps.forEach((step, idx) => {
            const stepIndex = parseInt(step.getAttribute('data-step'));
            
            // Handle option buttons (single selection)
            const optButtons = step.querySelectorAll('.opt-btn');
            optButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    optButtons.forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    const val = btn.getAttribute('data-val');
                    
                    // Save answer
                    if (stepIndex === 1) answers.gender = val;
                    else if (stepIndex === 4) answers.sleep = val;
                    else if (stepIndex === 5) answers.energy = val;
                    else if (stepIndex === 6) answers.weight = val;
                    else if (stepIndex === 7) answers.recovery = val;
                    
                    // Enable next button
                    const nextBtn = step.querySelector('.step-next-btn, #submit-assessment-btn');
                    if (nextBtn) nextBtn.disabled = false;
                });
            });

            // Handle multi-select goals (Step 3)
            if (stepIndex === 3) {
                const chipButtons = step.querySelectorAll('.chip-btn');
                chipButtons.forEach(btn => {
                    btn.addEventListener('click', () => {
                        btn.classList.toggle('selected');
                        const val = btn.getAttribute('data-val');
                        
                        if (btn.classList.contains('selected')) {
                            if (!answers.goals.includes(val)) answers.goals.push(val);
                        } else {
                            answers.goals = answers.goals.filter(g => g !== val);
                        }
                        
                        const nextBtn = step.querySelector('.step-next-btn');
                        if (nextBtn) nextBtn.disabled = answers.goals.length === 0;
                    });
                });
            }

            // Navigation buttons inside steps
            const startBtn = step.querySelector('#start-assessment-btn');
            if (startBtn) {
                startBtn.addEventListener('click', () => goToStep(1));
            }

            const backBtn = step.querySelector('.step-back-btn');
            if (backBtn) {
                backBtn.addEventListener('click', () => {
                    goToStep(stepIndex - 1);
                });
            }

            const nextBtn = step.querySelector('.step-next-btn');
            if (nextBtn && stepIndex !== 0) {
                nextBtn.addEventListener('click', () => {
                    goToStep(stepIndex + 1);
                });
            }

            const submitBtn = step.querySelector('#submit-assessment-btn');
            if (submitBtn) {
                submitBtn.addEventListener('click', () => {
                    generateResults();
                });
            }
        });

        function goToStep(stepNumber) {
            steps.forEach(step => {
                const stepIdx = parseInt(step.getAttribute('data-step'));
                step.classList.toggle('active', stepIdx === stepNumber);
            });
        }

        function resetAssessment() {
            answers = {
                gender: null,
                age: 25,
                goals: [],
                sleep: null,
                energy: null,
                weight: null,
                recovery: null
            };
            
            // Clear selections
            modal.querySelectorAll('.opt-btn, .chip-btn').forEach(btn => btn.classList.remove('selected'));
            
            // Disable next buttons (except step 2 which has a default value)
            modal.querySelectorAll('.step-next-btn, #submit-assessment-btn').forEach(btn => {
                const stepParent = btn.closest('.assessment-step');
                const isStep2 = stepParent && stepParent.getAttribute('data-step') === '2';
                if (btn.id !== 'start-assessment-btn' && btn.className !== 'step-back-btn' && !isStep2) {
                    btn.disabled = true;
                } else if (isStep2) {
                    btn.disabled = false;
                }
            });
            
            // Reset slider
            if (ageSlider && ageVal) {
                ageSlider.value = 25;
                ageVal.textContent = 25;
            }

            // Go to welcome screen
            goToStep(0);
            
            const resultStep = document.getElementById('assessment-result-step');
            if (resultStep) resultStep.classList.remove('active');
        }

        function generateResults() {
            // Recommendation products selection based on inputs
            const recList = document.getElementById('rec-products-list');
            if (!recList) return;
            
            // Build the results list dynamically
            // Always contains Core (p1), Protein (p3), and Balance (p5 - representing Magnesium replacement)
            recList.innerHTML = `
                <div class="rec-product-item">
                    <div class="rec-product-icon p1-color">
                        <i data-lucide="layers"></i>
                    </div>
                    <div class="rec-product-info">
                        <span class="rec-product-title">STAKOR Core</span>
                        <span class="rec-product-meta">Foundational nutrients & cellular thyroid support</span>
                    </div>
                </div>
                <div class="rec-product-item">
                    <div class="rec-product-icon p3-color">
                        <i data-lucide="dumbbell"></i>
                    </div>
                    <div class="rec-product-info">
                        <span class="rec-product-title">STAKOR Protein</span>
                        <span class="rec-product-meta">Rapid muscle tissue repair & post-workout recovery</span>
                    </div>
                </div>
                <div class="rec-product-item">
                    <div class="rec-product-icon p5-color">
                        <i data-lucide="scale"></i>
                    </div>
                    <div class="rec-product-info">
                        <span class="rec-product-title">STAKOR Balance (Magnesium-Enhanced)</span>
                        <span class="rec-product-meta">Cortisol management, restful sleep & physical relaxation</span>
                    </div>
                </div>
            `;

            // Re-render icons
            if (window.lucide) window.lucide.createIcons();

            // Hide all other steps and display result step
            steps.forEach(step => step.classList.remove('active'));
            const resultStep = document.getElementById('assessment-result-step');
            if (resultStep) resultStep.classList.add('active');
        }

        // Apply Stack to Builder Button Handler
        const applyStackBtn = document.getElementById('apply-rec-stack-btn');
        if (applyStackBtn) {
            applyStackBtn.addEventListener('click', () => {
                // Clear existing stack slots
                for (let i = 0; i < 4; i++) {
                    removeFromStack(i);
                }

                // If Balance (p5) is female-only, and the profile gender is not female,
                // automatically toggle the profile to Female to allow the stack components to load and render.
                if (answers.gender === 'female' || currentProfile !== 'female') {
                    applyProfileConfig('female');
                    const femaleBtn = document.querySelector('.profile-btn[data-profile="female"]');
                    if (femaleBtn) {
                        document.querySelectorAll('.profile-btn').forEach(b => b.classList.remove('active'));
                        femaleBtn.classList.add('active');
                    }
                }

                // Add recommended products: Core (p1), Protein (p3), Balance (p5)
                addToStack('p1');
                addToStack('p3');
                addToStack('p5');

                hideModal();
                
                // Scroll to stack builder section to highlight applied stack
                const stackSection = document.getElementById('scroll-to-universe');
                if (stackSection) {
                    stackSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            });
        }

        const finishBtn = document.getElementById('finish-assessment-btn');
        if (finishBtn) finishBtn.addEventListener('click', hideModal);
    }
        
    // --- 8. PROGRESS TIMELINE INTERACTIVE LOGIC ---
        const timelineSteps = document.querySelectorAll('.timeline-step-node');
        const trackFill = document.getElementById('timeline-track-fill');
        const stageTitle = document.getElementById('timeline-stage-title');
        const stageBadge = document.getElementById('timeline-stage-badge');
        const stageDesc = document.getElementById('timeline-stage-desc');
        const energyVal = document.getElementById('imp-energy-val');
        const recoveryVal = document.getElementById('imp-recovery-val');
        const sleepVal = document.getElementById('imp-sleep-val');
        const metabolismVal = document.getElementById('imp-metabolism-val');

        const timelineData = {
            '1': {
                title: "Day 1: Adaptation",
                badge: "Initial Stage",
                desc: "Absorption of micronutrients begins. Cellular stress balancing initiates.",
                energy: "Stable energy, no afternoon crash",
                energyPct: 12,
                recovery: "Adaptation to physical exertion",
                recoveryPct: 8,
                sleep: "Reduced sleep latency",
                sleepPct: 20,
                metabolism: "Digestive enzyme activation",
                metabolismPct: 15
            },
            '30': {
                title: "Day 30: Balance",
                badge: "Loading Phase",
                desc: "Ingredients build in tissue. Nervous and metabolic systems optimize.",
                energy: "Consistent morning wakefulness",
                energyPct: 45,
                recovery: "Reduced soreness, faster reset",
                recoveryPct: 35,
                sleep: "Fewer night-time awakenings",
                sleepPct: 55,
                metabolism: "Stabilized glucose & appetite control",
                metabolismPct: 40
            },
            '60': {
                title: "Day 60: Deep Recovery",
                badge: "Optimization Phase",
                desc: "Deep sleep cycles lengthen. Growth hormone optimizes muscle repair.",
                energy: "Sustained daytime vitality",
                energyPct: 75,
                recovery: "Accelerated cell repair post-workout",
                recoveryPct: 70,
                sleep: "Lengthened deep REM cycles",
                sleepPct: 80,
                metabolism: "Efficient nutrient partitioning",
                metabolismPct: 70
            },
            '90': {
                title: "Day 90: Peak Synergy",
                badge: "Mastery Phase",
                desc: "Full homeostatic optimization. Systems interact to maximize resilience.",
                energy: "High energy & mental focus",
                energyPct: 95,
                recovery: "Rapid post-exertion recovery",
                recoveryPct: 90,
                sleep: "Peak sleep quality scores",
                sleepPct: 98,
                metabolism: "Optimal metabolic rate",
                metabolismPct: 88
            }
        };

        const updateTimelineTrack = (day) => {
            let percentage = 0;
            if (day === '1') percentage = 0;
            else if (day === '30') percentage = 33.33;
            else if (day === '60') percentage = 66.66;
            else if (day === '90') percentage = 100;
            
            if (trackFill) trackFill.style.width = `${percentage}%`;
        };

        const updateGauges = (day) => {
            const metrics = ['energy', 'recovery', 'sleep', 'metabolism'];
            const data = timelineData[day];
            if (!data) return;

            metrics.forEach(metric => {
                const fillElement = document.getElementById(`gauge-${metric}-fill`);
                const pctElement = document.getElementById(`gauge-${metric}-pct`);
                if (fillElement) {
                    const pctVal = data[`${metric}Pct`] || 0;
                    const offset = 251.3 - (251.3 * pctVal) / 100;
                    fillElement.style.strokeDashoffset = offset;
                }
                if (pctElement) {
                    const pctVal = data[`${metric}Pct`] || 0;
                    let start = parseInt(pctElement.textContent.replace('+', '').replace('%', '')) || 0;
                    let end = pctVal;
                    let duration = 800;
                    let startTime = null;
                    
                    const animateCount = (timestamp) => {
                        if (!startTime) startTime = timestamp;
                        const progress = Math.min((timestamp - startTime) / duration, 1);
                        const currentVal = Math.floor(progress * (end - start) + start);
                        pctElement.textContent = `+${currentVal}%`;
                        if (progress < 1) {
                            requestAnimationFrame(animateCount);
                        } else {
                            pctElement.textContent = `+${end}%`;
                        }
                    };
                    requestAnimationFrame(animateCount);
                }
            });
        };

        if (timelineSteps && timelineSteps.length > 0) {
            timelineSteps.forEach(node => {
                node.addEventListener('click', () => {
                    const day = node.getAttribute('data-day');
                    
                    // Toggle active and completed states
                    timelineSteps.forEach(n => {
                        const nDay = parseInt(n.getAttribute('data-day'));
                        const currentDay = parseInt(day);
                        
                        n.classList.remove('active', 'completed');
                        if (nDay === currentDay) {
                            n.classList.add('active');
                        } else if (nDay < currentDay) {
                            n.classList.add('completed');
                        }
                    });

                    // Update track progress line
                    updateTimelineTrack(day);
                    
                    // Update gauges
                    updateGauges(day);

                    // Update content with animation
                    const card = document.querySelector('.timeline-content-card');
                    if (card) {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(8px)';
                        
                        setTimeout(() => {
                            const data = timelineData[day];
                            if (data) {
                                if (stageTitle) stageTitle.textContent = data.title;
                                if (stageBadge) stageBadge.textContent = data.badge;
                                if (stageDesc) stageDesc.textContent = data.desc;
                                if (energyVal) energyVal.textContent = data.energy;
                                if (recoveryVal) recoveryVal.textContent = data.recovery;
                                if (sleepVal) sleepVal.textContent = data.sleep;
                                if (metabolismVal) metabolismVal.textContent = data.metabolism;
                            }
                            
                            const glowColors = {
                                '1': 'rgba(36, 72, 255, 0.15)',
                                '30': 'rgba(6, 182, 212, 0.15)',
                                '60': 'rgba(124, 58, 237, 0.15)',
                                '90': 'rgba(236, 72, 153, 0.15)'
                            };
                            const cardBorderColors = {
                                '1': 'rgba(36, 72, 255, 0.25)',
                                '30': 'rgba(6, 182, 212, 0.25)',
                                '60': 'rgba(124, 58, 237, 0.25)',
                                '90': 'rgba(236, 72, 153, 0.25)'
                            };

                            card.style.boxShadow = `0 30px 70px -10px ${glowColors[day]}, 0 10px 30px rgba(8, 27, 75, 0.02), inset 0 1px 0 rgba(255,255,255,0.9)`;
                            card.style.borderColor = cardBorderColors[day];
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 200);
                    }
                });
            });
            
            // Set initial track fill and gauges
            updateTimelineTrack('1');
            const initialCard = document.querySelector('.timeline-content-card');
            if (initialCard) {
                initialCard.style.boxShadow = '0 30px 70px -10px rgba(36, 72, 255, 0.15), 0 10px 30px rgba(8, 27, 75, 0.02), inset 0 1px 0 rgba(255,255,255,0.9)';
                initialCard.style.borderColor = 'rgba(36, 72, 255, 0.25)';
            }
            setTimeout(() => {
                updateGauges('1');
            }, 300);
        }

        // --- 9. SMOOTH SCROLL FOR SIDEBAR NAV ---
        const navItems = document.querySelectorAll('.sidebar-nav a');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const href = item.getAttribute('href');
                if (href && href.startsWith('#')) {
                    const targetEl = document.querySelector(href);
                    if (targetEl) {
                        e.preventDefault();
                        console.log("Nav item smooth scrolling to:", href);
                        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        
                        // Toggle active nav class
                        navItems.forEach(i => i.classList.remove('active'));
                        item.classList.add('active');
                    }
                }
            });
        });

        // ================================================================
        // --- 10. AI PRODUCT ANALYZER INTERACTION ---
        // ================================================================
        const productAnalyzerData = {
            p1: {
                name: "Core",
                subtitle: "Foundation Layer",
                whatItDoes: "Daily nutritional foundation for cellular energy, baseline wellness, and nutrient absorption.",
                whyExists: "Created to eliminate nutritional gaps, support cellular repair, and provide a stable metabolic platform for adaptogens.",
                targetAudience: "Anyone looking to optimize daily performance, reduce fatigue, and support long-term cellular health.",
                science: "Powered by chelated minerals, methylated B-vitamins, and co-factors for maximum bioavailability.",
                supports: ["Daily Nutrition", "Cellular Health", "Energy Production"],
                combos: ["Protein", "Glucose", "Balance"],
                synergyScore: 92
            },
            p2: {
                name: "Satiety",
                subtitle: "Metabolic Control Layer",
                whatItDoes: "Natural appetite regulator that helps control sugar cravings and extends feelings of fullness.",
                whyExists: "Formulated to curb stress-induced eating, stabilize insulin spikes, and assist healthy weight management.",
                targetAudience: "Individuals seeking healthy weight goals, glucose stability, and craving management.",
                science: "Leverages high-viscosity dietary fibers and chromium picolinate to optimize blood sugar pathways.",
                supports: ["Appetite Regulation", "Glucose Stability", "Weight Management"],
                combos: ["Core", "Glucose", "Protein"],
                synergyScore: 88
            },
            p3: {
                name: "Protein",
                subtitle: "Muscle Recovery Layer",
                whatItDoes: "High-bioavailability protein stack designed to accelerate muscle protein synthesis and post-exertion recovery.",
                whyExists: "Built to prevent post-workout muscle breakdown, support lean mass development, and reduce muscular soreness.",
                targetAudience: "Active individuals, athletes, and anyone focusing on strength, recovery, and body composition.",
                science: "Utilizes enzymatically hydrolyzed whey isolate and amino acid catalysts for near-instant muscle uptake.",
                supports: ["Muscle Recovery", "Protein Synthesis", "Lean Mass Support"],
                combos: ["Core", "Satiety", "Glucose"],
                synergyScore: 94
            },
            p4: {
                name: "Glucose",
                subtitle: "Metabolic Synergy Layer",
                whatItDoes: "Optimizes insulin sensitivity, balances blood glucose levels, and prevents energy crashes.",
                whyExists: "Engineered to manage post-meal blood sugar curves and convert carbohydrates into usable energy.",
                targetAudience: "Individuals wanting stable energy, focus, and metabolic health.",
                science: "Contains Berberine HCl and Alpha Lipoic Acid to activate AMPK pathway and shuttle glucose into muscle cells.",
                supports: ["Glucose Balance", "Insulin Sensitivity", "Constant Energy"],
                combos: ["Core", "Satiety", "Protein"],
                synergyScore: 90
            },
            p5: {
                name: "Balance",
                subtitle: "Hormonal & Adaptogenic Layer",
                whatItDoes: "Supports cortisol regulation, balances thyroid output, and mitigates hormonal fluctuations.",
                whyExists: "Created to counter physical and mental stress, promote emotional stability, and optimize endocrine function.",
                targetAudience: "Anyone experiencing high stress, sleep disruption, or hormonal imbalances (especially female profile).",
                science: "Infused with Ashwagandha KSM-66, Inositol, and Zinc picolinate to regulate HPA-axis response.",
                supports: ["Cortisol Regulation", "Stress Resilience", "Hormonal Harmony"],
                combos: ["Core", "Protein", "Satiety"],
                synergyScore: 95
            }
        };

        const aiRecCard = document.querySelector('.ai-rec-card');
        const aiAnalyzerCard = document.getElementById('ai-analyzer-card');
        const analyzerContent = document.getElementById('analyzer-content');
        const closeAnalyzerBtn = document.getElementById('close-analyzer');

        function showProductAnalysis(productId) {
            const data = productAnalyzerData[productId];
            if (!data || !aiAnalyzerCard || !analyzerContent) return;

            // Generate HTML structure
            const supportsHtml = data.supports.map(item => `
                <li><span class="check-icon">✓</span> ${item}</li>
            `).join('');

            const combosHtml = data.combos.map(item => `
                <span class="combo-badge">${item}</span>
            `).join('');

            const maxOffset = 264; // stroke-dasharray matching
            const strokeOffset = maxOffset - (maxOffset * data.synergyScore) / 100;

            analyzerContent.innerHTML = `
                <h3 class="analyzer-title">${data.name} Analysis</h3>
                <span class="analyzer-subtitle">${data.subtitle}</span>

                <div class="analyzer-section">
                    <h4>Supports:</h4>
                    <ul class="supports-list">
                        ${supportsHtml}
                    </ul>
                </div>

                <div class="analyzer-section">
                    <h4>Best Combined With:</h4>
                    <div class="combos-row">
                        ${combosHtml}
                    </div>
                </div>

                <div class="analyzer-score-section">
                    <div class="score-ring-wrapper small" style="position: relative; width: 60px; height: 60px; flex-shrink: 0;">
                        <svg class="score-ring" viewBox="0 0 100 100" style="width: 100%; height: 100%; transform: rotate(-90deg);">
                            <circle class="ring-bg" cx="50" cy="50" r="42" style="stroke: #E2E8F0; stroke-width: 8; fill: none;" />
                            <circle class="ring-progress" cx="50" cy="50" r="42" style="stroke-dasharray: 264; stroke-dashoffset: ${strokeOffset}; stroke: var(--primary-blue); stroke-width: 8; fill: none; transition: stroke-dashoffset 1s ease-out; stroke-linecap: round;" />
                        </svg>
                        <div class="score-text" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center;">
                            <span class="score-number">${data.synergyScore}%</span>
                        </div>
                    </div>
                    <div class="score-info">
                        <span class="score-label">Synergy Score</span>
                        <p class="score-desc">Calculated integration potential with active stack.</p>
                    </div>
                </div>

                <div class="analyzer-details">
                    <div class="detail-tab">
                        <h5>What it does</h5>
                        <p>${data.whatItDoes}</p>
                    </div>
                    <div class="detail-tab">
                        <h5>Why it exists</h5>
                        <p>${data.whyExists}</p>
                    </div>
                    <div class="detail-tab">
                        <h5>Target audience</h5>
                        <p>${data.targetAudience}</p>
                    </div>
                    <div class="detail-tab">
                        <h5>Science behind it</h5>
                        <p>${data.science}</p>
                    </div>
                </div>
            `;

            // Toggle visibility
            if (aiRecCard) aiRecCard.style.display = 'none';
            aiAnalyzerCard.style.display = 'flex';
            aiAnalyzerCard.style.opacity = '0';
            aiAnalyzerCard.style.transform = 'translateY(15px)';
            
            // Trigger animation frame for transition
            requestAnimationFrame(() => {
                aiAnalyzerCard.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                aiAnalyzerCard.style.opacity = '1';
                aiAnalyzerCard.style.transform = 'translateY(0)';
            });

            // If right sidebar needs to scroll to focus
            const sidebarRight = document.querySelector('.sidebar-right');
            if (sidebarRight) {
                sidebarRight.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }

        // Click listeners on static product cards
        const cards = document.querySelectorAll('.product-card');
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Ignore if clicked on the 'add-to-stack' button to prevent double actions
                if (e.target.closest('.add-to-stack-btn')) return;
                
                const productId = card.getAttribute('data-id');
                console.log("Product card clicked for analysis:", productId);
                showProductAnalysis(productId);
            });
        });

        // Click listeners on dynamically spawned immersive modules in 3D orbit
        document.addEventListener('click', (e) => {
            const module = e.target.closest('.immersive-product-module');
            if (module) {
                if (e.target.closest('.product-module-add')) return;
                
                const productId = module.getAttribute('data-product-id');
                console.log("Immersive module clicked for analysis:", productId);
                showProductAnalysis(productId);
            }
        });

        // Close button handler
        if (closeAnalyzerBtn) {
            closeAnalyzerBtn.addEventListener('click', () => {
                aiAnalyzerCard.style.display = 'none';
                if (aiRecCard) {
                    aiRecCard.style.display = 'flex';
                    aiRecCard.style.opacity = '0';
                    requestAnimationFrame(() => {
                        aiRecCard.style.opacity = '1';
                    });
                }
            });
        }

    // Check for redirect parameters from the assessment quiz page
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('applyStack') === 'true') {
        const genderParam = urlParams.get('gender');
        
        // Clear existing stack slots
        for (let i = 0; i < 4; i++) {
            removeFromStack(i);
        }

        // Set profile gender
        const targetGender = (genderParam === 'female' || genderParam === 'male' || genderParam === 'unisex') ? genderParam : 'female';
        applyProfileConfig(targetGender);
        
        const genderBtn = document.querySelector(`.profile-btn[data-profile="${targetGender}"]`);
        if (genderBtn) {
            document.querySelectorAll('.profile-btn').forEach(b => b.classList.remove('active'));
            genderBtn.classList.add('active');
        }

        // Add recommended products: Core (p1), Protein (p3), Balance (p5)
        addToStack('p1');
        addToStack('p3');
        addToStack('p5');

        // Scroll to stack builder section to highlight applied stack
        const stackSection = document.getElementById('scroll-to-universe') || document.getElementById('stack-builder');
        if (stackSection) {
            setTimeout(() => {
                stackSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 600); // short delay to ensure rendering is stable
        }

        // --- 4. EXPLORE PRODUCTS ROW FILTERING, SORTING, AND LAYOUT CONTROLS ---
        const filterChips = document.querySelectorAll('.filter-chip');
        const sortDropdownBtn = document.getElementById('sort-dropdown-btn');
        const sortDropdownContainer = document.querySelector('.sort-dropdown-container');
        const sortMenuItems = document.querySelectorAll('.sort-menu-item');
        const currentSortLabel = document.getElementById('current-sort-label');
        const layoutGridBtn = document.getElementById('layout-grid-btn');
        const layoutListBtn = document.getElementById('layout-list-btn');
        const productsContainer = document.getElementById('products-container');

        // Toggle dropdown visibility
        if (sortDropdownBtn && sortDropdownContainer) {
            sortDropdownBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                sortDropdownContainer.classList.toggle('open');
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (sortDropdownContainer && !sortDropdownContainer.contains(e.target)) {
                sortDropdownContainer.classList.remove('open');
            }
        });

        // Dropdown selection handler
        sortMenuItems.forEach(item => {
            item.addEventListener('click', () => {
                // Update active state in dropdown
                sortMenuItems.forEach(mi => mi.classList.remove('active'));
                item.classList.add('active');

                // Update label
                if (currentSortLabel) {
                    currentSortLabel.textContent = item.textContent;
                }

                // Close dropdown
                if (sortDropdownContainer) {
                    sortDropdownContainer.classList.remove('open');
                }

                // Apply filter and sorting
                applyFilterAndSort();
            });
        });

        // Filter chips click handler
        filterChips.forEach(chip => {
            chip.addEventListener('click', () => {
                filterChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                applyFilterAndSort();
            });
        });

        // Layout buttons handler
        if (layoutGridBtn && layoutListBtn && productsContainer) {
            layoutGridBtn.addEventListener('click', () => {
                layoutListBtn.classList.remove('active');
                layoutGridBtn.classList.add('active');
                productsContainer.classList.remove('list-layout');
            });

            layoutListBtn.addEventListener('click', () => {
                layoutGridBtn.classList.remove('active');
                layoutListBtn.classList.add('active');
                productsContainer.classList.add('list-layout');
            });
        }

        // Main Filter & Sort function
        function applyFilterAndSort() {
            if (!productsContainer) return;

            const activeFilterChip = document.querySelector('.filter-chip.active');
            const activeSortItem = document.querySelector('.sort-menu-item.active');
            if (!activeFilterChip || !activeSortItem) return;

            const filterVal = activeFilterChip.getAttribute('data-filter');
            const sortVal = activeSortItem.getAttribute('data-sort');
            const cards = Array.from(productsContainer.querySelectorAll('.product-card'));

            // First step: Filter cards (fade-out anim then hide/show)
            cards.forEach(card => {
                const tags = card.getAttribute('data-tags') || '';
                const badge = card.getAttribute('data-badge') || '';
                const isMatch = (filterVal === 'all') || tags.includes(filterVal) || (badge === filterVal);

                if (isMatch) {
                    card.style.display = '';
                    // Trigger smooth fade-in
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    card.style.display = 'none';
                }
            });

            // Second step: Sort visible cards
            const visibleCards = cards.filter(card => {
                const tags = card.getAttribute('data-tags') || '';
                const badge = card.getAttribute('data-badge') || '';
                return (filterVal === 'all') || tags.includes(filterVal) || (badge === filterVal);
            });

            visibleCards.sort((a, b) => {
                if (sortVal === 'price-low') {
                    const priceA = parseFloat(a.getAttribute('data-price') || '0');
                    const priceB = parseFloat(b.getAttribute('data-price') || '0');
                    return priceA - priceB;
                } else if (sortVal === 'price-high') {
                    const priceA = parseFloat(a.getAttribute('data-price') || '0');
                    const priceB = parseFloat(b.getAttribute('data-price') || '0');
                    return priceB - priceA;
                } else if (sortVal === 'rating') {
                    const ratingA = parseFloat(a.getAttribute('data-rating') || '0');
                    const ratingB = parseFloat(b.getAttribute('data-rating') || '0');
                    return ratingB - ratingA;
                } else {
                    // 'featured' sorting (original order, data-id)
                    const idA = a.getAttribute('data-id') || '';
                    const idB = b.getAttribute('data-id') || '';
                    return idA.localeCompare(idB);
                }
            });

            // Re-append sorted elements to the container DOM
            visibleCards.forEach(card => {
                productsContainer.appendChild(card);
            });
        }

        // Initial run to make sure everything aligns
        applyFilterAndSort();
        
        // Clean up the URL parameters so they don't re-apply on reload
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});
