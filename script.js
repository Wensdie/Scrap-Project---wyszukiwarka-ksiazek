import puppeteer from "puppeteer"

async function Scrap(search) {
    if (search != null) {
        const Puppe = await puppeteer.launch({
            headless: false,
            deafultViewport: null,
        });
        let result = [];
        result.push(EmpikSearch(search, Puppe));
        result.push(TaniaKsiazkaSearch(search, Puppe));
    }
}

async function EmpikSearch(search, Puppe) {
    const page = await Puppe.newPage();
    await page.goto("https://www.empik.com/ksiazki,31,s?q=" + search + "&qtype=basicForm&resultsPP=6", { waitUntil: "domcontentloaded", });
    const bookInfo = await page.evaluate(() => {
        const books = document.querySelectorAll("div.search-list-item-hover");
        return Array.from(books).map((book) => {
            let title = book.querySelector("a.seoTitle").innerText;
            let author = book.querySelector("a.smartAuthor").innerText;
            let price = book.querySelector("div[itemprop='price']").innerText;
            let img = book.querySelector("img.lazy").getAttribute("lazy-img");
            let link = "https://www.empik.com" + book.querySelector("a.seoTitle").getAttribute("href");
            return {title, author, price, img, link};
        });
    });
    console.log(bookInfo);
    return bookInfo;
}

async function TaniaKsiazkaSearch(search, Puppe) {
    const page = await Puppe.newPage();
    await page.goto("https://www.taniaksiazka.pl/Szukaj/q-" + search +"?params[tg]=1&params[last]=tg#products-list-pos", { waitUntil: "domcontentloaded", });
    const bookInfo = await page.evaluate(() => {
        const books = document.querySelectorAll("div.product-container.gtmPromotionView");
        return Array.from(books).map((book) => {
            let title = book.querySelector("a.ecommerce-datalayer.product-title").innerText;
            //let author = book.querySelector("div.product-authors").innerText;
            // let price = book.querySelector("span.product-price ").innerText;
            // let img = "https:" + book.querySelector("img.lazyload-medium.lazyload").getAttribute("src");
            // let link = "https://www.taniaksiazka.pl" + book.querySelector("a.ecommerce-datalayer ").getAttribute("href");
            return {title};
        });
    });
    console.log(bookInfo);
    return bookInfo;
}
Scrap("Coś");