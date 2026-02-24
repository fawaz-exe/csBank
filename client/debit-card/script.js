const toggleBtn = document.getElementById("toggleBtn");

const cardNumber = document.getElementById("cardNumber");
const cardHolder = document.getElementById("cardHolder");
const validThru = document.getElementById("validThru");
const cvv = document.getElementById("ccv");

const userId = localStorage.getItem("userId");
const token = localStorage.getItem("token");

let cardData = {}
let isShown = false;

try {
  const response = await axios.get(
    "http://localhost:6040/api/accounts/account/debitCard", {
    headers: {
      'Content-Type': 'application/json',
      'auth-token': token
    },
  }
  )

  if (response.data.success) {
    const card = response.data.debitCards[0];
    cardData = {
      cardNumber: card.cardNumber,
      cardHolder: response.data.Name,
      validThru: "10/27",
      cvv: card.cvv
    }
    hideDetails();
  }

} catch (error) {
  console.log(error)
}


// (this is seed data, later we will fetch card details from the api response )
//  cardData = {
//   cardNumber: "0123 4567 8901 2345",
//   cardHolder: "Farhan khan",
//   validThru: "10/27",
//   cvv: "123"
// };


function hideDetails() {
  cardNumber.textContent = "**** **** **** *****";
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

// hideDetails();
