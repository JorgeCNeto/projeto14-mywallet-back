import bcrypt from "bcrypt"
import { db } from "../database/database.connection.js" 
import { v4 as uuid } from "uuid"

export async function cadastro (req, res){
    const { nome, email, senha } = req.body
   
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
}

export async function login (req, res) {
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

        const token = uuid()
        await db.collection("sessao").insertOne({ token, idUsuario: usuario._id})

        return res.send({token, name: usuario.nome})
    } catch (err) {
        return res.status(500).send(err.message)
    }
}

export async function logout(req, res){
    const token = res.locals.session.token
    
    try {
        await db.collection("sessao").deleteOne({ token })
        res.sendStatus(200)

    } catch (err) {
        return res.status(500).send(err.message)
    }
}