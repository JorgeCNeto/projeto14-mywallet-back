import Joi from "joi"

export const transacaoSchema =Joi.object({
    valor:Joi.string().required(),
    descricao: Joi.string().required(),
    tipo: Joi.string().required().valid("entrada", "saida")        
})