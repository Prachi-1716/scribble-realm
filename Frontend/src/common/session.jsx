let storeInSession = (key, value)=>{
    return sessionStorage.setItem(key, value);
}

let lookiInSession = (key, value)=>{
    return sessionStorage.getItem(key);
}

let removeFromSession = (key)=>{
    return sessionStorage.removeItem(key);
}

let logOutUser = ()=>{
    sessionStorage.clear();
}

export {storeInSession, lookiInSession, removeFromSession, logOutUser};