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
            border-radius: 8px;
            min-width: 320px;
            max-width: 420px;
            width: 90%;
            z-index: 999999;
            box-shadow: 0 8px 40px rgba(0,0,0,0.8);
            border: 1px solid #2a2a2a;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 13px;
            color: #cccccc;
            user-select: none;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
        }
        #aiCodeMenu .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 14px;
            background: #1f1f1f;
            border-bottom: 1px solid #2a2a2a;
            border-radius: 8px 8px 0 0;
            flex-shrink: 0;
        }
        #aiCodeMenu .header .dots {
            display: flex;
            gap: 7px;
            align-items: center;
        }
        #aiCodeMenu .header .dots span {
            display: inline-block;
            width: 11px;
            height: 11px;
            border-radius: 50%;
            border: 1px solid rgba(255,255,255,0.05);
        }
        #aiCodeMenu .header .title {
            color: #aaaaaa;
            font-size: 12px;
            font-weight: 500;
            letter-spacing: 0.5px;
        }
        #aiCodeMenu .header .close-btn {
            color: #666;
            cursor: pointer;
            font-size: 18px;
            line-height: 1;
            padding: 0 4px;
            transition: color 0.2s;
        }
        #aiCodeMenu .header .close-btn:hover {
            color: #ccc;
        }
        #aiCodeMenu .tabs {
            display: flex;
            background: #161616;
            padding: 4px 10px 0 10px;
            gap: 2px;
            border-bottom: 1px solid #2a2a2a;
            flex-shrink: 0;
        }
        #aiCodeMenu .tabs .tab {
            padding: 8px 14px;
            color: #666;
            cursor: pointer;
            font-size: 11px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 2px solid transparent;
            transition: all 0.15s;
        }
        #aiCodeMenu .tabs .tab:hover {
            color: #aaa;
        }
        #aiCodeMenu .tabs .tab.active {
            color: #cccccc;
            border-bottom-color: #569CD6;
        }
        #aiCodeMenu .content {
            padding: 16px 18px;
            overflow-y: auto;
            flex: 1;
            background: #161616;
            border-radius: 0 0 8px 8px;
        }
        #aiCodeMenu .content .tab-content {
            display: none;
            animation: fadeIn 0.2s ease;
        }
        #aiCodeMenu .content .tab-content.active {
            display: block;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(4px); }
            to { opacity: 1; transform: translateY(0); }
        }
        #aiCodeMenu .toggle-group {
            margin-bottom: 14px;
        }
        #aiCodeMenu .toggle-group:last-child {
            margin-bottom: 0;
        }
        #aiCodeMenu .toggle-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 6px 0;
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
            width: 36px;
            height: 20px;
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
            border-radius: 20px;
            transition: 0.25s;
        }
        #aiCodeMenu .toggle-slide .slider::before {
            content: "";
            position: absolute;
            height: 14px;
            width: 14px;
            left: 3px;
            bottom: 3px;
            background: #888;
            border-radius: 50%;
            transition: 0.25s;
        }
        #aiCodeMenu .toggle-slide input:checked + .slider {
            background: #569CD6;
        }
        #aiCodeMenu .toggle-slide input:checked + .slider::before {
            transform: translateX(16px);
            background: #fff;
        }
        #aiCodeMenu .dropdown {
            width: 100%;
            padding: 6px 10px;
            background: #222;
            color: #cccccc;
            border: 1px solid #333;
            border-radius: 4px;
            font-size: 12px;
            outline: none;
            cursor: pointer;
            margin-top: 4px;
        }
        #aiCodeMenu .dropdown:focus {
            border-color: #569CD6;
        }
        #aiCodeMenu .dropdown option {
            background: #222;
        }
        #aiCodeMenu .executor-area {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        #aiCodeMenu .executor-area textarea {
            width: 100%;
            height: 80px;
            background: #0e0e0e;
            color: #cccccc;
            border: 1px solid #2a2a2a;
            border-radius: 4px;
            padding: 8px;
            font-family: "Courier New", monospace;
            font-size: 12px;
            resize: vertical;
            outline: none;
        }
        #aiCodeMenu .executor-area textarea:focus {
            border-color: #569CD6;
        }
        #aiCodeMenu .executor-area .btn-group {
            display: flex;
            gap: 8px;
        }
        #aiCodeMenu .executor-area .btn-group button {
            flex: 1;
            padding: 6px 12px;
            background: #222;
            color: #cccccc;
            border: 1px solid #333;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            transition: all 0.15s;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }
        #aiCodeMenu .executor-area .btn-group button:hover {
            background: #2a2a2a;
            border-color: #444;
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
        #aiCodeMenu .drag-handle {
            cursor: move;
            flex: 1;
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
            #aiCodeMenu .executor-area textarea {
                height: 60px;
            }
        }
    `;
    document.head.appendChild(style);

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
        <div class="drag-handle"></div>
        <div class="title">AICODE</div>
        <div class="close-btn" id="menuCloseBtn">✕</div>
    `;
    menu.appendChild(header);

    // Tabs
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'tabs';
    const tabs = ['General', 'Executor', 'Settings'];
    tabs.forEach((tab, index) => {
        const tabEl = document.createElement('div');
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
        <div>
            <label style="color:#bbbbbb;font-size:12.5px;display:block;margin-bottom:4px;">Method</label>
            <select class="dropdown" id="methodSelect">
                <option value="paste">Paste</option>
                <option value="type">Type</option>
                <option value="clipboard">Clipboard</option>
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
            <textarea id="executorText" placeholder="Enter commands or code..."></textarea>
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

    // Fechar menu
    document.getElementById('menuCloseBtn').onclick = () => {
        menu.style.display = 'none';
    };

    // Toggle estados (apenas para demonstração)
    ['togglePaste', 'toggleText', 'toggleAuto'].forEach(id => {
        document.getElementById(id).onchange = function() {
            console.log(`${id}: ${this.checked}`);
        };
    });

    // Dropdown
    document.getElementById('methodSelect').onchange = function() {
        console.log('Method:', this.value);
    };

    // Executor
    document.getElementById('clearBtn').onclick = () => {
        document.getElementById('executorText').value = '';
    };

    document.getElementById('pasteBtn').onclick = async () => {
        try {
            const text = await navigator.clipboard.readText();
            document.getElementById('executorText').value = text;
        } catch(e) {
            alert('Unable to paste. Please allow clipboard access.');
        }
    };

    document.getElementById('executeBtn').onclick = () => {
        const text = document.getElementById('executorText').value;
        if (text.trim()) {
            alert(`Executing:\n\n${text}`);
            // Aqui você pode adicionar a lógica de execução
        } else {
            alert('Please enter some text to execute.');
        }
    };

    // Tornar o menu arrastável
    let isDragging = false;
    let offsetX, offsetY;
    const dragHandle = menu.querySelector('.drag-handle');

    dragHandle.onmousedown = (e) => {
        isDragging = true;
        const rect = menu.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        menu.style.cursor = 'grabbing';
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
        }
    };

    // Suporte para touch (mobile)
    dragHandle.ontouchstart = (e) => {
        const touch = e.touches[0];
        const rect = menu.getBoundingClientRect();
        offsetX = touch.clientX - rect.left;
        offsetY = touch.clientY - rect.top;
        isDragging = true;
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
    };

    // Fechar ao clicar fora (opcional)
    document.addEventListener('click', function(e) {
        if (menu.style.display !== 'none' && !menu.contains(e.target) && e.target !== document.getElementById('floatingMenuBtn')) {
            // Não fechar automaticamente para não atrapalhar
        }
    });

    console.log('AiCode Menu loaded successfully!');
})();
