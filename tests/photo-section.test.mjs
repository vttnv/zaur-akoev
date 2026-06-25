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
  "block.addEventListener('click'",
  "if (!block.classList.contains('reviews-open'))",
  'event.stopPropagation();',
];

for (const snippet of requiredSnippets) {
  if (!html.includes(snippet)) {
    throw new Error(`Missing expected snippet: ${snippet}`);
  }
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
