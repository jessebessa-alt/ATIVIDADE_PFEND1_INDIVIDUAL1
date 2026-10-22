
import express from 'express';
import { criarMiddlewareSessao } from './config/sessao.js';

import {
  criarLanternaModel,
  garantirLanternasNaSessao
} from './models/LanternaModels.js';
import { criarLanternaService } from './services/LanternaService.js';
import { criarLanternaController } from './controllers/LanternaController.js';
import { criarLanternaRoutes } from './routes/LanternaRoutes.js';

export const app = express();

app.use(express.json());

const middlewareSessao = await criarMiddlewareSessao(
  process.env.SESSION_SECRET || 'segredo-sessao-terror-2026'
);
app.use(middlewareSessao);

app.use((req, _res, next) => {
  if (req.session) {
    garantirLanternasNaSessao(req.session);
  }
  next();
});


const lanternaModel = criarLanternaModel();
const lanternaService = criarLanternaService({ lanternaModel });
const lanternaController = criarLanternaController({ lanternaService });
const lanternaRoutes = criarLanternaRoutes({ lanternaController });

app.get('/api/check', (req, res) => {
  res.status(200).json({
    status: 'ok',
    mensagem: 'O Arsenal contra o Breu está ativo na sessão (sem banco de dados)!',
    sessaoId: req.sessionID || 'ativa',
    totalLanternasSessao: Array.isArray(req.session?.lanternas)
      ? req.session.lanternas.length
      : 0
  });
});


app.use('/api/lanternas', lanternaRoutes);

app.use((req, res) => {
  res.status(404).json({ erro: `O caminho das trevas ${req.method}${req.originalUrl} não leva a lugar nenhum (404).` });
});

app.use((erro, _req, res, _next) => {
  console.error('Erro Catastrófico no Arsenal: ', erro.message);
  res.status(500).json({ erro: 'Falha interna do servidor. A luz falhou.' });
});