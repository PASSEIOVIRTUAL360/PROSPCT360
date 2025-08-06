const catalogo = document.getElementById('catalogo');
const totalSpan = document.getElementById('total');
const descontoInput = document.getElementById('desconto');
const modalResumo = document.getElementById('modal-resumo');
const resumoItens = document.getElementById('resumo-itens');
const resumoTotal = document.getElementById('resumo-total');

const servicos = [
  { nome: "Tour Virtual 360°", preco: 800, icone: "📸" },
  { nome: "Vídeo Drone", preco: 1200, icone: "🚁" },
  { nome: "Consultoria GMB", preco: 450, icone: "🧠" },
];

let selecionados = [];

function renderCatalogo() {
  catalogo.innerHTML = "";
  servicos.forEach((s, i) => {
    const card = document.createElement('div');
    card.className = 'card';
    if (selecionados.includes(i)) card.classList.add('selecionado');
    card.innerHTML = `
      <button class="edit-btn" onclick="editar(${i})">✏️</button>
      <h2>${s.icone} ${s.nome}</h2>
      <p>R$ ${s.preco.toFixed(2)}</p>
    `;
    card.onclick = () => toggleSelecao(i);
    catalogo.appendChild(card);
  });
  calcularTotal();
}

function toggleSelecao(index) {
  if (selecionados.includes(index)) {
    selecionados = selecionados.filter(i => i !== index);
  } else {
    selecionados.push(index);
  }
  renderCatalogo();
}

function calcularTotal() {
  let total = selecionados.reduce((sum, i) => sum + servicos[i].preco, 0);
  const desconto = parseFloat(descontoInput.value || 0);
  if (!isNaN(desconto) && desconto > 0) {
    total = total - (total * (desconto / 100));
  }
  totalSpan.textContent = total.toFixed(2);
}

descontoInput.oninput = calcularTotal;

function abrirResumo() {
  resumoItens.innerHTML = selecionados.map(i => {
    const s = servicos[i];
    return `<p>${s.nome} - R$ ${s.preco.toFixed(2)}</p>`;
  }).join('');
  resumoTotal.innerHTML = "<strong>Total com desconto:</strong> R$ " + totalSpan.textContent;
  modalResumo.style.display = 'flex';
}

function fecharResumo() {
  modalResumo.style.display = 'none';
}

function gerarPDF() {
  alert("Função de PDF será implementada em breve.");
  fecharResumo();
}

function editar(index) {
  alert("Edição em desenvolvimento: " + servicos[index].nome);
}

document.getElementById('theme-toggle').onclick = () => {
  document.body.classList.toggle('dark');
};

renderCatalogo();
