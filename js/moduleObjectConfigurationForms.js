function createObjectConfigurationContainer(config)
{
    let html = ''
    for (const property of config.properties) {
        if(property.inputType === "key" || property.inputType === "subkey" || property.inputType === "subSubkey"){
        html += `<div class="${property.inputType}">
        <header data-name="${property.name}">${property.name.substring(property.name.indexOf(".")+1).toUpperCase()}</header></div><div class="key-menu">`
        html+=createObjectConfigurationContainer(property)
        continue;
        }
        else if (property.inputType === 'options') {
            html+=`<div class="key-value"><header class="property-name">${property.name.substring(property.name.indexOf(".")+1)}:</header>`
            for (const option of property.options) {
              const checkedClass = property.defaultInput===option.name ? 'radio-checked' : '';
              const checked =  property.defaultInput===option.name ? 'checked' : '';
              html += `<label class="radio-button ${checkedClass}"><input type="radio" data-name="${property.idInput}" name="${property.name}" class="radio-input" ${checked}>${option.name}</label>`;
            }
          } 
        else if (property.inputType === 'string') {
          html += `<div class="key-value"><label for="${property.idInput}"><span class="property-name">${property.name.substring(property.name.lastIndexOf(".")+1)}:</span></label><input type="text" id="${property.idInput}" value="${property.defaultInput}" name="${property.name}">`;

        }
        else if(property.inputType === 'number'){
          html += `<div class="key-value"><label for="${property.idInput}"><span class="property-name">${property.name.substring(property.name.lastIndexOf(".")+1)}:</span></label><input type="number" step==${property.step} min=${property.min} max=${property.max} value=${property.defaultInput} id="${property.idInput}" name="${property.name}">`;

        }
        else if(property.inputType === 'bool'){
          const checked =  property.defaultInput ? "checkbox-checked" : ""
          html += `<div class="key-value"><label for="${property.idInput}"><span class="property-name">${property.name.substring(property.name.lastIndexOf(".")+1)}:</span><span class="slider round ${checked}"></span><input checked type="checkbox" id="${property.idInput}" name="${property.name}" class="hide"></label>`;
        }
        else if(property.inputType === 'table'){
          html += `<div class="key-value"><span class="property-name">${property.name.substring(property.name.lastIndexOf(".")+1)}:</span>`;
        }
        else{
          continue;
        }
        
        if (property.extraOptions) {
          for (const option of property.extraOptions) {
            let color;
            switch(option.name){
              case "case":
                color = "#FF3131"
                break;
              case "table":
                color = "#0FF0FC"
                break;
              case "get random":
                color = "#FFF01F"
                break;
              default:
                color= "#CCFF00"
                break
            }
            html += `<button class="extra-option" style="--clr:${color}"><span>${option.name.toUpperCase()}</span><i></i></button>`;
            }
          }
        if (property['tool-tip']) {
          html += addToolTip(property['tool-tip'])
        }
        html+='</div>'
      }
    html += `</div>`;
    return html;
}

function addToolTip(tip)
{
   return `<div class="tool-tip">
     <i class="tool-tip__icon">i</i>
     <p class="tool-tip__info">${tip}</p>
   </div>`
}

function fillFormFields(data, prefix = "") {
    for (let key in data) {
      const value = data[key];
      const fullKey = prefix + key;
  
      if (typeof value === "object") {
        fillFormFields(value, fullKey + ".");
      } else {
        let inputElements = document.querySelectorAll('[name="' + fullKey + '"]');
        
        if (inputElements.length > 0) {
          if (inputElements[0].type === "radio") {
            for (let i = 0; i < inputElements.length; i++) {
              const inputElement = inputElements[i];
              if (inputElement.parentNode.textContent === value.toString()) {
                    inputElement.parentNode.classList.add("radio-checked");
                    inputElement.checked = true;
              }
              else{
                inputElement.parentNode.classList.remove("radio-checked");
                inputElement.checked = false;
              }
            }
          } 
          else if(inputElements[0].type === "checkbox")
          {
           const inputElement = inputElements[0];
            if (value) {
               inputElement.previousElementSibling.classList.add("checkbox-checked");
              }
              else{
                inputElement.previousElementSibling.classList.remove("checkbox-checked");
              }
          }
          else {
            for (let i = 0; i < inputElements.length; i++) {
              const inputElement = inputElements[i];
              inputElement.value = value;
            }
             
          }
        }
      }
    }
  }
  
  function findReuqiredItems(config)
  {
    let objectsWithRequire = [];
    if (typeof config === 'object') {
      if (config.hasOwnProperty('require')) {
        objectsWithRequire.push(config);
      }
  
      for (let key in config) {
        if (config.hasOwnProperty(key)) {
          objectsWithRequire = objectsWithRequire.concat(findReuqiredItems(config[key]));
        }
      }
    }
  
    return objectsWithRequire
  }
  
  function findHeadersByName(name, containerClassName) {
    const container = document.querySelector(`.${containerClassName}`)
    return Array.from(container.querySelectorAll('header[data-name="' + name + '"]'));
  }
  
  function findInputsById(name, containerClassName) {
    const container = document.querySelector(`.${containerClassName}`)
    return Array.from(container.querySelectorAll('input[id="' + name + '"], input[data-name="' + name + '"]'));
  }

function collapseObjectKeys(event){
  event.target.classList.toggle("collapsed")
  const keyMenu = event.target.nextElementSibling
  const keyValues = keyMenu.querySelectorAll(".key-menu, .key-value, .subkey, .subSubkey")
  if(event.target.classList.contains("collapsed")){
    keyValues.forEach(value => value.classList.add("collapsed-key"))
  }
  else{
    keyValues.forEach(value => value.classList.remove("collapsed-key"))
  }
}

function resizeIfIsTooLongValue(event){
  if (event.target.value.length > 30) {
    event.target.classList.add('expanded');
  } else {
    event.target.classList.remove('expanded');
  }
}

function handleExtraOptionButtonClick(event){
  const container = document.querySelector(".key-configuration")
  const listContainer = document.querySelector(".object-list-key")
  event.target.classList.add("extra-option-active")
  event.target.classList.toggle("menu-active")
  let fullHtml=""
  if(event.target.classList.contains("menu-active"))
  {
    switch(event.target.textContent)
    {
      case "CASE":
        fetch(`../config/case.json`)
        .then(response => response.json())
        .then(config => {
            
            fullHtml += createObjectConfigurationContainer(config) 
            container.innerHTML = fullHtml
            if(!objectContainer.workingObject["case"])
            {
    
              keyContainer = new ConfigurationContainer(0, "key-configuration", "object-list-key", "case")
              keyContainer.requiredItems = findReuqiredItems(config)
              keyContainer.hasList = true
              keyContainer.jsonConfig = config
              objectContainer.workingObject["case"] = {}
              objectContainer.workingObject["case"].list = []
              keyContainer.workingObject = new Case()
              keyContainer.name = "case"
              objectContainer.workingObject["case"].list.push(keyContainer.workingObject)
              keyContainer.list = objectContainer.workingObject["case"].list
  
            }
            keyContainer.createObjectList()
            getModuleElements(container, listContainer)
            createModuleDOMEvents(keyContainer)
            updateDynamicDataAndJsonText()
            fillFormFields(keyContainer.workingObject);
            keyContainer.hideAndRevealRequiredItems()    
        })
        .catch(error => {
        console.error('Błąd pobierania:', error);
        })
        break;
      case "TABLE":
        break;
      default:
        break; 
    }
  }
  else{
    container.innerHTML = fullHtml
  }
  

}