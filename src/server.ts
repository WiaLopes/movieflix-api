import express from "express";
const port = 3000;
const app = express();

//GET, POST, PUT, PATCH. DELETE

app.get("/movies", (req, res) => {
    res.send("Listagem de filmes");
});

app.listen(port, () => {
    console.log(`Servidor em execução em http://localhost:${port}`);
});