import { textoParaObjetoCsv, objetoCsvParaTexto, vetorDicionariosParaCsv } from './csv';

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
    ],
    documentacao:
        '# `csv.textoParaObjetoCsv(texto, opcoes?)`\n\n' +
        'Converte um texto CSV em uma tabela (vetor de vetores) ou uma lista de registros (vetor de dicionários).\n\n' +
        '## Parâmetros\n\n' +
        '- `texto`: O texto CSV a ser analisado.\n' +
        '- `opcoes` (opcional): Dicionário com opções de análise.\n' +
        '  - `delimitador`: Caractere delimitador (padrão: `,`).\n' +
        '  - `aspas`: Caractere de aspas (padrão: `"`).\n' +
        '  - `quebraLinha`: Caractere de quebra de linha (padrão: `\\n`).\n' +
        '  - `cabecalho`: Se `verdadeiro`, retorna vetor de dicionários (padrão: `falso`).\n' +
        '  - `ignorarLinhasVazias`: Se `verdadeiro`, ignora linhas vazias (padrão: `verdadeiro`).\n\n' +
        '## Retorno\n\n' +
        'Retorna um vetor de vetores (tabela) ou um vetor de dicionários (se `cabecalho` for `verdadeiro`).\n\n' +
        '## Exemplo de Código\n\n' +
        '```delegua\n' +
        'importar tudo como csv de \'csv\'\n\n' +
        'var texto = "nome,idade\\nAna,30\\nBeto,25"\n\n' +
        '// Como tabela (vetor de vetores)\n' +
        'var tabela = csv.textoParaObjetoCsv(texto)\n' +
        'escreva(tabela) // [[\'nome\', \'idade\'], [\'Ana\', \'30\'], [\'Beto\', \'25\']]\n\n' +
        '// Como lista de registros (vetor de dicionários)\n' +
        'var registros = csv.textoParaObjetoCsv(texto, { \'cabecalho\': verdadeiro })\n' +
        'escreva(registros) // [{\'nome\': \'Ana\', \'idade\': \'30\'}, {\'nome\': \'Beto\', \'idade\': \'25\'}]\n' +
        '```'
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
    ],
    documentacao:
        '# `csv.objetoCsvParaTexto(linhas, opcoes?)`\n\n' +
        'Converte uma tabela (vetor de vetores) em um texto CSV.\n\n' +
        '## Parâmetros\n\n' +
        '- `linhas`: A tabela (vetor de vetores) a ser convertida.\n' +
        '- `opcoes` (opcional): Dicionário com opções de serialização.\n' +
        '  - `delimitador`: Caractere delimitador (padrão: `,`).\n' +
        '  - `aspas`: Caractere de aspas (padrão: `"`).\n' +
        '  - `quebraLinha`: Caractere de quebra de linha (padrão: `\\n`).\n\n' +
        '## Retorno\n\n' +
        'Retorna o texto CSV resultante.\n\n' +
        '## Exemplo de Código\n\n' +
        '```delegua\n' +
        'importar tudo como csv de \'csv\'\n\n' +
        'var linhas = [\n' +
        '    [\'nome\', \'idade\'],\n' +
        '    [\'Ana\', \'30\'],\n' +
        '    [\'Beto\', \'25\']\n' +
        ']\n\n' +
        'var texto = csv.objetoCsvParaTexto(linhas)\n' +
        'escreva(texto)\n' +
        '// nome,idade\n' +
        '// Ana,30\n' +
        '// Beto,25\n' +
        '```'
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
    ],
    documentacao:
        '# `csv.vetorDicionariosParaCsv(registros, colunas?, opcoes?)`\n\n' +
        'Converte um vetor de dicionários em um texto CSV. Gera automaticamente o cabeçalho com os nomes das colunas.\n\n' +
        '## Parâmetros\n\n' +
        '- `registros`: O vetor de dicionários a ser convertido.\n' +
        '- `colunas` (opcional): Vetor com os nomes das colunas a incluir e sua ordem. Se não informado, usa as chaves do primeiro registro.\n' +
        '- `opcoes` (opcional): Dicionário com opções de serialização.\n' +
        '  - `delimitador`: Caractere delimitador (padrão: `,`).\n' +
        '  - `aspas`: Caractere de aspas (padrão: `"`).\n' +
        '  - `quebraLinha`: Caractere de quebra de linha (padrão: `\\n`).\n\n' +
        '## Retorno\n\n' +
        'Retorna o texto CSV resultante, incluindo a linha de cabeçalho.\n\n' +
        '## Exemplo de Código\n\n' +
        '```delegua\n' +
        'importar tudo como csv de \'csv\'\n\n' +
        'var registros = [\n' +
        '    { \'nome\': \'Ana\', \'idade\': 28, \'cidade\': \'Rio de Janeiro\' },\n' +
        '    { \'nome\': \'Bruno\', \'idade\': 34, \'cidade\': \'São Paulo\' },\n' +
        '    { \'nome\': \'Carla\', \'idade\': 23, \'cidade\': \'Belo Horizonte\' }\n' +
        ']\n\n' +
        '// Usando todas as colunas\n' +
        'var texto = csv.vetorDicionariosParaCsv(registros)\n' +
        'escreva(texto)\n' +
        '// nome,idade,cidade\n' +
        '// Ana,28,Rio de Janeiro\n' +
        '// Bruno,34,São Paulo\n' +
        '// Carla,23,Belo Horizonte\n\n' +
        '// Selecionando colunas específicas\n' +
        'var texto2 = csv.vetorDicionariosParaCsv(registros, [\'cidade\', \'nome\'])\n' +
        'escreva(texto2)\n' +
        '// cidade,nome\n' +
        '// Rio de Janeiro,Ana\n' +
        '// São Paulo,Bruno\n' +
        '// Belo Horizonte,Carla\n' +
        '```'
};

export const DeleguaModuloCsv = {
    textoParaObjetoCsv: definicaoTextoParaObjetoCsv,
    objetoCsvParaTexto: definicaoObjetoCsvParaTexto,
    vetorDicionariosParaCsv: definicaoVetorDicionariosParaCsv
};
