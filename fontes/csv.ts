import * as caminho from 'path';
import * as sistemaArquivos from 'fs';

export interface OpcoesCsv {
    delimitador?: string;
    aspas?: string;
    quebraLinha?: string;
    cabecalho?: boolean;
    ignorarLinhasVazias?: boolean;
}

export type LinhaCsv = string[];
export type TabelaCsv = LinhaCsv[];
export type RegistroCsv = Record<string, string>;

const PADRAO_OPCOES: Required<Omit<OpcoesCsv, 'cabecalho'>> & Pick<OpcoesCsv, 'cabecalho'> = {
    delimitador: ',',
    aspas: '"',
    quebraLinha: '\n',
    cabecalho: false,
    ignorarLinhasVazias: true
};

function normalizarOpcoes(opcoes?: OpcoesCsv): Required<Omit<OpcoesCsv, 'cabecalho'>> & Pick<OpcoesCsv, 'cabecalho'> {
    return {
        ...PADRAO_OPCOES,
        ...opcoes
    };
}

export function analisarCsv(texto: string, opcoes?: OpcoesCsv): TabelaCsv | RegistroCsv[] {
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

export function serializarCsv(linhas: TabelaCsv, opcoes?: OpcoesCsv): string {
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
        caminhoResolvido = caminho.join(diretorioBaseInterpretador, caminhoArquivo);
    }

    return caminhoResolvido;
}

export function lerCsv(
    interpretador: { diretorioBase: string },
    caminhoArquivo: string,
    opcoes?: OpcoesCsv
): TabelaCsv | RegistroCsv[] {
    const caminhoResolvido = logicaComumResolucaoCaminho(interpretador.diretorioBase, caminhoArquivo);
    const texto = sistemaArquivos.readFileSync(caminhoResolvido, 'utf-8');
    return analisarCsv(texto, opcoes);
}

export function salvarCsv(
    interpretador: { diretorioBase: string },
    caminhoArquivo: string,
    dados: TabelaCsv,
    opcoes?: OpcoesCsv
): void {
    const caminhoResolvido = logicaComumResolucaoCaminho(interpretador.diretorioBase, caminhoArquivo);
    const conteudo = serializarCsv(dados, opcoes);
    sistemaArquivos.writeFileSync(caminhoResolvido, conteudo, 'utf-8');
}

export * from './csv';
