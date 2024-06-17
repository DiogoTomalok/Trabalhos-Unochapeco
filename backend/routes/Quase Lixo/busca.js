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

// Função para buscar dados de endereço pelo CPF do cliente
async function buscarEnderecoPorCPF(cpf) {
    try {
        const client = await pool.connect();
        
        // Consulta SQL para buscar dados de endereço pelo CPF do cliente
        const query = {
            text: `
                SELECT *
                FROM endereco_cliente
                WHERE cpf_cliente = $1
            `,
            values: [cpf],
        };
        
        const result = await client.query(query);
        client.release();
        
        return result.rows; // Retorna os dados de endereço encontrados
    } catch (err) {
        console.error('Erro ao buscar dados de endereço por CPF:', err);
        throw err;
    }
}

// Rota para obter os dados de endereço por CPF em formato JSON
router.get('/', async (req, res) => {
    const cpf = req.query.cpf; // CPF fornecido na query da URL (/buscar?cpf=12345678900)
    
    if (!cpf) {
        return res.status(400).send('CPF não fornecido');
    }

    try {
        const enderecoCliente = await buscarEnderecoPorCPF(cpf);
        
        // Verifica se o endereço foi encontrado
        if (enderecoCliente.length === 0) {
            return res.status(404).send('Endereço não encontrado para este CPF');
        }
        
        res.json(enderecoCliente); // Retorna os dados de endereço encontrados em formato JSON
    } catch (err) {
        console.error('Erro ao buscar dados de endereço por CPF:', err);
        res.status(500).send('Erro ao buscar dados de endereço por CPF');
    }
});

module.exports = router;
