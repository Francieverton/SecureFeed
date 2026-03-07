document.addEventListener('DOMContentLoaded', () => {
    const campoLink = document.querySelector('.campo-link input');
    const botaoVerificar = document.querySelector('.campo-link button');
    const areaResultado = document.querySelector('.result_verificacao');

    //---------------- CHAVE DE API DO GOOGLE SAFE BROWSING ---------------
    const API_KEY = 'API_KEY_AQUI';

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

        if (!linkDigitado.startsWith('http://') && !linkDigitado.startsWith('https://')) {
            linkDigitado = 'https://' + linkDigitado;
        }

        if (!textoEUmLink(linkDigitado) || !linkDigitado.includes('.')) {
            alert('Isso não parece ser um link válido. Tente algo como "site.com".');
            return;
        }

        areaResultado.style.display = 'flex';
        areaResultado.innerHTML = '<h1 style="color:white;">Analisando...</h1>';

        try {
            const resultado = await verificarLinkNaAPI(linkDigitado);
            renderizarResultado(resultado, linkDigitado);
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

    function renderizarResultado(resultado, linkAnalisado) {
        areaResultado.innerHTML = '<h1 id="title-glos">Resultado da Verificação</h1>';

        if (resultado.seguro === false) {
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
        else if (linkAnalisado.startsWith('http://')) {
            areaResultado.innerHTML += `
            <div class="card_result" style="border-color: #f39c12;">
                <div style="width: 100px; height: 100px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background-color: rgba(243, 156, 18, 0.12); border: 2px solid rgba(243, 156, 18, 0.3); transition: all 0.4s ease-in-out;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#f39c12" stroke-width="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                </div>
                <p class="status-text" style="font-size: 22px; font-weight: 600; color: var(--branco); margin: 0; margin-top: 10px;">Status: Alerta (Sem Criptografia)</p>
                <p class="motivo-text" style="color: var(--branco); opacity: 0.5; text-align: center;">Este link não possui certificado de segurança (falta o "s" no https). Embora não haja registro de golpes recentes, dados enviados aqui podem ser facilmente interceptados.</p>
            </div>
            `;
        }
        else {
            areaResultado.innerHTML += `
            <div class="card_result" style="border-color: var(--verde);">
                <div class="status-valido">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="green" stroke-width="2">
                        <path d="M20 6L9 17l-5-5" />
                    </svg>
                </div>
                <p class="status-text">Status: Sem Registros de Ameaça</p>
                <p class="motivo-text">Este link possui criptografia e não consta na base de dados de sites maliciosos. Continue navegando com cautela.</p>
            </div>
            `;
        }
    }
});