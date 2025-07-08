class UniOviMonitor {
    constructor() {
        this.targetUrl = 'https://cei.uniovi.es/postgrado/doctorado/acceso/listas';
        this.refreshInterval = 100000; // 100 seconds
        this.intervalId = null;
        this.isMonitoring = false;
        
        this.initializeElements();
        this.bindEvents();
        this.startMonitoring();
    }

    initializeElements() {
        this.statusText = document.getElementById('status-text');
        this.statusDot = document.getElementById('status-dot');
        this.lastUpdateTime = document.getElementById('last-update-time');
        this.provisionalText = document.getElementById('provisional-text');
        this.definitiveText = document.getElementById('definitive-text');
        this.refreshBtn = document.getElementById('refresh-btn');
        this.errorPanel = document.getElementById('error-panel');
        this.errorMessage = document.getElementById('error-message');
    }

    bindEvents() {
        this.refreshBtn.addEventListener('click', () => {
            this.checkPage();
        });
    }

    startMonitoring() {
        if (this.isMonitoring) return;
        
        this.isMonitoring = true;
        this.updateStatus('Conectando...', 'connecting');
        
        // Primeira verificação imediata
        this.checkPage();
        
        // Configurar intervalo de atualização
        this.intervalId = setInterval(() => {
            this.checkPage();
        }, this.refreshInterval);
    }

    stopMonitoring() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isMonitoring = false;
    }

    updateStatus(text, status) {
        this.statusText.textContent = text;
        this.statusDot.className = `status-dot ${status}`;
        
        // Adicionar timestamp para debug
        const timestamp = new Date().toLocaleTimeString('pt-BR');
        console.log(`[${timestamp}] Status atualizado: ${text} (${status})`);
    }

    updateLastUpdateTime() {
        const now = new Date();
        this.lastUpdateTime.textContent = now.toLocaleString('pt-BR');
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorPanel.style.display = 'block';
        this.updateStatus('Erro de conexão', 'error');
    }

    hideError() {
        this.errorPanel.style.display = 'none';
    }

    updateListStatus(elementId, status, text) {
        const element = document.getElementById(elementId);
        element.textContent = text;
        element.className = `status-text ${status}`;
    }

    async checkPage() {
        try {
            this.updateStatus('Verificando...', 'connecting');
            this.hideError();

            console.log('🔍 Iniciando verificação da página...');
            console.log('🎯 URL alvo:', this.targetUrl);

            // Tentar diferentes proxies CORS
            const proxies = [
                `https://api.allorigins.win/get?url=${encodeURIComponent(this.targetUrl)}`,
                `https://cors-anywhere.herokuapp.com/${this.targetUrl}`,
                `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(this.targetUrl)}`
            ];
            
            let data = null;
            let lastError = null;
            
            for (let i = 0; i < proxies.length; i++) {
                try {
                    const proxyUrl = proxies[i];
                    console.log(`🌐 Tentativa ${i + 1} - Proxy URL:`, proxyUrl);
                    
                    const response = await fetch(proxyUrl);
                    console.log(`📡 Resposta do proxy ${i + 1}:`, response.status, response.statusText);
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    if (i === 0) {
                        // allorigins.win retorna JSON
                        const jsonData = await response.json();
                        console.log('📦 Dados recebidos (JSON):', jsonData);
                        
                        if (!jsonData.contents) {
                            throw new Error('Não foi possível obter o conteúdo da página');
                        }
                        data = jsonData.contents;
                        console.log('📦 Conteúdo extraído (primeiros 500 chars):', data.substring(0, 500));
                    } else {
                        // Outros proxies retornam HTML diretamente
                        data = await response.text();
                        console.log('📦 Dados recebidos (HTML):', data.substring(0, 200) + '...');
                    }
                    
                    console.log('✅ Proxy funcionou!');
                    break;
                    
                } catch (error) {
                    console.log(`❌ Proxy ${i + 1} falhou:`, error.message);
                    lastError = error;
                    
                    if (i === proxies.length - 1) {
                        throw new Error(`Todos os proxies falharam. Último erro: ${lastError.message}`);
                    }
                }
            }

            // Parsear o HTML
            const parser = new DOMParser();
            
            // Acessar o conteúdo HTML
            let htmlContent = '';
            if (typeof data === 'string') {
                htmlContent = data;
            } else if (data && data.contents) {
                htmlContent = data.contents;
            } else if (data && typeof data === 'object') {
                htmlContent = JSON.stringify(data);
            }
            
            const doc = parser.parseFromString(htmlContent, 'text/html');
            
            // Procurar pelo programa específico
            const programText = 'Programa de Doctorado en Género y Diversidad';
            const provisionalText = 'Lista provisional de admitidos, en espera y excluidos';
            const definitiveText = 'Lista definitiva de admitidos , en espera y excluidos';
            
            // Verificar se o programa existe na página (tanto no texto quanto no HTML)
            const pageContent = doc.body ? doc.body.textContent : '';
            let hasProgram = pageContent.includes(programText);
            
            // Se não encontrou no texto, tentar no HTML bruto
            if (!hasProgram) {
                hasProgram = htmlContent.includes(programText);
            }
            
            if (hasProgram) {
                this.updateStatus('Conectado', 'connected');
                console.log('✅ Programa encontrado na página');
                
                // Procurar especificamente pelo programa e suas listas
                const allListItems = doc.querySelectorAll('li');
                let hasProvisionalLink = false;
                let hasDefinitiveLink = false;
                
                for (const item of allListItems) {
                    const itemText = item.textContent.trim();
                    
                    // Verificar se é o programa que estamos procurando
                    if (itemText.includes(programText)) {
                        console.log('✅ Programa encontrado como item de lista:', itemText);
                        
                        // Procurar por sublistas (ul) dentro deste item
                        const subList = item.querySelector('ul');
                        if (subList) {
                            const subItems = subList.querySelectorAll('li');
                            for (const subItem of subItems) {
                                const subItemText = subItem.textContent.trim();
                                
                                // Verificar se o subitem é um link
                                const link = subItem.querySelector('a');
                                if (link) {
                                    if (subItemText.includes(provisionalText)) {
                                        hasProvisionalLink = true;
                                        console.log('✅ Lista provisional encontrada como link:', link.href);
                                    }
                                    
                                    if (subItemText.includes(definitiveText)) {
                                        hasDefinitiveLink = true;
                                        console.log('✅ Lista definitiva encontrada como link:', link.href);
                                    }
                                } else {
                                    // Se não é link, verificar se o texto está presente
                                    if (subItemText.includes(provisionalText)) {
                                        console.log('📋 Lista provisional encontrada como texto (não é link ainda)');
                                    }
                                    
                                    if (subItemText.includes(definitiveText)) {
                                        console.log('📋 Lista definitiva encontrada como texto (não é link ainda)');
                                    }
                                }
                            }
                        }
                        break; // Encontrou o programa, pode parar de procurar
                    }
                }
                
                // Se não encontrou o programa na estrutura DOM, tentar busca no HTML bruto
                if (!hasProvisionalLink && !hasDefinitiveLink) {
                    console.log('🔍 Tentando busca alternativa no HTML bruto...');
                    
                    // Procurar por padrões específicos no HTML
                    const provisionalPattern = /Programa de Doctorado en Género y Diversidad[^<]*<ul[^>]*>[^<]*<li[^>]*>Lista provisional de admitidos, en espera y excluidos<\/li>/gi;
                    const definitivePattern = /Programa de Doctorado en Género y Diversidad[^<]*<ul[^>]*>[^<]*<li[^>]*>Lista definitiva de admitidos , en espera y excluidos<\/li>/gi;
                    
                    if (provisionalPattern.test(htmlContent)) {
                        console.log('📋 Lista provisional encontrada no HTML bruto');
                    }
                    
                    if (definitivePattern.test(htmlContent)) {
                        console.log('📋 Lista definitiva encontrada no HTML bruto');
                    }
                }
                
                // Atualizar status das listas
                if (hasProvisionalLink) {
                    this.updateListStatus('provisional-text', 'available', 'Disponível (Link)');
                } else {
                    this.updateListStatus('provisional-text', 'unavailable', 'Indisponível');
                }
                
                if (hasDefinitiveLink) {
                    this.updateListStatus('definitive-text', 'available', 'Disponível (Link)');
                } else {
                    this.updateListStatus('definitive-text', 'unavailable', 'Indisponível');
                }
                
                this.updateLastUpdateTime();
            } else {
                this.updateStatus('Programa não encontrado', 'error');
                this.updateListStatus('provisional-text', 'unavailable', 'Programa não encontrado');
                this.updateListStatus('definitive-text', 'unavailable', 'Programa não encontrado');
            }
            
        } catch (error) {
            console.error('Erro ao verificar página:', error);
            this.showError(`Erro ao conectar com a página: ${error.message}`);
            this.updateListStatus('provisional-text', 'unavailable', 'Erro de conexão');
            this.updateListStatus('definitive-text', 'unavailable', 'Erro de conexão');
        }
    }

    // Método para forçar atualização manual
    forceRefresh() {
        this.checkPage();
    }
}

// Inicializar o monitor quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    const monitor = new UniOviMonitor();
    
    // Expor o monitor globalmente para debug
    window.uniOviMonitor = monitor;
    
    console.log('🔍 Monitor UniOvi iniciado');
    console.log('📊 Monitorando:', monitor.targetUrl);
    console.log('⏰ Intervalo de atualização:', monitor.refreshInterval / 1000, 'segundos');
}); 