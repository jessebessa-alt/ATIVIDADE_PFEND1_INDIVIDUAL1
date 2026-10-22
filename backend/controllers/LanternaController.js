
export function criarLanternaController({ lanternaService }) {
  
  async function listar(req, res, next) {
    try {
      const lanternas = await lanternaService.listar(req.session);
      res.status(200).json({ sucesso: true, dados: lanternas });
    } catch (erro) {
      next(erro);
    }
  }

  async function buscar(req, res, next) {
    try {
      const lanterna = await lanternaService.buscarPorId(req.params.id, req.session);
      if (!lanterna) {
        return res.status(404).json({ sucesso: false, erro: "A luz não foi encontrada." });
      }
      res.status(200).json({ sucesso: true, dados: lanterna });
    } catch (erro) {
      next(erro);
    }
  }

  async function criar(req, res) {
    try {
      const novaLanterna = await lanternaService.criar(req.body, req.session);
      res.status(201).json({
        sucesso: true,
        mensagem: 'Novo equipamento forjado com sucesso no arsenal!',
        dados: novaLanterna
      });
    } catch (erro) {
      res.status(400).json({ sucesso: false, erro: erro.message });
    }
  }

  async function atualizar(req, res, next) {
    try {
      const atualizada = await lanternaService.atualizar(req.params.id, req.body, req.session);
      res.status(200).json({
        sucesso: true,
        mensagem: 'Modificações aplicadas ao equipamento!',
        dados: atualizada
      });
    } catch (erro) {
      res.status(400).json({ sucesso: false, erro: erro.message });
    }
  }

  async function remover(req, res, next) {
    try {
      const removida = await lanternaService.remover(req.params.id, req.session);
      res.status(200).json({
        sucesso: true,
        mensagem: `A lanterna "${removida.nome}" foi exterminada do arsenal.`,
        dados: removida
      });
    } catch (erro) {
      res.status(400).json({ sucesso: false, erro: erro.message });
    }
  }

  async function resetar(req, res, next) {
    try {
     
      req.session.lanternas = null; 
      res.status(200).json({
        sucesso: true,
        mensagem: 'A escuridão consumiu o arsenal. Ele será reiniciado com os valores padrão.'
      });
    } catch (erro) {
      next(erro);
    }
  }


  async function duelar(req, res, next) {
    try {
      const { idA, idB } = req.body;
      
      if (!idA || !idB) {
         return res.status(400).json({ sucesso: false, erro: "Envie idA e idB para o confronto." });
      }

      const resultado = await lanternaService.duelar(idA, idB, req.session);
      
      res.status(200).json({
        sucesso: true,
        mensagem: 'O confronto mortal foi concluído.',
        dados: resultado
      });
    } catch (erro) {
      res.status(400).json({ sucesso: false, erro: erro.message });
    }
  }

  return {
    listar,
    buscar,
    criar,
    atualizar,
    remover,
    resetar,
    duelar // Exportando a função nova
  };
}