// ========== TOGGLE PASTE - AiCode ==========
// Esse script é chamado quando o toggle "Allow Paste" é ativado/desativado

(function() {
    // Tenta pegar o estado atual do menu
    let state = null;
    
    if (window.__aiGetState) {
        state = window.__aiGetState();
    } else {
        // Fallback: tenta pegar direto do DOM
        const toggle = document.getElementById('togglePaste');
        if (toggle) {
            state = { allowPaste: toggle.checked };
        }
    }

    if (state !== null) {
        // Chama o handler que já está esperando no menu
        if (window.__aiPasteHandler) {
            window.__aiPasteHandler({ 
                enabled: state.allowPaste
            });
        } else {
            // Se o handler não existir, aplica a lógica localmente
            const enable = state.allowPaste;
            const pasteHandler = (e) => {
                e.stopImmediatePropagation();
                return true;
            };
            
            if (enable) {
                ['paste', 'copy'].forEach(eventType => {
                    document.addEventListener(eventType, pasteHandler, true);
                });
                alert('📋 Copy/Paste: LIBERADO pelo toggle-paste.js');
                console.log('🔓 Copy/Paste: Liberado pelo toggle-paste.js');
            } else {
                ['paste', 'copy'].forEach(eventType => {
                    document.removeEventListener(eventType, pasteHandler, true);
                });
                alert('📋 Copy/Paste: BLOQUEADO pelo toggle-paste.js');
                console.log('🔒 Copy/Paste: Bloqueado pelo toggle-paste.js');
            }
        }
    } else {
        alert('❌ Menu AiCode não encontrado!');
        console.warn('⚠️ Menu AiCode não encontrado');
    }
})();
