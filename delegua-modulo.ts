import { analisarCsv, serializarCsv } from './fontes/csv';

const definicaoAnalisarCsv = {
    tipoRetorno: 'qualquer',
    funcao: analisarCsv,
    argumentos: [
        {
            nome: 'texto',
            tipo: 'texto'
        },
        {
            nome: 'opcoes',
            tipo: 'qualquer'
        }
    ]
};

const definicaoSerializarCsv = {
    tipoRetorno: 'texto',
    funcao: serializarCsv,
    argumentos: [
        {
            nome: 'linhas',
            tipo: 'qualquer'
        },
        {
            nome: 'opcoes',
            tipo: 'qualquer'
        }
    ]
};

export const DeleguaModuloCsv = {
    analisarCsv: definicaoAnalisarCsv,
    serializarCsv: definicaoSerializarCsv
};
