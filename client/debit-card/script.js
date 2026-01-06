  const toggleBtn = document.getElementById("toggleBtn");

  const cardNumber = document.getElementById("cardNumber");
  const cardHolder = document.getElementById("cardHolder");
  const validThru = document.getElementById("validThru");
  const cvv = document.getElementById("ccv");

// (this is seed data, later we will fetch card details from the api response )
  const cardData = {
    cardNumber: "0123 4567 8901 2345",
    cardHolder: "Farhan khan",
    validThru: "10/27",
    cvv: "123"
  };

  let isShown = false;

  function hideDetails() {
    cardNumber.textContent = "**** **** **** " + cardData.cardNumber.slice(-4);
    cardHolder.textContent = "XXXXX XXXXX";
    validThru.textContent = "MM/YY";
    cvv.textContent = "***";
  }

  function showDetails() {
    cardNumber.textContent =
      cardData.cardNumber
    cardHolder.textContent = cardData.cardHolder;
    validThru.textContent = cardData.validThru;
    cvv.textContent = cardData.cvv;
  }

  toggleBtn.addEventListener("click", () => {
    if (isShown) {
      hideDetails();
      toggleBtn.textContent = "Show Details";
    } else {
      showDetails();
      toggleBtn.textContent = "Hide Details";
    }

    isShown = !isShown;
  });

  hideDetails();
