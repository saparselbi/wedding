document.addEventListener("DOMContentLoaded", () => {
    // 0. Envelope Animation Logic
    const envelopeWrapper = document.getElementById('envelope-wrapper');
    const envelope = document.getElementById('envelope');
    
    if (envelopeWrapper && envelope) {
        // Disable scroll while envelope is visible
        document.body.style.overflow = 'hidden';
        
        envelope.addEventListener('click', () => {
            envelope.classList.add('open');
            
            // Fade out envelope after letter slides out
            setTimeout(() => {
                envelopeWrapper.classList.add('hidden');
                document.body.style.overflow = ''; // Resume scrolling
            }, 1800);
        });
    }

    // 1. Анимация появления элементов при скролле
    const fadeElements = document.querySelectorAll('.fade-in');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Один раз анимируем
            }
        });
    }, observerOptions);
    
    fadeElements.forEach(el => observer.observe(el));

    // 2. Таймер (Дата свадьбы: 28 апреля 2026 18:00)
    const targetDate = new Date('April 28, 2026 18:00:00').getTime();
    
    function updateTimer() {
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        if (distance < 0) {
            document.getElementById("countdown").innerHTML = "<div class='time-box'><span style='color: var(--burgundy)'>Свадьба состоялась!</span></div>";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = days.toString().padStart(2, '0');
        document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
        document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
        document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');
    }
    
    updateTimer(); // Initial call
    const countInterval = setInterval(updateTimer, 1000);

    // 3. Анимация скользящего сердечка по таймлайну
    const timelineSvg = document.querySelector('.timeline-svg');
    const timelinePath = document.getElementById('timelinePath');
    const slidingHeart = document.getElementById('slidingHeart');
    const timelineSection = document.getElementById('timelineSection');

    let pathLength = 0;
    if(timelinePath) {
        pathLength = timelinePath.getTotalLength();
    }
    
    const updateHeartPosition = () => {
        if(!timelineSection || !timelineSvg || !timelinePath) return;

        const rect = timelineSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Начало анимации, когда секция появляется на ~80% экрана
        let startPos = rect.top - (viewportHeight * 0.8);
        // Конец анимации, когда секция почти прокручена
        let endPos = rect.bottom - (viewportHeight * 0.5);
        
        let progress = 0;
        if(startPos < 0) {
            let totalDist = endPos - startPos;
            let scrolled = -startPos;
            progress = scrolled / totalDist;
            if(progress > 1) progress = 1;
            if(progress < 0) progress = 0;
        }

        // Высчитываем точку на SVG path (0..length)
        const targetLength = progress * pathLength;
        const pt = timelinePath.getPointAtLength(targetLength);
        
        // Координаты pt.x и pt.y у нас в viewBox 0 0 100 800.
        // Переведем их в пиксели в зависимости от реальных размеров SVG
        const svgRect = timelineSvg.getBoundingClientRect();
        
        // Т.к. viewBox="0 0 100 800", ширина 100 условных ед, высота 800
        const xPercent = (pt.x / 100) * svgRect.width;
        const yPercent = (pt.y / 800) * svgRect.height;
        
        slidingHeart.style.left = `${xPercent}px`;
        // Top relative to timeline-section. SVG is at top: 60px inside the wrapper.
        slidingHeart.style.top = `${yPercent + 60}px`;
    };

    window.addEventListener('scroll', updateHeartPosition);
    window.addEventListener('resize', updateHeartPosition);
    setTimeout(updateHeartPosition, 300); // Init
});
