import express, { json } from "express";
import bodyParser from "body-parser";
import Scrap from "./scrap.js";
import connection from "./database.js";

class Server{
        lastSearch;
        lastRequestResult; 
    constructor(){
        const ex = express();

        this.setProperites(ex)
        this.getMethod(ex);
        this.postMethod(ex, connection);
    }

    setProperites(ex) {
        ex.listen(8081);

        ex.use(bodyParser.json());

        ex.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });

    }
    getMethod(ex) {
        ex.get('/:search', async (req, res, next) => {
            this.lastSearch = req.params.search;
            console.log(`Request: ${this.lastSearch}`);
            this.lastRequestResult = await Scrap(req.params.search);
            res.json(this.lastRequestResult);
        });
    }

    postMethod(ex, dataBase) {
        ex.post("/", async (req, res, next) => {
            dataBase.connect()
            .then(() => {
                console.log('Connected.');
            })
            .catch((err) => {
                console.error('Error connecting to database', err);
            });
            
            if(req.body.action == "save" && this.lastRequestResult != null && this.lastSearch != null){
                let shop;
                let querySearch = "INSERT INTO searches (phrase) VALUES ($1);";
                await dataBase.query(querySearch, [this.lastSearch]);
                let queryGetSearchID = "SELECT id_search FROM searches ORDER BY id_search DESC;";
                let searchID = (await dataBase.query(queryGetSearchID)).rows[0].id_search;
                let queryResults = "INSERT INTO results (id_search, shop_name, title, author, price, img, link) VALUES ($1, $2, $3, $4, $5, $6, $7);";
                for(let i = 0; i < this.lastRequestResult.length; i++){
                    if(i == 0)
                            shop = "Empik";
                        else if(i == 1)
                            shop = "Tania Książka";
                        else
                            shop = "Tantis";
                        
                    for(let j = 0; j <this.lastRequestResult[i].length; j++){
                        await dataBase.query(queryResults, [searchID, shop, this.lastRequestResult[i][j].title, this.lastRequestResult[i][j].author, this.lastRequestResult[i][j].price, this.lastRequestResult[i][j].img, this.lastRequestResult[i][j].link]);
                    }
                }
                res.send("Succesfully saved.");
                console.log("Succesfully saved.");
            }
            else if(req.body.action == "show"){
                let showSearches = "SELECT * FROM searches ORDER BY id_search DESC";
                let showResults = "SELECT * FROM results" 
                let results1 = await dataBase.query(showSearches);
                let results2 = await dataBase.query(showResults)
                let results = [results1, results2];
                res.json(results);
            }
            else{
                res.send("Unknown operation.")
            }
            dataBase.end();
        });
    } 
}

export default Server;