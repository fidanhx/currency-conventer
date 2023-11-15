let amountInputs = document.querySelectorAll(".inp");
let fromCurrencyButtons = document.querySelectorAll(".v1");
let toCurrencyButtons = document.querySelectorAll(".v2");
let allLiElements = document.querySelectorAll('.val1 button');
let allLiElements2 = document.querySelectorAll('.val2 button');

let fromCurrency = "RUB";
let toCurrency = "USD";

amountInputs.forEach(input => {
    input.addEventListener("input", function() {
        this.value = this.value.replace(/[^0-9.]/g, ''); 
        if (this.value.split('.').length > 2) {
            this.value = this.value.slice(0, this.value.lastIndexOf('.'));
        }
    });
});

function getExchangeRate(from, to, amount, input) {
    fetch(`https://v6.exchangerate-api.com/v6/a4a5661764e25182a524d47d/latest/${from}`)
        .then(response => response.json())
        .then(data => {
            let exchangeRate = data.conversion_rates[to];
            let enteredAmount = parseFloat(amount);

            if (!isNaN(enteredAmount)) {
                let convertedAmount = (enteredAmount * exchangeRate).toFixed(4);
                input.value = convertedAmount;

                document.getElementById('rate1').innerText = `1 ${from} = ${exchangeRate.toFixed(4)} ${to}`;
                document.getElementById('rate2').innerText = `1 ${to} = ${(1 / exchangeRate).toFixed(4)} ${from}`;
            } else {
                //input.value = "";
            }
        })
        .catch(error => {
            console.log("Valyuta məzənnələrini əldə edərkən xəta baş verdi:", error);
        });
}

function updateCurrency(event) {
    if (event.target.classList.contains("v1")) {
        fromCurrency = event.target.innerText;
        handleButtonClick(event.target, 'val1');
    } else if (event.target.classList.contains("v2")) {
        toCurrency = event.target.innerText;
        handleButtonClick(event.target, 'val2');
    }
    getExchangeRate(fromCurrency, toCurrency, amountInputs[0].value, amountInputs[1]);
}

fromCurrencyButtons.forEach(button => {
    button.addEventListener("click", updateCurrency);
});

toCurrencyButtons.forEach(button => {
    button.addEventListener("click", updateCurrency);
});

amountInputs.forEach((input, index) => {
    input.addEventListener("input", () => {
        if (index === 0) {
            getExchangeRate(fromCurrency, toCurrency, input.value, amountInputs[1]);
        } else {
            getExchangeRate(toCurrency, fromCurrency, input.value, amountInputs[0]);
        }
    });
});

function handleButtonClick(item, valClass) {
    const activeButtons = document.querySelectorAll(`.${valClass} .active`);

    if (!item.classList.contains('active')) {
        if (activeButtons.length > 0) {
            activeButtons[0].classList.remove('active');
        }
        item.classList.add('active');
        item.style.display = 'inline-block';
    }

    document.querySelectorAll(`.${valClass} button`).forEach(button => {
        if (button !== item && !button.classList.contains('active')) {
            button.style.display = 'inline-block';
        }
    });

    if (valClass === 'val1') {
        fromCurrency = item.innerText;
    } else if (valClass === 'val2') {
        toCurrency = item.innerText;
    }
}

allLiElements.forEach(li => {
    li.addEventListener('click', function() {
        handleButtonClick(li, 'val1');
        updateCurrency({ target: li });
    });
});

allLiElements2.forEach(li2 => {
    li2.addEventListener('click', function() {
        handleButtonClick(li2, 'val2');
        updateCurrency({ target: li2 });
    });
});

function setDefaultActiveButtons() {
    const ru1Button = document.querySelector('.ru1');
    const us2Button = document.querySelector('.us2');

    ru1Button.classList.add('active');
    us2Button.classList.add('active');
}

setDefaultActiveButtons();
