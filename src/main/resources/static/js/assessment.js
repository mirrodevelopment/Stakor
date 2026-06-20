/* ================================================================
   STAKOR HEALTH ASSESSMENT — SPATIAL CONFIGURATOR ENGINE
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // --- SLIDING HOVER PILL FOR NAVBAR (Apple Liquid Glass Effect) ---
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

    // 1. Configurator Selection State
    const selection = {
        core: 'standard',     // standard, longevity
        protein: 'muscle',    // muscle, energy, exclude
        satiety: 'regulate',  // regulate, weight, exclude
        glucose: 'fatigue',   // fatigue, metabolic, exclude
        balance: 'stress'     // stress, sleep, exclude
    };

    // Step Data definitions
    const stepData = {
        1: {
            badge: "SYSTEM 01",
            title: "CORE",
            subtitle: "Daily Foundation",
            text: "Build your health base with essential micronutrients, adaptogens and minerals customized to your physiological baseline.",
            product: "core",
            options: [
                { val: "standard", label: "Standard Core Support" },
                { val: "longevity", label: "Longevity Optimization" }
            ]
        },
        2: {
            badge: "SYSTEM 02",
            title: "SATIETY",
            subtitle: "Control Hunger",
            text: "Stabilize gut signaling pathways and naturally regulate appetite curves using highly soluble prebiotic fibers.",
            product: "satiety",
            options: [
                { val: "regulate", label: "Appetite Regulation" },
                { val: "weight", label: "Stable Weight Maintenance" },
                { val: "exclude", label: "Exclude Satiety System" }
            ]
        },
        3: {
            badge: "SYSTEM 03",
            title: "PROTEIN",
            subtitle: "Strength & Recovery",
            text: "Optimize muscle protein synthesis and cellular tissue recovery with rapid-acting grass-fed whey isolate amino matrices.",
            product: "protein",
            options: [
                { val: "muscle", label: "Lean Muscle Development" },
                { val: "energy", label: "Daily Energy Support" },
                { val: "exclude", label: "Exclude Protein System" }
            ]
        },
        4: {
            badge: "SYSTEM 04",
            title: "GLUCOSE",
            subtitle: "Metabolic Health",
            text: "Mitigate blood sugar spikes and insulin resistance to eliminate mid-day energy crashes and stabilize focus.",
            product: "glucose",
            options: [
                { val: "fatigue", label: "Reduce Afternoon Fatigue" },
                { val: "metabolic", label: "Sugar Curve Flattening" },
                { val: "exclude", label: "Exclude Glucose System" }
            ]
        },
        5: {
            badge: "SYSTEM 05",
            title: "BALANCE",
            subtitle: "Hormonal Wellness",
            text: "Mitigate daily cortisol spikes, balance endocrine function, and support deeper, restorative REM sleep cycles.",
            product: "balance",
            options: [
                { val: "stress", label: "Cortisol / Stress Mitigation" },
                { val: "sleep", label: "Deep Restful Sleep Support" },
                { val: "exclude", label: "Exclude Balance System" }
            ]
        }
    };

    // DOM References
    const container = document.querySelector('.assessment-container');
    const contentBlock = document.getElementById('card-content-block');
    const footerBlock = document.getElementById('card-footer-block');
    const btnNext = document.getElementById('btn-next');
    const miniRingFill = document.getElementById('miniProgressRing');
    const miniRingNum = document.getElementById('miniProgressNum');

    // DNA & Card Coordinate Maps for desktop (offsets from screen center)
    const desktopLayouts = {
        1: { dnaX: "-24vw", dnaY: "0vh", dnaScale: 1.5, cardX: "24vw", cardY: "0vh" },
        2: { dnaX: "24vw", dnaY: "-20vh", dnaScale: 1.25, cardX: "-24vw", cardY: "0vh" },
        3: { dnaX: "-24vw", dnaY: "20vh", dnaScale: 1.35, cardX: "24vw", cardY: "0vh" },
        4: { dnaX: "28vw", dnaY: "0vh", dnaScale: 1.6, cardX: "-24vw", cardY: "0vh" },
        5: { dnaX: "0vw", dnaY: "5vh", dnaScale: 1.25, cardX: "24vw", cardY: "0vh" },
        6: { dnaX: "-24vw", dnaY: "0vh", dnaScale: 1.45, cardX: "24vw", cardY: "0vh" }
    };

    // DNA Coordinates for mobile (custom positions specifically designed for vertical storytelling)
    const mobileLayouts = {
        1: { dnaX: "0vw", dnaY: "-24vh", dnaScale: 1.4, cardX: "0vw", cardY: "18vh" },
        2: { dnaX: "0vw", dnaY: "24vh", dnaScale: 1.3, cardX: "0vw", cardY: "-20vh" },
        3: { dnaX: "0vw", dnaY: "0vh", dnaScale: 1.7, cardX: "0vw", cardY: "0vh" },
        4: { dnaX: "14vw", dnaY: "4vh", dnaScale: 1.5, cardX: "-6vw", cardY: "-1vh" },
        5: { dnaX: "0vw", dnaY: "-5vh", dnaScale: 1.6, cardX: "0vw", cardY: "16vh" },
        6: { dnaX: "0vw", dnaY: "0vh", dnaScale: 1.2, cardX: "0vw", cardY: "0vh" }
    };

    let currentActiveStep = 1;

    // Spline Application Reference
    let splineApp = null;
    const viewer = document.querySelector('spline-viewer');
    
    // Position the card and DNA wrapper instantly on page load
    transitionToStep(currentActiveStep);

    if (viewer) {
        viewer.addEventListener('load-complete', () => {
            splineApp = viewer.application || viewer.spline;
            if (splineApp && splineApp.scene) {
                // Initialize default transform
                splineApp.scene.rotation.set(0, 0, 0);
                splineApp.scene.scale.set(1.0, 1.0, 1.0);

                // Start ambient slow continuous rotation
                gsap.to(splineApp.scene.rotation, {
                    y: "+=" + (Math.PI * 2),
                    duration: 45,
                    repeat: -1,
                    ease: "none"
                });

                // Apply initial rotation matching step 1 coordinates
                const rotationY = Math.PI * 0.45 * currentActiveStep;
                const rotationX = (currentActiveStep % 2 === 0 ? 0.12 : -0.12);
                gsap.to(splineApp.scene.rotation, {
                    x: rotationX,
                    y: rotationY,
                    duration: 1.6,
                    ease: "power2.out"
                });
            }
        });
    }

    // Dynamic Step Render
    function renderStep(stepIndex) {
        if (stepIndex > 5) {
            renderBlueprint();
            return;
        }

        const data = stepData[stepIndex];
        
        // Setup fade-out transition
        contentBlock.classList.add('fade-out');

        setTimeout(() => {
            // Build options HTML list
            let optionsHtml = '';
            data.options.forEach(opt => {
                const isSelected = selection[data.product] === opt.val;
                optionsHtml += `
                    <div class="option-node-card ${isSelected ? 'selected' : ''}" data-product="${data.product}" data-val="${opt.val}">
                        <span class="option-node-title">${opt.label}</span>
                        <div class="option-bullet-dot"></div>
                    </div>
                `;
            });

            // Update HTML block
            contentBlock.innerHTML = `
                <span class="step-badge">${data.badge}</span>
                <h1 class="step-title">${data.title}</h1>
                <span class="step-subtitle">${data.subtitle}</span>
                <p class="step-text">${data.text}</p>
                <div class="step-options-container">
                    ${optionsHtml}
                </div>
            `;

            // Wire up options click listeners
            contentBlock.querySelectorAll('.option-node-card').forEach(card => {
                card.addEventListener('click', () => {
                    const prod = card.getAttribute('data-product');
                    const val = card.getAttribute('data-val');
                    
                    // Toggle selected card style
                    card.closest('.step-options-container').querySelectorAll('.option-node-card').forEach(c => c.classList.remove('selected'));
                    card.classList.add('selected');
                    
                    // Save state
                    selection[prod] = val;
                });
            });

            // Update Progress ring SVG
            if (miniRingFill) {
                const circumference = 100; // stroke-dasharray
                const pct = (stepIndex / 5) * circumference;
                miniRingFill.style.strokeDashoffset = circumference - pct;
            }
            if (miniRingNum) {
                miniRingNum.textContent = `0${stepIndex}`;
            }

            // Remove fade-out to trigger slide/fade-in
            contentBlock.classList.remove('fade-out');
        }, 400);
    }

    // 4. Render Blueprint Dashboard
    function renderBlueprint() {
        contentBlock.classList.add('fade-out');
        if (footerBlock) footerBlock.style.display = 'none';

        const activeProducts = [];
        if (selection.core !== 'exclude') activeProducts.push('core');
        if (selection.satiety !== 'exclude') activeProducts.push('satiety');
        if (selection.protein !== 'exclude') activeProducts.push('protein');
        if (selection.glucose !== 'exclude') activeProducts.push('glucose');
        if (selection.balance !== 'exclude') activeProducts.push('balance');

        const names = {
            core: 'STAKOR Core',
            protein: 'STAKOR Protein',
            satiety: 'STAKOR Satiety',
            glucose: 'STAKOR Glucose',
            balance: 'STAKOR Balance'
        };

        const optimizedScore = 76 + (activeProducts.length - 1) * 4;
        const scoreDiff = (activeProducts.length - 1) * 4;

        setTimeout(() => {
            // Recommendations list html
            let recHtml = '';
            activeProducts.forEach(prod => {
                recHtml += `
                    <div class="rec-system-row">
                        <div class="rec-system-info">
                            <span class="rec-sys-icon ${prod}"></span>
                            <span class="rec-sys-title">${names[prod]}</span>
                        </div>
                        <span class="rec-sys-tag primary">${prod === 'core' ? 'Foundational' : 'Recommended'}</span>
                    </div>
                `;
            });

            contentBlock.innerHTML = `
                <div class="blueprint-dashboard">
                    <span class="step-badge">SYSTEM ANALYSIS</span>
                    <h2 class="step-title" style="font-size: 32px;">Your Personalized Stack</h2>
                    
                    <div class="assessment-ai-orb-container">
                        <div class="glass-orb" id="assessment-glass-orb-target">
                            <div class="orb-inner-glow"></div>
                        </div>
                    </div>
                    
                    <div class="score-badge-card">
                        <span class="score-label">OS Health Impact Projection</span>
                        <div class="scores-row-display">
                            <div class="score-num-item">
                                <span class="lbl">Baseline</span>
                                <span class="val">76</span>
                            </div>
                            <div class="score-diff-badge">+${scoreDiff} Score</div>
                            <div class="score-num-item projected">
                                <span class="lbl">Optimized</span>
                                <span class="val">${optimizedScore}</span>
                            </div>
                        </div>
                    </div>

                    <div class="blueprint-products-rec">
                        <span class="rec-title-header">Active Systems in Stack</span>
                        <div id="blueprint-recommendations-list">
                            ${recHtml}
                        </div>
                    </div>

                    <div class="biomarker-progress-section">
                        <span class="rec-title-header">Projected Biomarker Gains</span>
                        
                        <!-- Energy -->
                        <div class="biomarker-row">
                            <div class="biomarker-top">
                                <span class="biomarker-lbl">Energy Level</span>
                                <span class="biomarker-val" id="metric-energy-val">+0%</span>
                            </div>
                            <div class="biomarker-track">
                                <div class="biomarker-fill" id="metric-energy-fill"></div>
                            </div>
                        </div>

                        <!-- Recovery -->
                        <div class="biomarker-row">
                            <div class="biomarker-top">
                                <span class="biomarker-lbl">Cellular Recovery</span>
                                <span class="biomarker-val" id="metric-recovery-val">+0%</span>
                            </div>
                            <div class="biomarker-track">
                                <div class="biomarker-fill" id="metric-recovery-fill"></div>
                            </div>
                        </div>

                        <!-- Focus -->
                        <div class="biomarker-row">
                            <div class="biomarker-top">
                                <span class="biomarker-lbl">Cognitive Focus</span>
                                <span class="biomarker-val" id="metric-focus-val">+0%</span>
                            </div>
                            <div class="biomarker-track">
                                <div class="biomarker-fill" id="metric-focus-fill"></div>
                            </div>
                        </div>

                        <!-- Metabolism -->
                        <div class="biomarker-row">
                            <div class="biomarker-top">
                                <span class="biomarker-lbl">Metabolism Stability</span>
                                <span class="biomarker-val" id="metric-metabolism-val">+0%</span>
                            </div>
                            <div class="biomarker-track">
                                <div class="biomarker-fill" id="metric-metabolism-fill"></div>
                            </div>
                        </div>
                    </div>

                    <button type="button" class="btn-apply-blueprint" id="apply-blueprint-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>Apply Stack to Membership</span>
                    </button>
                    
                    <button type="button" class="btn-restart-assessment" id="restart-assessment-btn">
                        Reconfigure Systems
                    </button>
                </div>
            `;

            // Move pre-warmed spline-viewer from background container to the results card target orb
            const prewarmedViewer = document.querySelector('#prewarmed-ai-face-container spline-viewer');
            const targetOrb = document.getElementById('assessment-glass-orb-target');
            if (prewarmedViewer && targetOrb) {
                targetOrb.appendChild(prewarmedViewer);
            }

            // Wire apply stack click handler
            document.getElementById('apply-blueprint-btn').addEventListener('click', () => {
                window.location.href = `/subscribe?applyStack=true&products=${activeProducts.join(',')}`;
            });

            // Wire reconfigure click handler
            document.getElementById('restart-assessment-btn').addEventListener('click', () => {
                // Move the prewarmed viewer back to the background container to preserve it for next attempts
                const viewer = document.querySelector('#assessment-glass-orb-target spline-viewer');
                const backgroundContainer = document.getElementById('prewarmed-ai-face-container');
                if (viewer && backgroundContainer) {
                    backgroundContainer.appendChild(viewer);
                }
                goToStep(1);
            });

            // Remove the Spline logo watermark from the Glass Orb spline-viewer shadow DOM in assessment
            let splineAttempts = 0;
            const splineLogoInterval = setInterval(() => {
                const viewer = document.querySelector('.assessment-ai-orb-container spline-viewer');
                if (viewer) {
                    hideSplineLogo(viewer);
                    if (viewer.shadowRoot && viewer.shadowRoot.querySelector('#hide-logo-style')) {
                        clearInterval(splineLogoInterval);
                    }
                }
                splineAttempts++;
                if (splineAttempts > 100) {
                    clearInterval(splineLogoInterval);
                }
            }, 100);

            contentBlock.classList.remove('fade-out');

            // Animate progress bars for results
            const targets = {
                energy: selection.protein !== 'exclude' ? 72 : 40,
                recovery: selection.balance !== 'exclude' ? 68 : 35,
                focus: selection.core !== 'exclude' ? 60 : 30,
                metabolism: selection.glucose !== 'exclude' ? 55 : 25
            };

            Object.keys(targets).forEach(key => {
                const fillEl = document.getElementById(`metric-${key}-fill`);
                const valEl = document.getElementById(`metric-${key}-val`);
                const targetVal = targets[key];

                if (fillEl) {
                    gsap.to(fillEl, {
                        width: `${targetVal}%`,
                        duration: 1.2,
                        ease: "power2.out",
                        delay: 0.2
                    });
                }

                if (valEl) {
                    const countObj = { val: 0 };
                    gsap.to(countObj, {
                        val: targetVal,
                        duration: 1.2,
                        ease: "power2.out",
                        delay: 0.2,
                        onUpdate: () => {
                            valEl.textContent = `+${Math.round(countObj.val / 4)}%`;
                        }
                    });
                }
            });

        }, 400);
    }

    // Scroll snapping core transitions
    function transitionToStep(stepIndex) {
        // Toggle Nav visibility (only visible on step 1)
        const nav = document.querySelector('.assessment-nav');
        if (nav) {
            if (stepIndex === 1) {
                nav.classList.remove('hidden');
            } else {
                nav.classList.add('hidden');
            }
        }

        // Toggle Scroll Down visibility (only visible on step 1)
        const scrollBtn = document.getElementById('scrollDownBtn');
        if (scrollBtn) {
            if (stepIndex === 1) {
                scrollBtn.classList.remove('hidden');
            } else {
                scrollBtn.classList.add('hidden');
            }
        }

        if (footerBlock) {
            footerBlock.style.display = stepIndex > 5 ? 'none' : 'flex';
        }

        renderStep(stepIndex);

        // Calculate positions based on viewport mode
        const isMobile = window.innerWidth <= 768;
        const state = isMobile ? mobileLayouts[stepIndex] : desktopLayouts[stepIndex];
        
        const splineWrapper = document.querySelector('.spline-wrapper');
        const stepCard = document.querySelector('.step-card');

        // Dynamic transition speeds: much snappier animations on mobile viewports
        const duration = isMobile ? 0.7 : 1.4;
        const rotationDuration = isMobile ? 0.8 : 1.6;

        // 1. Move DNA container
        if (splineWrapper) {
            gsap.to(splineWrapper, {
                x: state.dnaX,
                y: state.dnaY,
                duration: duration,
                ease: "power2.out"
            });
        }

        // 2. Scale viewer canvas
        const viewerEl = document.querySelector('spline-viewer');
        if (viewerEl) {
            gsap.to(viewerEl, {
                scale: state.dnaScale,
                duration: duration,
                ease: "power2.out"
            });
        }

        // 3. Move Step Card
        if (stepCard) {
            gsap.to(stepCard, {
                x: state.cardX,
                y: state.cardY,
                duration: duration,
                ease: "power2.out"
            });
        }

        // 4. Rotate 3D scene elements inside Spline
        if (splineApp && splineApp.scene) {
            const rotationY = Math.PI * 0.45 * stepIndex;
            const rotationX = (stepIndex % 2 === 0 ? 0.12 : -0.12);

            gsap.to(splineApp.scene.rotation, {
                x: rotationX,
                y: rotationY,
                duration: rotationDuration,
                ease: "power2.out"
            });
        }

        // 5. Shift ambient glow halos subtly on step change
        const haloBlue = document.querySelector('.step-card .card-glow-halo.blue');
        const haloPurple = document.querySelector('.step-card .card-glow-halo.purple');
        if (haloBlue) {
            gsap.to(haloBlue, {
                x: (stepIndex % 2 === 0 ? "35px" : "-35px"),
                y: (stepIndex % 3 === 0 ? "25px" : "-25px"),
                scale: 1 + (stepIndex * 0.05),
                duration: 1.6,
                ease: "power2.out"
            });
        }
        if (haloPurple) {
            gsap.to(haloPurple, {
                x: (stepIndex % 2 === 0 ? "-25px" : "45px"),
                y: (stepIndex % 3 === 0 ? "45px" : "-15px"),
                scale: 1 + (stepIndex * 0.05),
                duration: 1.6,
                ease: "power2.out"
            });
        }

        // 6. Drift card particles subtly on transition
        const particles = document.querySelector('.card-particles');
        if (particles) {
            gsap.fromTo(particles, 
                { x: (stepIndex % 2 === 0 ? -12 : 12), y: (stepIndex % 2 === 0 ? -12 : 12) },
                { x: 0, y: 0, duration: 1.5, ease: "power2.out" }
            );
        }

        // 7. Dynamic glass refraction reflections shift (animating CSS variables)
        if (stepCard) {
            gsap.to(stepCard, {
                '--reflection-x1': (stepIndex % 2 === 0 ? '20%' : '-20%'),
                '--reflection-y1': (stepIndex % 3 === 0 ? '15%' : '-15%'),
                '--reflection-x2': (stepIndex % 2 === 0 ? '-15%' : '20%'),
                '--reflection-y2': (stepIndex % 3 === 0 ? '115%' : '85%'),
                duration: 1.6,
                ease: "power2.out"
            });
        }
    }

    // 5. Scroll Storytelling Engine (Desktop: controlled step-by-step; Mobile: touch swipe gestures)
    let isTransitioning = false;

    function goToStep(stepIndex) {
        if (stepIndex < 1 || stepIndex > 6) return;
        if (isTransitioning) return;

        isTransitioning = true;
        currentActiveStep = stepIndex;
        
        transitionToStep(currentActiveStep);

        const isMobile = window.innerWidth <= 768;
        const scrollDuration = isMobile ? 0.6 : 1.0;

        // Smoothly scroll container to the correct step height via GSAP
        gsap.to(container, {
            scrollTop: (stepIndex - 1) * window.innerHeight,
            duration: scrollDuration,
            ease: "power2.inOut",
            onComplete: () => {
                // Throttle further scrolls slightly to allow snap transition to settle
                setTimeout(() => {
                    isTransitioning = false;
                }, 200);
            }
        });
    }

    // Desktop Window Wheel Listener (controlled transitions)
    window.addEventListener('wheel', (e) => {
        const isMobile = window.innerWidth <= 768;
        if (isMobile) return; // Ignore on mobile (uses native swipe)

        // Check if scrolling inside a scrollable card content area on the results page (step 6)
        const content = document.getElementById('card-content-block');
        if (content && currentActiveStep === 6) {
            const isOverCard = content.contains(e.target);
            const isScrollable = content.scrollHeight > content.clientHeight;
            if (isOverCard && isScrollable) {
                const scrollTop = content.scrollTop;
                const maxScroll = content.scrollHeight - content.clientHeight;
                const isScrollingUp = e.deltaY < 0;
                const isScrollingDown = e.deltaY > 0;

                // Let the native scroll handle card contents if not at borders
                if (isScrollingUp && scrollTop > 0) {
                    return;
                }
                if (isScrollingDown && scrollTop < maxScroll) {
                    return;
                }
            }
        }

        // Prevent standard free scrolling on window
        e.preventDefault();

        // Throttle small scroll inputs/jitters
        if (Math.abs(e.deltaY) < 15) return;

        if (e.deltaY > 0) {
            goToStep(currentActiveStep + 1);
        } else {
            goToStep(currentActiveStep - 1);
        }
    }, { passive: false });

    // Scroll Event Listener (Mobile Native Snapping - optimized for instant updates without debounce delay)
    if (container) {
        container.addEventListener('scroll', () => {
            const isMobile = window.innerWidth <= 768;
            if (!isMobile) return;

            const scrollY = container.scrollTop;
            const height = window.innerHeight;
            const stepIndex = Math.min(6, Math.max(1, Math.round(scrollY / height) + 1));

            if (stepIndex !== currentActiveStep) {
                currentActiveStep = stepIndex;
                transitionToStep(currentActiveStep);
            }
        });
    }

    // Next Button listener
    if (btnNext) {
        btnNext.addEventListener('click', () => {
            if (currentActiveStep < 6) {
                goToStep(currentActiveStep + 1);
            }
        });
    }

    // Scroll Down Button click listener
    const scrollDownBtn = document.getElementById('scrollDownBtn');
    if (scrollDownBtn) {
        scrollDownBtn.addEventListener('click', () => {
            goToStep(2);
        });
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

});
