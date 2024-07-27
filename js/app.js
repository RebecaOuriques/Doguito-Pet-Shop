import { valida } from "./validacao.js"


export const inputs = document.querySelectorAll('input')

inputs.forEach(input => {
    if(input.dataset.tipo === 'preco') {
        SimpleMaskMoney.setMask(input, {
            prefix:'R$',
            fixed: true,
            fractionDigits: 2,
            decimalSeparator: ',',
            thousandsSeparator: '.',
            cursor: 'end',
        })
    }

    input.addEventListener('blur', (evento) => {
        valida(evento.target)
    })
})

// Maskara completa:
// afterFormat(e) { console.log('afterFormat', e); },
// allowNegative: false,
// beforeFormat(e) { console.log('beforeFormat', e); },
// negativeSignAfter: false,
// prefix: '',
// suffix: '',
// fixed: true,
// fractionDigits: 2,
// decimalSeparator: ',',
// thousandsSeparator: '.',
// cursor: 'move'