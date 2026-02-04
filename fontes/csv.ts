import { OpcoesCsvInterface } from './opcoes-csv-interface';
import { SistemaArquivosInterface } from './sistema-arquivos-interface';

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

/**
 * 
 * @param interpretador 
 * @param texto 
 * @param opcoes 
 * @returns 
 */
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

function criarEscapador(delimitador: string, aspas: string) {
    return (valor: string) => {
        const precisaAspas = valor.includes(delimitador) || valor.includes(aspas) || valor.includes('\n') || valor.includes('\r');
        if (!precisaAspas) {
            return valor;
        }
        const escapado = valor.split(aspas).join(aspas + aspas);
        return `${aspas}${escapado}${aspas}`;
    };
}

/**
 * 
 * @param interpretador 
 * @param linhas 
 * @param opcoes 
 * @returns 
 */
export function serializarCsv(interpretador: any, linhas: TabelaCsv, opcoes?: OpcoesCsvInterface): string {
    const { delimitador, aspas, quebraLinha } = normalizarOpcoes(opcoes);
    const escapar = criarEscapador(delimitador, aspas);

    return linhas
        .map((linha) => linha.map((campo) => escapar(campo ?? '')).join(delimitador))
        .join(quebraLinha);
}

/**
 * 
 * @param interpretador 
 * @param registros 
 * @param colunas 
 * @param opcoes 
 * @returns 
 */
export function serializarRegistros(
    interpretador: any,
    registros: RegistroCsv[],
    colunas?: string[],
    opcoes?: OpcoesCsvInterface
): string {
    if (registros.length === 0) {
        return colunas ? colunas.join(normalizarOpcoes(opcoes).delimitador) : '';
    }

    const { delimitador, aspas, quebraLinha } = normalizarOpcoes(opcoes);
    const escapar = criarEscapador(delimitador, aspas);

    const cabecalhos = colunas ?? Object.keys(registros[0]);

    const linhasCsv: string[] = [
        cabecalhos.map((col) => escapar(col)).join(delimitador)
    ];

    for (const registro of registros) {
        const valores = cabecalhos.map((col) => escapar(registro[col] ?? ''));
        linhasCsv.push(valores.join(delimitador));
    }

    return linhasCsv.join(quebraLinha);
}

export async function lerCsv(
    sistemaArquivos: SistemaArquivosInterface,
    caminho: string,
    opcoes?: OpcoesCsvInterface
): Promise<TabelaCsv | RegistroCsv[]> {
    const conteudo = await sistemaArquivos.lerArquivo(caminho);
    return analisarCsv(undefined, conteudo, opcoes);
}

export async function escreverCsv(
    sistemaArquivos: SistemaArquivosInterface,
    caminho: string,
    linhas: TabelaCsv,
    opcoes?: OpcoesCsvInterface
): Promise<void> {
    const conteudo = serializarCsv(undefined, linhas, opcoes);
    await sistemaArquivos.escreverArquivo(caminho, conteudo);
}

export async function escreverRegistrosCsv(
    sistemaArquivos: SistemaArquivosInterface,
    caminho: string,
    registros: RegistroCsv[],
    colunas?: string[],
    opcoes?: OpcoesCsvInterface
): Promise<void> {
    const conteudo = serializarRegistros(undefined, registros, colunas, opcoes);
    await sistemaArquivos.escreverArquivo(caminho, conteudo);
}
