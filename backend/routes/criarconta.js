const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'webdado',
    password: 'postgres',
    port: 5432,
});

router.post('/submit', async (req, res) => {
    const {
        nome_usuario, senha_usuario, valor_usuario, cpf_cliente,
        nome_sobrenome, email_cliente, data_nascimento,
        bairro_cliente, rua_cliente, numero_cliente, cidade_cliente, estado_cliente, cep_cliente
    } = req.body;

    try {
        const client = await pool.connect();

        await client.query('BEGIN');

        // Inserir dados na tabela dados_pessoal_cliente
        const insertDadosPessoaisQuery = 'INSERT INTO dados_pessoal_cliente (nome_sobrenome, cpf_cliente, email_cliente, data_nascimento) VALUES ($1, $2, $3, $4)';
        await client.query(insertDadosPessoaisQuery, [nome_sobrenome, cpf_cliente, email_cliente, data_nascimento]);

        // Inserir dados na tabela endereco_cliente
        const insertEnderecoQuery = 'INSERT INTO endereco_cliente (cpf_cliente, bairro_cliente, rua_cliente, numero_cliente, cidade_cliente, estado_cliente, cep_cliente) VALUES ($1, $2, $3, $4, $5, $6, $7)';
        await client.query(insertEnderecoQuery, [cpf_cliente, bairro_cliente, rua_cliente, numero_cliente, cidade_cliente, estado_cliente, cep_cliente]);

        // Inserir dados na tabela usuario
        const insertUsuarioQuery = 'INSERT INTO usuario (nome_usuario, senha_usuario, valor_usuario, cpf_cliente) VALUES ($1, $2, $3, $4)';
        await client.query(insertUsuarioQuery, [nome_usuario, senha_usuario, valor_usuario, cpf_cliente]);

        await client.query('COMMIT');

        client.release();
        res.send('Dados inseridos com sucesso!');
    } catch (err) {
        console.error('Erro ao inserir dados:', err);
        res.status(500).send('Erro ao inserir dados');
    }
});

module.exports = router;
