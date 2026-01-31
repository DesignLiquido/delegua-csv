import { lerCsv, salvarCsv, analisarCsv, serializarCsv } from './fontes/csv';

const definicaoLerCsv = {
    tipoRetorno: 'qualquer',
    funcao: lerCsv,
    argumentos: [
        {
            nome: 'caminhoArquivo',
            tipo: 'texto'
        },
        {
            nome: 'opcoes',
            tipo: 'qualquer'
        }
    ]
};

const definicaoSalvarCsv = {
    tipoRetorno: 'vazio',
    funcao: salvarCsv,
    argumentos: [
        {
            nome: 'caminhoArquivo',
            tipo: 'texto'
        },
        {
            nome: 'dados',
            tipo: 'qualquer'
        },
        {
            nome: 'opcoes',
            tipo: 'qualquer'
        }
    ]
};

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
    lerCsv: definicaoLerCsv,
    salvarCsv: definicaoSalvarCsv,
    analisarCsv: definicaoAnalisarCsv,
    serializarCsv: definicaoSerializarCsv
};
