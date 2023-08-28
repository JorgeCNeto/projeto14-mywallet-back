import { db } from "../database/database.connection.js"
import dayjs from "dayjs"

export async function transacoes(req, res) {
    const { valor, descricao, tipo } = req.body
    const { idUsuario } = res.locals.session

    try {
        await db.collection("transacoes").insertOne({valor: Number(valor), descricao, tipo, idUsuario, data: dayjs(Date.now()).format("DD/MM")})
        return res.sendStatus(200)
    } catch (err){
        return res.status(500).send(err.message)
    }
}

export async function home(req, res) {
    const { idUsuario } = res.locals.session

    try {          
        const transacaoDisplay = await db.collection("transacoes").find( {idUsuario} ).sort({date: -1}).toArray()
        res.send(transacaoDisplay)
        return res.sendStatus(200)
    } catch (err){
        return res.status(500).send(err.message)
    }
}