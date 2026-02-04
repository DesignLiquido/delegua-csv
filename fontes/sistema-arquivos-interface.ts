export interface SistemaArquivosInterface {
    lerArquivo(caminho: string): Promise<string>;
    escreverArquivo(caminho: string, conteudo: string): Promise<void>;
}
