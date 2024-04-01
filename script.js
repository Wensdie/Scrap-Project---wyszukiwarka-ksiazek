import puppeteer from "puppeteer"

async function Scrap(search) {
    if (search != null) {
        const Puppe = await puppeteer.launch({
            headless: false,
            deafultViewport: null,
        });
        const page = await Puppe.newPage();
        let result = [];
        result.push(EmpikSearch(search, page));
    }
}

async function EmpikSearch(search, page) {
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

Scrap("Coś");