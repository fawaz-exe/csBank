function generateSixDigitNumber(){
    return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
}

const OTP = await generateSixDigitNumber()

console.log("OTP : ", OTP);

export default generateSixDigitNumber