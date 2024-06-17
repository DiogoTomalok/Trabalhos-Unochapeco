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
    console.log('CPF Cliente recebido para busca:', cpf_cliente);

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
        
        if (dados.length > 0) {
            res.json(dados);
        } else {
            res.status(404).send('Dados não encontrados para o CPF fornecido.');
        }
    } catch (err) {
        console.error('Erro ao buscar dados:', err);
        res.status(500).send('Erro ao buscar dados');
    }
});

router.put('/dados', async (req, res) => {
    const {
        nome_sobrenome, cpf_cliente, email_cliente, data_nascimento,
        bairro_cliente, rua_cliente, numero_cliente, cidade_cliente, estado_cliente, cep_cliente,
        nome_usuario, senha_usuario, valor_usuario
    } = req.body;

    console.log('Dados recebidos para atualização:', req.body);

    let client; 

    try {
        client = await pool.connect();

        await client.query('BEGIN');

        const resultPessoal = await client.query(
            'UPDATE dados_pessoal_cliente SET nome_sobrenome = $1, email_cliente = $2, data_nascimento = $3 WHERE cpf_cliente = $4',
            [nome_sobrenome, email_cliente, data_nascimento, cpf_cliente]
        );

        const resultEndereco = await client.query(
            'UPDATE endereco_cliente SET bairro_cliente = $1, rua_cliente = $2, numero_cliente = $3, cidade_cliente = $4, estado_cliente = $5, cep_cliente = $6 WHERE cpf_cliente = $7',
            [bairro_cliente, rua_cliente, numero_cliente, cidade_cliente, estado_cliente, cep_cliente, cpf_cliente]
        );

        const resultUsuario = await client.query(
            'UPDATE usuario SET nome_usuario = $1, senha_usuario = $2, valor_usuario = $3 WHERE cpf_cliente = $4',
            [nome_usuario, senha_usuario, valor_usuario, cpf_cliente]
        );

        await client.query('COMMIT');

        console.log('Resultado atualização dados_pessoal_cliente:', resultPessoal);
        console.log('Resultado atualização endereco_cliente:', resultEndereco);
        console.log('Resultado atualização usuario:', resultUsuario);

        client.release();
        res.sendStatus(200);
    } catch (err) {
        console.error('Erro ao atualizar dados:', err);
        if (client) await client.query('ROLLBACK');
        res.status(500).send(err.message || 'Erro ao atualizar dados');
    }
});

module.exports = router;
