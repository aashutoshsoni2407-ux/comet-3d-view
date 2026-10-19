/**
 * AEGIS FOOTWEAR // UNIFIED SCROLL ANIMATION & INTERACTIVE PRODUCT CONTROLLER
 * Zero-Black-Screen Engine with nearest-frame fallback and fixed-curtain architecture
 */

(() => {
  'use strict';

  const TOTAL_FRAMES = 240;
  const FRAME_PREFIX = 'ezgif-frame-';
  const FRAME_EXT = '.jpg';

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const scrollSpacer = document.getElementById('scroll-spacer');
  const scrollHint = document.getElementById('scroll-hint');
  const loader = document.getElementById('loader');
  const loaderBar = document.getElementById('loader-bar');
  const loaderText = document.getElementById('loader-text');

  const images = [];
  let loadedCount = 0;
  let targetProgress = 0;
  let currentProgress = 0;
  const lerpFactor = 0.12; // Smooth tracking
  let lastFrameIndex = -1;
  let isReady = false;

  function getFrameSrc(index) {
    const frameNum = String(index + 1).padStart(3, '0');
    return `${FRAME_PREFIX}${frameNum}${FRAME_EXT}`;
  }

  // Preload all 240 frames
  function preloadImages() {
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameSrc(i);

      img.onload = () => {
        loadedCount++;
        const pct = Math.round((loadedCount / TOTAL_FRAMES) * 100);

        if (loaderBar) loaderBar.style.width = `${pct}%`;
        if (loaderText) loaderText.textContent = `INITIALIZING ${pct}%`;

        // Render first frame immediately
        if (i === 0 && lastFrameIndex === -1) {
          renderFrame(0);
        }

        // Unlock page as soon as initial batch is ready
        if (!isReady && (loadedCount >= 20 || loadedCount >= TOTAL_FRAMES)) {
          isReady = true;
          if (loader) {
            loader.classList.add('loaded');
            setTimeout(() => {
              if (loader) loader.style.display = 'none';
            }, 500);
          }
        }
      };

      img.onerror = () => {
        loadedCount++;
        if (!isReady && loadedCount >= 20) {
          isReady = true;
          if (loader) {
            loader.classList.add('loaded');
            setTimeout(() => {
              if (loader) loader.style.display = 'none';
            }, 500);
          }
        }
      };

      images.push(img);
    }
  }

  // Canvas Sizing (Hi-DPI)
  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    if (lastFrameIndex >= 0) {
      const current = lastFrameIndex;
      lastFrameIndex = -1;
      renderFrame(current);
    }
  }

  // Find the closest loaded image so the canvas NEVER shows a blank or black frame
  function getClosestAvailableImage(targetIndex) {
    if (images[targetIndex] && images[targetIndex].complete && images[targetIndex].naturalWidth > 0) {
      return images[targetIndex];
    }

    // Search outwards from targetIndex
    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const prev = targetIndex - offset;
      if (prev >= 0 && images[prev] && images[prev].complete && images[prev].naturalWidth > 0) {
        return images[prev];
      }
      const next = targetIndex + offset;
      if (next < TOTAL_FRAMES && images[next] && images[next].complete && images[next].naturalWidth > 0) {
        return images[next];
      }
    }
    return null;
  }

  // Render Frame with Aspect-Ratio Cover
  function renderFrame(index) {
    if (index === lastFrameIndex) return;

    const img = getClosestAvailableImage(index);
    if (!img) return;

    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      drawWidth = canvas.width;
      drawHeight = canvas.width / imgRatio;
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      drawWidth = canvas.height * imgRatio;
      drawHeight = canvas.height;
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = 0;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    lastFrameIndex = index;
  }

  // Calculate Scroll Progress
  function updateScrollProgress() {
    if (!scrollSpacer) return;
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const maxTravel = scrollSpacer.offsetHeight;

    if (maxTravel <= 0) return;

    // Progress goes from 0.0 at top to 1.0 when scrolling through the spacer
    targetProgress = Math.max(0, Math.min(1, scrollY / maxTravel));

    // Hide scroll hint once user scrolls past 50px
    if (scrollHint) {
      if (scrollY > 50) {
        scrollHint.style.opacity = '0';
      } else {
        scrollHint.style.opacity = '1';
      }
    }

    // Dynamic navbar glass effect
    const mainNav = document.getElementById('main-nav');
    if (mainNav) {
      if (scrollY > 40) {
        mainNav.classList.add('nav-scrolled');
      } else {
        mainNav.classList.remove('nav-scrolled');
      }
    }
  }

  // Animation Loop (Lerp Smoothing)
  function loop() {
    const diff = targetProgress - currentProgress;
    if (Math.abs(diff) > 0.0001) {
      currentProgress += diff * lerpFactor;
    } else {
      currentProgress = targetProgress;
    }

    const frameIndex = Math.min(
      TOTAL_FRAMES - 1,
      Math.max(0, Math.floor(currentProgress * (TOTAL_FRAMES - 1)))
    );

    renderFrame(frameIndex);

    // Fade COMET title on the first frame
    const brandOverlay = document.getElementById('brand-overlay');
    if (brandOverlay) {
      // Prominently visible on the first frame (progress = 0), fades out smoothly by progress ~0.10
      const fadeProgress = Math.min(1, currentProgress / 0.10);
      const opacity = Math.max(0, 1 - fadeProgress);
      const translateY = -fadeProgress * 30;
      brandOverlay.style.opacity = opacity.toFixed(3);
      brandOverlay.style.transform = `translateY(${translateY.toFixed(1)}px)`;
    }

    requestAnimationFrame(loop);
  }

  // Interactive 360 View Switcher
  window.selectAngle = function(element, angleName) {
    const parent = element.parentElement;
    parent.querySelectorAll('.angle-btn').forEach(btn => {
      btn.classList.remove('bg-primary', 'text-on-primary', 'font-bold');
      btn.classList.add('bg-surface-container-low', 'text-on-surface');
    });

    element.classList.remove('bg-surface-container-low', 'text-on-surface');
    element.classList.add('bg-primary', 'text-on-primary', 'font-bold');

    const scanImg = document.getElementById('scan-img');
    const frameNumber = element.getAttribute('data-frame') || '240';
    if (scanImg) {
      scanImg.style.opacity = '0.3';
      scanImg.style.transform = 'scale(0.97)';
      setTimeout(() => {
        scanImg.src = `ezgif-frame-${frameNumber}.jpg`;
        scanImg.style.opacity = '1';
        scanImg.style.transform = 'scale(1)';
      }, 150);
    }
  };

  // Order Modal Controllers
  const orderModal = document.getElementById('order-modal');
  const navOrderBtn = document.getElementById('nav-order-btn');
  const retailerOrderBtn = document.getElementById('retailer-order-btn');
  const closeOrderModal = document.getElementById('close-order-modal');
  const modalDoneBtn = document.getElementById('modal-done-btn');
  const orderForm = document.getElementById('order-form');
  const orderSuccessTicket = document.getElementById('order-success-ticket');
  const ticketId = document.getElementById('ticket-id');

  function openModal() {
    if (orderModal) {
      orderModal.classList.add('modal-open');
      if (orderForm) orderForm.style.display = 'flex';
      if (orderSuccessTicket) {
        orderSuccessTicket.classList.add('hidden');
        orderSuccessTicket.style.display = 'none';
      }
    }
  }

  function closeModal() {
    if (orderModal) {
      orderModal.classList.remove('modal-open');
    }
  }

  // Smooth Scroll for Navigation Anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          if (targetId === '#order-now-section') {
            setTimeout(() => {
              const nameInput = document.getElementById('order-cust-name');
              if (nameInput) nameInput.focus();
            }, 600);
          }
        }
      }
    });
  });

  // Modal Controllers
  if (closeOrderModal) closeOrderModal.addEventListener('click', closeModal);
  if (modalDoneBtn) modalDoneBtn.addEventListener('click', closeModal);

  // Close when clicking backdrop
  if (orderModal) {
    orderModal.addEventListener('click', (e) => {
      if (e.target === orderModal) closeModal();
    });
  }

  // Modal Size Selection
  const modalSizeBtns = document.querySelectorAll('.modal-size-btn');
  modalSizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modalSizeBtns.forEach(b => {
        b.classList.remove('bg-primary', 'text-black', 'active');
        b.classList.add('bg-surface-container-low', 'text-white');
      });
      btn.classList.remove('bg-surface-container-low', 'text-white');
      btn.classList.add('bg-primary', 'text-black', 'active');
    });
  });

  // Modal Order Submission
  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      if (ticketId) ticketId.innerText = randomCode;

      orderForm.style.display = 'none';
      if (orderSuccessTicket) {
        orderSuccessTicket.classList.remove('hidden');
        orderSuccessTicket.style.display = 'flex';
      }
    });
  }

  // =========================================================================
  // BOTTOM ORDER NOW SECTION CONTROLLERS (AT LAST)
  // =========================================================================
  let selectedColor = 'Onyx Cyber-Black';
  let selectedSize = 'US 9.5';
  let orderQuantity = 1;
  const BASE_PRICE_USD = 220;
  const BASE_PRICE_INR = 18499;

  // 1. Colorway Selection
  const colorBtns = document.querySelectorAll('#colorway-buttons .color-btn');
  const colorLabel = document.getElementById('selected-color-label');
  const previewImg = document.getElementById('order-preview-img');

  colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      colorBtns.forEach(b => {
        b.classList.remove('border-primary', 'border-2', 'active');
        b.classList.add('border-white/10', 'border');
      });
      btn.classList.remove('border-white/10', 'border');
      btn.classList.add('border-primary', 'border-2', 'active');

      selectedColor = btn.getAttribute('data-color') || 'Onyx Cyber-Black';
      if (colorLabel) colorLabel.innerText = `${selectedColor} (Selected)`;

      const frame = btn.getAttribute('data-frame') || '240';
      if (previewImg) {
        previewImg.style.opacity = '0.3';
        previewImg.style.transform = 'scale(0.97)';
        setTimeout(() => {
          previewImg.src = `ezgif-frame-${frame}.jpg`;
          previewImg.style.opacity = '1';
          previewImg.style.transform = 'scale(1)';
        }, 120);
      }
    });
  });

  // 2. Size Selection
  const checkoutSizeBtns = document.querySelectorAll('#checkout-size-buttons .checkout-size-btn');
  const sizeLabel = document.getElementById('selected-size-label');

  checkoutSizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      checkoutSizeBtns.forEach(b => {
        b.classList.remove('bg-primary', 'text-black', 'active');
        b.classList.add('bg-surface-container-lowest', 'text-white');
      });
      btn.classList.remove('bg-surface-container-lowest', 'text-white');
      btn.classList.add('bg-primary', 'text-black', 'active');

      selectedSize = btn.getAttribute('data-size') || 'US 9.5';
      if (sizeLabel) sizeLabel.innerText = `${selectedSize} (Selected)`;
    });
  });

  // 3. Quantity Increment / Decrement
  const qtyMinus = document.getElementById('qty-minus');
  const qtyPlus = document.getElementById('qty-plus');
  const qtyCount = document.getElementById('qty-count');
  const formSubtotal = document.getElementById('form-subtotal');
  const priceDisplayUsd = document.getElementById('order-price-display-usd');
  const priceDisplayInr = document.getElementById('order-price-display-inr');

  function updateOrderPricing() {
    if (qtyCount) qtyCount.innerText = orderQuantity;
    const totalUsd = BASE_PRICE_USD * orderQuantity;
    const totalInr = (BASE_PRICE_INR * orderQuantity).toLocaleString('en-IN');

    if (formSubtotal) formSubtotal.innerText = `$${totalUsd} / ₹${totalInr}`;
    if (priceDisplayUsd) priceDisplayUsd.innerText = `$${totalUsd} USD`;
    if (priceDisplayInr) priceDisplayInr.innerText = `/ ₹${totalInr} INR`;
  }

  if (qtyMinus) {
    qtyMinus.addEventListener('click', () => {
      if (orderQuantity > 1) {
        orderQuantity--;
        updateOrderPricing();
      }
    });
  }

  if (qtyPlus) {
    qtyPlus.addEventListener('click', () => {
      if (orderQuantity < 5) {
        orderQuantity++;
        updateOrderPricing();
      }
    });
  }

  // 4. Checkout Form Submission
  const checkoutForm = document.getElementById('checkout-order-form');
  const checkoutConfirmation = document.getElementById('checkout-confirmation-card');
  const confirmedTicketNum = document.getElementById('confirmed-ticket-num');
  const confirmedNameText = document.getElementById('confirmed-name-text');
  const confirmedItemText = document.getElementById('confirmed-item-text');
  const confirmedAddrText = document.getElementById('confirmed-addr-text');
  const confirmedPayText = document.getElementById('confirmed-pay-text');
  const confirmedWhatsappBtn = document.getElementById('confirmed-whatsapp-btn');
  const confirmedNewOrderBtn = document.getElementById('confirmed-new-order-btn');

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('order-cust-name');
      const phoneInput = document.getElementById('order-cust-phone');
      const addrInput = document.getElementById('order-cust-address');
      const payRadio = document.querySelector('input[name="checkout-paymode"]:checked');

      const custName = nameInput ? nameInput.value.trim() : 'Customer';
      const custPhone = phoneInput ? phoneInput.value.trim() : '';
      const custAddr = addrInput ? addrInput.value.trim() : 'Jaipur';
      const payMode = payRadio ? payRadio.value : 'UPI / QR Code';

      const randomTicket = Math.floor(1000 + Math.random() * 9000);
      const ticketStr = `#CMT-JPR-${randomTicket}`;

      if (confirmedTicketNum) confirmedTicketNum.innerText = ticketStr;
      if (confirmedNameText) confirmedNameText.innerText = custName;
      if (confirmedItemText) confirmedItemText.innerText = `COMET Storm Edition (${selectedColor}, ${selectedSize}) × ${orderQuantity}`;
      if (confirmedAddrText) confirmedAddrText.innerText = custAddr;
      if (confirmedPayText) confirmedPayText.innerText = payMode;

      // Build WhatsApp Pre-filled URL to retailer Aashutosh Soni
      if (confirmedWhatsappBtn) {
        const msg = `Hello Aashutosh! I have placed an order for COMET Storm Edition via the website.\n\n` +
          `Order Ticket: ${ticketStr}\n` +
          `Name: ${custName}\n` +
          `Phone: ${custPhone}\n` +
          `Model: ${selectedColor} (${selectedSize}) x ${orderQuantity}\n` +
          `Delivery Address: ${custAddr}\n` +
          `Payment Mode: ${payMode}\n\n` +
          `Please confirm allocation & dispatch!`;
        confirmedWhatsappBtn.href = `https://wa.me/919876543210?text=${encodeURIComponent(msg)}`;
      }

      checkoutForm.style.display = 'none';
      if (checkoutConfirmation) {
        checkoutConfirmation.classList.remove('hidden');
        checkoutConfirmation.style.display = 'flex';
      }
    });
  }

  // 5. Place Another Order
  if (confirmedNewOrderBtn) {
    confirmedNewOrderBtn.addEventListener('click', () => {
      if (checkoutConfirmation) {
        checkoutConfirmation.classList.add('hidden');
        checkoutConfirmation.style.display = 'none';
      }
      if (checkoutForm) {
        checkoutForm.reset();
        checkoutForm.style.display = 'flex';
        orderQuantity = 1;
        updateOrderPricing();
      }
    });
  }

  // Listeners
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  window.addEventListener('resize', () => {
    resizeCanvas();
    updateScrollProgress();
  });

  // Initialize
  resizeCanvas();
  preloadImages();
  updateScrollProgress();
  requestAnimationFrame(loop);

})();
