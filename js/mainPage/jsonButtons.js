const buttons = document.querySelectorAll(".json-buttons")
let jsonText = document.querySelector(".json-text")

function buttonClick(e) {
    switch(e.target.textContent){
        case "Beautify":
            beautifyJson()
            break;
        case "Minify":   
            minifyJson()
            break; 
        case "Copy":
            copyJson()
            break;
        case "Clear":
            clearJson()
            break;
        default:
            console.warn("Nieznany przycisk nad panelem Jsona!");
            break;

    }

}

function beautifyJson(){
    jsonText.classList.remove("wrap-json")
    jsonText.value = JSON.stringify(JSON.parse(jsonText.value), null, 2)
}

function minifyJson(){
    jsonText.classList.add("wrap-json")
    jsonText.value = JSON.stringify(JSON.parse(jsonText.value))

}

function copyJson() {
    const textToCopy = jsonText.value
    navigator.clipboard.writeText(textToCopy)
}

function clearJson(){
    if (window.confirm("Czy na pewno chcesz wyczyścić pole Json?\nPS. Ctrl+z nie przywróci go już z powrotem.")) {
        localStorage.setItem('clearedJson', jsonText.value);
        dynamicData = {}
        updateJson()
    }
}

buttons.forEach(button => button.addEventListener("click", buttonClick))

jsonText.addEventListener("keyup", () => {
    try {
        dynamicData = JSON.parse(jsonText.value)
        jsonText.classList.remove("error-json")
        saveJsonState()
        createSrajModulesMenu(dynamicData);
    }
    catch(error){
        jsonText.classList.add("error-json")
    }
})