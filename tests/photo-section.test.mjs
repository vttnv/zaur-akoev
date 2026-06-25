import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const html = readFileSync(resolve(root, 'index.html'), 'utf8');

const requiredSnippets = [
  'injectPracticeGallery();',
  'function injectPracticeGallery()',
  'Как проходит приём',
  'Несколько кадров с консультации',
  'practice-gallery',
  'practice-gallery-open',
  'Отзывы пациентов',
  "block.addEventListener('click', toggleReviews);",
  "btn.setAttribute('aria-label', open ? 'Свернуть отзывы' : 'Показать отзывы');",
  'event.stopPropagation();',
];

for (const snippet of requiredSnippets) {
  if (!html.includes(snippet)) {
    throw new Error(`Missing expected snippet: ${snippet}`);
  }
}

function getInjectedStyleBlock(selector) {
  const start = html.indexOf(`'${selector} {',`);
  if (start === -1) return '';

  const end = html.indexOf("      '}',", start);
  if (end === -1) return '';

  return html.slice(start, end + "      '}',".length);
}

const closedReviewToggleStyle = getInjectedStyleBlock(
  '.reviews-block:not(.reviews-open) .reviews-toggle'
);

if (!closedReviewToggleStyle) {
  throw new Error('Missing collapsed review toggle style block.');
}

for (const snippet of [
  "'  border: 1px solid var(--border);'",
  "'  background: transparent;'",
  "'  color: var(--ink-soft);'",
  "'  display: flex;'",
  "'  align-items: center;'",
  "'  justify-content: center;'",
]) {
  if (!closedReviewToggleStyle.includes(snippet)) {
    throw new Error(`Collapsed review toggle should match accordion plus styling: ${snippet}`);
  }
}

const closedReviewToggleIconStyle = getInjectedStyleBlock(
  '.reviews-block:not(.reviews-open) .reviews-toggle::before'
);

if (!closedReviewToggleIconStyle) {
  throw new Error('Missing collapsed review toggle icon style block.');
}

if (!closedReviewToggleIconStyle.includes("'  font: 300 18px/18px var(--sans, Inter, sans-serif);'")) {
  throw new Error('Collapsed review plus should use the same visual line height as accordion icons.');
}

const openReviewBlockStyle = getInjectedStyleBlock('.reviews-block.reviews-open');

if (!openReviewBlockStyle) {
  throw new Error('Missing expanded review block layout style.');
}

for (const snippet of [
  "'  display: grid;'",
  "'  grid-template-columns: minmax(0, 1fr) 44px;'",
]) {
  if (!openReviewBlockStyle.includes(snippet)) {
    throw new Error(`Expanded review block should keep the toggle in the header: ${snippet}`);
  }
}

const openReviewToggleIconStyle = getInjectedStyleBlock(
  '.reviews-block.reviews-open .reviews-toggle::before'
);

if (!openReviewToggleIconStyle) {
  throw new Error('Missing expanded review toggle icon style block.');
}

if (!openReviewToggleIconStyle.includes("'  content: \"×\";'")) {
  throw new Error('Expanded review toggle should become a close icon.');
}

const galleryIndex = html.indexOf('Как проходит приём');
const reviewsIndex = html.indexOf('Отзывы пациентов');

if (galleryIndex === -1 || reviewsIndex === -1 || galleryIndex > reviewsIndex) {
  throw new Error('The practice gallery should be defined before the reviews block content.');
}

const images = [
  'alx-0753.jpg',
  'alx-0887.jpg',
  'alx-0382.jpg',
  'alx-0853.jpg',
  'alx-0203.jpg',
  'alx-0711.jpg',
  'alx-1363.jpg',
  'alx-0408.jpg',
  'alx-0456.jpg',
];

for (const image of images) {
  if (!existsSync(resolve(root, 'assets', 'practice-gallery', image))) {
    throw new Error(`Missing gallery image asset: ${image}`);
  }
}
