import Joi from "joi"

export const transacaoSchema =Joi.object({
    valor:Joi.number().positive().precision(2).required(),
    descricao: Joi.string().required(),
    tipo: Joi.string().required().valid("entrada", "saida")        
})