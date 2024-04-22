import puppeteer from "puppeteer"
import express, { json } from "express";
import pg from 'pg';
import bodyParser from "body-parser";

const app = express();
app.listen(8081);
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/:search', async (req, res, next) => {
    console.log('Request: "' + req.params.search + '"');
    res.json(await Scrap(req.params.search));
});

app.post("/", async (req, res, next) => {
    const { Client } = pg;
    const conn = new Client({
        user: 'postgres',
        password: 'admin',
        host: 'localhost',
        port: '5432',
        database: 'scrap-project',
    });

    conn.connect()
    .then(() => {
        console.log('Connected.');
    })
    .catch((err) => {
        console.error('Error connecting to database', err);
    });
    
    if(req.body.action == "save" && lastRequestResult != null && lastSearch != null){
        let shop;
        let querySearch = "INSERT INTO searches (phrase) VALUES ($1);";
        await conn.query(querySearch, [lastSearch]);
        let queryGetSearchID = "SELECT id_search FROM searches ORDER BY id_search DESC;";
        let searchID = (await conn.query(queryGetSearchID)).rows[0].id_search;
        let queryResults = "INSERT INTO results (id_search, shop_name, title, author, price, img, link) VALUES ($1, $2, $3, $4, $5, $6, $7);";
        for(let i = 0; i < lastRequestResult.length; i++){
            if(i == 0)
                    shop = "Empik";
                else if(i == 1)
                    shop = "Tania Książka";
                else
                    shop = "Tantis";
                
            for(let j = 0; j <lastRequestResult[i].length; j++){
                await conn.query(queryResults, [searchID, shop, lastRequestResult[i][j].title, lastRequestResult[i][j].author, lastRequestResult[i][j].price, lastRequestResult[i][j].img, lastRequestResult[i][j].link]);
            }
        }
        res.send("Succesfully saved.");
        console.log("Succesfully saved.");
    }
    else if(req.body.action == "show"){
        let showSearches = "SELECT * FROM searches ORDER BY id_search DESC";
        let showResults = "SELECT * FROM results" 
        let results1 = await conn.query(showSearches);
        let results2 = await conn.query(showResults)
        let results = [results1, results2];
        res.json(results);
    }
    else{
        res.send("Nie znane działanie.")
    }
    conn.end();
});

let lastRequestResult;
let lastSearch

async function Scrap(search) {
    if (search != null) {
        const Puppe = await puppeteer.launch({
            headless: 'new',
            deafultViewport: null,
        });
        let result = [];
        result.push(await EmpikSearch(search, Puppe));
        result.push(await TaniaKsiazkaSearch(search, Puppe));
        result.push(await TantisSearch(search, Puppe));
        Puppe.close();
        lastRequestResult = result;
        lastSearch = search;
        return result;
    }
}

async function EmpikSearch(search, Puppe) {
    const page = await Puppe.newPage();
    let bookInfo = [];
    try{
        await page.goto("https://www.empik.com/ksiazki,31,s?q=" + search + "&qtype=basicForm&resultsPP=6", { waitUntil: "domcontentloaded", });
        bookInfo = await page.evaluate(() => {
            const books = document.querySelectorAll("div.search-list-item.js-reco-product.js-energyclass-product.ta-product-tile");
            return Array.from(books).map((book) => {
                let title = book.querySelector("a.seoTitle").innerText;
                let author = book.querySelector("a.smartAuthor").innerText;
                let price = book.querySelector("div[itemprop='price']").innerText;
                let img = book.querySelector("img.lazy").getAttribute("lazy-img");
                let link = "https://www.empik.com" + book.querySelector("a.seoTitle").getAttribute("href");
                return {title, author, price, img, link};
            });
        });
    }
    catch(err){
        console.log(err);
    }
    return bookInfo;
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
        console.log(err);
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
        console.log(err);
    }
    return bookInfo.slice(0,6);
}
