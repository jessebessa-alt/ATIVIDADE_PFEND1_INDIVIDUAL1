
const lanternasIniciais = [
  {
    id: 1,
    nome: 'Farol do Expurgo Tático',
    preco: 189.90,
    link_original: 'https://amazon.com.br',
    link_da_revenda: 'https://seu-site-de-revenda.com.br',
    lumens: 1200,
    autonomia_mAh: 4000,
    protecao_ip: 'IP68',
    outros_atributos: { 
      valor_soma: 2, 
      topicos: ['Quebra-vidros reforçado', 'Modo estrobo cegante'] 
    }
  },
  {
    id: 2,
    nome: 'Chama Fantasma UV',
    preco: 89.50,
    link_original: 'https://amazon.com.br',
    link_da_revenda: 'https://seu-site-de-revenda.com.br',
    lumens: 600,
    autonomia_mAh: 5000,
    protecao_ip: 'IPX6',
    outros_atributos: { 
      valor_soma: 1, 
      topicos: ['Luz negra acoplada'] 
    }
  },
  {
    id: 3,
    nome: 'Lanterna Compacta Chaveiro',
    preco: 34.90,
    link_original: 'https://amazon.com.br',
    link_da_revenda: 'https://seu-site-de-revenda.com.br',
    lumens: 100,
    autonomia_mAh: 300,
    protecao_ip: 'IPX4',
    outros_atributos: { 
      valor_soma: 1, 
      topicos: ['Mosquetão incluso'] 
    }
  }
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