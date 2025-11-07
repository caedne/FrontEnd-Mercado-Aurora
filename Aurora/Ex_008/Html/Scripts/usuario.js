// --- Exibir usuário logado ---
function mostrarUsuarioLogado() {
  const usuario = getLoggedUser();
  const container = document.getElementById('usuario-logado');

  if (container && usuario) {
    container.innerHTML = `
      <span>👤 Olá, <strong>${usuario.nome}</strong>!</span>
      <button onclick="logout()" style="margin-left: 10px;">Logout</button>
    `;
  }
}

function getLoggedUser() {
  const user = localStorage.getItem('usuarioLogado');
  return user ? JSON.parse(user) : null;
}

function logout() {
  localStorage.removeItem('usuarioLogado');
  window.location.href = 'login.html';
}

mostrarUsuarioLogado();


// --- Popup de mensagem enviada ---
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-contato");

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const nome = document.getElementById("nome").value;
      mostrarPopup(`✅ Obrigado, ${nome}! Sua mensagem foi enviada com sucesso.`);

      form.reset();
    });
  }
});

function mostrarPopup(texto) {
  // cria o container do popup
  const popup = document.createElement("div");
  popup.textContent = texto;
  popup.style.position = "fixed";
  popup.style.top = "20px";
  popup.style.right = "20px";
  popup.style.backgroundColor = "#4CAF50";
  popup.style.color = "white";
  popup.style.padding = "15px 25px";
  popup.style.borderRadius = "8px";
  popup.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
  popup.style.fontWeight = "bold";
  popup.style.opacity = "0";
  popup.style.transition = "opacity 0.5s ease";
  popup.style.zIndex = "9999";

  document.body.appendChild(popup);

  // animação de entrada
  setTimeout(() => popup.style.opacity = "1", 100);

  // remover depois de alguns segundos
  setTimeout(() => {
    popup.style.opacity = "0";
    setTimeout(() => popup.remove(), 500);
  }, 4000);
}
