# delegua-csv

Biblioteca CSV para a linguagem Delégua.

## Uso

- Funções de análise e serialização de CSV.
- Leitura e escrita de arquivos CSV usando uma interface de sistema de arquivos (`SistemaArquivosInterface`).

## API

### Funções de CSV

- `textoParaObjetoCsv(interpretador, texto, opcoes)`
	- Retorna uma tabela (`TabelaCsv`) ou uma lista de registros (`RegistroCsv`) quando `cabecalho` é `true`.
- `objetoCsvParaTexto(interpretador, linhas, opcoes)`
	- Converte uma `TabelaCsv` em texto CSV.
- `vetorDicionariosParaCsv(interpretador, registros, colunas, opcoes)`
	- Converte um vetor de dicionários (`RegistroCsv[]`) em texto CSV.

### Funções de arquivo

- `lerCsv(sistemaArquivos, caminho, opcoes)`
	- Lê um arquivo CSV do sistema de arquivos.
- `escreverCsv(sistemaArquivos, caminho, linhas, opcoes)`
	- Salva uma `TabelaCsv` no caminho informado.
- `escreverRegistrosCsv(sistemaArquivos, caminho, registros, colunas, opcoes)`
	- Salva um vetor de dicionários (`RegistroCsv[]`) no caminho informado.

### Interface de Sistema de Arquivos

A biblioteca não depende de Node.js. Para leitura e escrita de arquivos, implemente `SistemaArquivosInterface`:

```ts
interface SistemaArquivosInterface {
    lerArquivo(caminho: string): Promise<string>;
    escreverArquivo(caminho: string, conteudo: string): Promise<void>;
}
```

### Opções

`OpcoesCsvInterface`:

- `delimitador` (padrão: `,`)
- `aspas` (padrão: `"`)
- `quebraLinha` (padrão: `\n`)
- `cabecalho` (padrão: `false`)
- `ignorarLinhasVazias` (padrão: `true`)

## Exemplos

### Analisar CSV

```ts
import { textoParaObjetoCsv } from '@designliquido/delegua-csv';

const texto = 'nome,idade\nAna,30\nBeto,25';
const tabela = textoParaObjetoCsv(undefined, texto);
// tabela: [['nome','idade'], ['Ana','30'], ['Beto','25']]

const registros = textoParaObjetoCsv(undefined, texto, { cabecalho: true });
// registros: [{ nome: 'Ana', idade: '30' }, { nome: 'Beto', idade: '25' }]
```

### Serializar CSV

```ts
import { objetoCsvParaTexto } from '@designliquido/delegua-csv';

const linhas = [
	['nome', 'observacao'],
	['Ana', 'gosta, de "café"']
];

const texto = objetoCsvParaTexto(undefined, linhas);
// nome,observacao
// Ana,"gosta, de ""café"""
```

### Serializar vetor de dicionários

```ts
import { vetorDicionariosParaCsv } from '@designliquido/delegua-csv';

const registros = [
	{ nome: 'Ana', idade: '30' },
	{ nome: 'Beto', idade: '25' }
];

const texto = vetorDicionariosParaCsv(undefined, registros);
// nome,idade
// Ana,30
// Beto,25

// Com colunas específicas:
const texto2 = vetorDicionariosParaCsv(undefined, registros, ['idade', 'nome']);
// idade,nome
// 30,Ana
// 25,Beto
```

### Ler e salvar CSV

```ts
import { lerCsv, escreverCsv, SistemaArquivosInterface } from '@designliquido/delegua-csv';
import * as fs from 'fs/promises';

// Implementação para Node.js
const sistemaArquivos: SistemaArquivosInterface = {
    lerArquivo: (caminho) => fs.readFile(caminho, 'utf-8'),
    escreverArquivo: (caminho, conteudo) => fs.writeFile(caminho, conteudo, 'utf-8')
};

const dados = await lerCsv(sistemaArquivos, './clientes.csv', { cabecalho: true });
await escreverCsv(sistemaArquivos, './clientes-novo.csv', dados);
```

## Testes

```bash
yarn testes-unitarios
```
