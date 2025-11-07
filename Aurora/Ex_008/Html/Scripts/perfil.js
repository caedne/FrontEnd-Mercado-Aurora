// Verificar se usuário está logado
let usuarioLogado = null;
let perfilCompleto = null;

// Inicializar página
document.addEventListener('DOMContentLoaded', function() {
  verificarLogin();
  carregarDadosUsuario();
  setupEventListeners();
});

// Verificar se o usuário está logado
function verificarLogin() {
  const userLogado = localStorage.getItem('usuarioLogado');
  
  if (!userLogado) {
    alert('Você precisa estar logado para acessar esta página.');
    window.location.href = 'login.html';
    return;
  }
  
  usuarioLogado = JSON.parse(userLogado);
}

// Carregar dados do usuário
function carregarDadosUsuario() {
  // Buscar perfil completo do localStorage
  const perfis = JSON.parse(localStorage.getItem('perfisUsuarios') || '{}');
  perfilCompleto = perfis[usuarioLogado.id] || {
    id: usuarioLogado.id,
    nome: usuarioLogado.nome,
    email: usuarioLogado.email,
    sobrenome: '',
    telefone: '',
    cpf: '',
    dataNascimento: '',
    enderecos: [],
    pedidos: [],
    configuracoes: {
      notifMarketing: true,
      notifPedidos: true
    },
    stats: {
      totalPedidos: 0,
      totalEconomia: 0,
      pontosFidelidade: 0
    }
  };

  // Atualizar interface
  atualizarAvatar();
  atualizarDadosPessoais();
  atualizarEstatisticas();
  carregarEnderecos();
  carregarPedidos();
  carregarConfiguracoes();
}

// Atualizar avatar e informações básicas
function atualizarAvatar() {
  const inicial = usuarioLogado.nome.charAt(0).toUpperCase();
  document.getElementById('avatar-inicial').textContent = inicial;
  document.getElementById('nome-usuario').textContent = usuarioLogado.nome;
  document.getElementById('email-usuario').textContent = usuarioLogado.email;
  
  // Data de cadastro
  const dataCadastro = new Date(usuarioLogado.loginTime || Date.now());
  const mes = dataCadastro.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  document.getElementById('data-cadastro').textContent = mes;
}

// Atualizar dados pessoais no formulário
function atualizarDadosPessoais() {
  const nomeCompleto = perfilCompleto.nome.split(' ');
  document.getElementById('nome').value = nomeCompleto[0] || '';
  document.getElementById('sobrenome').value = nomeCompleto.slice(1).join(' ') || perfilCompleto.sobrenome || '';
  document.getElementById('email-perfil').value = perfilCompleto.email;
  document.getElementById('telefone').value = perfilCompleto.telefone || '';
  document.getElementById('cpf').value = perfilCompleto.cpf || '';
  document.getElementById('data-nascimento').value = perfilCompleto.dataNascimento || '';
}

// Atualizar estatísticas
function atualizarEstatisticas() {
  document.getElementById('total-pedidos').textContent = perfilCompleto.stats.totalPedidos;
  document.getElementById('total-economia').textContent = `R$ ${perfilCompleto.stats.totalEconomia.toFixed(2)}`;
  document.getElementById('pontos-fidelidade').textContent = perfilCompleto.stats.pontosFidelidade;
}

// Setup Event Listeners
function setupEventListeners() {
  // Menu de navegação das abas
  document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      mudarAba(this.dataset.tab);
    });
  });

  // Editar dados pessoais
  document.getElementById('btn-editar-dados').addEventListener('click', habilitarEdicaoDados);
  document.getElementById('btn-cancelar-dados').addEventListener('click', cancelarEdicaoDados);
  document.getElementById('form-dados-pessoais').addEventListener('submit', salvarDadosPessoais);

  // Endereços
  document.getElementById('btn-adicionar-endereco').addEventListener('click', abrirModalEndereco);
  document.getElementById('form-endereco').addEventListener('submit', salvarEndereco);

  // Senha
  document.getElementById('btn-alterar-senha').addEventListener('click', abrirModalSenha);
  document.getElementById('form-senha').addEventListener('submit', alterarSenha);

  // Configurações
  document.getElementById('notif-marketing').addEventListener('change', salvarConfiguracoes);
  document.getElementById('notif-pedidos').addEventListener('change', salvarConfiguracoes);
  
  // Excluir conta
  document.getElementById('btn-excluir-conta').addEventListener('click', excluirConta);

  // Logout
  document.getElementById('btn-logout').addEventListener('click', logout);

  // Modais
  document.querySelectorAll('.modal-close, .btn-cancelar').forEach(btn => {
    btn.addEventListener('click', fecharModais);
  });

  // CEP Autocomplete
  document.getElementById('cep-endereco').addEventListener('blur', buscarCEP);
}

// Mudar aba
function mudarAba(tab) {
  // Atualizar menu
  document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

  // Atualizar conteúdo
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  document.getElementById(`tab-${tab}`).classList.add('active');
}

// ========== DADOS PESSOAIS ==========

function habilitarEdicaoDados() {
  document.querySelectorAll('#form-dados-pessoais input').forEach(input => {
    if (input.id !== 'email-perfil') { // Email não pode ser editado
      input.disabled = false;
    }
  });
  document.getElementById('btn-editar-dados').style.display = 'none';
  document.getElementById('acoes-dados').style.display = 'flex';
}

function cancelarEdicaoDados() {
  document.querySelectorAll('#form-dados-pessoais input').forEach(input => {
    input.disabled = true;
  });
  document.getElementById('btn-editar-dados').style.display = 'block';
  document.getElementById('acoes-dados').style.display = 'none';
  atualizarDadosPessoais(); // Restaurar valores originais
}

function salvarDadosPessoais(e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const sobrenome = document.getElementById('sobrenome').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const cpf = document.getElementById('cpf').value.trim();
  const dataNascimento = document.getElementById('data-nascimento').value;

  // Atualizar perfil
  perfilCompleto.nome = `${nome} ${sobrenome}`;
  perfilCompleto.sobrenome = sobrenome;
  perfilCompleto.telefone = telefone;
  perfilCompleto.cpf = cpf;
  perfilCompleto.dataNascimento = dataNascimento;

  // Atualizar usuário logado
  usuarioLogado.nome = perfilCompleto.nome;

  // Salvar
  salvarPerfil();
  
  // Atualizar interface
  document.getElementById('nome-usuario').textContent = perfilCompleto.nome;
  
  cancelarEdicaoDados();
  mostrarNotificacao('Dados atualizados com sucesso!', 'success');
}

// ========== ENDEREÇOS ==========

function carregarEnderecos() {
  const listaEnderecos = document.getElementById('lista-enderecos');
  
  if (!perfilCompleto.enderecos || perfilCompleto.enderecos.length === 0) {
    listaEnderecos.innerHTML = `
      <div class="endereco-vazio">
        <div class="endereco-vazio-icon">📍</div>
        <h3>Nenhum endereço cadastrado</h3>
        <p>Adicione um endereço para facilitar suas compras</p>
      </div>
    `;
    return;
  }

  listaEnderecos.innerHTML = '';
  perfilCompleto.enderecos.forEach((endereco, index) => {
    const enderecoHTML = `
      <div class="endereco-item ${endereco.principal ? 'principal' : ''}">
        <div class="endereco-header">
          <span class="endereco-nome">${endereco.nome}</span>
          ${endereco.principal ? '<span class="endereco-principal-badge">Principal</span>' : ''}
        </div>
        <div class="endereco-info">
          <p>${endereco.rua}, ${endereco.numero}</p>
          ${endereco.complemento ? `<p>${endereco.complemento}</p>` : ''}
          <p>${endereco.bairro} - ${endereco.cidade}</p>
          <p>CEP: ${endereco.cep}</p>
        </div>
        <div class="endereco-acoes">
          ${!endereco.principal ? `<button class="btn-secundario" onclick="definirEnderecoPrincipal(${index})">Definir como Principal</button>` : ''}
          <button class="btn-danger" onclick="removerEndereco(${index})">Remover</button>
        </div>
      </div>
    `;
    listaEnderecos.innerHTML += enderecoHTML;
  });
}

function abrirModalEndereco() {
  document.getElementById('modal-endereco').style.display = 'block';
}

function salvarEndereco(e) {
  e.preventDefault();

  const novoEndereco = {
    nome: document.getElementById('nome-endereco').value.trim(),
    cep: document.getElementById('cep-endereco').value.trim(),
    rua: document.getElementById('rua-endereco').value.trim(),
    numero: document.getElementById('numero-endereco').value.trim(),
    bairro: document.getElementById('bairro-endereco').value.trim(),
    cidade: document.getElementById('cidade-endereco').value.trim(),
    complemento: document.getElementById('complemento-endereco').value.trim(),
    principal: document.getElementById('endereco-principal').checked
  };

  // Se for principal, remover flag dos outros
  if (novoEndereco.principal) {
    perfilCompleto.enderecos.forEach(end => end.principal = false);
  }

  // Se for o primeiro endereço, define como principal
  if (perfilCompleto.enderecos.length === 0) {
    novoEndereco.principal = true;
  }

  perfilCompleto.enderecos.push(novoEndereco);
  salvarPerfil();
  carregarEnderecos();
  fecharModais();
  document.getElementById('form-endereco').reset();
  mostrarNotificacao('Endereço adicionado com sucesso!', 'success');
}

function definirEnderecoPrincipal(index) {
  perfilCompleto.enderecos.forEach((end, i) => {
    end.principal = i === index;
  });
  salvarPerfil();
  carregarEnderecos();
  mostrarNotificacao('Endereço principal atualizado!', 'success');
}

function removerEndereco(index) {
  if (confirm('Tem certeza que deseja remover este endereço?')) {
    perfilCompleto.enderecos.splice(index, 1);
    
    // Se removeu o principal e tem outros, define o primeiro como principal
    if (perfilCompleto.enderecos.length > 0 && !perfilCompleto.enderecos.some(e => e.principal)) {
      perfilCompleto.enderecos[0].principal = true;
    }
    
    salvarPerfil();
    carregarEnderecos();
    mostrarNotificacao('Endereço removido!', 'success');
  }
}

// Buscar CEP (API ViaCEP)
function buscarCEP() {
  const cep = document.getElementById('cep-endereco').value.replace(/\D/g, '');
  
  if (cep.length !== 8) return;

  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(response => response.json())
    .then(data => {
      if (!data.erro) {
        document.getElementById('rua-endereco').value = data.logradouro || '';
        document.getElementById('bairro-endereco').value = data.bairro || '';
        document.getElementById('cidade-endereco').value = data.localidade || '';
        document.getElementById('numero-endereco').focus();
      }
    })
    .catch(err => console.log('Erro ao buscar CEP:', err));
}

// ========== PEDIDOS ==========

function carregarPedidos() {
  const listaPedidos = document.getElementById('lista-pedidos');
  
  if (!perfilCompleto.pedidos || perfilCompleto.pedidos.length === 0) {
    listaPedidos.innerHTML = `
      <div class="pedidos-vazio">
        <div class="pedidos-vazio-icon">📦</div>
        <h3>Nenhum pedido encontrado</h3>
        <p>Quando você fizer pedidos, eles aparecerão aqui</p>
        <a href="produtos.html" class="btn-primario">Fazer Primeiro Pedido</a>
      </div>
    `;
    return;
  }

  listaPedidos.innerHTML = '';
  perfilCompleto.pedidos.forEach(pedido => {
    const pedidoHTML = `
      <div class="pedido-item">
        <div class="pedido-header">
          <span class="pedido-numero">#${pedido.numero}</span>
          <span class="pedido-status ${pedido.status}">${pedido.status}</span>
        </div>
        <div class="pedido-info">
          <p><strong>Data:</strong> ${new Date(pedido.data).toLocaleDateString('pt-BR')}</p>
          <p><strong>Total:</strong> R$ ${pedido.total.toFixed(2)}</p>
          <p><strong>Itens:</strong> ${pedido.itens} produto(s)</p>
        </div>
      </div>
    `;
    listaPedidos.innerHTML += pedidoHTML;
  });
}

// ========== CONFIGURAÇÕES ==========

function carregarConfiguracoes() {
  document.getElementById('notif-marketing').checked = perfilCompleto.configuracoes.notifMarketing;
  document.getElementById('notif-pedidos').checked = perfilCompleto.configuracoes.notifPedidos;
}

function salvarConfiguracoes() {
  perfilCompleto.configuracoes.notifMarketing = document.getElementById('notif-marketing').checked;
  perfilCompleto.configuracoes.notifPedidos = document.getElementById('notif-pedidos').checked;
  salvarPerfil();
  mostrarNotificacao('Configurações salvas!', 'success');
}

function abrirModalSenha() {
  document.getElementById('modal-senha').style.display = 'block';
}

function alterarSenha(e) {
  e.preventDefault();

  const senhaAtual = document.getElementById('senha-atual').value;
  const novaSenha = document.getElementById('nova-senha').value;
  const confirmarSenha = document.getElementById('confirmar-senha').value;

  // Buscar usuário no localStorage
  const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
  const usuario = usuarios.find(u => u.id === usuarioLogado.id);

  if (!usuario || usuario.senha !== senhaAtual) {
    mostrarNotificacao('Senha atual incorreta!', 'error');
    return;
  }

  if (novaSenha.length < 6) {
    mostrarNotificacao('A nova senha deve ter pelo menos 6 caracteres!', 'error');
    return;
  }

  if (novaSenha !== confirmarSenha) {
    mostrarNotificacao('As senhas não coincidem!', 'error');
    return;
  }

  // Atualizar senha
  usuario.senha = novaSenha;
  localStorage.setItem('usuarios', JSON.stringify(usuarios));

  fecharModais();
  document.getElementById('form-senha').reset();
  mostrarNotificacao('Senha alterada com sucesso!', 'success');
}

function excluirConta() {
  const confirmacao = prompt('Esta ação é irreversível! Digite "EXCLUIR" para confirmar:');
  
  if (confirmacao === 'EXCLUIR') {
    // Remover perfil
    const perfis = JSON.parse(localStorage.getItem('perfisUsuarios') || '{}');
    delete perfis[usuarioLogado.id];
    localStorage.setItem('perfisUsuarios', JSON.stringify(perfis));

    // Remover usuário
    let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    usuarios = usuarios.filter(u => u.id !== usuarioLogado.id);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    // Fazer logout
    localStorage.removeItem('usuarioLogado');
    alert('Conta excluída com sucesso.');
    window.location.href = 'index.html';
  }
}

// ========== UTILITÁRIOS ==========

function salvarPerfil() {
  const perfis = JSON.parse(localStorage.getItem('perfisUsuarios') || '{}');
  perfis[usuarioLogado.id] = perfilCompleto;
  localStorage.setItem('perfisUsuarios', JSON.stringify(perfis));

  // Atualizar também o usuarioLogado
  localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
}

function fecharModais() {
  document.querySelectorAll('.modal').forEach(modal => {
    modal.style.display = 'none';
  });
}

function mostrarNotificacao(mensagem, tipo = 'success') {
  const notificacao = document.createElement('div');
  notificacao.className = `notificacao ${tipo}`;
  notificacao.textContent = mensagem;
  notificacao.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    color: white;
    font-weight: bold;
    z-index: 9999;
    animation: slideIn 0.3s ease;
    ${tipo === 'success' ? 'background: #4CAF50;' : 'background: #f44336;'}
  `;
  
  document.body.appendChild(notificacao);
  
  setTimeout(() => {
    notificacao.remove();
  }, 3000);
}

function logout() {
  if (confirm('Tem certeza que deseja sair?')) {
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'login.html';
  }
}

// Fechar modal ao clicar fora
window.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal')) {
    fecharModais();
  }
});

console.log('Perfil carregado:', perfilCompleto);