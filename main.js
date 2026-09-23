
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initCreativeCursor();
  initHeroSlideshow();
  initVideoModal();
  initDonationModal();
  initGivingCalculator();
  initCounters();
  init3DTilt();
  initMobileDrawer();
  initAuthAndForms();
  initDashboardFeatures();
  initBackToTop();
  initHeaderScroll();
  initScrollReveal();
  initEventsSchedule();
  initTestimonialsCarousel();
  initFaqAccordion();
  initTaxCalculator();
  initCausesFilter();
  initTeamFlipCards();
  initButtonTextProtection();
  initMonthlyDispatchForm();
});


function initPreloader() {
  const preloader = document.getElementById('stacklyPreloader');
  if (!preloader) return;

  if (sessionStorage.getItem('skipStacklyPreloader') === 'true') {
    sessionStorage.removeItem('skipStacklyPreloader');
    preloader.remove();
    return;
  }

  const fill = document.getElementById('preloaderProgFill');
  const status = document.getElementById('preloaderStatus');
  let progress = 0;
  const startTime = performance.now();
  const totalDuration = 1200; 

  const statusMessages = [
    { at: 15, text: "Connecting Grassroots Drives..." },
    { at: 45, text: "Validating Salem Causes..." },
    { at: 75, text: "Readying Impact Transparency..." },
    { at: 96, text: "Ready!" }
  ];

  function dismissPreloader() {
    if (preloader.classList.contains('loaded')) return;
    if (fill) fill.style.width = '100%';
    if (status) status.textContent = "Ready!";
    
    setTimeout(() => {
      preloader.classList.add('loaded');
      setTimeout(() => {
        if (preloader.parentNode) {
          preloader.style.display = 'none';
        }
      }, 450);
    }, 150);
  }

  function step(now) {
    const elapsed = now - startTime;
    progress = Math.min(Math.floor((elapsed / totalDuration) * 100), 100);
    
    if (fill) fill.style.width = `${progress}%`;
    
    if (status) {
      for (let i = statusMessages.length - 1; i >= 0; i--) {
        if (progress >= statusMessages[i].at) {
          status.textContent = statusMessages[i].text;
          break;
        }
      }
    }

    if (progress < 100) {
      requestAnimationFrame(step);
    } else {
      dismissPreloader();
    }
  }

  requestAnimationFrame(step);

  
  setTimeout(dismissPreloader, 1600);
}

function initCreativeCursor() {
  const dot = document.querySelector('.custom-cursor-dot');
  const ring = document.querySelector('.custom-cursor-ring');
  if (!dot || !ring || window.innerWidth < 992) return;

  let canvas = document.getElementById('cursorCanvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'cursorCanvas';
    document.body.appendChild(canvas);
  }
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

    if (Math.random() > 0.45) {
      particles.push({
        x: mouseX,
        y: mouseY,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        size: Math.random() * 2.5 + 1.2,
        color: Math.random() > 0.4 ? '#ff5722' : '#146c5a',
        alpha: 0.85,
        decay: 0.035
      });
    }
  }, { passive: true });

  window.addEventListener('click', (e) => {
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 / 12) * i;
      const speed = Math.random() * 2.5 + 1.5;
      particles.push({
        x: e.clientX,
        y: e.clientY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 2,
        color: i % 2 === 0 ? '#ff5722' : '#ffa41b',
        alpha: 1,
        decay: 0.04
      });
    }
  });

  function renderCursor() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

    ctx.clearRect(0, 0, width, height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.fill();
    }
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  
  const hoverEls = document.querySelectorAll('a, button, .role-switch-card, .cause-card-3d, .compact-cause-card, .event-item-card, .csr-logo-badge, .preset-amt-btn, .project-card-charivo, .faq-question-btn, .blog-card-modern-charivo, .testimonial-thumb-item, .testimonial-circle-nav, .btn-blog-pill, input, select');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.classList.add('cursor-hover');
      dot.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      ring.classList.remove('cursor-hover');
      dot.classList.remove('cursor-hover');
    });
  });
}

function initHeroSlideshow() {
  const slides = document.querySelectorAll('.hero-slide');
  const textItems = document.querySelectorAll('.hero-text-item');
  const indicators = document.querySelectorAll('.hero-indicator-dot');
  const badgeEl = document.getElementById('heroBadgeText');
  if (slides.length === 0 || textItems.length === 0) return;

  let currentSlide = 0;
  const totalSlides = slides.length;
  let slideInterval = null;
  let isTransitioning = false;

  const badgeTexts = [
    "Give the Gift of Hope",
    "Empower Rural Education",
    "Pure Water For Every Village",
    "Immediate Disaster Response"
  ];

  function showSlide(index) {
    if (index === currentSlide || isTransitioning) return;
    isTransitioning = true;

    const prevIndex = currentSlide;
    currentSlide = index;

    
    slides.forEach((s, i) => {
      s.classList.remove('prev');
      if (i === prevIndex) {
        s.classList.add('prev');
      }
      s.classList.toggle('active', i === index);
    });

    textItems.forEach((t, i) => {
      t.classList.remove('prev');
      if (i === prevIndex) {
        t.classList.add('prev');
      }
      t.classList.toggle('active', i === index);
    });

    
    indicators.forEach((dot, i) => dot.classList.toggle('active', i === index));

    
    if (badgeEl && badgeTexts[index]) {
      badgeEl.style.opacity = '0';
      badgeEl.style.transform = 'translateY(-6px)';
      setTimeout(() => {
        badgeEl.textContent = badgeTexts[index];
        badgeEl.style.opacity = '1';
        badgeEl.style.transform = 'translateY(0)';
      }, 260);
    }

    
    setTimeout(() => {
      slides.forEach((s, i) => {
        if (i !== currentSlide) s.classList.remove('prev');
      });
      textItems.forEach((t, i) => {
        if (i !== currentSlide) t.classList.remove('prev');
      });
      isTransitioning = false;
    }, 1700);
  }

  function nextSlide() {
    let next = (currentSlide + 1) % totalSlides;
    showSlide(next);
  }

  
  function startSlideshow() {
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5200);
  }

  startSlideshow();

  
  indicators.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      if (idx === currentSlide || isTransitioning) return;
      showSlide(idx);
      startSlideshow();
    });
  });
}

function initVideoModal() {
  const openBtns = document.querySelectorAll('.btn-video-play-pulse, .trigger-video-modal');
  const modal = document.getElementById('videoLightboxModal');
  if (!modal) return;

  const video = modal.querySelector('video');
  const closeBtn = modal.querySelector('.video-lightbox-close');

  function openModal(videoSrc) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (video) {
      if (videoSrc) {
        const source = video.querySelector('source');
        if (source && source.getAttribute('src') !== videoSrc) {
          source.setAttribute('src', videoSrc);
          video.load();
        }
      }
      video.currentTime = 0;
      video.play().catch(e => console.log('Autoplay deferred:', e));
    }
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    if (video) {
      video.pause();
    }
  }

  openBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    const videoSrc = btn.getAttribute('data-video');
    openModal(videoSrc);
  }));

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });
}

function initDonationModal() {
  const donationBtns = document.querySelectorAll('.trigger-donation-modal');
  const modalEl = document.getElementById('donationModal');
  const causeNameInput = document.getElementById('modalCauseSelect');
  const customAmtInput = document.getElementById('customAmountInput');
  const presetBtns = document.querySelectorAll('.preset-amt-btn');
  const freqRadios = document.querySelectorAll('input[name="donationFreq"]');
  const donationForm = document.getElementById('donationFormModal');

  
  let causeContainer = document.getElementById('customCauseSelectBox');
  let causeTrigger = document.getElementById('customCauseTrigger');
  let causeLabel = document.getElementById('customCauseLabel');
  let causeMenu = document.getElementById('customCauseMenu');

  
  if (causeNameInput && !causeContainer) {
    causeNameInput.classList.add('d-none');
    causeContainer = document.createElement('div');
    causeContainer.className = 'custom-cause-select-container';
    causeContainer.id = 'customCauseSelectBox';

    const selectedIdx = causeNameInput.selectedIndex >= 0 ? causeNameInput.selectedIndex : 0;
    const selectedOpt = causeNameInput.options[selectedIdx] || { text: 'Select Cause', value: '' };

    causeTrigger = document.createElement('button');
    causeTrigger.type = 'button';
    causeTrigger.className = 'custom-cause-trigger';
    causeTrigger.id = 'customCauseTrigger';
    causeTrigger.setAttribute('aria-haspopup', 'listbox');
    causeTrigger.setAttribute('aria-expanded', 'false');
    causeTrigger.innerHTML = `<span class="custom-cause-trigger-text" id="customCauseLabel">${selectedOpt.text}</span><i class="fa-solid fa-chevron-down custom-cause-arrow"></i>`;

    causeMenu = document.createElement('div');
    causeMenu.className = 'custom-cause-dropdown-menu';
    causeMenu.id = 'customCauseMenu';
    causeMenu.setAttribute('role', 'listbox');

    Array.from(causeNameInput.options).forEach((opt, idx) => {
      const optDiv = document.createElement('div');
      optDiv.className = 'custom-cause-option' + (idx === selectedIdx ? ' active' : '');
      optDiv.setAttribute('role', 'option');
      optDiv.setAttribute('data-value', opt.value);
      optDiv.setAttribute('aria-selected', idx === selectedIdx ? 'true' : 'false');
      optDiv.innerHTML = `<span>${opt.text}</span><i class="fa-solid fa-check option-check"></i>`;
      causeMenu.appendChild(optDiv);
    });

    causeContainer.appendChild(causeTrigger);
    causeContainer.appendChild(causeMenu);
    causeNameInput.parentNode.insertBefore(causeContainer, causeNameInput.nextSibling);
    causeLabel = document.getElementById('customCauseLabel');
  }

  function syncCustomCauseSelection(valueOrIndex) {
    if (!causeNameInput) return;
    let selectedOption = null;
    if (typeof valueOrIndex === 'number') {
      causeNameInput.selectedIndex = valueOrIndex;
      selectedOption = causeNameInput.options[valueOrIndex];
    } else {
      for (let i = 0; i < causeNameInput.options.length; i++) {
        if (causeNameInput.options[i].value === valueOrIndex || causeNameInput.options[i].text.includes(valueOrIndex)) {
          causeNameInput.selectedIndex = i;
          selectedOption = causeNameInput.options[i];
          break;
        }
      }
    }
    if (selectedOption) {
      if (causeLabel) causeLabel.textContent = selectedOption.text;
      if (causeMenu) {
        causeMenu.querySelectorAll('.custom-cause-option').forEach(opt => {
          const isMatch = opt.getAttribute('data-value') === selectedOption.value;
          opt.classList.toggle('active', isMatch);
          opt.setAttribute('aria-selected', isMatch ? 'true' : 'false');
        });
      }
    }
  }

  if (causeTrigger && causeContainer && causeMenu) {
    causeTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = causeContainer.classList.contains('open');
      if (isOpen) {
        causeContainer.classList.remove('open');
        causeTrigger.setAttribute('aria-expanded', 'false');
      } else {
        causeContainer.classList.add('open');
        causeTrigger.setAttribute('aria-expanded', 'true');
      }
    });

    causeMenu.addEventListener('click', (e) => {
      const option = e.target.closest('.custom-cause-option');
      if (!option) return;
      e.stopPropagation();
      const val = option.getAttribute('data-value');
      syncCustomCauseSelection(val);
      causeContainer.classList.remove('open');
      causeTrigger.setAttribute('aria-expanded', 'false');
      causeNameInput.dispatchEvent(new Event('change'));
    });

    document.addEventListener('click', (e) => {
      if (!causeContainer.contains(e.target)) {
        causeContainer.classList.remove('open');
        causeTrigger.setAttribute('aria-expanded', 'false');
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        causeContainer.classList.remove('open');
        causeTrigger.setAttribute('aria-expanded', 'false');
      }
    });

    if (modalEl) {
      modalEl.addEventListener('hidden.bs.modal', () => {
        causeContainer.classList.remove('open');
        causeTrigger.setAttribute('aria-expanded', 'false');
      });
    }
  }

  
  donationBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const cause = btn.getAttribute('data-cause');
      if (cause && causeNameInput) {
        for (let i = 0; i < causeNameInput.options.length; i++) {
          if (causeNameInput.options[i].text.includes(cause) || causeNameInput.options[i].value === cause) {
            causeNameInput.selectedIndex = i;
            syncCustomCauseSelection(i);
            break;
          }
        }
      }
      if (modalEl && window.bootstrap) {
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
      }
    });
  });

  
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const val = btn.getAttribute('data-amt');
      if (customAmtInput) customAmtInput.value = val;
    });
  });

  if (customAmtInput) {
    customAmtInput.addEventListener('input', () => {
      presetBtns.forEach(b => {
        if (b.getAttribute('data-amt') === customAmtInput.value.trim()) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });
    });
  }

  
  if (donationForm) {
    donationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (modalEl && window.bootstrap) {
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
      }
      window.location.href = '404.html';
    });
  }
}

function downloadSimulatedReceipt(donation, donorName) {
  const receiptWindow = window.open('', '_blank');
  if (!receiptWindow) {
    alert('Please allow popups to view and print your 80G tax receipt.');
    return;
  }
  receiptWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Official Donation Receipt - Stackly</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #222; }
        .receipt-card { max-width: 680px; margin: 0 auto; border: 2px solid #0d473b; padding: 36px; border-radius: 12px; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #ff5722; padding-bottom: 16px; margin-bottom: 24px; }
        .logo { font-size: 24px; font-weight: 800; color: #0d473b; }
        .badge { background: #ff5722; color: #fff; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin: 24px 0; }
        th, td { padding: 12px 8px; border-bottom: 1px solid #eee; text-align: left; }
        th { color: #0d473b; font-weight: 700; }
        .footer { text-align: center; font-size: 12px; color: #777; margin-top: 30px; border-top: 1px dashed #ccc; padding-top: 16px; }
        @media print { .no-print { display: none; } }
      </style>
    </head>
    <body>
      <div class="receipt-card">
        <div class="header">
          <div>
            <div class="logo">STACKLY COMMUNITY FOUNDATION</div>
            <div style="font-size: 13px; color: #555;">MMR Complex, Chinna Thirupathi, Salem, TN 636008</div>
            <div style="font-size: 12px; color: #777;">Reg No: SLM/NGO/2026/8892 • PAN: AABTS9921E</div>
          </div>
          <div style="text-align: right;">
            <span class="badge">80G TAX EXEMPT</span>
            <div style="font-size: 13px; margin-top: 8px;"><strong>Date:</strong> ${donation.date}</div>
            <div style="font-size: 13px;"><strong>Receipt:</strong> ${donation.receiptNumber}</div>
          </div>
        </div>

        <h3 style="color: #0d473b; margin-top: 0;">OFFICIAL DONATION ACKNOWLEDGEMENT</h3>
        <p>Received with immense gratitude from <strong>${donorName}</strong> the sum of:</p>
        
        <table>
          <tr><th>Description / Cause</th><th>Transaction ID</th><th>Amount (INR)</th></tr>
          <tr>
            <td>${donation.cause}</td>
            <td>${donation.id}</td>
            <td><strong style="color: #0d473b; font-size: 16px;">${donation.amount}</strong></td>
          </tr>
        </table>

        <p style="font-size: 13px; line-height: 1.6; color: #444;">
          This donation is eligible for deduction under <strong>Section 80G</strong> of the Income Tax Act, 1961. Unique Document Identification Number (UDIN) has been digitally validated by Stackly Chinna Thirupathi Salem operations desk.
        </p>

        <div style="margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-end;">
          <div>
            <div style="font-size: 12px; color: #777;">Authorized Signatory</div>
            <div style="font-weight: bold; color: #0d473b;">Stackly Board of Trustees</div>
          </div>
          <button class="no-print" onclick="window.print()" style="background: #ff5722; color: #fff; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer;">
            Print / Save as PDF
          </button>
        </div>

        <div class="footer">
          Stackly Community Donation Platform • MMR Complex, Chinna Thirupathi, Salem - 636008 • contact@thestackly.org
        </div>
      </div>
    </body>
    </html>
  `);
  receiptWindow.document.close();
}

function initGivingCalculator() {
  const slider = document.getElementById('impactSlider');
  const amtDisplay = document.getElementById('impactAmtDisplay');
  const mealsCount = document.getElementById('impactMealsCount');
  const kitsCount = document.getElementById('impactKitsCount');
  const waterCount = document.getElementById('impactWaterCount');

  if (!slider) return;

  function updateImpact() {
    const val = parseInt(slider.value, 10);
    if (amtDisplay) amtDisplay.textContent = '₹' + val.toLocaleString('en-IN');
    if (mealsCount) mealsCount.textContent = Math.floor(val / 40);
    if (kitsCount) kitsCount.textContent = Math.floor(val / 850);
    if (waterCount) waterCount.textContent = (val * 4.5).toFixed(0);
  }

  slider.addEventListener('input', updateImpact);
  updateImpact();
}

function initCounters() {
  const counters = document.querySelectorAll('.stat-counter-number[data-target]');
  if (counters.length === 0) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const targetAttr = counter.getAttribute('data-target') || '0';
        const target = parseFloat(targetAttr);
        const prefix = counter.getAttribute('data-prefix') || '';
        const suffix = counter.getAttribute('data-suffix') || '';
        const hasDecimals = counter.hasAttribute('data-decimals') 
          ? parseInt(counter.getAttribute('data-decimals'), 10) 
          : (targetAttr.includes('.') ? 1 : 0);
        const duration = 1900; 

        setTimeout(() => {
          let startTime = null;
          counter.classList.add('counting-active');

          function animateCount(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            
            const easeOut = 1 - Math.pow(1 - progress, 2.6);
            const currentVal = easeOut * target;
            
            let formatted;
            if (hasDecimals > 0) {
              formatted = currentVal.toFixed(hasDecimals);
            } else {
              formatted = Math.floor(currentVal).toLocaleString('en-IN');
            }

            counter.textContent = prefix + formatted + suffix;

            if (progress < 1) {
              requestAnimationFrame(animateCount);
            } else {
              const finalFormatted = hasDecimals > 0 ? target.toFixed(hasDecimals) : target.toLocaleString('en-IN');
              counter.textContent = prefix + finalFormatted + suffix;
              counter.classList.remove('counting-active');
            }
          }

          requestAnimationFrame(animateCount);
        }, 150);

        obs.unobserve(counter);
      }
    });
  }, { 
    threshold: 0.05,
    rootMargin: '0px 0px 50px 0px'
  });

  counters.forEach(c => observer.observe(c));
}

function init3DTilt() {
  if (window.innerWidth < 992) return;
  const cards = document.querySelectorAll('.cause-card-3d, .charivo-feature-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

function initTeamFlipCards() {
  const cards = document.querySelectorAll('.team-flip-card');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('click', function(e) {
      
      if (e.target.closest('.team-social-btn')) {
        return;
      }
      
      if ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 991) {
        this.classList.toggle('is-flipped');
      }
    });
  });
}

function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('mobileDrawerBackdrop');
  const closeBtn = document.getElementById('mobileDrawerClose');

  if (!toggleBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('show');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  const drawerLinks = drawer.querySelectorAll('a');
  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  
  
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 992 && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
  });
}

function initAuthAndForms() {
  
  window.selectAuthRole = function(roleVal, cardEl) {
    if (!cardEl) return;
    const grid = cardEl.closest('.role-switcher-grid');
    if (grid) {
      grid.querySelectorAll('.role-switch-card').forEach(c => c.classList.remove('active'));
    }
    cardEl.classList.add('active');
    const hidden = document.getElementById('userRoleSelect') || document.getElementById('regRoleSelect');
    if (hidden) {
      hidden.value = roleVal;
    }
  };

  
  window.togglePasswordEye = function(inputId, iconEl) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const icon = iconEl.querySelector('i');
    if (input.type === 'password') {
      input.type = 'text';
      if (icon) {
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      }
    } else {
      input.type = 'password';
      if (icon) {
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    }
  };

  
  const signInForm = document.getElementById('signInForm');
  if (signInForm) {
    const roleInput = document.getElementById('userRoleSelect');
    const nameInput = document.getElementById('signInNameInput');
    const emailInput = document.getElementById('emailInput');
    const passInput = document.getElementById('passwordInput');

    const nameGroup = document.getElementById('signInNameGroup');
    const emailGroup = document.getElementById('emailGroup');
    const passGroup = document.getElementById('passGroup');

    if (nameInput) nameInput.addEventListener('input', () => nameGroup.classList.remove('has-error'));
    if (emailInput) emailInput.addEventListener('input', () => emailGroup.classList.remove('has-error'));
    if (passInput) passInput.addEventListener('input', () => passGroup.classList.remove('has-error'));

    signInForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const nameRegex = /^[A-Za-z\s]{2,50}$/;
      if (!nameInput || !nameRegex.test(nameInput.value.trim())) {
        nameGroup.classList.add('has-error');
        isValid = false;
      }

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        emailGroup.classList.add('has-error');
        isValid = false;
      }

      if (passInput.value.trim().length < 6) {
        passGroup.classList.add('has-error');
        isValid = false;
      }

      if (isValid) {
        const selectedRole = roleInput ? roleInput.value : 'donor';
        const userName = nameInput.value.trim();
        const userEmail = emailInput.value.trim();

        localStorage.setItem('userRole', selectedRole);
        localStorage.setItem('userEmail', userEmail);
        localStorage.setItem('userName', userName);
        localStorage.setItem('isLoggedIn', 'true');

        if (typeof Swal !== 'undefined') {
          showAccessSuccess(selectedRole, userName, 'signin').then(() => {
            sessionStorage.setItem('skipStacklyPreloader', 'true');
            if (selectedRole === 'admin') {
              window.location.href = 'admin-dashboard.html';
            } else {
              window.location.href = 'donor-dashboard.html';
            }
          });
        } else {
          window.location.href = selectedRole === 'admin' ? 'admin-dashboard.html' : 'donor-dashboard.html';
        }
      }
    });
  }

  
  const signUpForm = document.getElementById('signUpForm');
  if (signUpForm) {
    const roleInput = document.getElementById('regRoleSelect');
    const nameInput = document.getElementById('regNameInput');
    const emailInput = document.getElementById('regEmailInput');
    const passInput = document.getElementById('regPasswordInput');
    const confirmInput = document.getElementById('confirmPasswordInput');
    const termsCheck = document.getElementById('termsCheck');

    const nameGroup = document.getElementById('nameGroup');
    const emailGroup = document.getElementById('emailGroup');
    const passGroup = document.getElementById('passGroup');
    const confirmGroup = document.getElementById('confirmPassGroup');
    const termsGroup = document.getElementById('termsGroup');

    if (nameInput) nameInput.addEventListener('input', () => nameGroup.classList.remove('has-error'));
    if (emailInput) emailInput.addEventListener('input', () => emailGroup.classList.remove('has-error'));
    if (passInput) passInput.addEventListener('input', () => passGroup.classList.remove('has-error'));
    if (confirmInput) confirmInput.addEventListener('input', () => confirmGroup.classList.remove('has-error'));

    signUpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const nameRegex = /^[A-Za-z\s]{2,50}$/;
      if (!nameRegex.test(nameInput.value.trim())) {
        nameGroup.classList.add('has-error');
        isValid = false;
      }

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        emailGroup.classList.add('has-error');
        isValid = false;
      }

      if (passInput.value.trim().length < 6) {
        passGroup.classList.add('has-error');
        isValid = false;
      }

      if (confirmInput.value.trim() !== passInput.value.trim()) {
        confirmGroup.classList.add('has-error');
        isValid = false;
      }

      if (termsCheck && !termsCheck.checked) {
        if (termsGroup) termsGroup.classList.add('has-error');
        isValid = false;
      }

      if (isValid) {
        const selectedRole = roleInput ? roleInput.value : 'donor';
        const userEmail = emailInput.value.trim();
        const userName = nameInput.value.trim();

        localStorage.setItem('userRole', selectedRole);
        localStorage.setItem('userEmail', userEmail);
        localStorage.setItem('userName', userName);

        if (typeof Swal !== 'undefined') {
          showAccessSuccess(selectedRole, userName, 'signup').then(() => {
            sessionStorage.setItem('skipStacklyPreloader', 'true');
            window.location.href = 'signin.html';
          });
        } else {
          window.location.href = 'signin.html';
        }
      }
    });
  }

  
  const contactForm = document.getElementById('contactInquiryForm');
  if (contactForm) {
    const contactDept = document.getElementById('contactDept');
    const contactDeptContainer = document.getElementById('contactDeptSelectBox');
    const contactDeptTrigger = document.getElementById('contactDeptTrigger');
    const contactDeptLabel = document.getElementById('contactDeptLabel');
    const contactDeptMenu = document.getElementById('contactDeptMenu');

    const closeContactDeptMenu = () => {
      if (!contactDeptContainer || !contactDeptTrigger) return;
      contactDeptContainer.classList.remove('open');
      contactDeptTrigger.setAttribute('aria-expanded', 'false');
    };

    if (contactDept && contactDeptContainer && contactDeptTrigger && contactDeptLabel && contactDeptMenu) {
      contactDeptTrigger.addEventListener('click', (event) => {
        event.stopPropagation();
        const isOpen = contactDeptContainer.classList.toggle('open');
        contactDeptTrigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });

      contactDeptMenu.addEventListener('click', (event) => {
        const option = event.target.closest('.custom-cause-option');
        if (!option) return;
        event.stopPropagation();
        const value = option.getAttribute('data-value') || '';
        const selectedOption = [...contactDept.options].find(item => item.value === value);
        if (!selectedOption) return;

        contactDept.value = value;
        contactDeptLabel.textContent = selectedOption.textContent;
        contactDeptMenu.querySelectorAll('.custom-cause-option').forEach(item => {
          const isSelected = item === option;
          item.classList.toggle('active', isSelected);
          item.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        });
        contactDept.dispatchEvent(new Event('change', { bubbles: true }));
        closeContactDeptMenu();
      });

      document.addEventListener('click', (event) => {
        if (!contactDeptContainer.contains(event.target)) closeContactDeptMenu();
      });

      window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeContactDeptMenu();
      });
    }

    const contactFields = [
      { id: 'contactName', message: 'Please enter your full name.' },
      { id: 'contactEmail', message: 'Please enter a valid email address.' },
      { id: 'contactPhone', message: 'Please enter numbers only.' },
      { id: 'contactDept', message: 'Please select an inquiry desk.' },
      { id: 'contactMessage', message: 'Please enter your message.' }
    ];

    const clearContactFieldError = (field) => {
      const group = field.closest('.form-group-custom');
      const error = group ? group.querySelector('.form-error-msg') : null;
      field.classList.remove('error');
      if (group) group.classList.remove('has-error');
      if (error) {
        error.textContent = '';
        error.classList.remove('show');
      }
    };

    const showContactFieldError = (field, message) => {
      const group = field.closest('.form-group-custom');
      const error = group ? group.querySelector('.form-error-msg') : null;
      field.classList.add('error');
      if (group) group.classList.add('has-error');
      if (error) {
        error.textContent = message;
        error.classList.add('show');
      }
    };

    contactFields.forEach(({ id }) => {
      const field = document.getElementById(id);
      if (!field) return;
      field.addEventListener('input', () => {
        if (id === 'contactPhone') field.value = field.value.replace(/\D/g, '');
        clearContactFieldError(field);
      });
      field.addEventListener('change', () => clearContactFieldError(field));
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      contactFields.forEach(({ id, message }) => {
        const field = document.getElementById(id);
        if (!field) return;
        const isPhone = id === 'contactPhone';
        const hasValue = field.value.trim().length > 0;
        const validPhone = !isPhone || /^[0-9]+$/.test(field.value.trim());
        const validField = hasValue && validPhone && field.checkValidity();

        if (!validField) {
          showContactFieldError(field, isPhone && hasValue ? message : message);
          isValid = false;
        } else {
          clearContactFieldError(field);
        }
      });

      if (!isValid) return;

      window.location.href = '404.html';
    });
  }
}

function showAccessSuccess(role, name, mode) {
  const isAdmin = role === 'admin';
  const roleLabel = isAdmin ? 'Salem Platform Admin' : 'Community Supporter';
  const actionLabel = mode === 'signup' ? 'Profile verified and ready' : 'Secure access confirmed';
  const destinationLabel = mode === 'signup'
    ? 'Your Salem impact profile is ready to use.'
    : `Good to see you, ${name}. Your community workspace is ready.`;
  return Swal.fire({
    title: mode === 'signup' ? 'Welcome to the Salem giving circle' : `Welcome back, ${name}`,
    html: `<div class="stackly-access-cue"><span class="stackly-access-icon"><i class="fa-solid ${isAdmin ? 'fa-shield-halved' : 'fa-hand-holding-heart'}"></i></span><div><strong>${actionLabel}</strong><small>${roleLabel} · Salem community network</small></div></div><p class="stackly-access-message">${destinationLabel}</p><div class="stackly-access-progress"><span></span></div><small class="stackly-access-note">Opening your ${isAdmin ? 'operations desk' : 'impact portal'} next...</small>`,
    background: '#104236',
    color: '#ffffff',
    showConfirmButton: false,
    timer: mode === 'signup' ? 2100 : 1700,
    timerProgressBar: true,
    customClass: { popup: 'stackly-access-popup' }
  });
}

function initDashboardFeatures() {
  
  const dashMenuToggle = document.getElementById('dashMenuToggle');
  const dashSidebar = document.getElementById('dashSidebar');
  const dashOverlay = document.getElementById('dashOverlay');

  if (dashMenuToggle && dashSidebar) {
    const setSidebarOpen = (isOpen) => {
      dashSidebar.classList.toggle('open', isOpen);
      dashMenuToggle.classList.toggle('open', isOpen);
      dashMenuToggle.setAttribute('aria-expanded', isOpen.toString());
      dashMenuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('dash-sidebar-open', isOpen);
      if (dashOverlay) {
        dashOverlay.classList.toggle('show', isOpen);
        dashOverlay.setAttribute('aria-hidden', (!isOpen).toString());
      }
    };

    const closeSidebar = () => setSidebarOpen(false);

    dashMenuToggle.addEventListener('click', () => {
      setSidebarOpen(!dashSidebar.classList.contains('open'));
    });

    if (dashOverlay) {
      dashOverlay.addEventListener('click', closeSidebar);
    }

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 992) closeSidebar();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeSidebar();
    });
  }

  
  const isAdminPage = document.title.toLowerCase().includes('admin');
  const savedName = localStorage.getItem('dashUserName') || localStorage.getItem('userName') || (isAdminPage ? 'Salem Admin' : 'Generous Supporter');
  const savedEmail = localStorage.getItem('dashUserEmail') || localStorage.getItem('userEmail') || (isAdminPage ? 'ops.salem@thestackly.org' : 'donor@stackly.org');
  const savedRole = localStorage.getItem('userRole') || 'donor';

  const userAvatarEl = document.getElementById('dashUserAvatar');
  const userNameEl = document.getElementById('dashUserName');
  const userEmailEl = document.getElementById('dashUserEmail');
  const welcomeNameEl = document.getElementById('dashWelcomeName');
  const topbarAvatarEl = document.getElementById('dashTopbarAvatar');
  const topbarNameEl = document.getElementById('dashTopbarName');
  const topbarEmailEl = document.getElementById('dashTopbarEmail');

  const initials = savedName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  if (userAvatarEl) userAvatarEl.textContent = initials;
  if (userNameEl) userNameEl.textContent = savedName;
  if (userEmailEl) userEmailEl.textContent = savedEmail;
  if (welcomeNameEl) welcomeNameEl.textContent = savedName.split(' ')[0] || savedName;
  if (topbarAvatarEl) topbarAvatarEl.textContent = initials;
  if (topbarNameEl) topbarNameEl.textContent = savedName;
  if (topbarEmailEl) topbarEmailEl.textContent = savedEmail;

  
  const navLinks = document.querySelectorAll('.dash-nav-link[data-section], .dash-sidebar__link[data-section]');
  const sections = document.querySelectorAll('.dash-section');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-section');
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      sections.forEach(s => {
        if (s.id === 'section-' + targetId) {
          s.classList.add('active');
          s.style.display = 'block';
        } else {
          s.classList.remove('active');
          s.style.display = 'none';
        }
      });

      
      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (dashSidebar && window.innerWidth < 992) {
        dashSidebar.classList.remove('open');
        document.body.classList.remove('dash-sidebar-open');
        dashMenuToggle && dashMenuToggle.classList.remove('open');
        dashMenuToggle && dashMenuToggle.setAttribute('aria-expanded', 'false');
        dashMenuToggle && dashMenuToggle.setAttribute('aria-label', 'Open menu');
        if (dashOverlay) {
          dashOverlay.classList.remove('show');
          dashOverlay.setAttribute('aria-hidden', 'true');
        }
      }
    });
  });

  
  const logoutBtns = document.querySelectorAll('.dash-logout-btn, #dashLogout');
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          title: 'Sign Out?',
          text: 'Are you sure you want to end your session?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#268f76',
          cancelButtonColor: '#6b7280',
          confirmButtonText: 'Yes, Sign Out',
          cancelButtonText: 'Stay',
          background: '#0d3d2a',
          color: '#fff'
        }).then((result) => {
          if (result.isConfirmed) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userRole');
            Swal.fire({
              title: 'Signed Out',
              text: 'You have safely ended your session.',
              icon: 'success',
              timer: 1400,
              showConfirmButton: false,
              background: '#0d3d2a',
              color: '#fff'
            }).then(() => {
              window.location.href = 'signin.html';
            });
          }
        });
      } else {
        if (confirm('Are you sure you want to sign out?')) {
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('userRole');
          window.location.href = 'signin.html';
        }
      }
    });
  });

  
  document.addEventListener('click', (e) => {
    if (e.target.closest('.action-download-receipt')) {
      e.preventDefault();
      window.location.href = '404.html';
    }
  });
}

function initBackToTop() {
  const btn = document.getElementById('backToTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initHeaderScroll() {
  const header = document.querySelector('.header-main');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  }, { passive: true });
}

function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.reveal-card, .reveal-left, .reveal-right, .reveal-bottom, .reveal-top, .reveal-up, .reveal-down, .reveal-init, .reveal-zoom, .reveal-flip'
  );
  if (revealElements.length === 0) return;

  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.02,
    rootMargin: '50px 0px 50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

function initEventsSchedule() {
  const dayBtns = document.querySelectorAll('.events-day-btn');
  const eventCards = document.querySelectorAll('.event-item-card');
  if (dayBtns.length === 0 || eventCards.length === 0) return;

  const eventData = {
    'day1': [
      { date: '25 Oct, 2026', time: '9:30 AM', loc: 'Chinna Thirupathi, Salem', title: 'Pediatric Medical & Heart Screening Camp', img: 'assets/cause_healthcare.webp' },
      { date: '25 Oct, 2026', time: '11:00 AM', loc: 'Salem West Ward', title: 'Free Diabetic Health Check for Elderly', img: 'assets/cause_elderly.webp' },
      { date: '25 Oct, 2026', time: '1:30 PM', loc: 'Shevaroy Foothills', title: 'Emergency Mobile Ambulance Health Outreach', img: 'assets/cause_disaster.webp' },
      { date: '25 Oct, 2026', time: '3:00 PM', loc: 'MMR Complex Salem', title: 'Volunteer First-Responder Workshop', img: 'assets/supporter_volunteer.webp' }
    ],
    'day2': [
      { date: '26 Oct, 2026', time: '10:00 AM', loc: 'Chinna Muniyappan School', title: 'Free School Kit & Digital Tabs Distribution', img: 'assets/cause_education.webp' },
      { date: '26 Oct, 2026', time: '12:00 PM', loc: 'Yercaud Tribal Belt', title: 'Rural Girls STEM Mentorship & Books Drive', img: 'assets/cause_education.webp' },
      { date: '26 Oct, 2026', time: '2:30 PM', loc: 'Salem Rural Center', title: 'Evening Digital Shelter Classrooms Launch', img: 'assets/cause_education.webp' },
      { date: '26 Oct, 2026', time: '4:00 PM', loc: 'Chinna Thirupathi', title: 'First-Gen Scholarship Award Ceremony', img: 'assets/supporter_educator.webp' }
    ],
    'day3': [
      { date: '27 Oct, 2026', time: '9:00 AM', loc: 'Ward 14 Dharmapuri Border', title: 'Solar-Powered Borewell Commissioning', img: 'assets/cause_water.webp' },
      { date: '27 Oct, 2026', time: '11:30 AM', loc: 'Suramangalam Ward', title: 'Dual-Stage RO Clean Tap Water Unveiling', img: 'assets/cause_water.webp' },
      { date: '27 Oct, 2026', time: '2:00 PM', loc: 'Salem Suburban Ward 9', title: 'Water Fluoride Testing Field Clinic', img: 'assets/cause_water.webp' },
      { date: '27 Oct, 2026', time: '4:30 PM', loc: 'Chinna Muniyappan Hall', title: 'Community Water Conservation Seminar', img: 'assets/supporter_patron.webp' }
    ],
    'day4': [
      { date: '28 Oct, 2026', time: '8:30 AM', loc: 'Salem Flood Lowland Depot', title: 'Monsoon Flood Rescue Cache Pre-Stocking', img: 'assets/cause_disaster.webp' },
      { date: '28 Oct, 2026', time: '11:00 AM', loc: 'Chinna Thirupathi Kitchen', title: '2,400 Hot Meals Packing Marathon', img: 'assets/cause_kitchen.webp' },
      { date: '28 Oct, 2026', time: '1:30 PM', loc: 'Salem Bus Terminal Outpost', title: '1,500 Thermal Blanket Night Drive Prep', img: 'assets/cause_elderly.webp' },
      { date: '28 Oct, 2026', time: '4:00 PM', loc: 'MMR Complex HQ', title: 'Annual Salem Donor Transparency Forum', img: 'assets/supporter_patron.webp' }
    ]
  };

  dayBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      dayBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const dayKey = btn.getAttribute('data-day') || 'day1';
      const items = eventData[dayKey] || eventData['day1'];

      eventCards.forEach((card, idx) => {
        if (!items[idx]) return;
        card.style.opacity = '0';
        card.style.transform = 'translateY(12px)';

        setTimeout(() => {
          const imgEl = card.querySelector('.event-item-thumb img');
          const dateEl = card.querySelector('.event-date-badge');
          const locEl = card.querySelector('.event-loc-text');
          const timeEl = card.querySelector('.event-time-text');
          const titleEl = card.querySelector('.event-item-title');

          if (imgEl) imgEl.src = items[idx].img;
          if (dateEl) dateEl.textContent = items[idx].date;
          if (locEl) locEl.textContent = items[idx].loc;
          if (timeEl) timeEl.textContent = items[idx].time;
          if (titleEl) titleEl.textContent = items[idx].title;

          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 120 + idx * 35);
      });
    });
  });
}

function initTestimonialsCarousel() {
  const stage = document.querySelector('.section-testimonials-charivo');
  if (!stage) return;

  const testimonialsData = [
    {
      image: 'assets/supporter_patron.webp',
      quote: "“A charity organization is built on the belief that every individual deserves dignity, opportunity, and hope. It serves as a bridge between those who want to help and those who need support, creating meaningful change through compassion,”",
      score: "4.8 (8.4k reviews)",
      name: "Michel Connor",
      role: "CEO & Community Founder"
    },
    {
      image: 'assets/supporter_educator.webp',
      quote: "“What moved me about Stackly is the complete transparency. When funding the rural girls' digital school kits in Yercaud foothills, GPS milestone photos and verified receipts were shared with full accountability within 48 hours,”",
      score: "4.9 (6.2k reviews)",
      name: "Deepika Ramachandran",
      role: "Education Initiative Supporter, Salem"
    },
    {
      image: 'assets/supporter_volunteer.webp',
      quote: "“During the monsoon flash floods near Chinna Muniyappan Kovil, Stackly's emergency team mobilized warm meals and medical first-aid in hours. Their grassroots speed and dedicated community response in Salem is unmatched,”",
      score: "4.8 (9.1k reviews)",
      name: "S. Rajendran",
      role: "Local Business Alliance & Relief Volunteer"
    }
  ];

  let currentIndex = 0;
  const mainAvatar = stage.querySelector('#testimonialMainImg');
  const quoteEl = stage.querySelector('#testimonialQuoteText');
  const scoreEl = stage.querySelector('#testimonialScore');
  const nameEl = stage.querySelector('#testimonialAuthorName');
  const roleEl = stage.querySelector('#testimonialAuthorRole');
  const track = stage.querySelector('.testimonial-thumbs-container');
  const thumbItems = stage.querySelectorAll('.testimonial-thumb-item');
  const prevBtn = stage.querySelector('#btnTestimonialPrev');
  const nextBtn = stage.querySelector('#btnTestimonialNext');

  let autoSlideTimer = null;

  function renderTestimonial(index) {
    if (!testimonialsData[index]) return;
    currentIndex = index;

    if (mainAvatar) {
      mainAvatar.style.opacity = '0';
      setTimeout(() => {
        mainAvatar.src = testimonialsData[index].image;
        mainAvatar.style.opacity = '1';
      }, 140);
    }

    if (quoteEl) {
      quoteEl.style.opacity = '0';
      setTimeout(() => {
        quoteEl.textContent = testimonialsData[index].quote;
        quoteEl.style.opacity = '1';
      }, 140);
    }

    if (nameEl) {
      nameEl.style.opacity = '0';
      setTimeout(() => {
        nameEl.textContent = testimonialsData[index].name;
        nameEl.style.opacity = '1';
      }, 140);
    }

    if (roleEl) {
      roleEl.style.opacity = '0';
      setTimeout(() => {
        roleEl.textContent = testimonialsData[index].role;
        roleEl.style.opacity = '1';
      }, 140);
    }

    if (scoreEl) scoreEl.textContent = testimonialsData[index].score;

    thumbItems.forEach((t) => {
      const idx = parseInt(t.getAttribute('data-index'), 10);
      t.classList.toggle('active', idx === index);
    });

    
    if (track && thumbItems.length >= 2) {
      const firstThumb = thumbItems[0];
      const secondThumb = thumbItems[1];
      const gap = Math.round(secondThumb.getBoundingClientRect().left - firstThumb.getBoundingClientRect().right);
      const step = firstThumb.offsetWidth + (gap > 0 ? gap : 18);
      track.style.transform = `translateX(-${index * step}px)`;
    }
  }

  function startAutoSlide() {
    stopAutoSlide();
    autoSlideTimer = setInterval(() => {
      const nextIdx = (currentIndex + 1) % testimonialsData.length;
      renderTestimonial(nextIdx);
    }, 3000); 
  }

  function stopAutoSlide() {
    if (autoSlideTimer) {
      clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    }
  }

  
  startAutoSlide();

  
  stage.addEventListener('mouseenter', stopAutoSlide);
  stage.addEventListener('mouseleave', startAutoSlide);

  thumbItems.forEach((thumb, idx) => {
    thumb.addEventListener('click', () => {
      renderTestimonial(idx);
      startAutoSlide();
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const nextIdx = (currentIndex - 1 + testimonialsData.length) % testimonialsData.length;
      renderTestimonial(nextIdx);
      startAutoSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const nextIdx = (currentIndex + 1) % testimonialsData.length;
      renderTestimonial(nextIdx);
      startAutoSlide();
    });
  }
}

function initFaqAccordion() {
  const faqCards = document.querySelectorAll('.faq-pill-card');
  if (!faqCards.length) return;

  faqCards.forEach(card => {
    const btn = card.querySelector('.faq-question-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = card.classList.contains('open');

      
      faqCards.forEach(c => {
        if (c !== card) c.classList.remove('open');
      });

      
      if (isOpen) {
        card.classList.remove('open');
      } else {
        card.classList.add('open');
      }
    });
  });
}

function initTaxCalculator() {
  const amountInput  = document.getElementById('taxInputAmount');
  const presetChips  = document.querySelectorAll('.tax-preset-chip');
  const slabRadios   = document.querySelectorAll('input[name="taxSlab"]');
  const savingsEl    = document.getElementById('taxSavingsDisplay');
  const deductionEl  = document.getElementById('taxDeductionBase');
  const effectiveEl  = document.getElementById('taxEffectiveCost');
  const donateBtnEl  = document.getElementById('taxDonateNowBtn');

  if (!amountInput || !savingsEl) return;

  function formatINR(val) {
    return '\u20B9' + Math.round(val).toLocaleString('en-IN');
  }

  function calculate() {
    const amount = parseFloat(amountInput.value) || 0;
    let slab = 0.30;
    slabRadios.forEach(r => { if (r.checked) slab = parseFloat(r.value); });

    const deductionBase = amount * 0.5;
    const savings       = deductionBase * slab * 1.04;
    const effectiveCost = amount - savings;

    if (savingsEl)   savingsEl.textContent   = formatINR(savings);
    if (deductionEl) deductionEl.textContent = formatINR(deductionBase);
    if (effectiveEl) effectiveEl.textContent = formatINR(Math.max(0, effectiveCost));

    if (donateBtnEl) donateBtnEl.dataset.amount = amount;
  }

  presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      presetChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      amountInput.value = chip.dataset.amt || '';
      calculate();
    });
  });

  amountInput.addEventListener('input', () => {
    presetChips.forEach(c => c.classList.remove('active'));
    calculate();
  });

  slabRadios.forEach(r => r.addEventListener('change', calculate));

  
  amountInput.value = '5000';
  const defaultChip = document.querySelector('.tax-preset-chip[data-amt="5000"]');
  if (defaultChip) defaultChip.classList.add('active');
  calculate();
}

function initCausesFilter() {

  
  const causeFilterBtns = document.querySelectorAll('.filter-btn:not(.blog-filter-btn)');
  const causeCols       = document.querySelectorAll('.cause-item-col');

  if (causeFilterBtns.length && causeCols.length) {
    causeFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        causeFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.category || 'all';
        causeCols.forEach(col => {
          const match = filter === 'all' || col.dataset.category === filter;
          col.style.display = match ? '' : 'none';
          if (match) {
            col.style.opacity = '0';
            requestAnimationFrame(() => {
              col.style.transition = 'opacity .35s ease';
              col.style.opacity    = '1';
            });
          }
        });
      });
    });
  }

  
  const blogFilterBtns = document.querySelectorAll('.blog-filter-btn');
  const storyCols      = document.querySelectorAll('.blog-story-col');

  if (blogFilterBtns.length && storyCols.length) {
    blogFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        blogFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.category || 'all';
        storyCols.forEach(col => {
          const match = filter === 'all' || col.dataset.category === filter;
          col.style.display = match ? '' : 'none';
          if (match) {
            col.style.opacity = '0';
            requestAnimationFrame(() => {
              col.style.transition = 'opacity .35s ease';
              col.style.opacity    = '1';
            });
          }
        });
      });
    });
  }
}

function initButtonTextProtection() {
  const btnSelector = '.btn-pill-teal, .btn-pill-orange, .btn-pill-outline, .btn-pill-outline-white, .btn-blog-pill, .btn-cta-verified-donate, .btn-whatsapp, .filter-btn, .blog-filter-btn';
  document.querySelectorAll(btnSelector).forEach(btn => {
    Array.from(btn.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
        const span = document.createElement('span');
        span.className = 'btn-text';
        span.textContent = node.textContent;
        btn.replaceChild(span, node);
      }
    });
  });
}


if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initButtonTextProtection();
}

function initMonthlyDispatchForm() {
  const form = document.getElementById('monthlyDispatchForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    window.location.href = '404.html';
  });
}

