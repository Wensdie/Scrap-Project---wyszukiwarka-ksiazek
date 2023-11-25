import puppeteer from "puppeteer"

async function ScrapEmpik(search){
    if (search != null) {
        const Puppe = await puppeteer.launch({
            headless: false,
            deafultViewport: null,
        });
        const page = await Puppe.newPage();
        await page.goto("http://www.empik.com/szukaj/produkt?q="+ search +"&qtype=basicForm&ac=true", { waitUntil: "domcontentloaded", });
        const bookInfo = await page.evaluate(() => {
            const title = document.querySelector("a.seoTitle").innerText;
            return title;
        });
        console.log(bookInfo);
    }
} 
ScrapEmpik("Cos");