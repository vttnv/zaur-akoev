import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
const variant = readFileSync(resolve(root, 'index-dark-image-bg.html'), 'utf8');
const light = readFileSync(resolve(root, 'index-light.html'), 'utf8');

const requiredSnippets = [
  'Заур Акоев',
  'Врач-стоматолог ортопед',
  'assets/dark-abstract-background.jpeg',
  'position: fixed;',
  'Как проходит приём',
  'Несколько кадров с консультации',
  'practice-gallery',
  'practice-gallery-open',
  'Отзывы пациентов',
  'buildGallery();',
  'function buildGallery()',
  'block.classList.toggle("reviews-open")',
];

for (const snippet of requiredSnippets) {
  if (!html.includes(snippet)) {
    throw new Error(`Missing expected snippet: ${snippet}`);
  }
}

if (html !== variant) {
  throw new Error('Published index.html should match the first-background variant.');
}

for (const lightSnippet of [
  'Заур Акоев — Врач-стоматолог ортопед',
  'body { background: #E0DFDB;',
  'This page requires JavaScript to display.',
]) {
  if (!light.includes(lightSnippet)) {
    throw new Error(`Missing expected light-version snippet: ${lightSnippet}`);
  }
}

if (light.includes('dark-abstract-background.jpeg')) {
  throw new Error('Light version should not use the dark abstract background.');
}

for (const obsoleteWarmToken of ['#d8c6aa', '216, 198, 170']) {
  if (html.includes(obsoleteWarmToken)) {
    throw new Error(`Warm yellow highlight should be replaced: ${obsoleteWarmToken}`);
  }
}

for (const blueHighlightSnippet of [
  '--warm: #93c4ff;',
  '.svc-p {\n      color: var(--warm);',
  '.rev-stars {\n      display: flex;',
  'rgba(147, 196, 255, 0.14)',
]) {
  if (!html.includes(blueHighlightSnippet)) {
    throw new Error(`Missing blue highlight styling: ${blueHighlightSnippet}`);
  }
}

if (html.includes('dark-abstract-background-2.jpeg')) {
  throw new Error('Published page should use the first abstract background, not the second.');
}

const galleryIndex = html.indexOf('Как проходит приём');
const reviewsIndex = html.indexOf('Отзывы пациентов');

if (galleryIndex === -1 || reviewsIndex === -1 || galleryIndex > reviewsIndex) {
  throw new Error('The practice gallery should appear before the reviews block.');
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

if (!existsSync(resolve(root, 'assets', 'dark-abstract-background.jpeg'))) {
  throw new Error('Missing first abstract background asset.');
}
