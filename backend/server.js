const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const axios = require('axios'); // Importa o axios para fazer a requisição HTTP

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos da pasta raiz do projeto (onde está index.html)
app.use(express.static(path.join(__dirname, '../')));

// Rota de teste
app.get('/api/teste', (req, res) => {
    res.json({ mensagem: 'API funcionando!' });
});

// Rota de notícias - AGORA DINÂMICA (NewsAPI)
app.get('/api/noticias', async (req, res) => {
    try {
        // Verifica se a chave da API está configurada
        if (!process.env.NEWS_API_KEY) {
            console.error('❌ NEWS_API_KEY não configurada no arquivo .env');
            return res.status(500).json({
                erro: 'Chave da API não configurada',
                mensagem: 'Configure a chave no arquivo .env'
            });
        }

        console.log('🔍 Buscando notícias na NewsAPI...');
        const response = await axios.get('https://newsapi.org/v2/everything', {
            params: {
                q: 'cybersecurity OR hacking OR ransomware OR phishing OR malware',
                language: 'pt',
                sortBy: 'publishedAt',
                pageSize: 10,
                apiKey: process.env.NEWS_API_KEY
            }
        });

        console.log('✅ Notícias obtidas com sucesso!');
        const noticias = response.data.articles.map((article, index) => ({
            id: index + 1,
            titulo: article.title,
            resumo: article.description || 'Leia mais...',
            data: article.publishedAt ? article.publishedAt.split('T')[0] : new Date().toISOString().split('T')[0],
            fonte: article.source?.name || 'Fonte desconhecida',
            url: article.url || '#',
            imagem: article.urlToImage || null
        }));

        res.json(noticias);

    } catch (error) {
        console.error('❌ Erro ao acessar a NewsAPI:');
        console.error('Mensagem:', error.message);

        // Se houver resposta da API com detalhes do erro, mostra também
        if (error.response) {
            console.error('Status HTTP:', error.response.status);
            console.error('Dados do erro:', error.response.data);
        }

        // Retorna um erro amigável para o frontend
        res.status(500).json({
            erro: 'Falha ao buscar notícias',
            detalhe: error.message,
            sugestao: 'Verifique sua chave da API e a conexão com a internet'
        });
    }
});

// Rota raiz (opcional, mas explícita)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor rodando na porta ${PORT}`);
    console.log(`📍 Teste: http://localhost:${PORT}/api/teste`);
    console.log(`📍 Notícias: http://localhost:${PORT}/api/noticias`);
    console.log(`📍 Site: http://localhost:${PORT}/`);
});