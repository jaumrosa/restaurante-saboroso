const Joi = require('joi');
const contactSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      'string.empty': 'nome',
      'any.required': 'nome'
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'e-mail',
      'string.email': 'e-mail válido',
      'any.required': 'e-mail'
    }),
  
  message: Joi.string()
    .required()
    .messages({
      'string.empty': 'mensagem',
      'any.required': 'mensagem'
    })
});

const reservationSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      'string.empty': 'nome',
      'any.required': 'nome'
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'e-mail',
      'string.email': 'e-mail válido',
      'any.required': 'e-mail'
    }),
  
  people: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      'number.base': 'número de pessoas',
      'number.min': 'número de pessoas',
      'any.required': 'número de pessoas'
    }),
  
  date: Joi.string()
    .required()
    .messages({
      'string.empty': 'data',
      'any.required': 'data'
    }),
  
  time: Joi.string()
    .required()
    .messages({
      'string.empty': 'horário',
      'any.required': 'horário'
    })
});

function validateWithAllErrors(schema, data) {
  const { error } = schema.validate(data, { abortEarly: false });
  
  if (!error) {
    return null;
  }

  const campos = error.details.map(err => err.message);
  
  const camposUnicos = [...new Set(campos)];
  
  if (camposUnicos.length === 1) {
    return `Preencha o campo: ${camposUnicos[0]}`;
  }

  const ultimoCampo = camposUnicos.pop();
  const listaCampos = camposUnicos.join(', ') + ' e ' + ultimoCampo;
  
  return `Preencha os campos: ${listaCampos}`;
}

module.exports = {
  contactSchema,
  reservationSchema,
  validateWithAllErrors
};
