// API Configuration
const API_URL = 'https://script.google.com/macros/s/AKfycbyTh00iGrPu0ggtA-c7cjETHyXSNxXTvdm248jEIKBKPRQ7HYWaSSS1WT_fy8weX6RUSg/exec';

// Hamburger Menu
const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('.menu');
if (hamburger && menu) {
  hamburger.addEventListener('click', () => menu.classList.toggle('show'));
}

// Elements - ใช้ try catch เพื่อป้องกัน error
let hero, loginModal, contactModal, registerModal, forgotModal, resetModal;

try {
  hero = document.getElementById('hero');
  loginModal = document.getElementById('login-modal');
  contactModal = document.getElementById('contact-modal');
  registerModal = document.getElementById('register-modal');
  forgotModal = document.getElementById('forgot-modal');
  resetModal = document.getElementById('reset-modal');
} catch (error) {
  console.error('Error getting elements:', error);
}

// API Functions ที่ใช้ JSONP
function apiCall(action, data) {
  return new Promise((resolve) => {
    const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
    const script = document.createElement('script');
    
    window[callbackName] = function(response) {
      delete window[callbackName];
      if (script.parentNode) {
        document.body.removeChild(script);
      }
      resolve(response);
    };
    
    // สร้าง URL parameters
    const params = new URLSearchParams();
    params.append('action', action);
    params.append('callback', callbackName);
    
    // เพิ่มข้อมูลอื่นๆ
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        params.append(key, data[key]);
      }
    });
    
    script.src = API_URL + '?' + params.toString();
    
    // Timeout fallback
    const timeout = setTimeout(() => {
      if (window[callbackName]) {
        delete window[callbackName];
        if (script.parentNode) {
          document.body.removeChild(script);
        }
        resolve({ 
          success: false, 
          message: 'Request timeout' 
        });
      }
    }, 15000);
    
    script.onload = function() {
      clearTimeout(timeout);
    };
    
    script.onerror = function() {
      clearTimeout(timeout);
      delete window[callbackName];
      if (script.parentNode) {
        document.body.removeChild(script);
      }
      resolve({ 
        success: false, 
        message: 'Network error' 
      });
    };
    
    document.body.appendChild(script);
  });
}

// ฟังก์ชันลงทะเบียน
async function register(username, email, password) {
  return await apiCall('register', { username, email, password });
}

// ฟังก์ชันเข้าสู่ระบบ
async function login(username, password, remember = false) {
  return await apiCall('login', { username, password, remember });
}

// ฟังก์ชันลืมรหัสผ่าน
async function forgotPassword(username, email) {
  return await apiCall('forgotPassword', { username, email });
}

// ฟังก์ชันรีเซ็ตรหัสผ่าน
async function resetPassword(token, newPassword) {
  return await apiCall('resetPassword', { token, newPassword });
}

// ฟังก์ชันตรวจสอบ session
async function validateSession(token) {
  return await apiCall('validateSession', { token });
}

// ฟังก์ชันออกจากระบบ
async function logout(token) {
  return await apiCall('logout', { token });
}

// Session Management
function saveSession(token, userData) {
  localStorage.setItem('hbz_token', token);
  localStorage.setItem('hbz_user', JSON.stringify(userData));
}

function getSession() {
  const token = localStorage.getItem('hbz_token');
  const userData = localStorage.getItem('hbz_user');
  return {
    token: token,
    user: userData ? JSON.parse(userData) : null
  };
}

function clearSession() {
  localStorage.removeItem('hbz_token');
  localStorage.removeItem('hbz_user');
  localStorage.removeItem('reset_token');
}

// Function to clear all input fields in a modal
function clearModalInputs(modal) {
  if (!modal) return;
  
  const inputs = modal.querySelectorAll('input');
  inputs.forEach(input => {
    input.value = '';
    // Reset error messages
    const errorElement = modal.querySelector('.error-message');
    if (errorElement) {
      errorElement.textContent = '';
    }
    // Reset checkboxes
    if (input.type === 'checkbox') {
      input.checked = false;
    }
    // Reset password fields to type password
    if (input.type === 'password' || input.classList.contains('password-input')) {
      input.type = 'password';
      // Reset toggle password icons
      const toggle = input.nextElementSibling;
      if (toggle && toggle.classList.contains('toggle-password')) {
        toggle.textContent = '🔑';
        toggle.classList.remove('active');
      }
    }
  });
}

// Function to clear all modals data
function clearAllModalsData() {
  if (loginModal) clearModalInputs(loginModal);
  if (registerModal) clearModalInputs(registerModal);
  if (forgotModal) clearModalInputs(forgotModal);
  if (resetModal) clearModalInputs(resetModal);
}

// Show/Hide Functions - แก้ไขให้ปลอดภัย
function showHero() {
  if (hero) hero.classList.remove('hidden');
  if (loginModal) loginModal.classList.add('hidden');
  if (contactModal) contactModal.classList.add('hidden');
  if (registerModal) registerModal.classList.add('hidden');
  if (forgotModal) forgotModal.classList.add('hidden');
  if (resetModal) resetModal.classList.add('hidden');
}

function showLogin() {
  if (hero) hero.classList.add('hidden');
  if (contactModal) contactModal.classList.add('hidden');
  if (registerModal) registerModal.classList.add('hidden');
  if (forgotModal) forgotModal.classList.add('hidden');
  if (resetModal) resetModal.classList.add('hidden');
  if (loginModal) loginModal.classList.remove('hidden');
}

function showContact() {
  if (hero) hero.classList.add('hidden');
  if (loginModal) loginModal.classList.add('hidden');
  if (registerModal) registerModal.classList.add('hidden');
  if (forgotModal) forgotModal.classList.add('hidden');
  if (resetModal) resetModal.classList.add('hidden');
  if (contactModal) contactModal.classList.remove('hidden');
}

function showRegister() {
  if (hero) hero.classList.add('hidden');
  if (loginModal) loginModal.classList.add('hidden');
  if (contactModal) contactModal.classList.add('hidden');
  if (forgotModal) forgotModal.classList.add('hidden');
  if (resetModal) resetModal.classList.add('hidden');
  if (registerModal) registerModal.classList.remove('hidden');
}

function showForgot() {
  if (hero) hero.classList.add('hidden');
  if (loginModal) loginModal.classList.add('hidden');
  if (contactModal) contactModal.classList.add('hidden');
  if (registerModal) registerModal.classList.add('hidden');
  if (resetModal) resetModal.classList.add('hidden');
  if (forgotModal) forgotModal.classList.remove('hidden');
}

function showReset() {
  if (hero) hero.classList.add('hidden');
  if (loginModal) loginModal.classList.add('hidden');
  if (contactModal) contactModal.classList.add('hidden');
  if (registerModal) registerModal.classList.add('hidden');
  if (forgotModal) forgotModal.classList.add('hidden');
  if (resetModal) resetModal.classList.remove('hidden');
}

// Navbar links - แก้ไขให้ปลอดภัย
if (menu) {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.dataset.target;
      if (target === 'hero') showHero();
      if (target === 'login') showLogin();
      if (target === 'contact') showContact();
      menu.classList.remove('show');
    });
  });
}

// Logo
const logo = document.getElementById('logo');
if (logo) {
  logo.addEventListener('click', (e) => {
    e.preventDefault();
    showHero();
    if (menu) menu.classList.remove('show');
  });
}

// Buttons - แก้ไขให้ปลอดภัย
const heroLoginBtn = document.getElementById('hero-login-btn');
if (heroLoginBtn) {
  heroLoginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showLogin();
  });
}

// Close buttons - เพิ่มการล้างข้อมูลเมื่อปิด
const closeLogin = document.getElementById('close-login');
if (closeLogin) {
  closeLogin.addEventListener('click', (e) => {
    e.preventDefault();
    clearModalInputs(loginModal);
    showHero();
  });
}

const closeContact = document.getElementById('close-contact');
if (closeContact) {
  closeContact.addEventListener('click', (e) => {
    e.preventDefault();
    showHero();
  });
}

const closeRegister = document.getElementById('close-register');
if (closeRegister) {
  closeRegister.addEventListener('click', (e) => {
    e.preventDefault();
    clearModalInputs(registerModal);
    showHero();
  });
}

const closeForgot = document.getElementById('close-forgot');
if (closeForgot) {
  closeForgot.addEventListener('click', (e) => {
    e.preventDefault();
    clearModalInputs(forgotModal);
    showHero();
  });
}

const closeReset = document.getElementById('close-reset');
if (closeReset) {
  closeReset.addEventListener('click', (e) => {
    e.preventDefault();
    clearModalInputs(resetModal);
    showHero();
  });
}

// Modal Navigation
const registerBtn = document.getElementById('register-btn');
if (registerBtn) {
  registerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showRegister();
  });
}

const forgotBtn = document.getElementById('forgot');
if (forgotBtn) {
  forgotBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showForgot();
  });
}

const backToLogin = document.getElementById('back-to-login');
if (backToLogin) {
  backToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    clearModalInputs(registerModal);
    showLogin();
  });
}

const backToLoginFromForgot = document.getElementById('back-to-login-from-forgot');
if (backToLoginFromForgot) {
  backToLoginFromForgot.addEventListener('click', (e) => {
    e.preventDefault();
    clearModalInputs(forgotModal);
    showLogin();
  });
}

const backToLoginFromReset = document.getElementById('back-to-login-from-reset');
if (backToLoginFromReset) {
  backToLoginFromReset.addEventListener('click', (e) => {
    e.preventDefault();
    clearModalInputs(resetModal);
    showLogin();
  });
}

// Close when click outside - เพิ่มการล้างข้อมูล
[loginModal, contactModal, registerModal, forgotModal, resetModal].forEach(modal => {
  if (modal) {
    modal.addEventListener('click', e => {
      if (e.target === modal) {
        if (modal !== contactModal) {
          clearModalInputs(modal);
        }
        showHero();
      }
    });
  }
});

// Toggle Password Visibility - เปลี่ยนเป็นแม่กุญแจ
document.querySelectorAll('.toggle-password').forEach(toggle => {
  toggle.addEventListener('click', function(e) {
    e.preventDefault();
    const passwordInput = this.previousElementSibling;
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // เปลี่ยนไอคอนแม่กุญแจ
    if (type === 'text') {
      this.textContent = '🔓';
      this.classList.add('active');
    } else {
      this.textContent = '🔑';
      this.classList.remove('active');
    }
  });
});

// จำกัดการพิมพ์เป็นภาษาอังกฤษเท่านั้น
document.querySelectorAll('.eng-input').forEach(input => {
  input.addEventListener('input', function(e) {
    this.value = this.value.replace(/[^A-Za-z0-9@._\-!?#$%^&*()+=]/g, '');
  });
  
  input.addEventListener('keydown', function(e) {
    if (e.key.length === 1 && !/^[A-Za-z0-9@._\-!?#$%^&*()+=]$/.test(e.key)) {
      e.preventDefault();
    }
  });
});

// Validation และ API สำหรับหน้าสมัครสมาชิก
const confirmRegisterBtn = document.getElementById('confirm-register-btn');
if (confirmRegisterBtn) {
  confirmRegisterBtn.addEventListener('click', async function(e) {
    e.preventDefault();
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    const errorElement = document.getElementById('register-error');

    if (!errorElement) return;

    errorElement.textContent = '';

    // Validation
    if (username.length < 4) {
      errorElement.textContent = 'ชื่อผู้ใช้ต้องมีอย่างน้อย 4 ตัวอักษร';
      return;
    }

    if (password.length < 4) {
      errorElement.textContent = 'รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร';
      return;
    }

    if (password !== confirmPassword) {
      errorElement.textContent = 'รหัสผ่านไม่ตรงกัน';
      return;
    }

    const regTerms = document.getElementById('reg-terms');
    if (!regTerms || !regTerms.checked) {
      errorElement.textContent = 'กรุณายอมรับเงื่อนไขการใช้งาน';
      return;
    }

    // เรียก API
    errorElement.textContent = "กำลังสมัครสมาชิก...";
    const result = await register(username, email, password);
    
    if (result.success) {
      errorElement.style.color = '#00ff99';
      errorElement.textContent = "✅ " + result.message;
      setTimeout(() => {
        clearModalInputs(registerModal);
        showLogin();
      }, 2000);
    } else {
      errorElement.style.color = '#ff5555';
      errorElement.textContent = "❌ " + result.message;
    }
  });
}

// Validation และ API สำหรับเข้าสู่ระบบ
const loginBtn = document.getElementById('login-btn');
if (loginBtn) {
  loginBtn.addEventListener('click', async function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember') ? document.getElementById('remember').checked : false;
    const errorElement = document.getElementById('login-error');

    if (!errorElement) return;

    errorElement.textContent = '';

    if (username.length < 4 || password.length < 4) {
      errorElement.textContent = 'ชื่อผู้ใช้และรหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร';
      return;
    }

    errorElement.textContent = "กำลังเข้าสู่ระบบ...";
    const result = await login(username, password, remember);
    
    if (result.success) {
      saveSession(result.token, result.user);
      errorElement.style.color = '#00ff99';
      errorElement.textContent = "✅ " + result.message;
      
      // อัพเดท UI เมื่อล็อกอินสำเร็จ
      updateUIAfterLogin(result.user);
      
      setTimeout(() => {
        clearModalInputs(loginModal);
        showHero();
      }, 1500);
    } else {
      errorElement.style.color = '#ff5555';
      errorElement.textContent = "❌ " + result.message;
    }
  });
}

// ฟังก์ชันสำหรับหน้ารีเซ็ตรหัสผ่าน
const sendResetBtn = document.getElementById('send-reset-btn');
if (sendResetBtn) {
  sendResetBtn.addEventListener('click', async function(e) {
    e.preventDefault();
    const username = document.getElementById('forgot-username').value;
    const email = document.getElementById('forgot-email').value;
    const errorElement = document.getElementById('forgot-error');

    if (!errorElement) return;

    errorElement.textContent = '';

    if (!username || !email) {
      errorElement.textContent = 'กรุณากรอกชื่อผู้ใช้และอีเมล';
      return;
    }

    errorElement.textContent = "กำลังส่งคำขอ...";
    const result = await forgotPassword(username, email);
    
    if (result.success) {
      // บันทึก token สำหรับหน้ารีเซ็ตรหัสผ่าน
      localStorage.setItem('reset_token', result.token);
      errorElement.style.color = '#00ff99';
      errorElement.textContent = "✅ " + result.message;
      setTimeout(() => {
        showReset();
      }, 1500);
    } else {
      errorElement.style.color = '#ff5555';
      errorElement.textContent = "❌ " + result.message;
    }
  });
}

// Validation สำหรับหน้ารีเซ็ตรหัสผ่าน
const confirmResetBtn = document.getElementById('confirm-reset-btn');
if (confirmResetBtn) {
  confirmResetBtn.addEventListener('click', async function(e) {
    e.preventDefault();
    const newPassword = document.getElementById('reset-new-password').value;
    const confirmPassword = document.getElementById('reset-confirm-password').value;
    const token = localStorage.getItem('reset_token');
    const errorElement = document.getElementById('reset-error');

    if (!errorElement) return;

    errorElement.textContent = '';

    if (newPassword.length < 4) {
      errorElement.textContent = 'รหัสผ่านใหม่ต้องมีอย่างน้อย 4 ตัวอักษร';
      return;
    }

    if (newPassword !== confirmPassword) {
      errorElement.textContent = 'รหัสผ่านไม่ตรงกัน';
      return;
    }

    if (!token) {
      errorElement.textContent = 'Token ไม่ถูกต้อง';
      return;
    }

    errorElement.textContent = "กำลังรีเซ็ตรหัสผ่าน...";
    const result = await resetPassword(token, newPassword);
    
    if (result.success) {
      errorElement.style.color = '#00ff99';
      errorElement.textContent = "✅ " + result.message;
      localStorage.removeItem('reset_token');
      setTimeout(() => {
        clearModalInputs(resetModal);
        showLogin();
      }, 1500);
    } else {
      errorElement.style.color = '#ff5555';
      errorElement.textContent = "❌ " + result.message;
    }
  });
}

// ฟังก์ชันอัพเดท UI หลังจากล็อกอิน
function updateUIAfterLogin(user) {
  // เปลี่ยนปุ่ม "เข้าสู่เว็บไซต์" เป็น "ยินดีต้อนรับ, [username]"
  const heroBtn = document.getElementById('hero-login-btn');
  if (heroBtn) {
    heroBtn.textContent = `ยินดีต้อนรับ, ${user.username}`;
    heroBtn.style.background = '#00ffaa';
    heroBtn.style.color = '#0d0d0d';
    heroBtn.onclick = (e) => {
      e.preventDefault();
      alert(`ยินดีต้อนรับ ${user.username}!\nนี่คือพื้นที่สำหรับสมาชิก HAYABUZA`);
    };
  }
  
  // เปลี่ยนเมนู "เข้าสู่ระบบ" เป็น "โปรไฟล์"
  const loginLink = document.querySelector('.nav-link[data-target="login"]');
  if (loginLink) {
    loginLink.textContent = 'โปรไฟล์';
    loginLink.dataset.target = 'profile';
    loginLink.onclick = (e) => {
      e.preventDefault();
      alert(`โปรไฟล์ผู้ใช้:\nชื่อ: ${user.username}\nอีเมล: ${user.email}\nID: ${user.id}`);
    };
  }
  
  // เพิ่มปุ่มออกจากระบบ
  if (!document.querySelector('.nav-link[data-target="logout"]')) {
    const logoutLink = document.createElement('span');
    logoutLink.className = 'nav-link no-caret';
    logoutLink.textContent = 'ออกจากระบบ';
    logoutLink.dataset.target = 'logout';
    logoutLink.addEventListener('click', handleLogout);
    if (menu) {
      menu.appendChild(logoutLink);
    }
  }
}

// ฟังก์ชันจัดการการออกจากระบบ
async function handleLogout(e) {
  e.preventDefault();
  const session = getSession();
  if (session.token) {
    const result = await logout(session.token);
    if (result.success) {
      console.log('Logout successful');
    }
  }
  clearSession();
  resetUI();
  showHero();
  if (menu) menu.classList.remove('show');
  alert('ออกจากระบบสำเร็จ');
}

// ฟังก์ชันรีเซ็ต UI หลังจากออกจากระบบ
function resetUI() {
  // รีเซ็ตปุ่ม hero
  const heroBtn = document.getElementById('hero-login-btn');
  if (heroBtn) {
    heroBtn.textContent = 'เข้าสู่เว็บไซต์';
    heroBtn.style.background = '';
    heroBtn.style.color = '';
    heroBtn.onclick = (e) => {
      e.preventDefault();
      showLogin();
    };
  }
  
  // รีเซ็ตเมนู
  const loginLink = document.querySelector('.nav-link[data-target="profile"]');
  if (loginLink) {
    loginLink.textContent = 'เข้าสู่ระบบ';
    loginLink.dataset.target = 'login';
    loginLink.onclick = (e) => {
      e.preventDefault();
      showLogin();
    };
  }
  
  // ลบปุ่มออกจากระบบ
  const logoutLink = document.querySelector('.nav-link[data-target="logout"]');
  if (logoutLink) {
    logoutLink.remove();
  }
}

// ฟังก์ชันทดสอบการเชื่อมต่อ
async function testConnection() {
  const statusElement = document.getElementById('connection-status');
  if (!statusElement) return;
  
  statusElement.textContent = '🔄 กำลังทดสอบการเชื่อมต่อ...';
  statusElement.style.color = '#00ff99';
  
  try {
    const result = await apiCall('test', {});
    
    if (result.success) {
      statusElement.textContent = '✅ การเชื่อมต่อพร้อมใช้งาน';
      statusElement.style.color = '#00ff99';
    } else {
      statusElement.textContent = '❌ ' + result.message;
      statusElement.style.color = '#ff5555';
    }
  } catch (error) {
    statusElement.textContent = '❌ การเชื่อมต่อล้มเหลว';
    statusElement.style.color = '#ff5555';
  }
}

// ป้องกันการลากเลือกข้อความทั่วทั้งหน้า
document.addEventListener('selectstart', function(e) {
  if (!e.target.classList.contains('input-field') && 
      !e.target.classList.contains('eng-input')) {
    e.preventDefault();
  }
});

// Inputs - allow typing
document.querySelectorAll('input, button, a').forEach(el => {
  el.addEventListener('mousedown', e => e.stopPropagation());
  el.addEventListener('keydown', e => e.stopPropagation());
});

// Remove caret flicker from nav and hero
document.querySelectorAll('.no-caret').forEach(el => {
  el.style.caretColor = 'transparent';
  el.addEventListener('mousedown', e => e.preventDefault());
  el.addEventListener('keydown', e => e.preventDefault());
});

// Clear all data when showing hero (fallback)
document.addEventListener('click', (e) => {
  if (e.target === hero || (hero && e.target.closest('.hero'))) {
    clearAllModalsData();
  }
});

// ตรวจสอบ session เมื่อโหลดหน้า
document.addEventListener('DOMContentLoaded', async function() {
  console.log('DOM loaded, initializing...');
  
  // ทดสอบการเชื่อมต่อ
  testConnection();
  
  // ตรวจสอบ session
  const session = getSession();
  if (session.token) {
    const result = await validateSession(session.token);
    if (result.success) {
      console.log('User is logged in:', result.user);
      updateUIAfterLogin(result.user);
    } else {
      clearSession();
      resetUI();
    }
  }
  
  // ตรวจสอบว่า elements พร้อมใช้งาน
  console.log('Elements status:', {
    hero: !!hero,
    loginModal: !!loginModal,
    registerModal: !!registerModal,
    contactModal: !!contactModal,
    forgotModal: !!forgotModal,
    resetModal: !!resetModal
  });
});

// Three.js Background - แก้ไขให้ปลอดภัย
try {
  const canvas = document.getElementById('bgCanvas');
  if (canvas && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha:true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    let particleCount = window.innerWidth < 768 ? 800 : 2000;
    let geometry = new THREE.BufferGeometry();
    let positions = [];
    for (let i=0; i<particleCount; i++){
      positions.push((Math.random()-0.5)*20);
      positions.push((Math.random()-0.5)*20);
      positions.push((Math.random()-0.5)*20);
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions,3));
    const material = new THREE.PointsMaterial({ color:0x00ff99, size:0.05, transparent:true, opacity:0.8 });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    function animate(){
      requestAnimationFrame(animate);
      particles.rotation.y += 0.0008;
      particles.rotation.x += 0.0005;
      renderer.render(scene,camera);
    }
    animate();

    window.addEventListener('resize', ()=>{
      camera.aspect = window.innerWidth/window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
} catch (error) {
  console.error('Three.js error:', error);
}