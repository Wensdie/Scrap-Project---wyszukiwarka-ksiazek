window.onload = () => {
    
    const table = document.getElementById("dataTable");
    const serverURL = "http://localhost:8081/";

    const button = document.getElementById("searchButton");
    button.addEventListener("click", async () => {
        const search = document.getElementById("searchBar").value;
        document.getElementById("searchButton").disabled = true;
        axios.get(serverURL + search).
        then((res) => {
            const result = res.data;
            console.log(result);
            table.innerHTML = "";
            table.innerHTML = tableGenrator(result);
        })
        .catch((error) => {
            console.log(error);
        });
        document.getElementById("searchButton").disabled = false;
    });

    const buttonSave = document.getElementById("saveRequest");
    buttonSave.addEventListener("click", () =>{
            axios.post(serverURL, { 
                action : 'save'
            }).then((res) => {
                window.alert(res.data);
            });
    });

    const buttonShowSaved = document.getElementById("showSavedRequests");
    buttonShowSaved.addEventListener("click", () =>{
        axios.post(serverURL, { 
            action : 'show'
        }).then((res) => {
            table.innerHTML = "";
            let tableInnerHtmlVariable = "";
            for(let i = 0; i < res.data[0].rowCount; i++){
                let oneSearchResults = res.data[1].rows.filter((row) => {
                    return row.id_search == res.data[0].rows[i].id_search;
                });
                tableInnerHtmlVariable += "<h1>" + res.data[0].rows[i].phrase +" - " + res.data[0].rows[i].date + "  </h1>";
                tableInnerHtmlVariable += "<table>"+
                "<tr>"+
                    "<th>Sklep</th>"+
                    "<th>Tytuł</th>"+
                    "<th>Autor</th>"+
                    "<th>Cena</th>"+
                    "<th>Zdjęcie</th>"+
                    "<th>Link</th>"+
               " </tr>";

                for(let i = 0; i < oneSearchResults.length; i++){
                    tableInnerHtmlVariable += "<tr>";
                    tableInnerHtmlVariable += "<td>";
                    tableInnerHtmlVariable += oneSearchResults[i].shop_name;
                    tableInnerHtmlVariable += "</td>";
                    tableInnerHtmlVariable += "<td>";
                    tableInnerHtmlVariable += oneSearchResults[i].title;
                    tableInnerHtmlVariable += "</td>";
                    tableInnerHtmlVariable += "<td>";
                    tableInnerHtmlVariable += oneSearchResults[i].author;
                    tableInnerHtmlVariable += "</td>";
                    tableInnerHtmlVariable += "<td>";
                    tableInnerHtmlVariable += oneSearchResults[i].price;
                    tableInnerHtmlVariable += "</td>";
                    tableInnerHtmlVariable += "<td>";
                    tableInnerHtmlVariable += "<img src='" + oneSearchResults[i].img + "'>";
                    tableInnerHtmlVariable += "</td>";
                    tableInnerHtmlVariable += "<td>";
                    tableInnerHtmlVariable += "<a href='" + oneSearchResults[i].link + "' target='_blank'>Link</a>";
                    tableInnerHtmlVariable += "</td>";
                    tableInnerHtmlVariable += "</tr>";
                }
                tableInnerHtmlVariable += "</table>";
            }
            table.innerHTML = "";
            table.innerHTML = tableInnerHtmlVariable;
            tableInnerHtmlVariable = "";
        });
    });
};

function tableGenrator(result){
    let tableInnerHtmlVariable = "";
    tableInnerHtmlVariable += "<br><table>"+
        "<tr>"+
        "<th>Sklep</th>"+
        "<th>Tytuł</th>"+
        "<th>Autor</th>"+
        "<th>Cena</th>"+
        "<th>Zdjęcie</th>"+
        "<th>Link</th>"+
        "</tr>";
    const resultMap = new Map(Object.entries(result));
    for(const [shop, books] of resultMap){
        for(const book of books){
            const {title, author, price, img, link} = book;
            tableInnerHtmlVariable += "<tr>";
            tableInnerHtmlVariable += "<td>";
            tableInnerHtmlVariable += shop;
            tableInnerHtmlVariable += "</td>";
            tableInnerHtmlVariable += "<td>";
            tableInnerHtmlVariable += title;
            tableInnerHtmlVariable += "</td>";
            tableInnerHtmlVariable += "<td>";
            tableInnerHtmlVariable += author;
            tableInnerHtmlVariable += "</td>";
            tableInnerHtmlVariable += "<td>";
            tableInnerHtmlVariable += price;
            tableInnerHtmlVariable += "</td>";
            tableInnerHtmlVariable += "<td>";
            tableInnerHtmlVariable += `<img src="${img}">`;
            tableInnerHtmlVariable += "</td>";
            tableInnerHtmlVariable += "<td>";
            tableInnerHtmlVariable += `<a href="${link}" target="_blank">Link</a>`;
            tableInnerHtmlVariable += "</td>";
            tableInnerHtmlVariable += "</tr>";
        }
    }
    tableInnerHtmlVariable += "</table>";
    
    return tableInnerHtmlVariable;
}