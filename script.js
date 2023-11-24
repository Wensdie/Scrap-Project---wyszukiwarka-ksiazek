import puppeteer from "puppeteer"

async function Scrap(search){
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
    await page.goto("https://www.empik.com", { waitUntil: "domcontentloaded", });
    const searchBar = await page.waitForSelector("input[type = 'search']");
    await searchBar.click();
    await searchBar.type(search);
    await page.keyboard.press('Enter');
}   
Scrap("Cos");