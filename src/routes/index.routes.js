import { Router } from "express"
import userRouter from "./usuarios.routes.js"
import transacoesRouter from "./transacoes.routes.js"

const router = Router()

router.use(userRouter)
router.use(transacoesRouter)

export default router