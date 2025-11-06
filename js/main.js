// Premium Content Store - JavaScript Principal

document.addEventListener('DOMContentLoaded', function() {
    
    // ================================
    // Modal 18+ - Verificação de Idade
    // ================================
    
    const ageModal = document.getElementById('ageModal');
    const confirmAgeBtn = document.getElementById('confirmAge');
    const denyAgeBtn = document.getElementById('denyAge');
    
    // Verificar se o usuário já confirmou a idade
    const ageConfirmed = localStorage.getItem('ageConfirmed');
    
    if (!ageConfirmed) {
        ageModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    } else {
        ageModal.style.display = 'none';
    }
    
    // Função para confirmar idade
    function confirmAge() {
        localStorage.setItem('ageConfirmed', 'true');
        ageModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        showWelcomeMessage();
        trackEvent('age_verification', { action: 'confirmed' });
    }
    
    // Função para negar idade
    function denyAge() {
        window.location.href = 'https://www.google.com';
    }
    
    // Event listeners
    confirmAgeBtn.addEventListener('click', confirmAge);
    denyAgeBtn.addEventListener('click', denyAge);
    
    ageModal.addEventListener('click', function(e) {
        if (e.target === ageModal) {
            return; // Não fechar modal clicando fora
        }
    });
    
    // ================================
    // Navegação Suave
    // ================================
    
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                closeMobileMenu();
            }
        });
    });
    
    // ================================
    // Menu Mobile
    // ================================
    
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }
    
    function closeMobileMenu() {
        if (navMenu) {
            navMenu.classList.remove('active');
        }
        if (mobileMenuToggle) {
            mobileMenuToggle.classList.remove('active');
        }
    }
    
    // ================================
    // Header Scroll Effect
    // ================================
    
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'linear-gradient(135deg, rgba(0,0,0,0.95), rgba(44,44,44,0.95))';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'linear-gradient(135deg, #0a0a0a, #2c2c2c)';
            header.style.backdropFilter = 'none';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // ================================
    // Preview dos Modelos
    // ================================
    
    const previewButtons = document.querySelectorAll('.btn-preview');
    
    previewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modelCard = this.closest('.model-card');
            const modelName = modelCard.querySelector('h3').textContent;
            const modelDescription = modelCard.querySelector('.model-description').textContent;
            const modelPrice = modelCard.querySelector('.price-item .price').textContent;
            const modelImage = modelCard.querySelector('.model-image img').src;
            
            showPreviewModal(modelName, modelDescription, modelPrice, modelImage);
            trackEvent('preview_click', { model: modelName });
        });
    });
    
    function showPreviewModal(name, description, price, image) {
        const modalHTML = `
            <div class="preview-modal-overlay">
                <div class="preview-modal-content">
                    <div class="preview-modal-header">
                        <h3>Preview ${name}</h3>
                        <button class="close-preview-modal">&times;</button>
                    </div>
                    <div class="preview-modal-body">
                        <div class="preview-image-container">
                            <img src="${image}" alt="${name}">
                            <div class="preview-watermark">PREVIEW</div>
                        </div>
                        <div class="preview-info">
                            <h4>${name}</h4>
                            <p>${description}</p>
                            <div class="preview-price">
                                <span class="price">${price}</span>
                                <span class="price-note">Conteúdo completo após compra</span>
                            </div>
                            <div class="preview-cta">
                                <button class="btn-primary" onclick="showPurchaseModal('${name}')">
                                    Comprar Agora
                                </button>
                                <button class="btn-outline" onclick="closePreviewModal()">
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.body.style.overflow = 'hidden';
        
        // Event listeners
        const overlay = document.querySelector('.preview-modal-overlay');
        const closeBtn = document.querySelector('.close-preview-modal');
        
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closePreviewModal();
            }
        });
        
        closeBtn.addEventListener('click', closePreviewModal);
        
        // ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closePreviewModal();
            }
        });
        
        function closePreviewModal() {
            overlay.remove();
            document.body.style.overflow = 'auto';
        }
    }
    
    // ================================
    // CTAs de Compra
    // ================================
    
    const buyButtons = document.querySelectorAll('.btn-buy');
    const vipButtons = document.querySelectorAll('.btn-vip');
    
    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modelCard = this.closest('.model-card');
            const modelName = modelCard.querySelector('h3').textContent;
            const modelPrice = modelCard.querySelector('.price-item .price').textContent;
            
            showPurchaseModal(modelName, modelPrice);
            trackEvent('purchase_click', { model: modelName, type: 'single' });
        });
    });
    
    vipButtons.forEach(button => {
        button.addEventListener('click', function() {
            showVipModal();
            trackEvent('vip_click', { type: 'subscription' });
        });
    });
    
    // ================================
    // Modal de Compra
    // ================================
    
    function showPurchaseModal(modelName, modelPrice) {
        const modalHTML = `
            <div class="purchase-modal-overlay">
                <div class="purchase-modal-content">
                    <div class="purchase-modal-header">
                        <h3>Comprar Conteúdo - ${modelName}</h3>
                        <button class="close-purchase-modal">&times;</button>
                    </div>
                    <div class="purchase-modal-body">
                        <div class="purchase-info">
                            <h4>${modelName} - Conteúdo Premium</h4>
                            <div class="purchase-price">
                                <span class="price">${modelPrice}</span>
                                <span class="price-note">Pagamento único</span>
                            </div>
                        </div>
                        
                        <form class="purchase-form">
                            <div class="form-group">
                                <input type="email" placeholder="Email para acesso" required>
                            </div>
                            <div class="form-group">
                                <input type="tel" placeholder="WhatsApp para contato" required>
                            </div>
                            
                            <div class="payment-methods">
                                <h5>Forma de Pagamento:</h5>
                                <div class="payment-options">
                                    <label class="payment-option">
                                        <input type="radio" name="payment" value="pix" checked>
                                        <span class="payment-radio"></span>
                                        PIX (10% desconto)
                                    </label>
                                    <label class="payment-option">
                                        <input type="radio" name="payment" value="card">
                                        <span class="payment-radio"></span>
                                        Cartão de Crédito
                                    </label>
                                </div>
                            </div>
                            
                            <div class="purchase-benefits">
                                <h5>O que você recebe:</h5>
                                <ul>
                                    <li>Galeria completa de fotos em HD</li>
                                    <li>Vídeos exclusivos</li>
                                    <li>Download ilimitado</li>
                                    <li>Acesso vitalício ao conteúdo</li>
                                </ul>
                            </div>
                            
                            <button type="submit" class="btn-primary btn-purchase">
                                Finalizar Compra
                            </button>
                        </form>
                        
                        <div class="security-note">
                            <small>Pagamento seguro com SSL. Seus dados estão protegidos.</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.body.style.overflow = 'hidden';
        
        // Event listeners
        setupPurchaseModal();
    }
    
    // ================================
    // Modal VIP
    // ================================
    
    function showVipModal() {
        const modalHTML = `
            <div class="vip-modal-overlay">
                <div class="vip-modal-content">
                    <div class="vip-modal-header">
                        <h3>Acesso VIP TOTAL</h3>
                        <button class="close-vip-modal">&times;</button>
                    </div>
                    <div class="vip-modal-body">
                        <div class="vip-benefits">
                            <h4>Acesso completo a todo conteúdo sem restrições</h4>
                            <ul>
                                <li>Todo conteúdo íntimo premium sem restrições</li>
                                <li>Vídeos completos em alta definição</li>
                                <li>Acesso a todas as modelos</li>
                                <li>Prioridade no suporte VIP e número da Nathalia Borges</li>
                            </ul>
                        </div>
                        
                        <div class="vip-pricing">
                            <span class="price-old">R$ 297</span>
                            <span class="price">R$ 147</span>
                            <span class="price-period">pagamento único</span>
                            <div class="vip-discount">50% OFF - Oferta Limitada</div>
                        </div>
                        
                        <form class="vip-form">
                            <div class="form-group">
                                <input type="email" placeholder="Email para acesso" required>
                            </div>
                            <div class="form-group">
                                <input type="tel" placeholder="WhatsApp para contato" required>
                            </div>
                            
                            <button type="submit" class="btn-primary btn-vip-subscribe">
                                Garantir Acesso VIP Total
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.body.style.overflow = 'hidden';
        
        // Event listeners
        setupVipModal();
    }
    
    // ================================
    // Botões de Pacotes
    // ================================
    
    const packageButtons = document.querySelectorAll('.btn-package');
    
    packageButtons.forEach(button => {
        button.addEventListener('click', function() {
            const packageCard = this.closest('.package-card');
            const packageTitle = packageCard.querySelector('h3').textContent;
            
            if (packageTitle.includes('Avulso')) {
                showPurchaseModal('Todas as Modelos', 'R$ 18');
            } else if (packageTitle.includes('Premium')) {
                showPurchaseModal('Pacote Premium Completo', 'R$ 95');
            } else {
                showVipModal();
            }
            
            trackEvent('package_click', { package: packageTitle });
        });
    });
    
    // ================================
    // Welcome Message
    // ================================
    
    function showWelcomeMessage() {
        setTimeout(() => {
            const welcomeHTML = `
                <div class="welcome-message">
                    <div class="welcome-content">
                        <h4>Bem-vindo ao Premium Content Store</h4>
                        <p>Explore nosso conteúdo exclusivo das modelos mais desejadas.</p>
                        <button class="welcome-close">Explorar Agora</button>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', welcomeHTML);
            
            const welcomeElement = document.querySelector('.welcome-message');
            const closeBtn = document.querySelector('.welcome-close');
            
            setTimeout(() => {
                welcomeElement.classList.add('show');
            }, 100);
            
            closeBtn.addEventListener('click', function() {
                welcomeElement.remove();
            });
            
            setTimeout(() => {
                if (welcomeElement) {
                    welcomeElement.remove();
                }
            }, 5000);
        }, 1000);
    }
    
    // ================================
    // Scroll Animations
    // ================================
    
    const animatedElements = document.querySelectorAll('.model-card, .package-card, .benefit-card, .guarantee-item');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const elementObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        elementObserver.observe(element);
    });
    
    // ================================
    // Timer de Urgência
    // ================================
    
    function startUrgencyTimer() {
        const urgencyBadge = document.querySelector('.urgency-badge');
        if (!urgencyBadge) return;
        
        let hours = 23;
        let minutes = 47;
        
        setInterval(() => {
            minutes--;
            if (minutes < 0) {
                minutes = 59;
                hours--;
                if (hours < 0) {
                    hours = 23;
                    minutes = 59;
                }
            }
            
            urgencyBadge.innerHTML = `<span class="badge-text">⚡ Oferta especial: 50% OFF nos pacotes (${hours}h ${minutes}m restantes)</span>`;
        }, 60000);
    }
    
    setTimeout(startUrgencyTimer, 3000);

    // Initialize final CTA countdown (hora local: hoje às 23:59:59)
    (function initFinalCTATimer(){
        const h = document.getElementById('hours');
        const m = document.getElementById('minutes');
        const s = document.getElementById('seconds');
        const btn = document.querySelector('.btn-large');
        const label = document.querySelector('.final-cta .timer-label');
        if (!h || !m || !s) return;

        const now = new Date();
        let target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        if (target <= now) target.setDate(target.getDate() + 1);

        function updateCTA(){
            const now = new Date();
            let diff = target - now;
            if (diff < 0) diff = 0;
            const secs = Math.floor(diff / 1000) % 60;
            const mins = Math.floor(diff / 60000) % 60;
            const hrs = Math.floor(diff / 3600000);

            h.textContent = String(hrs).padStart(2,'0');
            m.textContent = String(mins).padStart(2,'0');
            s.textContent = String(secs).padStart(2,'0');

            if (diff <= 0) {
                if (label) label.textContent = 'Oferta expirada';
                if (btn) btn.classList.add('disabled');
                clearInterval(timerId);
            }
        }

        updateCTA();
        const timerId = setInterval(updateCTA, 1000);

        // Enhance CTA click: smooth scroll to contact and small pulse animation
        if (btn) {
            btn.addEventListener('click', function(e){
                // default anchor behavior will handle navigation; add subtle pulse
                this.animate([
                    { transform: 'scale(1)' },
                    { transform: 'scale(0.98)' },
                    { transform: 'scale(1)' }
                ], { duration: 240, easing: 'ease-out' });
            });
        }
    })();
    
    // ================================
    // Analytics & Tracking
    // ================================
    
    function trackEvent(eventName, eventData) {
        console.log('Event tracked:', eventName, eventData);
        
        // Preparado para implementação futura
        // if (typeof gtag !== 'undefined') {
        //     gtag('event', eventName, eventData);
        // }
    }
    
    // ================================
    // Event Listeners Genéricos
    // ================================
    
    // Botões de CTA principais
    const ctaButtons = document.querySelectorAll('.btn-primary, .btn-outline');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Ripple effect
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    console.log('✅ Premium Content Store - JavaScript carregado com sucesso!');
});

// ================================
// Funções Globais para Modais
// ================================

function showPurchaseModal(modelName, modelPrice) {
    // Esta função será chamada pelos botões dentro dos modais
    const event = new CustomEvent('showPurchaseModal', {
        detail: { modelName, modelPrice }
    });
    document.dispatchEvent(event);
}

function closePreviewModal() {
    const overlay = document.querySelector('.preview-modal-overlay');
    if (overlay) {
        overlay.remove();
        document.body.style.overflow = 'auto';
    }
}

function setupPurchaseModal() {
    const overlay = document.querySelector('.purchase-modal-overlay');
    const closeBtn = document.querySelector('.close-purchase-modal');
    const form = document.querySelector('.purchase-form');
    
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            overlay.remove();
            document.body.style.overflow = 'auto';
        }
    });
    
    closeBtn.addEventListener('click', function() {
        overlay.remove();
        document.body.style.overflow = 'auto';
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('.btn-purchase');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Processando...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            showSuccessMessage('Compra realizada com sucesso! Acesso liberado.');
            overlay.remove();
            document.body.style.overflow = 'auto';
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

function setupVipModal() {
    const overlay = document.querySelector('.vip-modal-overlay');
    const closeBtn = document.querySelector('.close-vip-modal');
    const form = document.querySelector('.vip-form');
    
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            overlay.remove();
            document.body.style.overflow = 'auto';
        }
    });
    
    closeBtn.addEventListener('click', function() {
        overlay.remove();
        document.body.style.overflow = 'auto';
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('.btn-vip-subscribe');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Ativando...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            showSuccessMessage('Assinatura VIP ativada! Bem-vindo ao mundo premium.');
            overlay.remove();
            document.body.style.overflow = 'auto';
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

function showSuccessMessage(message) {
    const successHTML = `
        <div class="success-overlay">
            <div class="success-message">
                <div class="success-icon">✓</div>
                <h4>Sucesso!</h4>
                <p>${message}</p>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', successHTML);
    
    setTimeout(() => {
        document.querySelector('.success-overlay').remove();
    }, 4000);
}

// ================================
// CSS Adicional via JavaScript
// ================================

const additionalStyles = `
<style>
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        pointer-events: none;
        transform: scale(0);
        animation: rippleEffect 0.6s linear;
    }
    
    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .preview-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10001;
        animation: fadeIn 0.3s ease;
    }
    
    .preview-modal-content {
        background: white;
        border-radius: 20px;
        padding: 2rem;
        max-width: 600px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        animation: slideUp 0.3s ease;
    }
    
    .preview-image-container {
        position: relative;
        margin-bottom: 1.5rem;
        border-radius: 15px;
        overflow: hidden;
    }
    
    .preview-image-container img {
        width: 100%;
        height: 250px;
        object-fit: cover;
        object-position: top;
    }
    
    .preview-watermark {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        font-size: 1.5rem;
        font-weight: bold;
        letter-spacing: 2px;
    }
    
    /* Purchase & VIP overlays */
    .purchase-modal-overlay,
    .vip-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10001;
        animation: fadeIn 0.25s ease;
    }

    /* Modal content base */
    .purchase-modal-content,
    .vip-modal-content {
        background: linear-gradient(180deg, #ffffff, #fffaf8);
        border-radius: 16px;
        padding: 1.75rem;
        max-width: 760px;
        width: 94%;
        position: relative;
        animation: slideUp 0.25s ease;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 12px 40px rgba(10,10,10,0.35);
        border: 1px solid rgba(0,0,0,0.06);
    }

    /* VIP layout: two columns on wide screens */
    .vip-modal-body {
        display: grid;
        grid-template-columns: 1fr 360px;
        gap: 1.25rem;
        align-items: start;
    }

    .vip-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid rgba(0,0,0,0.06);
    }

    .vip-modal-header h3 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 800;
        color: #0a0a0a;
    }

    .vip-benefits {
        background: transparent;
        padding: 0.25rem 0.5rem 0 0;
    }

    .vip-benefits h4 {
        margin: 0 0 0.75rem 0;
        font-size: 1rem;
        color: #0a0a0a;
    }

    .vip-benefits ul {
        margin: 0 0 1rem 0;
        padding-left: 1.1rem;
        color: #384047;
        line-height: 1.6;
    }

    .vip-pricing-box {
        background: linear-gradient(135deg, rgba(231,76,60,0.06), rgba(243,156,18,0.04));
        border-radius: 12px;
        padding: 1rem;
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        align-items: center;
    }

    .vip-price {
        font-size: 2.25rem;
        font-weight: 900;
        color: var(--accent-red);
        margin: 0;
    }

    .vip-price-period {
        font-size: 0.9rem;
        color: #6c757d;
    }

    .vip-trial {
        font-size: 0.9rem;
        color: #6c757d;
    }

    /* Form inputs inside VIP modal */
    .vip-form input[type="email"],
    .vip-form input[type="tel"],
    .vip-form input[type="text"] {
        width: 100%;
        padding: 0.6rem 0.75rem;
        border-radius: 8px;
        border: 1px solid rgba(0,0,0,0.08);
        background: #fff;
        box-shadow: 0 4px 12px rgba(231,76,60,0.04) inset;
        margin-bottom: 0.6rem;
        font-size: 0.95rem;
    }

    .btn-vip-subscribe {
        background: linear-gradient(135deg, var(--accent-red), var(--accent-purple));
        color: #fff;
        border: none;
        padding: 0.9rem 1rem;
        border-radius: 12px;
        font-weight: 800;
        font-size: 1rem;
        cursor: pointer;
        box-shadow: 0 8px 22px rgba(231,76,60,0.18);
        width: 100%;
    }

    .btn-vip-subscribe:hover {
        transform: translateY(-3px);
        box-shadow: 0 14px 32px rgba(231,76,60,0.2);
    }

    .close-preview-modal,
    .close-purchase-modal,
    .close-vip-modal {
        background: none;
        border: none;
        font-size: 1.25rem;
        cursor: pointer;
        color: #6c757d;
        padding: 0.25rem;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.15s ease;
    }

    .close-preview-modal:hover,
    .close-purchase-modal:hover,
    .close-vip-modal:hover {
        background: rgba(0,0,0,0.04);
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes successPop {
        0% {
            opacity: 0;
            transform: scale(0.5);
        }
        50% {
            transform: scale(1.1);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    @media (max-width: 920px) {
        .vip-modal-body {
            grid-template-columns: 1fr;
        }

        .purchase-modal-content,
        .vip-modal-content {
            margin: 1rem;
            padding: 1.25rem;
        }
    }
</style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);