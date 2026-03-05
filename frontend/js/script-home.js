document.addEventListener('DOMContentLoaded', carregarNoticias);

async function carregarNoticias() {
    const container = document.querySelector('.news');
    if (!container) return;

    container.innerHTML = '<p style="text-align: center; padding: 20px; color: #f0f0f0;">🔄 Carregando notícias...</p>';

    try {
        const response = await fetch('/api/noticias');
        if (!response.ok) throw new Error('Erro na requisição');
        const noticias = await response.json();

        if (noticias.length === 0) {
            container.innerHTML = '<p style="text-align: center; padding: 20px; color: #999;">Nenhuma notícia encontrada.</p>';
            return;
        }

        exibirNoticias(noticias, container);
    } catch (error) {
        console.error('Erro ao carregar notícias:', error);
        container.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <p style="color: #ff3131;">❌ Erro ao carregar notícias</p>
                <button onclick="carregarNoticias()" style="
                    background: #5170ff;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    margin-top: 10px;
                    cursor: pointer;
                    font-family: 'League Spartan', sans-serif;
                ">Tentar novamente</button>
            </div>
        `;
    }
}

function exibirNoticias(noticias, container) {
    let html = '';

    noticias.forEach(noticia => {
        html += `
            <div class="card-noticia" style="
                background: #181818;
                border-radius: 8px;
                overflow: hidden;
                margin-bottom: 15px;
                border: 1px solid transparent;
                transition: all 0.3s ease;
            "
            onmouseover="this.style.borderColor='#5170ff'"
            onmouseout="this.style.borderColor='transparent'">
                
                ${noticia.imagem ? `
                    <img src="${noticia.imagem}" alt="${noticia.titulo}" style="width: 100%; height: 200px; object-fit: cover;">
                ` : `
                    <div style="
                        width: 100%;
                        height: 200px;
                        background: linear-gradient(135deg, #070707 0%, #181818 100%), url('/frontend/css/imagens/secure_icon.svg');
                        background-size: cover, 100px;
                        background-position: center;
                        background-blend-mode: overlay;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #5170ff;
                        font-size: 1.5rem;
                        text-shadow: 2px 2px 4px #000;
                    ">
                        SecureFeed
                    </div>
                `}

                <div style="padding: 20px;">
                    <p style="color: #5170ff; margin: 0 0 10px 0;">📰 ${noticia.fonte || 'SecureFeed'}</p>
                    <h3 style="color: #f0f0f0; margin: 0 0 10px 0; font-size: 1.2rem;">${noticia.titulo}</h3>
                    <p style="color: #999; margin: 0 0 15px 0; line-height: 1.5;">${noticia.resumo || 'Leia mais...'}</p>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #666;">📅 ${new Date(noticia.data).toLocaleDateString('pt-BR')}</span>
                        ${noticia.url && noticia.url !== '#' ? `
                            <a href="${noticia.url}" target="_blank" rel="noopener noreferrer" style="
                                background: #5170ff;
                                color: white;
                                padding: 8px 16px;
                                border-radius: 4px;
                                text-decoration: none;
                                font-weight: 500;
                                transition: opacity 0.3s;
                            " onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
                                Ler mais →
                            </a>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}