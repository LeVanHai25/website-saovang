/* ════════════════════════════════════════════════════════════════
   SAO VÀNG — modules/page-hero-slider.js
   Tự động hóa nâng cấp biểu ngữ đầu trang con (Page Hero) thành Slideshow động cao cấp.
   ════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  function initPageHeroSlider() {
    const hero = document.querySelector('.page-hero');
    if (!hero) return;

    // Avoid double initialization
    if (hero.querySelector('.page-hero-slides')) return;

    // Detect section group based on path name or title content
    const pathname = window.location.pathname.toLowerCase();
    const titleEl = hero.querySelector('.page-hero-title');
    const titleText = (titleEl?.textContent || '').trim().toLowerCase();
    const tagEl = hero.querySelector('.tag, .page-hero-tag');
    const tagText = (tagEl?.textContent || '').trim().toLowerCase();

    let category = 'corporate';
    if (
      pathname.includes('co-khi') || 
      pathname.includes('cong-nghe-thuat') || 
      pathname.includes('cau-thang-xoan') || 
      pathname.includes('nang-luc') ||
      titleText.includes('cơ khí') || 
      titleText.includes('cầu thang') || 
      titleText.includes('cổng') || 
      titleText.includes('năng lực') ||
      tagText.includes('cơ khí')
    ) {
      category = 'co-khi';
    } else if (
      pathname.includes('nhom') || 
      pathname.includes('vach-kinh') || 
      pathname.includes('lan-can-kinh') || 
      pathname.includes('thu-vien') ||
      titleText.includes('nhôm') || 
      titleText.includes('vách kính') || 
      titleText.includes('lan can') || 
      titleText.includes('thư viện') ||
      tagText.includes('nhôm')
    ) {
      category = 'nhom-kinh';
    }

    // Define brand badges configuration
    const brandBadgeHtml = {
      'co-khi': `
        <div class="hero-brand-badge">
          <img src="assets/images/logo-sv-main.svg" alt="Sao Vàng" class="hero-brand-logo" />
          <div class="hero-brand-text">
            <span class="brand-title">CƠ KHÍ SAO VÀNG</span>
            <span class="brand-sub">CHẾ TÁC KIM LOẠI MỸ THUẬT & CNC</span>
          </div>
        </div>
      `,
      'nhom-kinh': `
        <div class="hero-brand-badge">
          <img src="assets/images/logo-sv-main.svg" alt="Sao Vàng" class="hero-brand-logo" />
          <div class="hero-brand-text">
            <span class="brand-title" style="color: #E2B13C;">SV ALUMINIUM</span>
            <span class="brand-sub">DOOR & WINDOW</span>
          </div>
        </div>
      `,
      'corporate': `
        <div class="hero-brand-badge">
          <img src="assets/images/logo-sv-main.svg" alt="Sao Vàng" class="hero-brand-logo" />
          <div class="hero-brand-text">
            <span class="brand-title">SAO VÀNG</span>
            <span class="brand-sub">KỸ NGHỆ CƠ KHÍ & NHÔM KÍNH</span>
          </div>
        </div>
      `
    };

    // Define slide sets for Slide 2 and Slide 3
    const additionalSlidesData = {
      'co-khi': [
        {
          image: 'assets/images/laser_cutting.png',
          tag: 'GIA CÔNG CNC',
          title: 'CÔNG NGHỆ CẮT LASER CHÍNH XÁC',
          desc: 'Hệ thống máy cắt Laser fiber công suất lớn gia công thép tấm, inox tấm với độ dung sai cực nhỏ dưới 0.1mm.'
        },
        {
          image: 'assets/images/service-mechanical-art.png',
          tag: 'MỸ THUẬT ĐỈNH CAO',
          title: 'NGHỆ THUẬT SẮT RÈN THỦ CÔNG',
          desc: 'Sản phẩm cổng sắt, lan can ban công nghệ thuật được rèn uốn nóng ở 1100°C bởi các nghệ nhân lành nghề.'
        }
      ],
      'nhom-kinh': [
        {
          image: 'assets/images/service-glass-facades.png',
          tag: 'MẶT DỰNG KIẾN TRÚC',
          title: 'VÁCH KÍNH MẶT DỰNG TOÀN KHỔ',
          desc: 'Thi công hệ vách dựng semi-unitized và unitized kính Low-E phản quang cản nhiệt vượt trội cho cao ốc.'
        },
        {
          image: 'assets/images/service-aluminum-doors.png',
          tag: 'HỆ CỬA CAO CẤP',
          title: 'CỬA NHÔM SLIM PANORAMA',
          desc: 'Hệ cửa mở trượt siêu mảnh tối ưu tầm nhìn, phụ kiện Sobinco/Cogo vận hành êm ái trơn tru.'
        }
      ],
      'corporate': [
        {
          image: 'assets/images/hero-services.png',
          tag: 'NĂNG LỰC DỰ ÁN',
          title: 'HƠN 50+ DỰ ÁN ĐÃ BÀN GIAO',
          desc: 'Kiến tạo giá trị bền vững cho các công trình biệt thự, lâu đài sang trọng và kết cấu du thuyền hàng hải.'
        },
        {
          image: 'assets/images/team_engineers.png',
          tag: 'ĐỘI NGŨ CHUYÊN GIA',
          title: 'KỸ SƯ & NGHỆ NHÂN CHUYÊN NGHIỆP',
          desc: 'Đội ngũ giàu kinh nghiệm sẵn sàng khảo sát, đo đạc 3D thực tế và tư vấn giải pháp kỹ thuật tối ưu nhất.'
        }
      ]
    };

    // Extract Slide 1 content from DOM
    const slide1Bg = hero.querySelector('.page-hero-bg');
    const slide1Content = hero.querySelector('.page-hero-content');
    if (!slide1Bg || !slide1Content) return;

    // Prepend brand badge to Slide 1 content if it doesn't already have one
    if (!slide1Content.querySelector('.hero-brand-badge')) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = brandBadgeHtml[category].trim();
      const badgeNode = tempDiv.firstChild;
      slide1Content.insertBefore(badgeNode, slide1Content.firstChild);
    }

    // Keep original slide 1 image class & inline filter style if any
    const slide1Img = slide1Bg.querySelector('img');
    const slide1ImgStyle = slide1Img ? slide1Img.getAttribute('style') : '';

    // Create Slides wrapper
    const slidesContainer = document.createElement('div');
    slidesContainer.className = 'page-hero-slides';

    // Build Slide 1
    const slide1 = document.createElement('div');
    slide1.className = 'page-hero-slide active';
    const bg1 = slide1Bg.cloneNode(true);
    const cnt1 = slide1Content.cloneNode(true);
    // Keep styling classes
    if (hero.classList.contains('nhom-hero')) {
      cnt1.classList.remove('sr-only'); // Allow showing text overlays on other slides, but keep slide 1 clean
    }
    slide1.appendChild(bg1);
    slide1.appendChild(cnt1);
    slidesContainer.appendChild(slide1);

    // Build Slide 2 and Slide 3
    const extraSlides = additionalSlidesData[category];
    extraSlides.forEach((slideData) => {
      const slide = document.createElement('div');
      slide.className = 'page-hero-slide';

      // Create BG with overlay
      const bg = document.createElement('div');
      bg.className = 'page-hero-bg';
      
      const img = document.createElement('img');
      img.src = slideData.image;
      img.alt = slideData.title;
      if (slide1ImgStyle) img.setAttribute('style', slide1ImgStyle);
      
      const overlay = document.createElement('div');
      overlay.className = 'page-hero-overlay';

      bg.appendChild(img);
      bg.appendChild(overlay);

      // Create Content Container
      const container = document.createElement('div');
      container.className = 'container page-hero-content';

      // Insert Brand Badge
      const brandDiv = document.createElement('div');
      brandDiv.innerHTML = brandBadgeHtml[category].trim();
      container.appendChild(brandDiv.firstChild);

      // Insert Tag
      const tag = document.createElement('span');
      tag.className = 'tag white';
      tag.textContent = slideData.tag;
      container.appendChild(tag);

      // Insert Title
      const title = document.createElement('h2');
      title.className = 'page-hero-title';
      title.textContent = slideData.title;
      container.appendChild(title);

      // Insert Desc
      const desc = document.createElement('p');
      desc.className = 'page-hero-desc';
      desc.textContent = slideData.desc;
      container.appendChild(desc);

      // Insert Breadcrumb copy from slide 1 if exists
      const breadcrumb = cnt1.querySelector('.breadcrumb');
      if (breadcrumb) {
        container.appendChild(breadcrumb.cloneNode(true));
      }

      slide.appendChild(bg);
      slide.appendChild(container);
      slidesContainer.appendChild(slide);
    });

    // Clear original elements and append the new structured slides wrapper
    hero.innerHTML = '';
    hero.appendChild(slidesContainer);

    // Create dot navigation indicators
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'slider-dots';

    const slidesCount = 3;
    for (let i = 0; i < slidesCount; i++) {
      const dot = document.createElement('button');
      dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Chuyển tới slide ${i + 1}`);
      dotsContainer.appendChild(dot);
    }
    hero.appendChild(dotsContainer);

    // Create left & right arrows
    const prevBtn = document.createElement('button');
    prevBtn.className = 'slider-arrow prev';
    prevBtn.setAttribute('aria-label', 'Slide trước');
    prevBtn.innerHTML = '<i class="ri-arrow-left-s-line"></i>';

    const nextBtn = document.createElement('button');
    nextBtn.className = 'slider-arrow next';
    nextBtn.setAttribute('aria-label', 'Slide tiếp theo');
    nextBtn.innerHTML = '<i class="ri-arrow-right-s-line"></i>';

    hero.appendChild(prevBtn);
    hero.appendChild(nextBtn);

    // Slider State
    let currentIndex = 0;
    let timer = null;
    const slides = hero.querySelectorAll('.page-hero-slide');
    const dots = hero.querySelectorAll('.slider-dot');

    function showSlide(index) {
      if (index === currentIndex) return;
      
      // Boundaries check
      if (index < 0) index = slidesCount - 1;
      if (index >= slidesCount) index = 0;

      // Deactivate current
      slides[currentIndex].classList.remove('active');
      dots[currentIndex].classList.remove('active');

      // Activate new
      slides[index].classList.add('active');
      dots[index].classList.add('active');

      currentIndex = index;
    }

    function startTimer() {
      stopTimer();
      timer = setInterval(() => {
        showSlide(currentIndex + 1);
      }, 5000);
    }

    function stopTimer() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    // Dot click events
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        stopTimer();
        showSlide(index);
        startTimer();
      });
    });

    // Arrow events
    prevBtn.addEventListener('click', () => {
      stopTimer();
      showSlide(currentIndex - 1);
      startTimer();
    });

    nextBtn.addEventListener('click', () => {
      stopTimer();
      showSlide(currentIndex + 1);
      startTimer();
    });

    // Touch Swipe Support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    hero.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    hero.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > 50) { // minimum swipe distance
        stopTimer();
        if (swipeDistance > 0) {
          // Swipe right -> prev
          showSlide(currentIndex - 1);
        } else {
          // Swipe left -> next
          showSlide(currentIndex + 1);
        }
        startTimer();
      }
    }

    // Start auto slider on load
    startTimer();
  }

  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPageHeroSlider);
  } else {
    initPageHeroSlider();
  }
})();
