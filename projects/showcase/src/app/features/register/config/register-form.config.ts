import {
  ValidationMessageConfig
} from 'shared-ui';

export const REGISTER_FORM_MESSAGES: ValidationMessageConfig = {

  fields: {

    name: {
      required: 'Nome é obrigatório.',
      minLength: 'Nome deve possuir pelo menos 2 caracteres.',
      maxLength: 'Nome não pode ultrapassar 150 caracteres.'
    },

    username: {
      required: 'Nome de usuário é obrigatório.',
      pattern: 'Utilize apenas letras minúsculas, números e hífens.',
      USERNAME_EXISTS: 'Este nome de usuário já está em uso.'
    },

    email: {
      required: 'Email é obrigatório.',
      email: 'Informe um email válido.',
      EMAIL_EXISTS: 'Este email já está cadastrado.'
    },

    password: {
      required: 'Senha é obrigatória.',
      minLength: 'A senha deve possuir pelo menos 8 caracteres.',
      maxLength: 'A senha não pode ultrapassar 30 caracteres.',
      pattern: 'A senha não atende aos requisitos de segurança.'
    },

    confirmPassword: {
      required: 'Confirme sua senha.'
    },

    description: {
      required: 'Descrição é obrigatória.',
      minLength: 'A descrição deve possuir pelo menos 10 caracteres.',
      maxLength: 'A descrição não pode ultrapassar 200 caracteres.'
    },

    country: {
      required: 'Selecione seu país.'
    },

    age: {
      required: 'Informe sua idade.',
      min: 'A idade mínima é 18 anos.',
      max: 'A idade máxima é 120 anos.'
    },

    birthdate: {
      required: 'Informe sua data de nascimento.',
      maxDate: 'A data de nascimento não pode ser no futuro.',
      minDate: 'A data de nascimento não pode ser anterior a 01/01/1900.'
    },

    preferredTime: {
      required: 'Informe seu horário preferido.'
    }
    

  },

  form: {
    passwordMismatch: 'As senhas não coincidem.'
  }

};