import { inputs } from "./app.js"
export function valida(input) {
    const tipoDeInput = input.dataset.tipo

    if (validadores[tipoDeInput]) {
        validadores[tipoDeInput](input)
    }

    if(input.validity.valid) {
        input.parentElement.classList.remove('input-container--invalido')
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = ''
    }else {
        input.parentElement.classList.add('input-container--invalido')
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = mostraMensagemDeErro (tipoDeInput, input)
    }
}

const tiposDeErros = [
    'valueMissing',
    'typeMismatch',
    'patternMismatch',
    'customError'
]

const mensagensDeErro = {
    nome: {
        valueMissing: 'O campo nome não pode estar vazio'
    },
    email: {
        valueMissing: 'O campo de e-mail não pode estar vazio.',
        typeMismatch: 'O e-mail digitado não é válido.'
    },
    senha: {
        valueMissing: 'O campo senha não pode estar vazio',
        patterMismatch: 'A senha deve conter entre 6 a 12 caracteres, deve conter pelo menos uma letra maiúscula, um número e não deve conter símbolos.'
    },
    dataNascimento: {
        valueMissing: 'O campo data de nascimento não pode estar vazio',
        customError: 'Você deve ser maior de 18 anos para se cadastrar.'
    },
    cpf: {
        valueMissing: 'O campo de CPF não pode estar vazio.',
        customError: 'O CFP digitado não é válido.'
    },
    cep: {
        valueMissing: 'O campo de CEP não pode estar vazio.',
        patterMismatch: 'O CEP digitado não é válido.',
        customError: 'Não foi possível buscar o CEP.'
    },
    logradouro: {
        valueMissing: 'O campo logradouro não pode estar vazio.',
    },
    cidade: {
        valueMissing: 'O campo cidade não pode estar vazio.',
    },
    estado: {
        valueMissing: 'O campo estado não pode estar vazio.',
    },
    preco: {
        valueMissing: 'O campo de preço não pode estar vazio.',
    }
}

const  validadores = {
    dataNascimento:input => validaDataNascimento(input),
    cpf:input => validaCPF(input),
    cep:input => recuperarCEP(input)
}

function mostraMensagemDeErro(tipoDeInput, input) {
    let mensagem = ''
    tiposDeErros.forEach(erro => {
        if(input.validity[erro]) {
            mensagem = mensagensDeErro[tipoDeInput][erro]
        }
    })

    return mensagem
}

function validaDataNascimento (input) {  
    const dataRecebida = new Date (input.value);    
    let mensagem = ''
    
    if(!maiorQue18(dataRecebida)){
        mensagem = 'Você deve ser maior que 18 anos para se cadastrar.';
    }
    
    input.setCustomValidity(mensagem);
}

function maiorQue18(data) {
    const dataAtual = new Date ();
    const dataMais18 = new Date(data.getUTCFullYear() + 18, data.getUTCMonth(), data.getUTCDate());
    
    return dataMais18 <= dataAtual
}

function validaCPF(input) {
    const cpfFormatado = input.value.replace(/\D/g, '');
    let mensagem = ''

    if(!checaCPFRepetido(cpfFormatado) || !checaEstruturaCPF(cpfFormatado)) {
        mensagem = 'O CPF digitado não é válido'
    }

    input.setCustomValidity(mensagem)
}

function checaCPFRepetido(cpf) {
    const valoresRepetidos = [
        '00000000000',
        '11111111111',
        '22222222222',
        '33333333333',
        '44444444444',
        '55555555555',
        '66666666666',
        '77777777777',
        '88888888888',
        '99999999999'
    ]
    let cpfValido = true

    valoresRepetidos.forEach (valor => {
        if(valor == cpf) {
            cpfValido = false;
        }
    })

    return cpfValido
}
function checaEstruturaCPF(cpf) {
    const multiplicador = 10

    return checaDigitoVerificador(cpf, multiplicador)
}

function checaDigitoVerificador (cpf, multiplicador) {
    if(multiplicador >= 12) {
        return true
    }

    let multiplicadorInicial = multiplicador
    let soma = 0
    const cpfSemDigitos = cpf.substr(0, multiplicador - 1).split('')
    const digitoVerificador = cpf.charAt(multiplicador - 1)
    for(let contador = 0; multiplicadorInicial > 1 ; multiplicadorInicial--) {
    soma = soma + cpfSemDigitos[contador] * multiplicadorInicial
    contador++
    }
    
    if(digitoVerificador == confirmaDigito(soma)) {
        return checaDigitoVerificador(cpf, multiplicador + 1)
    }
    return false
}

// Função do curso está incompleta:
// function confirmaDigito(soma) {
//     return 11 - (soma % 11)
// }

function confirmaDigito(soma){
    let restoDaDivisao = soma % 11
    if(restoDaDivisao >= 2){
        return 11 - restoDaDivisao
    } else {
        return 0
    }
}

function recuperarCEP (input) {
    const cep = input.value.replace(/\D/g, '')
    const url = `https://viacep.com.br/ws/${cep}/json`
    const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
            'content-type': 'application/json;charset=utf-8'
        }
    }
    if(!input.validity.patterMismatch && !input.validity.valueMissing) {
        fetch(url, options).then (
            response => response.json()
        ).then(
            data => {
                if(data.erro) {
                    input.setCustomValidity('Não foi possível buscar o CEP.')
                    return
                }
                input.setCustomValidity('')
                preencherCamposComCEP(data)
                return
            }
        )
    }
}

function preencherCamposComCEP(data) {
    const logradouro = document.querySelector('[data-tipo="logradouro"]')
    const cidade = document.querySelector('[data-tipo="cidade"]')
    const estado = document.querySelector('[data-tipo="estado"]')

    logradouro.value = data.logradouro
    cidade.value = data.localidade
    estado.value = data.uf
}


// Conta de verificação do CPF

// 123 456 789 09

// let soma = (11 * 1) + (10 * 2) + (9 * 3) .toExponential.apply. (2 * 0)

// let digitoVerificador = 11 - (soma / 11)




// const dataNascimento = document.querySelector('#nascimento');

// dataNascimento.addEventListener('blur', (evento) => {
//     validaDataNascimento(evento.target);
// })
