
export function criarLanternaService({ lanternaModel }) {
  
  async function listar(sessao) {
    return await lanternaModel.listarTodas(sessao);
  }

  async function criar(dados, sessao) {
    const dadosFormatados = {
        nome: dados.nome || 'Lanterna Desconhecida',
        preco: Number(dados.preco) || 0,
        link_original: dados.link_original || '',
        link_da_revenda: dados.link_da_revenda || '',
        lumens: Number(dados.lumens) || 0,
        autonomia_mAh: Number(dados.autonomia_mAh) || 0,
        protecao_ip: dados.protecao_ip || 'N/A',
        outros_atributos: {
            valor_soma: Number(dados.outros_atributos?.valor_soma) || 0,
            descricao: dados.outros_atributos?.descricao || ''
        }
    }
    return await lanternaModel.criar(dadosFormatados, sessao);
  }

  async function atualizar(idRecebido, dados, sessao) {
      const id = Number(idRecebido);
      const dadosFormatados = {
          nome: dados.nome,
          preco: Number(dados.preco) || 0,
          link_original: dados.link_original,
          link_da_revenda: dados.link_da_revenda,
          lumens: Number(dados.lumens) || 0,
          autonomia_mAh: Number(dados.autonomia_mAh) || 0,
          protecao_ip: dados.protecao_ip,
          outros_atributos: {
              valor_soma: Number(dados.outros_atributos?.valor_soma) || 0,
              descricao: dados.outros_atributos?.descricao
          }
      };
      
      const atualizado = await lanternaModel.atualizar(id, dadosFormatados, sessao);
      if(!atualizado) throw new Error("A lanterna pereceu na escuridão (Não encontrada).")
      return atualizado;
  }

  async function remover(idRecebido, sessao) {
      const removido = await lanternaModel.remover(Number(idRecebido), sessao);
      if(!removido) throw new Error("A lanterna pereceu na escuridão (Não encontrada).")
      return removido;
  }

  async function duelar(idA, idB, sessao) {
    const lanternaA = await lanternaModel.buscarPorId(Number(idA), sessao);
    const lanternaB = await lanternaModel.buscarPorId(Number(idB), sessao);

    if (!lanternaA || !lanternaB) {
      throw new Error("Uma das luzes já se apagou. Ambas as lanternas devem existir no arsenal.");
    }

    let pontosA = 0;
    let pontosB = 0;
    const relatorio = [];

    if (lanternaA.lumens > lanternaB.lumens) {
      pontosA++;
      relatorio.push(` Lumens: ${lanternaA.nome} rasga as trevas com ${lanternaA.lumens}lm (vs ${lanternaB.lumens}lm).`);
    } else if (lanternaB.lumens > lanternaA.lumens) {
      pontosB++;
      relatorio.push(` Lumens: ${lanternaB.nome} rasga as trevas com ${lanternaB.lumens}lm (vs ${lanternaA.lumens}lm).`);
    } else {
      relatorio.push(` Lumens: Empate cego (${lanternaA.lumens}lm).`);
    }

    if (lanternaA.autonomia_mAh > lanternaB.autonomia_mAh) {
      pontosA++;
      relatorio.push(` Sobrevivência (mAh): ${lanternaA.nome} resiste mais tempo com ${lanternaA.autonomia_mAh}mAh.`);
    } else if (lanternaB.autonomia_mAh > lanternaA.autonomia_mAh) {
      pontosB++;
      relatorio.push(` Sobrevivência (mAh): ${lanternaB.nome} resiste mais tempo com ${lanternaB.autonomia_mAh}mAh.`);
    } else {
      relatorio.push(` Sobrevivência (mAh): Ambas morrem juntas (${lanternaA.autonomia_mAh}mAh).`);
    }

    const extraA = lanternaA.outros_atributos.valor_soma || 0;
    const extraB = lanternaB.outros_atributos.valor_soma || 0;
    if (extraA > extraB) {
      pontosA++;
      relatorio.push(` Equipamento (Extras): ${lanternaA.nome} possui mais ferramentas (${extraA} vs ${extraB}).`);
    } else if (extraB > extraA) {
      pontosB++;
      relatorio.push(` Equipamento (Extras): ${lanternaB.nome} possui mais ferramentas (${extraB} vs ${extraA}).`);
    } else {
      relatorio.push(` Equipamento (Extras): Empate tático (${extraA}).`);
    }

    let vencedor = "Ocorreu um Empate Sangrento.";
    if (pontosA > pontosB) vencedor = lanternaA.nome;
    if (pontosB > pontosA) vencedor = lanternaB.nome;

    return {
      combatentes: [lanternaA.nome, lanternaB.nome],
      placar: { [lanternaA.nome]: pontosA, [lanternaB.nome]: pontosB },
      vencedor,
      relatorioDaBatalha: relatorio
    };
  }

  return { listar, criar, atualizar, remover, duelar };
}