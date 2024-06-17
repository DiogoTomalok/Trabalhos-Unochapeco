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

// Função para buscar dados do cliente, compra e endereço pelo CPF
async function buscarPorCPF(cpf) {
    try {
        const client = await pool.connect();
        
        // Consulta SQL para buscar dados do cliente, compra e endereço pelo CPF
        const query = {
            text: `
                SELECT c.*, co.*, e.*
                FROM cliente c
                LEFT JOIN compra co ON c.cpf = co.cpf_cliente
                LEFT JOIN endereco e ON c.cpf = e.id_cliente
                WHERE c.cpf = $1
            `,
            values: [cpf],
        };
        
        const result = await client.query(query);
        client.release();
        
        return result.rows; // Retorna os dados do cliente, compra e endereço encontrados
    } catch (err) {
        console.error('Erro ao buscar dados por CPF:', err);
        throw err;
    }
}

// Rota para obter os dados do cliente, compra e endereço por CPF em formato JSON
router.get('/', async (req, res) => {
    const cpf = req.query.cpf; // CPF fornecido na query da URL (/buscar?cpf=12345678900)
    
    if (!cpf) {
        return res.status(400).send('CPF não fornecido');
    }

    try {
        const dadosCliente = await buscarPorCPF(cpf);
        
        // Verifica se o cliente foi encontrado
        if (dadosCliente.length === 0) {
            return res.status(404).send('Cliente não encontrado');
        }
        
        res.json(dadosCliente); // Retorna os dados do cliente, compra e endereço encontrados em formato JSON
    } catch (err) {
        console.error('Erro ao buscar dados do cliente por CPF:', err);
        res.status(500).send('Erro ao buscar dados do cliente por CPF');
    }
});

module.exports = router;
