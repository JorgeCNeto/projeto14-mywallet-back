import { db } from "../database/database.connection.js"

export async function validateAuth(req, res, next) {
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
    
        next()

    } catch (err){
        return res.status(500).send(err.message)
    }
}