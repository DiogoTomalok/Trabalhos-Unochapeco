
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

        // Verificar se o CPF já existe no banco de dados
        const checkCPFQuery = 'SELECT * FROM dados_pessoal_cliente WHERE cpf_cliente = $1';
        const { rows } = await client.query(checkCPFQuery, [cpf_cliente]);

        if (rows.length > 0) {
            // Se o CPF já existir, atualiza os dados do cliente
            const updateDadosPessoaisQuery = `UPDATE dados_pessoal_cliente
                                              SET nome_sobrenome = $1, email_cliente = $2, data_nascimento = $3
                                              WHERE cpf_cliente = $4`;
            await client.query(updateDadosPessoaisQuery, [nome_sobrenome, email_cliente, data_nascimento, cpf_cliente]);

            const updateEnderecoQuery = `UPDATE endereco_cliente
                                         SET bairro_cliente = $1, rua_cliente = $2, numero_cliente = $3,
                                             cidade_cliente = $4, estado_cliente = $5, cep_cliente = $6
                                         WHERE cpf_cliente = $7`;
            await client.query(updateEnderecoQuery, [bairro_cliente, rua_cliente, numero_cliente, cidade_cliente, estado_cliente, cep_cliente, cpf_cliente]);

            const updateUsuarioQuery = `UPDATE usuario
                                        SET nome_usuario = $1, senha_usuario = $2, valor_usuario = $3
                                        WHERE cpf_cliente = $4`;
            await client.query(updateUsuarioQuery, [nome_usuario, senha_usuario, valor_usuario, cpf_cliente]);
        } else {
            // Se o CPF não existir, insere um novo registro
            const insertDadosPessoaisQuery = 'INSERT INTO dados_pessoal_cliente (nome_sobrenome, cpf_cliente, email_cliente, data_nascimento) VALUES ($1, $2, $3, $4)';
            await client.query(insertDadosPessoaisQuery, [nome_sobrenome, cpf_cliente, email_cliente, data_nascimento]);

            const insertEnderecoQuery = 'INSERT INTO endereco_cliente (cpf_cliente, bairro_cliente, rua_cliente, numero_cliente, cidade_cliente, estado_cliente, cep_cliente) VALUES ($1, $2, $3, $4, $5, $6, $7)';
            await client.query(insertEnderecoQuery, [cpf_cliente, bairro_cliente, rua_cliente, numero_cliente, cidade_cliente, estado_cliente, cep_cliente]);

            const insertUsuarioQuery = 'INSERT INTO usuario (nome_usuario, senha_usuario, valor_usuario, cpf_cliente) VALUES ($1, $2, $3, $4)';
            await client.query(insertUsuarioQuery, [nome_usuario, senha_usuario, valor_usuario, cpf_cliente]);
        }

        await client.query('COMMIT');

        client.release();
        res.send('Dados inseridos/atualizados com sucesso!');
    } catch (err) {
        console.error('Erro ao inserir/atualizar dados:', err);
        res.status(500).send('Erro ao inserir/atualizar dados');
    }
});

module.exports = router;
