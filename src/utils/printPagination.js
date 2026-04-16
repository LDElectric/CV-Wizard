const FORCED_BREAK_CLASS = 'print-force-break-before';
const EXPERIENCE_ITEM_SELECTOR = '[data-print-exp-item="true"]';
const EXPERIENCE_HEADER_SELECTOR = '[data-print-exp-header="true"]';
const EXPERIENCE_BODY_SELECTOR = '[data-print-exp-body="true"]';

const PAGE_HEIGHT_MM = 297;
const PAGE_TOP_MARGIN_MM = 6;
const PAGE_BOTTOM_MARGIN_MM = 8;

function mmToPx(mm) {
  const probe = document.createElement('div');
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  probe.style.height = `${mm}mm`;
  document.body.appendChild(probe);
  const px = probe.getBoundingClientRect().height;
  probe.remove();
  return px;
}

function getNumericLineHeight(element) {
  if (!element) return 0;

  const style = window.getComputedStyle(element);
  const parsedLineHeight = Number.parseFloat(style.lineHeight);
  if (!Number.isNaN(parsedLineHeight)) {
    return parsedLineHeight;
  }

  const parsedFontSize = Number.parseFloat(style.fontSize);
  if (Number.isNaN(parsedFontSize)) {
    return 0;
  }

  return parsedFontSize * 1.42;
}

function getExperienceContentBody(itemElement) {
  const explicitBody = itemElement.querySelector(EXPERIENCE_BODY_SELECTOR);
  if (explicitBody) return explicitBody;

  const fallbackParagraph = itemElement.querySelector('p, ul, ol');
  return fallbackParagraph || null;
}

export function clearSmartPrintBreaks(root = document) {
  root.querySelectorAll(`.${FORCED_BREAK_CLASS}`).forEach((element) => {
    element.classList.remove(FORCED_BREAK_CLASS);
  });
}

export function applySmartPrintBreaks({ root = document, minimumDescriptionLines = 2 } = {}) {
  clearSmartPrintBreaks(root);

  const experienceItems = Array.from(root.querySelectorAll(EXPERIENCE_ITEM_SELECTOR));
  if (!experienceItems.length) return;

  const pageContentHeightPx = mmToPx(PAGE_HEIGHT_MM - PAGE_TOP_MARGIN_MM - PAGE_BOTTOM_MARGIN_MM);
  if (!pageContentHeightPx) return;

  const firstDocument = root.querySelector('.cv-document');
  if (!firstDocument) return;

  const documentTop = firstDocument.getBoundingClientRect().top + window.scrollY;
  let virtualOffset = 0;

  experienceItems.forEach((itemElement) => {
    const itemRect = itemElement.getBoundingClientRect();
    const itemTop = itemRect.top + window.scrollY - documentTop;

    const headerElement = itemElement.querySelector(EXPERIENCE_HEADER_SELECTOR);
    const bodyElement = getExperienceContentBody(itemElement);
    if (!bodyElement) return;

    const headerHeight = headerElement ? headerElement.getBoundingClientRect().height : 0;
    const bodyLineHeight = getNumericLineHeight(bodyElement);
    const minimumBodyHeight = bodyLineHeight * minimumDescriptionLines;

    const requiredHeight = Math.ceil(headerHeight + minimumBodyHeight + 6);
    const simulatedTop = itemTop + virtualOffset;
    const positionInPage = ((simulatedTop % pageContentHeightPx) + pageContentHeightPx) % pageContentHeightPx;
    const remainingSpace = pageContentHeightPx - positionInPage;

    if (remainingSpace < requiredHeight) {
      itemElement.classList.add(FORCED_BREAK_CLASS);
      virtualOffset += remainingSpace;
    }
  });
}