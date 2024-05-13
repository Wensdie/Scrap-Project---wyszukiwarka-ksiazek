import express, { json } from "express";
import bodyParser from "body-parser";
import Scrap from "./scrap.js";
import connection from "./database.js";

class Server{
        lastSearch;
        lastRequestResult; 
    constructor(){
        const ex = express();

        connection.connect()
        .then(() => {
            console.log('Connected.');
        })
        .catch((err) => {
            console.error('Error connecting to database', err);
        });

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
            if(req.body.action == "save" && this.lastRequestResult && this.lastSearch){
                const querySearch = "INSERT INTO searches (phrase) VALUES ($1);";
                await dataBase.query(querySearch, [this.lastSearch]);
                const queryGetSearchID = "SELECT id_search FROM searches ORDER BY id_search DESC;";
                const searchID = (await dataBase.query(queryGetSearchID)).rows[0].id_search;
                const queryResults = "INSERT INTO results (id_search, shop_name, title, author, price, img, link) VALUES ($1, $2, $3, $4, $5, $6, $7);";
                const resultMap = new Map(Object.entries(this.lastRequestResult));
                for(const [shop, books] of resultMap){
                    for(const book of books){
                        const {title, author, price, img, link} = book;
                        await dataBase.query(queryResults, [searchID, shop, title, author, price, img, link]);
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
            
        });
    } 
}

export default Server;