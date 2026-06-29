(function() {
    if (document.getElementById('aiCodeMenu')) return;

    // State Manager
    const state = {
        allowPaste: true,
        textInput: false,
        autoType: false,
        method: 'paste',
        activeTab: 'general',
        isDragging: false,
        offsetX: 0,
        offsetY: 0,
        history: [],
        minimized: false,
        opacity: 1.0,
        theme: 'darker'
    };

    // SVG Icons - Removido o ícone code
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
        history: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M8 4V8L10.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
        warning: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2L18 18H2L10 2Z" stroke="currentColor" stroke-width="1.5" fill="none"/><line x1="10" y1="8" x2="10" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="10" cy="15" r="0.5" fill="currentColor"/></svg>`,
        // Novos ícones para indicar estados
        toggleOn: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="8" cy="8" r="3" fill="currentColor"/></svg>`,
        toggleOff: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>`,
        enabled: `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1.5" fill="currentColor"/></svg>`,
        disabled: `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>`
    };

    // Darker Theme Styles
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --menu-bg: #000000;
            --menu-surface: #0a0a0a;
            --menu-border: #1a1a1a;
            --menu-text: #e0e0e0;
            --menu-text-secondary: #666666;
            --menu-accent: #4a4a4a;
            --menu-accent-hover: #666666;
            --menu-danger: #cc0000;
            --menu-success: #006600;
            --menu-warning: #664400;
            --menu-glow: 0 0 20px rgba(0,0,0,0.9);
            --menu-font: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
            --menu-mono: 'Cascadia Code', 'Fira Code', 'JetBrains Mono', 'Consolas', monospace;
            --menu-input-bg: #000000;
            --menu-hover: #0d0d0d;
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
            background: #000000;
            border: 1px solid #1a1a1a;
            border-radius: 8px;
            min-width: 440px;
            max-width: 520px;
            width: 95%;
            z-index: 999999;
            box-shadow: 0 8px 32px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.9);
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 13px;
            color: #e0e0e0;
            user-select: none;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
            transition: box-shadow 0.3s ease, opacity 0.2s ease;
            letter-spacing: 0.01em;
        }

        #aiCodeMenu.minimized {
            min-width: 440px;
            max-width: 520px;
            max-height: 48px;
            overflow: hidden;
        }

        #aiCodeMenu .overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.95);
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
            padding: 12px 16px;
            background: #0a0a0a;
            border-bottom: 1px solid #1a1a1a;
            border-radius: 8px 8px 0 0;
            flex-shrink: 0;
            cursor: move;
            gap: 12px;
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
        }

        #aiCodeMenu .header .window-controls button:hover {
            color: rgba(255,255,255,0.8);
        }

        #aiCodeMenu .header .window-controls .btn-close {
            background: #990000;
            border: 1px solid #1a0000;
        }

        #aiCodeMenu .header .window-controls .btn-minimize {
            background: #664400;
            border: 1px solid #1a1100;
        }

        #aiCodeMenu .header .window-controls .btn-maximize {
            background: #004400;
            border: 1px solid #001a00;
        }

        #aiCodeMenu .header .title-section {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-right: 8px;
        }

        #aiCodeMenu .header .title {
            color: #e0e0e0;
            font-size: 14px;
            font-weight: 700;
            letter-spacing: 3px;
            text-transform: uppercase;
            text-align: right;
        }

        #aiCodeMenu .tabs-container {
            display: flex;
            background: #000000;
            border-bottom: 1px solid #1a1a1a;
            padding: 0 16px;
            gap: 2px;
            flex-shrink: 0;
        }

        #aiCodeMenu .tabs-container .tab {
            padding: 10px 20px;
            color: #666666;
            cursor: pointer;
            font-size: 11px;
            font-weight: 600;
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
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        #aiCodeMenu .tabs-container .tab svg {
            opacity: 0.4;
            transition: opacity 0.2s ease;
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
            background: #000000;
            border-radius: 0 0 8px 8px;
            max-height: calc(90vh - 120px);
        }

        #aiCodeMenu .content::-webkit-scrollbar {
            width: 4px;
        }

        #aiCodeMenu .content::-webkit-scrollbar-track {
            background: transparent;
        }

        #aiCodeMenu .content::-webkit-scrollbar-thumb {
            background: #1a1a1a;
            border-radius: 2px;
        }

        #aiCodeMenu .content::-webkit-scrollbar-thumb:hover {
            background: #333333;
        }

        #aiCodeMenu .tab-content {
            display: none;
            padding: 20px;
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
        }

        #aiCodeMenu .section:last-child {
            margin-bottom: 0;
        }

        #aiCodeMenu .section-title {
            color: #666666;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid #1a1a1a;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        #aiCodeMenu .section-title svg {
            opacity: 0.4;
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
            padding: 12px;
            border-radius: 4px;
            background: rgba(255,255,255,0.01);
            transition: all 0.2s ease;
            border: 1px solid transparent;
            cursor: pointer;
            position: relative;
        }

        #aiCodeMenu .option-item:hover {
            background: rgba(255,255,255,0.02);
            border-color: #1a1a1a;
        }

        #aiCodeMenu .option-item .option-left {
            display: flex;
            align-items: center;
            gap: 10px;
            flex: 1;
        }

        #aiCodeMenu .option-item .option-indicator {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            border-radius: 4px;
            background: rgba(255,255,255,0.02);
            border: 1px solid #1a1a1a;
            flex-shrink: 0;
            transition: all 0.3s ease;
        }

        #aiCodeMenu .option-item .option-indicator.active {
            background: rgba(136,136,136,0.1);
            border-color: #444444;
            box-shadow: 0 0 8px rgba(0,0,0,0.5);
        }

        #aiCodeMenu .option-item .option-indicator.active svg {
            color: #888888;
        }

        #aiCodeMenu .option-item .option-indicator svg {
            color: #444444;
            transition: all 0.3s ease;
        }

        #aiCodeMenu .option-item .option-info {
            flex: 1;
        }

        #aiCodeMenu .option-label {
            color: #e0e0e0;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        #aiCodeMenu .option-description {
            color: #666666;
            font-size: 10px;
            margin-top: 3px;
            line-height: 1.3;
        }

        #aiCodeMenu .option-status {
            font-size: 9px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding: 3px 8px;
            border-radius: 3px;
            background: rgba(255,255,255,0.02);
            border: 1px solid #1a1a1a;
            color: #444444;
            transition: all 0.3s ease;
            min-width: 60px;
            text-align: center;
        }

        #aiCodeMenu .option-status.active {
            color: #888888;
            background: rgba(136,136,136,0.05);
            border-color: #333333;
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
            background: #1a1a1a;
            border-radius: 22px;
            transition: all 0.3s ease;
            cursor: pointer;
            border: 1px solid rgba(255,255,255,0.05);
        }

        #aiCodeMenu .toggle-switch .switch-slider::before {
            content: "";
            position: absolute;
            height: 16px;
            width: 16px;
            left: 2px;
            bottom: 2px;
            background: #444444;
            border-radius: 50%;
            transition: all 0.3s ease;
        }

        #aiCodeMenu .toggle-switch input:checked + .switch-slider {
            background: #333333;
            border-color: #444444;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
        }

        #aiCodeMenu .toggle-switch input:checked + .switch-slider::before {
            transform: translateX(18px);
            background: #888888;
        }

        #aiCodeMenu .select-wrapper {
            position: relative;
            width: 100%;
        }

        #aiCodeMenu .select-wrapper label {
            color: #666666;
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
            background: #0a0a0a;
            color: #e0e0e0;
            border: 1px solid #1a1a1a;
            border-radius: 4px;
            font-size: 12px;
            outline: none;
            cursor: pointer;
            appearance: none;
            -webkit-appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23666666' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 12px center;
            padding-right: 32px;
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
            transition: all 0.2s ease;
        }

        #aiCodeMenu .select-wrapper select:hover {
            background: #0d0d0d;
            border-color: #333333;
        }

        #aiCodeMenu .select-wrapper select:focus {
            border-color: #444444;
            box-shadow: 0 0 0 3px rgba(255,255,255,0.03);
        }

        #aiCodeMenu .select-wrapper select option {
            background: #000000;
            color: #e0e0e0;
        }

        #aiCodeMenu .code-editor {
            position: relative;
            background: #000000;
            border-radius: 4px;
            border: 1px solid #1a1a1a;
            overflow: hidden;
            transition: all 0.2s ease;
        }

        #aiCodeMenu .code-editor:focus-within {
            border-color: #444444;
            box-shadow: 0 0 0 3px rgba(255,255,255,0.03);
        }

        #aiCodeMenu .code-editor .editor-header {
            padding: 6px 12px;
            background: rgba(255,255,255,0.01);
            border-bottom: 1px solid #1a1a1a;
            font-size: 10px;
            color: #666666;
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
            font-family: 'Cascadia Code', 'Fira Code', 'JetBrains Mono', 'Consolas', monospace;
            font-size: 13px;
            resize: vertical;
            outline: none;
            line-height: 1.6;
            tab-size: 2;
            position: relative;
            z-index: 2;
        }

        #aiCodeMenu .code-editor textarea::placeholder {
            color: rgba(255,255,255,0.05);
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
            border: 1px solid #1a1a1a;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
            font-weight: 600;
            transition: all 0.2s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }

        #aiCodeMenu .button-group button:hover {
            background: rgba(255,255,255,0.03);
            border-color: #333333;
            transform: translateY(-1px);
        }

        #aiCodeMenu .button-group button:active {
            transform: translateY(0);
        }

        #aiCodeMenu .button-group button.btn-primary {
            background: #1a1a1a;
            border-color: #333333;
            color: #ffffff;
            font-weight: 700;
        }

        #aiCodeMenu .button-group button.btn-primary:hover {
            background: #2a2a2a;
            border-color: #444444;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        }

        #aiCodeMenu .button-group button.btn-danger {
            border-color: #330000;
            color: #990000;
        }

        #aiCodeMenu .button-group button.btn-danger:hover {
            background: #330000;
            color: #cc0000;
        }

        #aiCodeMenu .button-group button.btn-warning {
            border-color: #332200;
            color: #885500;
        }

        #aiCodeMenu .button-group button.btn-warning:hover {
            background: #332200;
            color: #aa6600;
        }

        #aiCodeMenu .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.95);
            z-index: 1000000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.2s ease;
        }

        #aiCodeMenu .modal {
            background: #0a0a0a;
            border: 1px solid #1a1a1a;
            border-radius: 8px;
            padding: 24px;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 8px 32px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.9);
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
            border-bottom: 1px solid #1a1a1a;
        }

        #aiCodeMenu .modal .modal-title {
            font-size: 14px;
            font-weight: 700;
            color: #e0e0e0;
        }

        #aiCodeMenu .modal .modal-body {
            color: #888888;
            font-size: 12px;
            line-height: 1.6;
            margin-bottom: 20px;
        }

        #aiCodeMenu .modal .modal-body .code-block {
            background: rgba(0,0,0,0.5);
            border: 1px solid #1a1a1a;
            border-radius: 4px;
            padding: 12px;
            margin: 12px 0;
            font-family: 'Cascadia Code', 'Fira Code', 'JetBrains Mono', 'Consolas', monospace;
            font-size: 12px;
            max-height: 200px;
            overflow-y: auto;
        }

        #aiCodeMenu .modal .modal-footer {
            display: flex;
            gap: 8px;
            justify-content: flex-end;
        }

        #aiCodeMenu .modal .modal-footer button {
            padding: 8px 20px;
            background: #1a1a1a;
            border: none;
            border-radius: 4px;
            color: #ffffff;
            font-size: 11px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        #aiCodeMenu .modal .modal-footer button:hover {
            background: #2a2a2a;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        }

        #aiCodeMenu .history-list {
            display: flex;
            flex-direction: column;
            gap: 4px;
            max-height: 200px;
            overflow-y: auto;
        }

        #aiCodeMenu .history-item {
            padding: 8px 12px;
            background: rgba(255,255,255,0.01);
            border: 1px solid #1a1a1a;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 11px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        #aiCodeMenu .history-item:hover {
            background: rgba(255,255,255,0.02);
            border-color: #444444;
        }

        #aiCodeMenu .history-item .history-code {
            font-family: 'Cascadia Code', 'Fira Code', 'JetBrains Mono', 'Consolas', monospace;
            max-width: 300px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        #aiCodeMenu .history-item .history-time {
            color: #666666;
            font-size: 10px;
        }

        @media (max-width: 480px) {
            #aiCodeMenu {
                min-width: unset;
                width: 95%;
                max-width: 95%;
                font-size: 12px;
            }

            #aiCodeMenu .tab-content {
                padding: 16px;
            }

            #aiCodeMenu .code-editor textarea {
                height: 100px;
            }
        }
    `;
    document.head.appendChild(style);

    // Create Elements
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.id = 'aiCodeOverlay';

    const menu = document.createElement('div');
    menu.id = 'aiCodeMenu';

    // Header - Modificado para remover ícone e versão, título à direita
    const header = document.createElement('div');
    header.className = 'header';
    header.innerHTML = `
        <div class="window-controls">
            <button class="btn-close" id="btnClose" title="Close">${icons.close}</button>
            <button class="btn-minimize" id="btnMinimize" title="Minimize">${icons.minimize}</button>
            <button class="btn-maximize" id="btnMaximize" title="Maximize">${icons.maximize}</button>
        </div>
        <div class="title-section">
            <div class="title">AiCode</div>
        </div>
    `;

    // Tabs
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'tabs-container';
    
    const tabs = [
        { id: 'general', label: 'General', icon: icons.settings },
        { id: 'executor', label: 'Executor', icon: icons.code },
        { id: 'history', label: 'History', icon: icons.history }
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

    // Função para atualizar indicadores visuais das opções
    function updateOptionIndicators() {
        // Atualizar Allow Paste
        updateOptionUI('togglePaste', state.allowPaste, 
            'Paste operations enabled', 
            'Paste operations disabled');
        
        // Atualizar Text Input
        updateOptionUI('toggleText', state.textInput, 
            'Text input mode active', 
            'Text input mode inactive');
        
        // Atualizar Auto Execution
        updateOptionUI('toggleAuto', state.autoType, 
            'Auto execution enabled', 
            'Auto execution disabled');
    }

    function updateOptionUI(toggleId, isActive, activeText, inactiveText) {
        const optionItem = document.getElementById(toggleId).closest('.option-item');
        if (!optionItem) return;
        
        const indicator = optionItem.querySelector('.option-indicator');
        const status = optionItem.querySelector('.option-status');
        const description = optionItem.querySelector('.option-description');
        
        if (indicator) {
            indicator.className = 'option-indicator' + (isActive ? ' active' : '');
            indicator.innerHTML = isActive ? icons.enabled : icons.disabled;
        }
        
        if (status) {
            status.className = 'option-status' + (isActive ? ' active' : '');
            status.textContent = isActive ? 'ACTIVE' : 'INACTIVE';
        }
        
        if (description) {
            description.textContent = isActive ? activeText : inactiveText;
        }
    }

    // General Tab - Modificado com indicadores visuais mais claros
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
                <div class="option-item" id="optionPaste">
                    <div class="option-left">
                        <div class="option-indicator ${state.allowPaste ? 'active' : ''}">
                            ${state.allowPaste ? icons.enabled : icons.disabled}
                        </div>
                        <div class="option-info">
                            <div class="option-label">
                                Allow Paste
                                <span class="option-status ${state.allowPaste ? 'active' : ''}">${state.allowPaste ? 'ACTIVE' : 'INACTIVE'}</span>
                            </div>
                            <div class="option-description">${state.allowPaste ? 'Paste operations enabled' : 'Paste operations disabled'}</div>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="togglePaste" ${state.allowPaste ? 'checked' : ''}>
                        <span class="switch-slider"></span>
                    </label>
                </div>
                <div class="option-item" id="optionText">
                    <div class="option-left">
                        <div class="option-indicator ${state.textInput ? 'active' : ''}">
                            ${state.textInput ? icons.enabled : icons.disabled}
                        </div>
                        <div class="option-info">
                            <div class="option-label">
                                Text Input Mode
                                <span class="option-status ${state.textInput ? 'active' : ''}">${state.textInput ? 'ACTIVE' : 'INACTIVE'}</span>
                            </div>
                            <div class="option-description">${state.textInput ? 'Text input mode active' : 'Text input mode inactive'}</div>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="toggleText" ${state.textInput ? 'checked' : ''}>
                        <span class="switch-slider"></span>
                    </label>
                </div>
                <div class="option-item" id="optionAuto">
                    <div class="option-left">
                        <div class="option-indicator ${state.autoType ? 'active' : ''}">
                            ${state.autoType ? icons.enabled : icons.disabled}
                        </div>
                        <div class="option-info">
                            <div class="option-label">
                                Auto Execution
                                <span class="option-status ${state.autoType ? 'active' : ''}">${state.autoType ? 'ACTIVE' : 'INACTIVE'}</span>
                            </div>
                            <div class="option-description">${state.autoType ? 'Auto execution enabled' : 'Auto execution disabled'}</div>
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
                ${icons.code}
                Execution Method
            </div>
            <div class="select-wrapper">
                <label>Method</label>
                <select id="methodSelect">
                    <option value="paste" ${state.method === 'paste' ? 'selected' : ''}>Clipboard Paste</option>
                    <option value="type" ${state.method === 'type' ? 'selected' : ''}>Simulated Typing</option>
                    <option value="auto" ${state.method === 'auto' ? 'selected' : ''}>Automatic Detection</option>
                </select>
            </div>
        </div>
    `;

    // Executor Tab
    const executorContent = document.createElement('div');
    executorContent.className = 'tab-content';
    executorContent.dataset.tab = 'executor';
    executorContent.innerHTML = `
        <div class="section">
            <div class="section-title">
                ${icons.code}
                Code Executor
            </div>
            <div class="code-editor">
                <div class="editor-header">
                    ${icons.code} script.lua
                </div>
                <textarea id="executorText" placeholder="-- Enter your Lua script or commands here..." spellcheck="false"></textarea>
            </div>
            <div class="button-group">
                <button class="btn-danger" id="clearBtn">
                    ${icons.clear} Clear
                </button>
                <button class="btn-warning" id="pasteBtn">
                    ${icons.paste} Paste
                </button>
                <button class="btn-primary" id="executeBtn">
                    ${icons.execute} Execute
                </button>
            </div>
        </div>
    `;

    // History Tab
    const historyContent = document.createElement('div');
    historyContent.className = 'tab-content';
    historyContent.dataset.tab = 'history';
    historyContent.innerHTML = `
        <div class="section">
            <div class="section-title">
                ${icons.history}
                Execution History
            </div>
            <div class="history-list" id="historyList">
                ${state.history.length === 0 ? 
                    '<div style="color: #666666; text-align: center; padding: 20px;">No execution history</div>' : 
                    state.history.map((item, index) => `
                        <div class="history-item" data-index="${index}">
                            <div class="history-code">${item.code.substring(0, 50)}${item.code.length > 50 ? '...' : ''}</div>
                            <div class="history-time">${new Date(item.timestamp).toLocaleTimeString()}</div>
                        </div>
                    `).join('')
                }
            </div>
        </div>
    `;

    content.appendChild(generalContent);
    content.appendChild(executorContent);
    content.appendChild(historyContent);

    menu.appendChild(header);
    menu.appendChild(tabsContainer);
    menu.appendChild(content);

    document.body.appendChild(overlay);
    document.body.appendChild(menu);

    // Functions
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

    function updateHistoryTab() {
        const historyList = document.getElementById('historyList');
        if (!historyList) return;

        if (state.history.length === 0) {
            historyList.innerHTML = '<div style="color: #666666; text-align: center; padding: 20px;">No execution history</div>';
            return;
        }

        historyList.innerHTML = state.history.map((item, index) => `
            <div class="history-item" data-index="${index}">
                <div class="history-code">${item.code.substring(0, 50)}${item.code.length > 50 ? '...' : ''}</div>
                <div class="history-time">${new Date(item.timestamp).toLocaleTimeString()}</div>
            </div>
        `).join('');

        // Click to load history
        historyList.querySelectorAll('.history-item').forEach(item => {
            item.onclick = function() {
                const index = this.dataset.index;
                const historyItem = state.history[index];
                document.getElementById('executorText').value = historyItem.code;
                switchTab('executor');
                showModal('History Loaded', 'Code loaded from execution history.', 'success', historyItem.code.substring(0, 100));
            };
        });
    }

    function saveState() {
        try {
            localStorage.setItem('cs2ModMenuState', JSON.stringify(state));
        } catch (e) {
            console.warn('State save failed:', e);
        }
    }

    function loadState() {
        try {
            const saved = localStorage.getItem('cs2ModMenuState');
            if (saved) {
                const parsed = JSON.parse(saved);
                Object.assign(state, parsed);
            }
        } catch (e) {
            console.warn('State load failed:', e);
        }
    }

    // Load saved state
    loadState();

    // Event Handlers
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

    // Tab switching
    document.querySelectorAll('#aiCodeMenu .tab').forEach(tab => {
        tab.onclick = () => switchTab(tab.dataset.tab);
    });

    // Toggle handlers
    const togglePaste = document.getElementById('togglePaste');
    const toggleText = document.getElementById('toggleText');
    const toggleAuto = document.getElementById('toggleAuto');

    togglePaste.addEventListener('change', function() {
        state.allowPaste = this.checked;
        const pasteBtn = document.getElementById('pasteBtn');
        if (!state.allowPaste) {
            pasteBtn.disabled = true;
            pasteBtn.style.opacity = '0.4';
            pasteBtn.style.cursor = 'not-allowed';
        } else {
            pasteBtn.disabled = false;
            pasteBtn.style.opacity = '1';
            pasteBtn.style.cursor = 'pointer';
        }
        updateOptionUI('togglePaste', state.allowPaste, 
            'Paste operations enabled', 
            'Paste operations disabled');
        saveState();
    });

    toggleText.addEventListener('change', function() {
        state.textInput = this.checked;
        updateOptionUI('toggleText', state.textInput, 
            'Text input mode active', 
            'Text input mode inactive');
        saveState();
    });

    toggleAuto.addEventListener('change', function() {
        state.autoType = this.checked;
        if (state.autoType) {
            state.method = 'auto';
            document.getElementById('methodSelect').value = 'auto';
        }
        updateOptionUI('toggleAuto', state.autoType, 
            'Auto execution enabled', 
            'Auto execution disabled');
        saveState();
    });

    // Make entire option item clickable
    document.querySelectorAll('.option-item').forEach(item => {
        item.onclick = function(e) {
            if (e.target.tagName !== 'INPUT') {
                const checkbox = this.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change'));
                }
            }
        };
    });

    // Method selector
    document.getElementById('methodSelect').addEventListener('change', function() {
        state.method = this.value;
        saveState();
    });

    // Executor handlers
    const textarea = document.getElementById('executorText');
    
    document.getElementById('clearBtn').addEventListener('click', () => {
        if (textarea.value.trim()) {
            textarea.value = '';
            showModal('Cleared', 'Code editor has been cleared.', 'success');
        }
    });

    document.getElementById('pasteBtn').addEventListener('click', async () => {
        if (!state.allowPaste) {
            showModal('Access Denied', 'Paste functionality is currently disabled.', 'error');
            return;
        }
        
        try {
            const text = await navigator.clipboard.readText();
            if (text.trim()) {
                textarea.value = text;
                showModal('Pasted', 'Code pasted from clipboard successfully.', 'success', text.substring(0, 100));
            } else {
                showModal('Empty Clipboard', 'No content found in clipboard.', 'error');
            }
        } catch(e) {
            showModal('Error', 'Failed to access clipboard. Check permissions.', 'error');
        }
    });

    document.getElementById('executeBtn').addEventListener('click', () => {
        const code = textarea.value.trim();
        if (!code) {
            showModal('No Code', 'Please enter code to execute.', 'error');
            return;
        }
        
        // Add to history
        state.history.unshift({
            code: code,
            timestamp: new Date().toISOString(),
            method: state.method
        });
        
        // Keep only last 50 entries
        if (state.history.length > 50) {
            state.history = state.history.slice(0, 50);
        }
        
        saveState();
        updateHistoryTab();
        
        showModal(
            'Execution Complete', 
            'Code executed successfully using method: ' + state.method.toUpperCase(), 
            'success', 
            code.substring(0, 200)
        );
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter' && document.activeElement === textarea) {
            e.preventDefault();
            document.getElementById('executeBtn').click();
        }
    });

    // Drag functionality
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

    // Initial state
    updateOptionIndicators();
    
    if (!state.allowPaste) {
        const pasteBtn = document.getElementById('pasteBtn');
        pasteBtn.disabled = true;
        pasteBtn.style.opacity = '0.4';
        pasteBtn.style.cursor = 'not-allowed';
    }

    // Initialize history
    updateHistoryTab();

    console.log('AiCode - Dark Theme Initialized');
})();
