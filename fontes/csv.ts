import { OpcoesCsvInterface } from './opcoes-csv-interface';
import { SistemaArquivosInterface } from './sistema-arquivos-interface';

export type LinhaCsv = string[];
export type TabelaCsv = LinhaCsv[];
export type RegistroCsv = Record<string, unknown>;

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
 * Converte um texto CSV em uma tabela ou lista de registros.
 * @param interpretador A instância do interpretador (não utilizada atualmente).
 * @param texto O texto CSV a ser analisado.
 * @param opcoes Opções para análise do CSV.
 * @returns Ou uma tabela (vetor de vetores) ou uma lista de registros (vetor de objetos).
 */
export function textoParaObjetoCsv(interpretador: any, texto: string, opcoes?: OpcoesCsvInterface): TabelaCsv | RegistroCsv[] {
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
    return (valor: unknown) => {
        const texto = valor == null ? '' : String(valor);
        const precisaAspas = texto.includes(delimitador) || texto.includes(aspas) || texto.includes('\n') || texto.includes('\r');
        if (!precisaAspas) {
            return texto;
        }
        const escapado = texto.split(aspas).join(aspas + aspas);
        return `${aspas}${escapado}${aspas}`;
    };
}

/**
 * Converte uma tabela (vetor de vetores) em um texto CSV.
 * @param interpretador A instância do interpretador (não utilizada atualmente).
 * @param linhas A tabela a ser convertida em CSV.
 * @param opcoes Opções para serialização do CSV.
 * @returns O texto CSV resultante.
 */
export function objetoCsvParaTexto(interpretador: any, linhas: TabelaCsv, opcoes?: OpcoesCsvInterface): string {
    const { delimitador, aspas, quebraLinha } = normalizarOpcoes(opcoes);
    const escapar = criarEscapador(delimitador, aspas);

    return linhas
        .map((linha) => linha.map((campo) => escapar(campo ?? '')).join(delimitador))
        .join(quebraLinha);
}

/**
 * Converte um vetor de dicionários (registros) em um texto CSV. Este processo
 * também é conhecido como serialização de registros.
 * @param interpretador A instância do interpretador (não utilizada atualmente).
 * @param registros O vetor de registros a ser convertido em CSV.
 * @param colunas As colunas a serem incluídas no CSV (opcional).
 * @param opcoes Opções para serialização do CSV.
 * @returns O texto CSV resultante.
 */
export function vetorDicionariosParaCsv(
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

/**
 * Lê um arquivo CSV do sistema de arquivos e o converte em uma tabela ou lista de registros.
 * @param sistemaArquivos A instância do sistema de arquivos. Trabalha com Node.js, VSCode API, etc.
 * @param caminho O caminho do arquivo CSV a ser lido.
 * @param opcoes Opções para análise do CSV.
 * @returns Uma promessa que resolve para a tabela ou lista de registros resultante.
 */
export async function lerCsv(
    sistemaArquivos: SistemaArquivosInterface,
    caminho: string,
    opcoes?: OpcoesCsvInterface
): Promise<TabelaCsv | RegistroCsv[]> {
    const conteudo = await sistemaArquivos.lerArquivo(caminho);
    return textoParaObjetoCsv(undefined, conteudo, opcoes);
}

/** Escreve uma tabela ou lista de registros em um arquivo CSV no sistema de arquivos.
 * @param sistemaArquivos A instância do sistema de arquivos. Trabalha com Node.js, VSCode API, etc.
 * @param caminho O caminho do arquivo CSV a ser escrito.
 * @param linhas A tabela a ser escrita no arquivo CSV.
 * @param opcoes Opções para serialização do CSV.
 */
export async function escreverCsv(
    sistemaArquivos: SistemaArquivosInterface,
    caminho: string,
    linhas: TabelaCsv,
    opcoes?: OpcoesCsvInterface
): Promise<void> {
    const conteudo = objetoCsvParaTexto(undefined, linhas, opcoes);
    await sistemaArquivos.escreverArquivo(caminho, conteudo);
}

/** Escreve uma tabela ou lista de registros em um arquivo CSV no sistema de arquivos.
 * @param sistemaArquivos A instância do sistema de arquivos. Trabalha com Node.js, VSCode API, etc.
 * @param caminho O caminho do arquivo CSV a ser escrito.
 * @param registros O vetor de registros a ser escrito no arquivo CSV.
 * @param colunas As colunas a serem incluídas no CSV (opcional).
 * @param opcoes Opções para serialização do CSV.
 */
export async function escreverRegistrosCsv(
    sistemaArquivos: SistemaArquivosInterface,
    caminho: string,
    registros: RegistroCsv[],
    colunas?: string[],
    opcoes?: OpcoesCsvInterface
): Promise<void> {
    const conteudo = vetorDicionariosParaCsv(undefined, registros, colunas, opcoes);
    await sistemaArquivos.escreverArquivo(caminho, conteudo);
}
