import { randomUUID } from 'node:crypto';

const NOME_COOKIE = 'produtos.sid';

function lerCookies(cabecalhoCookie = '') {
  const cookies = {};
  if (!cabecalhoCookie) return cookies;
  for (const parte of cabecalhoCookie.split(';')) {
    const [chave, ...resto] = parte.trim().split('=');
    if (chave) {
      cookies[chave.trim()] = decodeURIComponent(resto.join('=') || '');
    }
  }
  return cookies;
}

function criarSessaoNativaEmMemoria() {
  const armazemSessoes = new Map();

  return function middlewareSessaoNativa(req, res, next) {
    const cookies = lerCookies(req.headers.cookie);
    let sessionId = cookies[NOME_COOKIE];

    if (!sessionId || !armazemSessoes.has(sessionId)) {
      sessionId = randomUUID();
      armazemSessoes.set(sessionId, {
        criadoEm: new Date().toISOString()
      });
      res.setHeader(
        'Set-Cookie',
        `${NOME_COOKIE}=${encodeURIComponent(sessionId)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`
      );
    }

    const dadosSessao = armazemSessoes.get(sessionId);
    req.sessionID = sessionId;
    req.session = dadosSessao;
    req.session.regenerar = () => {
      armazemSessoes.set(sessionId, { criadoEm: new Date().toISOString() });
      req.session = armazemSessoes.get(sessionId);
    };

    next();
  };
}

export async function criarMiddlewareSessao(segredo = 'segredo-sessao-produtos-2026') {
  try {
    const modulo = await import('express-session');
    const session = modulo.default || modulo;
    return session({
      name: NOME_COOKIE,
      secret: segredo,
      resave: false,
      saveUninitialized: true,
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24
      }
    });
  } catch {
    return criarSessaoNativaEmMemoria();
  }
}
