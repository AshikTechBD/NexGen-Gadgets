// Read the publicly listed Apple brand pages and print compact catalog rows.
// Usage: node scripts/inspect-apple.mjs
const base = "https://www.applegadgetsbd.com/brands/apple";

function classify(name) {
    if (/^iphone\b/i.test(name)) return "smartphone";
    if (/^ipad\b/i.test(name)) return "tablet";
    if (/^macbook\b/i.test(name)) return "laptop";
    if (/^imac\b|^apple mac mini\b|^mac mini\b|^mac studio\b/i.test(name)) return "desktop";
    if (/^airpods\b|^apple airpods\b|^apple earpods\b|^earpods\b|^apple homepod\b/i.test(name)) return "audio";
    if (/^apple watch\b/i.test(name)) return "wearable";
    return "accessory";
}

function decodeTitle(text) {
    return text.replace(/&amp;/g, "&").replace(/&quot;/g, '"')
        .replace(/&#x27;|&#39;/g, "'");
}

async function getPage(page) {
    const response = await fetch(`${base}?page=${page}`);
    if (!response.ok) throw new Error(`Page ${page}: HTTP ${response.status}`);
    const html = await response.text();
    const cards = [...html.matchAll(/<article class="border rounded-3xl card-shadow[\s\S]*?<\/article>/g)];
    const items = cards.map(([card]) => {
        const slug = /href="\/product\/([^"]+)"/.exec(card)?.[1];
        const title = /<img alt="([^"]+)"/.exec(card)?.[1];
        const encodedImage = /\bsrc="\/_next\/image\?url=([^&"]+)/.exec(card)?.[1];
        const price = /text-base md:text-xl text-gray-900 leading-6 font-semibold">৳(?:\s|<!--.*?-->)*([\d,]+)/.exec(card)?.[1];
        if (!slug || !title || !encodedImage) {
            throw new Error(`Could not parse a product on page ${page}: ${card.slice(0, 180)}`);
        }
        const image = decodeURIComponent(encodedImage)
            .replace("https://adminapi.applegadgetsbd.com/storage/media/medium/", "");
        const name = decodeTitle(title);
        return [name, price ? Number(price.replaceAll(",", "")) : null, image, slug, classify(name)];
    });
    console.error(`Page ${page}: ${items.length} products`);
    return items;
}

const pages = await Promise.all(Array.from({ length: 8 }, (_, index) => getPage(index + 1)));
const products = pages.flat();
const unique = new Set(products.map((item) => item[3]));
if (unique.size !== products.length) throw new Error(`Duplicate product links: ${unique.size}/${products.length}`);
console.error(`Total: ${products.length} unique Apple products`);
for (const product of products) console.log(JSON.stringify(product) + ",");
