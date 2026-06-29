(function() {
    var d = document;
    
    // Remover apenas elementos do Key System, não o body inteiro
    function removeKeySystemElements() {
        // Remove blur overlay
        var blurs = d.querySelectorAll('div[style*="backdrop-filter"]');
        blurs.forEach(function(el) { el.remove(); });
        
        // Remove loading screen
        var loadDivs = d.querySelectorAll('div[style*="z-index: 1000"]');
        loadDivs.forEach(function(el) { el.remove(); });
        
        // Remove login container
        var loginBoxes = d.querySelectorAll('div[style*="flyIn"]');
        loginBoxes.forEach(function(el) { el.remove(); });
        
        // Remove notification container
        var notifContainers = d.querySelectorAll('div[style*="flex-direction: column"][style*="gap: 8px"]');
        notifContainers.forEach(function(el) { el.remove(); });
        
        // Remove welcome screen
        var welcomeScreens = d.querySelectorAll('div[style*="z-index:1000"]');
        welcomeScreens.forEach(function(el) { el.remove(); });
    }
    
    // Create and append main styles (apenas se não existirem)
    if (!d.querySelector('style[data-aicode]')) {
        var s = d.createElement('style');
        s.setAttribute('data-aicode', 'true');
        s.textContent = '@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap");' +
            '@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }' +
            '@keyframes fadeOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(6px); } }' +
            '@keyframes slideInRight { from { opacity: 0; transform: translateX(60px); } to { opacity: 1; transform: translateX(0); } }' +
            '@keyframes slideOutRight { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(60px); } }' +
            '@keyframes spin { to { transform: rotate(360deg); } }' +
            '@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }' +
            '@keyframes flyIn { ' +
                '0% { opacity: 0; transform: translate(-30%, -50%) scale(0.8); } ' +
                '100% { opacity: 1; transform: translate(-50%, -50%) scale(1); } ' +
            '}';
        d.head.appendChild(s);
    }
    
    // Load Boxicons (apenas se não existir)
    if (!d.querySelector('link[href*="boxicons"]')) {
        var l = d.createElement('link');
        l.href = 'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css';
        l.rel = 'stylesheet';
        d.head.appendChild(l);
    }
    
    // Create background blur overlay com atributo identificador
    var blur = d.createElement('div');
    blur.setAttribute('data-aicode-overlay', 'true');
    blur.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; z-index:998; ' +
        'backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); background:rgba(0,0,0,0.3);';
    d.body.appendChild(blur);
    
    // Create loading screen com atributo identificador
    var loadDiv = d.createElement('div');
    loadDiv.setAttribute('data-aicode-loading', 'true');
    loadDiv.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; z-index:1000; ' +
        'display:flex; justify-content:center; align-items:center;';
    
    var loadBox = d.createElement('div');
    loadBox.style.cssText = 'background:#0d0d0d; border:1px solid #1a1a1a; border-radius:20px; ' +
        'padding:32px 40px; box-shadow:0 20px 60px rgba(0,0,0,0.8); text-align:center; font-family:Inter,sans-serif;';
    
    var loadSpin = d.createElement('div');
    loadSpin.style.cssText = 'width:40px; height:40px; border:2px solid #1a1a1a; border-top-color:#fff; ' +
        'border-radius:50%; animation:spin 0.8s linear infinite; margin:0 auto 20px;';
    
    var loadTitle = d.createElement('div');
    loadTitle.style.cssText = 'font-size:14px; font-weight:500; color:#ccc; margin-bottom:6px;';
    loadTitle.textContent = 'Loading...';
    
    var loadSub = d.createElement('div');
    loadSub.style.cssText = 'font-size:10px; color:#444; margin-top:12px;';
    loadSub.textContent = 'AiCode Key System';
    
    loadBox.appendChild(loadSpin);
    loadBox.appendChild(loadTitle);
    loadBox.appendChild(loadSub);
    loadDiv.appendChild(loadBox);
    d.body.appendChild(loadDiv);
    
    var users = [];
    
    function parseUsers(data) {
        var u = [];
        try {
            var j = JSON.parse(data);
            if (Array.isArray(j)) {
                j.forEach(function(i) {
                    if (i.username && i.password) {
                        u.push({
                            username: i.username,
                            password: i.password,
                            name: i.name || i.patent || i.username
                        });
                    }
                });
                return u;
            }
        } catch(e) {}
        
        var p = /\{([^}]+)\}/g;
        var m;
        while ((m = p.exec(data)) !== null) {
            var str = m[1];
            var um = /username["']?\s*:\s*["']([^"']+)["']/.exec(str);
            var pm = /password["']?\s*:\s*["']([^"']+)["']/.exec(str);
            var nm = /name["']?\s*:\s*["']([^"']+)["']/.exec(str);
            var pt = /patent["']?\s*:\s*["']([^"']+)["']/.exec(str);
            
            if (um && pm) {
                u.push({
                    username: um[1],
                    password: pm[1],
                    name: nm ? nm[1] : (pt ? pt[1] : um[1])
                });
            }
        }
        return u;
    }
    
    fetch('https://cdn.jsdelivr.net/gh/AKAIDOUSER/AiCode-JS@main/WhiteList.js')
        .then(function(r) { return r.text(); })
        .then(function(data) {
            users = parseUsers(data);
            if (users.length === 0) {
                users = [
                    { username: "admin", password: "123456", name: "Admin" },
                    { username: "user", password: "user123", name: "User" },
                    { username: "demo", password: "demo", name: "Demo" }
                ];
            }
            
            loadSpin.style.borderColor = '#1a3a1a';
            loadSpin.style.borderTopColor = '#28c840';
            
            setTimeout(function() {
                loadDiv.style.animation = 'fadeOut 0.3s ease-out forwards';
                setTimeout(function() {
                    loadDiv.remove();
                    createLogin();
                }, 300);
            }, 800);
        })
        .catch(function() {
            users = [
                { username: "admin", password: "123456", name: "Admin" },
                { username: "user", password: "user123", name: "User" },
                { username: "demo", password: "demo", name: "Demo" }
            ];
            
            setTimeout(function() {
                loadDiv.style.animation = 'fadeOut 0.3s ease-out forwards';
                setTimeout(function() {
                    loadDiv.remove();
                    createLogin();
                }, 300);
            }, 1000);
        });
    
    function createLogin() {
        // Remover elementos anteriores do Key System
        removeKeySystemElements();
        
        var c = d.createElement('div');
        c.setAttribute('data-aicode-login', 'true');
        c.style.cssText = 'width:360px; padding:28px 32px 32px; position:fixed; top:50%; left:50%; z-index:999; ' +
            'font-family:Inter,sans-serif; background:#0d0d0d; border-radius:24px; border:1px solid #1a1a1a; ' +
            'box-shadow:0 20px 60px rgba(0,0,0,0.8); ' +
            'animation:flyIn 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards;';
        
        var h = d.createElement('div');
        h.style.cssText = 'display:flex; align-items:center; justify-content:space-between; margin-bottom:32px;';
        
        var dots = d.createElement('div');
        dots.style.cssText = 'display:flex; gap:5px;';
        ['#ff5f57', '#febc2e', '#28c840'].forEach(function(cl) {
            var dot = d.createElement('div');
            dot.style.cssText = 'width:8px; height:8px; border-radius:50%; background:' + cl;
            dots.appendChild(dot);
        });
        
        var brand = d.createElement('div');
        brand.style.cssText = 'text-align:right;';
        
        var bt = d.createElement('h1');
        bt.style.cssText = 'font-size:16px; font-weight:500; color:#ccc; margin:0;';
        bt.innerHTML = 'Ai<span style="font-weight:300; color:#666;">Code</span>';
        
        var bs = d.createElement('p');
        bs.style.cssText = 'font-size:10px; color:#444; margin:0;';
        bs.textContent = 'Key System';
        
        brand.appendChild(bt);
        brand.appendChild(bs);
        h.appendChild(dots);
        h.appendChild(brand);
        c.appendChild(h);
        
        var uG = d.createElement('div');
        uG.style.cssText = 'margin-bottom:12px; position:relative;';
        
        var uIn = d.createElement('input');
        uIn.type = 'text';
        uIn.placeholder = 'Username';
        uIn.style.cssText = 'width:100%; height:44px; background:#111; border:1px solid #1a1a1a; ' +
            'border-radius:12px; padding:0 40px 0 14px; font-size:13px; color:#999; outline:none; ' +
            'font-family:Inter,sans-serif; transition:0.2s;';
        
        var uIc = d.createElement('i');
        uIc.className = 'bx bx-user';
        uIc.style.cssText = 'position:absolute; right:14px; top:50%; transform:translateY(-50%); ' +
            'color:#2a2a2a; font-size:15px; pointer-events:none; transition:0.2s;';
        
        uIn.addEventListener('focus', function() {
            uIn.style.borderColor = '#2a2a2a';
            uIc.style.color = '#555';
        });
        
        uIn.addEventListener('blur', function() {
            uIn.style.borderColor = '#1a1a1a';
            uIc.style.color = '#2a2a2a';
        });
        
        uG.appendChild(uIn);
        uG.appendChild(uIc);
        c.appendChild(uG);
        
        var pG = d.createElement('div');
        pG.style.cssText = 'margin-bottom:12px; position:relative;';
        
        var pIn = d.createElement('input');
        pIn.type = 'password';
        pIn.placeholder = 'Password';
        pIn.style.cssText = 'width:100%; height:44px; background:#111; border:1px solid #1a1a1a; ' +
            'border-radius:12px; padding:0 40px 0 14px; font-size:13px; color:#999; outline:none; ' +
            'font-family:Inter,sans-serif; transition:0.2s;';
        
        var pIc = d.createElement('i');
        pIc.className = 'bx bx-lock-alt';
        pIc.style.cssText = 'position:absolute; right:14px; top:50%; transform:translateY(-50%); ' +
            'color:#2a2a2a; font-size:15px; pointer-events:none; transition:0.2s;';
        
        pIn.addEventListener('focus', function() {
            pIn.style.borderColor = '#2a2a2a';
            pIc.style.color = '#555';
        });
        
        pIn.addEventListener('blur', function() {
            pIn.style.borderColor = '#1a1a1a';
            pIc.style.color = '#2a2a2a';
        });
        
        pG.appendChild(pIn);
        pG.appendChild(pIc);
        c.appendChild(pG);
        
        var btn = d.createElement('button');
        btn.textContent = 'Sign in';
        btn.style.cssText = 'width:100%; height:44px; background:transparent; border:1px solid #2a2a2a; ' +
            'border-radius:12px; color:#888; font-size:13px; font-weight:500; cursor:pointer; ' +
            'margin-top:16px; font-family:Inter,sans-serif; transition:0.2s;';
        
        btn.addEventListener('mouseenter', function() {
            btn.style.borderColor = '#444';
            btn.style.color = '#bbb';
            btn.style.background = 'rgba(255,255,255,0.03)';
        });
        
        btn.addEventListener('mouseleave', function() {
            btn.style.borderColor = '#2a2a2a';
            btn.style.color = '#888';
            btn.style.background = 'transparent';
        });
        
        btn.addEventListener('mousedown', function() {
            btn.style.transform = 'scale(0.98)';
        });
        
        btn.addEventListener('mouseup', function() {
            btn.style.transform = 'scale(1)';
        });
        
        c.appendChild(btn);
        
        var ft = d.createElement('div');
        ft.style.cssText = 'text-align:center; margin-top:20px; font-size:10px; color:#222;';
        ft.innerHTML = 'AiCode <span style="color:#333;">•</span> Key System';
        c.appendChild(ft);
        
        d.body.appendChild(c);
        
        var nC = d.createElement('div');
        nC.setAttribute('data-aicode-notifications', 'true');
        nC.style.cssText = 'position:fixed; top:16px; right:16px; display:flex; flex-direction:column; gap:8px; z-index:1000;';
        d.body.appendChild(nC);
        
        function notify(msg, type) {
            var n = d.createElement('div');
            n.style.cssText = 'background:#0d0d0d; border:1px solid #1a1a1a; padding:12px 18px; ' +
                'border-radius:14px; box-shadow:0 8px 32px rgba(0,0,0,0.6); display:flex; ' +
                'align-items:center; gap:8px; font-size:12px; color:#888; ' +
                'animation:slideInRight 0.25s ease-out; font-family:Inter,sans-serif;';
            
            var dot = d.createElement('div');
            dot.style.cssText = 'width:6px; height:6px; border-radius:50%;';
            
            if (type === 'success') {
                dot.style.background = '#28c840';
                n.style.borderColor = '#0a1a0a';
            } else {
                dot.style.background = '#ff4757';
                n.style.borderColor = '#1a0a0a';
            }
            
            n.appendChild(dot);
            n.appendChild(d.createTextNode(msg));
            nC.appendChild(n);
            
            if (nC.children.length > 3) {
                nC.firstChild.style.animation = 'slideOutRight 0.25s ease-in forwards';
                setTimeout(function() {
                    if (nC.firstChild) nC.firstChild.remove();
                }, 250);
            }
            
            setTimeout(function() {
                n.style.animation = 'slideOutRight 0.25s ease-in forwards';
                setTimeout(function() {
                    if (n.parentNode) n.remove();
                }, 250);
            }, 3000);
        }
        
        btn.addEventListener('click', function() {
            var u = uIn.value;
            var p = pIn.value;
            
            if (!u || !p) {
                notify('All fields are required', 'error');
                return;
            }
            
            btn.textContent = '';
            btn.style.pointerEvents = 'none';
            var sp = d.createElement('div');
            sp.style.cssText = 'width:16px; height:16px; border:1.5px solid #555; ' +
                'border-top-color:transparent; border-radius:50%; animation:spin 0.6s linear infinite; margin:0 auto;';
            btn.appendChild(sp);
            
            setTimeout(function() {
                btn.textContent = 'Sign in';
                btn.style.pointerEvents = 'auto';
                
                var user = users.find(function(x) {
                    return x.username === u && x.password === p;
                });
                
                if (user) {
                    notify('Welcome, ' + user.name + '!', 'success');
                    
                    setTimeout(function() {
                        // Remover elementos do Key System
                        removeKeySystemElements();
                        
                        var fo = d.createElement('div');
                        fo.setAttribute('data-aicode-welcome', 'true');
                        fo.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; ' +
                            'z-index:1000; display:flex; justify-content:center; align-items:center; ' +
                            'background:rgba(0,0,0,0.3); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px);';
                        
                        var fb = d.createElement('div');
                        fb.style.cssText = 'background:#0d0d0d; border:1px solid #1a1a1a; border-radius:20px; ' +
                            'padding:32px 40px; box-shadow:0 20px 60px rgba(0,0,0,0.8); text-align:center; ' +
                            'font-family:Inter,sans-serif; animation:fadeIn 0.4s ease-out;';
                        
                        var ck = d.createElement('div');
                        ck.style.cssText = 'width:50px; height:50px; border:2px solid #28c840; border-radius:50%; ' +
                            'display:flex; align-items:center; justify-content:center; margin:0 auto 20px;';
                        ck.innerHTML = '<i class="bx bx-check" style="color:#28c840; font-size:28px;"></i>';
                        
                        var wt = d.createElement('div');
                        wt.style.cssText = 'font-size:16px; font-weight:500; color:#ccc; margin-bottom:4px;';
                        wt.textContent = 'Welcome, ' + user.name;
                        
                        var ws = d.createElement('div');
                        ws.style.cssText = 'font-size:11px; color:#555; margin-bottom:20px;';
                        ws.textContent = 'Loading...';
                        
                        var fs = d.createElement('div');
                        fs.style.cssText = 'width:30px; height:30px; border:2px solid #1a1a1a; ' +
                            'border-top-color:#28c840; border-radius:50%; animation:spin 0.8s linear infinite; margin:0 auto;';
                        
                        fb.appendChild(ck);
                        fb.appendChild(wt);
                        fb.appendChild(ws);
                        fb.appendChild(fs);
                        fo.appendChild(fb);
                        d.body.appendChild(fo);
                        
                        setTimeout(function() {
                            fetch('https://cdn.jsdelivr.net/gh/AKAIDOUSER/AiCode-JS@main/AiCode.js')
                                .then(function(r) { return r.text(); })
                                .then(function(script) {
                                    // Remover welcome screen
                                    fo.remove();
                                    
                                    // Executar o script principal
                                    var se = d.createElement('script');
                                    se.textContent = script;
                                    d.body.appendChild(se);
                                    
                                    // NÃO limpar o body.style.cssText
                                    // d.body.style.cssText = ''; // REMOVIDO
                                })
                                .catch(function() {
                                    fo.remove();
                                    notify('Failed to load', 'error');
                                });
                        }, 2500);
                    }, 800);
                } else {
                    notify('Invalid credentials', 'error');
                }
            }, 600);
        });
        
        pIn.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                btn.click();
            }
        });
        
        uIn.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                pIn.focus();
            }
        });
    }
})();
