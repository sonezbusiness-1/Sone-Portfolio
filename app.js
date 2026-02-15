// =====================================================
// INTRO LOADER SCRIPT
// =====================================================

(function () {

    const loader     = document.getElementById('introLoader');
    const bar        = document.getElementById('loaderBar');
    const percent    = document.getElementById('loaderPercent');

    if (!loader) return;  // no loader  skip

    // ── Scroll lock ─────────────────────────────────
    document.body.style.overflow = 'hidden';

    // ── Progress tracking ────────────────────────────
    let progress = 0;
    let heroReady = false;
    let bodyReady = false;

    function setProgress(val) {
        progress = Math.min(val, 100);
        bar.style.width = progress + '%';
        percent.textContent = Math.round(progress) + '%';
        if (progress > 5) bar.classList.add('active');
    }

    // Smooth animated progress (simulated for feel)
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
        // videos ready වෙනකන් 85% දක්වා slow progress
        const target = (heroReady && bodyReady) ? 100 : 85;
        if (currentProgress < target) {
            const speed = currentProgress < 40 ? 1.2 :
                          currentProgress < 70 ? 0.6 : 0.2;
            currentProgress = Math.min(currentProgress + speed, target);
            setProgress(currentProgress);
        }
    }, 30);

    // ── Hide loader ──────────────────────────────────
    function hideLoader() {
        clearInterval(progressInterval);
        setProgress(100);

        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.style.overflow = '';
        }, 400);

        // DOM ඉවත් කිරීම (memory save)
        setTimeout(() => loader.remove(), 1500);
    }

    // ── Check both videos ready ──────────────────────
    function checkAllReady() {
        if (heroReady && bodyReady) {
            currentProgress = 100;
            setTimeout(hideLoader, 300);
        }
    }

    // ── Hero section video (#bgVideo) ────────────────
    const heroVideo = document.getElementById('bgVideo');

    if (heroVideo) {
        if (heroVideo.readyState >= 3) {  // already ready
            heroReady = true;
        } else {
            heroVideo.addEventListener('canplay', function onHeroReady() {
                heroReady = true;
                heroVideo.removeEventListener('canplay', onHeroReady);
                checkAllReady();
            }, { once: true });
        }
    } else {
        heroReady = true;  // video නෑ නම් ready
    }

    // ── Body background video (.body-bg-video) ───────
    const bodyVideo = document.querySelector('.body-bg-video');

    if (bodyVideo) {
        if (bodyVideo.readyState >= 3) {
            bodyReady = true;
        } else {
            bodyVideo.addEventListener('canplay', function onBodyReady() {
                bodyReady = true;
                bodyVideo.removeEventListener('canplay', onBodyReady);
                checkAllReady();
            }, { once: true });
        }
    } else {
        bodyReady = true;  // video නෑ නම් ready
    }

    // Initial check (both already ready case)
    checkAllReady();

    // ── Fallback: max 8 seconds ──────────────────────
    // Videos load නොවුනත් 8s කින් loader hide කරයි
    setTimeout(() => {
        if (!loader.classList.contains('hidden')) {
            heroReady = true;
            bodyReady = true;
            hideLoader();
        }
    }, 8000);

})();

// Spotlight effect
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--y', `${e.clientY - rect.top}px`);
  });

  // Add touch support for mobile
  card.addEventListener('touchmove', e => {
    const touch = e.touches[0];
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--x', `${touch.clientX - rect.left}px`);
    card.style.setProperty('--y', `${touch.clientY - rect.top}px`);
  });
});

// Projects
function openProject(id) {
  window.open(`projects/${id}ecommerce/index.html`, "_blank");
}

// Safe project modal handling
document.addEventListener('DOMContentLoaded', function() {
  const projectItems = document.querySelectorAll(".project-item");
  const closeModal = document.querySelector(".close-modal");
  const projectModal = document.getElementById("projectModal");
  const projectFrame = document.getElementById("projectFrame");

  if (projectItems.length > 0) {
    projectItems.forEach(item => {
      item.addEventListener("click", () => {
        const site = item.getAttribute("data-site");
        if (projectFrame) projectFrame.src = site;
        if (projectModal) projectModal.style.display = "flex";
      });
    });
  }

  if (closeModal) {
    closeModal.addEventListener("click", () => {
      if (projectModal) projectModal.style.display = "none";
      if (projectFrame) projectFrame.src = "";
    });
  }

  if (projectModal) {
    window.addEventListener("click", e => {
      if (e.target === projectModal) {
        projectModal.style.display = "none";
        if (projectFrame) projectFrame.src = "";
      }
    });
  }
});



// ============================================
// QR SYSTEM PACKAGES
// ============================================

(function() {
  'use strict';
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQRSystem);
  } else {
    initQRSystem();
  }
  
  function initQRSystem() {
    console.log('🚀 Initializing QR System...');
    
    const cards = document.querySelectorAll(".package-card");
    const confirmBtn = document.getElementById("confirmBtn");
    
    // Validation
    if (!confirmBtn) {
      console.error('❌ Confirm button not found!');
      return;
    }
    
    if (cards.length === 0) {
      console.error('❌ No package cards found!');
      return;
    }
    
    console.log('✅ Found', cards.length, 'package cards');
    console.log('✅ Confirm button found');
    
    let selectedPackage = null;
    let receiptChoices = {}; // Store receipt choice for each package
    
    // Check and show/hide confirm button
    function updateConfirmButton() {
      console.log('📦 Selected Package:', selectedPackage);
      console.log('💳 Receipt Choices:', receiptChoices);
      
      // Show button ONLY if:
      // 1. A package is selected (card is clicked)
      // 2. That specific package has a receipt choice
      if (selectedPackage && receiptChoices[selectedPackage]) {
        confirmBtn.style.display = 'inline-block';
        console.log('✅ Button SHOWN');
      } else {
        confirmBtn.style.display = 'none';
        console.log('❌ Button HIDDEN');
      }
    }
    
    // Dropdown change handler - just store the value, don't show button yet
    const dropdowns = document.querySelectorAll('.receipt-select');
    dropdowns.forEach(function(select) {
      select.addEventListener('change', function(e) {
        const card = e.target.closest('.package-card');
        const pkgName = card.dataset.package;
        
        console.log('📋 Dropdown changed for', pkgName, ':', e.target.value);
        
        // Store the receipt choice for this package
        if (e.target.value && e.target.value !== '') {
          receiptChoices[pkgName] = e.target.value;
        } else {
          delete receiptChoices[pkgName];
        }
        
        // DON'T auto-select the card or show button here
        // Just update the button state in case this package was already selected
        updateConfirmButton();
      });
      
      // Stop propagation
      select.addEventListener('click', function(e) {
        e.stopPropagation();
      });
    });
    
    // Card click handler - this is when we show the button
    cards.forEach(function(card) {
      card.addEventListener('click', function(e) {
        // Ignore clicks on select elements
        if (e.target.tagName === 'SELECT' || e.target.tagName === 'OPTION') {
          return;
        }
        
        const pkgName = card.dataset.package;
        console.log('👆 Card clicked:', pkgName);
        
        // Remove active from all
        cards.forEach(function(c) {
          c.classList.remove('active');
        });
        
        // Add active to clicked card
        card.classList.add('active');
        selectedPackage = pkgName;
        
        // Now check if we should show the button
        updateConfirmButton();
      });
    });
    
    // Confirm button handler
    confirmBtn.addEventListener('click', function() {
      if (selectedPackage && receiptChoices[selectedPackage]) {
         Swal.fire({
            title: '✓ Package Selected',
            html: `
              <div style="text-align: left; padding: 1rem;">
                <p style="margin: 0.5rem 0;"><strong>Selected Package:</strong> ${selectedPackage}</p>
                <p style="margin: 0.5rem 0;"><strong>Receipt Payment:</strong> ${receiptChoices[selectedPackage]}</p>
              </div>
            `,
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#7ce9e6',
            background: '#1a2f3a',
            color: '#fff'
          });
      }
    });
    
    console.log('🎉 QR System initialized successfully!');
  }
})();

// Download Guide Function
function downloadGuide(language) {
  console.log(`📥 Downloading ${language} guide...`);
  
  // Show loading state
  const btn = event.target.closest('.download-btn');
  const originalHTML = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
      <circle cx="12" cy="12" r="10"/>
    </svg>
    <div class="btn-content">
      <span class="btn-title">Downloading...</span>
    </div>
  `;
  
  // Simulate download (replace with actual file URLs)
  setTimeout(() => {
    if (language === 'sinhala') {
      // Create download link for Sinhala PDF
      const link = document.createElement('a');
      link.href = '/downloads/QR-System-Guide-Sinhala.pdf'; // Your actual PDF path
      link.download = 'QR-System-Guide-Sinhala.pdf';
      link.click();
      
      // Show success message
      alert('✅ සිංහල විස්තරය download වෙමින් පවතී!\n\nThank you for your interest!');
    } else {
      // Create download link for English PDF
      const link = document.createElement('a');
      link.href = '/downloads/QR-System-Guide-English.pdf'; // Your actual PDF path
      link.download = 'QR-System-Guide-English.pdf';
      link.click();
      
      // Show success message
      alert('✅ English guide is downloading!\n\nThank you for your interest!');
    }
    
    // Reset button
    btn.disabled = false;
    btn.innerHTML = originalHTML;
  }, 1000);
}

// Add spin animation for loading
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);



// ============================================
// QR SYSTEM PACKAGES WITH CART
// ============================================

(function() {
  'use strict';
  
  // Package features data
  const packageFeatures = {
    Basic: [
      'QR Code Scan System',
      'Receipt System',
      'Domain Name Included',
      'Server / Hosting Included',
      '1 Month Bug Fix Support'
    ],
    Premium: [
      'Advanced QR Code Scan System',
      'Receipt System',
      'Domain Name Included',
      'Server / Hosting Included',
      '3 Month Bug Fix Support',
      'Admin Panel'
    ],
    Pro: [
      'Advanced QR Code Scan System',
      'Receipt System',
      'Domain Name Included',
      'Server / Hosting Included',
      'Unlimited Bug Fix Support',
      'Admin Panel',
      'POS Printer Included & Programmed'
    ]
  };
  
  // Package prices (ALREADY INCLUDE receipt charges)
  const packagePrices = {
    Basic: 326.05,      // Includes Pay After $50
    Premium: 586.89,    // Can be Pay After $50 or Pay Now $250
    Pro: 1304.19        // Can be Pay After $50 or Pay Now $250
  };
  
  // Receipt charge breakdown (for display only)
  const receiptCharges = {
    'Pay After': 50,
    'Pay Now': 250,
    'Both': 250
  };
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQRSystem);
  } else {
    initQRSystem();
  }
  
  function initQRSystem() {
    console.log('🚀 Initializing QR System...');
    
    const cards = document.querySelectorAll(".package-card");
    const confirmBtn = document.getElementById("confirmBtn");
    const packagesSection = document.querySelector(".packages-section");
    const cartSection = document.getElementById("cartSection");
    
    if (!confirmBtn || !packagesSection || !cartSection) {
      console.error('❌ Required elements not found!');
      return;
    }
    
    if (cards.length === 0) {
      console.error('❌ No package cards found!');
      return;
    }
    
    console.log('✅ QR System initialized');
    
    let selectedPackage = null;
    let receiptChoices = {};
    
    function updateConfirmButton() {
      if (selectedPackage && receiptChoices[selectedPackage]) {
        confirmBtn.style.display = 'inline-block';
      } else {
        confirmBtn.style.display = 'none';
      }
    }
    
    // Dropdown handlers
    document.querySelectorAll('.receipt-select').forEach(select => {
      select.addEventListener('change', e => {
        const card = e.target.closest('.package-card');
        const pkgName = card.dataset.package;
        
        if (e.target.value && e.target.value !== '') {
          receiptChoices[pkgName] = e.target.value;
        } else {
          delete receiptChoices[pkgName];
        }
        
        updateConfirmButton();
      });
      
      select.addEventListener('click', e => e.stopPropagation());
    });
    
    // Card click handlers
    cards.forEach(card => {
      card.addEventListener('click', e => {
        if (e.target.tagName === 'SELECT' || e.target.tagName === 'OPTION') {
          return;
        }
        
        const pkgName = card.dataset.package;
        
        cards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        selectedPackage = pkgName;
        
        updateConfirmButton();
      });
    });
    
    // Confirm button - Go to cart with smooth scroll animation
    confirmBtn.addEventListener('click', () => {
      if (selectedPackage && receiptChoices[selectedPackage]) {
        showCart(selectedPackage, receiptChoices[selectedPackage]);
      }
    });
    
    // Show cart function with smooth scroll
    function showCart(packageName, receiptType) {
      console.log('🛒 Opening cart...');
      
      // Scroll to top
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
      
      // After reaching top, switch content
      setTimeout(() => {
        packagesSection.style.display = 'none';
        cartSection.style.display = 'block';
        
        // Scroll to cart section
        setTimeout(() => {
          const cartPosition = cartSection.offsetTop - 80;
          window.scrollTo({ 
            top: cartPosition, 
            behavior: 'smooth' 
          });
        }, 200);
        
      }, 700);
      
      // Get package data
      const features = packageFeatures[packageName] || [];
      const packagePrice = packagePrices[packageName] || 0;
      const receiptCharge = receiptCharges[receiptType] || 0;
      const basePrice = packagePrice - receiptCharge; // Calculate base price for display
      
      // Display package details
      const packageDisplay = `
        <div class="package-header">
          <div class="package-name">${packageName} Package</div>
          <div class="package-receipt">Receipt: ${receiptType}</div>
        </div>
        <div class="package-features">
          ${features.map(feature => `
            <div class="feature-item">${feature}</div>
          `).join('')}
        </div>
      `;
      
      document.getElementById('selectedPackageDisplay').innerHTML = packageDisplay;
      document.getElementById('packageBadge').textContent = `${packageName} Package`;
      
      // Show breakdown in summary details
      document.getElementById('summaryPackageDetails').innerHTML = `
        Receipt Payment: <strong>${receiptType}</strong>
        <br>
        <span style="font-size: 0.85rem; color: #a0a0a0; margin-top: 5px; display: block;">
          Base: $${basePrice.toFixed(2)} + ${receiptType} ($${receiptCharge})
        </span>
      `;
      
      // Show final package price (unchanged)
      document.getElementById('summaryPackagePrice').textContent = `$${packagePrice.toFixed(2)}`;
      
      // Initialize cart calculations
      setTimeout(() => {
        initCartCalculations(packagePrice, packageName, receiptType, basePrice, receiptCharge);
      }, 900);
    }
  }
})();

// Back to packages
function backToPackages() {
  const packagesSection = document.querySelector('.packages-section');
  const cartSection = document.getElementById('cartSection');
  
  cartSection.style.display = 'none';
  packagesSection.style.display = 'block';
  
  // Reset selections
  document.querySelectorAll('input[name="domain"]').forEach(radio => radio.checked = false);
  document.querySelectorAll('input[name="hosting"]').forEach(radio => radio.checked = false);
  
  setTimeout(() => {
    const packagesPosition = packagesSection.offsetTop - 100;
    window.scrollTo({ 
      top: packagesPosition, 
      behavior: 'smooth' 
    });
  }, 100);
}

// Global variable for order data
let orderData = {};

// Cart calculations
function initCartCalculations(packagePrice, packageName, receiptType, basePrice, receiptCharge) {
  const domainRadios = document.querySelectorAll('input[name="domain"]');
  const hostingRadios = document.querySelectorAll('input[name="hosting"]');
  const printerSelect = document.getElementById('printerSelect');
  const gatewayRadios = document.querySelectorAll('input[name="gateway"]');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const gatewaySection = document.getElementById('paymentGatewaySection');
  const printerSection = document.getElementById('posPrinterSection');
  
  // Show POS printer section only for Pro package
  if (packageName === 'Pro') {
    printerSection.style.display = 'block';
  } else {
    printerSection.style.display = 'none';
  }
  
  // Show/hide payment gateway section
  if (receiptType === 'Pay Now' || receiptType === 'Both') {
    if (packageName === 'Premium' || packageName === 'Pro') {
      gatewaySection.style.display = 'block';
    }
  } else {
    gatewaySection.style.display = 'none';
  }
  
  let domainPrice = 0;
  let domainOriginal = 0;
  let hostingPrice = 0;
  let hostingOriginal = 0;
  let gatewayPrice = 0;
  let selectedDomainText = '';
  let selectedHostingText = '';
  let selectedGatewayText = '';
  let selectedPrinter = '';
  
  function updateSummary() {
    // Domain
    const selectedDomain = document.querySelector('input[name="domain"]:checked');
    if (selectedDomain) {
      const years = selectedDomain.value.replace('year', '');
      domainPrice = parseFloat(selectedDomain.dataset.price);
      domainOriginal = parseFloat(selectedDomain.dataset.original);
      selectedDomainText = `${years} Year - $${domainPrice.toFixed(2)}`;
      
      document.getElementById('summaryDomain').innerHTML = `
        <span style="text-decoration: line-through; color: #7b7b7b; font-size: 0.9rem;">$${domainOriginal.toFixed(2)}</span>
        <span style="color: #7ce9e6; font-weight: 700; font-size: 1.1rem;">$${domainPrice.toFixed(2)}</span>
        <span style="color: #7b7b7b; font-size: 0.85rem;">(${years} Year)</span>
      `;
    } else {
      document.getElementById('summaryDomain').textContent = 'Not selected';
      domainPrice = 0;
      domainOriginal = 0;
      selectedDomainText = '';
    }
    
    // Hosting
    const selectedHosting = document.querySelector('input[name="hosting"]:checked');
    if (selectedHosting) {
      const years = selectedHosting.value.replace('year', '');
      hostingPrice = parseFloat(selectedHosting.dataset.price);
      hostingOriginal = parseFloat(selectedHosting.dataset.original);
      selectedHostingText = `${years} Year - $${hostingPrice.toFixed(2)}`;
      
      document.getElementById('summaryHosting').innerHTML = `
        <span style="text-decoration: line-through; color: #7b7b7b; font-size: 0.9rem;">$${hostingOriginal.toFixed(2)}</span>
        <span style="color: #7ce9e6; font-weight: 700; font-size: 1.1rem;">$${hostingPrice.toFixed(2)}</span>
        <span style="color: #7b7b7b; font-size: 0.85rem;">(${years} Year)</span>
      `;
    } else {
      document.getElementById('summaryHosting').textContent = 'Not selected';
      hostingPrice = 0;
      hostingOriginal = 0;
      selectedHostingText = '';
    }
    
    // POS Printer (Pro package only)
    let printerDisplay = document.getElementById('summaryPrinter');
    
    if (!printerDisplay && printerSection.style.display === 'block') {
      const hostingRow = Array.from(document.querySelectorAll('.summary-item')).find(row => 
        row.textContent.includes('Hosting')
      );
      
      if (hostingRow) {
        const printerRow = document.createElement('div');
        printerRow.className = 'summary-item';
        printerRow.id = 'printerRow';
        printerRow.innerHTML = `
          <span>POS Printer:</span>
          <span id="summaryPrinter" class="summary-value">Not selected</span>
        `;
        hostingRow.after(printerRow);
        printerDisplay = document.getElementById('summaryPrinter');
      }
    }
    
    if (printerSection.style.display === 'block') {
      const printerRow = document.getElementById('printerRow');
      if (printerRow) {
        printerRow.style.display = 'flex';
      }
      
      if (printerSelect && printerSelect.value) {
        selectedPrinter = printerSelect.value;
        printerDisplay.innerHTML = `
          <span style="color: #2ed573; font-weight: 600;">${selectedPrinter}</span>
          <span style="color: #7b7b7b; font-size: 0.85rem;">(Included)</span>
        `;
      } else {
        if (printerDisplay) {
          printerDisplay.textContent = 'Not selected';
        }
        selectedPrinter = '';
      }
    } else {
      const printerRow = document.getElementById('printerRow');
      if (printerRow) {
        printerRow.style.display = 'none';
      }
      selectedPrinter = '';
    }
    
    // Payment Gateway
    const selectedGateway = document.querySelector('input[name="gateway"]:checked');
    let gatewayDisplay = document.getElementById('summaryGateway');
    
    if (!gatewayDisplay && gatewaySection.style.display === 'block') {
      const printerRow = document.getElementById('printerRow');
      const lastRow = printerRow || Array.from(document.querySelectorAll('.summary-item')).find(row => 
        row.textContent.includes('Hosting')
      );
      
      if (lastRow) {
        const gatewayRow = document.createElement('div');
        gatewayRow.className = 'summary-item';
        gatewayRow.id = 'gatewayRow';
        gatewayRow.innerHTML = `
          <span>Payment Gateway:</span>
          <span id="summaryGateway" class="summary-value">Not selected</span>
        `;
        lastRow.after(gatewayRow);
        gatewayDisplay = document.getElementById('summaryGateway');
      }
    }
    
    if (gatewaySection.style.display === 'block') {
      const gatewayRow = document.getElementById('gatewayRow');
      if (gatewayRow) {
        gatewayRow.style.display = 'flex';
      }
      
      if (selectedGateway) {
        gatewayPrice = parseFloat(selectedGateway.dataset.price);
        const planName = selectedGateway.value.charAt(0).toUpperCase() + selectedGateway.value.slice(1);
        selectedGatewayText = `${planName} Plan`;
        
        if (gatewayPrice === 0) {
          gatewayDisplay.innerHTML = `
            <span style="color: #2ed573; font-weight: 700; font-size: 1.1rem;">Free</span>
          `;
        } else {
          gatewayDisplay.innerHTML = `
            <span style="color: #7ce9e6; font-weight: 700; font-size: 1.1rem;">$${gatewayPrice.toFixed(2)}</span>
            <span style="color: #7b7b7b; font-size: 0.85rem;">/month</span>
          `;
        }
      } else {
        if (gatewayDisplay) {
          gatewayDisplay.textContent = 'Not selected';
        }
        gatewayPrice = 0;
        selectedGatewayText = '';
      }
    } else {
      const gatewayRow = document.getElementById('gatewayRow');
      if (gatewayRow) {
        gatewayRow.style.display = 'none';
      }
      gatewayPrice = 0;
      selectedGatewayText = '';
    }
    
    // Calculate totals (printer is included, doesn't add to price)
    const subtotal = packagePrice + domainPrice + hostingPrice + gatewayPrice;
    const originalTotal = packagePrice + domainOriginal + hostingOriginal;
    const savings = originalTotal - (packagePrice + domainPrice + hostingPrice);
    
    document.getElementById('summarySubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('summaryTotal').textContent = `$${subtotal.toFixed(2)}`;
    
    if (savings > 0 && (domainOriginal > 0 || hostingOriginal > 0)) {
      document.getElementById('summarySavings').style.display = 'flex';
      document.getElementById('savingsAmount').textContent = `-$${savings.toFixed(2)}`;
    } else {
      document.getElementById('summarySavings').style.display = 'none';
    }
    
    // Enable checkout
    const printerRequired = printerSection.style.display === 'block';
    const gatewayRequired = gatewaySection.style.display === 'block';
    
    checkoutBtn.disabled = !(
      selectedDomain && 
      selectedHosting && 
      (!printerRequired || (printerSelect && printerSelect.value)) &&
      (!gatewayRequired || selectedGateway)
    );
    
    // Store order data
    orderData = {
      packageName: packageName,
      packagePrice: packagePrice.toFixed(2),
      basePrice: basePrice.toFixed(2),
      receiptPayment: receiptType,
      receiptCharge: receiptCharge.toFixed(2),
      domain: selectedDomainText,
      domainPrice: domainPrice.toFixed(2),
      hosting: selectedHostingText,
      hostingPrice: hostingPrice.toFixed(2),
      printer: selectedPrinter || 'N/A',
      gateway: selectedGatewayText || 'N/A',
      gatewayPrice: gatewayPrice > 0 ? gatewayPrice.toFixed(2) : (selectedGatewayText ? '0.00' : 'N/A'),
      subtotal: subtotal.toFixed(2),
      savings: savings > 0 ? savings.toFixed(2) : '0.00',
      total: subtotal.toFixed(2)
    };
  }
  
  domainRadios.forEach(radio => radio.addEventListener('change', updateSummary));
  hostingRadios.forEach(radio => radio.addEventListener('change', updateSummary));
  if (printerSelect) {
    printerSelect.addEventListener('change', updateSummary);
  }
  gatewayRadios.forEach(radio => radio.addEventListener('change', updateSummary));
  
  updateSummary();
  
  checkoutBtn.addEventListener('click', openCheckoutModal);
}

// Open checkout modal
function openCheckoutModal() {
  const modal = document.getElementById('checkoutModal');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  
  // Populate order summary with breakdown
  const summaryHtml = `
    <div class="order-summary-item">
      <span class="order-summary-label">Package:</span>
      <span class="order-summary-value">${orderData.packageName}</span>
    </div>
    <div class="order-summary-item">
      <span class="order-summary-label">Receipt Payment:</span>
      <span class="order-summary-value">${orderData.receiptPayment}</span>
    </div>
    <div style="background: rgba(124, 233, 230, 0.05); padding: 12px; border-radius: 8px; margin: 10px 0;">
      <div class="order-summary-item" style="border: none; padding: 5px 0;">
        <span class="order-summary-label" style="font-size: 0.9rem;">Base Package:</span>
        <span class="order-summary-value" style="font-size: 0.9rem;">$${orderData.basePrice}</span>
      </div>
      <div class="order-summary-item" style="border: none; padding: 5px 0;">
        <span class="order-summary-label" style="font-size: 0.9rem; color: #8b5cf6;">${orderData.receiptPayment} Charge:</span>
        <span class="order-summary-value" style="font-size: 0.9rem; color: #8b5cf6;">+$${orderData.receiptCharge}</span>
      </div>
      <div class="order-summary-item" style="border: none; padding: 8px 0 0 0;">
        <span class="order-summary-label" style="font-weight: 700;">Package Total:</span>
        <span class="order-summary-value" style="font-size: 1.1rem; font-weight: 700;">$${orderData.packagePrice}</span>
      </div>
    </div>
    <div class="order-summary-item">
      <span class="order-summary-label">Domain:</span>
      <span class="order-summary-value">$${orderData.domainPrice}</span>
    </div>
    <div class="order-summary-item" style="font-size: 0.85rem; padding-left: 15px; color: #a0a0a0;">
      <span>${orderData.domain}</span>
      <span></span>
    </div>
    <div class="order-summary-item">
      <span class="order-summary-label">Hosting:</span>
      <span class="order-summary-value">$${orderData.hostingPrice}</span>
    </div>
    <div class="order-summary-item" style="font-size: 0.85rem; padding-left: 15px; color: #a0a0a0;">
      <span>${orderData.hosting}</span>
      <span></span>
    </div>
    ${orderData.gateway && orderData.gatewayPrice !== 'N/A' ? `
    <div class="order-summary-item">
      <span class="order-summary-label">Payment Gateway:</span>
      <span class="order-summary-value">${orderData.gatewayPrice === '0.00' ? 'Free' : '$' + orderData.gatewayPrice}</span>
    </div>
    <div class="order-summary-item" style="font-size: 0.85rem; padding-left: 15px; color: #a0a0a0;">
      <span>${orderData.gateway}</span>
      <span></span>
    </div>
    ` : ''}
    ${orderData.printer && orderData.printer !== 'N/A' ? `
    <div class="order-summary-item">
      <span class="order-summary-label">POS Printer:</span>
      <span class="order-summary-value" style="color: #2ed573;">${orderData.printer}</span>
    </div>
    <div class="order-summary-item" style="font-size: 0.85rem; padding-left: 15px; color: #a0a0a0;">
      <span>Included & Programmed</span>
      <span></span>
    </div>
    ` : ''}
    ${orderData.savings > 0 ? `
    <div class="order-summary-item" style="background: rgba(139, 92, 246, 0.1); padding: 10px; border-radius: 8px; margin: 10px 0;">
      <span class="order-summary-label" style="color: #8b5cf6; font-weight: 600;">You Save:</span>
      <span class="order-summary-value" style="color: #8b5cf6; font-weight: 700;">-$${orderData.savings}</span>
    </div>
    ` : ''}
    <div class="order-summary-total">
      <span>Total:</span>
      <span>$${orderData.total}</span>
    </div>
  `;

  document.getElementById('modalOrderSummary').innerHTML = summaryHtml;
}

// Close modal
function closeCheckoutModal() {
  const modal = document.getElementById('checkoutModal');
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
  const checkoutForm = document.getElementById('checkoutForm');
  
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const submitBtn = document.getElementById('orderConfirmBtn');
      const btnText = submitBtn.querySelector('.btn-text');
      const btnLoading = submitBtn.querySelector('.btn-loading');
      
      btnText.style.display = 'none';
      btnLoading.style.display = 'flex';
      submitBtn.disabled = true;
      
      const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address1: document.getElementById('address1').value,
        address2: document.getElementById('address2').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        country: document.getElementById('country').value,
        postalCode: document.getElementById('postalCode').value,
        message: document.getElementById('message').value,
        ...orderData
      };
      
      sendOrderEmail(formData, submitBtn, btnText, btnLoading);
    });
  }
});

// Send order email
function sendOrderEmail(data, submitBtn, btnText, btnLoading) {
  const templateParams = {
    to_email: 'npvsgroup@gmail.com',
    name: data.fullName,
    email: data.email,
    phone: data.phone,
    address: `${data.address1}${data.address2 ? ', ' + data.address2 : ''}, ${data.city}, ${data.state}, ${data.country} ${data.postalCode}`,
    package_name: data.packageName,
    base_price: data.basePrice,
    receipt_payment: data.receiptPayment,
    receipt_charge: data.receiptCharge,
    package_price: data.packagePrice,
    domain_plan: data.domain,
    domain_price: data.domainPrice,
    hosting_plan: data.hosting,
    hosting_price: data.hostingPrice,
    printer: data.printer,
    gateway: data.gateway,
    gateway_price: data.gatewayPrice,
    subtotal: data.subtotal,
    savings: data.savings,
    total: data.total,
    message: data.message || 'No additional message',
    order_date: new Date().toLocaleString()
  };
  
  emailjs.send('service_najgbhk', 'template_fop2dpi', templateParams)
  .then(function(response) {
    console.log('✅ Email sent!', response.status);
    
    // Custom success modal instead of alert
    Swal.fire({
      icon: 'success',
      title: '🎉 Order Confirmed!',
      html: `
        <div style="text-align: left; padding: 1rem;">
          <p style="margin: 1rem 0; font-size: 1.1rem;">We have received your order and will contact you shortly at:</p>
          <p style="margin: 1rem 0; color: #7ce9e6; font-weight: 600; font-size: 1.2rem;">${data.email}</p>
        </div>
      `,
      confirmButtonText: 'OK',
      confirmButtonColor: '#7ce9e6',
      background: '#1a2f3a',
      color: '#fff',
      allowOutsideClick: false
    }).then(() => {
      closeCheckoutModal();
      document.getElementById('checkoutForm').reset();
    });
    
    btnText.style.display = 'block';
    btnLoading.style.display = 'none';
    submitBtn.disabled = false;
    
  }, function(error) {
    console.log('❌ Email failed:', error);
    
    // Custom error modal instead of alert
    Swal.fire({
      icon: 'error',
      title: '❌ Oops!',
      html: `
        <div style="text-align: left; padding: 1rem;">
          <p style="margin: 1rem 0;">Something went wrong. Please try again or contact us directly at:</p>
          <p style="margin: 1rem 0; color: #7ce9e6; font-weight: 600;">npvsgroup@gmail.com</p>
        </div>
      `,
      confirmButtonText: 'OK',
      confirmButtonColor: '#7ce9e6',
      background: '#1a2f3a',
      color: '#fff'
    });
    
    btnText.style.display = 'block';
    btnLoading.style.display = 'none';
    submitBtn.disabled = false;
  });
}


// ============================================
// VIDEO PLAYER FULLSCREEN FUNCTIONALITY
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const videoContainer = document.getElementById('videoContainer');
    const video = document.getElementById('demoVideo');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const fullscreenIcon = document.querySelector('.fullscreen-icon');
    const exitFullscreenIcon = document.querySelector('.exit-fullscreen-icon');

    if (!videoContainer || !video || !fullscreenBtn) {
        return; // Exit if elements don't exist
    }

    // Toggle fullscreen function
    function toggleFullscreen() {
        if (!document.fullscreenElement && 
            !document.webkitFullscreenElement && 
            !document.mozFullScreenElement && 
            !document.msFullscreenElement) {
            
            // Enter fullscreen
            if (videoContainer.requestFullscreen) {
                videoContainer.requestFullscreen();
            } else if (videoContainer.webkitRequestFullscreen) {
                videoContainer.webkitRequestFullscreen();
            } else if (videoContainer.mozRequestFullScreen) {
                videoContainer.mozRequestFullScreen();
            } else if (videoContainer.msRequestFullscreen) {
                videoContainer.msRequestFullscreen();
            }
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }

    // Update button icon based on fullscreen state
    function updateFullscreenButton() {
        if (document.fullscreenElement || 
            document.webkitFullscreenElement || 
            document.mozFullScreenElement || 
            document.msFullscreenElement) {
            
            // In fullscreen - show exit icon
            fullscreenIcon.style.display = 'none';
            exitFullscreenIcon.style.display = 'block';
            fullscreenBtn.title = 'Exit Fullscreen';
        } else {
            // Not in fullscreen - show enter icon
            fullscreenIcon.style.display = 'block';
            exitFullscreenIcon.style.display = 'none';
            fullscreenBtn.title = 'Fullscreen';
        }
    }

    // Event listeners
    fullscreenBtn.addEventListener('click', toggleFullscreen);

    // Listen for fullscreen changes
    document.addEventListener('fullscreenchange', updateFullscreenButton);
    document.addEventListener('webkitfullscreenchange', updateFullscreenButton);
    document.addEventListener('mozfullscreenchange', updateFullscreenButton);
    document.addEventListener('MSFullscreenChange', updateFullscreenButton);

    // Double click on video to toggle fullscreen
    video.addEventListener('dblclick', toggleFullscreen);

    // Keyboard shortcut (F key) for fullscreen
    document.addEventListener('keydown', function(e) {
        if (e.key === 'f' || e.key === 'F') {
            const activeElement = document.activeElement;
            // Only toggle if not typing in an input field
            if (activeElement.tagName !== 'INPUT' && 
                activeElement.tagName !== 'TEXTAREA') {
                e.preventDefault();
                toggleFullscreen();
            }
        }
        
        // ESC key to exit fullscreen (browser default, but we handle it too)
        if (e.key === 'Escape' && document.fullscreenElement) {
            toggleFullscreen();
        }
    });
});



// CONTACT ME button - open Gmail compose directly
function openEmailClient() {
  const email = 'devilw985@gmail.com';
  const subject = encodeURIComponent('Website Contact Request');
  const body = encodeURIComponent('Hello,\n\nI am reaching out through your website.\n\nBest regards,');
  
  // Gmail compose URL
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;
  
  // Open in new tab
  window.open(gmailUrl, '_blank');
}

// Event listeners for contact buttons
document.addEventListener('DOMContentLoaded', function() {
  
  // Header contact button
  const headerContactBtn = document.querySelector('.contact-btn');
  if (headerContactBtn) {
    headerContactBtn.addEventListener('click', scrollToContact);
  }

  // Main contact form submission - sends to sonezbusiness@gmail.com
  const mainContactForm = document.getElementById('contactForm');
  if (mainContactForm) {
    mainContactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const submitBtn = document.getElementById('submitBtn');
      const successMessage = document.getElementById('successMessage');
      
      // Show loading state
      if (submitBtn) {
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
      }

      // Try to send via EmailJS first
      if (typeof emailjs !== 'undefined') {
        // EmailJS send - will arrive at sonezbusiness@gmail.com
        emailjs.sendForm('service_a1ixihw', 'template_u60dvel', mainContactForm)
          .then(function(response) {
            console.log('✅ Email sent successfully!', response.status);
            
            // Show success message
            if (successMessage) {
              successMessage.style.display = 'block';
            }
            
            // Reset form
            mainContactForm.reset();
            
            // Hide success message after 5 seconds
            setTimeout(function() {
              if (successMessage) {
                successMessage.style.display = 'none';
              }
            }, 5000);
            
          }, function(error) {
            console.log('❌ EmailJS failed:', error);
            
            // Fallback to mailto with sonezbusiness@gmail.com
            sendViaMailto();
          })
          .finally(function() {
            // Reset button state
            if (submitBtn) {
              submitBtn.textContent = 'Send Message';
              submitBtn.disabled = false;
            }
          });
      } else {
        // If EmailJS not loaded, use mailto directly
        sendViaMailto();
        
        if (submitBtn) {
          submitBtn.textContent = 'Send Message';
          submitBtn.disabled = false;
        }
      }
      
      // Mailto fallback function for Send Message form
      function sendViaMailto() {
        const name = document.getElementById('name')?.value || '';
        const email = document.getElementById('email')?.value || '';
        const subject = document.getElementById('subject')?.value || '';
        const message = document.getElementById('message')?.value || '';
        
        const mailtoSubject = encodeURIComponent(`Website Contact: ${subject}`);
        const mailtoBody = encodeURIComponent(
          `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        );
        
        // Send Message form goes to sonezbusiness@gmail.com
        window.location.href = `mailto:sonezbusiness@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
      }
    });
  }
});

// ── PROGRESS BAR ANIMATION ────────────────────────
function animateProgressBars() {
    const bars = document.querySelectorAll('.progress-bar');
    bars.forEach(bar => {
        const target = bar.getAttribute('data-width');
        bar.style.width = target + '%';
    });
}

// Intersection Observer - viewport ට ආවාම animate
const techSection = document.querySelector('.tech-skills-section');
if (techSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateProgressBars();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    observer.observe(techSection);
}


// ── SHOW MORE / LESS TOGGLE ───────────────────────
function toggleTechCards() {
    const hiddenCards = document.querySelectorAll('.tech-card.hidden-tech');
    const btn = document.getElementById('showMoreBtn');
    const chevron = btn.querySelector('.chevron');
    const isHidden = hiddenCards[0].style.display === 'none' || hiddenCards[0].style.display === '';

    hiddenCards.forEach(card => {
        card.style.display = isHidden ? 'block' : 'none';
    });

    btn.innerHTML = isHidden
        ? 'Show Less <span class="chevron rotated">▾</span>'
        : 'Show More <span class="chevron">▾</span>';

    // Newly shown cards animate
    if (isHidden) {
        setTimeout(animateProgressBars, 50);
    }
}


// ── ACTIVE NAV LINK on SCROLL ─────────────────────
const sections = document.querySelectorAll('section[id], main[id]');
const navLinks = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => link.classList.remove('is-active'));
            const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
            if (active) active.classList.add('is-active');
        }
    });
}, { threshold: 0.4 });

sections.forEach(sec => navObserver.observe(sec));

// ============================================
// HAMBURGER MENU 
// ============================================

(function() {

    // Backdrop create
    const backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);

    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mainNav      = document.getElementById('mainNav');

    if (!hamburgerBtn || !mainNav) return;

    function openMenu() {
        hamburgerBtn.classList.add('active');
        mainNav.classList.add('open');
        backdrop.style.display = 'block';
        document.body.style.overflow = 'hidden';
        setTimeout(() => backdrop.classList.add('visible'), 10);
    }

    function closeMenu() {
        hamburgerBtn.classList.remove('active');
        mainNav.classList.remove('open');
        backdrop.classList.remove('visible');
        document.body.style.overflow = '';
        setTimeout(() => backdrop.style.display = 'none', 400);
    }

    // Hamburger click
    hamburgerBtn.addEventListener('click', () => {
        mainNav.classList.contains('open') ? closeMenu() : openMenu();
    });

    // Backdrop click = close
    backdrop.addEventListener('click', closeMenu);

    // Nav link click = close + smooth scroll
    mainNav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Escape key = close
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeMenu();
    });

})();

function copyPhone() {
    navigator.clipboard.writeText('+94 704 483 130').then(() => {
        // Toast notification show
        let toast = document.getElementById('copyToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'copyToast';
            toast.className = 'copy-toast';
            toast.textContent = '✓ Number copied!';
            document.body.appendChild(toast);
        }
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    });
}

function openGmail(e) {
    e.preventDefault();
    const email = 'sonezbusiness@gmail.com';
    const gmailUrl = 'https://mail.google.com/mail/?view=cm&to=' + email;
    window.open(gmailUrl, '_blank');
}
