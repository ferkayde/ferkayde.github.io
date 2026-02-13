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
window.addEventListener('DOMContentLoaded', calcValues);
