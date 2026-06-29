(function() {
    if (document.getElementById('aiCodeMenu')) return;

    // State Manager
    const state = {
        authenticated: false,
        currentUser: null,
        userPatent: null,
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
        theme: 'dark'
    };

    // Theme Configurations
    const themes = {
        dark: {
            name: 'Dark',
            bg: '#0d1117',
            surface: '#161b22',
            border: '#30363d',
            text: '#c9d1d9',
            textSecondary: '#8b949e',
            accent: '#8b949e',
            accentHover: '#c9d1d9',
            danger: '#f85149',
            success: '#3fb950',
            warning: '#d2991d',
            glow: '0 0 20px rgba(139,148,158,0.15)'
        },
        rose: {
            name: 'Rose',
            bg: '#1a0f12',
            surface: '#241519',
            border: '#3d2028',
            text: '#e8d5d8',
            textSecondary: '#b8959a',
            accent: '#d4738c',
            accentHover: '#e895a8',
            danger: '#ff6b6b',
            success: '#7bc67e',
            warning: '#d4a853',
            glow: '0 0 20px rgba(212,115,140,0.2)'
        },
        eclipse: {
            name: 'Eclipse',
            bg: '#0a0a0f',
            surface: '#1a0f15',
            border: '#3d1f28',
            text: '#d4c5c9',
            textSecondary: '#9a858b',
            accent: '#c41e3a',
            accentHover: '#e8405a',
            danger: '#dc3545',
            success: '#5a8f5c',
            warning: '#b8942e',
            glow: '0 0 20px rgba(196,30,58,0.25)'
        }
    };

    let currentTheme = themes[state.theme];

    // SVG Icons
    const icons = {
        close: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
        minimize: `<svg width="14" height="2" viewBox="0 0 14 2" fill="none"><path d="M1 1H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
        maximize: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none"/></svg>`,
        execute: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 2L14 8L4 14V2Z" fill="currentColor"/></svg>`,
        clear: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4H14M12 4V14H4V4M6 4V2H10V4M6 7V11M10 7V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        paste: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="4" y="2" width="8" height="12" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M3 4H13V14H3V4Z" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>`,
        settings: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M8 1V3M8 13V15M15 8H13M3 8H1M12.95 3.05L11.54 4.46M4.46 11.54L3.05 12.95M12.95 12.95L11.54 11.54M4.46 4.46L3.05 3.05" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
        code: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5 4L1 8L5 12M11 4L15 8L11 12M9 1L7 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        history: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M8 4V8L10.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
        user: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="4" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M3 17C3 13.6863 6.13401 11 10 11C13.866 11 17 13.6863 17 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
        lock: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="4" y="8" width="12" height="10" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M7 8V6C7 4.34315 8.34315 3 10 3C11.6569 3 13 4.34315 13 6V8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
        shield: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2L14 5V9C14 12.3137 11.7614 15.1046 8 16C4.23858 15.1046 2 12.3137 2 9V5L8 2Z" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>`,
        logout: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 14H3C2.44772 14 2 13.5523 2 13V3C2 2.44772 2.44772 2 3 2H6M11 11L14 8M14 8L11 5M14 8H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        key: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="11" cy="5" r="3" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M9 5H2V8L3.5 9.5L5 8V9.5L6.5 11L8 9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    };

    // Load CSS
    const style = document.createElement('style');
    style.textContent = `
        #aiCodeMenu * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        #aiCodeMenu {
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 13px;
            user-select: none;
            letter-spacing: 0.01em;
            -webkit-font-smoothing: antialiased;
        }

        /* Login Overlay */
        #aiCodeMenu .login-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.85);
            backdrop-filter: blur(10px);
            z-index: 1000001;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        }

        #aiCodeMenu .login-container {
            background: ${currentTheme.surface};
            border: 2px solid rgba(255,255,255,0.1);
            border-radius: 12px;
            padding: 40px;
            width: 400px;
            max-width: 90%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5), ${currentTheme.glow};
            backdrop-filter: blur(20px);
            animation: slideUp 0.3s ease;
        }

        #aiCodeMenu .login-container .login-header {
            text-align: center;
            margin-bottom: 30px;
        }

        #aiCodeMenu .login-container .login-header .logo-icon {
            width: 60px;
            height: 60px;
            margin: 0 auto 16px;
            background: ${currentTheme.accent};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            box-shadow: 0 4px 15px ${currentTheme.accent}40;
        }

        #aiCodeMenu .login-container h2 {
            color: ${currentTheme.text};
            font-size: 28px;
            font-weight: 600;
            letter-spacing: 0.5px;
        }

        #aiCodeMenu .login-container .input-group {
            position: relative;
            margin-bottom: 20px;
        }

        #aiCodeMenu .login-container .input-group input {
            width: 100%;
            height: 50px;
            background: rgba(255,255,255,0.03);
            border: 2px solid rgba(255,255,255,0.1);
            border-radius: 10px;
            padding: 0 50px 0 20px;
            color: ${currentTheme.text};
            font-size: 15px;
            outline: none;
            transition: all 0.3s ease;
        }

        #aiCodeMenu .login-container .input-group input:focus {
            border-color: ${currentTheme.accent};
            box-shadow: 0 0 0 3px ${currentTheme.accent}20;
        }

        #aiCodeMenu .login-container .input-group input::placeholder {
            color: ${currentTheme.textSecondary};
        }

        #aiCodeMenu .login-container .input-group .input-icon {
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            color: ${currentTheme.textSecondary};
        }

        #aiCodeMenu .login-container .remember-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            font-size: 13px;
        }

        #aiCodeMenu .login-container .remember-row label {
            color: ${currentTheme.textSecondary};
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
        }

        #aiCodeMenu .login-container .remember-row input[type="checkbox"] {
            accent-color: ${currentTheme.accent};
            width: 16px;
            height: 16px;
            cursor: pointer;
        }

        #aiCodeMenu .login-container .remember-row a {
            color: ${currentTheme.accent};
            text-decoration: none;
            transition: color 0.2s;
        }

        #aiCodeMenu .login-container .remember-row a:hover {
            color: ${currentTheme.accentHover};
            text-decoration: underline;
        }

        #aiCodeMenu .login-container .btn-login {
            width: 100%;
            height: 50px;
            background: ${currentTheme.accent};
            border: none;
            border-radius: 10px;
            color: #fff;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            letter-spacing: 1px;
        }

        #aiCodeMenu .login-container .btn-login:hover {
            background: ${currentTheme.accentHover};
            box-shadow: 0 4px 15px ${currentTheme.accent}40;
            transform: translateY(-1px);
        }

        #aiCodeMenu .login-container .btn-login:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }

        #aiCodeMenu .login-container .login-footer {
            text-align: center;
            margin-top: 20px;
            color: ${currentTheme.textSecondary};
            font-size: 13px;
        }

        #aiCodeMenu .login-container .login-footer a {
            color: ${currentTheme.accent};
            text-decoration: none;
            font-weight: 500;
        }

        #aiCodeMenu .login-container .login-error {
            background: ${currentTheme.danger}20;
            border: 1px solid ${currentTheme.danger};
            color: ${currentTheme.danger};
            padding: 10px 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 12px;
            display: none;
            animation: shake 0.5s ease;
        }

        /* Main Menu */
        #aiCodeMenu .menu-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.75);
            backdrop-filter: blur(8px);
            z-index: 999998;
            display: none;
            animation: fadeIn 0.3s ease;
        }

        #aiCodeMenu .main-menu {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${currentTheme.bg};
            border: 1px solid ${currentTheme.border};
            border-radius: 8px;
            min-width: 440px;
            max-width: 520px;
            width: 95%;
            z-index: 999999;
            box-shadow: 0 8px 32px rgba(0,0,0,0.6), ${currentTheme.glow};
            display: none;
            flex-direction: column;
            max-height: 90vh;
            animation: slideUp 0.3s ease;
        }

        #aiCodeMenu .main-menu.minimized {
            max-height: 48px;
            overflow: hidden;
        }

        /* Header */
        #aiCodeMenu .menu-header {
            display: flex;
            align-items: center;
            padding: 12px 16px;
            background: ${currentTheme.surface};
            border-bottom: 1px solid ${currentTheme.border};
            border-radius: 8px 8px 0 0;
            flex-shrink: 0;
            cursor: move;
            gap: 12px;
        }

        #aiCodeMenu .menu-header .window-controls {
            display: flex;
            gap: 8px;
        }

        #aiCodeMenu .menu-header .window-controls button {
            width: 14px;
            height: 14px;
            border-radius: 50%;
            border: none;
            cursor: pointer;
            padding: 0;
            transition: all 0.2s;
        }

        #aiCodeMenu .menu-header .window-controls .btn-close {
            background: ${currentTheme.danger};
        }
        #aiCodeMenu .menu-header .window-controls .btn-minimize {
            background: ${currentTheme.warning};
        }
        #aiCodeMenu .menu-header .window-controls .btn-maximize {
            background: ${currentTheme.success};
        }

        #aiCodeMenu .menu-header .header-left {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        #aiCodeMenu .menu-header .header-left .logo {
            color: ${currentTheme.accent};
            display: flex;
            align-items: center;
        }

        #aiCodeMenu .menu-header .header-left .title {
            color: ${currentTheme.text};
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
        }

        #aiCodeMenu .menu-header .header-right {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        #aiCodeMenu .menu-header .user-info {
            display: flex;
            align-items: center;
            gap: 8px;
            color: ${currentTheme.text};
            font-size: 11px;
        }

        #aiCodeMenu .menu-header .user-badge {
            background: ${currentTheme.accent}30;
            border: 1px solid ${currentTheme.accent};
            color: ${currentTheme.accent};
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 10px;
            font-weight: 600;
            letter-spacing: 0.5px;
        }

        #aiCodeMenu .menu-header .btn-logout {
            background: none;
            border: 1px solid ${currentTheme.border};
            color: ${currentTheme.textSecondary};
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 10px;
        }

        #aiCodeMenu .menu-header .btn-logout:hover {
            border-color: ${currentTheme.danger};
            color: ${currentTheme.danger};
        }

        /* Tabs */
        #aiCodeMenu .tabs-nav {
            display: flex;
            background: ${currentTheme.bg};
            border-bottom: 1px solid ${currentTheme.border};
            padding: 0 16px;
            gap: 2px;
            flex-shrink: 0;
        }

        #aiCodeMenu .tabs-nav .tab {
            padding: 10px 20px;
            color: ${currentTheme.textSecondary};
            cursor: pointer;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            background: transparent;
            border: none;
            border-bottom: 2px solid transparent;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        #aiCodeMenu .tabs-nav .tab:hover {
            color: ${currentTheme.text};
            background: rgba(255,255,255,0.02);
        }

        #aiCodeMenu .tabs-nav .tab.active {
            color: ${currentTheme.accent};
            border-bottom-color: ${currentTheme.accent};
        }

        /* Content */
        #aiCodeMenu .menu-content {
            overflow-y: auto;
            flex: 1;
            background: ${currentTheme.bg};
            border-radius: 0 0 8px 8px;
            max-height: calc(90vh - 120px);
        }

        #aiCodeMenu .menu-content::-webkit-scrollbar {
            width: 4px;
        }
        #aiCodeMenu .menu-content::-webkit-scrollbar-track {
            background: transparent;
        }
        #aiCodeMenu .menu-content::-webkit-scrollbar-thumb {
            background: ${currentTheme.border};
            border-radius: 2px;
        }

        #aiCodeMenu .tab-panel {
            display: none;
            padding: 20px;
            animation: fadeSlideIn 0.2s ease;
        }

        #aiCodeMenu .tab-panel.active {
            display: block;
        }

        /* Section */
        #aiCodeMenu .section {
            margin-bottom: 24px;
        }
        #aiCodeMenu .section:last-child {
            margin-bottom: 0;
        }

        #aiCodeMenu .section-title {
            color: ${currentTheme.textSecondary};
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid ${currentTheme.border};
            display: flex;
            align-items: center;
            gap: 8px;
        }

        /* Options */
        #aiCodeMenu .option-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 12px;
            border-radius: 4px;
            background: rgba(255,255,255,0.02);
            transition: all 0.2s;
            border: 1px solid transparent;
            cursor: pointer;
            margin-bottom: 2px;
        }
        #aiCodeMenu .option-item:hover {
            background: rgba(255,255,255,0.04);
            border-color: ${currentTheme.border};
        }

        #aiCodeMenu .option-label {
            color: ${currentTheme.text};
            font-size: 12px;
            font-weight: 500;
        }
        #aiCodeMenu .option-description {
            color: ${currentTheme.textSecondary};
            font-size: 10px;
            margin-top: 2px;
        }

        /* Toggle Switch */
        #aiCodeMenu .toggle-switch {
            position: relative;
            width: 40px;
            height: 22px;
            cursor: pointer;
        }
        #aiCodeMenu .toggle-switch input {
            display: none;
        }
        #aiCodeMenu .toggle-switch .switch-slider {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: ${currentTheme.border};
            border-radius: 22px;
            transition: all 0.3s;
            border: 1px solid rgba(255,255,255,0.05);
        }
        #aiCodeMenu .toggle-switch .switch-slider::before {
            content: "";
            position: absolute;
            height: 16px;
            width: 16px;
            left: 2px;
            bottom: 2px;
            background: ${currentTheme.textSecondary};
            border-radius: 50%;
            transition: all 0.3s;
        }
        #aiCodeMenu .toggle-switch input:checked + .switch-slider {
            background: ${currentTheme.accent};
            border-color: ${currentTheme.accent};
            box-shadow: 0 0 10px ${currentTheme.accent}40;
        }
        #aiCodeMenu .toggle-switch input:checked + .switch-slider::before {
            transform: translateX(18px);
            background: #fff;
        }

        /* Select */
        #aiCodeMenu .select-wrapper select {
            width: 100%;
            padding: 10px 12px;
            background: rgba(255,255,255,0.03);
            color: ${currentTheme.text};
            border: 1px solid ${currentTheme.border};
            border-radius: 4px;
            font-size: 12px;
            outline: none;
            cursor: pointer;
            appearance: none;
            padding-right: 32px;
            background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%238b949e' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 12px center;
            transition: all 0.2s;
        }
        #aiCodeMenu .select-wrapper select:focus {
            border-color: ${currentTheme.accent};
            box-shadow: 0 0 0 3px ${currentTheme.accent}20;
        }

        /* Code Editor */
        #aiCodeMenu .code-editor {
            background: rgba(0,0,0,0.3);
            border-radius: 4px;
            border: 1px solid ${currentTheme.border};
            overflow: hidden;
        }
        #aiCodeMenu .code-editor:focus-within {
            border-color: ${currentTheme.accent};
            box-shadow: 0 0 0 3px ${currentTheme.accent}20;
        }
        #aiCodeMenu .code-editor .editor-bar {
            padding: 6px 12px;
            background: rgba(255,255,255,0.02);
            border-bottom: 1px solid ${currentTheme.border};
            font-size: 10px;
            color: ${currentTheme.textSecondary};
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
            color: ${currentTheme.text};
            border: none;
            padding: 16px;
            font-family: 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
            font-size: 13px;
            resize: vertical;
            outline: none;
            line-height: 1.6;
        }
        #aiCodeMenu .code-editor textarea::placeholder {
            color: rgba(255,255,255,0.08);
        }

        /* Buttons */
        #aiCodeMenu .btn-row {
            display: flex;
            gap: 8px;
            margin-top: 12px;
        }
        #aiCodeMenu .btn-row button {
            flex: 1;
            padding: 10px 16px;
            background: rgba(255,255,255,0.03);
            color: ${currentTheme.text};
            border: 1px solid ${currentTheme.border};
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }
        #aiCodeMenu .btn-row button:hover {
            background: rgba(255,255,255,0.06);
            transform: translateY(-1px);
        }
        #aiCodeMenu .btn-row button.btn-danger {
            border-color: ${currentTheme.danger};
            color: ${currentTheme.danger};
        }
        #aiCodeMenu .btn-row button.btn-danger:hover {
            background: ${currentTheme.danger};
            color: #fff;
        }
        #aiCodeMenu .btn-row button.btn-warning {
            border-color: ${currentTheme.warning};
            color: ${currentTheme.warning};
        }
        #aiCodeMenu .btn-row button.btn-warning:hover {
            background: ${currentTheme.warning};
            color: #fff;
        }
        #aiCodeMenu .btn-row button.btn-primary {
            background: ${currentTheme.accent};
            border-color: ${currentTheme.accent};
            color: #fff;
        }
        #aiCodeMenu .btn-row button.btn-primary:hover {
            background: ${currentTheme.accentHover};
            box-shadow: 0 4px 12px ${currentTheme.accent}40;
        }

        /* Modal */
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
            background: ${currentTheme.surface};
            border: 1px solid ${currentTheme.border};
            border-radius: 8px;
            padding: 24px;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 8px 32px rgba(0,0,0,0.6);
            animation: modalSlideIn 0.2s ease;
        }
        #aiCodeMenu .modal .modal-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid ${currentTheme.border};
            color: ${currentTheme.text};
            font-weight: 600;
        }
        #aiCodeMenu .modal .modal-body {
            color: ${currentTheme.textSecondary};
            font-size: 12px;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        #aiCodeMenu .modal .modal-footer button {
            padding: 8px 24px;
            background: ${currentTheme.accent};
            border: none;
            border-radius: 4px;
            color: #fff;
            font-weight: 600;
            cursor: pointer;
            letter-spacing: 1px;
        }

        /* History */
        #aiCodeMenu .history-item {
            padding: 8px 12px;
            background: rgba(255,255,255,0.02);
            border: 1px solid ${currentTheme.border};
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s;
            margin-bottom: 4px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11px;
        }
        #aiCodeMenu .history-item:hover {
            background: rgba(255,255,255,0.05);
            border-color: ${currentTheme.accent};
        }
        #aiCodeMenu .history-code {
            font-family: monospace;
            max-width: 300px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: ${currentTheme.text};
        }
        #aiCodeMenu .history-time {
            color: ${currentTheme.textSecondary};
            font-size: 10px;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from { opacity: 0; transform: translate(-50%, -45%); }
            to { opacity: 1; transform: translate(-50%, -50%); }
        }
        @keyframes fadeSlideIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes modalSlideIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }

        @media (max-width: 480px) {
            #aiCodeMenu .main-menu {
                min-width: unset;
                width: 95%;
                max-width: 95%;
            }
            #aiCodeMenu .login-container {
                padding: 30px 25px;
            }
        }
    `;
    document.head.appendChild(style);

    // Fetch whitelist
    async function fetchWhitelist() {
        try {
            const response = await fetch('https://raw.githubusercontent.com/AKAIDOUSER/AiCode-JS/refs/heads/main/WhiteList.js');
            const text = await response.text();
            // Extract array from JS file
            const match = text.match(/\[([\s\S]*)\]/);
            if (match) {
                return JSON.parse(`[${match[1]}]`);
            }
            return [];
        } catch (e) {
            console.error('[AiCode] Failed to fetch whitelist:', e);
            return [];
        }
    }

    // Create Login Screen
    function createLoginScreen() {
        const overlay = document.createElement('div');
        overlay.className = 'login-overlay';
        overlay.id = 'loginOverlay';
        
        overlay.innerHTML = `
            <div class="login-container">
                <div class="login-header">
                    <div class="logo-icon">${icons.shield}</div>
                    <h2>Authentication</h2>
                </div>
                <div class="login-error" id="loginError">Invalid credentials</div>
                <div class="input-group">
                    <input type="text" id="loginUser" placeholder="Username" autocomplete="off">
                    <span class="input-icon">${icons.user}</span>
                </div>
                <div class="input-group">
                    <input type="password" id="loginPass" placeholder="Password">
                    <span class="input-icon">${icons.lock}</span>
                </div>
                <div class="remember-row">
                    <label>
                        <input type="checkbox" id="rememberMe">
                        Remember me
                    </label>
                </div>
                <button class="btn-login" id="btnLogin">Sign In</button>
                <div class="login-footer">
                    Protected by <a href="#">AiCode Security</a>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Login handler
        document.getElementById('btnLogin').addEventListener('click', async () => {
            const user = document.getElementById('loginUser').value.trim();
            const pass = document.getElementById('loginPass').value.trim();
            const errorEl = document.getElementById('loginError');
            
            if (!user || !pass) {
                errorEl.textContent = 'Please fill in all fields';
                errorEl.style.display = 'block';
                return;
            }
            
            document.getElementById('btnLogin').disabled = true;
            document.getElementById('btnLogin').textContent = 'Authenticating...';
            
            try {
                const whitelist = await fetchWhitelist();
                
                const found = whitelist.find(entry => 
                    entry.username === user && entry.password === pass
                );
                
                if (found) {
                    state.authenticated = true;
                    state.currentUser = found.username;
                    state.userPatent = found.patent || 'User';
                    
                    if (document.getElementById('rememberMe').checked) {
                        localStorage.setItem('aiCodeAuth', JSON.stringify({
                            user: found.username,
                            pass: found.password
                        }));
                    }
                    
                    errorEl.style.display = 'none';
                    overlay.remove();
                    createMainMenu();
                } else {
                    errorEl.textContent = 'Invalid username or password';
                    errorEl.style.display = 'block';
                    document.getElementById('btnLogin').disabled = false;
                    document.getElementById('btnLogin').textContent = 'Sign In';
                }
            } catch (e) {
                errorEl.textContent = 'Connection error. Try again.';
                errorEl.style.display = 'block';
                document.getElementById('btnLogin').disabled = false;
                document.getElementById('btnLogin').textContent = 'Sign In';
            }
        });
        
        // Enter key to login
        document.getElementById('loginPass').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') document.getElementById('btnLogin').click();
        });
        
        // Check for saved credentials
        checkSavedAuth();
    }
    
    async function checkSavedAuth() {
        const saved = localStorage.getItem('aiCodeAuth');
        if (!saved) return;
        
        try {
            const { user, pass } = JSON.parse(saved);
            const whitelist = await fetchWhitelist();
            const found = whitelist.find(entry => 
                entry.username === user && entry.password === pass
            );
            
            if (found) {
                state.authenticated = true;
                state.currentUser = found.username;
                state.userPatent = found.patent || 'User';
                
                document.getElementById('loginOverlay').remove();
                createMainMenu();
            }
        } catch (e) {
            localStorage.removeItem('aiCodeAuth');
        }
    }

    // Create Main Menu
    function createMainMenu() {
        if (document.getElementById('mainMenu')) return;
        
        const overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        overlay.id = 'menuOverlay';
        overlay.style.display = 'block';
        
        const menu = document.createElement('div');
        menu.className = 'main-menu';
        menu.id = 'mainMenu';
        menu.style.display = 'flex';
        
        // Header
        menu.innerHTML = `
            <div class="menu-header" id="menuHeader">
                <div class="window-controls">
                    <button class="btn-close" id="btnClose" title="Close"></button>
                    <button class="btn-minimize" id="btnMinimize" title="Minimize"></button>
                    <button class="btn-maximize" id="btnMaximize" title="Maximize"></button>
                </div>
                <div class="header-left">
                    <span class="logo">${icons.code}</span>
                    <span class="title">AiCode Executor</span>
                </div>
                <div class="header-right">
                    <span class="user-info">
                        ${icons.user}
                        <span id="displayUser">${state.currentUser}</span>
                    </span>
                    <span class="user-badge" id="displayPatent">${state.userPatent}</span>
                    <button class="btn-logout" id="btnLogout" title="Logout">
                        ${icons.logout}
                    </button>
                </div>
            </div>
            <div class="tabs-nav">
                <button class="tab active" data-tab="general">${icons.settings} General</button>
                <button class="tab" data-tab="executor">${icons.code} Executor</button>
                <button class="tab" data-tab="history">${icons.history} History</button>
                <button class="tab" data-tab="settings">${icons.key} Settings</button>
            </div>
            <div class="menu-content">
                <div class="tab-panel active" data-tab="general">
                    <div class="section">
                        <div class="section-title">${icons.settings} Configuration</div>
                        <div class="option-item">
                            <div>
                                <div class="option-label">Allow Paste</div>
                                <div class="option-description">Enable clipboard operations</div>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" id="togglePaste" ${state.allowPaste ? 'checked' : ''}>
                                <span class="switch-slider"></span>
                            </label>
                        </div>
                        <div class="option-item">
                            <div>
                                <div class="option-label">Text Input Mode</div>
                                <div class="option-description">Simulated text input</div>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" id="toggleText" ${state.textInput ? 'checked' : ''}>
                                <span class="switch-slider"></span>
                            </label>
                        </div>
                        <div class="option-item">
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
                <div class="tab-panel" data-tab="executor">
                    <div class="section">
                        <div class="section-title">${icons.code} Code Executor</div>
                        <div class="code-editor">
                            <div class="editor-bar">${icons.code} script.lua</div>
                            <textarea id="executorText" placeholder="-- Enter your code here..." spellcheck="false"></textarea>
                        </div>
                        <div class="btn-row">
                            <button class="btn-danger" id="clearBtn">${icons.clear} Clear</button>
                            <button class="btn-warning" id="pasteBtn">${icons.paste} Paste</button>
                            <button class="btn-primary" id="executeBtn">${icons.execute} Execute</button>
                        </div>
                    </div>
                </div>
                <div class="tab-panel" data-tab="history">
                    <div class="section">
                        <div class="section-title">${icons.history} Execution History</div>
                        <div id="historyList">
                            <div style="color: ${currentTheme.textSecondary}; text-align: center; padding: 20px;">No history yet</div>
                        </div>
                    </div>
                </div>
                <div class="tab-panel" data-tab="settings">
                    <div class="section">
                        <div class="section-title">${icons.key} Theme Settings</div>
                        <div class="select-wrapper" style="margin-bottom: 16px;">
                            <label style="color: ${currentTheme.textSecondary}; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 6px;">Theme</label>
                            <select id="themeSelect">
                                <option value="dark" ${state.theme === 'dark' ? 'selected' : ''}>Dark</option>
                                <option value="rose" ${state.theme === 'rose' ? 'selected' : ''}>Rose</option>
                                <option value="eclipse" ${state.theme === 'eclipse' ? 'selected' : ''}>Eclipse</option>
                            </select>
                        </div>
                    </div>
                    <div class="section">
                        <div class="section-title">${icons.shield} Account</div>
                        <div style="color: ${currentTheme.textSecondary}; font-size: 11px; margin-bottom: 8px;">
                            Logged in as: <strong style="color: ${currentTheme.text};">${state.currentUser}</strong>
                            <br>Patent: <strong style="color: ${currentTheme.accent};">${state.userPatent}</strong>
                        </div>
                        <button class="btn-logout" id="btnLogout2" style="width: 100%; padding: 10px; border: 1px solid ${currentTheme.danger}; color: ${currentTheme.danger}; background: transparent; border-radius: 4px; cursor: pointer; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 6px;">
                            ${icons.logout} Logout
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        document.body.appendChild(menu);
        
        // Setup events after DOM is ready
        setupMenuEvents();
    }
    
    function setupMenuEvents() {
        // Close
        document.getElementById('btnClose').onclick = closeMenu;
        document.getElementById('menuOverlay').onclick = closeMenu;
        
        // Minimize
        document.getElementById('btnMinimize').onclick = () => {
            state.minimized = !state.minimized;
            document.getElementById('mainMenu').classList.toggle('minimized', state.minimized);
        };
        
        // Logout
        const logout = () => {
            localStorage.removeItem('aiCodeAuth');
            state.authenticated = false;
            state.currentUser = null;
            state.userPatent = null;
            document.getElementById('mainMenu').remove();
            document.getElementById('menuOverlay').remove();
            createLoginScreen();
        };
        document.getElementById('btnLogout').onclick = logout;
        document.getElementById('btnLogout2').onclick = logout;
        
        // Tabs
        document.querySelectorAll('.tabs-nav .tab').forEach(tab => {
            tab.onclick = () => {
                const tabId = tab.dataset.tab;
                document.querySelectorAll('.tabs-nav .tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
                tab.classList.add('active');
                document.querySelector(`.tab-panel[data-tab="${tabId}"]`).classList.add('active');
                state.activeTab = tabId;
            };
        });
        
        // Theme
        document.getElementById('themeSelect').onchange = function() {
            state.theme = this.value;
            saveState();
            // Reload menu with new theme
            document.getElementById('mainMenu').remove();
            document.getElementById('menuOverlay').remove();
            currentTheme = themes[state.theme];
            updateStyle();
            createMainMenu();
        };
        
        // Toggles
        document.getElementById('togglePaste').onchange = function() {
            state.allowPaste = this.checked;
            saveState();
        };
        document.getElementById('toggleText').onchange = function() {
            state.textInput = this.checked;
            saveState();
        };
        document.getElementById('toggleAuto').onchange = function() {
            state.autoType = this.checked;
            if (this.checked) state.method = 'auto';
            saveState();
        };
        
        // Executor
        const textarea = document.getElementById('executorText');
        document.getElementById('clearBtn').onclick = () => {
            textarea.value = '';
            showModal('Cleared', 'Editor cleared successfully.');
        };
        document.getElementById('pasteBtn').onclick = async () => {
            if (!state.allowPaste) {
                showModal('Error', 'Paste is disabled in settings.', 'error');
                return;
            }
            try {
                const text = await navigator.clipboard.readText();
                textarea.value = text;
                showModal('Success', 'Code pasted from clipboard.');
            } catch(e) {
                showModal('Error', 'Failed to access clipboard.');
            }
        };
        document.getElementById('executeBtn').onclick = () => {
            const code = textarea.value.trim();
            if (!code) {
                showModal('Error', 'No code to execute.');
                return;
            }
            state.history.unshift({
                code,
                timestamp: new Date().toISOString()
            });
            if (state.history.length > 50) state.history = state.history.slice(0, 50);
            saveState();
            updateHistoryList();
            showModal('Success', 'Code executed successfully.');
        };
        
        // Drag
        setupDrag();
    }
    
    function updateStyle() {
        const oldStyle = document.querySelector('style');
        if (oldStyle) oldStyle.remove();
        const newStyle = document.createElement('style');
        newStyle.textContent = style.textContent;
        document.head.appendChild(newStyle);
    }
    
    function closeMenu() {
        const menu = document.getElementById('mainMenu');
        const overlay = document.getElementById('menuOverlay');
        if (menu) menu.style.display = 'none';
        if (overlay) overlay.style.display = 'none';
    }
    
    function showModal(title, message, type = 'info') {
        const existing = document.querySelector('.modal-overlay');
        if (existing) existing.remove();
        
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <span style="color: ${currentTheme.accent}">${icons.shield}</span>
                    ${title}
                </div>
                <div class="modal-body">${message}</div>
                <div class="modal-footer">
                    <button id="modalOk">OK</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        
        document.getElementById('modalOk').onclick = () => overlay.remove();
        overlay.onclick = (e) => {
            if (e.target === overlay) overlay.remove();
        };
    }
    
    function updateHistoryList() {
        const list = document.getElementById('historyList');
        if (!list) return;
        if (state.history.length === 0) {
            list.innerHTML = `<div style="color: ${currentTheme.textSecondary}; text-align: center; padding: 20px;">No history yet</div>`;
            return;
        }
        list.innerHTML = state.history.map((item, i) => `
            <div class="history-item" data-index="${i}">
                <span class="history-code">${item.code.substring(0, 40)}${item.code.length > 40 ? '...' : ''}</span>
                <span class="history-time">${new Date(item.timestamp).toLocaleTimeString()}</span>
            </div>
        `).join('');
    }
    
    function setupDrag() {
        const header = document.getElementById('menuHeader');
        const menu = document.getElementById('mainMenu');
        let isDragging = false, offsetX, offsetY;
        
        header.onmousedown = (e) => {
            if (e.target.closest('button')) return;
            isDragging = true;
            const rect = menu.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            menu.style.transition = 'none';
            menu.style.transform = 'none';
            menu.style.left = rect.left + 'px';
            menu.style.top = rect.top + 'px';
            e.preventDefault();
        };
        
        document.onmousemove = (e) => {
            if (!isDragging) return;
            let x = e.clientX - offsetX;
            let y = e.clientY - offsetY;
            x = Math.max(0, Math.min(x, window.innerWidth - menu.offsetWidth));
            y = Math.max(0, Math.min(y, window.innerHeight - menu.offsetHeight));
            menu.style.left = x + 'px';
            menu.style.top = y + 'px';
        };
        
        document.onmouseup = () => {
            isDragging = false;
            menu.style.transition = '';
        };
    }
    
    function saveState() {
        try {
            localStorage.setItem('aiCodeMenuState', JSON.stringify({
                allowPaste: state.allowPaste,
                textInput: state.textInput,
                autoType: state.autoType,
                method: state.method,
                theme: state.theme,
                history: state.history.slice(0, 20)
            }));
        } catch(e) {}
    }
    
    function loadState() {
        try {
            const saved = localStorage.getItem('aiCodeMenuState');
            if (saved) {
                const data = JSON.parse(saved);
                Object.assign(state, data);
                currentTheme = themes[state.theme] || themes.dark;
            }
        } catch(e) {}
    }
    
    // Initialize
    loadState();
    createLoginScreen();
    
    console.log('[AiCode] Key System initialized');
})();
