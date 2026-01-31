# delegua-csv

Biblioteca CSV para a linguagem Delégua.

## Uso

- Funções de análise e serialização de CSV.
- Leitura e escrita de arquivos CSV usando `diretorioBase` do interpretador.

## API

### Funções de CSV

- `analisarCsv(texto, opcoes)`
	- Retorna uma tabela (`TabelaCsv`) ou uma lista de registros (`RegistroCsv`) quando `cabecalho` é `true`.
- `serializarCsv(linhas, opcoes)`
	- Converte uma `TabelaCsv` em texto CSV.

### Funções de arquivo

- `lerCsv(interpretador, caminhoArquivo, opcoes)`
	- Lê um arquivo CSV do sistema de arquivos, respeitando `diretorioBase`.
- `salvarCsv(interpretador, caminhoArquivo, dados, opcoes)`
	- Salva uma `TabelaCsv` no caminho informado.

### Opções

`OpcoesCsv`:

- `delimitador` (padrão: `,`)
- `aspas` (padrão: `"`)
- `quebraLinha` (padrão: `\n`)
- `cabecalho` (padrão: `false`)
- `ignorarLinhasVazias` (padrão: `true`)

## Exemplos

### Analisar CSV

```ts
import { analisarCsv } from 'delegua-csv';

const texto = 'nome,idade\nAna,30\nBeto,25';
const tabela = analisarCsv(texto);
// tabela: [['nome','idade'], ['Ana','30'], ['Beto','25']]

const registros = analisarCsv(texto, { cabecalho: true });
// registros: [{ nome: 'Ana', idade: '30' }, { nome: 'Beto', idade: '25' }]
```

### Serializar CSV

```ts
import { serializarCsv } from 'delegua-csv';

const linhas = [
	['nome', 'observacao'],
	['Ana', 'gosta, de "café"']
];

const texto = serializarCsv(linhas);
// nome,observacao
// Ana,"gosta, de ""café"""
```

### Ler e salvar CSV

```ts
import { lerCsv, salvarCsv } from 'delegua-csv';

const interpretador = { diretorioBase: 'dados' };

const dados = lerCsv(interpretador, './clientes.csv');
salvarCsv(interpretador, './clientes-novo.csv', dados);
```

## Testes

```bash
yarn testes-unitarios
```

