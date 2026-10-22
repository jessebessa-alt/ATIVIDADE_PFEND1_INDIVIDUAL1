import express from 'express';

export function criarLanternaRoutes({ lanternaController }) {
  const router = express.Router();

  router.get('/', lanternaController.listar);
  router.post('/resetar', lanternaController.resetar);
  router.get('/:id', lanternaController.buscar);
  router.post('/', lanternaController.criar);
  router.put('/:id', lanternaController.atualizar);
  router.delete('/:id', lanternaController.remover);

  router.post('/duelo', lanternaController.duelar);

  return router;
}