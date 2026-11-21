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
    }

  },

  form: {
    passwordMismatch: 'As senhas não coincidem.'
  }

};