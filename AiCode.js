(function() {
    if (document.getElementById('aiCodeMenu')) return;

    // ========== SISTEMA DE IA (INTEGRADO) ==========
    const GEMINI_API_KEYS = [
        "SUA_CHAVE_GEMINI_1",
        "SUA_CHAVE_GEMINI_2",
        "SUA_CHAVE_GEMINI_3"
    ];
    
    const OPENROUTER_API_KEYS = [
        "SUA_CHAVE_OPENROUTER_1",
        "SUA_CHAVE_OPENROUTER_2",
        "SUA_CHAVE_OPENROUTER_3"
    ];
    
    const DEEPSEEK_MODEL_NAME = "deepseek/deepseek-chat";
    let currentAiProvider = 'gemini';
    let currentApiKeyIndex = 0;
    let currentOpenRouterKeyIndex = 0;
    let lastAiResponse = '';

    // ========== SISTEMA DE DIGITAÇÃO ==========
    const digitadorState = {
        aguardandoCampo: false,
        listenerInstalado: false,
        onDocClick: null,
        typingTimeoutId: null,
        paused: false,
        currentElement: null,
        currentText: '',
        currentIndex: 0,
        currentSpeed: 50,
        modo: 'titulo',
        tituloIA: '',
        redacaoIA: '',
        minPalavras: 170,
        maxPalavras: 250,
        fluxoAtivo: false
    };

    // State Manager
    const state = {
        allowPaste: false,
        textInput: false,
        autoType: false,
        method: 'paste',
        activeTab: 'general',
        isDragging: false,
        offsetX: 0,
        offsetY: 0,
        apiKeys: [],
        selectedApi: '',
        minimized: false,
        opacity: 1.0,
        theme: 'darker',
        typingSpeed: 50
    };

    // ========== SVG ICONS ==========
    const icons = {
        close: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
        minimize: `<svg width="14" height="2" viewBox="0 0 14 2" fill="none"><path d="M1 1H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
        maximize: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none"/></svg>`,
        execute: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 2L14 8L4 14V2Z" fill="currentColor"/></svg>`,
        clear: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4H14M12 4V14H4V4M6 4V2H10V4M6 7V11M10 7V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        paste: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="4" y="2" width="8" height="12" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M3 4H13V14H3V4Z" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>`,
        settings: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M8 1V3M8 13V15M15 8H13M3 8H1M12.95 3.05L11.54 4.46M4.46 11.54L3.05 12.95M12.95 12.95L11.54 11.54M4.46 4.46L3.05 3.05" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
        code: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5 4L1 8L5 12M11 4L15 8L11 12M9 1L7 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        checkbox: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7L5.5 10.5L12 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        dropdown: `<svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        warning: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2L18 18H2L10 2Z" stroke="currentColor" stroke-width="1.5" fill="none"/><line x1="10" y1="8" x2="10" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="10" cy="15" r="0.5" fill="currentColor"/></svg>`,
        key: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="5" cy="8" r="3" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M7.5 8H14M14 8L12 6M14 8L12 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        save: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 2V14H13V4L11 2H3Z" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M5 2V6H10V2M5 14V10H10V14" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>`,
        brain: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 4C8 4 5 7 5 11c0 2 .8 3.8 2 5v3h10v-3c1.2-1.2 2-3 2-5 0-4-3-7-7-7z" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="9" cy="9" r="1" fill="currentColor"/><circle cx="15" cy="9" r="1" fill="currentColor"/><path d="M9 13c.8.8 2 1.2 3 1.2s2.2-.4 3-1.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
        play: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 2L14 8L4 14V2Z" fill="currentColor"/></svg>`,
        stop: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="3" y="3" width="10" height="10" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>`
    };

    // Import Poppins font
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    // ========== CSS COMPLETO ==========
    const style = document.createElement('style');
    style.textContent = `
        * {
            font-family: 'Poppins', sans-serif !important;
        }

        #aiCodeMenu * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        #aiCodeMenu {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #0a0a0a;
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 12px;
            min-width: 440px;
            max-width: 520px;
            width: 95%;
            z-index: 999999;
            box-shadow: 0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03);
            font-family: 'Poppins', sans-serif !important;
            font-size: 13px;
            color: #e0e0e0;
            user-select: none;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
            transition: box-shadow 0.3s ease, opacity 0.2s ease;
            letter-spacing: 0.01em;
            padding: 0 8px;
        }

        #aiCodeMenu.minimized {
            min-width: unset;
            max-width: unset;
            width: auto;
            max-height: 48px;
            overflow: hidden;
            padding: 0 8px;
        }

        #aiCodeMenu.minimized .header {
            border-radius: 12px;
        }

        #aiCodeMenu.minimized .title-section,
        #aiCodeMenu.minimized .tabs-container,
        #aiCodeMenu.minimized .content {
            display: none;
        }

        #aiCodeMenu .overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.85);
            z-index: 999998;
            animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes slideDown {
            from { opacity: 0; transform: translate(-50%, -48%); }
            to { opacity: 1; transform: translate(-50%, -50%); }
        }

        #aiCodeMenu .header {
            display: flex;
            align-items: center;
            padding: 12px 8px;
            background: rgba(255,255,255,0.01);
            border-bottom: 1px solid rgba(255,255,255,0.04);
            border-radius: 12px 12px 0 0;
            flex-shrink: 0;
            cursor: move;
            gap: 12px;
        }

        #aiCodeMenu.minimized .header {
            border-bottom: none;
            border-radius: 12px;
        }

        #aiCodeMenu .header .window-controls {
            display: flex;
            gap: 8px;
            align-items: center;
        }

        #aiCodeMenu .header .window-controls button {
            width: 14px;
            height: 14px;
            border-radius: 50%;
            border: none;
            cursor: pointer;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            background: transparent;
            color: transparent;
            position: relative;
            box-shadow: 0 0 0 1px rgba(255,255,255,0.05);
        }

        #aiCodeMenu .header .window-controls button:hover {
            color: rgba(255,255,255,0.8);
            transform: scale(1.1);
        }

        #aiCodeMenu .header .window-controls .btn-close {
            background: #990000;
            box-shadow: 0 0 0 1px rgba(255,0,0,0.2);
        }

        #aiCodeMenu .header .window-controls .btn-minimize {
            background: #664400;
            box-shadow: 0 0 0 1px rgba(255,180,0,0.15);
        }

        #aiCodeMenu .header .window-controls .btn-maximize {
            background: #004400;
            box-shadow: 0 0 0 1px rgba(0,255,0,0.15);
        }

        #aiCodeMenu .header .title-section {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-right: 8px;
        }

        #aiCodeMenu .header .title {
            font-size: 16px;
            font-weight: 400;
            letter-spacing: 2px;
            text-transform: uppercase;
            text-align: right;
        }

        #aiCodeMenu .header .title .ai-text {
            color: #888888;
        }

        #aiCodeMenu .header .title .code-text {
            color: #ffffff;
            font-weight: 400;
        }

        #aiCodeMenu .tabs-container {
            display: flex;
            background: rgba(255,255,255,0.005);
            border-bottom: 1px solid rgba(255,255,255,0.04);
            padding: 0 8px;
            gap: 2px;
            flex-shrink: 0;
        }

        #aiCodeMenu .tabs-container .tab {
            padding: 10px 16px;
            color: #666666;
            cursor: pointer;
            font-size: 11px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 1px;
            background: transparent;
            border: none;
            border-bottom: 2px solid transparent;
            transition: all 0.2s ease;
            position: relative;
            display: flex;
            align-items: center;
            gap: 6px;
            font-family: 'Poppins', sans-serif !important;
        }

        #aiCodeMenu .tabs-container .tab svg {
            opacity: 0.4;
            transition: opacity 0.2s ease;
            stroke-width: 1.5;
        }

        #aiCodeMenu .tabs-container .tab:hover {
            color: #999999;
            background: rgba(255,255,255,0.01);
        }

        #aiCodeMenu .tabs-container .tab:hover svg {
            opacity: 0.7;
        }

        #aiCodeMenu .tabs-container .tab.active {
            color: #888888;
            border-bottom-color: #888888;
        }

        #aiCodeMenu .tabs-container .tab.active svg {
            opacity: 1;
            color: #888888;
        }

        #aiCodeMenu .content {
            overflow-y: auto;
            flex: 1;
            background: transparent;
            border-radius: 0 0 12px 12px;
            max-height: calc(90vh - 120px);
            padding: 0 8px;
        }

        #aiCodeMenu .content::-webkit-scrollbar {
            width: 4px;
        }

        #aiCodeMenu .content::-webkit-scrollbar-track {
            background: transparent;
        }

        #aiCodeMenu .content::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.05);
            border-radius: 2px;
        }

        #aiCodeMenu .content::-webkit-scrollbar-thumb:hover {
            background: rgba(255,255,255,0.1);
        }

        #aiCodeMenu .tab-content {
            display: none;
            padding: 16px 8px 20px 8px;
            animation: fadeSlideIn 0.2s ease;
        }

        #aiCodeMenu .tab-content.active {
            display: block;
        }

        @keyframes fadeSlideIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
        }

        #aiCodeMenu .section {
            margin-bottom: 24px;
            position: relative;
        }

        #aiCodeMenu .section:last-child {
            margin-bottom: 0;
        }

        #aiCodeMenu .section-title {
            color: #888888;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid rgba(255,255,255,0.04);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        #aiCodeMenu .section-title svg {
            opacity: 0.4;
            stroke-width: 1.5;
        }

        #aiCodeMenu .option-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        #aiCodeMenu .option-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 12px;
            border-radius: 6px;
            background: rgba(255,255,255,0.01);
            transition: all 0.2s ease;
            border: 1px solid rgba(255,255,255,0.03);
            position: relative;
        }

        #aiCodeMenu .option-item:hover {
            background: rgba(255,255,255,0.02);
            border-color: rgba(255,255,255,0.06);
            box-shadow: 0 0 0 1px rgba(255,255,255,0.02);
        }

        #aiCodeMenu .option-item .option-left {
            display: flex;
            align-items: center;
            gap: 10px;
            flex: 1;
        }

        #aiCodeMenu .option-item .option-info {
            flex: 1;
        }

        #aiCodeMenu .option-label {
            color: #e0e0e0;
            font-size: 13px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        #aiCodeMenu .option-description {
            color: #666666;
            font-size: 10px;
            margin-top: 2px;
            line-height: 1.3;
            font-weight: 400;
        }

        #aiCodeMenu .toggle-switch {
            position: relative;
            width: 40px;
            height: 22px;
            flex-shrink: 0;
            cursor: pointer;
        }

        #aiCodeMenu .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
            position: absolute;
        }

        #aiCodeMenu .toggle-switch .switch-slider {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255,255,255,0.03);
            border-radius: 22px;
            transition: all 0.3s ease;
            border: 1px solid rgba(255,255,255,0.1);
            box-shadow: inset 0 1px 3px rgba(0,0,0,0.3);
        }

        #aiCodeMenu .toggle-switch .switch-slider::before {
            content: "";
            position: absolute;
            height: 16px;
            width: 16px;
            left: 2px;
            bottom: 2px;
            background: #555555;
            border-radius: 50%;
            transition: all 0.3s ease;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        #aiCodeMenu .toggle-switch input:checked + .switch-slider {
            background: rgba(255,255,255,0.06);
            border-color: rgba(255,255,255,0.2);
            box-shadow: inset 0 1px 3px rgba(0,0,0,0.3), 0 0 8px rgba(255,255,255,0.02);
        }

        #aiCodeMenu .toggle-switch input:checked + .switch-slider::before {
            transform: translateX(18px);
            background: #888888;
            box-shadow: 0 0 6px rgba(255,255,255,0.1);
        }

        #aiCodeMenu .select-wrapper {
            position: relative;
            width: 100%;
        }

        #aiCodeMenu .select-wrapper label {
            color: #888888;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 6px;
            display: block;
        }

        #aiCodeMenu .select-wrapper select {
            width: 100%;
            padding: 10px 12px;
            background: rgba(255,255,255,0.01);
            color: #e0e0e0;
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 6px;
            font-size: 12px;
            font-weight: 400;
            outline: none;
            cursor: pointer;
            appearance: none;
            -webkit-appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23666666' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 12px center;
            padding-right: 32px;
            font-family: 'Poppins', sans-serif !important;
            transition: all 0.2s ease;
            box-shadow: inset 0 1px 2px rgba(0,0,0,0.2);
        }

        #aiCodeMenu .select-wrapper select:hover {
            background: rgba(255,255,255,0.015);
            border-color: rgba(255,255,255,0.15);
            box-shadow: inset 0 1px 2px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.02);
        }

        #aiCodeMenu .select-wrapper select:focus {
            border-color: rgba(255,255,255,0.2);
            box-shadow: inset 0 1px 2px rgba(0,0,0,0.2), 0 0 0 2px rgba(255,255,255,0.02);
        }

        #aiCodeMenu .select-wrapper select option {
            background: #0a0a0a;
            color: #e0e0e0;
            font-family: 'Poppins', sans-serif !important;
        }

        #aiCodeMenu .api-input-wrapper {
            position: relative;
            width: 100%;
            margin-bottom: 8px;
        }

        #aiCodeMenu .api-input-wrapper label {
            color: #888888;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 6px;
            display: block;
        }

        #aiCodeMenu .api-input-container {
            position: relative;
            display: flex;
            align-items: center;
        }

        #aiCodeMenu .api-input-container input {
            width: 100%;
            padding: 10px 40px 10px 12px;
            background: rgba(255,255,255,0.01);
            color: #e0e0e0;
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 6px;
            font-size: 12px;
            font-weight: 400;
            outline: none;
            font-family: 'Poppins', sans-serif !important;
            transition: all 0.2s ease;
            box-shadow: inset 0 1px 2px rgba(0,0,0,0.2);
        }

        #aiCodeMenu .api-input-container input::placeholder {
            color: rgba(255,255,255,0.1);
        }

        #aiCodeMenu .api-input-container input:hover {
            background: rgba(255,255,255,0.015);
            border-color: rgba(255,255,255,0.15);
        }

        #aiCodeMenu .api-input-container input:focus {
            border-color: rgba(255,255,255,0.2);
            box-shadow: inset 0 1px 2px rgba(0,0,0,0.2), 0 0 0 2px rgba(255,255,255,0.02);
        }

        #aiCodeMenu .api-paste-icon {
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            padding: 6px;
            border-radius: 4px;
            color: #666666;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            border: 1px solid transparent;
            background: transparent;
        }

        #aiCodeMenu .api-paste-icon:hover {
            color: #888888;
            background: rgba(255,255,255,0.03);
            border-color: rgba(255,255,255,0.08);
            box-shadow: 0 0 6px rgba(255,255,255,0.02);
        }

        #aiCodeMenu .api-paste-icon svg {
            pointer-events: none;
        }

        #aiCodeMenu .button-group {
            display: flex;
            gap: 8px;
            margin-top: 12px;
        }

        #aiCodeMenu .button-group button {
            flex: 1;
            padding: 10px 16px;
            background: rgba(255,255,255,0.01);
            color: #e0e0e0;
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 6px;
            cursor: pointer;
            font-size: 11px;
            font-weight: 500;
            transition: all 0.2s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-family: 'Poppins', sans-serif !important;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            box-shadow: inset 0 1px 2px rgba(0,0,0,0.2);
        }

        #aiCodeMenu .button-group button:hover {
            background: rgba(255,255,255,0.03);
            border-color: rgba(255,255,255,0.15);
            transform: translateY(-1px);
            box-shadow: inset 0 1px 2px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.3);
        }

        #aiCodeMenu .button-group button:active {
            transform: translateY(0);
        }

        #aiCodeMenu .button-group button.btn-primary {
            background: rgba(168, 139, 250, 0.1);
            border-color: rgba(168, 139, 250, 0.3);
            color: #a78bfa;
            font-weight: 600;
        }

        #aiCodeMenu .button-group button.btn-primary:hover {
            background: rgba(168, 139, 250, 0.2);
            border-color: rgba(168, 139, 250, 0.5);
            box-shadow: 0 0 16px rgba(168, 139, 250, 0.1);
        }

        #aiCodeMenu .button-group button.btn-danger {
            border-color: rgba(255,0,0,0.15);
            color: #990000;
        }

        #aiCodeMenu .button-group button.btn-danger:hover {
            background: rgba(255,0,0,0.05);
            color: #cc0000;
            border-color: rgba(255,0,0,0.25);
        }

        #aiCodeMenu .button-group button.btn-warning {
            border-color: rgba(255,180,0,0.15);
            color: #885500;
        }

        #aiCodeMenu .button-group button.btn-warning:hover {
            background: rgba(255,180,0,0.05);
            color: #aa6600;
            border-color: rgba(255,180,0,0.25);
        }

        #aiCodeMenu .button-group button.btn-save {
            border-color: rgba(0,255,0,0.15);
            color: #005500;
        }

        #aiCodeMenu .button-group button.btn-save:hover {
            background: rgba(0,255,0,0.05);
            color: #007700;
            border-color: rgba(0,255,0,0.25);
        }

        #aiCodeMenu .speed-slider-wrapper {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 8px 0 4px 0;
        }

        #aiCodeMenu .speed-slider-wrapper label {
            color: #888888;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            min-width: 50px;
        }

        #aiCodeMenu .speed-slider-wrapper input[type="range"] {
            flex: 1;
            -webkit-appearance: none;
            appearance: none;
            height: 4px;
            border-radius: 2px;
            background: rgba(255,255,255,0.04);
            outline: none;
            transition: all 0.2s ease;
            box-shadow: inset 0 1px 2px rgba(0,0,0,0.3);
        }

        #aiCodeMenu .speed-slider-wrapper input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: #555555;
            cursor: pointer;
            transition: all 0.2s ease;
            border: 1px solid rgba(255,255,255,0.1);
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        #aiCodeMenu .speed-slider-wrapper input[type="range"]::-webkit-slider-thumb:hover {
            background: #888888;
            box-shadow: 0 0 6px rgba(255,255,255,0.1);
        }

        #aiCodeMenu .speed-slider-wrapper input[type="range"]::-moz-range-thumb {
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: #555555;
            cursor: pointer;
            border: 1px solid rgba(255,255,255,0.1);
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        #aiCodeMenu .speed-slider-wrapper .speed-value {
            color: #888888;
            font-size: 11px;
            font-weight: 600;
            min-width: 35px;
            text-align: center;
        }

        #aiCodeMenu .code-editor {
            position: relative;
            background: rgba(255,255,255,0.005);
            border-radius: 6px;
            border: 1px solid rgba(255,255,255,0.08);
            overflow: hidden;
            transition: all 0.2s ease;
            box-shadow: inset 0 1px 2px rgba(0,0,0,0.2);
        }

        #aiCodeMenu .code-editor:focus-within {
            border-color: rgba(255,255,255,0.2);
            box-shadow: inset 0 1px 2px rgba(0,0,0,0.2), 0 0 0 2px rgba(255,255,255,0.02);
        }

        #aiCodeMenu .code-editor .editor-header {
            padding: 6px 12px;
            background: rgba(255,255,255,0.01);
            border-bottom: 1px solid rgba(255,255,255,0.04);
            font-size: 10px;
            color: #888888;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        #aiCodeMenu .code-editor textarea {
            width: 100%;
            height: 140px;
            background: transparent;
            color: #e0e0e0;
            border: none;
            padding: 16px;
            font-family: 'Courier New', monospace !important;
            font-size: 13px;
            resize: vertical;
            outline: none;
            line-height: 1.6;
            tab-size: 2;
            position: relative;
            z-index: 2;
            font-weight: 400;
        }

        #aiCodeMenu .code-editor textarea::placeholder {
            color: rgba(255,255,255,0.05);
            font-family: 'Poppins', sans-serif !important;
        }

        #aiCodeMenu .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.85);
            z-index: 1000000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.2s ease;
        }

        #aiCodeMenu .modal {
            background: #0a0a0a;
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 12px;
            padding: 24px;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03);
            animation: modalSlideIn 0.2s ease;
        }

        @keyframes modalSlideIn {
            from { opacity: 0; transform: scale(0.95) translateY(-10px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
        }

        #aiCodeMenu .modal .modal-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid rgba(255,255,255,0.04);
        }

        #aiCodeMenu .modal .modal-title {
            font-size: 14px;
            font-weight: 600;
            color: #e0e0e0;
        }

        #aiCodeMenu .modal .modal-body {
            color: #888888;
            font-size: 12px;
            line-height: 1.6;
            margin-bottom: 20px;
            font-weight: 400;
        }

        #aiCodeMenu .modal .modal-footer {
            display: flex;
            gap: 8px;
            justify-content: flex-end;
        }

        #aiCodeMenu .modal .modal-footer button {
            padding: 8px 20px;
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 6px;
            color: #ffffff;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-family: 'Poppins', sans-serif !important;
        }

        #aiCodeMenu .modal .modal-footer button:hover {
            background: rgba(255,255,255,0.05);
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }

        .ai-status-badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .ai-status-badge.generating {
            background: rgba(168, 139, 250, 0.1);
            color: #a78bfa;
            border: 1px solid rgba(168, 139, 250, 0.3);
            animation: pulse 1.5s ease infinite;
        }

        .ai-status-badge.success {
            background: rgba(0, 255, 0, 0.1);
            color: #00aa00;
            border: 1px solid rgba(0, 255, 0, 0.3);
        }

        .ai-status-badge.idle {
            background: rgba(255, 255, 255, 0.05);
            color: #666666;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        @media (max-width: 480px) {
            #aiCodeMenu {
                min-width: unset;
                width: 95%;
                max-width: 95%;
                font-size: 12px;
                padding: 0 4px;
            }

            #aiCodeMenu .tab-content {
                padding: 12px 4px 16px 4px;
            }

            #aiCodeMenu .code-editor textarea {
                height: 100px;
            }

            #aiCodeMenu .tabs-container .tab {
                padding: 10px 12px;
                font-size: 10px;
            }
        }
    `;
    document.head.appendChild(style);

    // ========== CRIAÇÃO DOS ELEMENTOS ==========
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.id = 'aiCodeOverlay';

    const menu = document.createElement('div');
    menu.id = 'aiCodeMenu';

    // Header
    const header = document.createElement('div');
    header.className = 'header';
    header.innerHTML = `
        <div class="window-controls">
            <button class="btn-close" id="btnClose" title="Close">${icons.close}</button>
            <button class="btn-minimize" id="btnMinimize" title="Minimize">${icons.minimize}</button>
            <button class="btn-maximize" id="btnMaximize" title="Maximize">${icons.maximize}</button>
        </div>
        <div class="title-section">
            <div class="title">
                <span class="ai-text">Ai</span><span class="code-text">Code</span>
            </div>
        </div>
    `;

    // Tabs
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'tabs-container';
    
    const tabs = [
        { id: 'general', label: 'General', icon: icons.settings },
        { id: 'settings', label: 'Settings', icon: icons.key }
    ];

    tabs.forEach((tab, index) => {
        const tabEl = document.createElement('button');
        tabEl.className = `tab ${index === 0 ? 'active' : ''}`;
        tabEl.innerHTML = `${tab.icon} ${tab.label}`;
        tabEl.dataset.tab = tab.id;
        tabsContainer.appendChild(tabEl);
    });

    // Content
    const content = document.createElement('div');
    content.className = 'content';

    // General Tab
    const generalContent = document.createElement('div');
    generalContent.className = 'tab-content active';
    generalContent.dataset.tab = 'general';
    generalContent.innerHTML = `
        <div class="section">
            <div class="section-title">
                ${icons.settings}
                Input Configuration
            </div>
            <div class="option-group">
                <div class="option-item">
                    <div class="option-left">
                        <div class="option-info">
                            <div class="option-label">${icons.paste} Allow Paste</div>
                            <div class="option-description">${state.allowPaste ? 'Paste operations enabled' : 'Paste operations disabled'}</div>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="togglePaste" ${state.allowPaste ? 'checked' : ''}>
                        <span class="switch-slider"></span>
                    </label>
                </div>
                <div class="option-item">
                    <div class="option-left">
                        <div class="option-info">
                            <div class="option-label">${icons.code} Text Input Mode</div>
                            <div class="option-description">${state.textInput ? 'Manual text entry active' : 'Manual text entry inactive'}</div>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="toggleText" ${state.textInput ? 'checked' : ''}>
                        <span class="switch-slider"></span>
                    </label>
                </div>
                <div class="option-item">
                    <div class="option-left">
                        <div class="option-info">
                            <div class="option-label">${icons.brain} AI Auto Execution</div>
                            <div class="option-description">${state.autoType ? 'AI generation enabled' : 'AI generation disabled'}</div>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="toggleAuto" ${state.autoType ? 'checked' : ''}>
                        <span class="switch-slider"></span>
                    </label>
                </div>
            </div>
        </div>
        <div class="section">
            <div class="section-title">
                ${icons.execute}
                Execution Method & Speed
            </div>
            <div class="select-wrapper">
                <label>Method</label>
                <select id="methodSelect">
                    <option value="paste" ${state.method === 'paste' ? 'selected' : ''}>Paste (Instant)</option>
                    <option value="type" ${state.method === 'type' ? 'selected' : ''}>Type (Character by Character)</option>
                </select>
            </div>
            <div style="margin-top: 8px;">
                <div class="speed-slider-wrapper">
                    <label>Speed</label>
                    <input type="range" id="typingSpeed" min="1" max="200" value="${state.typingSpeed}" step="1">
                    <span class="speed-value" id="speedValue">${state.typingSpeed}ms</span>
                </div>
            </div>
            <div style="margin-top: 12px; text-align: center;">
                <span class="ai-status-badge idle" id="aiStatusBadge">IDLE</span>
            </div>
        </div>
        <div class="section">
            <div class="button-group">
                <button class="btn-primary" id="startBtn">
                    ${icons.play} Start Auto Type
                </button>
                <button class="btn-danger" id="stopBtn" disabled>
                    ${icons.stop} Stop
                </button>
            </div>
        </div>
    `;

    // Settings Tab
    const settingsContent = document.createElement('div');
    settingsContent.className = 'tab-content';
    settingsContent.dataset.tab = 'settings';
    
    const apiOptions = state.apiKeys.map(api => 
        `<option value="${api.key}" ${state.selectedApi === api.key ? 'selected' : ''}>${api.name}</option>`
    ).join('');
    
    settingsContent.innerHTML = `
        <div class="section">
            <div class="section-title">
                ${icons.key}
                API Configuration
            </div>
            <div class="api-input-wrapper">
                <label>Add New API Key</label>
                <div class="api-input-container">
                    <input type="password" id="apiKeyInput" placeholder="sk-... or your API key" spellcheck="false">
                    <div class="api-paste-icon" id="apiPasteIcon" title="Paste from popup">
                        ${icons.paste}
                    </div>
                </div>
            </div>
            <div class="button-group">
                <button class="btn-save" id="saveApiBtn">
                    ${icons.save} Save API
                </button>
                <button class="btn-danger" id="removeApiBtn">
                    ${icons.clear} Remove Selected
                </button>
            </div>
        </div>
        <div class="section">
            <div class="section-title">
                ${icons.dropdown}
                Saved API Keys
            </div>
            <div class="select-wrapper">
                <label>Select Active API</label>
                <select id="apiSelect">
                    <option value="" ${!state.selectedApi ? 'selected' : ''}>None selected</option>
                    ${apiOptions}
                </select>
            </div>
        </div>
    `;

    content.appendChild(generalContent);
    content.appendChild(settingsContent);

    menu.appendChild(header);
    menu.appendChild(tabsContainer);
    menu.appendChild(content);

    document.body.appendChild(overlay);
    document.body.appendChild(menu);

    // ========== FUNÇÕES ==========
    function switchTab(tabId) {
        state.activeTab = tabId;
        
        document.querySelectorAll('#aiCodeMenu .tab').forEach(el => {
            el.classList.toggle('active', el.dataset.tab === tabId);
        });
        
        document.querySelectorAll('#aiCodeMenu .tab-content').forEach(el => {
            el.classList.toggle('active', el.dataset.tab === tabId);
        });
    }

    function showModal(title, message, type = 'info', codeBlock = null) {
        const existingModal = document.querySelector('.modal-overlay');
        if (existingModal) existingModal.remove();

        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';

        const iconSvg = type === 'error' ? icons.warning : 
                       type === 'success' ? icons.checkbox : 
                       icons.code;

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-header">
                <span style="color: ${type === 'error' ? '#990000' : '#888888'}">${iconSvg}</span>
                <div class="modal-title">${title}</div>
            </div>
            <div class="modal-body">
                ${message}
                ${codeBlock ? `<div class="code-block">${codeBlock}</div>` : ''}
            </div>
            <div class="modal-footer">
                <button id="modalOkBtn">OK</button>
            </div>
        `;

        modalOverlay.appendChild(modal);
        document.body.appendChild(modalOverlay);

        const closeModal = () => {
            modal.style.animation = 'modalSlideIn 0.2s ease reverse';
            modalOverlay.style.animation = 'fadeIn 0.2s ease reverse';
            setTimeout(() => {
                modalOverlay.remove();
            }, 190);
        };

        document.getElementById('modalOkBtn').onclick = closeModal;
        modalOverlay.onclick = (e) => {
            if (e.target === modalOverlay) closeModal();
        };

        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        });
    }

    function updateSettingsTab() {
        const settingsTab = document.querySelector('[data-tab="settings"]');
        if (!settingsTab || !settingsTab.classList.contains('active')) return;
        
        const apiOptions = state.apiKeys.map(api => 
            `<option value="${api.key}" ${state.selectedApi === api.key ? 'selected' : ''}>${api.name}</option>`
        ).join('');
        
        const apiSelect = document.getElementById('apiSelect');
        if (apiSelect) {
            apiSelect.innerHTML = `
                <option value="" ${!state.selectedApi ? 'selected' : ''}>None selected</option>
                ${apiOptions}
            `;
        }
    }

    function saveState() {
        try {
            const saveData = { ...state };
            saveData.apiKeys = state.apiKeys.map(api => ({
                name: api.name,
                key: api.key
            }));
            localStorage.setItem('aiCodeMenuState', JSON.stringify(saveData));
        } catch (e) {
            console.warn('State save failed:', e);
        }
    }

    function loadState() {
        try {
            const saved = localStorage.getItem('aiCodeMenuState');
            if (saved) {
                const parsed = JSON.parse(saved);
                Object.assign(state, parsed);
                if (!state.apiKeys) state.apiKeys = [];
                if (!state.selectedApi) state.selectedApi = '';
            }
        } catch (e) {
            console.warn('State load failed:', e);
            state.apiKeys = [];
            state.selectedApi = '';
        }
    }

    // ========== FUNÇÕES DE IA ==========
    async function fetchWithTimeout(resource, options = {}, timeout = 15000) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        try {
            const response = await fetch(resource, { ...options, signal: controller.signal });
            clearTimeout(id);
            return response;
        } catch (error) {
            clearTimeout(id);
            if (error.name === 'AbortError') throw new Error('Request timeout');
            throw error;
        }
    }

    async function obterRespostaGemini(prompt) {
        if (!state.selectedApi) throw new Error("No API key selected");
        
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${state.selectedApi}`;
        
        const response = await fetchWithTimeout(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `Error ${response.status}`);
        }
        
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    async function gerarRedacaoeTitulo(tema, enunciado, minPalavras, maxPalavras) {
        const prompt = `Você é um assistente especializado em redação. 

TEMA: ${tema}

ENUNCIADO DE REFERÊNCIA: ${enunciado}

INSTRUÇÕES:
1. Crie um título criativo e impactante para uma redação sobre este tema
2. Escreva uma redação completa com no MÍNIMO ${minPalavras} palavras e no MÁXIMO ${maxPalavras} palavras
3. A redação deve ser bem estruturada com introdução, desenvolvimento e conclusão
4. Use linguagem formal e acadêmica

FORMATO DA RESPOSTA (EXATAMENTE ASSIM):
TITULO: [seu título aqui]
REDACAO: [sua redação aqui]

IMPORTANTE: Responda EXATAMENTE no formato acima.`;

        const resposta = await obterRespostaGemini(prompt);
        
        const tituloMatch = resposta.match(/TITULO:\s*(.+?)(?:\n|$)/i);
        const redacaoMatch = resposta.match(/REDACAO:\s*([\s\S]+?)$/i);
        
        if (!tituloMatch || !redacaoMatch) {
            throw new Error("Invalid AI response format");
        }
        
        return {
            titulo: tituloMatch[1].trim(),
            redacao: redacaoMatch[1].trim()
        };
    }

    function extrairTemaEnunciado() {
        let temaElement = document.querySelector('.MuiTypography-root.MuiTypography-body2');
        if (!temaElement) {
            temaElement = document.querySelector('p.MuiTypography-body2');
        }
        if (!temaElement) {
            const paragrafos = document.querySelectorAll('p');
            for (const p of paragrafos) {
                if (p.textContent.includes('TEMA:')) {
                    temaElement = p;
                    break;
                }
            }
        }
        
        let tema = temaElement ? temaElement.textContent.trim() : '';
        
        if (tema.includes('TEMA:')) {
            const partes = tema.split('TEMA:');
            tema = partes.length > 1 ? partes[1].trim() : tema;
        }
        
        tema = tema.replace(/\s*-\s*\d+ª\s*SÉRIE\s*.*$/i, '').trim();
        
        let enunciado = '';
        const enunciadoElement = document.querySelector('p:not([class])');
        if (enunciadoElement && enunciadoElement.textContent.trim().length > 50) {
            enunciado = enunciadoElement.textContent.trim();
        }
        
        if (!enunciado || enunciado.length < 50) {
            const bodyText = document.body.innerText;
            const linhas = bodyText.split('\n').filter(l => l.trim().length > 50);
            if (linhas.length > 0) {
                enunciado = linhas.slice(0, 3).join('\n');
            }
        }
        
        return { tema, enunciado };
    }

    // ========== FUNÇÕES DE DIGITAÇÃO/COLA ==========
    function encontrarBotaoSalvar() {
        const seletores = [
            'button[type="submit"]',
            '.MuiBox-root.css-1nuzzzk',
            'button[class*="salvar"]',
            'button[class*="save"]',
            'button[class*="submit"]',
            'input[type="submit"]'
        ];

        for (const seletor of seletores) {
            try {
                const el = document.querySelector(seletor);
                if (el) return el;
            } catch (_) {}
        }

        const botoes = document.querySelectorAll('button, input[type="submit"]');
        for (const btn of botoes) {
            const texto = (btn.textContent || btn.value || '').toLowerCase();
            if (texto.includes('salvar') || texto.includes('save') || 
                texto.includes('enviar') || texto.includes('publicar')) {
                return btn;
            }
        }

        return null;
    }

    function inserirCharEmInput(el, ch) {
        try {
            let pos = typeof el.selectionStart === 'number' ? el.selectionStart : el.value.length;
            if (typeof el.setRangeText === 'function') {
                el.setRangeText(ch, pos, pos, 'end');
            } else {
                const v = el.value || '';
                const before = v.slice(0, pos);
                const after = v.slice(pos);
                el.value = before + ch + after;
                const newPos = pos + ch.length;
                try { el.setSelectionRange(newPos, newPos); } catch (_) {}
            }
        } catch (err) {
            el.value = (el.value || '') + ch;
        }
    }

    function inserirCharEmContentEditable(el, ch) {
        try {
            const doc = el.ownerDocument || document;
            const sel = doc.getSelection ? doc.getSelection() : null;
            let range;
            if (sel && sel.rangeCount) {
                range = sel.getRangeAt(0).cloneRange();
                if (!el.contains(range.commonAncestorContainer)) {
                    range = null;
                }
            }
            if (!range) {
                range = doc.createRange();
                range.selectNodeContents(el);
                range.collapse(false);
            }
            const txtNode = doc.createTextNode(ch);
            range.insertNode(txtNode);
            range.setStartAfter(txtNode);
            range.collapse(true);
            if (sel) {
                sel.removeAllRanges();
                sel.addRange(range);
            }
        } catch (err) {
            el.innerText = (el.innerText || '') + ch;
        }
    }

    function colarTexto(el, texto) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.value = texto;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
        } else if (el.isContentEditable) {
            el.innerText = texto;
            el.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    function iniciarDigitacao(el, texto) {
        if (digitadorState.typingTimeoutId) {
            clearTimeout(digitadorState.typingTimeoutId);
            digitadorState.typingTimeoutId = null;
        }

        digitadorState.currentElement = el;
        digitadorState.currentText = texto;
        digitadorState.currentIndex = 0;
        digitadorState.currentSpeed = state.typingSpeed;
        digitadorState.paused = false;

        const isInputEl = (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA');
        const isContentEditable = !!el.isContentEditable;

        let prevReadOnly = null;
        try {
            if (isInputEl) {
                prevReadOnly = el.readOnly;
                el.readOnly = true;
                try { el.focus({ preventScroll: true }); } catch (_) { try { el.focus(); } catch (_) {} }
                try {
                    const len = el.value ? el.value.length : 0;
                    el.setSelectionRange(len, len);
                } catch (_) {}
            }
        } catch (_) {}

        let i = 0;

        function obterProximoIntervalo() {
            const speed = parseInt(state.typingSpeed) || 50;
            if (speed === 0 || speed === 1) return 1;
            return speed;
        }

        function digitarProximoCaractere() {
            if (digitadorState.paused) return;

            if (i < texto.length) {
                const c = texto[i++];

                if (isInputEl) {
                    inserirCharEmInput(el, c);
                } else if (isContentEditable) {
                    inserirCharEmContentEditable(el, c);
                } else {
                    try { el.innerText = (el.innerText || '') + c; } catch (_) {}
                }

                try { el.dispatchEvent(new Event('input', { bubbles: true })); } catch (_) {}
                if (i % 25 === 0) {
                    try { el.dispatchEvent(new Event('input', { bubbles: true })); } catch (_) {}
                }

                digitadorState.currentIndex = i;
                digitadorState.typingTimeoutId = setTimeout(digitarProximoCaractere, obterProximoIntervalo());
            } else {
                digitadorState.typingTimeoutId = null;

                try {
                    if (isInputEl) {
                        try { el.blur(); } catch (_) {}
                        try { el.readOnly = false; } catch (_) {}
                    }
                } catch (_) {}

                try { el.dispatchEvent(new Event('input', { bubbles: true })); } catch (_) {}
                try { el.dispatchEvent(new Event('change', { bubbles: true })); } catch (_) {}

                finalizarInsercao(el);
            }
        }

        digitadorState.typingTimeoutId = setTimeout(digitarProximoCaractere, obterProximoIntervalo());
    }

    function finalizarInsercao(el) {
        if (digitadorState.modo === 'titulo') {
            console.log('✅ Título inserido!');
            updateStatusBadge('success', 'TITLE DONE');
            setTimeout(() => {
                digitadorState.modo = 'redacao';
                digitadorState.aguardandoCampo = true;
                alert('✅ Título inserido!\n\nAgora clique no campo de REDAÇÃO.');
            }, 300);
        } else if (digitadorState.modo === 'redacao') {
            console.log('✅ Redação inserida!');
            updateStatusBadge('success', 'DONE');
            setTimeout(() => {
                const botao = encontrarBotaoSalvar();
                if (botao) {
                    botao.click();
                    showModal('Success', '✅ Redação inserida e salva com sucesso!', 'success');
                } else {
                    showModal('Warning', '✅ Redação inserida! Mas o botão Salvar não foi encontrado.', 'error');
                }
                digitadorState.fluxoAtivo = false;
                document.getElementById('startBtn').disabled = false;
                document.getElementById('stopBtn').disabled = true;
                updateStatusBadge('idle', 'IDLE');
            }, 500);
        }
    }

    function updateStatusBadge(status, text) {
        const badge = document.getElementById('aiStatusBadge');
        if (badge) {
            badge.className = 'ai-status-badge ' + status;
            badge.textContent = text;
        }
    }

    function ensureListenerInstalled() {
        if (digitadorState.listenerInstalado && digitadorState.onDocClick) {
            document.removeEventListener('click', digitadorState.onDocClick, true);
            digitadorState.listenerInstalado = false;
        }

        const onDocClick = (e) => {
            if (!digitadorState.aguardandoCampo) return;

            const path = e.composedPath ? e.composedPath() : [];
            if (path.some(n => n && n.id && String(n.id).startsWith('aiCode'))) return;

            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            digitadorState.aguardandoCampo = false;

            const el = e.target;
            if (!(el && (el.isContentEditable || el.tagName === 'INPUT' || el.tagName === 'TEXTAREA'))) {
                alert('Esse não é um campo válido. Clique em um INPUT ou TEXTAREA.');
                digitadorState.aguardandoCampo = true;
                return;
            }

            let textoParaInserir = '';
            
            if (state.autoType) {
                textoParaInserir = digitadorState.modo === 'titulo' ? digitadorState.tituloIA : digitadorState.redacaoIA;
            } else if (state.textInput) {
                const mensagem = 'Cole ou digite o texto para ' + (digitadorState.modo === 'titulo' ? 'TÍTULO' : 'REDAÇÃO') + ':';
                textoParaInserir = prompt(mensagem);
                if (textoParaInserir == null) {
                    digitadorState.aguardandoCampo = true;
                    return;
                }
            }

            if (state.method === 'paste') {
                colarTexto(el, textoParaInserir);
                setTimeout(() => finalizarInsercao(el), 300);
            } else {
                iniciarDigitacao(el, textoParaInserir);
            }
        };

        digitadorState.onDocClick = onDocClick;
        document.addEventListener('click', onDocClick, true);
        digitadorState.listenerInstalado = true;
    }

    async function iniciarFluxo() {
        if (!state.textInput && !state.autoType) {
            showModal('Error', 'Enable Text Input Mode or AI Auto Execution first!', 'error');
            return;
        }

        if (state.autoType && !state.selectedApi) {
            showModal('Error', 'Select an API key in Settings tab first!', 'error');
            return;
        }

        digitadorState.fluxoAtivo = true;
        digitadorState.modo = 'titulo';
        
        document.getElementById('startBtn').disabled = true;
        document.getElementById('stopBtn').disabled = false;

        if (state.autoType) {
            updateStatusBadge('generating', 'GENERATING...');
            
            try {
                const { tema, enunciado } = extrairTemaEnunciado();
                
                if (!tema) {
                    showModal('Error', 'Could not find theme on page!', 'error');
                    document.getElementById('startBtn').disabled = false;
                    document.getElementById('stopBtn').disabled = true;
                    updateStatusBadge('idle', 'IDLE');
                    return;
                }
                
                const temaConfirmado = confirm(
                    'TEMA ENCONTRADO:\n\n' + tema + '\n\nO tema está correto?'
                );
                
                if (!temaConfirmado) {
                    document.getElementById('startBtn').disabled = false;
                    document.getElementById('stopBtn').disabled = true;
                    updateStatusBadge('idle', 'IDLE');
                    return;
                }
                
                const minPalavrasInput = prompt('MÍNIMO de palavras:', '170');
                if (!minPalavrasInput) {
                    document.getElementById('startBtn').disabled = false;
                    document.getElementById('stopBtn').disabled = true;
                    updateStatusBadge('idle', 'IDLE');
                    return;
                }
                
                const maxPalavrasInput = prompt('MÁXIMO de palavras:', '250');
                if (!maxPalavrasInput) {
                    document.getElementById('startBtn').disabled = false;
                    document.getElementById('stopBtn').disabled = true;
                    updateStatusBadge('idle', 'IDLE');
                    return;
                }
                
                digitadorState.minPalavras = parseInt(minPalavrasInput);
                digitadorState.maxPalavras = parseInt(maxPalavrasInput);
                
                const { titulo, redacao } = await gerarRedacaoeTitulo(
                    tema, enunciado, digitadorState.minPalavras, digitadorState.maxPalavras
                );
                
                digitadorState.tituloIA = titulo;
                digitadorState.redacaoIA = redacao;
                
                updateStatusBadge('success', 'READY');
                showModal('AI Generated', 'TITLE: ' + titulo + '\n\nClick on the TITLE field to begin.', 'success');
                
            } catch (error) {
                updateStatusBadge('idle', 'ERROR');
                showModal('AI Error', error.message, 'error');
                document.getElementById('startBtn').disabled = false;
                document.getElementById('stopBtn').disabled = true;
                return;
            }
        } else {
            updateStatusBadge('success', 'MANUAL MODE');
        }

        digitadorState.aguardandoCampo = true;
        ensureListenerInstalled();
        alert('Clique no campo de TÍTULO para começar.');
    }

    function pararFluxo() {
        digitadorState.fluxoAtivo = false;
        digitadorState.aguardandoCampo = false;
        digitadorState.paused = true;
        
        if (digitadorState.typingTimeoutId) {
            clearTimeout(digitadorState.typingTimeoutId);
            digitadorState.typingTimeoutId = null;
        }
        
        document.getElementById('startBtn').disabled = false;
        document.getElementById('stopBtn').disabled = true;
        updateStatusBadge('idle', 'STOPPED');
        
        showModal('Stopped', 'Auto typing has been stopped.', 'error');
    }

    loadState();

    // ========== EVENT HANDLERS ==========
    document.getElementById('btnClose').onclick = () => {
        menu.style.animation = 'slideDown 0.2s ease reverse';
        overlay.style.animation = 'fadeIn 0.2s ease reverse';
        setTimeout(() => {
            menu.style.display = 'none';
            overlay.style.display = 'none';
        }, 190);
    };

    document.getElementById('btnMinimize').onclick = () => {
        state.minimized = !state.minimized;
        if (state.minimized) {
            menu.classList.add('minimized');
        } else {
            menu.classList.remove('minimized');
        }
        saveState();
    };

    document.getElementById('btnMaximize').onclick = () => {
        if (menu.style.width === '95%') {
            menu.style.width = '';
            menu.style.maxWidth = '520px';
        } else {
            menu.style.width = '95%';
            menu.style.maxWidth = '600px';
        }
    };

    overlay.onclick = () => {
        document.getElementById('btnClose').onclick();
    };

    document.querySelectorAll('#aiCodeMenu .tab').forEach(tab => {
        tab.onclick = () => {
            switchTab(tab.dataset.tab);
            if (tab.dataset.tab === 'settings') {
                updateSettingsTab();
            }
        };
    });

    // ========== TOGGLE HANDLERS ==========
    const togglePaste = document.getElementById('togglePaste');
    const toggleText = document.getElementById('toggleText');
    const toggleAuto = document.getElementById('toggleAuto');

    const forceEnableCopyPaste = (e) => {
        e.stopImmediatePropagation();
        return true;
    };

    togglePaste.addEventListener('change', function() {
        state.allowPaste = this.checked;
        const desc = this.closest('.option-item').querySelector('.option-description');
        if (desc) desc.textContent = this.checked ? 'Paste operations enabled' : 'Paste operations disabled';
        
        if (this.checked) {
            ['paste', 'copy'].forEach(event => {
                document.addEventListener(event, forceEnableCopyPaste, true);
            });
        } else {
            ['paste', 'copy'].forEach(event => {
                document.removeEventListener(event, forceEnableCopyPaste, true);
            });
        }
        
        saveState();
    });

    toggleText.addEventListener('change', function() {
        state.textInput = this.checked;
        
        // Desativa o outro toggle se este for ativado
        if (this.checked) {
            state.autoType = false;
            document.getElementById('toggleAuto').checked = false;
            const autoDesc = document.getElementById('toggleAuto').closest('.option-item').querySelector('.option-description');
            if (autoDesc) autoDesc.textContent = 'AI generation disabled';
        }
        
        const desc = this.closest('.option-item').querySelector('.option-description');
        if (desc) desc.textContent = this.checked ? 'Manual text entry active' : 'Manual text entry inactive';
        saveState();
    });

    toggleAuto.addEventListener('change', function() {
        state.autoType = this.checked;
        
        // Desativa o outro toggle se este for ativado
        if (this.checked) {
            state.textInput = false;
            document.getElementById('toggleText').checked = false;
            const textDesc = document.getElementById('toggleText').closest('.option-item').querySelector('.option-description');
            if (textDesc) textDesc.textContent = 'Manual text entry inactive';
            
            if (!state.selectedApi) {
                showModal('Warning', 'No API key selected! Go to Settings tab to add one.', 'error');
            }
        }
        
        const desc = this.closest('.option-item').querySelector('.option-description');
        if (desc) desc.textContent = this.checked ? 'AI generation enabled' : 'AI generation disabled';
        saveState();
    });

    document.querySelectorAll('.option-item').forEach(item => {
        item.onclick = function(e) {
            if (e.target.tagName !== 'INPUT' && !e.target.closest('.toggle-switch') && !e.target.closest('button')) {
                const checkbox = this.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change'));
                }
            }
        };
    });

    document.getElementById('methodSelect').addEventListener('change', function() {
        state.method = this.value;
        saveState();
    });

    // ========== API KEY HANDLERS ==========
    document.getElementById('saveApiBtn').addEventListener('click', () => {
        const input = document.getElementById('apiKeyInput');
        const key = input.value.trim();
        
        if (!key) {
            showModal('Error', 'Please enter an API key.', 'error');
            return;
        }
        
        const name = key.length > 12 ? key.substring(0, 8) + '...' : key;
        
        const exists = state.apiKeys.find(api => api.key === key);
        if (exists) {
            showModal('Duplicate', 'This API key already exists.', 'error');
            return;
        }
        
        state.apiKeys.push({ name, key });
        state.selectedApi = key;
        
        input.value = '';
        updateSettingsTab();
        saveState();
        
        showModal('API Saved', `API key "${name}" has been saved and selected.`, 'success');
    });

    document.getElementById('removeApiBtn').addEventListener('click', () => {
        const select = document.getElementById('apiSelect');
        const selectedKey = select.value;
        
        if (!selectedKey) {
            showModal('Error', 'No API key selected to remove.', 'error');
            return;
        }
        
        state.apiKeys = state.apiKeys.filter(api => api.key !== selectedKey);
        state.selectedApi = state.apiKeys.length > 0 ? state.apiKeys[0].key : '';
        
        updateSettingsTab();
        saveState();
        
        showModal('Removed', 'API key has been removed.', 'success');
    });

    document.getElementById('apiSelect').addEventListener('change', function() {
        state.selectedApi = this.value;
        saveState();
    });

    document.getElementById('apiPasteIcon').addEventListener('click', () => {
        const popupValue = window.prompt('Paste your API key here:', '');
        
        if (popupValue && popupValue.trim()) {
            const input = document.getElementById('apiKeyInput');
            input.value = popupValue.trim();
            input.focus();
            
            const icon = document.getElementById('apiPasteIcon');
            icon.style.color = '#00aa00';
            setTimeout(() => {
                icon.style.color = '';
            }, 1000);
        }
    });

    // ========== SPEED SLIDER ==========
    const speedSlider = document.getElementById('typingSpeed');
    const speedValue = document.getElementById('speedValue');
    
    speedSlider.addEventListener('input', function() {
        state.typingSpeed = parseInt(this.value);
        speedValue.textContent = state.typingSpeed + 'ms';
        saveState();
    });

    // ========== START/STOP BUTTONS ==========
    document.getElementById('startBtn').addEventListener('click', iniciarFluxo);
    document.getElementById('stopBtn').addEventListener('click', pararFluxo);

    // ========== DRAG FUNCTIONALITY ==========
    const headerDrag = menu.querySelector('.header');
    
    function startDrag(e) {
        if (e.target.closest('button')) return;
        
        state.isDragging = true;
        
        const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
        
        const rect = menu.getBoundingClientRect();
        state.offsetX = clientX - rect.left;
        state.offsetY = clientY - rect.top;
        
        menu.style.transition = 'none';
        menu.style.transform = 'none';
        menu.style.left = rect.left + 'px';
        menu.style.top = rect.top + 'px';
        
        e.preventDefault();
    }

    function drag(e) {
        if (!state.isDragging) return;
        
        const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
        
        let x = clientX - state.offsetX;
        let y = clientY - state.offsetY;
        
        const maxX = window.innerWidth - menu.offsetWidth;
        const maxY = window.innerHeight - menu.offsetHeight;
        
        x = Math.max(0, Math.min(x, maxX));
        y = Math.max(0, Math.min(y, maxY));
        
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
    }

    function stopDrag() {
        state.isDragging = false;
        menu.style.transition = '';
    }

    headerDrag.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);

    headerDrag.addEventListener('touchstart', startDrag, { passive: false });
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', stopDrag);

    // ========== INIT ==========
    if (state.allowPaste) {
        ['paste', 'copy'].forEach(event => {
            document.addEventListener(event, forceEnableCopyPaste, true);
        });
    }

    updateSettingsTab();

    console.log('✅ AiCode Menu - Auto Digitador com IA inicializado!');
    console.log('📦 Config:', {
        allowPaste: state.allowPaste,
        textInput: state.textInput,
        autoType: state.autoType,
        method: state.method,
        speed: state.typingSpeed,
        apiKeys: state.apiKeys.length,
        selectedApi: state.selectedApi ? state.selectedApi.substring(0, 8) + '...' : 'none'
    });
})();
