import { Router } from "express"
import { cadastro, login, logout } from "../controllers/usuarios.controller.js"
import {validadeSchema} from '../middlewares/validateSchema.js'
import {validateAuth} from '../middlewares/validateAuth.js'
import {usuariosSchema, loginSchema} from "../schemas/usuarios.schema.js"

const userRouter = Router()

userRouter.post("/cadastro", validadeSchema(usuariosSchema), cadastro)

userRouter.post("/login", validadeSchema(loginSchema), login)

userRouter.post("/logout", validateAuth, logout)

export default userRouter