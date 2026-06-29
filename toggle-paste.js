(function() {
    // Pega o estado atual do menu
    let state = null;
    let isActive = false;
    
    if (window.__aiCodeGetState) {
        state = window.__aiCodeGetState();
    } else {
        // Fallback: tenta pegar direto do DOM
        const toggle = document.getElementById('togglePaste');
        if (toggle) {
            state = { allowPaste: toggle.checked };
        }
    }

    // Função que força a liberação de copy/paste (idêntica ao botão)
    const forceEnableCopyPaste = (e) => {
        e.stopImmediatePropagation();
        return true;
    };

    function togglePasteProtection(enable) {
        if (enable) {
            // ATIVADO - Libera colagem e cópia (igual ao 🔓 do botão)
            ['paste', 'copy'].forEach(eventType => {
                document.addEventListener(eventType, forceEnableCopyPaste, true);
            });
            isActive = true;
            console.log('🔓 Copy/Paste: Liberado pelo AiCode');
        } else {
            // DESATIVADO - Bloqueia colagem e cópia (igual ao 🔒 do botão)
            ['paste', 'copy'].forEach(eventType => {
                document.removeEventListener(eventType, forceEnableCopyPaste, true);
            });
            isActive = false;
            console.log('🔒 Copy/Paste: Bloqueado pelo AiCode');
        }
        return enable;
    }

    // Executa a lógica baseada no estado do toggle
    if (state !== null) {
        const result = togglePasteProtection(state.allowPaste);
        
        // Retorna o resultado para o menu
        window.__aiCodePasteResult = {
            success: true,
            state: state.allowPaste,
            isActive: isActive,
            speed: state.typingSpeed || 50,
            message: state.allowPaste ? 'Copy/Paste liberado' : 'Copy/Paste bloqueado'
        };
        
        console.log(`📋 Paste State: ${state.allowPaste ? 'LIBERADO' : 'BLOQUEADO'}`);
        console.log(`⚡ Speed: ${state.typingSpeed || 50}ms`);
    } else {
        console.warn('⚠️ Menu AiCode não encontrado');
        window.__aiCodePasteResult = { 
            success: false, 
            error: 'Menu not found' 
        };
    }
})();
