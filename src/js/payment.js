'use strict';

(function () {
  var CardStatus = {
    UNDEFINED: 'Не определён',
    APPROVED: 'Одобрен'
  };

  var payment = document.querySelector('.payment');
  var card = payment.querySelector('.payment__card-wrap');
  var cardInputs = card.querySelectorAll('input');
  var cash = payment.querySelector('.payment__cash-wrap');
  var currentPaymentOption = payment.querySelector('.toggle-btn__input:checked').id;

  var initPaymentOptions = function (current) {
    card.classList.add('visually-hidden');
    cash.classList.add('visually-hidden');
    payment.querySelector('.' + current + '-wrap').classList.remove('visually-hidden');

    window.utility.toggleFields(cardInputs, currentPaymentOption === 'payment__card');
  };

  var renderCheckedPaymentOption = function (option) {
    if (currentPaymentOption) {
      payment.querySelector('.' + currentPaymentOption + '-wrap').classList.add('visually-hidden');
    }

    payment.querySelector('.' + option + '-wrap').classList.remove('visually-hidden');

    window.utility.toggleFields(cardInputs, option === 'payment__card');

    currentPaymentOption = option;
  };

  var onPaymentToggleClick = function (e) {
    if (e.target.classList.contains('toggle-btn__input')) {
      renderCheckedPaymentOption(e.target.id);
    }
  };

  var onCardFieldInvalid = function (e) {
    var field = e.target;
    var cardNumber = field.value;
    var isValid = window.utility.checkCardValidity(cardNumber);

    if (!isValid) {
      field.setCustomValidity('Введите корректный номер карты.');
    } else {
      field.setCustomValidity('');
    }
  };

  var cardField = card.querySelector('#payment__card-number');
  var cardStatusElement = card.querySelector('.payment__card-status');

  var changeCardStatus = function () {
    var isApproved = Array.prototype.every.call(cardInputs, function (cardInput) {
      return cardInput.validity.valid;
    });

    var cardStatus = isApproved ? CardStatus.APPROVED : CardStatus.UNDEFINED;

    cardStatusElement.textContent = cardStatus;
  };

  var onCardFieldsInput = function () {
    changeCardStatus();
  };

  initPaymentOptions(currentPaymentOption);
  payment.addEventListener('change', onPaymentToggleClick);
  cardField.addEventListener('input', onCardFieldInvalid);
  card.addEventListener('keyup', onCardFieldsInput, true);

  window.payment = {
    updateOptions: function () {
      window.utility.toggleFields(cardInputs, currentPaymentOption === 'payment__card');
    }
  };
})();
