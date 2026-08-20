/**
 * SV Aluminium — 6-Step Solution Finder & Recommendation Engine
 * Enterprise Architecture: Project -> Space -> Opening -> Performance -> Style -> Level -> Match Score (%)
 */

(function () {
  let allSystems = [];
  let allSolutions = [];

  const finderState = {
    project: 'villa',
    space: 'living-balcony',
    opening: 'lift-slide',
    performance: 'max-span',
    aesthetic: 'panorama-resort',
    level: 'signature'
  };

  async function initFinder() {
    try {
      const [sysRes, solRes] = await Promise.all([
        fetch('data/aluminium/systems.json'),
        fetch('data/aluminium/solutions.json')
      ]);
      allSystems = await sysRes.json();
      allSolutions = await solRes.json();
      runRecommendation();
    } catch (e) {
      console.warn('Could not initialize finder data:', e);
    }
  }

  window.setFinderStep = function (stepKey, val, el) {
    finderState[stepKey] = val;

    // Update active UI pills
    const container = el.parentElement;
    if (container) {
      container.querySelectorAll('.finder-pill').forEach(btn => btn.classList.remove('active'));
      el.classList.add('active');
    }

    runRecommendation();
  };

  function calculateMatch(sys) {
    let score = 50; // Base score

    // 1. Level Match (Max +20)
    if (sys.level_id === finderState.level) {
      score += 20;
    } else if (
      (finderState.level === 'ultra_luxury' && sys.level_id === 'signature') ||
      (finderState.level === 'signature' && (sys.level_id === 'ultra_luxury' || sys.level_id === 'premium')) ||
      (finderState.level === 'premium' && (sys.level_id === 'signature' || sys.level_id === 'essential')) ||
      (finderState.level === 'essential' && sys.level_id === 'premium')
    ) {
      score += 10;
    }

    // 2. Opening Mechanism Match (Max +20)
    const op = finderState.opening;
    if (op === 'swing' && sys.group_id === 'grp-opening') score += 20;
    if (op === 'sliding' && sys.group_id === 'grp-sliding') score += 18;
    if (op === 'lift-slide' && sys.id === 'l180') score += 25;
    if (op === 'slim-hanging' && sys.id === 'slim-40') score += 25;
    if (op === 'bifold' && (sys.id === 'x80-soco80' || sys.id === 'f63')) score += 22;
    if (op === 'hydraulic' && sys.id === 'vh65-tl60') score += 25;
    if (op === 'curtain-wall' && sys.group_id === 'grp-facade') score += 25;

    // 3. Performance Match (Max +15)
    const perf = finderState.performance;
    if (perf === 'acoustic' && (sys.id === 'xf55-multi' || sys.id === 'c55-euro')) score += 15;
    if (perf === 'thermal' && (sys.id === 'l180' || sys.id === 'c65-euro' || sys.id === 'md65')) score += 15;
    if (perf === 'max-span' && (sys.id === 'l180' || sys.id === 'x80-soco80' || sys.id === 'md65')) score += 15;
    if (perf === 'weather-marine' && (sys.anodize_compatible || sys.id === 'c65-euro' || sys.id === 'l180' || sys.id === 'md65')) score += 15;
    if (perf === 'minimalist-profile' && sys.group_id === 'grp-slim') score += 15;

    // 4. Space / Application Match (Max +10)
    const space = finderState.space;
    if (space === 'entrance' && (sys.id === 'vh65-tl60' || sys.id === 'c65-euro' || sys.id === 'xf55-flat')) score += 10;
    if (space === 'living-balcony' && (sys.id === 'l180' || sys.id === 'l120' || sys.id === 'l94-l95' || sys.id === 'xf55-flat')) score += 10;
    if (space === 'panorama' && (sys.id === 'l180' || sys.id === 'x80-soco80' || sys.id === 'l120')) score += 10;
    if (space === 'bedroom' && (sys.id === 'xf55-multi' || sys.id === 'c55-euro' || sys.id === 'xf55-flat')) score += 10;
    if (space === 'interior-slim' && (sys.id === 'slim-40' || sys.id === 'slim-130')) score += 10;
    if (space === 'pool-garden' && (sys.id === 'x80-soco80' || sys.id === 'f63' || sys.id === 'l180')) score += 10;
    if (space === 'facade' && (sys.id === 'md50-md52' || sys.id === 'md65')) score += 10;

    // Normalize to max 98%
    const finalScore = Math.min(98, Math.max(68, score));
    return finalScore;
  }

  function runRecommendation() {
    if (!allSystems || allSystems.length === 0) return;

    const scored = allSystems.map(sys => {
      const matchScore = calculateMatch(sys);
      return { sys, matchScore };
    });

    // Sort descending by match score
    scored.sort((a, b) => b.matchScore - a.matchScore);
    const topMatches = scored.slice(0, 3);

    renderFinderResults(topMatches);
  }

  function renderFinderResults(matches) {
    const resultsContainer = document.getElementById('finderResults');
    if (!resultsContainer) return;

    if (!matches || matches.length === 0) {
      resultsContainer.innerHTML = '<p style="color: #94A3B8; text-align: center;">Vui lòng chọn các tiêu chí để nhận đề xuất giải pháp phù hợp.</p>';
      return;
    }

    let cardsHtml = matches.map(({ sys, matchScore }, idx) => {
      const isTop = idx === 0;
      return `
        <div class="finder-result-card" style="background: #1E293B; border: 1px solid ${isTop ? '#C9A227' : '#334155'}; border-radius: 12px; padding: 24px; position: relative; transition: all 0.3s ease; display: flex; flex-direction: column; justify-content: space-between;">
          ${isTop ? `
            <div style="position: absolute; top: -12px; left: 24px; background: linear-gradient(135deg, #C9A227 0%, #E5C158 100%); color: #0F172A; font-family: var(--ff-head); font-size: 11px; font-weight: 800; padding: 3px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.1em; box-shadow: 0 4px 12px rgba(201,162,39,0.35);">
              ⭐ KHUYÊN DÙNG HÀNG ĐẦU
            </div>
          ` : ''}

          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
              <div>
                <span style="font-family: var(--ff-head); font-size: 11px; font-weight: 800; color: #C9A227; text-transform: uppercase; letter-spacing: 0.1em;">${sys.group_name}</span>
                <h4 style="font-family: var(--ff-head); font-size: 18px; font-weight: 800; color: #FFFFFF; margin: 4px 0 2px;">${sys.name}</h4>
                <div style="font-size: 12px; color: #94A3B8;">${sys.code} &bull; ${sys.manufacturer_source}</div>
              </div>
              <div style="background: rgba(201, 162, 39, 0.15); border: 1px solid #C9A227; padding: 4px 10px; border-radius: 6px; text-align: right;">
                <div style="font-family: var(--ff-head); font-size: 16px; font-weight: 900; color: #E5C158;">${matchScore}%</div>
                <div style="font-size: 9.5px; font-weight: 700; color: #94A3B8; text-transform: uppercase;">Match Score</div>
              </div>
            </div>

            <p style="font-size: 13.5px; line-height: 1.6; color: #CBD5E1; margin-bottom: 16px;">
              ${sys.description}
            </p>

            <div style="background: #0F172A; border-radius: 8px; padding: 12px 14px; margin-bottom: 16px; font-size: 12.5px; color: #94A3B8; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <div><strong style="color: #E2E8F0;">Độ dày:</strong> ${sys.specs.thickness}</div>
              <div><strong style="color: #E2E8F0;">Khẩu độ tối đa:</strong> ${sys.specs.max_width_leaf} x ${sys.specs.max_height_leaf}</div>
              <div><strong style="color: #E2E8F0;">Kính tương thích:</strong> ${sys.specs.glass_thickness}</div>
              <div><strong style="color: #E2E8F0;">Cấp đầu tư:</strong> <span style="color: #C9A227;">${sys.investment_level}</span></div>
            </div>
          </div>

          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <a href="thuvienprofilenhom.html?sys=${sys.id}" class="btn-secondary" style="flex: 1; text-align: center; font-size: 12px; font-weight: 700; padding: 9px 14px; border-radius: 6px; border: 1px solid #475569; color: #FFFFFF; text-decoration: none;">
              Xem Hồ Sơ Kỹ Thuật
            </a>
            <button onclick="selectSystemForRfq('${sys.name}', '${sys.code}')" style="flex: 1; text-align: center; font-size: 12px; font-weight: 800; padding: 9px 14px; border-radius: 6px; background: #C9A227; color: #0F172A; border: none; cursor: pointer; font-family: var(--ff-head);">
              Nhận Dự Toán Hệ Này
            </button>
          </div>
        </div>
      `;
    }).join('');

    resultsContainer.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
        ${cardsHtml}
      </div>
      <div style="margin-top: 18px; padding: 12px 16px; background: rgba(15, 23, 42, 0.6); border-left: 3px solid #C9A227; border-radius: 4px; font-size: 12px; color: #94A3B8; line-height: 1.6;">
        ℹ️ <strong>Khuyến cáo kỹ thuật:</strong> Điểm đề xuất (Recommendation Score) mang tính tư vấn định hướng sơ bộ theo tiêu chí không gian. Cấu hình hệ nhôm, kích thước chia đố, tải trọng phụ kiện và chủng loại kính thực tế sẽ được kỹ sư Sao Vàng tính toán chính xác theo hồ sơ thiết kế công trình.
      </div>
    `;
  }

  window.selectSystemForRfq = function (sysName, sysCode) {
    const rfqTextarea = document.getElementById('rfqNotes') || document.querySelector('textarea[name="project_notes"]');
    const rfqSection = document.getElementById('rfqSection');
    
    if (rfqTextarea) {
      rfqTextarea.value = `[Đề xuất từ Smart Finder] Yêu cầu tư vấn & dự toán hệ: ${sysName} (${sysCode}). Phân khúc: ${finderState.level.toUpperCase()} cho công trình ${finderState.project.toUpperCase()}.`;
    }

    if (rfqSection) {
      rfqSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  document.addEventListener('DOMContentLoaded', initFinder);
})();
