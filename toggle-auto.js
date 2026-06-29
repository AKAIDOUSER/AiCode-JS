(function() {
    function getAutoState() {
        const toggle = document.getElementById('toggleAuto');
        if (toggle) {
            return toggle.checked;
        }
        return null;
    }

    function getMethodState() {
        const select = document.getElementById('methodSelect');
        if (select) {
            return select.value;
        }
        return null;
    }

    function toggleAutoMode(enable) {
        console.log(`⚡ Auto Execution: ${enable ? 'ATIVADO' : 'DESATIVADO'}`);
        return enable;
    }

    const autoState = getAutoState();
    const methodState = getMethodState();

    if (autoState !== null) {
        toggleAutoMode(autoState);
        window.__aiCodeAutoState = autoState;
        console.log(`⚡ AiCode Auto State: ${autoState ? 'ATIVADO' : 'DESATIVADO'}`);
    } else {
        console.warn('⚠️ Menu AiCode não encontrado');
    }

    if (methodState !== null) {
        window.__aiCodeMethodState = methodState;
        console.log(`🎯 AiCode Method: ${methodState.toUpperCase()}`);
    } else {
        console.warn('⚠️ Dropdown não encontrado');
    }

    // Retorna os dois estados
    return {
        auto: autoState,
        method: methodState
    };
})();
