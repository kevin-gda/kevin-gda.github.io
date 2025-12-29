/*
 * JavaScript para página promocional
 * Mejoras de UX y conversión
 */

jQuery(document).ready(function ($) {
    'use strict';

    // Smooth scroll para todos los enlaces internos
    $('a[href^="#"]').on('click', function(event) {
        var target = $(this.getAttribute('href'));
        if(target.length) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 70
            }, 800);
        }
    });

    // Animación de entrada para elementos cuando entran en viewport
    function fadeInOnScroll() {
        $('.benefit-box, .service, .testimonial, .highlighted-box').each(function() {
            var elementTop = $(this).offset().top;
            var elementBottom = elementTop + $(this).outerHeight();
            var viewportTop = $(window).scrollTop();
            var viewportBottom = viewportTop + $(window).height();
            
            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                $(this).addClass('fade-in-up');
            }
        });
    }

    // Ejecutar al cargar y al hacer scroll
    fadeInOnScroll();
    $(window).on('scroll', fadeInOnScroll);

    // Añadir clases para animaciones
    $('<style>')
        .prop('type', 'text/css')
        .html(`
            .fade-in-up {
                animation: fadeInUp 0.6s ease-out forwards;
                opacity: 0;
            }
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `)
        .appendTo('head');

    // Click tracking para CTAs (opcional - para analytics)
    $('.urgent-cta').on('click', function() {
        var ctaText = $(this).text();
        console.log('CTA clicked:', ctaText);
        
        // Si tienes Google Analytics, puedes descomentar esto:
        // if (typeof gtag !== 'undefined') {
        //     gtag('event', 'click', {
        //         'event_category': 'CTA',
        //         'event_label': ctaText
        //     });
        // }
    });

    // Click tracking para números de teléfono
    $('a[href^="tel:"]').on('click', function() {
        var phoneNumber = $(this).attr('href');
        console.log('Phone link clicked:', phoneNumber);
        
        // Si tienes Google Analytics, puedes descomentar esto:
        // if (typeof gtag !== 'undefined') {
        //     gtag('event', 'click', {
        //         'event_category': 'Phone',
        //         'event_label': phoneNumber
        //     });
        // }
    });

    // Efecto de pulso más intenso cuando se hace hover en números de teléfono
    $('.phone-number').on('mouseenter', function() {
        $(this).css('transform', 'scale(1.05)');
    }).on('mouseleave', function() {
        $(this).css('transform', 'scale(1)');
    });

    // Añadir transición suave a números de teléfono
    $('.phone-number').css('transition', 'transform 0.3s ease');

    // Mejorar accesibilidad: añadir aria-label a los CTAs
    $('.urgent-cta').each(function() {
        if (!$(this).attr('aria-label')) {
            $(this).attr('aria-label', 'Llamar para reservar cita');
        }
    });

    // Detectar si es móvil y ajustar comportamiento
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // En móvil, hacer que los números de teléfono sean más fáciles de tocar
        $('.phone-number').css({
            'cursor': 'pointer',
            'user-select': 'all'
        });
        
        // Añadir vibración al tocar CTA (si está disponible)
        $('.urgent-cta, a[href^="tel:"]').on('touchstart', function() {
            if ('vibrate' in navigator) {
                navigator.vibrate(50);
            }
        });
    }

    // Sticky CTA (opcional): mostrar botón flotante al hacer scroll
    var stickyCtaShown = false;
    
    $(window).on('scroll', function() {
        var scrollPosition = $(window).scrollTop();
        var windowHeight = $(window).height();
        
        // Mostrar CTA flotante después de scrollear 2 pantallas
        if (scrollPosition > windowHeight * 2 && !stickyCtaShown) {
            createStickyCTA();
            stickyCtaShown = true;
        }
    });

    function createStickyCTA() {
        var stickyHTML = `
            <div id="sticky-cta" style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                animation: slideInRight 0.5s ease-out;
            ">
                <a href="tel:+34673624732" class="urgent-cta" style="
                    margin: 0;
                    box-shadow: 0 5px 25px rgba(211,47,47,0.6);
                    font-size: 18px;
                    padding: 15px 25px;
                ">
                    📞 LLAMAR AHORA
                </a>
                <button id="close-sticky" style="
                    position: absolute;
                    top: -10px;
                    right: -10px;
                    background: #181A1C;
                    color: white;
                    border: 2px solid #FECE1A;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    cursor: pointer;
                    font-size: 16px;
                    line-height: 1;
                    padding: 0;
                ">×</button>
            </div>
        `;
        
        $('body').append(stickyHTML);
        
        // Añadir animación
        $('<style>')
            .prop('type', 'text/css')
            .html(`
                @keyframes slideInRight {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                #sticky-cta {
                    animation: slideInRight 0.5s ease-out;
                }
                @media (max-width: 767px) {
                    #sticky-cta {
                        bottom: 10px;
                        right: 10px;
                        left: 10px;
                    }
                    #sticky-cta .urgent-cta {
                        width: 100%;
                        font-size: 16px;
                        padding: 12px 20px;
                    }
                }
            `)
            .appendTo('head');
        
        // Cerrar sticky CTA
        $('#close-sticky').on('click', function() {
            $('#sticky-cta').fadeOut(300, function() {
                $(this).remove();
            });
        });
    }

    // Prevenir el comportamiento por defecto en caso de que el usuario no tenga app de teléfono
    // y mostrar el número para que pueda copiarlo
    if (!isMobile) {
        $('a[href^="tel:"]').on('click', function(e) {
            // En desktop, mostrar el número en un alert o modal
            var phoneNumber = $(this).attr('href').replace('tel:+34', '');
            // Descomentar si quieres mostrar un alert en desktop:
            // e.preventDefault();
            // alert('Llámanos al: +34 ' + phoneNumber);
        });
    }

    // Countdown timer animado (opcional)
    var countdownElement = $('.countdown-timer');
    if (countdownElement.length) {
        setInterval(function() {
            countdownElement.toggleClass('pulse-animation');
        }, 2000);
    }

    // Añadir efectos de partículas o confetti cuando se hace click en CTA (opcional y llamativo)
    // Esta función es opcional y solo para añadir un efecto visual "wow"
    $('.urgent-cta').on('click', function() {
        // Efecto visual simple al hacer click
        $(this).css('background', '#8b0000');
        setTimeout(() => {
            $(this).css('background', '#d32f2f');
        }, 200);
    });

    console.log('Promo page scripts loaded successfully');
});

