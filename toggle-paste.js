// ========== TOGGLE PASTE - MESMA LÓGICA DO BOTÃO ==========
(function() {
    // Pega o estado do toggle do menu
    let enablePaste = false;
    
    // Tenta pegar do estado global do menu
    if (window.__aiGetState) {
        const state = window.__aiGetState();
        enablePaste = state.allowPaste || false;
    } else {
        // Fallback: tenta pegar direto do DOM
        const toggle = document.getElementById('togglePaste');
        if (toggle) {
            enablePaste = toggle.checked;
        }
    }

    // ========== MESMA FUNÇÃO DO BOTÃO ==========
    const forceEnableCopyPaste = (e) => {
        e.stopImmediatePropagation();
        return true;
    };

    // ========== APLICA O ESTADO ==========
    if (enablePaste) {
        // ATIVA - igual ao 🔓 do botão
        ['paste', 'copy'].forEach(event => {
            document.addEventListener(event, forceEnableCopyPaste, true);
        });
        alert('🔓 Copy/Paste: LIBERADO pelo toggle do menu!');
        console.log('🔓 Copy/Paste: Liberado pelo toggle do menu');
    } else {
        // DESATIVA - igual ao 🔒 do botão
        ['paste', 'copy'].forEach(event => {
            document.removeEventListener(event, forceEnableCopyPaste, true);
        });
        alert('🔒 Copy/Paste: BLOQUEADO pelo toggle do menu!');
        console.log('🔒 Copy/Paste: Bloqueado pelo toggle do menu');
    }
})();
