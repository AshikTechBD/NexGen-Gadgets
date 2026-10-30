// Inspect Next.js server-rendered product data on Dazzle's phones pages.
// Usage: node scripts/inspect-dazzle.mjs [page]

export async function getDazzlePage(page, extra = "") {
    const response = await fetch(`https://dazzle.com.bd/categories/phones?page=${page}${extra}`);
    if (!response.ok) throw new Error(`Page ${page}: HTTP ${response.status}`);
    const html = await response.text();
    const chunks = html.matchAll(/self\.__next_f\.push\(\[1,("(?:\\.|[^"\\])*")\]\)/g);
    for (const match of chunks) {
        const text = JSON.parse(match[1]);
        if (!text.includes('"categorySlug":"phones"') || !text.includes('"products":')) continue;
        const tree = JSON.parse(text.slice(text.indexOf(":") + 1));
        const data = tree[3];
        if (data && data.categorySlug === "phones" && Array.isArray(data.products)) {
            return data;
        }
    }
    throw new Error(`Page ${page}: product data not found`);
}

if (process.argv[1]?.endsWith("inspect-dazzle.mjs")) {
    for (const page of [1, 2]) {
        const data = await getDazzlePage(page);
        console.log(JSON.stringify({
            page, total: data.totalCount, pages: data.totalPages,
            size: data.products.length,
            first: data.products[0] && {
                name: data.products[0].productName,
                price: data.products[0].discountedPrice,
                regular: data.products[0].regularPrice,
                tba: data.products[0].isTba,
                status: data.products[0].stockStatus,
                image: data.products[0].thumbnails?.mediaFileUrl
            }
        }));
    }
}
