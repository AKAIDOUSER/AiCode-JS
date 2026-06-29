(function() {
    // Verifica se o toggle "Allow Paste" está ativo
    function getPasteState() {
        const toggle = document.getElementById('togglePaste');
        if (toggle) {
            return toggle.checked;
        }
        return null; // Menu não encontrado
    }

    // Função que controla a liberação de colagem
    function togglePasteProtection(enable) {
        const pasteHandler = (e) => {
            e.stopImmediatePropagation();
            return true;
        };

        if (enable) {
            ['paste', 'copy'].forEach(eventType => {
                document.addEventListener(eventType, pasteHandler, true);
            });
            console.log('🔓 Copy/Paste: Liberado pelo AiCode');
        } else {
            ['paste', 'copy'].forEach(eventType => {
                document.removeEventListener(eventType, pasteHandler, true);
            });
            console.log('🔒 Copy/Paste: Bloqueado pelo AiCode');
        }
        return enable;
    }

    // Executa a lógica
    const state = getPasteState();
    if (state !== null) {
        togglePasteProtection(state);
        // Retorna o estado atual
        window.__aiCodePasteState = state;
        console.log(`📋 AiCode Paste State: ${state ? 'LIBERADO' : 'BLOQUEADO'}`);
    } else {
        console.warn('⚠️ Menu AiCode não encontrado');
    }
})();
