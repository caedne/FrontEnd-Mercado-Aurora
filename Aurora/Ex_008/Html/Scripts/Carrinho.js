// Produtos disponíveis
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
  'uva': { nome: 'Uva', preco: 1.50, unidade: 'kg', categoria: 'fruta', descricao:"Uvas frescas, doces e suculentas." , img: 'img/uva.jpg'},
  'maçã': { nome: 'Maçã', preco: 2.00, unidade: 'kg', categoria: 'fruta', descricao:"Maçãs firmes e aromáticas, com crocância irresistível." , img: 'img/maçã.jpg'},
  'brocólis': { nome: 'Brócolis', preco: 1.50, unidade: 'kg', categoria: 'verdura', descricao:"Brócolis de buquês verdes e compactos, sabor suave e nutritivo." , img: 'img/brócolis.jpg'},
  'couve-flor': { nome: 'Couve-Flor', preco: 3.00, unidade: 'unidade', categoria: 'verdura', descricao:"Couve-flor clara e consistente, de sabor delicado." , img: 'img/couveflor.jpg'},
  'repolho': { nome: 'Repolho', preco: 3.00, unidade: 'unidade', categoria: 'verdura', descricao:"Repolho fresco, folhas densas e crocantes." , img: 'img/repolho.jpg'},
  'couve manteiga': { nome: 'couve manteiga', preco: 3.20, unidade: 'unidade', categoria: 'verdura', descricao:"Couve manteiga de folhas verdes e macias, rica em sabor." , img: 'img/couve manteiga.png'},
};
 
// Cupons de desconto
const cupons = {
  'AURORA10': { desconto: 0.10, tipo: 'percentual' },
  'PRIMEIRA': { desconto: 5.00, tipo: 'fixo' },
  'FRETE': { desconto: 5.00, tipo: 'frete' }
};
 
let carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
let cupomAplicado = null;
 
// Inicializar página
document.addEventListener('DOMContentLoaded', function() {
  console.log('Carrinho carregado:', carrinho);
  atualizarCarrinho();
  setupEventListeners();
});
 
function setupEventListeners() {
  // Botões de quantidade - usando event delegation
  document.addEventListener('click', function(e) {
    console.log('Clique detectado:', e.target.classList, e.target.dataset);
   
    if (e.target.classList.contains('btn-menos')) {
      console.log('Botão menos clicado para:', e.target.dataset.produto);
      alterarQuantidade(e.target.dataset.produto, -1);
    }
    if (e.target.classList.contains('btn-mais')) {
      console.log('Botão mais clicado para:', e.target.dataset.produto);
      alterarQuantidade(e.target.dataset.produto, 1);
    }
    if (e.target.classList.contains('btn-remover')) {
      console.log('Botão remover clicado para:', e.target.dataset.produto);
      removerItem(e.target.dataset.produto);
    }
  });
 
  // Aplicar cupom
  const btnCupom = document.getElementById('aplicar-cupom');
  if (btnCupom) {
    btnCupom.addEventListener('click', aplicarCupom);
  }
 
  // Opções de entrega
  document.querySelectorAll('input[name="entrega"]').forEach(radio => {
    radio.addEventListener('change', atualizarEntrega);
  });
 
  // Modal
  const btnFinalizar = document.getElementById('finalizar-compra');
  if (btnFinalizar) {
    btnFinalizar.addEventListener('click', abrirModal);
  }
 
  const closeBtn = document.querySelector('.close');
  if (closeBtn) {
    closeBtn.addEventListener('click', fecharModal);
  }
 
  const btnCancelar = document.querySelector('.btn-cancelar');
  if (btnCancelar) {
    btnCancelar.addEventListener('click', fecharModal);
  }
 
  // Form de checkout
  const formCheckout = document.getElementById('form-checkout');
  if (formCheckout) {
    formCheckout.addEventListener('submit', finalizarPedido);
  }
 
  // Pagamento
  document.querySelectorAll('input[name="pagamento"]').forEach(radio => {
    radio.addEventListener('change', atualizarPagamento);
  });
 
  // Entrega no modal - atualizar campos
  document.querySelectorAll('input[name="entrega"]').forEach(radio => {
    radio.addEventListener('change', function() {
      const enderecoEntrega = document.getElementById('endereco-entrega');
      const entregaModal = document.getElementById('entrega-modal');
     
      if (enderecoEntrega) {
        enderecoEntrega.style.display = this.value === 'delivery' ? 'block' : 'none';
      }
      if (entregaModal) {
        entregaModal.textContent = this.value === 'delivery' ? 'Entrega em casa' : 'Retirar na loja';
      }
    });
  });
 
  console.log('Event listeners configurados');
}
 
function atualizarCarrinho() {
  const carrinhoVazio = document.getElementById('carrinho-vazio');
  const itensLista = document.getElementById('itens-lista');
  const btnFinalizar = document.getElementById('finalizar-compra');
 
  console.log('Atualizando carrinho. Itens:', carrinho.length);
 
  if (carrinho.length === 0) {
    if (carrinhoVazio) carrinhoVazio.style.display = 'block';
    if (itensLista) itensLista.style.display = 'none';
    if (btnFinalizar) btnFinalizar.disabled = true;
  } else {
    if (carrinhoVazio) carrinhoVazio.style.display = 'none';
    if (itensLista) itensLista.style.display = 'block';
    if (btnFinalizar) btnFinalizar.disabled = false;
    renderizarItens();
  }
 
  atualizarResumo();
  salvarCarrinho();
}
 
function renderizarItens() {
  const itensLista = document.getElementById('itens-lista');
  if (!itensLista) {
    console.error('Elemento itens-lista não encontrado');
    return;
  }
 
  console.log('Renderizando itens:', carrinho);
  itensLista.innerHTML = '';
 
  carrinho.forEach(item => {
    const produto = produtos[item.id];
    if (!produto) {
      console.warn('Produto não encontrado:', item.id);
      return;
    }
 
    const itemHTML = `
      <div class="item-carrinho">
        <img src="${produto.img}" alt="${produto.nome}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZjBmMGYwIi8+Cjx0ZXh0IHg9IjQwIiB5PSI0NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5Ij5JbWFnZW08L3RleHQ+Cjwvc3ZnPg=='">
        <div class="item-info">
          <h4>${produto.nome}</h4>
          <p>R$ ${produto.preco.toFixed(2)}/${produto.unidade}</p>
        </div>
        <div class="item-quantidade">
          <button class="btn-menos" data-produto="${item.id}" type="button">-</button>
          <span class="quantidade-display">${Math.round(item.quantidade)}</span>
          <button class="btn-mais" data-produto="${item.id}" type="button">+</button>
        </div>
        <div class="item-preco">
          <span class="preco-total">R$ ${(produto.preco * item.quantidade).toFixed(2)}</span>
          <button class="btn-remover" data-produto="${item.id}" type="button" title="Remover item">🗑️</button>
        </div>
      </div>
    `;
    itensLista.innerHTML += itemHTML;
  });
 
  console.log('Itens renderizados. HTML:', itensLista.innerHTML);
}
 
function alterarQuantidade(produtoId, delta) {
  console.log('Alterando quantidade:', produtoId, delta);
 
  const item = carrinho.find(i => i.id === produtoId);
  if (item) {
    const novaQuantidade = item.quantidade + delta;
   
    if (novaQuantidade <= 0) {
      removerItem(produtoId);
      return;
    }
   
    item.quantidade = Math.round(novaQuantidade);
    console.log('Nova quantidade:', item.quantidade);
    atualizarCarrinho();
  } else {
    console.warn('Item não encontrado no carrinho:', produtoId);
  }
}
 
function removerItem(produtoId) {
  console.log('Removendo item:', produtoId);
  const tamanhoAnterior = carrinho.length;
  carrinho = carrinho.filter(item => item.id !== produtoId);
 
  if (carrinho.length < tamanhoAnterior) {
    console.log('Item removido com sucesso');
    mostrarNotificacao('Item removido do carrinho!', 'success');
    atualizarCarrinho();
  } else {
    console.warn('Item não foi encontrado para remoção:', produtoId);
  }
}
 
function atualizarResumo() {
  const subtotal = carrinho.reduce((total, item) => {
    const produto = produtos[item.id];
    return produto ? total + (produto.preco * item.quantidade) : total;
  }, 0);
 
  const entregaRadio = document.querySelector('input[name="entrega"]:checked');
  const taxaEntrega = (entregaRadio && entregaRadio.value === 'delivery') ? 5.00 : 0.00;
 
  let desconto = 0;
  if (cupomAplicado && cupons[cupomAplicado]) {
    const cupom = cupons[cupomAplicado];
    if (cupom.tipo === 'percentual') {
      desconto = subtotal * cupom.desconto;
    } else if (cupom.tipo === 'fixo') {
      desconto = cupom.desconto;
    } else if (cupom.tipo === 'frete') {
      desconto = Math.min(cupom.desconto, taxaEntrega);
    }
  }
 
  const total = Math.max(0, subtotal + taxaEntrega - desconto);
 
  // Atualizar elementos do resumo
  const subtotalEl = document.getElementById('subtotal');
  const taxaEntregaEl = document.getElementById('taxa-entrega');
  const totalEl = document.getElementById('total');
  const totalModalEl = document.getElementById('total-modal');
  const linhaDescontoEl = document.getElementById('linha-desconto');
  const descontoEl = document.getElementById('desconto');
 
  if (subtotalEl) subtotalEl.textContent = `R$ ${subtotal.toFixed(2)}`;
  if (taxaEntregaEl) taxaEntregaEl.textContent = `R$ ${taxaEntrega.toFixed(2)}`;
  if (totalEl) totalEl.innerHTML = `<strong>R$ ${total.toFixed(2)}</strong>`;
  if (totalModalEl) totalModalEl.textContent = `R$ ${total.toFixed(2)}`;
 
  if (cupomAplicado && desconto > 0) {
    if (linhaDescontoEl) linhaDescontoEl.style.display = 'flex';
    if (descontoEl) descontoEl.textContent = `-R$ ${desconto.toFixed(2)}`;
  } else {
    if (linhaDescontoEl) linhaDescontoEl.style.display = 'none';
  }
}
 
function aplicarCupom() {
  const cupomInput = document.getElementById('cupom-input');
  if (!cupomInput) return;
 
  const codigo = cupomInput.value.toUpperCase();
 
  if (cupons[codigo]) {
    cupomAplicado = codigo;
    cupomInput.style.borderColor = 'green';
    cupomInput.value = `✓ ${codigo}`;
    cupomInput.disabled = true;
   
    const btnCupom = document.getElementById('aplicar-cupom');
    if (btnCupom) {
      btnCupom.textContent = 'Aplicado!';
      btnCupom.disabled = true;
    }
   
    atualizarResumo();
    mostrarNotificacao('Cupom aplicado com sucesso!', 'success');
  } else {
    cupomInput.style.borderColor = 'red';
    mostrarNotificacao('Cupom inválido!', 'error');
    setTimeout(() => {
      cupomInput.style.borderColor = '';
    }, 3000);
  }
}
 
function atualizarEntrega() {
  atualizarResumo();
}
 
function atualizarPagamento() {
  const pagamentoSelecionado = document.querySelector('input[name="pagamento"]:checked');
  const trocoSection = document.getElementById('troco-section');
  const pagamentoModal = document.getElementById('pagamento-modal');
 
  if (trocoSection) {
    trocoSection.style.display = (pagamentoSelecionado && pagamentoSelecionado.value === 'dinheiro') ? 'block' : 'none';
  }
 
  if (pagamentoModal && pagamentoSelecionado) {
    const textos = {
      'dinheiro': 'Dinheiro',
      'cartao': 'Cartão na entrega',
      'pix': 'PIX'
    };
    pagamentoModal.textContent = textos[pagamentoSelecionado.value] || 'Dinheiro';
  }
}
 
function abrirModal() {
  const modal = document.getElementById('modal-checkout');
  if (modal) {
    modal.style.display = 'block';
    atualizarResumo();
  }
}
 
function fecharModal() {
  const modal = document.getElementById('modal-checkout');
  if (modal) {
    modal.style.display = 'none';
  }
}
 
function finalizarPedido(e) {
  e.preventDefault();
 
  // Simular processamento
  const btnConfirmar = document.querySelector('.btn-confirmar');
  if (btnConfirmar) {
    btnConfirmar.textContent = 'Processando...';
    btnConfirmar.disabled = true;
  }
 
  setTimeout(() => {
    // Limpar carrinho
    carrinho = [];
    localStorage.removeItem('carrinho');
   
    // Fechar modal
    fecharModal();
   
    // Mostrar sucesso
    mostrarNotificacao('Pedido realizado com sucesso!', 'success');
   
    // Redirecionar após 2 segundos
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
  }, 2000);
}
 
function mostrarNotificacao(mensagem, tipo = 'success') {
  // Remover notificações anteriores
  const notificacaoExistente = document.querySelector('.notificacao');
  if (notificacaoExistente) {
    notificacaoExistente.remove();
  }
 
  const notificacao = document.createElement('div');
  notificacao.className = `notificacao ${tipo}`;
  notificacao.textContent = mensagem;
  document.body.appendChild(notificacao);
 
  setTimeout(() => {
    if (notificacao.parentNode) {
      notificacao.remove();
    }
  }, 3000);
}
 
function salvarCarrinho() {
  try {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    console.log('Carrinho salvo:', carrinho);
  } catch (error) {
    console.error('Erro ao salvar carrinho:', error);
  }
}
 
// Função global para adicionar produtos (chamada de outras páginas)
function adicionarAoCarrinho(produtoId) {
  console.log('Adicionando ao carrinho:', produtoId);
 
  if (!produtos[produtoId]) {
    console.warn('Produto não existe:', produtoId);
    return false;
  }
 
  const produto = produtos[produtoId];
  let quantidade = 1;
 
  // Se o produto é vendido por kg, pedir quantidade
  if (produto.unidade === 'kg') {
    let input = prompt(`Digite a quantidade em kg de ${produto.nome}:`, "1");
    if (!input || isNaN(input) || input <= 0) {
      alert("Quantidade inválida!");
      return false;
    }
    quantidade = parseFloat(input);
  }
 
  const item = carrinho.find(i => i.id === produtoId);
  if (item) {
    item.quantidade += quantidade;
  } else {
    carrinho.push({ id: produtoId, quantidade: quantidade });
  }
 
  atualizarCarrinho();
  mostrarNotificacao(`${produto.nome} adicionado ao carrinho!`, 'success');
  return true;
}
 
// Tornar função disponível globalmente
window.adicionarAoCarrinho = adicionarAoCarrinho;
 
// Fechar modal ao clicar fora dele
window.addEventListener('click', function(e) {
  const modal = document.getElementById('modal-checkout');
  if (e.target === modal) {
    fecharModal();
  }
});
 
// Debug: função para testar o carrinho
window.testarCarrinho = function() {
  console.log('Testando carrinho...');
  adicionarAoCarrinho('tomate', 2);
  adicionarAoCarrinho('laranja', 1.5);
  console.log('Carrinho após teste:', carrinho);
};
 
console.log('CarrinhoScript.js carregado completamente');
 
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
mostrarToast("Produto adicionado ao carrinho!");
 
function finalizarPedido(e) {
  if (e) e.preventDefault();

  const btnConfirmar = document.querySelector('.btn-confirmar');
  if (btnConfirmar) {
    btnConfirmar.textContent = 'Gerando nota fiscal... 🧾';
    btnConfirmar.disabled = true;
  }

  // Simula processamento
  setTimeout(() => {
    // Monta a nota fiscal
    const subtotal = carrinho.reduce((total, item) => {
      const produto = produtos[item.id];
      return total + produto.preco * item.quantidade;
    }, 0);

    const entregaRadio = document.querySelector('input[name="entrega"]:checked');
    const taxaEntrega = (entregaRadio && entregaRadio.value === 'delivery') ? 5.00 : 0.00;

    let desconto = 0;
    if (cupomAplicado && cupons[cupomAplicado]) {
      const cupom = cupons[cupomAplicado];
      if (cupom.tipo === 'percentual') desconto = subtotal * cupom.desconto;
      else if (cupom.tipo === 'fixo') desconto = cupom.desconto;
      else if (cupom.tipo === 'frete') desconto = Math.min(cupom.desconto, taxaEntrega);
    }

    const total = Math.max(0, subtotal + taxaEntrega - desconto);
    const numeroNota = Math.floor(Math.random() * 900000) + 100000;
    const data = new Date().toLocaleString('pt-BR');

    // Monta HTML da nota fiscal
    let itensHTML = '';
    carrinho.forEach(item => {
      const produto = produtos[item.id];
      itensHTML += `
        <tr>
          <td>${produto.nome}</td>
          <td>${item.quantidade}</td>
          <td>R$ ${produto.preco.toFixed(2)}</td>
          <td>R$ ${(produto.preco * item.quantidade).toFixed(2)}</td>
        </tr>`;
    });

    const notaHTML = `
      <div id="nota-fiscal-overlay" class="nota-overlay">
        <div class="nota-fiscal">
          <h2>🧾 Nota Fiscal Eletrônica</h2>
          <p><strong>Número:</strong> ${numeroNota}</p>
          <p><strong>Data:</strong> ${data}</p>
          <hr>
          <table class="tabela-nota">
            <thead>
              <tr><th>Produto</th><th>Qtd</th><th>Preço Unit.</th><th>Total</th></tr>
            </thead>
            <tbody>${itensHTML}</tbody>
          </table>
          <hr>
          <p><strong>Subtotal:</strong> R$ ${subtotal.toFixed(2)}</p>
          <p><strong>Entrega:</strong> R$ ${taxaEntrega.toFixed(2)}</p>
          ${desconto > 0 ? `<p><strong>Desconto:</strong> -R$ ${desconto.toFixed(2)}</p>` : ''}
          <h3>Total: R$ ${total.toFixed(2)}</h3>
          <button id="btn-fechar-nota">Concluir</button>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', notaHTML);

    // Evento para fechar a nota
    document.getElementById('btn-fechar-nota').addEventListener('click', () => {
      document.getElementById('nota-fiscal-overlay').remove();
      mostrarToast('Compra concluída com sucesso! 🎉');
      carrinho = [];
      localStorage.removeItem('carrinho');
      atualizarCarrinho();
      fecharModal();
    });

  }, 1500);
}

 
document.addEventListener('DOMContentLoaded', () => {
  const formCheckout = document.getElementById('form-checkout');
  if (formCheckout) {
    formCheckout.addEventListener('submit', finalizarPedido);
    console.log('Botão Confirmar Pedido conectado com sucesso!');
  } else {
    console.error('Formulário de checkout não encontrado, botão não vai funcionar 😭');
  }
});
 
document.getElementById('btn-confirmar').addEventListener('click', finalizarPedido);
 
document.addEventListener('DOMContentLoaded', () => {
  const formCheckout = document.getElementById('form-checkout');
  if (formCheckout) {
    formCheckout.addEventListener('submit', finalizarPedido);
    console.log('Botão Confirmar Pedido conectado com sucesso!');
  } else {
    console.error('Formulário de checkout não encontrado, botão não vai funcionar 😭');
  }
});
document.addEventListener('DOMContentLoaded', () => {
  const formCheckout = document.getElementById('form-checkout');
  if (formCheckout) {
    formCheckout.addEventListener('submit', finalizarPedido);
    console.log('Botão Confirmar Pedido conectado com sucesso!');
  } else {
    console.error('Formulário de checkout não encontrado, botão não vai funcionar 😭');
  }
});
 
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btn-confirmar');
  if (btn) {
    btn.addEventListener('click', finalizarPedido);
    console.log('Botão Confirmar Pedido tá vivo e chutando!');
  } else {
    console.error('Não achei o botão Confirmar Pedido 😡');
  }
});
 
function mostrarToast(mensagem) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = mensagem;
  document.body.appendChild(toast);
 
  // Mostra o toast com animação
  setTimeout(() => {
    toast.style.transform = "translateX(0)";
    toast.style.opacity = "1";
  }, 100);
 
  // Remove depois de 3s
  setTimeout(() => {
    toast.style.transform = "translateX(100%)";
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

