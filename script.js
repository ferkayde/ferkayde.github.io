// ================================================
// Random Theme Picker
// 49.5% dark / 49.5% light / 1% blue (Sharon's original)
// ================================================

(function pickTheme() {
  const roll = Math.random() * 100;
  let theme;
  if (roll < 47.5) {
    theme = 'dark';
  } else if (roll < 95) {
    theme = 'light';
  } else {
    theme = 'blue';
  }
  document.documentElement.setAttribute('data-theme', theme);
})();

// Helper: set the arrow-icon SVG on all links to match --text-color
function updateLinkArrows() {
  const style = getComputedStyle(document.documentElement);
  const textColor = style.getPropertyValue('--text-color').trim();
  // URL-encode the hex color for the SVG data URI
  const fill = encodeURIComponent(textColor);
  const svg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 172 172'%3E%3Cg fill='${fill}'%3E%3Cpath d='M96.75,26.875v10.75h29.89844l-66.01172,66.01172l7.72656,7.72656l66.01172,-66.01172v29.89844h10.75v-48.375zM26.875,48.375v96.75h96.75v-69.875l-10.75,10.75v48.375h-75.25v-75.25h48.375l10.75,-10.75z'/%3E%3C/g%3E%3C/svg%3E") right center no-repeat`;

  document.querySelectorAll('a:not(.no-icon)').forEach(a => {
    a.style.background = svg;
    a.style.backgroundSize = '14px';
  });
  document.querySelectorAll('h3 a').forEach(a => {
    a.style.backgroundSize = '16px';
  });
}

// ================================================
// 3D Fold Scroll — adapted from Sharon Zheng's App.js
// Uses native window scroll. Sets body height to
// content overflow + viewport, then translates
// all [data-fold-content] elements by scrollTop.
// ================================================

function calcValues() {
  const centerContent = document.getElementById('center-content');
  const centerFold = document.getElementById('center-fold');

  if (!centerContent || !centerFold) return;

  // Dynamically set footer padding so the page ends with
  // #last-section at the very top of the viewport
  const lastSection = document.querySelector('#center-content #last-section');
  const footer = document.querySelector('#center-content footer');
  if (lastSection && footer) {
    const foldHeight = centerFold.clientHeight;
    const lastSectionTop = lastSection.offsetTop;
    // We want: at max scroll, lastSection sits at the top of the fold.
    // So everything below lastSectionTop must fill exactly foldHeight.
    const contentBelowLastSection = centerContent.clientHeight - lastSectionTop;
    const neededPadding = Math.max(0, foldHeight - contentBelowLastSection + parseInt(getComputedStyle(footer).paddingBottom)) + 50;
    footer.style.paddingBottom = neededPadding + 'px';
  }

  const overflowHeight = centerContent.clientHeight - centerFold.clientHeight;
  document.body.style.height = overflowHeight + window.innerHeight + 'px';

  const foldsContent = Array.from(
    document.querySelectorAll('[data-fold-content="true"]')
  );

  const tick = () => {
    const scroll = -(
      document.documentElement.scrollTop || document.body.scrollTop
    );
    foldsContent.forEach(content => {
      content.style.transform = `translateY(${scroll}px)`;
    });
    requestAnimationFrame(tick);
  };

  tick();
}

window.addEventListener('resize', calcValues);
window.addEventListener('DOMContentLoaded', () => {
  updateLinkArrows();
  calcValues();
});
