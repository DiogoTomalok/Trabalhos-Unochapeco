const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'webdado', // Nome do banco de dados
    password: 'postgres',
    port: 5432,
});

router.post('/submit', async (req, res) => {
    const { nome, email, data_nascimento, valor_total, data_compra, metodo_pagamento, status_compra, numero, bairro, cidade, estado, cep, cpf } = req.body; // Adicione 'cpf' ao destructuring

    try {
        const client = await pool.connect();

        // Inserir dados na tabela cliente
        const insertClienteQuery = 'INSERT INTO cliente (cpf, nome_sobrenome, email, data_nascimento) VALUES ($1, $2, $3, $4) RETURNING cpf';
        const clienteResult = await client.query(insertClienteQuery, [cpf, nome, email, data_nascimento]); // Use 'cpf' em vez do valor fixo

        const cpfCliente = clienteResult.rows[0].cpf;

        // Inserir dados na tabela compra
        const insertCompraQuery = 'INSERT INTO compra (cpf_cliente, valor_total, data_compra, metodo_pagamento, status_compra) VALUES ($1, $2, $3, $4, $5)';
        await client.query(insertCompraQuery, [cpfCliente, valor_total, data_compra, metodo_pagamento, status_compra]);

        // Inserir dados na tabela endereco
        const insertEnderecoQuery = 'INSERT INTO endereco (id_cliente, numero, bairro, cidade, estado, cep) VALUES ($1, $2, $3, $4, $5, $6)';
        await client.query(insertEnderecoQuery, [cpfCliente, numero, bairro, cidade, estado, cep]);

        client.release();
        res.send('Dados inseridos com sucesso!');
    } catch (err) {
        console.error('Erro ao inserir dados:', err);
        res.status(500).send('Erro ao inserir dados');
    }
});

module.exports = router;
