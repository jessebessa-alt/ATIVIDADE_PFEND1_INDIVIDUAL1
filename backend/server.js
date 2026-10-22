import { carregarAmbiente, exibirDiagnostico } from './config/ambiente.js';

const config = carregarAmbiente('.env');
exibirDiagnostico(config);

const { app } = await import('./app.js');
const porta = config.porta || 3001;

app.listen(porta, () => {
  console.log(`API Express (Sessão) rodando em http://localhost:${porta}`);
});