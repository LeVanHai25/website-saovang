/**
 * SV Aluminium — Smart Product Finder Engine
 * 3-Step Recommendation Wizard for Architectural Aluminium Systems
 */

(function () {
  let allSystems = [];

  const finderState = {
    market: 'villa',
    application: 'door-panorama',
    priority: 'max-view'
  };

  async function loadSystems() {
    try {
      const res = await fetch('data/aluminium/systems.json');
      const data = await res.json();
      allSystems = data.systems || [];
      runRecommendation();
    } catch (e) {
      console.warn('Could not load systems for finder:', e);
    }
  }

  function setFinderStep(stepKey, val, el) {
    finderState[stepKey] = val;

    // Update active UI pills
    const container = el.parentElement;
    if (container) {
      container.querySelectorAll('.finder-pill').forEach(btn => btn.classList.remove('active'));
      el.classList.add('active');
    }

    runRecommendation();
  }

  function runRecommendation() {
    if (!allSystems || allSystems.length === 0) return;

    const { market, application, priority } = finderState;

    // Score and match systems based on user selections
    const scored = allSystems.map(sys => {
      let score = 0;

      // 1. Market match
      if (sys.market_ids && sys.market_ids.includes(market)) {
        score += 30;
      }

      // 2. Application match
      if (application === 'door-opening' && sys.group_id === 'opening') score += 50;
      if (application === 'door-sliding' && sys.group_id === 'sliding-panorama') score += 40;
      if (application === 'door-panorama' && sys.id === 'l180') score += 70;
      if (application === 'door-panorama' && (sys.id === 'l120' || sys.id === 'slim-130')) score += 40;
      if (application === 'door-slim' && sys.group_id === 'slim') score += 60;
      if (application === 'door-folding' && (sys.id === 'x80-soco80' || sys.id === 'f63')) score += 60;
      if (application === 'door-hydraulic' && sys.id === 'vh65-tl60') score += 60;
      if (application === 'glazing-partition' && (sys.id === 'slim-40' || sys.id === 'md50-md52')) score += 50;
      if (application === 'facade-curtain-wall' && sys.group_id === 'facade') score += 60;

      // 3. Priority match
      if (priority === 'cost-effective' && (sys.level && sys.level.recommended_value === 'essential')) score += 30;
      if (priority === 'balanced' && (sys.level && sys.level.recommended_value === 'premium')) score += 30;
      if (priority === 'high-end' && (sys.level && sys.level.recommended_value === 'signature')) score += 30;
      if (priority === 'max-view' && (sys.id === 'l180' || sys.id === 'slim-130' || sys.id === 'l120')) score += 35;
      if (priority === 'minimalist' && sys.group_id === 'slim') score += 35;
      if (priority === 'coastal-marine' && (sys.finishes.anodizeColors && sys.finishes.anodizeColors.length > 0)) score += 35;

      return { sys, score };
    });

    // Sort by score descending and take top 2-3 systems
    scored.sort((a, b) => b.score - a.score);
    const topMatches = scored.slice(0, 3).map(x => x.sys);

    renderFinderResults(topMatches);
  }

  function renderFinderResults(systems) {
    const resultsContainer = document.getElementById('finderResults');
    if (!resultsContainer) return;

    if (!systems || systems.length === 0) {
      resultsContainer.innerHTML = '<p style="color: #94A3B8; text-align: center;">Vui lòng chọn các tiêu chí để nhận đề xuất hệ nhôm phù hợp.</p>';
      return;
    }

    const groupNames = {
      'opening': 'Cửa Mở Quay Châu Âu',
      'sliding-panorama': 'Cửa Lùa & Panorama Khổ Lớn',
      'slim': 'Hệ Nhôm Slim Tối Giản',
      'special': 'Cửa Thủy Lực & Xếp Trượt Đặc Biệt',
      'facade': 'Mặt Dựng & Vách Kính Kiến Trúc'
    };

    resultsContainer.innerHTML = `
      <div style="margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
        <span style="font-family: var(--ff-head); font-size: 13px; font-weight: 800; color: #C9A227; text-transform: uppercase; letter-spacing: 0.08em;">
          <i class="ri-sparkling-fill"></i> CÁC HỆ ĐỀ XUẤT ĐỂ XEM XÉT (${systems.length} Hệ)
        </span>
        <span style="font-size: 11.5px; color: #94A3B8;">Đề xuất dựa trên loại công trình và ưu tiên thiết kế của bạn</span>
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
        ${systems.map(s => {
          const hasAnodize = s.finishes && s.finishes.anodizeColors && s.finishes.anodizeColors.length > 0;
          return `
            <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 10px; padding: 20px; display: flex; flex-direction: column; transition: all 0.2s ease; position: relative;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <span style="background: #0F172A; color: #C9A227; font-family: var(--ff-head); font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 4px;">
                  ${s.code}
                </span>
                <span style="font-size: 10.5px; font-weight: 700; color: #64748B; background: #F1F5F9; padding: 3px 8px; border-radius: 4px;">
                  ${groupNames[s.group_id] || ''}
                </span>
              </div>
              <h4 style="font-family: var(--ff-head); font-size: 16px; font-weight: 800; color: #0F172A; margin: 0 0 6px;">
                ${s.name}
              </h4>
              <p style="font-size: 12.5px; color: #64748B; line-height: 1.5; margin: 0 0 14px; flex-grow: 1;">
                ${s.marketing ? s.marketing.tagline : (s.applications || []).slice(0, 2).join(', ')}
              </p>
              <div style="font-size: 11.5px; color: #475569; border-top: 1px solid #F1F5F9; padding-top: 10px; margin-bottom: 14px;">
                <div>&bull; Bề mặt: <strong>${(s.finishes.powderColors || []).slice(0, 3).join(', ')}</strong></div>
                ${hasAnodize ? `<div style="color: #92400E; margin-top: 2px;">&bull; Anodize ED: <strong>Champagne V8/Y01</strong></div>` : ''}
              </div>
              <div style="display: flex; gap: 8px;">
                <a href="thuvienprofilenhom.html" style="flex: 1; text-align: center; background: #F8FAFC; border: 1px solid #CBD5E1; color: #0F172A; font-family: var(--ff-head); font-size: 11.5px; font-weight: 700; padding: 8px; border-radius: 6px; text-decoration: none;">
                  Xem Profile
                </a>
                <button onclick="selectSystemForRfq('${s.code}', '${s.name}')" style="flex: 1; text-align: center; background: #C9A227; border: none; color: #0F172A; font-family: var(--ff-head); font-size: 11.5px; font-weight: 800; padding: 8px; border-radius: 6px; cursor: pointer;">
                  Nhận Báo Giá
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  function selectSystemForRfq(code, name) {
    const sysSelect = document.getElementById('rfqSystem');
    const notesInput = document.getElementById('rfqNotes');
    
    if (sysSelect) {
      // Find matching option or select
      let found = false;
      for (let i = 0; i < sysSelect.options.length; i++) {
        if (sysSelect.options[i].text.toLowerCase().includes(code.toLowerCase())) {
          sysSelect.selectedIndex = i;
          found = true;
          break;
        }
      }
      if (!found) sysSelect.value = 'undecided';
    }

    if (notesInput) {
      notesInput.value = `[Đề xuất từ Smart Finder] Quan tâm hệ nhôm: ${code} (${name}). Cần tư vấn chi tiết cấu hình và gửi dự toán.`;
    }

    // Smooth scroll to RFQ section
    const rfqSec = document.getElementById('rfqSection');
    if (rfqSec) {
      rfqSec.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Expose global methods
  window.setFinderStep = setFinderStep;
  window.selectSystemForRfq = selectSystemForRfq;

  document.addEventListener('DOMContentLoaded', loadSystems);
})();
