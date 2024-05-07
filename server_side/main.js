import Server from "./modules/server.js";

try{
    const server = new Server();
    console.log("Server succesfully started.");
}
catch(error){
    console.log("Error occured when starting scraping server. Error message: ");
    console.error(error);
}