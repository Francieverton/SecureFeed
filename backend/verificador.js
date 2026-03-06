document.addEventListener('DOMContentLoaded', () => {
    const campoLink = document.querySelector('.campo-link input');
    const botaoVerificar = document.querySelector('.campo-link button');
    const areaResultado = document.querySelector('.result_verificacao');

    //---------------- CHAVE DE API DO GOOGLE SAFE BROWSING ---------------
    const API_KEY = 'APY_KEY_AQUI';

    // ----------------- URL da API do Google Safe Browsing -----------------
    const API_URL = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`;

    areaResultado.style.display = 'none';

    function textoEUmLink(texto) {
        try {
            new URL(texto);
            return true;
        } catch (_) {
            return false;
        }
    }

    botaoVerificar.addEventListener('click', async () => {
        let linkDigitado = campoLink.value.trim();

        if (!linkDigitado) {
            alert('Por favor, insira um link para verificar.');
            return;
        }


        areaResultado.style.display = 'flex';
        areaResultado.innerHTML = '<h1 style="color:white;">Analisando...</h1>';

        try {
            const resultado = await verificarLinkNaAPI(linkDigitado);
            renderizarResultado(resultado);
        } catch (erro) {
            console.error('Erro na verificação:', erro);
            areaResultado.innerHTML = '<h1 style="color:red;">Erro ao conectar com o servidor. Verifique o console.</h1>';
        }
    });

    async function verificarLinkNaAPI(url) {
        const corpoRequisicao = {
            client: {
                clientId: "securefeed-app",
                clientVersion: "1.0.0"
            },
            threatInfo: {
                threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
                platformTypes: ["ANY_PLATFORM"],
                threatEntryTypes: ["URL"],
                threatEntries: [
                    { "url": url }
                ]
            }
        };

        const resposta = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(corpoRequisicao)
        });

        if (!resposta.ok) {
            throw new Error(`Erro na API: ${resposta.status}`);
        }

        const dados = await resposta.json();

        if (Object.keys(dados).length === 0) {
            return { seguro: true };
        } else {
            return {
                seguro: false,
                detalhes: dados.matches[0].threatType
            };
        }
    }

    function renderizarResultado(resultado) {
        areaResultado.innerHTML = '<h1 id="title-glos">Resultado da Verificação</h1>';

        if (resultado.seguro) {
            areaResultado.innerHTML += `
            <div class="card_result" style="border-color: var(--verde);">
                <div class="status-valido">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="green" stroke-width="2">
                        <path d="M20 6L9 17l-5-5" />
                    </svg>
                </div>
                <p class="status-text">Status: Sem Registros de Ameaça</p>
                <p class="motivo-text">Este link não consta na base de dados de sites maliciosos. Se for um site desconhecido, continue navegando com cautela.</p>
            </div>
            `;
        } else {
            let tipoOriginal = resultado.detalhes;
            let tituloAmeaca = '';
            let descricaoAmeaca = '';

            if (tipoOriginal === 'SOCIAL_ENGINEERING') {
                tituloAmeaca = 'Engenharia Social / Phishing';
                descricaoAmeaca = 'Detectamos táticas de <strong>Engenharia Social</strong>. Este site pode tentar enganar você (Phishing, Spear Phishing, Spoofing ou Pharming) para roubar senhas ou dados bancários.';
            }
            else if (tipoOriginal === 'MALWARE' || tipoOriginal === 'UNWANTED_SOFTWARE' || tipoOriginal === 'POTENTIALLY_HARMFUL_APPLICATION') {
                tituloAmeaca = 'Malware';
                descricaoAmeaca = 'Detectamos distribuição de <strong>Malware</strong>. Este site tenta instalar softwares maliciosos (que podem incluir Ransomware, Spyware, Trojans ou Adwares) no seu dispositivo.';
            }
            else {
                tituloAmeaca = tipoOriginal.replace(/_/g, ' ');
                descricaoAmeaca = 'Não acesse este site. Ele foi classificado como perigoso pelos servidores de segurança.';
            }

            areaResultado.innerHTML += `
            <div class="card_result" style="border-color: var(--vermelho);">
                <div class="status-invalido">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </div>
                <p class="status-text">Ameaça: ${tituloAmeaca}</p>
                <p class="motivo-text">${descricaoAmeaca} <br><br><em>Consulte nosso glossário na página Home para entender mais sobre estes termos.</em></p>
            </div>
            `;
        }
    }
});