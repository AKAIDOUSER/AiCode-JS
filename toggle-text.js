(function() {
    function getTextState() {
        const toggle = document.getElementById('toggleText');
        if (toggle) {
            return toggle.checked;
        }
        return null;
    }

    function toggleTextMode(enable) {
        // Aqui você coloca a lógica do modo texto
        console.log(`📝 Text Input Mode: ${enable ? 'ATIVADO' : 'DESATIVADO'}`);
        return enable;
    }

    const state = getTextState();
    if (state !== null) {
        toggleTextMode(state);
        window.__aiCodeTextState = state;
        console.log(`📝 AiCode Text State: ${state ? 'ATIVADO' : 'DESATIVADO'}`);
    } else {
        console.warn('⚠️ Menu AiCode não encontrado');
    }
})();
