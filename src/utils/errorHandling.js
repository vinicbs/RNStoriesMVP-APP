export const registerErrors = (err) => {
    switch (err.message) {
        case 'UniqueViolationError':
            return 'Email ja cadastrado';
        case 'Body parameters not fulfilled.':
            if (err.moreInfo.errors && err.moreInfo.errors.length > 0) {
                console.log('debug 2')
                let param = '';
                let msg = '';
                switch (err.moreInfo.errors[0].param) {
                    case 'email':
                        param = 'Email '
                        break;
                    case 'password':
                        param = 'Senha '
                        break;
                    default:
                        param = 'Parametro '
                        break;
                }
                switch (err.moreInfo.errors[0].msg) {
                    case 'Invalid value':
                        msg = 'inválido(a)'
                        break;
                    default:
                        return 'Erro desconhecido.'
                }
                return param + msg;
            }
        default:
            return 'Erro desconhecido.'
    }
}