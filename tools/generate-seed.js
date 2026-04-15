const fs = require('fs');
const path = require('path');

// ШЛЯХИ
const SOURCE_JSON = 'C:/Users/Shadyua/Documents/site/catalog.json';
const SOURCE_IMAGES = 'C:/Users/Shadyua/Documents/site/images';

const TARGET_SEED = 'C:/Users/Shadyua/Documents/growco/growco/backend/src/data/products.seed-data.ts';
const TARGET_IMAGES = 'C:/Users/Shadyua/Documents/growco/growco/backend/uploads/products/all';
const MISSING_IMAGES_FILE = 'C:/Users/Shadyua/Documents/growco/growco/missing-images.json';

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function safeNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function esc(value) {
  return String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'");
}

function findProductsArray(obj) {
  if (Array.isArray(obj)) {
    if (
      obj.length > 0 &&
      typeof obj[0] === 'object' &&
      obj[0] !== null &&
      ('name' in obj[0] ||
        'title' in obj[0] ||
        'price' in obj[0] ||
        'image' in obj[0] ||
        'imgUrl' in obj[0])
    ) {
      return obj;
    }

    for (const item of obj) {
      if (item && typeof item === 'object') {
        const found = findProductsArray(item);
        if (found) return found;
      }
    }

    return null;
  }

  if (obj && typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      const found = findProductsArray(obj[key]);
      if (found) return found;
    }
  }

  return null;
}

function normalizeImageName(item) {
  let imageName =
    item.image ||
    item.img ||
    item.imgUrl ||
    item.imageUrl ||
    item.photo ||
    '';

  if (!imageName) return '';

  imageName = String(imageName).trim();
  imageName = imageName.replace(/^\/+/, '');
  imageName = imageName.replace(/^images\//i, '');

  return imageName;
}

function normalizeCategoryIds(item) {
  if (Array.isArray(item.categoryIds) && item.categoryIds.length) {
    return item.categoryIds.map(x => Number(x)).filter(Number.isFinite);
  }

  if (item.categoryId != null && item.categoryId !== '') {
    const n = Number(item.categoryId);
    if (Number.isFinite(n)) return [n];
  }

  return [1];
}

function main() {
  ensureDir(TARGET_IMAGES);

  const raw = fs.readFileSync(SOURCE_JSON, 'utf8');
  const parsed = JSON.parse(raw);

  const data = findProductsArray(parsed);

  if (!data) {
    console.log('Не вдалося знайти масив товарів у catalog.json');
    console.log('Верхні ключі:', Object.keys(parsed));
    process.exit(1);
  }

  console.log(`Знайдено товарів у JSON: ${data.length}`);

  const missingImages = [];

  const products = data.map((item, index) => {
    const imageName = normalizeImageName(item);

    if (imageName) {
      const src = path.join(SOURCE_IMAGES, imageName);
      const dst = path.join(TARGET_IMAGES, imageName);

      ensureDir(path.dirname(dst));

      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dst);
      } else {
        console.log(`❌ Нема картинки: ${imageName} | ${item.name || item.title || 'Без назви'}`);
        missingImages.push({
          productId: 1001 + index,
          name: item.name || item.title || `Product ${1001 + index}`,
          image: imageName,
        });
      }
    } else {
      missingImages.push({
        productId: 1001 + index,
        name: item.name || item.title || `Product ${1001 + index}`,
        image: '',
      });
    }

    return {
      productId: 1001 + index,
      name: item.name || item.title || `Product ${1001 + index}`,
      description: item.description || item.desc || 'Опис відсутній',
      price: safeNumber(item.price, 0),
      qtyInStock: safeNumber(item.qtyInStock ?? item.stock ?? item.quantity, 10),
      imgUrl: imageName ? `products/all/${imageName}` : 'products/all/no-image.png',
      categoryIds: normalizeCategoryIds(item),
      isPromo: Boolean(item.isPromo),
      unit: item.unit || 'шт',
      originCountry: item.originCountry || 'Україна',
      netContent: safeNumber(item.netContent, 1),
      brand: item.brand || 'Без бренду',
      oldPrice: item.oldPrice != null && item.oldPrice !== '' ? safeNumber(item.oldPrice) : null,
    };
  });

  let output = 'export const PRODUCTS_DATA = [\n';

  for (const p of products) {
    output += `  {\n`;
    output += `    productId: ${p.productId},\n`;
    output += `    name: '${esc(p.name)}',\n`;
    output += `    description: '${esc(p.description)}',\n`;
    output += `    price: ${p.price},\n`;
    output += `    qtyInStock: ${p.qtyInStock},\n`;
    output += `    imgUrl: '${esc(p.imgUrl)}',\n`;
    output += `    categoryIds: [${p.categoryIds.join(', ')}],\n`;
    output += `    isPromo: ${p.isPromo},\n`;
    output += `    unit: '${esc(p.unit)}',\n`;
    output += `    originCountry: '${esc(p.originCountry)}',\n`;
    output += `    netContent: ${p.netContent},\n`;
    output += `    brand: '${esc(p.brand)}',\n`;
    output += `    oldPrice: ${p.oldPrice === null ? 'null' : p.oldPrice},\n`;
    output += `  },\n`;
  }

  output += '];\n';

  fs.writeFileSync(TARGET_SEED, output, 'utf8');
  fs.writeFileSync(MISSING_IMAGES_FILE, JSON.stringify(missingImages, null, 2), 'utf8');

  console.log(`✅ Готово! Створено товарів: ${products.length}`);
  console.log(`⚠ Відсутніх картинок: ${missingImages.length}`);
  console.log(`📄 Список збережено у: ${MISSING_IMAGES_FILE}`);
}

main();