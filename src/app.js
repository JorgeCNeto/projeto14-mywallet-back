import cors from "cors"
import express from "express"
import dotenv from "dotenv"
import { MongoClient } from "mongodb"
import Joi from "joi"
import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid"
import dayjs from "dayjs"

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
const usuariosSchema = Joi.object({
    nome: Joi.string().required(),

})

//Endpoints
app.post("/cadastro", async (req, res) => {
    const { nome, email, senha } = req.body
    const cadastroSchema = Joi.object({
        nome: Joi.string().required(),
        email: Joi.string().email().required(),
        senha: Joi.string().min(3).required()
    })

    const validation = cadastroSchema.validate(req.body, {abortEarly: false})
    if (validation.error) {
        return res.status(422).send(validation.error.details.map(detail => detail.message))        
    }

    const hash = bcrypt.hashSync(senha, 10)   
    try {
        const usuario = await db.collection("usuarios").findOne({ email })
       
        if (usuario) {
            return res.status(409).send("Email cadastrado")
        }        
        await db.collection("usuarios").insertOne({nome, email, senha: hash})        
        return res.sendStatus(201)
    } catch (err) {
        return res.status(500).send(err.message)
    }
    
})

app.post("/login", async (req, res) => {
    const { email, senha} = req.body    

    const loginSchema = Joi.object({        
        email: Joi.string().email().required(),
        senha: Joi.string().min(3).required()
    })

    const validation = loginSchema.validate(req.body, {abortEarly: false})
    if (validation.error) {
        return res.status(422).send(validation.error.details.map(detail => detail.message))
    }

   
    try {
        const usuario = await db.collection("usuarios").findOne({ email })
        if(!usuario) {
            return res.status(404).send("Usuário não cadastrado")
        }
        const senhaVerificada = bcrypt.compareSync(senha, usuario.senha)
        if(!senhaVerificada){
            return res.status(401).send("Senha incorreta")
        }

        const token = uuid()
        await db.collection("sessao").insertOne({ token, idUsuario: usuario._id})

        return res.send({token, name: usuario.nome})
    } catch (err) {
        return res.status(500).send(err.message)
    }
})

app.post("/nova-transacao/:tipo", async (req, res) => {
    const { valor, descricao, tipo } = req.body

    const transacaoSchema =Joi.object({
        valor:Joi.string().required(),
        descricao: Joi.string().required(),
        tipo: Joi.string().required().valid("entrada", "saida")        
    })

    const validation = transacaoSchema.validade(req.body, {abortEarly: false})
    if (validation.error){
        return res.status(422).send(validation.error.details.map(detail => detail.message))
    }

    try {
        await db.collection("transacoes").insertOne({valor, descricao, tipo, data: dayjs(Date.now()).format("DD/MM")})
        return res.sendStatus(200)
    } catch (err){
        return res.status(500).send(err.message)
    }
})

app.get("/home", async (req, res) => {
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")

    if (!token){
        return res.sendStatus(401)
    }

    try {
        const sessao = await db.collection("sessao").findOne({ token })
        if (!sessao){
            return res.sendStatus(401)
        }
    
        const transacaoDisplay = await db.collection("transacoes").find( {_id: sessao.idUsuario} ).toArray()
        res.send(transacaoDisplay)
        return res.sendStatus(200)
    } catch (err){
        return res.status(500).send(err.message)
    }
})


// listen
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))