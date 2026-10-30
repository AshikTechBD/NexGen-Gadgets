// Snapshot every public Dazzle phone listing by brand and keep its listed BDT price.
// Usage: node scripts/sync-dazzle.mjs
import { writeFile } from "node:fs/promises";
import { getDazzlePage } from "./inspect-dazzle.mjs";

const endpoint = "https://dazzle.com.bd/api/proxy/products";
const first = await getDazzlePage(1);
const brands = first.brands.filter((brand) => brand.brand_slug);

async function fetchProducts(brand, page) {
    const query = new URLSearchParams({
        page: String(page), limit: "100", categorySlug: "phones", brandSlug: brand
    });
    for (let attempt = 1; attempt <= 4; attempt++) {
        try {
            const response = await fetch(`${endpoint}?${query}`, {
                signal: AbortSignal.timeout(30000)
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const result = await response.json();
            if (!Array.isArray(result.data)) throw new Error("Missing product array");
            return result;
        } catch (error) {
            if (attempt === 4) throw new Error(`${brand} page ${page}: ${error.message}`);
            await new Promise((resolve) => setTimeout(resolve, attempt * 1200));
        }
    }
}

const gathered = [];
let reportedTotal = 0;
// Brand-filtered requests avoid the deep-pagination timeout on the category route.
for (const brand of brands) {
    const slug = brand.brand_slug;
    const firstPage = await fetchProducts(slug, 1);
    reportedTotal += firstPage.totalCount;
    const products = [...firstPage.data];
    for (let page = 2; page <= firstPage.totalPages; page++) {
        const next = await fetchProducts(slug, page);
        products.push(...next.data);
    }
    if (products.length !== firstPage.totalCount) {
        throw new Error(`${slug}: expected ${firstPage.totalCount}, received ${products.length}`);
    }
    for (const product of products) gathered.push({ product, brand: slug });
    console.log(`${slug}: ${products.length}`);
}

const unique = new Set(gathered.map(({ product }) => product.productUuid));
if (gathered.length !== first.totalCount || reportedTotal !== first.totalCount || unique.size !== first.totalCount) {
    throw new Error(`Incomplete catalog: ${gathered.length} records, ${unique.size} unique, expected ${first.totalCount}`);
}

const rows = gathered.map(({ product, brand }) => {
    const { productName, discountedPrice, regularPrice, thumbnails, stockStatus,
        endOfLife, isTba, allowPreOrder } = product;
    const currentPrice = Number.isFinite(discountedPrice) && discountedPrice > 0
        ? discountedPrice : Number.isFinite(regularPrice) && regularPrice > 0 ? regularPrice : null;
    const price = isTba ? null : currentPrice;
    const status = endOfLife ? "discontinued" : isTba ? "tba" :
        stockStatus === "Out of Stock" ? "out" : allowPreOrder ? "preorder" : "in";
    return [productName, price, thumbnails?.mediaFileUrl || null, brand, status];
});

const missingPhotos = rows.filter((row) => !row[2]).length;
const tbaPrices = rows.filter((row) => row[1] === null).length;
const contents = `/* Dazzle phones category snapshot, 30 October 2026.
   Source: https://dazzle.com.bd/categories/phones
   Rows: name, displayed BDT price (null = TBA), photo, brand, availability. */\n` +
    `var dazzlePhoneRows = [\n${rows.map((row) => `    ${JSON.stringify(row)}`).join(",\n")}\n];\n` +
    `if (typeof module !== "undefined") module.exports = dazzlePhoneRows;\n`;

await writeFile(new URL("../dazzle-data.js", import.meta.url), contents, "utf8");
console.log(`Saved ${rows.length} phones; ${tbaPrices} TBA prices; ${missingPhotos} missing photos.`);
