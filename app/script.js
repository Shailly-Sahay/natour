'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2023-12-31T17:01:17.194Z',
    '2023-12-28T23:36:17.929Z',
    '2024-01-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
// const login = document.querySelector('.login__input');
const logOut = document.querySelector('.logout');
const login = document.querySelector('.login');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const btnLogOut = document.querySelector('.logout__btn');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Global variables
let logInfo = false;
let currentAccount;
let messageBoolean = false;
let timer;
let sorted = false;

//   LOGOUT TIMER
const startLogoutTimer = function () {
  // Set time to 5 minutes
  let time = 10;
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    // In each call, print the remainig time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 sec, log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
      loggingFunction(logInfo);
      logInfo = !logInfo;

      welcomeMessage(messageBoolean);
      messageBoolean = !messageBoolean;
    }
    // Decrease
    time--;
  };
  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

// FUNCTION TO EVALUATE USERNAME:
const evaluateUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(mov => mov.slice(0, 1))
      .join('');
  });
};
evaluateUserName(accounts);

// DATES
const formatMovementDates = function (date, locale) {
  const calcDaysPassed = (date1, date2) => {
    return Math.round(Math.abs(date2 - date1) / (1000 * 3600 * 24));
  };

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return `Today`;
  if (daysPassed === 1) return `Yesterday`;
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = `${date.getFullYear()}`.padStart(2, 0);
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

// DISPLAYING MOVEMENTS FOR THE CURRENT ACCOUNT

// Currency formatting
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  containerMovements.innerHTML = '';
  movs.forEach(function (mov, i) {
    const date = formatMovementDates(
      new Date(acc.movementsDates[i]),
      acc.locale
    );
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const formattedMov = formatCur(mov, acc.locale, acc.currency);
    const html = `<div class="movements__row">
                    <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
                    <div class="movements__date">${date}</div>
                    <div class="movements__value">${formattedMov}</div>
                  </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

// Logging in and out functionality

const loggingFunction = function (logInfo) {
  logOut.style.display = !logInfo ? 'block' : 'none';
  login.style.display = logInfo ? 'block' : 'none';
};

// DISPLAYING BALANCE
const displayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

// DISPLAYING DEPOSITS, WITHDRAWAL, INTEREST
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = Math.abs(
    acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0)
  );
  labelSumOut.textContent = formatCur(out, acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter(mov => mov > 1)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

// FINDING ACCOUNT

const welcomeMessage = function (boolean) {
  labelWelcome.textContent = boolean
    ? `Login to get started`
    : `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
};

btnLogin.addEventListener('click', function (e) {
  //prevent form from submitting
  //In form => Enter button also works
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    welcomeMessage(messageBoolean);
    messageBoolean = !messageBoolean;
    containerApp.style.opacity = 100;

    // DATE
    const now = new Date();
    const option = {
      hour: 'numeric',
      minute: 'numeric',
      day: `numeric`,
      month: `numeric`,
      year: `numeric`,
      // weekday: `long`,
    };

    // const locale = navigator.language;
    // console.log(locale);

    // labelDate.textContent = new Intl.DateTimeFormat('en-US', option).format(
    //   now
    // );

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      option
    ).format(now);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    //TIMER
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();
    updateUI(currentAccount);

    // Logging buttons functionality
    loggingFunction(logInfo);
    logInfo = !logInfo;
  }
});

// Logout

btnLogOut.addEventListener('click', function () {
  console.log(logInfo);
  loggingFunction(logInfo);
  logInfo = !logInfo;

  welcomeMessage(messageBoolean);
  messageBoolean = !messageBoolean;

  containerApp.style.opacity = 0;
});

// UPDATE THE UI
function updateUI(account) {
  // Display movements
  displayMovements(account);

  // Display balance
  displayBalance(account);

  // Display summary
  calcDisplaySummary(account);
}

// TRANSFER MONEY
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.userName !== currentAccount.userName
  ) {
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movements.push(amount);
    receiverAcc.movementsDates.push(new Date().toISOString());

    clearInterval(timer);
    timer = startLogoutTimer();
    updateUI(currentAccount);
  }
});

// CLOSE ACCOUNT -- Use splice method to delete array element. For that you will need the index of the eleemnt you want to remove. For that we have findIndex method
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.userName === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    inputClosePin.value = inputCloseUsername.value = '';
    inputClosePin.blur();
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );

    accounts.splice(index, 1);
    console.log(accounts);

    containerApp.style.opacity = 0;
  }
});

// REQUEST LOAN -- includes method is used to check if there is any particular element in the array or not(Boolean result). 'some' method does the same but rather we use a callback function and condition.. even if one ele satisfies then we get true.. But for ele to be true, use 'every' method.

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loan = Number(Math.floor(inputLoanAmount.value));
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
  if (loan > 0 && currentAccount.movements.some(mov => mov >= loan * 0.1)) {
    setTimeout(function () {
      currentAccount.movements.push(loan);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
    }, 3000);
  }

  clearInterval(timer);
  timer = startLogoutTimer();
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

const overallbalance = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, ele) => ele + acc, 0);
console.log(overallbalance);

// FAKE LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;
