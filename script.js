window.onload = () => {
    const button = document.getElementById("searchButton");
    let table = document.getElementById("dataTable");
    let shop;
    let tableInnerHtmlVariable = "";
    let result;

    button.addEventListener("click", async () => {
        let search = document.getElementById("searchBar").value;
        document.getElementById("searchButton").disabled = true;
        axios.get("http://localhost:8081/" + search).
        then((res) => {
            result = res.data;
            console.log(result);
            tableInnerHtmlVariable += "<br><table>"+
            "<tr>"+
                "<th>Sklep</th>"+
                "<th>Tytuł</th>"+
                "<th>Autor</th>"+
                "<th>Cena</th>"+
                "<th>Zdjęcie</th>"+
                "<th>Link</th>"+
           " </tr>";
            for(let i = 0; i < result.length; i++){
                for(let j = 0; j <result[i].length; j++){
                    if(i == 0)
                        shop = "Empik";
                    else if(i == 1)
                        shop = "Tania Książka";
                    else
                        shop = "Tantis";

                    tableInnerHtmlVariable += "<tr>";
                    tableInnerHtmlVariable += "<td>";
                    tableInnerHtmlVariable += shop;
                    tableInnerHtmlVariable += "</td>";
                    tableInnerHtmlVariable += "<td>";
                    tableInnerHtmlVariable += result[i][j].title;
                    tableInnerHtmlVariable += "</td>";
                    tableInnerHtmlVariable += "<td>";
                    tableInnerHtmlVariable += result[i][j].author;
                    tableInnerHtmlVariable += "</td>";
                    tableInnerHtmlVariable += "<td>";
                    tableInnerHtmlVariable += result[i][j].price;
                    tableInnerHtmlVariable += "</td>";
                    tableInnerHtmlVariable += "<td>";
                    tableInnerHtmlVariable += "<img src='" + result[i][j].img + "'>";
                    tableInnerHtmlVariable += "</td>";
                    tableInnerHtmlVariable += "<td>";
                    tableInnerHtmlVariable += "<a href='" + result[i][j].link + "' target='_blank'>Link</a>";
                    tableInnerHtmlVariable += "</td>";
                    tableInnerHtmlVariable += "</tr>";
                }
            }
            tableInnerHtmlVariable += "</table>";
            table.innerHTML = "";
            table.innerHTML = tableInnerHtmlVariable;
            tableInnerHtmlVariable = "";
        })
        .catch((error) => {
            console.log(error);
        });
        document.getElementById("searchButton").disabled = false;
    });

    buttonSave = document.getElementById("saveRequest");
    buttonShowSaved = document.getElementById("showSavedRequests");

    buttonSave.addEventListener("click", () =>{
            axios.post("http://localhost:8081/", { 
                action : 'save'
            }).then((res) => {
                window.alert(res.data);
            });
    });

    buttonShowSaved.addEventListener("click", () =>{
        axios.post("http://localhost:8081/", { 
            action : 'show'
        }).then((res) => {
            table.innerHTML = "";
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