import { Router } from 'express'
import { transacoes, home } from "../controllers/transacoes.controller.js"
import {validadeSchema} from '../middlewares/validateSchema.js'
import {transacaoSchema} from "../schemas/transacoes.schema.js"
import {validateAuth} from '../middlewares/validadeAuth.js'

const transacoesRouter = Router()
transacoesRouter.use(validateAuth)

transacoesRouter.post("/nova-transacao/:tipo", validadeSchema(transacaoSchema), transacoes)

transacoesRouter.get("/home", home)

export default transacoesRouter