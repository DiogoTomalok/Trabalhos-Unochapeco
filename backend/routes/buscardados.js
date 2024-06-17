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

router.get('/dados', async (req, res) => {
    const { cpf_cliente } = req.query;

    try {
        const client = await pool.connect();

        const resultDadosPessoais = await client.query('SELECT * FROM dados_pessoal_cliente WHERE cpf_cliente = $1', [cpf_cliente]);
        const resultEndereco = await client.query('SELECT * FROM endereco_cliente WHERE cpf_cliente = $1', [cpf_cliente]);
        const resultUsuario = await client.query('SELECT * FROM usuario WHERE cpf_cliente = $1', [cpf_cliente]);

        const dados = resultDadosPessoais.rows.map(row => ({
            ...row,
            ...resultEndereco.rows.find(e => e.cpf_cliente === row.cpf_cliente),
            ...resultUsuario.rows.find(u => u.cpf_cliente === row.cpf_cliente)
        }));

        client.release();
        res.json(dados);
    } catch (err) {
        console.error('Erro ao buscar dados:', err);
        res.status(500).send('Erro ao buscar dados');
    }
});

router.delete('/dados', async (req, res) => {
    const { cpf_cliente } = req.query;
    let client;

    try {
        client = await pool.connect();

        await client.query('BEGIN');

        // Primeiro, exclua as referências na tabela "usuario"
        await client.query('DELETE FROM usuario WHERE cpf_cliente = $1', [cpf_cliente]);

        // Em seguida, exclua as referências na tabela "endereco_cliente"
        await client.query('DELETE FROM endereco_cliente WHERE cpf_cliente = $1', [cpf_cliente]);

        // Finalmente, exclua os dados na tabela "dados_pessoal_cliente"
        await client.query('DELETE FROM dados_pessoal_cliente WHERE cpf_cliente = $1', [cpf_cliente]);

        await client.query('COMMIT');

        client.release();
        res.sendStatus(200);
    } catch (err) {
        console.error('Erro ao excluir dados:', err);
        if (client) {
            await client.query('ROLLBACK');
            client.release();
        }
        res.status(500).send('Erro ao excluir dados');
    }
});

module.exports = router;
