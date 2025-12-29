function token(){
    return ((Math.random() + 1).toString(16).substring(2));
}

export default token;