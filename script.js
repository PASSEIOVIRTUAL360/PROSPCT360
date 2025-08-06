const { jsPDF } = window.jspdf;

const catalogo = document.getElementById('catalogo');
const totalSpan = document.getElementById('total');
const descontoInput = document.getElementById('desconto');
const formModal = document.getElementById('formulario');

const servicos = [
  { nome: "Tour Virtual 360°", preco: 800, icone: "📸" },
  { nome: "Vídeo Drone", preco: 1200, icone: "🚁" },
  { nome: "Consultoria GMB", preco: 450, icone: "🧠" },
];

let selecionados = [];
let logoBase64 = null;

document.getElementById('upload-logo').addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onloadend = () => {
    logoBase64 = reader.result;
  };
  if (file) reader.readAsDataURL(file);
});

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

function abrirFormulario() {
  formModal.style.display = 'flex';
}

function fecharFormulario() {
  formModal.style.display = 'none';
}

function gerarPDF() {
  const doc = new jsPDF();

  const contratada = document.getElementById("contratada").value;
  const contratante = document.getElementById("contratante").value;
  const empresa = document.getElementById("empresa").value;
  const contato = document.getElementById("contato").value;
  const email = document.getElementById("email").value;
  const local = document.getElementById("local").value;
  const pagamento = document.getElementById("pagamento").value;
  const validade = document.getElementById("validade").value;

  if (logoBase64) {
    doc.addImage(logoBase64, "PNG", 10, 10, 50, 20);
  }

  doc.setFontSize(14);
  doc.text("Nossa Proposta Comercial", 70, 30);
  doc.setFontSize(10);
  doc.text(`CONTRATADA: ${contratada}`, 10, 50);
  doc.text(`CONTRATANTE: ${contratante}`, 10, 58);
  doc.text(`EMPRESA: ${empresa}`, 10, 66);
  doc.text(`CONTATO: ${contato}`, 10, 74);
  doc.text(`EMAIL: ${email}`, 10, 82);
  doc.text(`LOCAL: ${local}`, 10, 90);
  doc.text(`Validade da Proposta: ${validade} dias`, 10, 98);

  doc.text("Resumo dos Serviços Selecionados:", 10, 110);
  let y = 118;
  let total = 0;

  selecionados.forEach(i => {
    const s = servicos[i];
    doc.text(`${s.nome} - R$ ${s.preco.toFixed(2)}`, 12, y);
    y += 8;
    total += s.preco;
  });

  const desconto = parseFloat(descontoInput.value || 0);
  const totalComDesconto = desconto > 0 ? total - (total * (desconto / 100)) : total;

  y += 10;
  doc.text(`Subtotal: R$ ${total.toFixed(2)}`, 10, y);
  y += 8;
  if (desconto > 0) {
    doc.text(`Desconto: ${desconto}%`, 10, y);
    y += 8;
  }
  doc.text(`Total Estimado: R$ ${totalComDesconto.toFixed(2)}`, 10, y);
  y += 8;
  doc.text(`Forma de Pagamento: ${pagamento}`, 10, y);

  doc.setFontSize(8);
  doc.text("Gerado com iAPNL – Catálogo de Serviços Profissionais", 10, 285);

  doc.save("Nossa_Proposta_Comercial.pdf");
  fecharFormulario();
}

function editar(index) {
  alert("Edição em breve: " + servicos[index].nome);
}

document.getElementById('theme-toggle').onclick = () => {
  document.body.classList.toggle('dark');
};

renderCatalogo();
