import { db } from "../database/database.connection.js"
import dayjs from "dayjs"

export async function transacoes(req, res) {
    const { valor, descricao, tipo } = req.body

    try {
        await db.collection("transacoes").insertOne({valor, descricao, tipo, data: dayjs(Date.now()).format("DD/MM")})
        return res.sendStatus(200)
    } catch (err){
        return res.status(500).send(err.message)
    }
}

export async function home(req, res) {
 
    try {          
        const transacaoDisplay = await db.collection("transacoes").find( {_id: sessao.idUsuario} ).toArray()
        res.send(transacaoDisplay)
        return res.sendStatus(200)
    } catch (err){
        return res.status(500).send(err.message)
    }
}