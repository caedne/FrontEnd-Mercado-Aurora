// Produtos disponíveis no sistema
const produtos = {
  'tomate': { nome: 'Tomate', preco: 3.99, unidade: 'kg', categoria: 'frutas', descricao:"Tomate maduro e suculento, ideal para saladas e molhos" , img: 'img/2149125235.jpg' },
  'laranja': { nome: 'Laranja', preco: 2.49, unidade: 'kg', categoria: 'frutas', descricao:"Laranja doce e suculenta, rica em vitamina C" , img: 'img/2147830511.jpg' },
  'batata': { nome: 'Batata', preco: 3.49, unidade: 'kg', categoria: 'legumes', descricao:"Batata inglesa fresquinha, perfeita para qualquer preparo" , img: 'img/15862.jpg' },
  'banana': { nome: 'Banana Prata', preco: 4.99, unidade: 'kg', categoria: 'frutas', descricao:"Banana prata doce e madura, fonte de potássio" , img: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop' },
  'alface': { nome: 'Alface Americana', preco: 2.99, unidade: 'unidade', categoria: 'verduras', descricao:"Alface crocante e fresquinha, direto da horta" , img: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=300&h=300&fit=crop' },
  'cenoura': { nome: 'Cenoura', preco: 3.29, unidade: 'kg', categoria: 'legumes', descricao:"Cenoura doce e crocante, rica em betacaroteno" , img: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=300&h=300&fit=crop' },
  'cebola': { nome: 'Cebola', preco: 2.50, unidade: 'kg', categoria: 'legumes', descricao:"Cebola forte e rica em sabor!" , img: 'img/cebola.jpg'},
  'pimentão vermelho': { nome: 'Pimentão Vermelho', preco: 2.00, unidade: 'kg', categoria: 'legumes', descricao:"Pimenta forte e saborosa" , img: 'img/pimentão vermelho.jpg'},
  'feijão': { nome: 'Feijão', preco: 3.20, unidade: 'kg', categoria: 'legumes', descricao:"Feijão suculento e rico em carboidratos" , img: 'img/feijão.jpg'},
  'ervilha': { nome: 'Ervilha', preco: 2.00, unidade: 'kg', categoria: 'legumes', descricao:"Ervilhas tenras e verdinhas, com textura delicada." , img: 'img/ervilha.jpg'},
  'uva': { nome: 'Uva', preco: 1.50, unidade: 'kg', categoria: 'frutas', descricao:"Uvas frescas, doces e suculentas." , img: 'img/uva.jpg'},
  'maçã': { nome: 'Maçã', preco: 2.00, unidade: 'kg', categoria: 'frutas', descricao:"Maçãs firmes e aromáticas, com crocância irresistível." , img: 'img/maçã.jpg'},
  'brocólis': { nome: 'Brócolis', preco: 1.50, unidade: 'kg', categoria: 'verduras', descricao:"Brócolis de buquês verdes e compactos, sabor suave e nutritivo." , img: 'img/brócolis.jpg'},
  'couve-flor': { nome: 'Couve-Flor', preco: 3.00, unidade: 'unidade', categoria: 'verduras', descricao:"Couve-flor clara e consistente, de sabor delicado." , img: 'img/couveflor.jpg'},
  'repolho': { nome: 'Repolho', preco: 3.00, unidade: 'unidade', categoria: 'verduras', descricao:"Repolho fresco, folhas densas e crocantes." , img: 'img/repolho.jpg'},
  'couve manteiga': { nome: 'couve manteiga', preco: 3.20, unidade: 'unidade', categoria: 'verduras', descricao:"Couve manteiga de folhas verdes e macias, rica em sabor." , img: 'img/couve manteiga.png'},
   'rúcula': { nome: 'Rúcula', preco: 1.20, unidade: 'kg', categoria: 'verduras', descricao:"Rúcula fresca, folhas verdes e sabor levemente picante." , img: 'img/rúcula.png'},
  'queijo colonial': { nome: 'Queijo colonial', preco: 4.00, unidade: 'kg', categoria: 'outros', descricao:"Queijo colonial artesanal, sabor marcante e textura cremosa." , img: 'img/queijo colonial.jpg'},
  'leite': { nome: 'Leite', preco: 4.00, unidade: 'unidade', categoria: 'outros', descricao:"Leite fresco e puro, fonte natural de cálcio e proteínas." , img: 'img/leite.jpg'},
  'ovo': { nome: 'Ovo', preco: 0.20, unidade: 'unidade', categoria: 'outros', descricao:"Ovos selecionados, ricos em nutrientes e versáteis na cozinha." , img: 'img/ovo.jpg'},
  'geléia': { nome: 'Geléia', preco: 3.50, unidade: 'unidade', categoria: 'outros', descricao:"Geléia caseira, sabor intenso e textura delicada." , img: 'img/geléia.jpg'},
  'azeite de oliva': { nome: 'Azeite de Oliva', preco: 4.00, unidade: 'unidade', categoria: 'outros', descricao:"Azeite de oliva extra virgem, aroma suave e sabor equilibrado." , img: 'img/azeite de oliva.jpg'},
  'vinho': { nome: 'vinho', preco: 12.00, unidade: 'unidade', categoria: 'outros', descricao:"Vinho de qualidade, corpo elegante e notas aromáticas." , img: 'img/vinho.jpg'},
};

let carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
let produtosArray = [];

document.addEventListener('DOMContentLoaded', () => {
  inicializarProdutos();
  setupEventListeners();
  atualizarContadorCarrinho();
  verificarCarrinhoFlutuante();
});

// ============================
// Funções principais
// ============================

function inicializarProdutos() {
  produtosArray = Object.keys(produtos).map(id => ({ id, ...produtos[id] }));
  renderizarProdutos(produtosArray);
}

function renderizarProdutos(lista) {
  const container = document.getElementById('produtos-container');
  container.innerHTML = '';

  lista.forEach(prod => {
    container.innerHTML += `
      <div class="produto" data-categoria="${prod.categoria}" data-id="${prod.id}">
        <div class="produto-imagem">
          <img src="${prod.img}" alt="${prod.nome}">
        </div>
        <div class="produto-info">
          <h3>${prod.nome}</h3>
          <p class="produto-descricao"> ${prod.descricao}</p>
          <div class="produto-preco">
            <span class="preco-atual">R$ ${prod.preco.toFixed(2)}</span>
            <span class="unidade">/${prod.unidade}</span>
          </div>
          <div class="produto-quantidade">
            <button class="btn-menos" data-produto="${prod.id}">-</button>
            <input type="number" id="qtd-${prod.id}" min="0" step="1" value="0" class="input-quantidade">
            <button class="btn-mais" data-produto="${prod.id}">+</button>
            <span class="kg-label">${prod.unidade}</span>
          </div>
          <button class="btn-adicionar" data-produto="${prod.id}">
            🛒 Adicionar ao Carrinho
          </button>
        </div>
      </div>
    `;
  });

  // Inicializa todos os botões "-" desabilitados (quantidade 0)
  document.querySelectorAll(".input-quantidade").forEach(input => {
    const produto = input.id.replace("qtd-", "");
    const menosBtn = document.querySelector(`.btn-menos[data-produto="${produto}"]`);
    atualizarEstadoBotao(menosBtn, input);
  });
}

function setupEventListeners() {
  // Delegação de eventos para +, -, e adicionar
  document.addEventListener('click', e => {
    if (e.target.classList.contains('btn-menos')) {
      alterarQuantidade(e.target.dataset.produto, -1);
    }
    if (e.target.classList.contains('btn-mais')) {
      alterarQuantidade(e.target.dataset.produto, 1);
    }
    if (e.target.classList.contains('btn-adicionar')) {
      adicionarAoCarrinho(e.target.dataset.produto);
    }
  });

  document.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filtrarProdutos(btn.dataset.categoria);
    });
  });

  const ordenarSelect = document.getElementById('ordenar');
  if (ordenarSelect) {
    ordenarSelect.addEventListener('change', e => {
      ordenarProdutos(e.target.value);
    });
  }
}

// ============================
// Funções utilitárias
// ============================

function atualizarEstadoBotao(menosBtn, input) {
  menosBtn.disabled = parseFloat(input.value) <= 0;
}

function alterarQuantidade(id, delta) {
  const input = document.getElementById(`qtd-${id}`);
  let novoValor = Math.max(0, parseInt(input.value) + delta);
  input.value = novoValor;
  const menosBtn = document.querySelector(`.btn-menos[data-produto="${id}"]`);
  atualizarEstadoBotao(menosBtn, input);
}

function adicionarAoCarrinho(id) {
  const qtd = parseFloat(document.getElementById(`qtd-${id}`).value);
  if (qtd <= 0) return;

  const itemExistente = carrinho.find(i => i.id === id);
  if (itemExistente) itemExistente.quantidade += qtd;
  else carrinho.push({ id, quantidade: qtd });

  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarContadorCarrinho();
  verificarCarrinhoFlutuante();
  mostrarToast(`${produtos[id].nome} adicionado ao carrinho!`);
}

function filtrarProdutos(cat) {
  const lista = cat === 'todos' ? produtosArray : produtosArray.filter(p => p.categoria === cat);
  renderizarProdutos(lista);
}

function ordenarProdutos(criterio) {
  let lista = [...produtosArray];
  if (criterio === 'nome') lista.sort((a, b) => a.nome.localeCompare(b.nome));
  if (criterio === 'preco-menor') lista.sort((a, b) => a.preco - b.preco);
  if (criterio === 'preco-maior') lista.sort((a, b) => b.preco - a.preco);
  renderizarProdutos(lista);
}

function atualizarContadorCarrinho() {
  const total = carrinho.reduce((t, i) => t + i.quantidade, 0);
  document.querySelectorAll('#contador-carrinho,#contador-flutuante')
    .forEach(c => c.textContent = Math.round(total));
}

function verificarCarrinhoFlutuante() {
  document.getElementById('carrinho-flutuante').style.display = carrinho.length > 0 ? 'block' : 'none';
}

function mostrarToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'toast show';
  setTimeout(() => toast.className = 'toast', 3000);
}

function mostrarToast(mensagem) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = mensagem;
  document.body.appendChild(toast);

  // Mostra o toast
  setTimeout(() => {
    toast.style.transform = "translateX(0)";
    toast.style.opacity = "1";
  }, 100);

  // Remove depois de 3 segundos
  setTimeout(() => {
    toast.style.transform = "translateX(100%)";
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300); // espera a transição
  }, 3000);
}
