function generateThreeDigitNumber(){
    return Math.floor(Math.random() * (999 - 100 + 1)) + 100;
}

const CVV = await generateThreeDigitNumber()

console.log("CVV : ", CVV);

export default generateThreeDigitNumber