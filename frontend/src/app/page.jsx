'use client';

import { useEffect, useRef, useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import HalloweenSVG from '@/components/banner/HalloweenSVG'; 
import '@/components/banner/halowwen.css';

const LANTERNA_INICIAL= [

  {
    "id": 1,
    "nome": "Wuben E7",
    "preco": 189.90,
    "link_original": "https://amazon.com.br",
    "link_da_revenda": "https://seu-site-de-revenda.com.br",
    "lumens": 1800,
    "autonomia_mAh": 1100,
    "protecao_ip": "IP68",
    "imagem": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWZpNs9BDLoWmQ1g60N7K2dMANPXsIqL0dAIgFMpha2Q&s=10",
    "outros_atributos": {
      "valor_soma": 4,
      "topicos": [
        "Base magnética para fixação",
        "Compatível com extensor para bateria 18650",
        "Suporte opcional para lanterna de cabeça",
        "Carregamento rápido via USB Tipo-C"
      ]
    }
  }

,

  {
    "id": 2,
    "nome": "Wuben G5",
    "preco": 206.99,
    "link_original": "https://amazon.com.br",
    "link_da_revenda": "https://seu-site-de-revenda.com.br",
    "lumens": 400,
    "autonomia_mAh": 500,
    "protecao_ip": "IP68",
    "imagem": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZpBrlDrj-xtjmPtYwBuqma9cakNH-C32umYEawHQzMQ&s=10",
    "outros_atributos": {
      "valor_soma": 4,
      "topicos": [
        "Cabeça rotativa articulada em 180 graus",
        "Luz auxiliar RGB multicolorida (7 cores)",
        "Controle de intensidade por botão rotativo (Dial)",
        "Base magnética e clipe ajustável de bolso"
      ]
    }
  }

];

const FORM_VAZIO = {
  nome: '',
  preco: '',
  link_original: '',
  link_da_revenda: '',
  lumens: '',
  autonomia_mAh: '',
  protecao_ip: '',
  imagem: '',
  topicos: ''
};

export default function HomePage() {
  const containerRef = useRef(null);
  const darkLayerRef = useRef(null);

  const [lanternas, setLanternas] = useState(LANTERNA_INICIAL);
  const [lanternaDestaque, setLanternaDestaque] = useState(LANTERNA_INICIAL[0]);
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState(FORM_VAZIO);

  const [idLutadorA, setIdLutadorA] = useState(1);
  const [idLutadorB, setIdLutadorB] = useState(3);
  const [resultadoDuelo, setResultadoDuelo] = useState(null);

  useEffect(() => {
    if (darkLayerRef.current) {
      darkLayerRef.current.style.opacity = '1';
    }

    const handleMouseMove = (e) => {
      if (!containerRef.current || !darkLayerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      
      const clientX = e.type === "touchmove" && e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
      const clientY = e.type === "touchmove" && e.changedTouches ? e.changedTouches[0].clientY : e.clientY;

      const cursorX = clientX - rect.left;
      const cursorY = clientY - rect.top;

      darkLayerRef.current.style.background = `radial-gradient(
        circle at ${cursorX}px ${cursorY}px, 
        transparent 0, 
        rgba(0,0,0,0.3) 2vw, 
        rgba(0,0,0,0.5) 3vw, 
        rgba(0,0,0,0.7) 4vw, 
        rgba(0,0,0,0.85) 7vw, 
        rgba(0,0,0,0.95) 15vw 
      )`;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleMouseMove);
    };
  }, []);


  const abrirModalCriar = () => {
    setEditandoId(null);
    setForm(FORM_VAZIO);
    setModalAberto(true);
  };

  const abrirModalEditar = (lanterna) => {
    setEditandoId(lanterna.id);
    const listaTopicosTexto = lanterna.outros_atributos?.topicos 
      ? lanterna.outros_atributos.topicos.join(', ') 
      : '';

    setForm({
      nome: lanterna.nome,
      preco: lanterna.preco,
      link_original: lanterna.link_original,
      link_da_revenda: lanterna.link_da_revenda,
      lumens: lanterna.lumens,
      autonomia_mAh: lanterna.autonomia_mAh,
      protecao_ip: lanterna.protecao_ip,
      imagem: lanterna.imagem || '',
      topicos: listaTopicosTexto
    });
    setModalAberto(true);
  };

  const salvarLanterna = (e) => {
    e.preventDefault();

    const listaTopicosArray = form.topicos
      ? form.topicos.split(',').map((t) => t.trim()).filter((t) => t.length > 0)
      : [];

    const objetoLanterna = {
      id: editandoId ? editandoId : Date.now(),
      nome: form.nome || 'Luz Sem Nome',
      preco: Number(form.preco) || 0,
      link_original: form.link_original || '#',
      link_da_revenda: form.link_da_revenda || '#',
      lumens: Number(form.lumens) || 0,
      autonomia_mAh: Number(form.autonomia_mAh) || 0,
      protecao_ip: form.protecao_ip || 'IPX0',
      imagem: form.imagem || 'https://images.unsplash.com/photo-1542181961-9590d0c79dab?w=400',
      outros_atributos: {
        valor_soma: listaTopicosArray.length,
        topicos: listaTopicosArray
      }
    };

    if (editandoId) {
      const listaAtualizada = lanternas.map((item) => item.id === editandoId ? objetoLanterna : item);
      setLanternas(listaAtualizada);
      setLanternaDestaque(objetoLanterna);
    } else {
      setLanternas([...lanternas, objetoLanterna]);
      setLanternaDestaque(objetoLanterna);
    }

    setModalAberto(false);
  };

  const deletarLanterna = (id) => {
    const novaLista = lanternas.filter((item) => item.id !== id);
    setLanternas(novaLista);
    if (lanternaDestaque?.id === id) setLanternaDestaque(novaLista[0] || null);
    setModalAberto(false);
  };


  const executarDuelo = () => {
    const a = lanternas.find((item) => item.id === Number(idLutadorA));
    const b = lanternas.find((item) => item.id === Number(idLutadorB));

    if (!a || !b) return;

    let vitoriasA = 0;
    let vitoriasB = 0;
    const confrontos = [];

    if (a.lumens > b.lumens) {
      vitoriasA++;
      confrontos.push({ icone: ' bi-lightbulb-fill', categoria: 'Poder de Luz (Lumens)', valorA: `${a.lumens} lm`, valorB: `${b.lumens} lm`, vencedor: a.nome });
    } else if (b.lumens > a.lumens) {
      vitoriasB++;
      confrontos.push({ icone: ' bi-lightbulb-fill', categoria: 'Poder de Luz (Lumens)', valorA: `${a.lumens} lm`, valorB: `${b.lumens} lm`, vencedor: b.nome });
    } else {
      confrontos.push({ icone: ' bi-lightbulb-fill', categoria: 'Poder de Luz (Lumens)', valorA: `${a.lumens} lm`, valorB: `${b.lumens} lm`, vencedor: 'Empate' });
    }

    if (a.autonomia_mAh > b.autonomia_mAh) {
      vitoriasA++;
      confrontos.push({ icone: 'bi-battery-charging', categoria: 'Sobrevivência (mAh)', valorA: `${a.autonomia_mAh} mAh`, valorB: `${b.autonomia_mAh} mAh`, vencedor: a.nome });
    } else if (b.autonomia_mAh > a.autonomia_mAh) {
      vitoriasB++;
      confrontos.push({ icone: 'bi-battery-charging', categoria: 'Sobrevivência (mAh)', valorA: `${a.autonomia_mAh} mAh`, valorB: `${b.autonomia_mAh} mAh`, vencedor: b.nome });
    } else {
      confrontos.push({ icone: 'bi-battery-charging', categoria: 'Sobrevivência (mAh)', valorA: `${a.autonomia_mAh} mAh`, valorB: `${b.autonomia_mAh} mAh`, vencedor: 'Empate' });
    }

    const extraA = a.outros_atributos?.valor_soma || 0;
    const extraB = b.outros_atributos?.valor_soma || 0;

    if (extraA > extraB) {
      vitoriasA++;
      confrontos.push({ icone: 'bi-gear-fill', categoria: 'Recursos Extras (Tópicos)', valorA: `${extraA} itens`, valorB: `${extraB} itens`, vencedor: a.nome });
    } else if (extraB > extraA) {
      vitoriasB++;
      confrontos.push({ icone: 'bi-gear-fill', categoria: 'Recursos Extras (Tópicos)', valorA: `${extraA} itens`, valorB: `${extraB} itens`, vencedor: b.nome });
    } else {
      confrontos.push({ icone: 'bi-gear-fill', categoria: 'Recursos Extras (Tópicos)', valorA: `${extraA} itens`, valorB: `${extraB} itens`, vencedor: 'Empate' });
    }

    let campeao = 'Empate Mortal — Ambas sucumbiram na escuridão';
    if (vitoriasA > vitoriasB) campeao = `${a.nome} sobreviveu ao breu!`;
    if (vitoriasB > vitoriasA) campeao = `${b.nome} sobreviveu ao breu!`;

    setResultadoDuelo({
      nomeA: a.nome,
      nomeB: b.nome,
      vitoriasA,
      vitoriasB,
      campeao,
      confrontos
    });
  };

  const lutadorA = lanternas.find((item) => item.id === Number(idLutadorA));
  const lutadorB = lanternas.find((item) => item.id === Number(idLutadorB));

  return (
    <div className="page-wrapper">
      
      <div ref={containerRef} className="flashlight-container">
        <HalloweenSVG />
        <div ref={darkLayerRef} className="dark-layer"></div>
        <div className="titulo-container">
          <h1 className="texto-assombrado-1">FAÇA AMELHOR ESCOLHA CONTRA A ESCURIDÃO</h1>
          <p className="texto-assombrado-2">O melhor site para iluminar suas escolhas.</p>
        </div>
      </div>

      <div className="box-produto">
        <div className="descricao-produto">
          <div className="descricao-titulo">
            <h1>{lanternaDestaque ? lanternaDestaque.nome : 'Arsenal Vazio'}</h1>
          </div>
          <div className="descricao">
            {lanternaDestaque ? (
              <>
                <div style={{ width: '100%', height: '200px', marginBottom: '1rem', borderRadius: '8px', overflow: 'hidden', border: '1px solid #450a0a' }}>
                  <img 
                    src={lanternaDestaque.imagem} 
                    alt={lanternaDestaque.nome} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.1) grayscale(20%)' }} 
                  />
                </div>

                <p className="preco-destaque">R$ {Number(lanternaDestaque.preco).toFixed(2)}</p>
                <p>
                  <i className="bi  bi-lightbulb-fill" style={{ marginRight: '6px' }}></i>
                  <strong>Lumens:</strong> {lanternaDestaque.lumens} lm
                </p>
                <p>
                  <i className="bi bi-battery-charging" style={{ marginRight: '6px' }}></i>
                  <strong>Autonomia:</strong> {lanternaDestaque.autonomia_mAh} mAh
                </p>
                <p>
                  <i className="bi bi-shield-shaded" style={{ marginRight: '6px' }}></i>
                  <strong>Proteção:</strong> {lanternaDestaque.protecao_ip}
                </p>
                
                <p>
                  <i className="bi bi-gear-fill" style={{ marginRight: '6px' }}></i>
                  <strong>Atributos Extras ({lanternaDestaque.outros_atributos?.valor_soma} pts):</strong>
                </p>
                <ul style={{ margin: '0.3rem 0 1rem 1.2rem', padding: 0, color: '#9ca3af', listStyle: 'none' }}>
                  {lanternaDestaque.outros_atributos?.topicos?.map((t, idx) => (
                    <li key={idx}>
                      <i className="bi bi-caret-right-fill" style={{ color: '#dc2626', marginRight: '6px' }}></i>
                      {t}
                    </li>
                  ))}
                </ul>
                
                <div className="links-destaque">
                  <a href={lanternaDestaque.link_original} target="_blank" rel="noreferrer">
                    <i className="bi bi-box-arrow-up-right" style={{ marginRight: '6px' }}></i>Link Original
                  </a>
                  <a href={lanternaDestaque.link_da_revenda} target="_blank" rel="noreferrer">
                    <i className="bi bi-cart-fill" style={{ marginRight: '6px' }}></i>Link da Revenda
                  </a>
                </div>

                <div className="acoes-destaque">
                  <button onClick={() => abrirModalEditar(lanternaDestaque)} className="btn-acao-editar">
                    <i className="bi bi-pencil-square" style={{ marginRight: '6px' }}></i>Modificar
                  </button>
                  <button onClick={() => deletarLanterna(lanternaDestaque.id)} className="btn-acao-deletar">
                    <i className="bi bi-trash3-fill" style={{ marginRight: '6px' }}></i>Excluir
                  </button>
                </div>
              </>
            ) : (
              <p>Nenhuma lanterna selecionada.</p>
            )}

            <button onClick={abrirModalCriar} className="btn-forjar-nova">
              <i className="bi bi-plus-circle" style={{ marginRight: '6px' }}></i>ADICIONAR NOVA LANTERNA
            </button>
          </div>
        </div>
        <div className="lista-cards-produtos">
          {lanternas.map((item) => (
            <div 
              key={item.id} 
              className={`card-prduto ${lanternaDestaque?.id === item.id ? 'card-ativo' : ''}`}
              onClick={() => setLanternaDestaque(item)}
            >
              <div className="image-card-produto" style={{ padding: 0 }}>
                <img 
                  src={item.imagem} 
                  alt={item.nome} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.1) grayscale(20%)' }} 
                />
                <span className="badge-ip">
                  <i className="bi bi-shield-shaded" style={{ marginRight: '4px' }}></i>{item.protecao_ip}
                </span>
              </div>
              <div className="nome-card-produto">
                <h3>{item.nome}</h3>
                <p>
                  <i className="bi  bi-lightbulb-fill" style={{ marginRight: '4px' }}></i>{item.lumens} lm | {' '}
                  <i className="bi bi-battery-charging" style={{ marginRight: '4px' }}></i>{item.autonomia_mAh} mAh
                </p>
                <span className="preco-card">R$ {Number(item.preco).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="box-comparacao">
        <div className="titulo-container">
          <h1 className="texto-assombrado-1">COMPARAR LANTERNAS</h1>
          <p className="texto-assombrado-2">Compare os sinais de cada lanterna: quando a luz falha, cada recurso pode fazer a diferença.</p>
        </div>

        <div className="arena-selecao">
          <div className="card-produto">
            <label>Equipamento 1</label>
            <select value={idLutadorA} onChange={(e) => setIdLutadorA(e.target.value)}>
              {lanternas.map((l) => (<option key={l.id} value={l.id}>{l.nome}</option>))}
            </select>
            {lutadorA && (
              <div className="resumo-lutador">
                <img src={lutadorA.imagem} alt="" style={{ width: '100%',height: '150px', objectFit: 'cover', objectPosition: 'center', borderRadius: '4px', marginBottom: '8px' }} />
                <p><i className="bi  bi-lightbulb-fill" style={{ marginRight: '6px' }}></i>Lumens: <strong>{lutadorA.lumens}</strong></p>
                <p><i className="bi bi-battery-charging" style={{ marginRight: '6px' }}></i>Bateria: <strong>{lutadorA.autonomia_mAh} mAh</strong></p>
                <p><i className="bi bi-gear-fill" style={{ marginRight: '6px' }}></i>Extras: <strong>{lutadorA.outros_atributos?.valor_soma} pts</strong></p>
              </div>
            )}
          </div>

          <div className="versus-badge">VS</div>

          <div className="card-produto">
            <label>Equipamento 2</label>
            <select value={idLutadorB} onChange={(e) => setIdLutadorB(e.target.value)}>
              {lanternas.map((l) => (<option key={l.id} value={l.id}>{l.nome}</option>))}
            </select>
            {lutadorB && (
              <div className="resumo-lutador">
                <img src={lutadorB.imagem} alt="" style={{ width: '100%',height: '150px', objectFit: 'cover', objectPosition: 'center', borderRadius: '4px', marginBottom: '8px' }} />
                <p><i className="bi  bi-lightbulb-fill" style={{ marginRight: '6px' }}></i>Lumens: <strong>{lutadorB.lumens}</strong></p>
                <p><i className="bi bi-battery-charging" style={{ marginRight: '6px' }}></i>Bateria: <strong>{lutadorB.autonomia_mAh} mAh</strong></p>
                <p><i className="bi bi-gear-fill" style={{ marginRight: '6px' }}></i>Extras: <strong>{lutadorB.outros_atributos?.valor_soma} pts</strong></p>
              </div>
            )}
          </div>
        </div>

        <button className="btn-comparar" onClick={executarDuelo}>
          <i className="bi bi-lightning-charge-fill" style={{ marginRight: '8px' }}></i>Iniciar Confronto de Categorias
        </button>

        {resultadoDuelo && (
          <div className="relatorio-duelo">
            <h2>
              <i className="bi bi-trophy-fill" style={{ color: '#eab308', marginRight: '8px' }}></i>
              {resultadoDuelo.campeao}
            </h2>
            <p className="placar-duelo">
              Categorias Vencidas: <strong>{resultadoDuelo.nomeA} ({resultadoDuelo.vitoriasA})</strong> x <strong>({resultadoDuelo.vitoriasB}) {resultadoDuelo.nomeB}</strong>
            </p>
            <div className="tabela-confrontos">
              {resultadoDuelo.confrontos.map((c, index) => (
                <div key={index} className="linha-confronto">
                  <span><i className={`bi ${c.icone}`} style={{ marginRight: '6px' }}></i>{c.categoria}</span>
                  <span>{c.valorA} vs {c.valorB}</span>
                  <strong className="vencedor-cat">Venceu: {c.vencedor}</strong>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {modalAberto && (
        <div className="modal-box-produto">
          <div className="modal-descricao-produto">
            <div className="modal-descricao-titulo">
              <h1>
                <i className="bi bi-tools" style={{ marginRight: '8px' }}></i>
                {editandoId ? 'Modificar Equipamento' : 'Inserir Nova Lanterna'}
              </h1>
              <button className="btn-fechar-modal" onClick={() => setModalAberto(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            
            <div className="modal-descricao">
              <form onSubmit={salvarLanterna} className="form-crud-terror">
                <input 
                  placeholder="Nome da Lanterna" 
                  value={form.nome} 
                  onChange={(e) => setForm({ ...form, nome: e.target.value })} 
                />
                <input 
                  placeholder="Preço (ex: 34.90)" 
                  type="number" 
                  step="any" 
                  value={form.preco} 
                  onChange={(e) => setForm({ ...form, preco: e.target.value })} 
                />
                <input 
                  placeholder="Quantidade de Lumens (ex: 100)" 
                  type="number" 
                  value={form.lumens} 
                  onChange={(e) => setForm({ ...form, lumens: e.target.value })} 
                />
                <input 
                  placeholder="Autonomia em mAh (ex: 300)" 
                  type="number" 
                  value={form.autonomia_mAh} 
                  onChange={(e) => setForm({ ...form, autonomia_mAh: e.target.value })} 
                />
                <input 
                  placeholder="Proteção IP (ex: IPX4)" 
                  value={form.protecao_ip} 
                  onChange={(e) => setForm({ ...form, protecao_ip: e.target.value })} 
                />
                <input 
                  placeholder="URL da Imagem (Link da foto)" 
                  value={form.imagem} 
                  onChange={(e) => setForm({ ...form, imagem: e.target.value })} 
                />
                <input 
                  placeholder="Link Original (Amazon, etc)" 
                  value={form.link_original} 
                  onChange={(e) => setForm({ ...form, link_original: e.target.value })} 
                />
                <input 
                  placeholder="Link da Revenda" 
                  value={form.link_da_revenda} 
                  onChange={(e) => setForm({ ...form, link_da_revenda: e.target.value })} 
                />
                
                <textarea 
                  placeholder="Tópicos extras separados por vírgula (ex: Quebra-vidros, Estrobo, Zoom)" 
                  value={form.topicos} 
                  onChange={(e) => setForm({ ...form, topicos: e.target.value })} 
                  rows={3}
                />

                <div className="modal-botoes">
                  <button type="submit" className="btn-salvar-modal">
                    <i className="bi bi-check-lg" style={{ marginRight: '6px' }}></i>
                    {editandoId ? 'Salvar Alterações' : 'Cadastrar no Arsenal'}
                  </button>
                  <button type="button" onClick={() => setModalAberto(false)} className="btn-cancelar-modal">
                    <i className="bi bi-x-circle" style={{ marginRight: '6px' }}></i>
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}