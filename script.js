// ===== CONFIGURAÇÕES =====
// Margem de perda aplicada em todos os cálculos (10%)
const PERDA = 1.1;

// Consumo aproximado por m³ de concreto no traço 1:2:3
const CONSUMO_CONCRETO = {
  cimentoSacos: 7,  // sacos de 50 kg
  areia: 0.6,       // m³
  brita: 0.8,       // m³
};

// ===== FUNÇÕES AUXILIARES =====

// Pega o valor de um campo pelo id e transforma em número
function lerNumero(id) {
  return Number(document.getElementById(id).value);
}

// Formata números no padrão brasileiro (ex.: 1.234,56)
function formatar(numero, casas = 2) {
  return numero.toLocaleString('pt-BR', {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  });
}

// Escreve a lista de resultados dentro do card e mostra o bloco
function mostrarResultado(id, itens) {
  const caixa = document.getElementById(id);
  const linhas = itens
    .map((item) => `<li>${item.nome}: <strong>${item.valor}</strong></li>`)
    .join('');
  caixa.innerHTML = `<ul>${linhas}</ul>`;
  caixa.classList.add('visivel');
}

// ===== CALCULADORA 1: CONCRETO =====
document.getElementById('form-concreto').addEventListener('submit', (evento) => {
  evento.preventDefault(); // impede a página de recarregar ao enviar o formulário

  const volume =
    lerNumero('concreto-comprimento') *
    lerNumero('concreto-largura') *
    lerNumero('concreto-altura') *
    PERDA;

  mostrarResultado('resultado-concreto', [
    { nome: 'Volume de concreto', valor: `${formatar(volume)} m³` },
    { nome: 'Cimento', valor: `${Math.ceil(volume * CONSUMO_CONCRETO.cimentoSacos)} sacos de 50 kg` },
    { nome: 'Areia', valor: `${formatar(volume * CONSUMO_CONCRETO.areia)} m³` },
    { nome: 'Brita', valor: `${formatar(volume * CONSUMO_CONCRETO.brita)} m³` },
  ]);
});

// ===== CALCULADORA 2: TIJOLOS E BLOCOS =====
document.getElementById('form-tijolos').addEventListener('submit', (evento) => {
  evento.preventDefault();

  const areaTotal = lerNumero('parede-comprimento') * lerNumero('parede-altura');
  const areaUtil = areaTotal - lerNumero('parede-aberturas');

  // Validação: aberturas não podem ser maiores que a parede
  if (areaUtil <= 0) {
    mostrarResultado('resultado-tijolos', [
      { nome: 'Atenção', valor: 'a área de aberturas é maior que a parede' },
    ]);
    return;
  }

  const pecasPorM2 = lerNumero('tipo-tijolo');
  const quantidade = Math.ceil(areaUtil * pecasPorM2 * PERDA);

  mostrarResultado('resultado-tijolos', [
    { nome: 'Área de parede', valor: `${formatar(areaUtil)} m²` },
    { nome: 'Quantidade de peças', valor: `${quantidade.toLocaleString('pt-BR')} unidades` },
  ]);
});

// ===== CALCULADORA 3: ARGAMASSA DE REBOCO =====
document.getElementById('form-reboco').addEventListener('submit', (evento) => {
  evento.preventDefault();

  const area = lerNumero('reboco-area');
  const espessuraMetros = lerNumero('reboco-espessura') / 100; // converte cm para m
  const volume = area * espessuraMetros * PERDA;

  mostrarResultado('resultado-reboco', [
    { nome: 'Volume de argamassa', valor: `${formatar(volume, 3)} m³` },
    { nome: 'Equivale a', valor: `${formatar(volume * 1000, 0)} litros` },
  ]);
});
