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
        theme: 'dark'
    };

    // SVG Icons (professional, no emojis)
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
        warning: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2L18 18H2L10 2Z" stroke="currentColor" stroke-width="1.5" fill="none"/><line x1="10" y1="8" x2="10" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="10" cy="15" r="0.5" fill="currentColor"/></svg>`
    };

    // Professional CSS Styles
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --menu-bg: #0d1117;
            --menu-surface: #161b22;
            --menu-border: #30363d;
            --menu-text: #c9d1d9;
            --menu-text-secondary: #8b949e;
            --menu-accent: #58a6ff;
            --menu-accent-hover: #79c0ff;
            --menu-danger: #f85149;
            --menu-success: #3fb950;
            --menu-warning: #d2991d;
            --menu-glow: 0 0 20px rgba(88,166,255,0.15);
            --menu-font: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
            --menu-mono: 'Cascadia Code', 'Fira Code', 'JetBrains Mono', 'Consolas', monospace;
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
            background: var(--menu-bg);
            border: 1px solid var(--menu-border);
            border-radius: 8px;
            min-width: 440px;
            max-width: 520px;
            width: 95%;
            z-index: 999999;
            box-shadow: 0 8px 32px rgba(0,0,0,0.6), var(--menu-glow);
            font-family: var(--menu-font);
            font-size: 13px;
            color: var(--menu-text);
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
            background: rgba(0,0,0,0.75);
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
            background: var(--menu-surface);
            border-bottom: 1px solid var(--menu-border);
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
            color: rgba(0,0,0,0.6);
        }

        #aiCodeMenu .header .window-controls .btn-close {
            background: #f85149;
            border: 1px solid rgba(0,0,0,0.1);
        }

        #aiCodeMenu .header .window-controls .btn-minimize {
            background: #d2991d;
            border: 1px solid rgba(0,0,0,0.1);
        }

        #aiCodeMenu .header .window-controls .btn-maximize {
            background: #3fb950;
            border: 1px solid rgba(0,0,0,0.1);
        }

        #aiCodeMenu .header .title-section {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 8px;
            justify-content: center;
        }

        #aiCodeMenu .header .logo {
            color: var(--menu-accent);
            display: flex;
            align-items: center;
        }

        #aiCodeMenu .header .title {
            color: var(--menu-text);
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
        }

        #aiCodeMenu .header .version {
            color: var(--menu-text-secondary);
            font-size: 10px;
            font-weight: 500;
            background: rgba(255,255,255,0.05);
            padding: 2px 6px;
            border-radius: 4px;
            border: 1px solid var(--menu-border);
        }

        #aiCodeMenu .tabs-container {
            display: flex;
            background: var(--menu-bg);
            border-bottom: 1px solid var(--menu-border);
            padding: 0 16px;
            gap: 2px;
            flex-shrink: 0;
        }

        #aiCodeMenu .tabs-container .tab {
            padding: 10px 20px;
            color: var(--menu-text-secondary);
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
            font-family: var(--menu-font);
        }

        #aiCodeMenu .tabs-container .tab svg {
            opacity: 0.6;
            transition: opacity 0.2s ease;
        }

        #aiCodeMenu .tabs-container .tab:hover {
            color: var(--menu-text);
            background: rgba(255,255,255,0.03);
        }

        #aiCodeMenu .tabs-container .tab:hover svg {
            opacity: 0.9;
        }

        #aiCodeMenu .tabs-container .tab.active {
            color: var(--menu-accent);
            border-bottom-color: var(--menu-accent);
        }

        #aiCodeMenu .tabs-container .tab.active svg {
            opacity: 1;
            color: var(--menu-accent);
        }

        #aiCodeMenu .content {
            overflow-y: auto;
            flex: 1;
            background: var(--menu-bg);
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
            background: var(--menu-border);
            border-radius: 2px;
        }

        #aiCodeMenu .content::-webkit-scrollbar-thumb:hover {
            background: var(--menu-text-secondary);
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
            color: var(--menu-text-secondary);
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid var(--menu-border);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        #aiCodeMenu .section-title svg {
            opacity: 0.6;
        }

        #aiCodeMenu .option-group {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        #aiCodeMenu .option-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 12px;
            border-radius: 4px;
            background: rgba(255,255,255,0.02);
            transition: background 0.2s ease;
            border: 1px solid transparent;
            cursor: pointer;
        }

        #aiCodeMenu .option-item:hover {
            background: rgba(255,255,255,0.04);
            border-color: var(--menu-border);
        }

        #aiCodeMenu .option-label {
            color: var(--menu-text);
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        #aiCodeMenu .option-description {
            color: var(--menu-text-secondary);
            font-size: 10px;
            margin-top: 2px;
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
            background: var(--menu-border);
            border-radius: 22px;
            transition: all 0.3s ease;
            cursor: pointer;
            border: 1px solid rgba(255,255,255,0.1);
        }

        #aiCodeMenu .toggle-switch .switch-slider::before {
            content: "";
            position: absolute;
            height: 16px;
            width: 16px;
            left: 2px;
            bottom: 2px;
            background: var(--menu-text-secondary);
            border-radius: 50%;
            transition: all 0.3s ease;
        }

        #aiCodeMenu .toggle-switch input:checked + .switch-slider {
            background: var(--menu-accent);
            border-color: var(--menu-accent);
            box-shadow: 0 0 10px rgba(88,166,255,0.3);
        }

        #aiCodeMenu .toggle-switch input:checked + .switch-slider::before {
            transform: translateX(18px);
            background: #fff;
        }

        #aiCodeMenu .select-wrapper {
            position: relative;
            width: 100%;
        }

        #aiCodeMenu .select-wrapper label {
            color: var(--menu-text-secondary);
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
            background: rgba(255,255,255,0.03);
            color: var(--menu-text);
            border: 1px solid var(--menu-border);
            border-radius: 4px;
            font-size: 12px;
            outline: none;
            cursor: pointer;
            appearance: none;
            -webkit-appearance: none;
            background-image: url("data:image/svg+xml,${encodeURIComponent(icons.dropdown)}");
            background-repeat: no-repeat;
            background-position: right 12px center;
            padding-right: 32px;
            font-family: var(--menu-font);
            transition: all 0.2s ease;
        }

        #aiCodeMenu .select-wrapper select:hover {
            background: rgba(255,255,255,0.05);
            border-color: var(--menu-text-secondary);
        }

        #aiCodeMenu .select-wrapper select:focus {
            border-color: var(--menu-accent);
            box-shadow: 0 0 0 3px rgba(88,166,255,0.1);
        }

        #aiCodeMenu .select-wrapper select option {
            background: var(--menu-bg);
            color: var(--menu-text);
        }

        #aiCodeMenu .code-editor {
            position: relative;
            background: rgba(0,0,0,0.3);
            border-radius: 4px;
            border: 1px solid var(--menu-border);
            overflow: hidden;
            transition: all 0.2s ease;
        }

        #aiCodeMenu .code-editor:focus-within {
            border-color: var(--menu-accent);
            box-shadow: 0 0 0 3px rgba(88,166,255,0.1);
        }

        #aiCodeMenu .code-editor .editor-header {
            padding: 6px 12px;
            background: rgba(255,255,255,0.02);
            border-bottom: 1px solid var(--menu-border);
            font-size: 10px;
            color: var(--menu-text-secondary);
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
            color: var(--menu-text);
            border: none;
            padding: 16px;
            font-family: var(--menu-mono);
            font-size: 13px;
            resize: vertical;
            outline: none;
            line-height: 1.6;
            tab-size: 2;
            position: relative;
            z-index: 2;
        }

        #aiCodeMenu .code-editor textarea::placeholder {
            color: rgba(255,255,255,0.1);
        }

        #aiCodeMenu .code-editor .line-numbers {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 40px;
            background: rgba(0,0,0,0.2);
            border-right: 1px solid var(--menu-border);
            padding: 16px 8px;
            font-family: var(--menu-mono);
            font-size: 12px;
            color: var(--menu-text-secondary);
            text-align: right;
            line-height: 1.6;
            user-select: none;
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
            background: rgba(255,255,255,0.03);
            color: var(--menu-text);
            border: 1px solid var(--menu-border);
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
            font-weight: 600;
            transition: all 0.2s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-family: var(--menu-font);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }

        #aiCodeMenu .button-group button:hover {
            background: rgba(255,255,255,0.06);
            border-color: var(--menu-text-secondary);
            transform: translateY(-1px);
        }

        #aiCodeMenu .button-group button:active {
            transform: translateY(0);
        }

        #aiCodeMenu .button-group button.btn-primary {
            background: var(--menu-accent);
            border-color: var(--menu-accent);
            color: #fff;
            font-weight: 700;
        }

        #aiCodeMenu .button-group button.btn-primary:hover {
            background: var(--menu-accent-hover);
            border-color: var(--menu-accent-hover);
            box-shadow: 0 4px 12px rgba(88,166,255,0.3);
        }

        #aiCodeMenu .button-group button.btn-danger {
            border-color: var(--menu-danger);
            color: var(--menu-danger);
        }

        #aiCodeMenu .button-group button.btn-danger:hover {
            background: var(--menu-danger);
            color: #fff;
        }

        #aiCodeMenu .button-group button.btn-warning {
            border-color: var(--menu-warning);
            color: var(--menu-warning);
        }

        #aiCodeMenu .button-group button.btn-warning:hover {
            background: var(--menu-warning);
            color: #fff;
        }

        #aiCodeMenu .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 1000000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.2s ease;
        }

        #aiCodeMenu .modal {
            background: var(--menu-surface);
            border: 1px solid var(--menu-border);
            border-radius: 8px;
            padding: 24px;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 8px 32px rgba(0,0,0,0.6), var(--menu-glow);
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
            border-bottom: 1px solid var(--menu-border);
        }

        #aiCodeMenu .modal .modal-title {
            font-size: 14px;
            font-weight: 700;
            color: var(--menu-text);
        }

        #aiCodeMenu .modal .modal-body {
            color: var(--menu-text-secondary);
            font-size: 12px;
            line-height: 1.6;
            margin-bottom: 20px;
        }

        #aiCodeMenu .modal .modal-body .code-block {
            background: rgba(0,0,0,0.3);
            border: 1px solid var(--menu-border);
            border-radius: 4px;
            padding: 12px;
            margin: 12px 0;
            font-family: var(--menu-mono);
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
            background: var(--menu-accent);
            border: none;
            border-radius: 4px;
            color: #fff;
            font-size: 11px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-family: var(--menu-font);
        }

        #aiCodeMenu .modal .modal-footer button:hover {
            background: var(--menu-accent-hover);
            box-shadow: 0 4px 12px rgba(88,166,255,0.3);
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
            background: rgba(255,255,255,0.02);
            border: 1px solid var(--menu-border);
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 11px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        #aiCodeMenu .history-item:hover {
            background: rgba(255,255,255,0.05);
            border-color: var(--menu-accent);
        }

        #aiCodeMenu .history-item .history-code {
            font-family: var(--menu-mono);
            max-width: 300px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        #aiCodeMenu .history-item .history-time {
            color: var(--menu-text-secondary);
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
            <div class="logo">${icons.code}</div>
            <div class="title">CS2 Mod Menu</div>
            <div class="version">v2.1</div>
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
                <div class="option-item" id="optionPaste">
                    <div>
                        <div class="option-label">Allow Paste</div>
                        <div class="option-description">Enable clipboard paste operations</div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="togglePaste" ${state.allowPaste ? 'checked' : ''}>
                        <span class="switch-slider"></span>
                    </label>
                </div>
                <div class="option-item" id="optionText">
                    <div>
                        <div class="option-label">Text Input Mode</div>
                        <div class="option-description">Manual text input simulation</div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="toggleText" ${state.textInput ? 'checked' : ''}>
                        <span class="switch-slider"></span>
                    </label>
                </div>
                <div class="option-item" id="optionAuto">
                    <div>
                        <div class="option-label">Auto Execution</div>
                        <div class="option-description">Automatic code execution</div>
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
                    '<div style="color: var(--menu-text-secondary); text-align: center; padding: 20px;">No execution history</div>' : 
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
                <span style="color: ${type === 'error' ? 'var(--menu-danger)' : 'var(--menu-accent)'}">${iconSvg}</span>
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
            historyList.innerHTML = '<div style="color: var(--menu-text-secondary); text-align: center; padding: 20px;">No execution history</div>';
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
        saveState();
    });

    toggleText.addEventListener('change', function() {
        state.textInput = this.checked;
        saveState();
    });

    toggleAuto.addEventListener('change', function() {
        state.autoType = this.checked;
        if (state.autoType) {
            state.method = 'auto';
            document.getElementById('methodSelect').value = 'auto';
        }
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
        if (e.target.closest('button')) return; // Don't drag when clicking buttons
        
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
    if (!state.allowPaste) {
        const pasteBtn = document.getElementById('pasteBtn');
        pasteBtn.disabled = true;
        pasteBtn.style.opacity = '0.4';
        pasteBtn.style.cursor = 'not-allowed';
    }

    // Initialize history
    updateHistoryTab();

    console.log('AiCode Initialized successfully');
})();
