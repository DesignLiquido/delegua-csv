import {
    textoParaObjetoCsv,
    objetoCsvParaTexto,
    vetorDicionariosParaCsv,
    lerCsv,
    escreverCsv,
    escreverRegistrosCsv,
    TabelaCsv,
    RegistroCsv,
    SistemaArquivosInterface
} from '../fontes';

describe('Casos de sucesso', () => {
    describe('CSV - análise e serialização', () => {
        it('analisarCsv() sem cabeçalho', () => {
            const texto = 'nome,idade\nAna,30\nBeto,25';
            const resultado = textoParaObjetoCsv(undefined, texto);

            expect(Array.isArray(resultado)).toBe(true);
            expect(resultado).toHaveLength(3);
            expect(resultado[0]).toEqual(['nome', 'idade']);
            expect(resultado[1]).toEqual(['Ana', '30']);
        });

        it('analisarCsv() com cabeçalho', () => {
            const texto = 'nome,idade\nAna,30\nBeto,25';
            const resultado = textoParaObjetoCsv(undefined, texto, { cabecalho: true });

            expect(resultado).toHaveLength(2);
            expect(resultado[0]).toEqual({ nome: 'Ana', idade: '30' });
            expect(resultado[1]).toEqual({ nome: 'Beto', idade: '25' });
        });

        it('serializarCsv() com aspas', () => {
            const linhas: TabelaCsv = [
                ['nome', 'observacao'],
                ['Ana', 'gosta, de "café"']
            ];

            const texto = objetoCsvParaTexto(undefined, linhas);
            expect(texto).toBe('nome,observacao\nAna,"gosta, de ""café"""');
        });

        it('serializarRegistros() sem colunas especificadas', () => {
            const registros: RegistroCsv[] = [
                { nome: 'Ana', idade: '30' },
                { nome: 'Beto', idade: '25' }
            ];

            const texto = vetorDicionariosParaCsv(undefined, registros);
            expect(texto).toBe('nome,idade\nAna,30\nBeto,25');
        });

        it('serializarRegistros() com colunas especificadas', () => {
            const registros: RegistroCsv[] = [
                { nome: 'Ana', idade: '30', cidade: 'SP' },
                { nome: 'Beto', idade: '25', cidade: 'RJ' }
            ];

            const texto = vetorDicionariosParaCsv(undefined, registros, ['cidade', 'nome']);
            expect(texto).toBe('cidade,nome\nSP,Ana\nRJ,Beto');
        });

        it('serializarRegistros() com vetor vazio e colunas', () => {
            const registros: RegistroCsv[] = [];
            const texto = vetorDicionariosParaCsv(undefined, registros, ['nome', 'idade']);
            expect(texto).toBe('nome,idade');
        });

        it('serializarRegistros() com vetor vazio sem colunas', () => {
            const registros: RegistroCsv[] = [];
            const texto = vetorDicionariosParaCsv(undefined, registros);
            expect(texto).toBe('');
        });

        it('serializarRegistros() com caracteres especiais', () => {
            const registros: RegistroCsv[] = [
                { nome: 'Ana, Maria', observacao: 'disse "olá"' }
            ];

            const texto = vetorDicionariosParaCsv(undefined, registros);
            expect(texto).toBe('nome,observacao\n"Ana, Maria","disse ""olá"""');
        });

        it('serializarRegistros() com campo ausente no registro', () => {
            const registros: RegistroCsv[] = [
                { nome: 'Ana', idade: '30' },
                { nome: 'Beto' }
            ];

            const texto = vetorDicionariosParaCsv(undefined, registros, ['nome', 'idade']);
            expect(texto).toBe('nome,idade\nAna,30\nBeto,');
        });
    });

    describe('Leitura e escrita de CSV', () => {
        const criarSistemaArquivosMock = (arquivos: Record<string, string> = {}): SistemaArquivosInterface => ({
            lerArquivo: jest.fn((caminho: string) => {
                if (caminho in arquivos) {
                    return Promise.resolve(arquivos[caminho]);
                }
                return Promise.reject(new Error(`Arquivo não encontrado: ${caminho}`));
            }),
            escreverArquivo: jest.fn((caminho: string, conteudo: string) => {
                arquivos[caminho] = conteudo;
                return Promise.resolve();
            })
        });

        it('lerCsv() lê e analisa arquivo CSV', async () => {
            const sistemaArquivos = criarSistemaArquivosMock({
                'dados.csv': 'nome,idade\nAna,30\nBeto,25'
            });

            const resultado = await lerCsv(sistemaArquivos, 'dados.csv', { cabecalho: true });

            expect(sistemaArquivos.lerArquivo).toHaveBeenCalledWith('dados.csv');
            expect(resultado).toHaveLength(2);
            expect(resultado[0]).toEqual({ nome: 'Ana', idade: '30' });
        });

        it('escreverCsv() serializa e escreve arquivo CSV', async () => {
            const arquivos: Record<string, string> = {};
            const sistemaArquivos = criarSistemaArquivosMock(arquivos);

            const linhas: TabelaCsv = [
                ['nome', 'idade'],
                ['Ana', '30']
            ];

            await escreverCsv(sistemaArquivos, 'saida.csv', linhas);

            expect(sistemaArquivos.escreverArquivo).toHaveBeenCalledWith('saida.csv', 'nome,idade\nAna,30');
            expect(arquivos['saida.csv']).toBe('nome,idade\nAna,30');
        });

        it('escreverRegistrosCsv() serializa registros e escreve arquivo CSV', async () => {
            const arquivos: Record<string, string> = {};
            const sistemaArquivos = criarSistemaArquivosMock(arquivos);

            const registros: RegistroCsv[] = [
                { nome: 'Ana', idade: '30' },
                { nome: 'Beto', idade: '25' }
            ];

            await escreverRegistrosCsv(sistemaArquivos, 'saida.csv', registros);

            expect(arquivos['saida.csv']).toBe('nome,idade\nAna,30\nBeto,25');
        });
    });
});
