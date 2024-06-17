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

// Função para obter todos os dados do cliente, endereço e compra
async function getAllData() {
    try {
        const client = await pool.connect();
        
        // Consultas SQL para recuperar os dados das tabelas cliente, endereco e compra
        const [clientes, enderecos, compras] = await Promise.all([
            client.query('SELECT * FROM cliente'),
            client.query('SELECT * FROM endereco'),
            client.query('SELECT * FROM compra')
        ]);

        client.release();
        
        const data = {
            clientes: clientes.rows,
            enderecos: enderecos.rows,
            compras: compras.rows
        };

        return data;
    } catch (err) {
        console.error('Erro ao obter dados do banco:', err);
        throw err;
    }
}

// Rota para obter os dados do cliente, endereço e compra em formato JSON
router.get('/data', async (req, res) => {
    try {
        const data = await getAllData();
        res.json(data); // Retorna os dados do cliente, endereço e compra em formato JSON
    } catch (err) {
        console.error('Erro ao obter dados do banco:', err);
        res.status(500).send('Erro ao obter dados do banco');
    }
});

module.exports = router;
