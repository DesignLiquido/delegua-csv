import mock from 'mock-fs';

import { analisarCsv, serializarCsv, TabelaCsv } from '../fontes';

describe('Casos de sucesso', () => {
    describe('CSV - análise e serialização', () => {
        it('analisarCsv() sem cabeçalho', () => {
            const texto = 'nome,idade\nAna,30\nBeto,25';
            const resultado = analisarCsv(undefined, texto);

            expect(Array.isArray(resultado)).toBe(true);
            expect(resultado).toHaveLength(3);
            expect(resultado[0]).toEqual(['nome', 'idade']);
            expect(resultado[1]).toEqual(['Ana', '30']);
        });

        it('analisarCsv() com cabeçalho', () => {
            const texto = 'nome,idade\nAna,30\nBeto,25';
            const resultado = analisarCsv(undefined, texto, { cabecalho: true });

            expect(resultado).toHaveLength(2);
            expect(resultado[0]).toEqual({ nome: 'Ana', idade: '30' });
            expect(resultado[1]).toEqual({ nome: 'Beto', idade: '25' });
        });

        it('serializarCsv() com aspas', () => {
            const linhas: TabelaCsv = [
                ['nome', 'observacao'],
                ['Ana', 'gosta, de "café"']
            ];

            const texto = serializarCsv(undefined, linhas);
            expect(texto).toBe('nome,observacao\nAna,"gosta, de ""café"""');
        });
    });

    describe('Leitura e escrita de CSV', () => {
        beforeAll(() => {
            mock({
                'diretorio/de/mentirinha': {
                    'dados.csv': 'nome,idade\nAna,30\nBeto,25'
                }
            });
        });

        afterAll(() => {
            mock.restore();
        });
    });
});
