import puppeteer from "puppeteer"

async function Scrap(search) {
    if (search != null) {
        const Puppe = await puppeteer.launch({
            headless: false,
            deafultViewport: null,
        });
        let result = [];
        // result.push(EmpikSearch(search, Puppe));
        // result.push(TaniaKsiazkaSearch(search, Puppe));
        // result.push(TantisSearch(search, Puppe));
        result.push(SwiatKsiazkiSearch(search, Puppe));
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
    console.log(bookInfo);
    return bookInfo;
}

async function TantisSearch(search, Puppe) {
    const page = await Puppe.newPage();
    await page.goto("https://tantis.pl/ksiazki-c1450?query=" + search +"&sortBy=match&showPerPage=6", { waitUntil: "domcontentloaded", });
    const bookInfo = await page.evaluate(() => {
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
    console.log(bookInfo);
    return bookInfo;
}

async function SwiatKsiazkiSearch(search, Puppe) {
    const page = await Puppe.newPage();
    await page.goto("https://www.swiatksiazki.pl/search/" + search + "?customFilters=category_id:4", { waitUntil: "domcontentloaded", });
    const bookInfo = await page.evaluate(() => {
        const books = document.querySelectorAll("div[class='ProductCard-LinkInnerWrapper']");
        return Array.from(books).map((book) => {
            let title = book.querySelector("html.hiddenHeader.hideOnScroll body div#root div.LocalizationWrapper-pl_PL main.CategoryPage section div.ContentWrapper.CategoryPage-Wrapper div.CategoryPage-ProductListWrapper div.ProductList.CategoryProductList.CategoryProductList_layout_grid ul.ProductListPage.CategoryProductList-Page.CategoryProductList-Page_layout_grid li.ProductCard.ProductCard_layout_grid a.ProductCard-Link div.ProductCard-LinkInnerWrapper div.ProductCard-Content a.ProductCard-Link p.ProductCard-Name").innerText;
            let author = book.querySelector("html.hiddenHeader.hideOnScroll body div#root div.LocalizationWrapper-pl_PL main.CategoryPage section div.ContentWrapper.CategoryPage-Wrapper div.CategoryPage-ProductListWrapper div.ProductList.CategoryProductList.CategoryProductList_layout_grid ul.ProductListPage.CategoryProductList-Page.CategoryProductList-Page_layout_grid li.ProductCard.ProductCard_layout_grid a.ProductCard-Link div.ProductCard-LinkInnerWrapper div.ProductCard-Content div.ProductAuthors.ProductAuthors_isShort.ProductCard-ProductAuthors a.ProductCard-Author").innerText;
            let price = book.querySelector("html.hiddenHeader.hideOnScroll body div#root div.LocalizationWrapper-pl_PL main.CategoryPage section div.ContentWrapper.CategoryPage-Wrapper div.CategoryPage-ProductListWrapper div.ProductList.CategoryProductList.CategoryProductList_layout_grid ul.ProductListPage.CategoryProductList-Page.CategoryProductList-Page_layout_grid li.ProductCard.ProductCard_layout_grid a.ProductCard-Link div.ProductCard-LinkInnerWrapper div.ProductCard-Content div.ProductCard-PriceWrapper div.ProductPrice.ProductPrice_hasDiscount.ProductPrice_isPreview.ProductCard-Price ins.ProductPrice-Price span.ProductPrice-PriceValue").innerText;
            let img = book.querySelector("html.hiddenHeader body div#root div.LocalizationWrapper-pl_PL main.CategoryPage section div.ContentWrapper.CategoryPage-Wrapper div.CategoryPage-ProductListWrapper div.ProductList.CategoryProductList.CategoryProductList_layout_grid ul.ProductListPage.CategoryProductList-Page.CategoryProductList-Page_layout_grid li.ProductCard.ProductCard_layout_grid a.ProductCard-Link div.ProductCard-LinkInnerWrapper div.ProductCard-FigureReview figure.ProductCard-Figure div.Image.Image_ratio_custom.Image_imageStatus_image_loading.Image_hasSrc.ProductCard-Picture span.lazy-load-image-background.opacity.lazy-load-image-loaded img").getAttribute("src");
            let link = "https://www.swiatksiazki.pl" + book.querySelector("html.hiddenHeader body div#root div.LocalizationWrapper-pl_PL main.CategoryPage section div.ContentWrapper.CategoryPage-Wrapper div.CategoryPage-ProductListWrapper div.ProductList.CategoryProductList.CategoryProductList_layout_grid ul.ProductListPage.CategoryProductList-Page.CategoryProductList-Page_layout_grid li.ProductCard.ProductCard_layout_grid a.ProductCard-Link div.ProductCard-LinkInnerWrapper div.ProductCard-Content a.ProductCard-Link").getAttribute("href");
            return {title, author, price, img, link};
        });
    });
    console.log(bookInfo);
    return bookInfo;
}
Scrap("Coś");
