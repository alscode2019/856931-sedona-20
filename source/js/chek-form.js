var form = document.querySelector(".form");
var filure = document.querySelector(".modal--filure");
var success = document.querySelector(".modal--success");
var inputs = form.querySelectorAll("input");
var submit = form.querySelector(".form__button");
var filureClose = filure.querySelector(".modal__filure-button");
var successClose = success.querySelector(".modal__success-button");



// Добавляем обработчик клика на кнопку отправки формы
submit.addEventListener('click', function (evt) {

  // Пройдёмся по всем полям
  for (var i = 0; i < inputs.length; i++) {

    var input = inputs[i];

    // Проверим валидность поля, используя встроенную в JavaScript функцию checkValidity()
    if (input.checkValidity() === false) {
      evt.preventDefault();
      filure.classList.add("modal__show");
      input.classList.add("form__input-invalid");
      success.classList.remove("modal__show");
    } // закончился if
    else {
      input.classList.remove("form__input-invalid");
    }

  } // закончился цикл
});

// Сообщение об отправке формы

form.addEventListener("submit", function (evt) {
  evt.preventDefault();
  success.classList.add("modal__show");
  filure.classList.remove("modal__show");
  document.getElementById("form").reset(); // Очистка формы
});


// Закрываем окнa
filureClose.addEventListener("click", function (evt) {
  evt.preventDefault();
  filure.classList.remove("modal__show");
});

successClose.addEventListener("click", function (evt) {
  evt.preventDefault();
  success.classList.remove("modal__show");
});


// Закрываем по ESC

window.addEventListener("keydown", function (evt) {
  if (evt.keyCode === 27) {
    evt.preventDefault();
    filure.classList.remove("modal__show");
    success.classList.remove("modal__show");
  }
});


// Закрываем по ENTER
window.addEventListener("keydown", function (evt) {
  if (evt.keyCode === 13) {
    evt.preventDefault();
    filure.classList.remove("modal__show");
    success.classList.remove("modal__show");
  }
});
