/* ============================================================
   TEMAS TRABALHISTAS EM FOCO — App Logic
   - Editable content (admin mode via ?admin=1)
   - PDF preview modal with download protection
   - LocalStorage persistence
   ============================================================ */

const STORAGE_KEY = 'ttf-content-v1';

// ---------- DEFAULT CONTENT (edit-friendly) ----------
const DEFAULT_CONTENT = {
  brand: {
    name: 'Temas Trabalhistas',
    tag: 'em foco',
    logo: 'assets/logo.png',
    instagram: '@temas_trabalhistas_em_foco',
    instagramUrl: 'https://instagram.com/temas_trabalhistas_em_foco'
  },
  hero: {
    eyebrow: 'Material premium • Lançamento',
    titleLine1: 'Não é só um',
    titleLine2: 'PDF.',
    titleLine3: 'É engenharia',
    titleLine4: 'do aprendizado.',
    sub: 'Mapas mentais interativos, jurisprudência filtrada do TST e conteúdo desenhado para fixar de verdade — feito por quem entende o árduo caminho dos estudos.',
    primaryCta: 'Quero o combo completo',
    primaryCtaLink: 'https://chk.eduzz.com/40QRQ25P9B',
    secondaryCta: 'Ver materiais',
    stats: [
      { num: '1.034+', label: 'Mapas mentais' },
      { num: '208', label: 'Precedentes TST' },
      { num: '7', label: 'Materiais' },
      { num: 'R$ 49,90', label: 'Acesso anual' }
    ]
  },
  pain: {
    eyebrow: 'Ponto de partida',
    title: 'O Direito do Trabalho afeta mais de 100 milhões de brasileiros.',
    sub: 'Realidades diferentes, mas o mesmo problema: detalhes complexos e inacessíveis para quem mais precisa.',
    cards: [
      {
        ico: '01',
        title: 'Estudante e concurseiro',
        desc: 'Lê três vezes, se perde no volume e não retém. Apostilas imensas e textos densos não funcionam para todo mundo.'
      },
      {
        ico: '02',
        title: 'Advogado',
        desc: 'Não tem tempo de garimpar jurisprudência em acórdãos de várias páginas. Precisa estar à frente dos Tribunais.'
      },
      {
        ico: '03',
        title: 'Trabalhador e gestor',
        desc: 'Um suspeita que está sendo lesado. O outro acumula riscos trabalhistas sem perceber.'
      }
    ]
  },
  features: {
    eyebrow: 'Tecnologia visual',
    title: 'Engenharia e design para o seu aprendizado.',
    sub: 'Não é PDF estático. É conteúdo construído para o cérebro reter.',
    items: [
      {
        num: '01',
        title: 'Design estratégico',
        desc: 'Mapas mentais e esquemas visuais montados com cores que estimulam a memória e o foco cirúrgico.'
      },
      {
        num: '02',
        title: '100% interativo',
        desc: 'Textos e elementos vetoriais. Selecione, copie e faça suas anotações com qualidade visual infinita.'
      },
      {
        num: '03',
        title: 'Navegação fluida',
        desc: 'Índices ancorados inteligentes para você ir direto ao ponto da matéria sem perder um segundo sequer.'
      }
    ]
  },
  combo: {
    ribbon: 'Melhor escolha',
    eyebrow: 'Oferta de lançamento',
    title: 'Combo Completo',
    titleHi: 'Acesso anual',
    desc: 'Todos os materiais em um só acesso, com atualizações dos Informativos TST por 1 ano inteiro.',
    bullets: [
      'Acesso a Precedentes e Informativos TST',
      'Curso em Mapas da Sentença Trabalhista',
      'Direito Material, Processual e Público',
      '1 ano de atualizações garantidas',
      'Novos materiais incorporados no período'
    ],
    launch: 'Oferta de lançamento',
    strike: 'De R$ 199,90 por',
    price: '49,90',
    period: 'Acesso anual • pagamento único',
    cta: 'Assinar agora',
    ctaLink: 'https://chk.eduzz.com/40QRQ25P9B',
    foot: 'Pagamento seguro via Eduzz • Garantia de 7 dias'
  },
  materials: {
    eyebrow: 'Materiais individuais',
    title: 'Ou escolha um material por vez.',
    sub: 'Conteúdo direto ao ponto. Toque em qualquer miniatura para ver a prévia.',
    items: [
      {
        id: 'precedentes',
        color: 'red',
        num: 'Material 01',
        name: 'Precedentes Vinculantes do TST',
        badge: '208 temas mapeados',
        desc: 'Teses firmadas e em vigor — sem precedentes suspensos. Mapas mentais para concurso e prática advocatícia.',
        price: '19,90',
        priceNote: 'pagamento único',
        cover: 'assets/mat_precedentes.png',
        previewPages: ['assets/mat_precedentes.png', 'assets/mat_precedentes.png', 'assets/mat_precedentes.png'],
        buyLink: 'https://chk.eduzz.com/Q9N2VPX101'
      },
      {
        id: 'informativos',
        color: 'cyan',
        num: 'Material 02',
        name: 'Informativos TST 2024+',
        badge: 'Atualização garantida 1 ano',
        desc: 'Decisões mais recentes e impactantes traduzidas em mapas mentais e e-books de absorção rápida.',
        price: '29,90',
        priceNote: 'acesso anual',
        cover: 'assets/mat_informativos.png',
        previewPages: ['assets/mat_informativos.png', 'assets/mat_informativos.png', 'assets/mat_informativos.png'],
        buyLink: 'https://chk.eduzz.com/69K158YEWO'
      },
      {
        id: 'sentenca',
        color: 'pink',
        num: 'Material 03',
        name: 'Sentença Trabalhista na Prática',
        badge: 'CNU Magistratura do Trabalho',
        desc: 'Resolução mapeada da prova do II CNU. Base sólida para servidores e assistentes dos Tribunais.',
        price: '19,90',
        priceNote: 'pagamento único',
        cover: 'assets/mat_sentenca.png',
        previewPages: ['assets/mat_sentenca.png', 'assets/mat_sentenca_alt.png', 'assets/mat_sentenca_alt2.png'],
        buyLink: 'https://chk.eduzz.com/39VKO8PBWR'
      },
      {
        id: 'trabalho',
        color: 'lime',
        num: 'Material 04',
        name: 'Direito do Trabalho Mapeado',
        badge: '333 mapas mentais',
        desc: 'Doutrina, legislação e jurisprudência integradas. O coração da sua aprovação dominado de forma visual.',
        price: '19,90',
        priceNote: 'pagamento único',
        cover: 'assets/mat_dir_trabalho.png',
        previewPages: ['assets/mat_dir_trabalho.png', 'assets/mat_dir_trabalho_alt.png', 'assets/mat_dir_trabalho.png'],
        buyLink: 'https://chk.eduzz.com/7WXG61ND0A'
      },
      {
        id: 'processo',
        color: 'orange',
        num: 'Material 05',
        name: 'Processo Trabalhista',
        badge: '253 mapas mentais',
        desc: 'Curso completo com doutrina, legislação e compilado de jurisprudência. Estudo otimizado para todos os públicos.',
        price: '19,90',
        priceNote: 'pagamento único',
        cover: 'assets/mat_proc_trabalho.png',
        previewPages: ['assets/mat_proc_trabalho.png', 'assets/mat_proc_trabalho_alt.png', 'assets/mat_proc_trabalho.png'],
        buyLink: 'https://chk.eduzz.com/E05NO8KK9X'
      },
      {
        id: 'constitucional',
        color: 'purple',
        num: 'Material 06',
        name: 'Resumo - Direito Constitucional Mapeado',
        badge: '120 mapas mentais',
        desc: 'As bases do direito público esquematizadas. Essencial para concursos trabalhistas, federais, estaduais e MP.',
        price: '19,90',
        priceNote: 'pagamento único',
        cover: 'assets/mat_constitucional.png',
        previewPages: ['assets/mat_constitucional.png', 'assets/mat_constitucional_alt.png', 'assets/mat_constitucional.png'],
        buyLink: 'https://chk.eduzz.com/VWGNPE4X07'
      },
      {
        id: 'administrativo',
        color: 'green',
        num: 'Material 07',
        name: 'Resumo - Direito Administrativo Mapeado',
        badge: '121 mapas mentais',
        desc: 'Conteúdo esquematizado visualmente para dominar uma das disciplinas mais exigidas dos concursos jurídicos.',
        price: '19,90',
        priceNote: 'pagamento único',
        cover: 'assets/mat_administrativo.png',
        previewPages: ['assets/mat_administrativo.png', 'assets/mat_administrativo_alt.png', 'assets/mat_administrativo.png'],
        buyLink: 'https://chk.eduzz.com/G92K5834WE'
      }
    ]
  },
  audiences: {
    eyebrow: 'Para quem é',
    title: 'Construído por quem viveu a mesma jornada.',
    sub: 'Anos conciliando trabalho, família e estudos nas horas vagas e nas madrugada. O diagnóstico de TDAH na vida adulta explicou tudo: textos densos não funcionavam. Daí surgiu a ideia de um "Direito desenhado".',
    items: [
      {
        glyph: '· Para o estudante',
        title: 'Concurseiro & estudante',
        desc: 'Magistratura, MPT, TRTs, Procuradorias e várias carreiras cobram profundidade real.',
        bullets: ['Cérebro retém mais informação visual e hierárquica', 'Mapas desenhados para fixar, não só para ler', 'Aprendizado leve, denso e esquematizado']
      },
      {
        glyph: '· Para o profissional',
        title: 'Advogado & operador',
        desc: 'Os Tribunais nunca param: novos informativos, IRRs e teses fixadas toda semana.',
        bullets: ['Educação continuada de alto nível', 'Casos emblemáticos transformados em teses', 'Atualização tática que blinda suas petições']
      },
      {
        glyph: '· Para o cidadão',
        title: 'Trabalhador & gestor',
        desc: 'Direito Trabalhista não é só coisa de advogado. É de quem trabalha, contrata e gerencia.',
        bullets: ['Suspeita de horas extras? Aprenda a calcular', 'RH equilibrando legislação e custo', 'Linguagem jurídica simplificada']
      }
    ]
  },
  promise: {
    eyebrow: 'Uma promessa honesta',
    quote: '"',
    title: 'Não prometo que você vai passar amanhã.',
    titleHi: 'Prometo conteúdo objetivo, visual e atualizado.',
    desc: 'Um aprendizado completo, mais leve, rápido e prático. <strong>O problema da retenção raramente é você. Quase sempre é o formato.</strong> Aqui o formato foi reconstruído.'
  },
  faq: {
    eyebrow: 'Dúvidas frequentes',
    title: 'Tudo que você precisa saber.',
    items: [
      {
        q: 'Como funciona o acesso?',
        a: 'Após a compra você recebe acesso imediato à plataforma por e-mail. Os PDFs são interativos, com índice ancorado e elementos vetoriais — você pode estudar no celular, tablet ou computador.'
      },
      {
        q: 'Posso baixar os PDFs?',
        a: 'O acesso aos materiais completos é pessoal e intransferível. Os arquivos ficam disponíveis na sua conta para você consultar sempre que precisar. A prévia gratuita aqui no site mostra o estilo do material antes de você comprar.'
      },
      {
        q: 'O que está incluído na atualização anual?',
        a: 'Os Informativos TST publicados durante 1 ano após a compra. Novos precedentes vinculantes mapeados. Novos materiais incorporados ao Combo Completo durante o período de assinatura.'
      },
      {
        q: 'Serve para a OAB?',
        a: 'Sim. O conteúdo cobre Direito do Trabalho, Processual do Trabalho, Constitucional e Administrativo — disciplinas centrais da prova. O foco em mapas mentais é especialmente eficaz para a 1ª fase.'
      },
      {
        q: 'E se eu não gostar?',
        a: 'Garantia de 7 dias. Se o conteúdo não for o que você esperava, basta solicitar o reembolso integral no período pelo Eduzz.'
      },
      {
        q: 'Posso comprar materiais avulsos?',
        a: 'Sim. Cada material está disponível individualmente por R$ 19,90 (à exceção dos Informativos TST, R$ 29,90 com 1 ano de atualizações). O Combo Completo, porém, sai por menos que comprar dois materiais separados.'
      }
    ]
  },
  ctaFinal: {
    eyebrow: 'A hora é agora',
    title: 'Estude. Trabalhe. Tenha direitos. <span class="red">Tudo mais fácil.</span>',
    sub: 'Conteúdo gratuito todo dia no Instagram. Material premium para quem quer ir fundo.',
    button: 'Começar pelo combo — R$ 49,90',
    buttonLink: 'https://chk.eduzz.com/40QRQ25P9B'
  }
};

// ---------- Storage helpers ----------
function loadContent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return JSON.parse(JSON.stringify(DEFAULT_CONTENT));
    const parsed = JSON.parse(raw);
    return deepMerge(JSON.parse(JSON.stringify(DEFAULT_CONTENT)), parsed);
  } catch (e) {
    console.warn('Could not load saved content:', e);
    return JSON.parse(JSON.stringify(DEFAULT_CONTENT));
  }
}
function saveContent(content) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(content)); }
  catch (e) { console.warn('Save failed:', e); alert('Não foi possível salvar (talvez o armazenamento esteja cheio).'); }
}
function deepMerge(target, source) {
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      target[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

// ---------- State ----------
let CONTENT = loadContent();
const isAdmin = new URLSearchParams(location.search).has('admin');
let preview = { open: false, material: null, page: 0 };

// ---------- Render helpers ----------
function el(tag, attrs = {}, children = []) {
  const e = document.createElement(tag);
  for (const k in attrs) {
    if (k === 'class') e.className = attrs[k];
    else if (k === 'html') e.innerHTML = attrs[k];
    else if (k === 'on') for (const ev in attrs.on) e.addEventListener(ev, attrs.on[ev]);
    else if (k === 'data') for (const dk in attrs.data) e.dataset[dk] = attrs.data[dk];
    else if (k.startsWith('aria-') || k === 'role') e.setAttribute(k, attrs[k]);
    else e[k] = attrs[k];
  }
  for (const c of [].concat(children)) {
    if (c == null || c === false) continue;
    e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  }
  return e;
}

// makes a bound editable text/HTML cell
function ed(path, opts = {}) {
  const tag = opts.tag || 'span';
  const html = getPath(CONTENT, path);
  const node = el(tag, {
    class: opts.class || '',
    html: html ?? ''
  });
  node.dataset.edit = path;
  if (opts.multiline) node.dataset.multiline = '1';
  if (opts.style) node.setAttribute('style', opts.style);
  return node;
}
function getPath(obj, p) {
  return p.split('.').reduce((o, k) => {
    if (o == null) return null;
    if (/^\d+$/.test(k)) return o[parseInt(k, 10)];
    return o[k];
  }, obj);
}
function setPath(obj, p, val) {
  const keys = p.split('.');
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    if (/^\d+$/.test(k)) {
      const idx = parseInt(k, 10);
      cur[idx] = cur[idx] || {};
      cur = cur[idx];
    } else {
      cur[k] = cur[k] || {};
      cur = cur[k];
    }
  }
  const last = keys[keys.length - 1];
  if (/^\d+$/.test(last)) cur[parseInt(last, 10)] = val;
  else cur[last] = val;
}

// ---------- RENDER PAGE ----------
function renderApp() {
  const root = document.getElementById('app');
  root.innerHTML = '';
  root.appendChild(buildTopbar());
  root.appendChild(buildHero());
  root.appendChild(buildPain());
  root.appendChild(buildFeatures());
  root.appendChild(buildCombo());
  root.appendChild(buildMaterials());
  root.appendChild(buildAudiences());
  root.appendChild(buildPromise());
  root.appendChild(buildFAQ());
  root.appendChild(buildCTAFinal());
  root.appendChild(buildFooter());

  // Modal lives outside main flow
  const oldModal = document.getElementById('modal');
  if (oldModal) oldModal.remove();
  document.body.appendChild(buildModal());

  if (isAdmin) {
    document.body.classList.add('admin');
    wireEditing();
  }
  attachLinkBlocks();
}

// TOPBAR
function buildTopbar() {
  const node = el('div', { class: 'topbar' }, [
    el('div', { class: 'topbar-inner' }, [
      el('a', { class: 'brand', href: '#top' }, [
        el('img', { src: CONTENT.brand.logo, alt: 'Logo', 'data-edit-img': 'brand.logo', style: 'width: 150px; height: 150px; object-fit: cover' }),
        el('div', { class: 'brand-name' }, [
          (() => {
            const span = ed('brand.name', { style: 'font-size: 20px' });
            const small = ed('brand.tag', { tag: 'small', style: 'font-size: 20px' });
            const wrap = el('div');
            wrap.appendChild(span);
            wrap.appendChild(small);
            return wrap;
          })()
        ])
      ]),
      (() => {
        const a = el('a', { class: 'top-cta', href: CONTENT.combo.ctaLink }, [
          ed('hero.primaryCta', { style: 'font-size: 20px' })
        ]);
        return a;
      })()
    ])
  ]);
  return node;
}

// HERO
function buildHero() {
  const sec = el('section', { class: 'hero', id: 'top' });
  const w = el('div', { class: 'wrap' }, [
    el('div', { class: 'hero-tag' }, [ ed('hero.eyebrow', { style: 'font-size: 20px' }) ]),
    el('h1', { class: 'rise' }, [
      ed('hero.titleLine1'), ' ',
      el('span', { class: 'red glow' }, [ ed('hero.titleLine2') ]),
      el('br'), ed('hero.titleLine3'), ' ',
      el('em', { class: 'cyan' }, [ ed('hero.titleLine4') ])
    ]),
    el('p', { class: 'hero-sub rise d1' }, [ ed('hero.sub', { multiline: true }) ]),
    el('div', { class: 'hero-actions rise d2' }, [
      el('a', { class: 'btn btn-primary', href: CONTENT.hero.primaryCtaLink }, [
        ed('hero.primaryCta'), ' →'
      ]),
      el('a', { class: 'btn btn-ghost', href: '#materiais' }, [
        ed('hero.secondaryCta')
      ])
    ]),
    buildHeroStats()
  ]);
  sec.appendChild(w);
  return sec;
}
function buildHeroStats() {
  const wrap = el('div', { class: 'hero-stats rise d3' });
  CONTENT.hero.stats.forEach((s, i) => {
    const colorClasses = ['', 'r', 'g', 'l'];
    wrap.appendChild(el('div', { class: 'stat' }, [
      el('div', { class: 'stat-num ' + colorClasses[i % 4] }, [ ed(`hero.stats.${i}.num`) ]),
      el('div', { class: 'stat-lbl' }, [ ed(`hero.stats.${i}.label`) ])
    ]));
  });
  return wrap;
}

// PAIN
function buildPain() {
  const sec = el('section', { class: 'manifesto' });
  const w = el('div', { class: 'wrap' }, [
    el('div', { class: 'sec-eyebrow r' }, [ ed('pain.eyebrow', { style: 'font-size: 20px' }) ]),
    el('h2', { class: 'sec-h' }, [ ed('pain.title') ]),
    el('p', { class: 'sec-sub' }, [ ed('pain.sub', { multiline: true }) ]),
    (() => {
      const grid = el('div', { class: 'pain-grid' });
      CONTENT.pain.cards.forEach((c, i) => {
        grid.appendChild(el('div', { class: 'pain-card' }, [
          el('div', { class: 'ico' }, [ ed(`pain.cards.${i}.ico`) ]),
          el('h3', {}, [ ed(`pain.cards.${i}.title`) ]),
          el('p', {}, [ ed(`pain.cards.${i}.desc`, { multiline: true }) ])
        ]));
      });
      return grid;
    })()
  ]);
  sec.appendChild(w);
  return sec;
}

// FEATURES
function buildFeatures() {
  const sec = el('section');
  const w = el('div', { class: 'wrap' }, [
    el('div', { class: 'sec-eyebrow' }, [ ed('features.eyebrow', { style: 'font-size: 20px' }) ]),
    el('h2', { class: 'sec-h' }, [ ed('features.title') ]),
    el('p', { class: 'sec-sub' }, [ ed('features.sub') ]),
    (() => {
      const grid = el('div', { class: 'feat-grid' });
      CONTENT.features.items.forEach((f, i) => {
        grid.appendChild(el('div', { class: 'feat f' + (i + 1) }, [
          el('div', { class: 'num' }, [ ed(`features.items.${i}.num`, { style: 'font-size: 20px' }) ]),
          el('h4', {}, [ ed(`features.items.${i}.title`) ]),
          el('p', {}, [ ed(`features.items.${i}.desc`, { multiline: true }) ])
        ]));
      });
      return grid;
    })()
  ]);
  sec.appendChild(w);
  return sec;
}

// COMBO
function buildCombo() {
  const sec = el('section', { class: 'combo-section', id: 'combo' });
  const w = el('div', { class: 'wrap' }, [
    el('div', { class: 'combo-card' }, [
      el('div', { class: 'combo-ribbon' }, [ ed('combo.ribbon', { style: 'font-size: 15px' }) ]),
      el('div', { class: 'combo-left' }, [
        el('div', { class: 'combo-eyebrow' }, [ ed('combo.eyebrow', { style: 'font-size: 20px' }) ]),
        el('h2', { class: 'combo-h' }, [
          ed('combo.title'),
          el('br'),
          el('span', { class: 'red' }, [ ed('combo.titleHi') ])
        ]),
        el('p', { class: 'combo-desc' }, [ ed('combo.desc', { multiline: true }) ]),
        (() => {
          const ul = el('ul', { class: 'combo-bullets' });
          CONTENT.combo.bullets.forEach((b, i) => {
            ul.appendChild(el('li', {}, [ ed(`combo.bullets.${i}`) ]));
          });
          return ul;
        })()
      ]),
      el('div', { class: 'combo-right' }, [
        el('div', { class: 'combo-launch' }, [ ed('combo.launch') ]),
        el('div', { class: 'combo-strike' }, [ ed('combo.strike') ]),
        el('div', { class: 'combo-price' }, [
          el('sup', {}, ['R$']),
          ed('combo.price')
        ]),
        el('div', { class: 'combo-period' }, [ ed('combo.period') ]),
        el('a', { class: 'btn btn-primary', href: CONTENT.combo.ctaLink }, [
          ed('combo.cta'), ' →'
        ]),
        el('div', { class: 'combo-foot' }, [ ed('combo.foot') ])
      ])
    ])
  ]);
  sec.appendChild(w);
  return sec;
}

// MATERIALS
function buildMaterials() {
  const sec = el('section', { id: 'materiais' });
  const w = el('div', { class: 'wrap' }, [
    el('div', { class: 'sec-eyebrow l' }, [ ed('materials.eyebrow', { style: 'font-size: 20px' }) ]),
    el('h2', { class: 'sec-h' }, [ ed('materials.title') ]),
    el('p', { class: 'sec-sub' }, [ ed('materials.sub') ]),
    (() => {
      const grid = el('div', { class: 'mat-grid' });
      CONTENT.materials.items.forEach((m, i) => {
        const card = el('div', { class: 'mat-card ' + m.color, data: { idx: i } }, [
          el('div', { class: 'accent-bar' }),
          el('div', { class: 'mat-thumb', data: { idx: i }, on: {
            click: () => openPreview(i)
          }}, [
            el('img', { src: m.cover, alt: m.name, 'data-edit-img': `materials.items.${i}.cover`, draggable: false }),
            el('div', { class: 'mat-thumb-glow' }),
            el('div', { class: 'mat-thumb-overlay' }, [
              el('span', {}, ['Ver prévia'])
            ])
          ]),
          el('div', { class: 'mat-num' }, [ ed(`materials.items.${i}.num`) ]),
          el('h3', { class: 'mat-name' }, [ ed(`materials.items.${i}.name`) ]),
          el('span', { class: 'mat-badge' }, [ ed(`materials.items.${i}.badge`) ]),
          el('p', { class: 'mat-desc' }, [ ed(`materials.items.${i}.desc`, { multiline: true }) ]),
          el('div', { class: 'mat-foot' }, [
            el('div', { class: 'mat-price' }, [
              el('span', {}, ['R$ ']),
              ed(`materials.items.${i}.price`),
              el('small', {}, [ ed(`materials.items.${i}.priceNote`) ])
            ]),
            el('div', { class: 'mat-actions' }, [
              el('button', { class: 'mat-btn mat-btn-preview', on: {
                click: (e) => { e.stopPropagation(); openPreview(i); }
              } }, ['Prévia']),
              el('a', { class: 'mat-btn mat-btn-buy', href: m.buyLink }, [ 'Comprar' ])
            ]),
            // Botão de gestão de PDF — visível apenas no modo admin
            (() => {
              if (!isAdmin) return null;
              const hasPdf = !!m.previewPdf;
              const label = hasPdf
                ? `PDF: ${m.previewPdf.split('/').pop()} (máx ${m.previewMaxPages || 20}p)`
                : 'Vincular PDF de prévia';
              const btn = el('button', {
                class: 'mat-btn admin-pdf-btn',
                data: { pdfIdx: i }
              }, [label]);
              if (hasPdf) {
                btn.style.borderColor = 'var(--green)';
                btn.style.color = 'var(--green)';
              }
              return btn;
            })()
          ])
        ]);
        grid.appendChild(card);
      });
      return grid;
    })()
  ]);
  sec.appendChild(w);
  return sec;
}

// AUDIENCES
function buildAudiences() {
  const sec = el('section');
  const w = el('div', { class: 'wrap' }, [
    el('div', { class: 'sec-eyebrow p' }, [ ed('audiences.eyebrow', { style: 'font-size: 20px' }) ]),
    el('h2', { class: 'sec-h' }, [ ed('audiences.title') ]),
    el('p', { class: 'sec-sub' }, [ ed('audiences.sub', { multiline: true, style: 'font-size: 20px' }) ]),
    (() => {
      const grid = el('div', { class: 'aud-grid' });
      CONTENT.audiences.items.forEach((a, i) => {
        const node = el('div', { class: 'aud a' + (i + 1) }, [
          el('div', { class: 'glyph' }, [ ed(`audiences.items.${i}.glyph`, { style: 'font-size: 20px' }) ]),
          el('h4', {}, [ ed(`audiences.items.${i}.title`) ]),
          el('p', {}, [ ed(`audiences.items.${i}.desc`, { multiline: true }) ]),
          (() => {
            const ul = el('ul');
            a.bullets.forEach((b, j) => ul.appendChild(el('li', {}, [ ed(`audiences.items.${i}.bullets.${j}`) ])));
            return ul;
          })()
        ]);
        grid.appendChild(node);
      });
      return grid;
    })()
  ]);
  sec.appendChild(w);
  return sec;
}

// PROMISE
function buildPromise() {
  const sec = el('section', { class: 'promise' });
  const w = el('div', { class: 'wrap' }, [
    el('div', { class: 'promise-card' }, [
      el('div', { class: 'left' }, [
        el('div', { class: 'quote-mark' }, ['"']),
        el('div', { class: 'sec-eyebrow g', style: 'justify-content:center;' }, [ ed('promise.eyebrow', { style: 'font-size: 20px' }) ])
      ]),
      el('div', { class: 'right' }, [
        el('h3', {}, [
          ed('promise.title'),
          el('br'),
          el('span', { class: 'green' }, [ ed('promise.titleHi') ])
        ]),
        el('p', {}, [ ed('promise.desc', { multiline: true, html: true }) ])
      ])
    ])
  ]);
  sec.appendChild(w);
  return sec;
}

// FAQ
function buildFAQ() {
  const sec = el('section', { id: 'faq' });
  const w = el('div', { class: 'wrap' }, [
    el('div', { class: 'sec-eyebrow o' }, [ ed('faq.eyebrow', { style: 'font-size: 20px' }) ]),
    el('h2', { class: 'sec-h' }, [ ed('faq.title') ]),
    (() => {
      const list = el('div', { class: 'faq-list' });
      CONTENT.faq.items.forEach((f, i) => {
        const item = el('div', { class: 'faq-item' });
        const btn = el('button', { class: 'faq-q', type: 'button', on: {
          click: () => item.classList.toggle('open')
        } }, [
          ed(`faq.items.${i}.q`),
          el('span', { class: 'icon' }, ['+'])
        ]);
        const ans = el('div', { class: 'faq-a' }, [
          el('p', {}, [ ed(`faq.items.${i}.a`, { multiline: true }) ])
        ]);
        item.appendChild(btn);
        item.appendChild(ans);
        list.appendChild(item);
      });
      return list;
    })()
  ]);
  sec.appendChild(w);
  return sec;
}

// CTA FINAL
function buildCTAFinal() {
  const sec = el('section', { class: 'cta-final' });
  const w = el('div', { class: 'wrap' }, [
    el('div', { class: 'sec-eyebrow', style: 'justify-content:center; display:inline-flex;' }, [ ed('ctaFinal.eyebrow', { style: 'font-size: 20px' }) ]),
    el('h2', {}, [ ed('ctaFinal.title', { multiline: true, html: true }) ]),
    el('p', {}, [ ed('ctaFinal.sub', { multiline: true }) ]),
    el('a', { class: 'btn btn-primary', href: CONTENT.ctaFinal.buttonLink }, [
      ed('ctaFinal.button'), ' →'
    ])
  ]);
  sec.appendChild(w);
  return sec;
}

// FOOTER
function buildFooter() {
  const f = el('footer');
  const igSvg = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`;
  const waSvg = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`;
  const arrowSvg = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>`;

  const w = el('div', { class: 'wrap' }, [
    // headline
    el('div', { class: 'foot-headline' }, [
      el('div', { class: 'foot-eyebrow' }, ['Fale com a gente']),
      el('h3', {}, [
        'Conteúdo gratuito todo dia.',
        el('br'),
        el('span', { class: 'red' }, ['Material premium quando você quiser ir fundo.'])
      ])
    ]),

    // contact tiles
    el('div', { class: 'foot-tiles' }, [
      // Instagram tile
      el('a', { class: 'foot-tile ig', href: CONTENT.brand.instagramUrl }, [
        el('div', { class: 'foot-tile-ico', html: igSvg }),
        el('div', { class: 'foot-tile-body' }, [
          el('div', { class: 'foot-tile-lbl' }, ['Instagram']),
          (() => {
            const handleNode = ed('brand.instagram');
            handleNode.classList.add('foot-tile-val');
            return handleNode;
          })()
        ]),
        el('div', { class: 'foot-tile-arrow', html: arrowSvg })
      ]),
      // WhatsApp tile
      el('a', { class: 'foot-tile wa', href: 'https://wa.me/5532984912764' }, [
        el('div', { class: 'foot-tile-ico', html: waSvg }),
        el('div', { class: 'foot-tile-body' }, [
          el('div', { class: 'foot-tile-lbl' }, ['WhatsApp']),
          el('div', { class: 'foot-tile-val' }, ['(32) 98491-2764'])
        ]),
        el('div', { class: 'foot-tile-arrow', html: arrowSvg })
      ])
    ]),

    // bottom strip
    el('div', { class: 'foot-strip' }, [
      el('div', { class: 'foot-strip-left' }, [
        (() => { const n = ed('brand.name'); n.classList.add('foot-brand-name'); return n; })(),
        el('span', { class: 'foot-brand-dot' }, ['·']),
        el('span', { class: 'foot-brand-tag' }, ['em foco'])
      ]),
      el('div', { class: 'foot-strip-right' }, [
        '© ', String(new Date().getFullYear()), ' · Todos os direitos reservados'
      ])
    ])
  ]);
  f.appendChild(w);
  return f;
}

// ----------------------------------------------------------------
// PDF PREVIEW MODAL V3 — imagens WebP/PNG, zoom CSS, lazy loading
// ----------------------------------------------------------------

const IMG = {
  pages:   [],   // array de URLs das imagens
  current: 0,    // índice atual (0-based)
  zoom:    1.0,  // zoom atual
  preloaded: new Set()
};

const ZOOM_STEP = 0.25;
const ZOOM_MIN  = 0.5;
const ZOOM_MAX  = 3.0;

function buildModal() {
  const back = el('div', { class: 'modal-backdrop', id: 'modal', on: {
    click: (e) => { if (e.target === back) closePreview(); }
  }});

  // imagem principal
  const img = document.createElement('img');
  img.id = 'preview-img';
  img.alt = 'Prévia';
  img.draggable = false;
  img.style.cssText = 'display:none;max-width:100%;border-radius:3px;box-shadow:0 4px 32px rgba(0,0,0,0.6);transition:transform 0.15s ease;transform-origin:top center;user-select:none;-webkit-user-select:none;pointer-events:none;';

  const spinner = el('div', { class: 'pdf-spinner', id: 'pdf-spinner' }, ['Carregando…']);

  // toolbar de controles
  const toolbar = el('div', { class: 'pdf-toolbar' }, [
    el('button', { class: 'pdf-tb-btn', id: 'prev-btn', title: 'Página anterior (←)',
      on: { click: () => changeImg(-1) } }, ['‹']),
    el('span', { class: 'pdf-tb-counter', id: 'pdf-counter' }, ['—']),
    el('button', { class: 'pdf-tb-btn', id: 'next-btn', title: 'Próxima página (→)',
      on: { click: () => changeImg(1) } }, ['›']),
    el('div', { class: 'pdf-tb-sep' }),
    el('button', { class: 'pdf-tb-btn', id: 'zoom-out', title: 'Reduzir (−)',
      on: { click: () => changeZoom(-ZOOM_STEP) } }, ['−']),
    el('span', { class: 'pdf-tb-zoom', id: 'pdf-zoom' }, ['100%']),
    el('button', { class: 'pdf-tb-btn', id: 'zoom-in', title: 'Ampliar (+)',
      on: { click: () => changeZoom(+ZOOM_STEP) } }, ['+']),
    el('button', { class: 'pdf-tb-btn', id: 'zoom-fit', title: 'Ajustar (0)',
      on: { click: resetZoom } }, ['⊡']),
    el('div', { class: 'pdf-tb-sep' }),
    el('button', { class: 'pdf-tb-btn pdf-tb-hand', id: 'hand-btn',
      title: 'Ferramenta mão (H) — arrastar imagem',
      on: { click: toggleHandTool } }, ['✥']),
  ]);

  back.appendChild(el('div', { class: 'modal' }, [
    el('div', { class: 'modal-head' }, [
      el('div', { class: 'left' }, [
        el('span', { class: 'badge' }, ['PRÉVIA']),
        el('h3', { id: 'modal-title' }, [''])
      ]),
      el('button', { class: 'modal-close', 'aria-label': 'Fechar',
        on: { click: closePreview } }, ['×'])
    ]),
    el('div', { class: 'preview-stage', id: 'preview-stage' }, [
      spinner,
      el('div', { class: 'pdf-scroll', id: 'pdf-scroll' }, [
        img,
        el('div', { class: 'pdf-wm' }, ['PRÉVIA · NÃO COMERCIAL']),
      ]),
      toolbar
    ]),
    el('div', { class: 'modal-foot' }, [
      el('div', { class: 'preview-warn' }, ['Conteúdo protegido • visualização limitada']),
      el('a', { class: 'btn btn-primary', id: 'preview-buy', href: '#' }, ['Comprar agora →'])
    ])
  ]));
  return back;
}

function openPreview(idx) {
  const m = CONTENT.materials.items[idx];
  if (!m) return;

  // previewImages: array de paths, ex: ["assets/previews/precedentes/page-01.webp", ...]
  if (!m.previewImages || !m.previewImages.length) {
    alert('Prévia não disponível para este material ainda.');
    return;
  }

  preview = { open: true, material: m, idx };
  IMG.pages   = m.previewImages;
  IMG.current = 0;
  IMG.zoom    = 1.0;
  IMG.preloaded.clear();

  document.getElementById('modal-title').textContent = m.name;
  document.getElementById('preview-buy').href = m.buyLink;
  document.getElementById('modal').classList.add('open');
  document.body.style.overflow = 'hidden';
  document.addEventListener('keydown', onKey);
  attachSwipe();
  attachScrollZoom();

  showImg(0);
  // pré-carregar próximas 2
  preload(1); preload(2);
}

function showImg(idx) {
  if (idx < 0 || idx >= IMG.pages.length) return;
  IMG.current = idx;

  const img     = document.getElementById('preview-img');
  const spinner = document.getElementById('pdf-spinner');

  img.style.display = 'none';
  spinner.style.display = 'flex';

  const src = IMG.pages[idx];
  const tmp = new Image();
  tmp.onload = () => {
    img.src = src;
    img.style.display = 'inline-block';
    applyZoom();
    spinner.style.display = 'none';
    // scroll para o topo a cada troca de página
    const scroll = document.getElementById('pdf-scroll');
    if (scroll) scroll.scrollTop = 0;
    updateUI();
    // pré-carregar vizinhas
    preload(idx + 1); preload(idx + 2); preload(idx - 1);
  };
  tmp.onerror = () => {
    spinner.textContent = 'Imagem não encontrada.';
  };
  tmp.src = src;
}

function preload(idx) {
  if (idx < 0 || idx >= IMG.pages.length || IMG.preloaded.has(idx)) return;
  IMG.preloaded.add(idx);
  const t = new Image(); t.src = IMG.pages[idx];
}

function changeImg(delta) {
  const next = IMG.current + delta;
  if (next < 0 || next >= IMG.pages.length) return;
  showImg(next);
}

function changeZoom(delta) {
  const scroll  = document.getElementById('pdf-scroll');
  // guardar posição relativa antes do zoom
  const prevW   = scroll ? scroll.scrollWidth  : 0;
  const prevH   = scroll ? scroll.scrollHeight : 0;
  const ratioX  = scroll ? (scroll.scrollLeft + scroll.clientWidth  / 2) / prevW  : 0.5;
  const ratioY  = scroll ? (scroll.scrollTop  + scroll.clientHeight / 2) / prevH  : 0;

  IMG.zoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, IMG.zoom + delta));
  applyZoom();
  updateUI();

  // reposicionar scroll mantendo o ponto central visível
  if (scroll) {
    requestAnimationFrame(() => {
      scroll.scrollLeft = scroll.scrollWidth  * ratioX - scroll.clientWidth  / 2;
      scroll.scrollTop  = scroll.scrollHeight * ratioY - scroll.clientHeight / 2;
    });
  }
}

function resetZoom() {
  IMG.zoom = 1.0;
  applyZoom();
  updateUI();
}

function applyZoom() {
  const img    = document.getElementById('preview-img');
  const scroll = document.getElementById('pdf-scroll');
  if (!img || !scroll) return;

  if (IMG.zoom === 1.0) {
    // zoom 100% = cabe na área visível
    const availW = scroll.clientWidth - 40;
    img.style.width    = availW + 'px';
    img.style.maxWidth = 'none';
    img.style.height   = 'auto';
  } else {
    // zoom > 1 ou < 1: escalar a partir da largura base
    const baseW = scroll.clientWidth - 40;
    const newW  = Math.round(baseW * IMG.zoom);
    img.style.width    = newW + 'px';
    img.style.maxWidth = 'none';
    img.style.height   = 'auto';
  }
}

function updateUI() {
  document.getElementById('pdf-counter').textContent =
    `${IMG.current + 1} / ${IMG.pages.length}`;
  document.getElementById('pdf-zoom').textContent =
    Math.round(IMG.zoom * 100) + '%';
  document.getElementById('prev-btn').disabled = IMG.current <= 0;
  document.getElementById('next-btn').disabled = IMG.current >= IMG.pages.length - 1;
  document.getElementById('zoom-out').disabled = IMG.zoom <= ZOOM_MIN;
  document.getElementById('zoom-in').disabled  = IMG.zoom >= ZOOM_MAX;
}

// estado da ferramenta mão
const HAND = { active: false, dragging: false, startX: 0, startY: 0, scrollX: 0, scrollY: 0 };

function attachScrollZoom() {
  const scroll = document.getElementById('pdf-scroll');
  if (!scroll) return;

  // zoom com roda do mouse
  scroll.addEventListener('wheel', (e) => {
    if (e.ctrlKey || e.metaKey || IMG.zoom !== 1.0 || e.deltaY !== 0) {
      e.preventDefault();
      const delta = e.deltaY < 0 ? +ZOOM_STEP : -ZOOM_STEP;
      changeZoom(delta);
    }
  }, { passive: false });

  // ferramenta mão — drag para rolar
  scroll.addEventListener('mousedown', (e) => {
    if (!HAND.active) return;
    if (e.button !== 0) return;
    HAND.dragging = true;
    HAND.startX   = e.clientX;
    HAND.startY   = e.clientY;
    HAND.scrollX  = scroll.scrollLeft;
    HAND.scrollY  = scroll.scrollTop;
    scroll.classList.add('dragging');
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (!HAND.dragging) return;
    const dx = e.clientX - HAND.startX;
    const dy = e.clientY - HAND.startY;
    scroll.scrollLeft = HAND.scrollX - dx;
    scroll.scrollTop  = HAND.scrollY - dy;
  });

  window.addEventListener('mouseup', () => {
    if (!HAND.dragging) return;
    HAND.dragging = false;
    scroll.classList.remove('dragging');
  });
}

function toggleHandTool() {
  HAND.active = !HAND.active;
  const btn    = document.getElementById('hand-btn');
  const scroll = document.getElementById('pdf-scroll');
  if (!btn || !scroll) return;
  if (HAND.active) {
    btn.style.background    = 'rgba(0,200,255,0.18)';
    btn.style.borderColor   = 'rgba(0,200,255,0.5)';
    btn.style.color         = '#00c8ff';
    scroll.style.cursor     = 'grab';
  } else {
    btn.style.background    = '';
    btn.style.borderColor   = '';
    btn.style.color         = '';
    scroll.style.cursor     = 'default';
    HAND.dragging = false;
    scroll.classList.remove('dragging');
  }
}

// swipe touch para mobile
let _tx = 0;
function attachSwipe() {
  const scroll = document.getElementById('pdf-scroll');
  if (!scroll) return;
  scroll.addEventListener('touchstart', (e) => { _tx = e.touches[0].clientX; }, { passive: true });
  scroll.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - _tx;
    if (Math.abs(dx) > 50) changeImg(dx < 0 ? 1 : -1);
  }, { passive: true });
}

function closePreview() {
  preview.open = false;
  IMG.pages = []; IMG.preloaded.clear();
  HAND.active = false; HAND.dragging = false;
  const img = document.getElementById('preview-img');
  if (img) { img.src = ''; img.style.display = 'none'; }
  const btn = document.getElementById('hand-btn');
  if (btn) { btn.style.background = ''; btn.style.borderColor = ''; btn.style.color = ''; }
  document.getElementById('modal').classList.remove('open');
  document.body.style.overflow = '';
  document.removeEventListener('keydown', onKey);
}

function navPreview() {} // compatibilidade

function onKey(e) {
  if (!preview.open) return;
  if (e.key === 'Escape')     closePreview();
  if (e.key === 'ArrowLeft')  changeImg(-1);
  if (e.key === 'ArrowRight') changeImg(1);
  if (e.key === '+')          changeZoom(+ZOOM_STEP);
  if (e.key === '-')          changeZoom(-ZOOM_STEP);
  if (e.key === '0')          resetZoom();
  if (e.key === 'h' || e.key === 'H') toggleHandTool();
}

// ----------------------------------------------------------------
// ANTI-DOWNLOAD measures
// ----------------------------------------------------------------
function attachAntiDownload() {
  // disable right-click on PDF preview
  document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('.pdf-page')) e.preventDefault();
  });
  // disable drag from preview canvas
  document.addEventListener('dragstart', (e) => {
    if (e.target.closest('.pdf-page')) e.preventDefault();
  });
  // block Ctrl+S / Ctrl+P / Ctrl+U while preview open
  document.addEventListener('keydown', (e) => {
    if (!preview.open) return;
    const k = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && (k === 's' || k === 'p' || k === 'u')) {
      e.preventDefault();
    }
  });
}

// ----------------------------------------------------------------
// ADMIN MODE — inline editing + gestão de PDFs de prévia
// ----------------------------------------------------------------
function wireEditing() {
  // edição inline de texto
  document.querySelectorAll('[data-edit]').forEach((node) => {
    node.contentEditable = 'true';
    node.spellcheck = false;
    node.addEventListener('focus', () => node.dataset.before = node.innerHTML);
    node.addEventListener('blur', () => {
      const path = node.dataset.edit;
      const val = node.dataset.multiline ? node.innerHTML : node.textContent;
      setPath(CONTENT, path, val);
      saveContent(CONTENT);
    });
    node.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !node.dataset.multiline) { e.preventDefault(); node.blur(); }
    });
  });

  // troca de imagem de capa
  document.querySelectorAll('[data-edit-img]').forEach((node) => {
    node.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      const path = node.dataset.editImg;
      pickImage((dataUrl) => {
        setPath(CONTENT, path, dataUrl);
        saveContent(CONTENT);
        node.src = dataUrl;
      });
    });
  });

  // botões de gestão de imagens de prévia por material
  document.querySelectorAll('[data-pdf-idx]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      const idx = parseInt(btn.dataset.pdfIdx, 10);
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/webp,image/png,image/jpeg';
      input.multiple = true;
      input.addEventListener('change', () => {
        const files = Array.from(input.files);
        if (!files.length) return;
        // ordenar por nome para garantir sequência correta
        files.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
        const folder = CONTENT.materials.items[idx].previewFolder ||
          `assets/previews/${CONTENT.materials.items[idx].id || ('mat' + idx)}`;
        const paths = files.map(f => `${folder}/${f.name}`);
        setPath(CONTENT, `materials.items.${idx}.previewImages`, paths);
        setPath(CONTENT, `materials.items.${idx}.previewFolder`, folder);
        saveContent(CONTENT);
        btn.textContent = `${files.length} imagens vinculadas`;
        btn.style.borderColor = 'var(--green)';
        btn.style.color = 'var(--green)';
        flash(`${files.length} imagens configuradas para este material`);
        setTimeout(() => {
          alert(
            `✅ ${files.length} imagens configuradas.\n\n` +
            `⚠️ Faça o upload das imagens para a pasta:\n"${folder}"\n\n` +
            `Os arquivos precisam estar nessa pasta no Netlify para a prévia funcionar.`
          );
        }, 300);
      });
      input.click();
    });
  });

  // admin bar buttons
  document.getElementById('admin-save')?.addEventListener('click', () => {
    saveContent(CONTENT);
    flash('Salvo no navegador');
  });
  document.getElementById('admin-export')?.addEventListener('click', exportJSON);
  document.getElementById('admin-import')?.addEventListener('click', importJSON);
  document.getElementById('admin-reset')?.addEventListener('click', () => {
    if (confirm('Restaurar para o conteúdo original? Suas edições locais serão perdidas.')) {
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    }
  });
  document.getElementById('admin-exit')?.addEventListener('click', () => {
    location.search = '';
  });
}

function pickImage(cb) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => cb(reader.result);
    reader.readAsDataURL(file);
  });
  input.click();
}

function pickPdf(cb) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/pdf';
  input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    cb(file, objectUrl);
  });
  input.click();
}
function exportJSON() {
  const blob = new Blob([JSON.stringify(CONTENT, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'temas-trabalhistas-content.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}
function importJSON() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';
  input.addEventListener('change', () => {
    const file = input.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        CONTENT = deepMerge(JSON.parse(JSON.stringify(DEFAULT_CONTENT)), parsed);
        saveContent(CONTENT);
        location.reload();
      } catch (e) { alert('JSON inválido.'); }
    };
    reader.readAsText(file);
  });
  input.click();
}
function flash(msg) {
  const t = el('div', { style: `
    position:fixed; bottom:80px; left:50%; transform:translateX(-50%);
    background: rgba(0,229,160,0.95); color:#003322;
    font-family: 'JetBrains Mono', monospace;
    font-size:12px; font-weight:700; padding:10px 18px;
    border-radius:8px; z-index: 200;
    letter-spacing: 1px;
  ` }, [msg]);
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 1600);
}

// ----------------------------------------------------------------
// INIT
// ----------------------------------------------------------------
function attachLinkBlocks() {
  // ensure target=_blank for external CTA links
  document.querySelectorAll('a[href^="http"]').forEach(a => {
    a.target = '_blank'; a.rel = 'noopener noreferrer';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderApp();
  attachAntiDownload();
});
