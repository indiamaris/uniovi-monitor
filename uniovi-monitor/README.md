# 🔍 Monitor UniOvi - Listas de Admissão

Monitor automático para verificar a disponibilidade das listas de admissão do Programa de Doctorado en Género y Diversidad da Universidade de Oviedo.

## 🚀 Como Usar

1. **Abrir o monitor:**
   ```bash
   # Navegue até a pasta do projeto
   cd uniovi-monitor
   
   # Inicie um servidor local (Python 3)
   python3 -m http.server 8000
   
   # Ou use qualquer servidor web local
   ```

2. **Acesse no navegador:**
   ```
   http://localhost:8000
   ```

3. **Para testar a conexão:**
   ```
   http://localhost:8000/test-connection.html
   ```

## 🔧 Funcionalidades

- ✅ **Monitoramento automático** a cada 100 segundos
- ✅ **Verificação de listas** provisional e definitiva
- ✅ **Interface visual** com indicadores de status
- ✅ **Logs detalhados** no console do navegador
- ✅ **Múltiplos proxies CORS** para maior confiabilidade
- ✅ **Atualização manual** com botão

## 🐛 Troubleshooting

### Problema: "Não está conectando"

**Possíveis causas e soluções:**

1. **Erro de CORS:**
   - ✅ **Solução:** O monitor usa proxies CORS automáticos
   - ✅ **Verificação:** Abra o console (F12) para ver logs detalhados

2. **URL da página mudou:**
   - ✅ **Verificação:** Acesse `test-connection.html` para testar
   - ✅ **Solução:** Se necessário, atualize a URL no código

3. **Proxies CORS indisponíveis:**
   - ✅ **Solução:** O monitor tenta múltiplos proxies automaticamente
   - ✅ **Verificação:** Veja os logs no console para detalhes

4. **Problemas de rede:**
   - ✅ **Verificação:** Teste a conexão com a internet
   - ✅ **Solução:** Aguarde alguns minutos e tente novamente

### Como Diagnosticar

1. **Abra o console do navegador (F12)**
2. **Verifique os logs:**
   ```
   🔍 Iniciando verificação da página...
   🎯 URL alvo: https://cei.uniovi.es/...
   🌐 Tentativa 1 - Proxy URL: https://api.allorigins.win/...
   📡 Resposta do proxy 1: 200 OK
   ✅ Proxy funcionou!
   ```

3. **Use a página de teste:**
   - Acesse `test-connection.html`
   - Execute os testes para verificar cada componente

### Logs Importantes

- `🔍 Iniciando verificação da página...` - Monitor iniciado
- `🌐 Tentativa X - Proxy URL:` - Tentando proxy específico
- `📡 Resposta do proxy X:` - Status da resposta
- `✅ Proxy funcionou!` - Sucesso na conexão
- `❌ Proxy X falhou:` - Falha específica
- `📦 Dados recebidos:` - Conteúdo obtido

## 📊 Status dos Indicadores

- **🟡 Conectando...** - Tentando estabelecer conexão
- **🟢 Conectado** - Conexão estabelecida com sucesso
- **🔴 Erro de conexão** - Falha na conexão
- **📋 Disponível** - Lista encontrada na página
- **❌ Indisponível** - Lista não encontrada

## 🔄 Atualização

O monitor verifica automaticamente a cada **100 segundos** (configurável em `monitor.js`).

Para atualização manual, clique no botão **"Atualizar Agora"**.

## 🛠️ Configuração

### Alterar intervalo de verificação:
```javascript
// Em monitor.js, linha 4
this.refreshInterval = 100000; // 100 segundos
```

### Alterar URL alvo:
```javascript
// Em monitor.js, linha 3
this.targetUrl = 'https://cei.uniovi.es/postgrado/doctorado/acceso/listas';
```

## 📝 Notas Técnicas

- **Proxies CORS utilizados:**
  - `api.allorigins.win` (principal)
  - `cors-anywhere.herokuapp.com` (backup)
  - `api.codetabs.com` (backup)

- **Compatibilidade:** Funciona em todos os navegadores modernos
- **Requisitos:** Apenas um servidor web local (sem dependências externas)

## 🆘 Suporte

Se o problema persistir:

1. **Verifique o console** para logs detalhados
2. **Use a página de teste** para diagnóstico
3. **Teste a URL diretamente** no navegador
4. **Verifique a conectividade** com a internet

---

**Desenvolvido para monitorar as listas de admissão do Programa de Doctorado en Género y Diversidad da Universidade de Oviedo.** 