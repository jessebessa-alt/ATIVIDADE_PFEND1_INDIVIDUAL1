import { existsSync, readFileSync } from 'node:fs';

function carregarArquivoEnvManual(caminho) {
  if (!existsSync(caminho)) return;
  const conteudo = readFileSync(caminho, 'utf-8');
  for (const linha of conteudo.split(/\r?\n/)) {
    const limpa = linha.trim();
    if (!limpa || limpa.startsWith('#')) continue;
    const indiceIgual = limpa.indexOf('=');
    if (indiceIgual === -1) continue;
    const chave = limpa.slice(0, indiceIgual).trim();
    const valor = limpa.slice(indiceIgual + 1).trim();
    if (chave && process.env[chave] === undefined) {
      process.env[chave] = valor;
    }
  }
}

export function carregarAmbiente(arquivoDeConfiguracao = '.env') {
  if (arquivoDeConfiguracao && existsSync(arquivoDeConfiguracao)) {
    if (typeof process.loadEnvFile === 'function') {
      try {
        process.loadEnvFile(arquivoDeConfiguracao);
      } catch {
        carregarArquivoEnvManual(arquivoDeConfiguracao);
      }
    } else {
      carregarArquivoEnvManual(arquivoDeConfiguracao);
    }
  }

  return {
    nomeAluno: process.env.NOME_ALUNO || 'Estudante',
    turma: process.env.TURMA || '3TD',
    porta: Number(process.env.PORT) || 3001,
    segredoSessao: process.env.SESSION_SECRET || 'segredo-sessao-produtos-2026',
    ambiente: process.env.NODE_ENV || 'development'
  };
}

export function exibirDiagnostico(configuracao) {
  console.table({
    estudante: configuracao.nomeAluno,
    turma: configuracao.turma,
    projeto: 'api-produtos-sessao',
    armazenamento: 'Sessão em Memória (sem banco de dados)',
    ambiente: configuracao.ambiente,
    node: process.version,
    sistema: `${process.platform} ${process.arch}`,
    diretorio: process.cwd(),
    portaConfigurada: configuracao.porta
  });
}
