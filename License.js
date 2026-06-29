javascript:(function(){
  /* ============================================
     BOOKMARKLET: LOGIN FLUTUANTE DARK
     Whitelist: username + password + patent
     GitHub: AKAIDOUSER/AiCode-JS/WhiteList.js
  ============================================ */
  
  if(document.getElementById('akd-login-overlay')){
    document.getElementById('akd-login-overlay').remove();
    return;
  }
  
  const WHITELIST_URL = 'https://raw.githubusercontent.com/AKAIDOUSER/AiCode-JS/refs/heads/main/WhiteList.js';
  let whitelistData = [];
  let loaded = false;
  let loading = false;
  
  /* ============ CSS INJETADO ============ */
  const css = `
    #akd-login-overlay {
      position:fixed;top:0;left:0;width:100%;height:100%;
      background:rgba(0,0,0,0.88);backdrop-filter:blur(14px);
      -webkit-backdrop-filter:blur(14px);
      display:flex;align-items:center;justify-content:center;
      z-index:2147483647;font-family:'Poppins','Segoe UI',sans-serif;
      animation:akdOverlayIn 0.25s ease;
    }
    @keyframes akdOverlayIn { from{opacity:0} to{opacity:1} }
    #akd-login-overlay * { margin:0;padding:0;box-sizing:border-box }
    .akd-glass {
      background:rgba(20,20,26,0.78);backdrop-filter:blur(22px);
      -webkit-backdrop-filter:blur(22px);
      border:2px solid rgba(255,255,255,0.07);border-radius:24px;
      padding:36px 30px;width:400px;max-width:94vw;
      box-shadow:0 30px 60px rgba(0,0,0,0.8),inset 0 0 0 1px rgba(255,255,255,0.02);
      color:#eaeaf0;position:relative;animation:akdSlideIn 0.3s ease;
    }
    @keyframes akdSlideIn { from{opacity:0;transform:translateY(-25px)} to{opacity:1;transform:translateY(0)} }
    .akd-glass h2 {
      text-align:center;font-size:32px;font-weight:600;
      margin-bottom:28px;color:#f5f5fc;letter-spacing:1px;
    }
    .akd-box {
      position:relative;width:100%;height:50px;margin:20px 0;
    }
    .akd-box input {
      width:100%;height:100%;background:rgba(255,255,255,0.05);
      border:2px solid rgba(255,255,255,0.1);border-radius:14px;
      padding:0 48px 0 18px;font-size:15px;color:#f2f2f7;
      outline:none;transition:all 0.25s;
    }
    .akd-box input::placeholder { color:#8a8a9a }
    .akd-box input:focus {
      border-color:rgba(255,255,255,0.35);
      background:rgba(255,255,255,0.1);
      box-shadow:0 0 16px rgba(255,255,255,0.03);
    }
    .akd-box .akd-icon {
      position:absolute;right:17px;top:50%;transform:translateY(-50%);
      font-size:20px;pointer-events:none;opacity:0.7;
    }
    .akd-actions {
      display:flex;justify-content:space-between;align-items:center;
      margin:16px 0 22px;font-size:13px;color:#b8b8cc;
    }
    .akd-actions label { display:flex;align-items:center;gap:6px;cursor:pointer }
    .akd-actions input[type=checkbox] { accent-color:#7b7bdd;width:15px;height:15px }
    .akd-actions a { color:#c5c5e0;text-decoration:none }
    .akd-actions a:hover { text-decoration:underline;color:#fff }
    .akd-btn {
      width:100%;height:48px;background:rgba(255,255,255,0.06);
      border:2px solid rgba(255,255,255,0.2);border-radius:14px;
      color:#efeff5;font-size:17px;font-weight:500;cursor:pointer;
      backdrop-filter:blur(6px);transition:all 0.25s;
      box-shadow:0 8px 20px rgba(0,0,0,0.5);letter-spacing:0.5px;
    }
    .akd-btn:hover { background:rgba(255,255,255,0.13);border-color:rgba(255,255,255,0.45) }
    .akd-btn:active { transform:scale(0.97) }
    .akd-btn.loading { opacity:0.6;pointer-events:none }
    .akd-footer { text-align:center;margin-top:22px;font-size:13px;color:#9e9eb8 }
    .akd-footer a { color:#d2d2f5;text-decoration:none;margin-left:4px }
    .akd-footer a:hover { text-decoration:underline }
    .akd-msg { text-align:center;margin-top:14px;font-size:13px;min-height:20px;color:#ff8a8a }
    .akd-msg.ok { color:#7ee89e }
    .akd-shake { animation:akdShake 0.35s ease }
    @keyframes akdShake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-7px)} 50%{transform:translateX(7px)} 75%{transform:translateX(-5px)} }
    .akd-close-btn {
      position:absolute;top:12px;right:18px;background:none;border:none;
      color:#8a8a9a;font-size:26px;cursor:pointer;line-height:1;
      transition:color 0.2s;z-index:10;
    }
    .akd-close-btn:hover { color:#fff }
  `;
  
  const styleTag = document.createElement('style');
  styleTag.textContent = css;
  document.head.appendChild(styleTag);
  
  /* ============ HTML ============ */
  const overlay = document.createElement('div');
  overlay.id = 'akd-login-overlay';
  overlay.innerHTML = `
    <div class="akd-glass">
      <button class="akd-close-btn" id="akdClose">×</button>
      <h2>Sign In</h2>
      <div class="akd-box">
        <input type="text" id="akdUser" placeholder="Username" autocomplete="off">
        <span class="akd-icon">👤</span>
      </div>
      <div class="akd-box">
        <input type="password" id="akdPass" placeholder="Password">
        <span class="akd-icon">🔒</span>
      </div>
      <div class="akd-actions">
        <label><input type="checkbox" id="akdRemember"> Remember me</label>
        <a href="#" id="akdForgot">Forgot Password?</a>
      </div>
      <button class="akd-btn" id="akdLoginBtn">Sign In</button>
      <div class="akd-footer">
        Need access? <a href="#" id="akdRegister">Request</a>
      </div>
      <div class="akd-msg" id="akdMsg"></div>
    </div>
  `;
  document.body.appendChild(overlay);
  
  /* ============ ELEMENTOS DOM ============ */
  const userInp    = document.getElementById('akdUser');
  const passInp    = document.getElementById('akdPass');
  const loginBtn   = document.getElementById('akdLoginBtn');
  const msgEl      = document.getElementById('akdMsg');
  const closeBtn   = document.getElementById('akdClose');
  const forgotLk   = document.getElementById('akdForgot');
  const registerLk = document.getElementById('akdRegister');
  const rememberCh = document.getElementById('akdRemember');
  
  /* ============ FUNÇÕES ============ */
  function setMsg(text, ok=false){
    if(msgEl){
      msgEl.textContent = text || '';
      msgEl.classList.toggle('ok', ok);
    }
  }
  
  function setLoading(on){
    if(!loginBtn) return;
    if(on){
      loginBtn.classList.add('loading');
      loginBtn.textContent = 'Verifying...';
      loginBtn.disabled = true;
    } else {
      loginBtn.classList.remove('loading');
      loginBtn.textContent = 'Sign In';
      loginBtn.disabled = false;
    }
  }
  
  function extractArray(jsText){
    let cleaned = jsText.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\/\/.*$/gm,'');
    const start = cleaned.indexOf('[');
    if(start===-1) return null;
    let count=0, end=-1;
    for(let i=start;i<cleaned.length;i++){
      if(cleaned[i]==='[') count++;
      else if(cleaned[i]===']'){ count--; if(count===0){ end=i; break; } }
    }
    if(end===-1) return null;
    try {
      const arr = new Function('return '+cleaned.substring(start,end+1))();
      return Array.isArray(arr) ? arr : null;
    }catch(e){ return null; }
  }
  
  async function loadWhitelist(){
    if(loading) return false;
    loading = true;
    setMsg('Loading user database...', false);
    try {
      const resp = await fetch(WHITELIST_URL, { cache:'no-cache' });
      if(!resp.ok) throw new Error('HTTP '+resp.status);
      const text = await resp.text();
      
      let data = null;
      try { data = JSON.parse(text); } catch(e){ data = extractArray(text); }
      
      if(!Array.isArray(data)) throw new Error('Not an array');
      
      // Usa EXATAMENTE: username, password, patent
      whitelistData = data.map((item,i)=>{
        if(!item || typeof item!=='object') return null;
        const u = String(item.username??'').trim();
        const p = String(item.password??'').trim();
        const pt = String(item.patent??item.patente??'User').trim();
        return (u && p) ? { username:u, password:p, patent:pt } : null;
      }).filter(Boolean);
      
      loaded = true;
      setMsg('', false);
      console.log('[Bookmarklet] ✅ Whitelist loaded:', whitelistData.length, 'users');
      return true;
    } catch(e){
      console.error('[Bookmarklet] ❌ Whitelist error:', e);
      setMsg('Failed to load user list.', false);
      loaded = false;
      whitelistData = [];
      return false;
    } finally {
      loading = false;
    }
  }
  
  function attemptLogin(){
    setMsg('', false);
    const user = userInp?.value.trim() || '';
    const pass = passInp?.value.trim() || '';
    
    if(!user || !pass){
      setMsg('Please enter username and password.', false);
      passInp?.classList.add('akd-shake');
      setTimeout(()=>passInp?.classList.remove('akd-shake'),350);
      return;
    }
    
    if(!loaded || whitelistData.length===0){
      setMsg('Database loading, please wait...', false);
      setLoading(true);
      loadWhitelist().then(ok=>{
        setLoading(false);
        if(ok) attemptLogin();
      });
      return;
    }
    
    // Busca exata: username E password
    const found = whitelistData.find(
      u => u.username === user && u.password === pass
    );
    
    if(found){
      setMsg('✅ Welcome, '+found.username+'! ['+found.patent+']', true);
      if(rememberCh?.checked){
        console.log('[Bookmarklet] Remember me:', found.username);
      }
      
      // Sucesso: animação de saída
      setTimeout(()=>{
        overlay.style.transition='opacity 0.4s';
        overlay.style.opacity='0';
        setTimeout(()=>overlay.remove(), 400);
        alert('🔓 Access Granted!\n\n👤 User: '+found.username+'\n🛡️ Patent: '+found.patent);
      }, 1000);
      
    } else {
      setMsg('❌ Invalid username or password.', false);
      passInp?.classList.add('akd-shake');
      setTimeout(()=>passInp?.classList.remove('akd-shake'),350);
      passInp?.focus();
    }
  }
  
  /* ============ EVENT LISTENERS ============ */
  loginBtn?.addEventListener('click', (e)=>{ e.preventDefault(); attemptLogin(); });
  
  passInp?.addEventListener('keypress', (e)=>{
    if(e.key==='Enter'){ e.preventDefault(); attemptLogin(); }
  });
  
  userInp?.addEventListener('keypress', (e)=>{
    if(e.key==='Enter'){
      e.preventDefault();
      if(passInp && passInp.value.trim()==='') passInp.focus();
      else attemptLogin();
    }
  });
  
  closeBtn?.addEventListener('click', ()=> overlay.remove());
  
  overlay.addEventListener('click', function(e){
    if(e.target === overlay) overlay.remove();
  });
  
  document.addEventListener('keydown', function(e){
    if(e.key==='Escape' && document.getElementById('akd-login-overlay')){
      overlay.remove();
    }
  });
  
  forgotLk?.addEventListener('click', (e)=>{
    e.preventDefault();
    setMsg('🔧 Recovery system offline.', false);
  });
  
  registerLk?.addEventListener('click', (e)=>{
    e.preventDefault();
    setMsg('📩 Registration request sent (demo).', false);
  });
  
  /* ============ INICIALIZAR ============ */
  loadWhitelist().then(ok=>{
    if(!ok) setMsg('⚠️ Could not load database.', false);
  });
  
  setTimeout(()=> userInp?.focus(), 200);
  
})();
