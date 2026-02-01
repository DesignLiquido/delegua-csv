import { OpcoesCsvInterface } from './opcoes-csv-interface';

export type LinhaCsv = string[];
export type TabelaCsv = LinhaCsv[];
export type RegistroCsv = Record<string, string>;

const PADRAO_OPCOES: Required<Omit<OpcoesCsvInterface, 'cabecalho'>> & Pick<OpcoesCsvInterface, 'cabecalho'> = {
    delimitador: ',',
    aspas: '"',
    quebraLinha: '\n',
    cabecalho: false,
    ignorarLinhasVazias: true
};

function normalizarOpcoes(opcoes?: OpcoesCsvInterface): Required<Omit<OpcoesCsvInterface, 'cabecalho'>> & Pick<OpcoesCsvInterface, 'cabecalho'> {
    return {
        ...PADRAO_OPCOES,
        ...opcoes
    };
}

export function analisarCsv(interpretador: any, texto: string, opcoes?: OpcoesCsvInterface): TabelaCsv | RegistroCsv[] {
    const { delimitador, aspas, quebraLinha, cabecalho, ignorarLinhasVazias } = normalizarOpcoes(opcoes);
    const linhas: LinhaCsv[] = [];

    let atual: string[] = [];
    let campo = '';
    let emAspas = false;

    for (let i = 0; i < texto.length; i++) {
        const caractere = texto[i];
        const proximo = texto[i + 1];

        if (caractere === aspas) {
            if (emAspas && proximo === aspas) {
                campo += aspas;
                i++;
            } else {
                emAspas = !emAspas;
            }
            continue;
        }

        if (!emAspas && caractere === delimitador) {
            atual.push(campo);
            campo = '';
            continue;
        }

        if (!emAspas && caractere === '\r' && proximo === '\n') {
            atual.push(campo);
            campo = '';
            linhas.push(atual);
            atual = [];
            i++;
            continue;
        }

        if (!emAspas && caractere === quebraLinha) {
            atual.push(campo);
            campo = '';
            linhas.push(atual);
            atual = [];
            continue;
        }

        campo += caractere;
    }

    atual.push(campo);
    linhas.push(atual);

    const filtradas = ignorarLinhasVazias
        ? linhas.filter((linha) => linha.some((c) => c.trim().length > 0))
        : linhas;

    if (!cabecalho) {
        return filtradas;
    }

    if (filtradas.length === 0) {
        return [];
    }

    const [cabecalhos, ...resto] = filtradas;
    return resto.map((linha) => {
        const registro: RegistroCsv = {};
        cabecalhos.forEach((chave, indice) => {
            registro[chave] = linha[indice] ?? '';
        });
        return registro;
    });
}

export function serializarCsv(interpretador: any, linhas: TabelaCsv, opcoes?: OpcoesCsvInterface): string {
    const { delimitador, aspas, quebraLinha } = normalizarOpcoes(opcoes);

    const escapar = (valor: string) => {
        const precisaAspas = valor.includes(delimitador) || valor.includes(aspas) || valor.includes('\n') || valor.includes('\r');
        if (!precisaAspas) {
            return valor;
        }
        const escapado = valor.split(aspas).join(aspas + aspas);
        return `${aspas}${escapado}${aspas}`;
    };

    return linhas
        .map((linha) => linha.map((campo) => escapar(campo ?? '')).join(delimitador))
        .join(quebraLinha);
}

function logicaComumResolucaoCaminho(diretorioBaseInterpretador: string, caminhoArquivo: string) {
    let caminhoResolvido = caminhoArquivo;
    if (caminhoArquivo.startsWith('.')) {
        caminhoResolvido = caminhoArquivo; // Web environments don't support relative path resolution
    }

    return caminhoResolvido;
}
