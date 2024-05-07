import puppeteer from "puppeteer";

async function Scrap(search) {
    if (search != null) {
        const Puppe = await puppeteer.launch({
            headless: 'false',
            deafultViewport: null,
        });
        let result = [];
        result.push(await EmpikSearch(search, Puppe));
        result.push(await TaniaKsiazkaSearch(search, Puppe));
        result.push(await TantisSearch(search, Puppe));
        Puppe.close();
        return result;
    }
}

async function EmpikSearch(search, Puppe) {
    const page = await Puppe.newPage();
    let bookInfo = [];
    try{
        await page.goto("https://www.empik.com/ksiazki,31,s?q=" + search + "&qtype=basicForm", { waitUntil: "domcontentloaded", });
        bookInfo = await page.evaluate(() => {
            const books = document.querySelectorAll("div.search-list-item.js-reco-product.js-energyclass-product.ta-product-tile");
            return Array.from(books).map((book) => {
                let title = book.querySelector("a.seoTitle").innerText;
                let author = book.querySelector("div.smartAuthorWrapper.ta-product-smartauthor").innerText;
                let price = book.querySelector('div.price.ta-price-tile').innerText;
                let img = book.querySelector("img.lazy").getAttribute("lazy-img");
                let link = "https://www.empik.com" + book.querySelector("a.seoTitle").getAttribute("href");
                return {title, author, price, img, link};
            });
        });
    }
    catch(err){
        console.log(err);
        //console.log("Empik - no book found.");
    }
    return bookInfo.slice(0,6);
}

async function TaniaKsiazkaSearch(search, Puppe) {
    const page = await Puppe.newPage();
    let bookInfo = [];
    try{
        await page.goto("https://www.taniaksiazka.pl/Szukaj/q-" + search +"?params[tg]=1&params[last]=tg#products-list-pos", { waitUntil: "domcontentloaded", });
        bookInfo = await page.evaluate(() => {
            const books = document.querySelectorAll("html body div.container.with-below-header section#content.main.new-listing.page-szukaj div.row div.col-xs-10 article ul.toggle-view.grid li div.product-container.gtmPromotionView");
            return Array.from(books).map((book) => {
                let title = book.querySelector("a.ecommerce-datalayer.product-title").innerText;
                let author = book.querySelector("html body div.container.with-below-header section#content.main.new-listing.page-szukaj div.row div.col-xs-10 article ul.toggle-view.grid li div.product-container.gtmPromotionView div.product-main div.product-main-top div.product-main-top-info div.product-main-hidden div div.product-authors").innerText;
                let price = book.querySelector("span[class='product-price '").innerText;
                let img = "https:" + book.querySelector("html body div.container.with-below-header section#content.main.new-listing.page-szukaj div.row div.col-xs-10 article ul.toggle-view.grid li div.product-container.gtmPromotionView div.product-image a.ecommerce-datalayer img.lazyload-medium.lazyload").getAttribute("data-src");
                let link = "https://www.taniaksiazka.pl" + book.querySelector("a.ecommerce-datalayer ").getAttribute("href");
                return {title, author, price, img, link};
        });
    });
    }
    catch(err){
        console.log("TaniaKsiazka - no book found.");
    }
    return bookInfo.slice(0,6);
}

async function TantisSearch(search, Puppe) {
    const page = await Puppe.newPage();
    let bookInfo = [];
    try{
        await page.goto("https://tantis.pl/ksiazki-c1450?query=" + search +"&sortBy=match", { waitUntil: "domcontentloaded", });
        bookInfo = await page.evaluate(() => {
            const books = document.querySelectorAll("html.webp-supported body.base-layout.desktop.cookie-modal-opened.result-list div#shopContent div#site-content.container-fluid div.row main.col-10 div.row div.product-list div#productGridRow.row div.col-10 div.product-list-grid.row div.product-box div.card.product-card.no-hover-card.with-ratings");
            return Array.from(books).map((book) => {
                let title = book.querySelector("html.webp-supported body.base-layout.desktop.cookie-modal-opened.result-list div#shopContent div#site-content.container-fluid div.row main.col-10 div.row div.product-list div#productGridRow.row div.col-10 div.product-list-grid.row div.product-box div.card.product-card.no-hover-card.with-ratings div.card-body div.details-part h3.card-title.product-name").innerText;
                let author = book.querySelector("html.webp-supported body.base-layout.desktop.cookie-modal-opened.result-list div#shopContent div#site-content.container-fluid div.row main.col-10 div.row div.product-list div#productGridRow.row div.col-10 div.product-list-grid.row div.product-box div.card.product-card.no-hover-card.with-ratings div.card-body div.details-part div.authors-cover-part div.authors-list p.card-text.author").innerText;
                let price = book.querySelector("html.webp-supported body.base-layout.desktop.cookie-modal-opened.result-list div#shopContent div#site-content.container-fluid div.row main.col-10 div.row div.product-list div#productGridRow.row div.col-10 div.product-list-grid.row div.product-box div.card.product-card.no-hover-card.with-ratings div.card-body div.details-part div.product-price-container span.product-price").innerText;
                let img = book.querySelector("html.webp-supported body.base-layout.desktop.cookie-modal-opened.result-list div#shopContent div#site-content.container-fluid div.row main.col-10 div.row div.product-list div#productGridRow.row div.col-10 div.product-list-grid.row div.product-box div.card.product-card.no-hover-card.with-ratings div.card-body div.img-part div.product-img-container.product-card-img-container a img.product-img").getAttribute("src");
                let link = book.querySelector("html.webp-supported body.base-layout.desktop.cookie-modal-opened.result-list div#shopContent div#site-content.container-fluid div.row main.col-10 div.row div.product-list div#productGridRow.row div.col-10 div.product-list-grid.row div.product-box div.card.product-card.no-hover-card.with-ratings div.card-body div.img-part div.product-img-container.product-card-img-container a").getAttribute("href");
                return {title, author, price, img, link};
        });
    });
    }
    catch(err){
        console.log("Tantis - no book found.");
    }
    return bookInfo.slice(0,6);
}

export default Scrap;