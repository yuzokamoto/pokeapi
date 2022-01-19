import express, { Request, Response } from 'express'
import axios from 'axios'
import dotenv from 'dotenv'
import { connection } from './connection'

dotenv.config()

const app = express()
app.use(express.json())

app.get("/ping", (req: Request, res: Response) => {
    res.send("Pong! 🏓")
})

app.get("/", async (req: Request, res: Response) => {
    try {
        const randomGen1Number = Math.floor(Math.random() * (151)) + 1
        const [ pokemon ] = await connection("pokeapi").select().where({ id: randomGen1Number })
        if (!pokemon) {
            res.statusCode = 404
            throw new Error("Pokemon not found")
        }
        res.send({ pokemon })
    } catch (error) {
        if (error instanceof Error) {
            res.send({ message: error.message })
        } else {
            res.status(500).send({ message: "Unexpected error"})
        }
    }
})

interface Pokemon {
    data: {
        id: number,
        name: string,
        sprites: {
            front_default: string
        }
    }
}

app.get("/populate", async (req: Request, res: Response) => {
    try {
        const [checker] = await connection("pokeapi").select()
        if (checker) {
            res.statusCode = 400
            throw new Error("Table already populated")
        }

        const endpoints = []

        for (let i = 1; i <= 151; i++) {
            endpoints.push(`https://pokeapi.co/api/v2/pokemon/${i}`)
        }

        const pokemons: Pokemon[] = await Promise.all(endpoints.map(endpoint => axios.get(endpoint))).then(
            response => response
        )

        for (let i = 0; i <= pokemons.length - 1; i++) {
            await connection("pokeapi").insert({
                id: pokemons[i].data.id,
                name: pokemons[i].data.name,
                image: pokemons[i].data.sprites.front_default
            })
        }

        res.send({ message: "ok" })
    } catch (error) {
        if (error instanceof Error) {
            res.send({ message: error.message })
        } else {
            res.status(500).send({ message: "Unexpected error"})
        }
    }
})

app.listen(process.env.PORT || 3003, () => console.log("Server is running at port", process.env.PORT || 3003))