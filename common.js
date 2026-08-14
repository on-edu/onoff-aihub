// 여러 페이지에서 공통으로 쓰는 헤더(메뉴)와 푸터를 불러와 삽입합니다.
// header.html / footer.html 파일 하나만 수정하면 모든 페이지에 함께 반영됩니다.
// 주의: fetch로 로컬 파일을 불러오기 때문에, file:// 로 직접 열면 브라우저 보안 정책(CORS)에 막힐 수 있습니다.
// 반드시 웹 서버(호스팅)에 올리거나, 로컬 테스트 시 간단한 로컬 서버(VSCode Live Server 등)로 열어주세요.

async function includeHTML(selector, url) {
  const el = document.querySelector(selector);
  if (!el) return;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url} 로드 실패 (${res.status})`);
    el.innerHTML = await res.text();
  } catch (err) {
    console.error('공통 템플릿을 불러오지 못했습니다:', err);
  }
}

function initHeaderScroll() {
  const header = document.getElementById('siteHeader');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  });
}

async function loadPartials() {
  await Promise.all([
    includeHTML('#site-header', 'partials/header.html'),
    includeHTML('#site-footer', 'partials/footer.html'),
  ]);
  initHeaderScroll();

  // 헤더/푸터가 비동기로 삽입된 뒤에 로드되므로,
  // #contact 같은 해시 링크로 들어온 경우 삽입이 끝난 뒤 다시 스크롤해줍니다.
  if (location.hash) {
    const target = document.querySelector(location.hash);
    if (target) target.scrollIntoView();
  }

  document.dispatchEvent(new CustomEvent('partialsLoaded'));
}

document.addEventListener('DOMContentLoaded', loadPartials);
