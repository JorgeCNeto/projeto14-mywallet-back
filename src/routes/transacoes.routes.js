import { Router } from 'express'
import { transacoes, home } from "../controllers/transacoes.controller.js"
import {validadeSchema} from '../middlewares/validateSchema.js'
import {transacaoSchema} from "../schemas/transacoes.schema.js"
import {validateAuth} from '../middlewares/validateAuth.js'

const transacoesRouter = Router()
transacoesRouter.use(validateAuth)

transacoesRouter.post("/transacao", validateAuth, validadeSchema(transacaoSchema), transacoes)

transacoesRouter.get("/home", validateAuth, home)

export default transacoesRouter 