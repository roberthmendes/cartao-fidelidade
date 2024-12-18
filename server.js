const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Simulação de "banco de dados" em memória
// Em um cenário real, substitua por um banco de dados.
const clientes = {};

// Função para determinar status e desconto
function determinarStatus(pontos) {
  if (pontos >= 1500) {
    return { status: "Diamante", desconto: 20 };
  } else if (pontos >= 1000) {
    return { status: "Ouro", desconto: 15 };
  } else if (pontos >= 500) {
    return { status: "Prata", desconto: 10 };
  } else {
    return { status: "Bronze", desconto: 5 };
  }
}

// Inicializa cliente caso não exista
function initCliente(cliente_id) {
  if (!clientes[cliente_id]) {
    clientes[cliente_id] = { pontos: 0, status: "Bronze", desconto: 5 };
  }
}

// Endpoint para obter pontos, status e desconto de um cliente
app.get('/pontos', (req, res) => {
  const { cliente_id } = req.query;
  
  if (!cliente_id) {
    return res.status(400).json({ erro: 'cliente_id é obrigatório' });
  }

  initCliente(cliente_id);
  
  const cliente = clientes[cliente_id];
  res.json({
    pontos: cliente.pontos,
    status: cliente.status,
    desconto: cliente.desconto
  });
});

// Endpoint para atualizar pontos de um cliente
app.post('/pontos', (req, res) => {
  const { cliente_id, pontos_adicionais } = req.body;

  if (!cliente_id || typeof pontos_adicionais !== 'number') {
    return res.status(400).json({ erro: 'cliente_id e pontos_adicionais são obrigatórios' });
  }

  initCliente(cliente_id);

  // Atualiza pontos
  const cliente = clientes[cliente_id];
  cliente.pontos += pontos_adicionais;

  // Recalcula status e desconto
  const { status, desconto } = determinarStatus(cliente.pontos);
  cliente.status = status;
  cliente.desconto = desconto;

  res.json({
    pontos: cliente.pontos,
    status: cliente.status,
    desconto: cliente.desconto
  });
});

// Porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});