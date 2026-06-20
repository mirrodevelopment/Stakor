/* ================================================================
   STAKOR SUBSCRIPTION PAGE — DYNAMIC JS ENGINE
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initBuilder();
    initFAQ();
    initCtaParticles();
    initSmoothScroll();
    initJourneyTracker();
    initNavbarHoverPill();
});

function initNavbarHoverPill() {
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
}

// Global State (Starts clean)
const state = {
    plan: null, // foundation, performance, complete, custom, or null
    products: new Set(),
    cycle: null // 15days, monthly, 3months, 6months, annual, or null
};

const products = {
    core: { name: 'Core', price: 1999, benefit: 'Auto delivery' },
    protein: { name: 'Protein', price: 1499, benefit: 'AI personalized' },
    satiety: { name: 'Satiety', price: 1299, benefit: 'Save up to 25%' },
    glucose: { name: 'Glucose', price: 999, benefit: 'Metabolic curve mitigation' },
    balance: { name: 'Balance', price: 899, benefit: 'Pause or cancel anytime' }
};

const cycleDiscounts = {
    '15days': 0,
    'monthly': 0,
    '3months': 0.10,
    '6months': 0.15,
    'annual': 0.25
};

const cycleMultipliers = {
    '15days': 0.5,
    'monthly': 1,
    '3months': 3,
    '6months': 6,
    'annual': 12
};

const cycleLabels = {
    '15days': '15 Days Cycle',
    'monthly': 'Monthly Cycle',
    '3months': '3 Months Cycle',
    '6months': '6 Months Cycle',
    'annual': 'Annual Cycle'
};

const cycleDeliveries = {
    '15days': 'Every 15 Days',
    'monthly': 'Every 30 Days',
    '3months': 'Every 3 Months',
    '6months': 'Every 6 Months',
    'annual': 'Every Year'
};

const displayNames = {
    '15days': '15 Days',
    'monthly': 'Monthly',
    '3months': '3 Months',
    '6months': '6 Months',
    'annual': 'Annual'
};

const cycleImpacts = {
    '15days': 5,
    'monthly': 12,
    '3months': 18,
    '6months': 24,
    'annual': 36
};

/* --- Custom Stack Builder Journey --- */
function initBuilder() {
    // 1. Selector references
    const planCards = document.querySelectorAll('.journey-plan-card');
    const selectorCards = document.querySelectorAll('.prod-selector-card');
    const cycleItems = document.querySelectorAll('.duration-card');
    const durationProgress = document.getElementById('journeyDurationProgress');

    // Live Engine refs
    const engineProductsCount = document.getElementById('engineProductsCount');
    const engineStackStrength = document.getElementById('engineStackStrength');
    const engineHealthImpact = document.getElementById('engineHealthImpact');
    const engineAiMatch = document.getElementById('engineAiMatch');
    const visualPlanNode = document.getElementById('visualPlanNode');
    const visualProductsList = document.getElementById('visualProductsList');
    const visualAddonsList = document.getElementById('visualAddonsList');
    const visualAddonsPills = document.getElementById('visualAddonsPills');

    // Dashboard refs
    const meterFillCircle = document.getElementById('meterFillCircle');
    const dashHealthScore = document.getElementById('dashHealthScore');
    
    const barSleepPct = document.getElementById('barSleepPct');
    const barSleepFill = document.getElementById('barSleepFill');
    const barEnergyPct = document.getElementById('barEnergyPct');
    const barEnergyFill = document.getElementById('barEnergyFill');
    const barRecoveryPct = document.getElementById('barRecoveryPct');
    const barRecoveryFill = document.getElementById('barRecoveryFill');
    const barMetabolismPct = document.getElementById('barMetabolismPct');
    const barMetabolismFill = document.getElementById('barMetabolismFill');

    const dashPlan = document.getElementById('dashPlan');
    const dashProducts = document.getElementById('dashProducts');
    const dashCycle = document.getElementById('dashCycle');
    const dashDelivery = document.getElementById('dashDelivery');
    const dashSavings = document.getElementById('dashSavings');
    const dashProjectedScore = document.getElementById('dashProjectedScore');
    const dashAiConfidence = document.getElementById('dashAiConfidence');
    const dashEffectiveness = document.getElementById('dashEffectiveness');

    // Final CTA refs
    const finalPlan = document.getElementById('finalPlan');
    const finalProductsCount = document.getElementById('finalProductsCount');
    const finalCycle = document.getElementById('finalCycle');
    const finalScore = document.getElementById('finalScore');
    const finalSavings = document.getElementById('finalSavings');
    const finalPriceAmount = document.getElementById('finalPriceAmount');
    const finalActivateBtn = document.getElementById('finalActivateBtn');

    // --- Step Gating Visibility & Locks ---
    function updateStepUnlocks() {
        const step2Unlocked = state.plan !== null;
        const step3Unlocked = state.plan !== null && state.products.size > 0;
        const step4Unlocked = state.plan !== null && state.products.size > 0 && state.cycle !== null;
        const step5Unlocked = step4Unlocked;

        const trackerSteps = document.querySelectorAll('.tracker-step');

        function toggleSection(blockId, isUnlocked) {
            const block = document.getElementById(blockId);
            if (block) {
                block.style.display = isUnlocked ? 'block' : 'none';
                
                // Toggle subsequent connector line
                let next = block.nextElementSibling;
                while (next && !next.classList.contains('journey-step-block')) {
                    if (next.classList.contains('journey-connector-line')) {
                        next.style.display = isUnlocked ? 'block' : 'none';
                        break;
                    }
                    next = next.nextElementSibling;
                }
            }
        }

        toggleSection('step-block-2', step2Unlocked);
        toggleSection('step-block-3', step3Unlocked);
        toggleSection('step-block-4', step4Unlocked);
        toggleSection('step-block-5', step5Unlocked);

        const guideTo2 = document.getElementById('guide-to-step-2');
        const guideTo3 = document.getElementById('guide-to-step-3');
        const guideTo4 = document.getElementById('guide-to-step-4');
        const guideTo5 = document.getElementById('guide-to-step-5');

        if (guideTo2) guideTo2.style.display = step2Unlocked ? 'flex' : 'none';
        if (guideTo3) guideTo3.style.display = step3Unlocked ? 'flex' : 'none';
        if (guideTo4) guideTo4.style.display = step4Unlocked ? 'flex' : 'none';
        if (guideTo5) guideTo5.style.display = step5Unlocked ? 'flex' : 'none';

        trackerSteps.forEach(step => {
            const targetId = step.dataset.stepTarget;
            let isLocked = false;
            
            if (targetId === 'step-block-2') isLocked = !step2Unlocked;
            else if (targetId === 'step-block-3') isLocked = !step3Unlocked;
            else if (targetId === 'step-block-4') isLocked = !step4Unlocked;
            else if (targetId === 'step-block-5') isLocked = !step5Unlocked;

            if (isLocked) {
                step.classList.add('locked');
            } else {
                step.classList.remove('locked');
            }
        });

        // Refresh GSAP ScrollTrigger bounds since steps are dynamically displayed
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }

    // --- Core UI Update Function ---
    function updateUI() {
        // --- STEP 1: Plan Tier Cards & Progression Sync ---
        planCards.forEach(card => {
            const planId = card.dataset.plan;
            card.classList.toggle('active', state.plan === planId);
        });

        // Progression line & node updates
        const nodeFoundation = document.getElementById('node-foundation');
        const nodePerformance = document.getElementById('node-performance');
        const nodeComplete = document.getElementById('node-complete');
        const tierProgressLine = document.getElementById('tierProgressLine');

        const hasCore = state.products.has('core');
        const hasProtein = state.products.has('protein');
        const hasSatiety = state.products.has('satiety');

        if (nodeFoundation) nodeFoundation.classList.toggle('active', hasCore);
        if (nodePerformance) nodePerformance.classList.toggle('active', hasCore && hasProtein && hasSatiety);
        if (nodeComplete) nodeComplete.classList.toggle('active', state.products.size === 5);

        if (tierProgressLine) {
            if (state.plan === 'foundation') {
                tierProgressLine.style.width = '0%';
            } else if (state.plan === 'performance') {
                tierProgressLine.style.width = '50%';
            } else if (state.plan === 'complete') {
                tierProgressLine.style.width = '100%';
            } else if (state.products.size > 0) {
                const percentage = Math.max(0, Math.min(100, ((state.products.size - 1) / 4) * 100));
                tierProgressLine.style.width = `${percentage}%`;
            } else {
                tierProgressLine.style.width = '0%';
            }
        }

        // --- STEP 2: Customize Stack ---
        selectorCards.forEach(card => {
            const prodId = card.dataset.productId;
            const isSelected = state.products.has(prodId);
            const toggleBtn = card.querySelector('.btn-toggle-product');

            card.classList.toggle('selected', isSelected);
            if (toggleBtn) {
                toggleBtn.textContent = isSelected ? 'Remove' : 'Add';
            }
        });

        // Recalculate bundle discount & subtotal
        let subtotal = 0;
        state.products.forEach(prodId => {
            if (products[prodId]) {
                subtotal += products[prodId].price;
            }
        });

        let bundleDiscount = 0;
        const prodCount = state.products.size;
        if (state.plan === 'foundation') {
            bundleDiscount = 0;
        } else if (state.plan === 'performance') {
            bundleDiscount = 798; // bundle discount: 4797 -> 3999
        } else if (state.plan === 'complete') {
            bundleDiscount = 696; // bundle discount: 6695 -> 5999
        } else {
            // custom stack bundles
            if (prodCount === 2) {
                bundleDiscount = Math.round(subtotal * 0.10);
            } else if (prodCount === 3) {
                bundleDiscount = Math.round(subtotal * 0.12);
            } else if (prodCount === 4) {
                bundleDiscount = Math.round(subtotal * 0.15);
            } else if (prodCount === 5) {
                bundleDiscount = 696;
            }
        }

        const baseDiscountedPrice = subtotal - bundleDiscount;

        // Recalculate cycle discount
        const cycleDiscountRate = state.cycle ? (cycleDiscounts[state.cycle] || 0) : 0;
        const cycleDiscount = Math.round(baseDiscountedPrice * cycleDiscountRate);
        const finalMonthlyPrice = baseDiscountedPrice - cycleDiscount;
        const totalMonthlySavings = bundleDiscount + cycleDiscount;
        const totalCycleSavings = state.cycle ? (totalMonthlySavings * (cycleMultipliers[state.cycle] || 1)) : totalMonthlySavings;

        // Update Live stats engine
        if (engineProductsCount) engineProductsCount.textContent = prodCount;
        
        let strength = 'None';
        if (prodCount === 1) strength = 'Low';
        else if (prodCount === 2) strength = 'Moderate';
        else if (prodCount === 3) strength = 'Strong';
        else if (prodCount >= 4) strength = 'Optimal';
        if (engineStackStrength) engineStackStrength.textContent = strength;

        // Calculate Stack impact
        let productsImpact = 0;
        if (state.products.has('core')) productsImpact += 18;
        if (state.products.has('protein')) productsImpact += 12;
        if (state.products.has('satiety')) productsImpact += 12;
        if (state.products.has('glucose')) productsImpact += 10;
        if (state.products.has('balance')) productsImpact += 8;
        if (engineHealthImpact) engineHealthImpact.textContent = `+${productsImpact}`;

        // Calculate AI Recommendation Match
        let aiMatch = 0;
        if (prodCount > 0) {
            if (state.products.has('core') && state.products.has('protein') && state.products.has('satiety') && prodCount === 3) {
                aiMatch = 92;
            } else if (prodCount === 5) {
                aiMatch = 98;
            } else if (state.products.has('core') && prodCount === 1) {
                aiMatch = 75;
            } else {
                aiMatch = Math.min(98, 50 + (prodCount * 8) + (state.products.has('core') ? 10 : 0) + (state.products.has('protein') ? 5 : 0));
            }
        }
        if (engineAiMatch) engineAiMatch.textContent = `${aiMatch}%`;

        // Populate Connection Flow
        const planDisplayNames = {
            foundation: 'Foundation Plan',
            performance: 'Performance Plan',
            complete: 'Complete Plan',
            custom: 'Custom Health Stack'
        };
        if (visualPlanNode) visualPlanNode.textContent = planDisplayNames[state.plan] || 'No Foundation Selected';

        if (visualProductsList) {
            if (prodCount === 0) {
                visualProductsList.innerHTML = '<span class="flow-prod-badge empty">No products in stack</span>';
            } else {
                visualProductsList.innerHTML = Array.from(state.products).map(id => `
                    <span class="flow-prod-badge ${id}">${products[id].name}</span>
                `).join('');
            }
        }

        const addonsList = Object.keys(products).filter(id => !state.products.has(id));
        if (visualAddonsList) {
            if (addonsList.length === 0 || state.plan === null) {
                visualAddonsList.style.display = 'none';
            } else {
                visualAddonsList.style.display = 'block';
                if (visualAddonsPills) {
                    visualAddonsPills.innerHTML = addonsList.map(id => `
                        <span class="addon-pill" data-product-id="${id}">+ ${products[id].name}</span>
                    `).join('');
                    
                    // wire addon pill clicks
                    visualAddonsPills.querySelectorAll('.addon-pill').forEach(pill => {
                        pill.addEventListener('click', () => {
                            const addId = pill.dataset.productId;
                            state.products.add(addId);
                            determinePlanFromProducts();
                            updateUI();
                        });
                    });
                }
            }
        }

        // --- STEP 3: Cycle Timeline Sync ---
        const timelinePlanNodeName = document.getElementById('timelinePlanNodeName');
        const timelineProductsCount = document.getElementById('timelineProductsCount');
        if (timelinePlanNodeName) timelinePlanNodeName.textContent = planDisplayNames[state.plan] || 'No Foundation Selected';
        if (timelineProductsCount) {
            timelineProductsCount.textContent = `${prodCount} Product${prodCount !== 1 ? 's' : ''}`;
        }

        cycleItems.forEach(item => {
            item.classList.toggle('active', item.dataset.cycle === state.cycle);
        });

        // Progress line mapping
        const progressMap = {
            '15days': 0,
            'monthly': 25,
            '3months': 50,
            '6months': 75,
            'annual': 100
        };
        if (durationProgress) {
            durationProgress.style.width = state.cycle ? `${progressMap[state.cycle]}%` : '0%';
        }

        // Cycle metadata summary text updates
        const cycleLiveSavings = document.getElementById('cycleLiveSavings');
        const cycleLiveHealth = document.getElementById('cycleLiveHealth');
        const cycleLiveDeliveries = document.getElementById('cycleLiveDeliveries');
        const cycleLivePriority = document.getElementById('cycleLivePriority');

        if (cycleLiveSavings) {
            const savingsPctMap = { '15days': '0%', 'monthly': '0%', '3months': '10%', '6months': '15%', 'annual': '25%' };
            cycleLiveSavings.textContent = state.cycle ? savingsPctMap[state.cycle] : '0%';
        }
        if (cycleLiveHealth) {
            cycleLiveHealth.textContent = state.cycle ? `+${cycleImpacts[state.cycle]}` : '+0';
        }
        if (cycleLiveDeliveries) {
            const delCountMap = { '15days': '24', 'monthly': '12', '3months': '4', '6months': '2', 'annual': '1' };
            cycleLiveDeliveries.textContent = state.cycle ? delCountMap[state.cycle] : '—';
        }
        if (cycleLivePriority) {
            const priorityMap = { '15days': 'Standard', 'monthly': 'Standard', '3months': 'Priority', '6months': 'Priority', 'annual': 'VIP Courier' };
            cycleLivePriority.textContent = state.cycle ? priorityMap[state.cycle] : '—';
        }

        // Step 1 Pricing cards update based on active cycle discount
        const plansObj = {
            foundation: 1999,
            performance: 3999,
            complete: 5999
        };
        for (const [key, bPrice] of Object.entries(plansObj)) {
            const priceEl = document.getElementById(`card-price-${key}`);
            if (priceEl) {
                const discountedPrice = Math.round(bPrice * (1 - cycleDiscountRate));
                if (cycleDiscountRate > 0) {
                    priceEl.innerHTML = `<span class="original-price" style="text-decoration: line-through; opacity: 0.5; font-size: 16px; margin-right: 8px;">₹${bPrice.toLocaleString('en-IN')}</span> ₹${discountedPrice.toLocaleString('en-IN')}<span>/mo</span>`;
                } else {
                    priceEl.innerHTML = `₹${bPrice.toLocaleString('en-IN')}<span>/mo</span>`;
                }
            }
        }

        // --- STEP 4: Personalized Dashboard ---
        const activeCycleImpact = state.cycle ? cycleImpacts[state.cycle] : 0;
        const finalHealthScoreVal = Math.min(100, 50 + productsImpact + activeCycleImpact);
        if (dashHealthScore) dashHealthScore.textContent = finalHealthScoreVal;

        if (meterFillCircle) {
            const offset = 314.16 * (1 - finalHealthScoreVal / 100);
            meterFillCircle.style.strokeDashoffset = offset;
        }

        // Health bars calculation
        const sleepPct = Math.min(25, 5 + (state.products.has('satiety') ? 7 : 0) + (state.products.has('balance') ? 12 : 0));
        const energyPct = Math.min(25, 8 + (state.products.has('protein') ? 10 : 0) + (state.products.has('glucose') ? 7 : 0));
        const recoveryPct = Math.min(25, 5 + (state.products.has('core') ? 10 : 0) + (state.products.has('protein') ? 8 : 0));
        const metabolismPct = Math.min(25, 4 + (state.products.has('glucose') ? 8 : 0) + (state.products.has('balance') ? 5 : 0));

        if (barSleepPct) barSleepPct.textContent = `+${sleepPct}%`;
        if (barSleepFill) barSleepFill.style.width = `${(sleepPct / 25) * 100}%`;
        if (barEnergyPct) barEnergyPct.textContent = `+${energyPct}%`;
        if (barEnergyFill) barEnergyFill.style.width = `${(energyPct / 25) * 100}%`;
        if (barRecoveryPct) barRecoveryPct.textContent = `+${recoveryPct}%`;
        if (barRecoveryFill) barRecoveryFill.style.width = `${(recoveryPct / 25) * 100}%`;
        if (barMetabolismPct) barMetabolismPct.textContent = `+${metabolismPct}%`;
        if (barMetabolismFill) barMetabolismFill.style.width = `${(metabolismPct / 25) * 100}%`;

        // Dashboard Summary Info List
        if (dashPlan) dashPlan.textContent = planDisplayNames[state.plan] || 'No Plan Selected';
        if (dashProducts) {
            dashProducts.textContent = prodCount > 0 ? Array.from(state.products).map(id => products[id].name).join(', ') : 'None';
        }
        if (dashCycle) dashCycle.textContent = state.cycle ? displayNames[state.cycle] : 'Not Selected';
        if (dashDelivery) dashDelivery.textContent = state.cycle ? cycleDeliveries[state.cycle] : 'None';
        if (dashSavings) {
            dashSavings.textContent = state.cycle ? `₹${Math.round(totalCycleSavings).toLocaleString('en-IN')}` : '₹0';
        }
        if (dashProjectedScore) dashProjectedScore.textContent = finalHealthScoreVal;
        if (dashAiConfidence) dashAiConfidence.textContent = `${aiMatch}%`;
        
        let effectiveness = 'Fair';
        if (finalHealthScoreVal >= 90) effectiveness = 'Optimal';
        else if (finalHealthScoreVal >= 75) effectiveness = 'Excellent';
        else if (finalHealthScoreVal >= 60) effectiveness = 'Good';
        if (dashEffectiveness) dashEffectiveness.textContent = prodCount > 0 ? effectiveness : 'None';

        // --- STEP 5: Final CTA block ---
        if (finalPlan) finalPlan.textContent = planDisplayNames[state.plan] || 'Choose Your Plan';
        if (finalProductsCount) {
            finalProductsCount.textContent = `${prodCount} Product${prodCount !== 1 ? 's' : ''}`;
        }
        if (finalCycle) finalCycle.textContent = state.cycle ? `${displayNames[state.cycle]} Cycle` : 'Cycle Not Configured';
        if (finalScore) finalScore.textContent = `${finalHealthScoreVal} Score`;
        if (finalSavings) {
            finalSavings.textContent = `You Save: ₹${Math.round(totalCycleSavings).toLocaleString('en-IN')}`;
        }
        if (finalPriceAmount) {
            finalPriceAmount.textContent = prodCount > 0 ? `₹${Math.round(finalMonthlyPrice).toLocaleString('en-IN')}/mo` : '₹0/mo';
        }

        if (finalActivateBtn) {
            const canActivate = prodCount > 0 && state.cycle !== null;
            finalActivateBtn.disabled = !canActivate;
            finalActivateBtn.style.opacity = canActivate ? '1' : '0.5';
            finalActivateBtn.style.cursor = canActivate ? 'pointer' : 'not-allowed';
        }

        // Apply progressive locks
        updateStepUnlocks();
    }

    function determinePlanFromProducts() {
        const size = state.products.size;
        const hasCore = state.products.has('core');
        const hasProtein = state.products.has('protein');
        const hasSatiety = state.products.has('satiety');

        if (size === 1 && hasCore) {
            state.plan = 'foundation';
        } else if (size === 3 && hasCore && hasProtein && hasSatiety) {
            state.plan = 'performance';
        } else if (size === 5) {
            state.plan = 'complete';
        } else {
            // Keep plan custom to maintain Step 2 open, even if count drops to 0
            state.plan = 'custom';
        }
    }

    // --- Event Bindings ---

    // 1. Step 1: Click Plan Cards & Selection Buttons
    planCards.forEach(card => {
        const planId = card.dataset.plan;
        const selectBtn = card.querySelector('.btn-select-plan');

        function applySelection() {
            if (state.plan === planId) {
                // Clicking active plan deselects it cleanly
                state.plan = null;
                state.products.clear();
                state.cycle = null;
            } else {
                state.plan = planId;
                state.products.clear();
                if (planId === 'foundation') {
                    state.products.add('core');
                } else if (planId === 'performance') {
                    state.products.add('core');
                    state.products.add('protein');
                    state.products.add('satiety');
                } else if (planId === 'complete') {
                    state.products.add('core');
                    state.products.add('protein');
                    state.products.add('satiety');
                    state.products.add('glucose');
                    state.products.add('balance');
                }
            }
            updateUI();

            if (state.plan !== null) {
                // Smooth scroll to Step 2
                const step2 = document.getElementById('step-block-2');
                if (step2) {
                    const offset = 140;
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = step2.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        }

        if (selectBtn) {
            selectBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                applySelection();
            });
        }

        card.addEventListener('click', (e) => {
            if (e.target !== selectBtn && !selectBtn.contains(e.target)) {
                applySelection();
            }
        });
    });

    // 2. Step 2: Custom Stack Cards & Add/Remove Toggles
    selectorCards.forEach(card => {
        const toggleBtn = card.querySelector('.btn-toggle-product');
        const prodId = card.dataset.productId;

        const handleProductToggle = (e) => {
            e.stopPropagation();
            if (state.products.has(prodId)) {
                state.products.delete(prodId);
            } else {
                state.products.add(prodId);
            }
            determinePlanFromProducts();
            updateUI();
        };

        if (toggleBtn) {
            toggleBtn.addEventListener('click', handleProductToggle);
        }
        card.addEventListener('click', (e) => {
            if (toggleBtn && (e.target === toggleBtn || toggleBtn.contains(e.target))) {
                return;
            }
            handleProductToggle(e);
        });
    });

    // 3. Step 3: Cycle cards selection
    cycleItems.forEach(item => {
        const selectBtn = item.querySelector('.btn-select-cycle');

        const applyCycleSelection = (e) => {
            e.stopPropagation();
            state.cycle = item.dataset.cycle;
            updateUI();

            // Smooth scroll to Step 4
            const step4 = document.getElementById('step-block-4');
            if (step4) {
                const offset = 140;
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = step4.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        };

        if (selectBtn) {
            selectBtn.addEventListener('click', applyCycleSelection);
        }
        item.addEventListener('click', (e) => {
            if (selectBtn && (e.target === selectBtn || selectBtn.contains(e.target))) {
                return;
            }
            applyCycleSelection(e);
        });
    });

    // 4. Step 5: Activate Button trigger payment Modal
    if (finalActivateBtn) {
        finalActivateBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (state.products.size > 0 && state.cycle !== null) {
                showSuccessModal();
            }
        });
    }

    // Modal success modal helper
    function showSuccessModal() {
        const modal = document.getElementById('successModal');
        const receiptPlan = document.getElementById('receiptPlan');
        const receiptCycle = document.getElementById('receiptCycle');
        const receiptProducts = document.getElementById('receiptProducts');
        const receiptDelivery = document.getElementById('receiptDelivery');
        const receiptTotal = document.getElementById('receiptTotal');

        const payPlan = document.getElementById('payPlan');
        const payCycle = document.getElementById('payCycle');
        const payPrice = document.getElementById('payPrice');
        const payButtonText = document.getElementById('payButtonText');

        const stepPayment = document.getElementById('stepPayment');
        const stepProcessing = document.getElementById('stepProcessing');
        const stepSuccess = document.getElementById('stepSuccess');
        const closeModalBtnEl = document.getElementById('closeModalBtn');
        const checkoutForm = document.getElementById('checkoutForm');
        const paymentErrorMsg = document.getElementById('paymentErrorMsg');

        if (stepPayment) stepPayment.style.display = 'block';
        if (stepProcessing) stepProcessing.style.display = 'none';
        if (stepSuccess) stepSuccess.style.display = 'none';
        if (closeModalBtnEl) closeModalBtnEl.style.display = 'flex';
        if (checkoutForm) checkoutForm.reset();
        if (paymentErrorMsg) paymentErrorMsg.style.display = 'none';

        let subtotal = 0;
        state.products.forEach(prodId => {
            if (products[prodId]) {
                subtotal += products[prodId].price;
            }
        });

        let bundleDiscount = 0;
        const prodCount = state.products.size;
        if (state.plan === 'foundation') {
            bundleDiscount = 0;
        } else if (state.plan === 'performance') {
            bundleDiscount = 798;
        } else if (state.plan === 'complete') {
            bundleDiscount = 696;
        } else {
            if (prodCount === 2) {
                bundleDiscount = Math.round(subtotal * 0.10);
            } else if (prodCount === 3) {
                bundleDiscount = Math.round(subtotal * 0.12);
            } else if (prodCount === 4) {
                bundleDiscount = Math.round(subtotal * 0.15);
            } else if (prodCount === 5) {
                bundleDiscount = 696;
            }
        }

        const baseDiscountedPrice = subtotal - bundleDiscount;
        const cycleDiscountRate = cycleDiscounts[state.cycle] || 0;
        const cycleDiscount = Math.round(baseDiscountedPrice * cycleDiscountRate);
        const finalMonthlyPrice = baseDiscountedPrice - cycleDiscount;

        const planDisplayNames = {
            foundation: 'Foundation Plan',
            performance: 'Performance Plan',
            complete: 'Complete Plan',
            custom: 'Custom Health Stack'
        };

        const activePlanName = planDisplayNames[state.plan] || 'Custom Health Stack';

        if (payPlan) payPlan.textContent = activePlanName;
        if (payCycle) payCycle.textContent = displayNames[state.cycle] || 'Monthly';
        if (payPrice) payPrice.textContent = `₹${finalMonthlyPrice.toLocaleString('en-IN')}/mo`;
        if (payButtonText) payButtonText.textContent = `Authorize & Pay ₹${finalMonthlyPrice.toLocaleString('en-IN')}/mo`;

        if (receiptPlan) receiptPlan.textContent = activePlanName;
        if (receiptCycle) receiptCycle.textContent = cycleLabels[state.cycle] || 'Monthly Cycle';
        if (receiptProducts) receiptProducts.textContent = `${prodCount} Active Essential${prodCount > 1 ? 's' : ''}`;
        if (receiptDelivery) receiptDelivery.textContent = cycleDeliveries[state.cycle] || 'Every 30 Days';
        if (receiptTotal) receiptTotal.textContent = `₹${finalMonthlyPrice.toLocaleString('en-IN')}/mo`;

        if (modal) {
            modal.classList.add('active');
        }
    }

    const modal = document.getElementById('successModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const goToDashboardBtn = document.getElementById('goToDashboardBtn');

    if (closeModalBtn && modal) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    if (goToDashboardBtn) {
        goToDashboardBtn.addEventListener('click', () => {
            window.location.href = '/universe';
        });
    }

    const submitPaymentBtn = document.getElementById('submitPaymentBtn');
    const cardExpiryInput = document.getElementById('cardExpiry');
    const cardNumberInput = document.getElementById('cardNumber');
    const cardCvvInput = document.getElementById('cardCvv');

    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 2) {
                e.target.value = value.slice(0, 2) + '/' + value.slice(2, 4);
            } else {
                e.target.value = value;
            }
        });
    }

    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '';
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formattedValue += ' ';
                }
                formattedValue += value[i];
            }
            e.target.value = formattedValue.slice(0, 19);
        });
    }

    if (cardCvvInput) {
        cardCvvInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
        });
    }

    if (submitPaymentBtn) {
        submitPaymentBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const cardName = document.getElementById('cardName').value.trim();
            const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
            const cardExpiry = document.getElementById('cardExpiry').value.trim();
            const cardCvv = document.getElementById('cardCvv').value.trim();
            const paymentErrorMsg = document.getElementById('paymentErrorMsg');

            if (!cardName || cardNumber.length < 15 || cardExpiry.length < 5 || cardCvv.length < 3) {
                if (paymentErrorMsg) {
                    paymentErrorMsg.textContent = 'Please fill out all payment details correctly.';
                    paymentErrorMsg.style.display = 'block';
                }
                return;
            }

            if (paymentErrorMsg) paymentErrorMsg.style.display = 'none';

            const stepPayment = document.getElementById('stepPayment');
            const stepProcessing = document.getElementById('stepProcessing');
            const stepSuccess = document.getElementById('stepSuccess');
            const closeModalBtnEl = document.getElementById('closeModalBtn');

            if (stepPayment) stepPayment.style.display = 'none';
            if (stepProcessing) stepProcessing.style.display = 'flex';
            if (closeModalBtnEl) closeModalBtnEl.style.display = 'none';

            setTimeout(() => {
                if (stepProcessing) stepProcessing.style.display = 'none';
                if (stepSuccess) stepSuccess.style.display = 'flex';
                if (closeModalBtnEl) closeModalBtnEl.style.display = 'flex';
            }, 2000);
        });
    }

    // Show breakdown modal
    function showBreakdownModal() {
        const modal = document.getElementById('breakdownModal');
        
        // References
        const breakdownPlan = document.getElementById('breakdownPlan');
        const breakdownProducts = document.getElementById('breakdownProducts');
        const breakdownCycle = document.getElementById('breakdownCycle');
        const breakdownDelivery = document.getElementById('breakdownDelivery');
        const breakdownScore = document.getElementById('breakdownScore');
        
        const breakdownSleep = document.getElementById('breakdownSleep');
        const breakdownEnergy = document.getElementById('breakdownEnergy');
        const breakdownRecovery = document.getElementById('breakdownRecovery');
        const breakdownMetabolism = document.getElementById('breakdownMetabolism');
        
        const breakdownSubtotal = document.getElementById('breakdownSubtotal');
        const breakdownBundleDiscount = document.getElementById('breakdownBundleDiscount');
        const breakdownCycleDiscount = document.getElementById('breakdownCycleDiscount');
        const breakdownTotalSavings = document.getElementById('breakdownTotalSavings');
        const breakdownTotal = document.getElementById('breakdownTotal');

        // Calculations
        let subtotal = 0;
        state.products.forEach(prodId => {
            if (products[prodId]) subtotal += products[prodId].price;
        });

        let bundleDiscount = 0;
        const prodCount = state.products.size;
        if (state.plan === 'foundation') {
            bundleDiscount = 0;
        } else if (state.plan === 'performance') {
            bundleDiscount = 798;
        } else if (state.plan === 'complete') {
            bundleDiscount = 696;
        } else {
            if (prodCount === 2) {
                bundleDiscount = Math.round(subtotal * 0.10);
            } else if (prodCount === 3) {
                bundleDiscount = Math.round(subtotal * 0.12);
            } else if (prodCount === 4) {
                bundleDiscount = Math.round(subtotal * 0.15);
            } else if (prodCount === 5) {
                bundleDiscount = 696;
            }
        }

        const baseDiscountedPrice = subtotal - bundleDiscount;
        const cycleDiscountRate = cycleDiscounts[state.cycle] || 0;
        const cycleDiscount = Math.round(baseDiscountedPrice * cycleDiscountRate);
        const finalMonthlyPrice = baseDiscountedPrice - cycleDiscount;
        const totalMonthlySavings = bundleDiscount + cycleDiscount;
        const totalCycleSavings = totalMonthlySavings * (cycleMultipliers[state.cycle] || 1);

        let productsImpact = 0;
        if (state.products.has('core')) productsImpact += 18;
        if (state.products.has('protein')) productsImpact += 12;
        if (state.products.has('satiety')) productsImpact += 12;
        if (state.products.has('glucose')) productsImpact += 10;
        if (state.products.has('balance')) productsImpact += 8;
        const activeCycleImpact = state.cycle ? cycleImpacts[state.cycle] : 0;
        const finalHealthScoreVal = Math.min(100, 50 + productsImpact + activeCycleImpact);

        const sleepPct = Math.min(25, 5 + (state.products.has('satiety') ? 7 : 0) + (state.products.has('balance') ? 12 : 0));
        const energyPct = Math.min(25, 8 + (state.products.has('protein') ? 10 : 0) + (state.products.has('glucose') ? 7 : 0));
        const recoveryPct = Math.min(25, 5 + (state.products.has('core') ? 10 : 0) + (state.products.has('protein') ? 8 : 0));
        const metabolismPct = Math.min(25, 4 + (state.products.has('glucose') ? 8 : 0) + (state.products.has('balance') ? 5 : 0));

        const planDisplayNames = {
            foundation: 'Foundation Plan',
            performance: 'Performance Plan',
            complete: 'Complete Plan',
            custom: 'Custom Health Stack'
        };

        const activePlanName = planDisplayNames[state.plan] || 'Custom Health Stack';
        const prodNames = Array.from(state.products).map(id => products[id].name).join(', ') || 'None';

        // Populate
        if (breakdownPlan) breakdownPlan.textContent = activePlanName;
        if (breakdownProducts) breakdownProducts.textContent = prodNames;
        if (breakdownCycle) breakdownCycle.textContent = displayNames[state.cycle] || 'Not Selected';
        if (breakdownDelivery) breakdownDelivery.textContent = cycleDeliveries[state.cycle] || 'None';
        if (breakdownScore) breakdownScore.textContent = `${finalHealthScoreVal} Score`;
        
        if (breakdownSleep) breakdownSleep.textContent = `+${sleepPct}%`;
        if (breakdownEnergy) breakdownEnergy.textContent = `+${energyPct}%`;
        if (breakdownRecovery) breakdownRecovery.textContent = `+${recoveryPct}%`;
        if (breakdownMetabolism) breakdownMetabolism.textContent = `+${metabolismPct}%`;
        
        if (breakdownSubtotal) breakdownSubtotal.textContent = `₹${subtotal.toLocaleString('en-IN')}/mo`;
        if (breakdownBundleDiscount) breakdownBundleDiscount.textContent = `-₹${bundleDiscount.toLocaleString('en-IN')}/mo`;
        if (breakdownCycleDiscount) breakdownCycleDiscount.textContent = `-₹${cycleDiscount.toLocaleString('en-IN')}/mo`;
        if (breakdownTotalSavings) breakdownTotalSavings.textContent = `₹${Math.round(totalCycleSavings).toLocaleString('en-IN')}`;
        if (breakdownTotal) breakdownTotal.textContent = `₹${Math.round(finalMonthlyPrice).toLocaleString('en-IN')}/mo`;

        if (modal) {
            modal.classList.add('active');
        }
    }

    // Bind Breakdown Modal buttons
    const breakdownModal = document.getElementById('breakdownModal');
    const closeBreakdownBtn1 = document.getElementById('closeBreakdownModalBtn');
    const closeBreakdownBtn2 = document.getElementById('closeBreakdownModalBtn2');
    const viewBreakdownBtn = document.querySelector('.btn-secondary-breakdown');

    if (viewBreakdownBtn) {
        viewBreakdownBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showBreakdownModal();
        });
    }

    function hideBreakdownModal() {
        if (breakdownModal) {
            breakdownModal.classList.remove('active');
        }
    }

    if (closeBreakdownBtn1) closeBreakdownBtn1.addEventListener('click', hideBreakdownModal);
    if (closeBreakdownBtn2) closeBreakdownBtn2.addEventListener('click', hideBreakdownModal);
    if (breakdownModal) {
        breakdownModal.addEventListener('click', (e) => {
            if (e.target === breakdownModal) {
                hideBreakdownModal();
            }
        });
    }

    // Initialize: check redirection from assessment results or start clean
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('applyStack') === 'true') {
        state.products.clear();
        const productsParam = urlParams.get('products');
        if (productsParam) {
            productsParam.split(',').forEach(p => {
                const prod = p.trim().toLowerCase();
                if (['core', 'protein', 'satiety', 'glucose', 'balance'].includes(prod)) {
                    state.products.add(prod);
                }
            });
        } else {
            state.products.add('core');
            state.products.add('protein');
            state.products.add('balance');
        }
        state.plan = 'custom';
        state.cycle = null;
    } else {
        state.products.clear();
        state.plan = null;
        state.cycle = null;
    }

    // 5. Visual Step Navigation Guide Buttons click handlers
    document.querySelectorAll('.guide-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = btn.dataset.target;
            const targetEl = document.getElementById(targetId);
            if (targetEl && targetEl.style.display !== 'none') {
                const offset = 140;
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = targetEl.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Initial sync
    updateUI();
}

/* --- FAQ Accordion --- */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            faqItems.forEach(i => {
                i.classList.remove('open');
                const ans = i.querySelector('.faq-answer');
                if (ans) ans.style.maxHeight = null;
            });

            if (!isOpen) {
                item.classList.add('open');
                if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
}

/* --- Particle Canvas Animation --- */
function initCtaParticles() {
    const canvas = document.getElementById('ctaCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h;

    function resize() {
        const dpr = window.devicePixelRatio || 1;
        w = canvas.parentElement.offsetWidth;
        h = canvas.parentElement.offsetHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.scale(dpr, dpr);
    }
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 40 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.8 + Math.random() * 1.5,
        speedX: (Math.random() - 0.5) * 0.12,
        speedY: (Math.random() - 0.5) * 0.12,
        alpha: 0.15 + Math.random() * 0.4
    }));

    function draw() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 0) p.x = w;
            if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h;
            if (p.y > h) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }
    draw();
}

/* --- Smooth Scrolling --- */
function initSmoothScroll() {
    function getAbsoluteTop(el) {
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = el.getBoundingClientRect().top;
        return elementRect - bodyRect;
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            // Check if step-block is hidden
            if (target && target.style.display !== 'none') {
                window.scrollTo({
                    top: getAbsoluteTop(target) - 140, // offset for sticky tracker
                    behavior: 'smooth'
                });
            }
        });
    });

    if (window.location.hash) {
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target && target.style.display !== 'none') {
                window.scrollTo({
                    top: getAbsoluteTop(target) - 140,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }
}

/* --- Connected Membership Journey Stepped Tracker & ScrollSpy --- */
function initJourneyTracker() {
    const trackerSteps = document.querySelectorAll('.tracker-step');
    const stepBlocks = document.querySelectorAll('.journey-step-block');

    // Clicking tracker steps scrolls smoothly
    trackerSteps.forEach(step => {
        step.addEventListener('click', () => {
            const targetId = step.dataset.stepTarget;
            const targetBlock = document.getElementById(targetId);
            
            // Do not click if it is locked
            if (step.classList.contains('locked')) {
                return;
            }

            if (targetBlock && targetBlock.style.display !== 'none') {
                const offset = 140;
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = targetBlock.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll spy to activate tracker step and step block highlight
    window.addEventListener('scroll', () => {
        let currentStepId = 'step-block-1';
        const offset = 220; // trigger early when block enters viewport

        stepBlocks.forEach(block => {
            // Only trace visible steps
            if (block.style.display !== 'none') {
                const blockTop = block.getBoundingClientRect().top + window.scrollY - offset;
                if (window.scrollY >= blockTop) {
                    currentStepId = block.id;
                }
            }
        });

        stepBlocks.forEach(block => {
            if (block.id === currentStepId) {
                block.classList.add('active');
            } else {
                block.classList.remove('active');
            }
        });

        trackerSteps.forEach(step => {
            if (step.dataset.stepTarget === currentStepId) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    });
}
