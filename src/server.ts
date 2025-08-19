import express from "express";
import { PrismaClient } from "./generated/prisma";

const port = 3000;
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get("/movies", async (_, res) => {
    const movies = await prisma.movie.findMany({
        orderBy: {
            title: "asc",
        },
        include: {
            genres: true,
            languages: true
        }
    });
    res.json(movies);
});

app.post("/movies", async (req, res) => {

    const { title, genre_id, language_id, oscar_count, release_date } = req.body;

    try {

        // verificar no banco se já existe um filme com o nome que está sendo enviado

        const movieWithSameTitle = await prisma.movie.findFirst({
            where: { title: {equals: title, mode: "insensitive"} },
        });

        if(movieWithSameTitle) {
            return res.status(409).send({ message: "Já existe um filme cadastrado com esse título" });
        }

        await prisma.movie.create({
            data: {
                title: title,
                genre_id: genre_id,
                language_id: language_id,
                oscar_count: oscar_count,
                // cuidado aqui, o mes começa em 0 e vai até 11
                release_date: new Date(release_date)
            }
        });
    }catch(error){
        return res.status(500).send({message: "Falha ao cadastrar umm filme"});
    }

    res.status(201).send();
});

app.listen(port, () => {
    console.log(`Servidor em execução em http://localhost:${port}`);
});