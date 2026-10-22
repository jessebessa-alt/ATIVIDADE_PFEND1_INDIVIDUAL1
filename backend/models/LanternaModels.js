
const lanternasIniciais = [
[
  {
    id: 1,
    nome: 'Wuben E7',
    preco: 189.90,
    link_original: 'https://amazon.com.br',
    link_da_revenda: 'https://www.olx.com.br',
    lumens: 1800,
    autonomia_mAh: 1100,
    protecao_ip: 'IP68',
    outros_atributos: { 
      valor_soma: 4, 
      topicos: [
        'Base magnética para fixação', 
        'Compatível com extensor para bateria 18650', 
        'Suporte opcional para lanterna de cabeça', 
        'Carregamento rápido via USB Tipo-C'
      ] 
    }
  },
  {
    id: 2,
    nome: 'Wuben G5',
    preco: 206.99,
    link_original: 'https://amazon.com.br',
    link_da_revenda: 'https://www.olx.com.br',
    lumens: 400,
    autonomia_mAh: 500,
    protecao_ip: 'IP68',
    outros_atributos: { 
      valor_soma: 4, 
      topicos: [
        'Cabeça rotativa articulada em 180 graus', 
        'Luz auxiliar RGB multicolorida (7 cores)', 
        'Controle de intensidade por botão rotativo (Dial)', 
        'Base magnética e clipe ajustável de bolso'
      ] 
    }
  }
]
];


export function garantirLanternasNaSessao(sessao) {
  if (!sessao.lanternas) {
    sessao.lanternas = JSON.parse(JSON.stringify(lanternasIniciais));
  }
}

export function criarLanternaModel() {
  async function listarTodas(sessao) {
    return sessao.lanternas || [];
  }

  async function buscarPorId(id, sessao) {
    const lanternas = await listarTodas(sessao);
    return lanternas.find((item) => item.id === id);
  }

  function processarAtributosExtras(dadosExtras) {
    let topicos = [];

    if (Array.isArray(dadosExtras?.topicos)) {
      topicos = dadosExtras.topicos.map(t => String(t).trim()).filter(t => t.length > 0);
    } 
    else if (typeof dadosExtras?.topicos === 'string') {
      topicos = dadosExtras.topicos.split(',').map(t => t.trim()).filter(t => t.length > 0);
    }
    else if (typeof dadosExtras?.descricao === 'string' && dadosExtras.descricao.trim() !== '') {
      topicos = [dadosExtras.descricao.trim()];
    }

    return {
      topicos: topicos,
      valor_soma: topicos.length 
    };
  }


  async function criar(dados, sessao) {
    if (!sessao.lanternas) sessao.lanternas = [];
    
    const novaId = sessao.lanternas.length > 0 
        ? Math.max(...sessao.lanternas.map(l => l.id)) + 1 
        : 1;

    const novaLanterna = {
      id: novaId,
      nome: dados.nome || 'Lanterna Sem Nome',
      preco: Number(dados.preco) || 0,
      link_original: dados.link_original || '',
      link_da_revenda: dados.link_da_revenda || '',
      lumens: Number(dados.lumens) || 0,
      autonomia_mAh: Number(dados.autonomia_mAh) || 0,
      protecao_ip: dados.protecao_ip || 'IPX0',
      imagem: dados.imagem || 'https://media.istockphoto.com/id/1422299726/pt/foto/illuminated-jack-o-lantern-glowing-on-black-background.jpg?s=612x612&w=0&k=20&c=tRPzLfMzxteGGiskNiNKUjtaQF1PyzSR9sSyajPUV1I=', // Imagem padrão caso venha vazia
      outros_atributos: processarAtributosExtras(dados.outros_atributos)
    };

    sessao.lanternas.push(novaLanterna);
    return novaLanterna;
  }

  async function atualizar(id, dados, sessao) {
    const index = sessao.lanternas.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const lanternaAtual = sessao.lanternas[index];

    const lanternaAtualizada = {
      ...lanternaAtual,
      ...dados,
      id,
      imagem: dados.imagem || lanternaAtual.imagem,
      outros_atributos: dados.outros_atributos 
        ? processarAtributosExtras(dados.outros_atributos) 
        : lanternaAtual.outros_atributos
    };

    sessao.lanternas[index] = lanternaAtualizada;
    return lanternaAtualizada;
  }

  async function atualizar(id, dados, sessao) {
    const index = sessao.lanternas.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const lanternaAtual = sessao.lanternas[index];

    const lanternaAtualizada = {
      ...lanternaAtual,
      ...dados,
      id, 
      outros_atributos: dados.outros_atributos 
        ? processarAtributosExtras(dados.outros_atributos) 
        : lanternaAtual.outros_atributos
    };

    sessao.lanternas[index] = lanternaAtualizada;
    return lanternaAtualizada;
  }

  async function remover(id, sessao) {
    const index = sessao.lanternas.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const [removido] = sessao.lanternas.splice(index, 1);
    return removido;
  }

  return { listarTodas, buscarPorId, criar, atualizar, remover };
}