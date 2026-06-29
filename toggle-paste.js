// Só chama a função que já está esperando no menu
if (window.__aiPasteHandler) {
    const state = window.__aiGetState ? window.__aiGetState() : {};
    window.__aiPasteHandler({ 
        enabled: state.allowPaste, 
        speed: state.typingSpeed || 50 
    });
} else {
    alert('❌ Menu AiCode não encontrado!');
}
