import cors from "cors"
import express from "express"
import dotenv from "dotenv"
import { MongoClient, ObjectId } from "mongodb"
import Joi from "joi"
import bcrypt from "bcrypt"

const app = express()

//config
app.use(cors())
app.use(express.json())
dotenv.config()

//database
const mongoClient = new MongoClient(process.env.DATABASE_URL)
try {
    mongoClient.connect()
    console.log("MongoDB conectado!")
} catch (err) {
    console.log(err.message)
}
const db = mongoClient.db()

//Schemas
// const usuariosSchema = Joi.object({
//     nome: Joi.string.required()
// })

//Endpoints
app.post("/cadastro", async (req, res) => {
    const { nome, email, senha } = req.body

    const hash = bcrypt.hashSync(senha, 10)

    try {
        await db.collection("usuarios").insertOne({nome, email, senha: hash})
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

app.post("/login", async (req, res) => {
    const { email, senha} = req.body
   
    try {
        const usuario = await db.collection("usuarios").findOne({ email })
        if(!usuario) {
            return res.status(404).send("Usuário não cadastrado")
        }
        const senhaVerificada = bcrypt.compareSync(senha, usuario.senha)
        if(!senhaVerificada){
            return res.status(401).send("Senha incorreta")
        }

        res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err.message)
    }
})


// listen
const PORT = 5000
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))