let uniqueNameRadioButtons, addObjectPlus, deleteObjectButtons, radioButtonObjectList, inputList, checkboxList, keyHeaders, extraOptionsButtons, jsonButtons, homeLink
let currentModule = ""
let requiredItems;
let keyRequiredItems;
let configJson;
let objectContainer, keyContainer

function loadModuleObject(index, module)
{
  objectContainer = new ConfigurationContainer(index, "object-configuration", "object-list-container", module)
  currentModule = module
  fetch('config/modules.json')
    .then(response => response.json())
    .then(config => {
      const configObject = findObjectByProperty(config.modules, "characterEffect", "name")
      if(configObject.hasList){
        objectContainer.hasList = true
        if(dynamicData.hasOwnProperty(currentModule))
        {
          objectContainer.workingObject = dynamicData[currentModule].list[index]
        }
        else {
          dynamicData[currentModule]={}
          dynamicData[currentModule].list=[]
        }
        objectContainer.list = dynamicData[currentModule].list
      }
      
      else {
        objectContainer.hasList = false
        dynamicData[currentModule]={}
      }
      loadModuleContent()
    })
    .catch(error => {
    console.error('Błąd pobierania:', error);
    })
}

function loadModuleContent()
{
    const home = document.querySelector(".element-container")
    home.innerHTML = `<div class="home"><a class="aLink" href="#"><button class="home-button"><i class="fa-solid fa-house"></i></button></a><span class="module-title">${currentModule}</span></div>`
    let fullHtml = `<div class="configuration-container"><div class="objects-container">`
    const handleContainer = document.querySelector(".handle-container")
    removeAllChildren(handleContainer)
    fullHtml += createConfigurationMenu()
    fetch(`config/${currentModule}.json`)
    .then(response => response.json())
    .then(config => {
        objectContainer.jsonConfig = config
        fullHtml += `<div class="object-configuration">`
        fullHtml += createObjectConfigurationContainer(config) 
        fullHtml += createKeyMenu()
        handleContainer.innerHTML += fullHtml
        objectContainer.requiredItems = findReuqiredItems(config)
        const container = document.querySelector(".object-configuration")
        const objectListContainer = document.querySelector(".object-list-container")
        objectContainer.createObjectList()
        getModuleElements(container, objectListContainer)       
        addObjectIfListIsEmpty(objectContainer)
        createModuleDOMEvents(objectContainer) 
        fillFormFields(objectContainer.workingObject);
        objectContainer.hideAndRevealRequiredItems()
        removeDefaultValuesFromJson(objectContainer.workingObject, objectContainer.jsonConfig.properties)
        hightligthsUsedExtraOption(objectContainer)
        checkEmptyInputsAndShowErrors(objectContainer)
        inputList.forEach(input => isDataValid(objectContainer, input))
    })
    .catch(error => {
    console.error('Błąd pobierania:', error);
    })

    const buttonsContainer = document.querySelector(".buttons-container")
    const jsonButtonsHtml = createJsonButtons()
    buttonsContainer.innerHTML = jsonButtonsHtml
    //restoreLastJson()

}

function createConfigurationMenu() {
  return `<div class="object-list-container"><div class="container-title">Menu obiektów</div></div>`
}

function createKeyMenu() {
  return `</div><div class="object-key">   
  <div class="object-list-key">
      <div class="container-title">Menu obiektów</div>
  </div>
  <div class="key-configuration"></div>`
}

function setupRadioButtons(radioButtons, container) {
  radioButtons.forEach(radioButton => {
      radioButton.addEventListener('click', () => {
          radioButtons.forEach(rb => {
              rb.parentNode.classList.remove('radio-checked');
          });
          radioButton.parentNode.classList.add('radio-checked');
      });
      radioButton.addEventListener('change', (event) => {
        updateObjectRadioButton(event, container)
        fillFormFields(container.workingObject)
        container.hideAndRevealRequiredItems()
        removeDefaultValuesFromJson(container.workingObject, container.jsonConfig.properties, container)
        updateObjectListText(container)}
      )
  });
}

function addObjectIfListIsEmpty(container){
  if(radioButtonObjectList.length ===0)
  {
    addObjectToList(container)
  }
}

function getModuleElements(container, listContainer){
  getModuleElementsFromContainer(container)
  getModuleElementsFromObjectList(listContainer)
  jsonButtons = document.querySelectorAll(".json-buttons")
  homeLink = document.querySelector(".aLink")
}

function getModuleElementsFromContainer(container){
  const radioButtons = container.querySelectorAll('input[type="radio"]');
  uniqueNameRadioButtons = new Set();
  radioButtons.forEach(radioButton => {
    const name = radioButton.getAttribute('name');
    if (name && !uniqueNameRadioButtons.has(name)) {
      uniqueNameRadioButtons.add(name);
    }
  });

  inputList = container.querySelectorAll('input[type="text"], input[type="number"]')
  checkboxList = container.querySelectorAll('.slider')
  keyHeaders = container.querySelectorAll(".key, .subkey, .subSubkey")
  extraOptionsButtons = container.querySelectorAll(".extra-option")
}

function getModuleElementsFromObjectList(container){
  radioButtonObjectList = container.querySelectorAll('input[type="radio"]')
  addObjectPlus = container.querySelector(".add-object")
  deleteObjectButtons = container.querySelectorAll(".delete-icon")
}

function createModuleDOMEvents(container){
  createModuleDOMEventFromContainer(container)
  createModuleDOMEventFromObjectList(container)
  jsonButtons.forEach(button => button.addEventListener("click", buttonClick))
  
  
  let currentURL = window.location.href;
        if(currentURL.includes("configuration.html")){
            currentURL = currentURL.substring(0, currentURL.indexOf("configuration.html"))
        }
        const newURL = currentURL
        homeLink.href = newURL
}

function createModuleDOMEventFromContainer(container){
  uniqueNameRadioButtons.forEach(name => {
    const radioButtons = document.querySelectorAll(`input[name="${name}"]`);
    setupRadioButtons(radioButtons, container);
  })

  setupRadioButtonsObjectList(radioButtonObjectList, container);

  if (checkboxList) {
    checkboxList.forEach(checkbox => {
      checkbox.addEventListener("click", (event) => checkboxClickEvent(checkbox, event, container))   
    })
  }

  if (inputList) {
    inputList.forEach(input => {
      input.addEventListener("input", (event) => inputClickEvent(event, container))
      input.addEventListener("blur", (event) => {
        showErrorIfInputIsEmpty(event.target)
        isDataValid(container, event.target) })
      })
    }

  if (keyHeaders) {
    keyHeaders.forEach(header => {
      header.addEventListener("click", event => collapseObjectKeys(event))
    })
  }

  if (extraOptionsButtons) {
  extraOptionsButtons.forEach(button => {
    button.addEventListener("click", (event) => handleExtraOptionButtonClick(event))
    })
  }
}

function createModuleDOMEventFromObjectList(container){
  if (addObjectPlus) {
    addObjectPlus.addEventListener("click", () => addObjectToList(container))
  }
  if(deleteObjectButtons){
    deleteObjectButtons.forEach(button => button.addEventListener("click", (event) => removeObjectFromList(event, container)))
  }
}

function checkboxClickEvent(checkbox, event, container){
    checkbox.classList.toggle("checkbox-checked")
    changeValueInJsonCheckbox(event, container)
    removeDefaultValuesFromJson(container.workingObject, container.jsonConfig.properties, container)
}

function inputClickEvent(event, container){
  changeValueInJsonInput(event, container)
  resizeIfIsTooLongValue(event)
  updateObjectListText(container)
  removeDefaultValuesFromJson(container.workingObject, container.jsonConfig.properties, container)
}


function main(){
  restoreLastJson()
  if(!localStorage.getItem("module")){
    localStorage.setItem("module", "characterEffect")
    localStorage.setItem("index", 0)
  }
  loadModuleObject(localStorage.getItem("index"), localStorage.getItem("module"))
  const jsonText = document.querySelector(".json-text")
  jsonText.value = JSON.stringify(dynamicData, null, 2);
 }
 
//localStorage.clear()
 main();
