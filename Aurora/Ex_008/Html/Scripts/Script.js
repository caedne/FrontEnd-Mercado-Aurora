// ================= REGISTRO ====================
document.getElementById('formRegistro')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;
    const termsAccepted = document.getElementById('terms').checked;

    if (!termsAccepted) {
        alert('Você deve concordar com os Termos e Condições.');
        return;
    }

    if (nome.length < 2) {
        alert('O nome deve ter pelo menos 2 caracteres.');
        return;
    }

    if (senha.length < 6) {
        alert('A senha deve ter pelo menos 6 caracteres.');
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');

    const emailExiste = usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());
    const nomeExiste = usuarios.find(u => u.nome.trim().toLowerCase() === nome.toLowerCase());

    if (emailExiste) {
        alert('Este email já está registrado.');
        return;
    }

    if (nomeExiste) {
        alert('Este nome de usuário já está em uso. Escolha outro.');
        return;
    }

    usuarios.push({
        id: Date.now(),
        nome,
        email,
        senha,
        dataCadastro: new Date().toISOString()
    });

    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    alert('Conta criada com sucesso!');
    window.location.href = 'login.html';
});

// ================= LOGIN ====================
document.getElementById('formLogin')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const senha = document.getElementById('loginSenha').value;

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');

    const user = usuarios.find(u =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.senha === senha
    );

    if (user) {
        localStorage.setItem('usuarioLogado', JSON.stringify({
            id: user.id,
            nome: user.nome,
            email: user.email,
            loginTime: new Date().toISOString()
        }));

        alert(`Bem-vindo(a), ${user.nome}!`);
        window.location.href = 'index.html'; // Redirecionamento após login ✅
    } else {
        alert('Email ou senha incorretos.');
    }
});

// ================= UTILIDADES ====================

function isUserLoggedIn() {
    return localStorage.getItem('usuarioLogado') !== null;
}

function getLoggedUser() {
    const user = localStorage.getItem('usuarioLogado');
    return user ? JSON.parse(user) : null;
}

function logout() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'login.html';
}

function protectPage() {
    if (!isUserLoggedIn()) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = 'login.html';
    }
}

// Se houver botão de logout
document.getElementById('btnLogout')?.addEventListener('click', logout);

// ================= VALIDAÇÃO EM TEMPO REAL ====================

document.getElementById('email')?.addEventListener('input', function () {
    const email = this.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.style.borderColor = email && !emailRegex.test(email) ? '#ff4757' : '';
});

document.getElementById('senha')?.addEventListener('input', function () {
    const senha = this.value;
    this.style.borderColor = senha && senha.length < 6 ? '#ff4757' : '';
});

// ================= MOSTRAR/OCULTAR SENHA ====================
function togglePassword(inputId, buttonId) {
    const input = document.getElementById(inputId);
    const button = document.getElementById(buttonId);
    if (input.type === 'password') {
        input.type = 'text';
        button.textContent = '🙉';
    } else {
        input.type = 'password';
        button.textContent = '🙈';
    }
}

// ================= LIMPAR DADOS ====================

function limparUsuarios() {
    if (confirm('Tem certeza que deseja apagar TODOS os usuários?')) {
        localStorage.removeItem('usuarios');
        alert('Usuários apagados.');
    }
}

function limparTudo() {
    if (confirm('Tem certeza que deseja apagar TODOS os dados (usuários e login)?')) {
        localStorage.removeItem('usuarios');
        localStorage.removeItem('usuarioLogado');
        alert('Todos os dados foram apagados.');
    }
}

// ================= DEBUG ====================
console.log('Sistema de autenticação carregado');
console.log('Usuários cadastrados:', JSON.parse(localStorage.getItem('usuarios') || '[]').length);
