(function() {
    if (document.getElementById('aiCodeMenu')) return;

    // Estilos globais
    const style = document.createElement('style');
    style.textContent = `
        #aiCodeMenu * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        #aiCodeMenu {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #1a1a1a;
            border-radius: 12px 12px 8px 8px;
            min-width: 340px;
            max-width: 440px;
            width: 90%;
            z-index: 999999;
            box-shadow: 0 8px 40px rgba(0,0,0,0.85);
            border: 1px solid #2a2a2a;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 13px;
            color: #cccccc;
            user-select: none;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
            backdrop-filter: blur(2px);
        }
        #aiCodeMenu .overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.6);
            backdrop-filter: blur(4px);
            z-index: 999998;
            animation: fadeOverlay 0.3s ease;
        }
        @keyframes fadeOverlay {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        #aiCodeMenu .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            background: #1f1f1f;
            border-radius: 12px 12px 0 0;
            border-bottom: 1px solid #2a2a2a;
            flex-shrink: 0;
            cursor: move;
        }
        #aiCodeMenu .header .dots {
            display: flex;
            gap: 8px;
            align-items: center;
            cursor: move;
        }
        #aiCodeMenu .header .dots span {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 1px solid rgba(255,255,255,0.08);
            cursor: pointer;
            transition: filter 0.2s;
        }
        #aiCodeMenu .header .dots span:hover {
            filter: brightness(1.2);
        }
        #aiCodeMenu .header .title {
            color: #aaaaaa;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.8px;
        }
        #aiCodeMenu .header .close-btn {
            color: #666;
            cursor: pointer;
            font-size: 16px;
            line-height: 1;
            padding: 0 6px;
            transition: color 0.2s;
            background: none;
            border: none;
        }
        #aiCodeMenu .header .close-btn:hover {
            color: #ccc;
        }
        #aiCodeMenu .tabs {
            display: flex;
            background: #151515;
            padding: 6px 12px 0 12px;
            gap: 4px;
            border-bottom: 1px solid #2a2a2a;
            flex-shrink: 0;
        }
        #aiCodeMenu .tabs .tab {
            padding: 8px 16px;
            color: #888;
            cursor: pointer;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            background: transparent;
            border-radius: 6px 6px 0 0;
            border: none;
            transition: all 0.2s;
        }
        #aiCodeMenu .tabs .tab:hover {
            color: #ccc;
            background: #222;
        }
        #aiCodeMenu .tabs .tab.active {
            color: #fff;
            background: #1f1f1f;
            box-shadow: 0 -2px 8px rgba(86,156,214,0.15);
        }
        #aiCodeMenu .content {
            padding: 16px 18px;
            overflow-y: auto;
            flex: 1;
            background: #151515;
            border-radius: 0 0 8px 8px;
        }
        #aiCodeMenu .content .tab-content {
            display: none;
            animation: fadeIn 0.25s ease;
        }
        #aiCodeMenu .content .tab-content.active {
            display: block;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
        }
        #aiCodeMenu .toggle-group {
            margin-bottom: 14px;
            display: flex;
            flex-direction: column;
            gap: 2px;
        }
        #aiCodeMenu .toggle-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #222;
        }
        #aiCodeMenu .toggle-item:last-child {
            border-bottom: none;
        }
        #aiCodeMenu .toggle-item label {
            color: #bbbbbb;
            font-size: 12.5px;
            cursor: pointer;
        }
        #aiCodeMenu .toggle-slide {
            position: relative;
            width: 38px;
            height: 22px;
            flex-shrink: 0;
            cursor: pointer;
        }
        #aiCodeMenu .toggle-slide input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        #aiCodeMenu .toggle-slide .slider {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: #333;
            border-radius: 22px;
            transition: 0.3s;
            box-shadow: inset 0 1px 3px rgba(0,0,0,0.3);
        }
        #aiCodeMenu .toggle-slide .slider::before {
            content: "";
            position: absolute;
            height: 16px;
            width: 16px;
            left: 3px;
            bottom: 3px;
            background: #888;
            border-radius: 50%;
            transition: 0.3s;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        #aiCodeMenu .toggle-slide input:checked + .slider {
            background: #569CD6;
        }
        #aiCodeMenu .toggle-slide input:checked + .slider::before {
            transform: translateX(16px);
            background: #fff;
        }
        #aiCodeMenu .custom-dropdown {
            position: relative;
            width: 100%;
            margin-top: 4px;
        }
        #aiCodeMenu .custom-dropdown select {
            width: 100%;
            padding: 8px 12px;
            background: #222;
            color: #cccccc;
            border: 1px solid #333;
            border-radius: 6px;
            font-size: 12px;
            outline: none;
            cursor: pointer;
            appearance: none;
            -webkit-appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23666'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 12px center;
            padding-right: 32px;
        }
        #aiCodeMenu .custom-dropdown select:focus {
            border-color: #569CD6;
        }
        #aiCodeMenu .custom-dropdown select option {
            background: #222;
        }
        #aiCodeMenu .executor-area {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        #aiCodeMenu .executor-area .code-editor {
            position: relative;
            background: #0d0d0d;
            border-radius: 6px;
            border: 1px solid #2a2a2a;
            overflow: hidden;
        }
        #aiCodeMenu .executor-area .code-editor textarea {
            width: 100%;
            height: 100px;
            background: transparent;
            color: #d4d4d4;
            border: none;
            padding: 12px;
            font-family: "Courier New", Consolas, monospace;
            font-size: 13px;
            resize: vertical;
            outline: none;
            line-height: 1.6;
            tab-size: 2;
            position: relative;
            z-index: 2;
        }
        #aiCodeMenu .executor-area .code-editor .syntax-highlight {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            padding: 12px;
            font-family: "Courier New", Consolas, monospace;
            font-size: 13px;
            line-height: 1.6;
            tab-size: 2;
            color: transparent;
            pointer-events: none;
            z-index: 1;
            overflow: hidden;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        #aiCodeMenu .executor-area .code-editor .syntax-highlight .keyword {
            color: #569CD6;
        }
        #aiCodeMenu .executor-area .code-editor .syntax-highlight .string {
            color: #CE9178;
        }
        #aiCodeMenu .executor-area .code-editor .syntax-highlight .comment {
            color: #6A9955;
        }
        #aiCodeMenu .executor-area .code-editor .syntax-highlight .function {
            color: #DCDCAA;
        }
        #aiCodeMenu .executor-area .code-editor .syntax-highlight .number {
            color: #B5CEA8;
        }
        #aiCodeMenu .executor-area .code-editor .syntax-highlight .operator {
            color: #D4D4D4;
        }
        #aiCodeMenu .executor-area .code-editor .syntax-highlight .variable {
            color: #9CDCFE;
        }
        #aiCodeMenu .executor-area .btn-group {
            display: flex;
            gap: 8px;
        }
        #aiCodeMenu .executor-area .btn-group button {
            flex: 1;
            padding: 8px 12px;
            background: #222;
            color: #cccccc;
            border: 1px solid #333;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
            transition: all 0.2s;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        #aiCodeMenu .executor-area .btn-group button:hover {
            background: #2a2a2a;
            border-color: #444;
            transform: translateY(-1px);
        }
        #aiCodeMenu .executor-area .btn-group button.clear-btn:hover {
            border-color: #d65a5a;
            color: #d65a5a;
        }
        #aiCodeMenu .executor-area .btn-group button.paste-btn:hover {
            border-color: #569CD6;
            color: #569CD6;
        }
        #aiCodeMenu .executor-area .btn-group button.execute-btn {
            background: #569CD6;
            border-color: #569CD6;
            color: #fff;
        }
        #aiCodeMenu .executor-area .btn-group button.execute-btn:hover {
            background: #4a8bc4;
            border-color: #4a8bc4;
        }
        #aiCodeMenu .settings-placeholder {
            color: #666;
            text-align: center;
            padding: 30px 0;
            font-size: 12px;
            letter-spacing: 0.5px;
        }
        #aiCodeMenu .custom-alert {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #1f1f1f;
            border: 1px solid #2a2a2a;
            border-radius: 8px;
            padding: 24px 32px;
            max-width: 320px;
            width: 90%;
            z-index: 1000000;
            box-shadow: 0 8px 40px rgba(0,0,0,0.9);
            text-align: center;
            animation: fadeIn 0.2s ease;
        }
        #aiCodeMenu .custom-alert p {
            color: #cccccc;
            font-size: 13px;
            margin-bottom: 20px;
            line-height: 1.5;
        }
        #aiCodeMenu .custom-alert button {
            padding: 6px 24px;
            background: #569CD6;
            border: none;
            border-radius: 4px;
            color: #fff;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        #aiCodeMenu .custom-alert button:hover {
            background: #4a8bc4;
        }
        @media (max-width: 480px) {
            #aiCodeMenu {
                min-width: unset;
                width: 92%;
                max-width: 92%;
                font-size: 12px;
            }
            #aiCodeMenu .content {
                padding: 12px 14px;
            }
            #aiCodeMenu .executor-area .code-editor textarea {
                height: 80px;
            }
        }
    `;
    document.head.appendChild(style);

    // Criar overlay
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.id = 'aiCodeOverlay';
    document.body.appendChild(overlay);

    // Criar menu
    const menu = document.createElement('div');
    menu.id = 'aiCodeMenu';

    // Header com bolinhas MacOS
    const header = document.createElement('div');
    header.className = 'header';
    header.innerHTML = `
        <div class="dots">
            <span style="background:#950101;"></span>
            <span style="background:#E3CD08;"></span>
            <span style="background:#389F00;"></span>
        </div>
        <div class="title">AICODE</div>
        <button class="close-btn" id="menuCloseBtn">✕</button>
    `;
    menu.appendChild(header);

    // Tabs
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'tabs';
    const tabs = ['General', 'Executor', 'Settings'];
    tabs.forEach((tab, index) => {
        const tabEl = document.createElement('button');
        tabEl.className = `tab ${index === 0 ? 'active' : ''}`;
        tabEl.textContent = tab;
        tabEl.dataset.tab = tab.toLowerCase();
        tabEl.onclick = () => switchTab(tab.toLowerCase());
        tabsContainer.appendChild(tabEl);
    });
    menu.appendChild(tabsContainer);

    // Content
    const content = document.createElement('div');
    content.className = 'content';

    // General Tab
    const generalContent = document.createElement('div');
    generalContent.className = 'tab-content active';
    generalContent.dataset.tab = 'general';
    generalContent.innerHTML = `
        <div class="toggle-group">
            <div class="toggle-item">
                <label>Allow Paste</label>
                <div class="toggle-slide">
                    <input type="checkbox" id="togglePaste" checked>
                    <span class="slider"></span>
                </div>
            </div>
            <div class="toggle-item">
                <label>Text Input</label>
                <div class="toggle-slide">
                    <input type="checkbox" id="toggleText">
                    <span class="slider"></span>
                </div>
            </div>
            <div class="toggle-item">
                <label>Auto Type</label>
                <div class="toggle-slide">
                    <input type="checkbox" id="toggleAuto">
                    <span class="slider"></span>
                </div>
            </div>
        </div>
        <div class="custom-dropdown">
            <label style="color:#bbbbbb;font-size:12.5px;display:block;margin-bottom:4px;">Method</label>
            <select id="methodSelect">
                <option value="paste">Paste</option>
                <option value="type">Type</option>
            </select>
        </div>
    `;
    content.appendChild(generalContent);

    // Executor Tab
    const executorContent = document.createElement('div');
    executorContent.className = 'tab-content';
    executorContent.dataset.tab = 'executor';
    executorContent.innerHTML = `
        <div class="executor-area">
            <div class="code-editor">
                <div class="syntax-highlight" id="syntaxHighlight"></div>
                <textarea id="executorText" placeholder="Enter commands or code..." spellcheck="false"></textarea>
            </div>
            <div class="btn-group">
                <button class="clear-btn" id="clearBtn">Clear</button>
                <button class="paste-btn" id="pasteBtn">Paste</button>
                <button class="execute-btn" id="executeBtn">Execute</button>
            </div>
        </div>
    `;
    content.appendChild(executorContent);

    // Settings Tab
    const settingsContent = document.createElement('div');
    settingsContent.className = 'tab-content';
    settingsContent.dataset.tab = 'settings';
    settingsContent.innerHTML = `
        <div class="settings-placeholder">Settings panel coming soon...</div>
    `;
    content.appendChild(settingsContent);

    menu.appendChild(content);
    document.body.appendChild(menu);

    // Funções
    function switchTab(tabId) {
        document.querySelectorAll('#aiCodeMenu .tab').forEach(el => {
            el.classList.toggle('active', el.dataset.tab === tabId);
        });
        document.querySelectorAll('#aiCodeMenu .tab-content').forEach(el => {
            el.classList.toggle('active', el.dataset.tab === tabId);
        });
    }

    // Custom Alert
    function showCustomAlert(message) {
        const existingAlert = document.querySelector('.custom-alert');
        if (existingAlert) existingAlert.remove();

        const alertDiv = document.createElement('div');
        alertDiv.className = 'custom-alert';
        alertDiv.innerHTML = `
            <p>${message}</p>
            <button id="alertOkBtn">OK</button>
        `;
        document.body.appendChild(alertDiv);

        document.getElementById('alertOkBtn').onclick = () => {
            alertDiv.remove();
        };
    }

    // Fechar menu
    document.getElementById('menuCloseBtn').onclick = () => {
        menu.style.display = 'none';
        overlay.style.display = 'none';
    };

    // Fechar ao clicar no overlay
    overlay.onclick = () => {
        menu.style.display = 'none';
        overlay.style.display = 'none';
    };

    // Toggle estados
    ['togglePaste', 'toggleText', 'toggleAuto'].forEach(id => {
        document.getElementById(id).onchange = function() {
            console.log(`${id}: ${this.checked}`);
        };
    });

    // Dropdown
    document.getElementById('methodSelect').onchange = function() {
        console.log('Method:', this.value);
    };

    // Syntax Highlighting
    function highlightSyntax(code) {
        const keywords = ['function', 'return', 'var', 'let', 'const', 'if', 'else', 'for', 'while', 'class', 'new', 'this', 'try', 'catch', 'throw', 'async', 'await'];
        const patterns = [
            { regex: /\/\/.*/g, className: 'comment' },
            { regex: /\/\*[\s\S]*?\*\//g, className: 'comment' },
            { regex: /(["'])(?:(?=(\\?))\2.)*?\1/g, className: 'string' },
            { regex: /\b\d+\b/g, className: 'number' },
            { regex: /\b(function|return|var|let|const|if|else|for|while|class|new|this|try|catch|throw|async|await)\b/g, className: 'keyword' },
            { regex: /[+\-*/%=<>!&|^~]+/g, className: 'operator' },
            { regex: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g, className: 'function' }
        ];

        let highlighted = code;
        patterns.forEach(pattern => {
            highlighted = highlighted.replace(pattern.regex, match => {
                return `<span class="${pattern.className}">${match}</span>`;
            });
        });
        return highlighted;
    }

    const textarea = document.getElementById('executorText');
    const highlightDiv = document.getElementById('syntaxHighlight');

    textarea.addEventListener('input', function() {
        const code = this.value;
        highlightDiv.innerHTML = highlightSyntax(code);
    });

    // Trigger initial highlight
    textarea.dispatchEvent(new Event('input'));

    // Executor
    document.getElementById('clearBtn').onclick = () => {
        textarea.value = '';
        textarea.dispatchEvent(new Event('input'));
    };

    document.getElementById('pasteBtn').onclick = async () => {
        try {
            const text = await navigator.clipboard.readText();
            textarea.value = text;
            textarea.dispatchEvent(new Event('input'));
        } catch(e) {
            showCustomAlert('Unable to paste. Please allow clipboard access.');
        }
    };

    document.getElementById('executeBtn').onclick = () => {
        const text = textarea.value;
        if (text.trim()) {
            showCustomAlert(`Executing:\n\n${text}`);
        } else {
            showCustomAlert('Please enter some text to execute.');
        }
    };

    // Tornar o menu arrastável pelas bolinhas
    let isDragging = false;
    let offsetX, offsetY;
    const dragHandle = menu.querySelector('.dots');

    dragHandle.onmousedown = (e) => {
        isDragging = true;
        const rect = menu.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        menu.style.cursor = 'grabbing';
        menu.style.transition = 'none';
        e.preventDefault();
    };

    document.onmousemove = (e) => {
        if (isDragging) {
            let x = e.clientX - offsetX;
            let y = e.clientY - offsetY;
            const maxX = window.innerWidth - menu.offsetWidth;
            const maxY = window.innerHeight - menu.offsetHeight;
            x = Math.max(0, Math.min(x, maxX));
            y = Math.max(0, Math.min(y, maxY));
            menu.style.left = x + 'px';
            menu.style.top = y + 'px';
            menu.style.transform = 'none';
        }
    };

    document.onmouseup = () => {
        if (isDragging) {
            isDragging = false;
            menu.style.cursor = '';
            menu.style.transition = '';
        }
    };

    // Suporte para touch (mobile)
    dragHandle.ontouchstart = (e) => {
        const touch = e.touches[0];
        const rect = menu.getBoundingClientRect();
        offsetX = touch.clientX - rect.left;
        offsetY = touch.clientY - rect.top;
        isDragging = true;
        menu.style.transition = 'none';
        e.preventDefault();
    };

    document.ontouchmove = (e) => {
        if (isDragging) {
            const touch = e.touches[0];
            let x = touch.clientX - offsetX;
            let y = touch.clientY - offsetY;
            const maxX = window.innerWidth - menu.offsetWidth;
            const maxY = window.innerHeight - menu.offsetHeight;
            x = Math.max(0, Math.min(x, maxX));
            y = Math.max(0, Math.min(y, maxY));
            menu.style.left = x + 'px';
            menu.style.top = y + 'px';
            menu.style.transform = 'none';
        }
    };

    document.ontouchend = () => {
        isDragging = false;
        menu.style.transition = '';
    };

    console.log('AiCode Menu loaded successfully!');
})();
