import { textoParaObjetoCsv, objetoCsvParaTexto, vetorDicionariosParaCsv } from './fontes/csv';

const definicaoTextoParaObjetoCsv = {
    tipoRetorno: 'qualquer',
    funcao: textoParaObjetoCsv,
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

const definicaoObjetoCsvParaTexto = {
    tipoRetorno: 'texto',
    funcao: objetoCsvParaTexto,
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

const definicaoVetorDicionariosParaCsv = {
    tipoRetorno: 'texto',
    funcao: vetorDicionariosParaCsv,
    argumentos: [
        {
            nome: 'registros',
            tipo: 'qualquer'
        },
        {
            nome: 'colunas',
            tipo: 'qualquer'
        },
        {
            nome: 'opcoes',
            tipo: 'qualquer'
        }
    ]
};

export const DeleguaModuloCsv = {
    textoParaObjetoCsv: definicaoTextoParaObjetoCsv,
    objetoCsvParaTexto: definicaoObjetoCsvParaTexto,
    vetorDicionariosParaCsv: definicaoVetorDicionariosParaCsv
};
