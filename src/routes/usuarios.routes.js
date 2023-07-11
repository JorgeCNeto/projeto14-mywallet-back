import { Router } from "express"
import { cadastro, login } from "../controllers/usuarios.controller.js"
import {validadeSchema} from '../middlewares/validateSchema.js'
import {usuariosSchema} from "../schemas/usuarios.schema.js"

const userRouter = Router()

userRouter.post("/cadastro", validadeSchema(usuariosSchema), cadastro)

userRouter.post("/login", validadeSchema(usuariosSchema), login)

export default userRouter