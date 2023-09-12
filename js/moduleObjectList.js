function addObjectToList(container){
    const objectListContainer = document.querySelector(`.${container.listClassName}`)
    const singleObjectContainer = createObjectContainer()
    const deleteButton = createNewDeleteButton(container)
    const labelAndRadioButton = createNewLabelAndRadioButton(objectListContainer, container)
    let plusButton
    if(container.hasList)
    {
        plusButton = createNewPlusButton(container)
        removeCurrentPlusButton(objectListContainer)
    }

    removeCheckedFromAllRadio(objectListContainer)

    singleObjectContainer.appendChild(labelAndRadioButton);
    singleObjectContainer.appendChild(deleteButton)
    objectListContainer.appendChild(singleObjectContainer)
    if(container.hasList)
    {
    objectListContainer.appendChild(plusButton);
    }

    const radioButtons = objectListContainer.querySelectorAll('input[type="radio"]')
    setupRadioButtonsObjectList(radioButtons, container);
    addObjectToJson(container, labelAndRadioButton.textContent)
}

function createObjectContainer(){
    const singleObjectContainer = document.createElement("div");
    singleObjectContainer.className = "single-object-container";

    return singleObjectContainer
}

function createNewLabelAndRadioButton(objectListContainer, container){
    const labelElement = document.createElement("label");
    labelElement.className = "object-list-element radio-checked";
    const radioInput = document.createElement("input");
    radioInput.type = "radio";
    radioInput.name = "object-list";
    radioInput.className = "radio-input";
    radioInput.checked = true;
    labelElement.appendChild(radioInput);
    let defaultName="";
    switch(container.name){
        case "case":
            defaultName = 'ARGUMENT'
          break; 
        default:
            const radioButtons = objectListContainer.querySelectorAll('input[type="radio"]');
            defaultName = `obiekt-${radioButtons.length}`
          break; 
      }
    
    
    labelElement.appendChild(document.createTextNode(defaultName));

    return labelElement
}

function createNewPlusButton(container) {
    const addButton = document.createElement("button");
    addButton.className = "plus-circle add-object";
    const plusIcon = document.createElement("i");
    plusIcon.className = "fas fa-plus";
    addButton.appendChild(plusIcon);
    addButton.removeEventListener("click", () => addObjectToList(container))
    addButton.addEventListener("click", () => addObjectToList(container))

    return addButton
}

function createNewDeleteButton(container)
{   
    const deleteButton = document.createElement("div");
    deleteButton.className = "delete-icon";
    deleteButton.textContent = "🗑️";
    deleteButton.addEventListener("click", (event) => removeObjectFromList(event, container))

    return deleteButton
}

function removeCheckedFromAllRadio(objectListContainer)
{
    objects = objectListContainer.querySelectorAll(".object-list-element")
    objects.forEach(object => {
        object.classList.remove("radio-checked")
        object.checked=false
    })
}

function removeCurrentPlusButton(objectListContainer){
    const plus = objectListContainer.querySelector(".add-object")
    try{
    plus.remove()
    }
    catch{}
}

function addObjectToJson(container, id)
{
    const moduleName = container.name
    container.workingObject = new objectDict[moduleName](id);
    if(objectContainer.hasList) {
        container.list.push(container.workingObject)
        const index = findObjectIndexOnList(id, container)
        container.currentIndex = index
      }
      else {
        dynamicData[currentModule] = objectContainer.workingObject
      }
    fillFormFields(container.workingObject)
    removeDefaultValuesFromJson(container.workingObject, container.jsonConfig.properties, container)
    container.hideAndRevealRequiredItems()
    updateDynamicDataAndJsonText()
}

function removeObjectFromList(event, container){
    if (window.confirm("Czy na pewno chcesz usunąć obiekt?")) {
        const objectId = event.target.previousElementSibling.textContent
        removeObjectFromJson(objectId, container.list ,container)
        const singleContainer = event.target.parentNode
        if(singleContainer.firstChild.classList.contains("radio-checked"))
        {
            container.currentIndex = 0
            const listContainer = document.querySelector(`.${container.listClassName}`)
            const elements = listContainer.querySelectorAll(".object-list-element")
            if(elements.length>1){
                elements[0].classList.add("radio-checked")
                container.workingObject = dynamicData[currentModule].list[0]
                fillFormFields(container.workingObject)
                container.hideAndRevealRequiredItems()
            }
            else{
                switch(container.name){
                    case "case":
                        objectContainer.removeObjectKeyByPath("case")
                        break;
                    default:
                        container.workingObject = null
                        delete dynamicData[currentModule]
                    break;

                }
                
 
            }
            updateDynamicDataAndJsonText()
        }
        singleContainer.remove()
        updateJsonTextArea()
        
    }
}

function changeObjectOnList(event, container){
    const objectId = event.target.parentNode.textContent
    const index = findObjectIndexOnList(objectId, container)
    container.currentIndex = index
    container.workingObject = container.list[index]
    console.log(container);
    fillFormFields(container.workingObject)
    container.hideAndRevealRequiredItems()
    removeDefaultValuesFromJson(container.workingObject, container.jsonConfig.properties)
}

function setupRadioButtonsObjectList(radioButtons, container) {
    radioButtons.forEach(radioButton => {
        radioButton.removeEventListener('click', () => {
            radioButtons.forEach(rb => {
                rb.parentNode.classList.remove('radio-checked');
            });
            radioButton.parentNode.classList.add('radio-checked');
        });
        radioButton.addEventListener('click', () => {
            radioButtons.forEach(rb => {
                rb.parentNode.classList.remove('radio-checked');
            });
            radioButton.parentNode.classList.add('radio-checked');
        });
        radioButton.removeEventListener('change', (event) => changeObjectOnList(event, container))
        radioButton.addEventListener('change', (event) => changeObjectOnList(event, container))
    });
  }

  function updateObjectListText()
  {
    const objectListContainer = document.querySelector(".object-list-container")
    const checkedRadioButton = objectListContainer.querySelector('label.radio-checked > input[type="radio"]');
    checkedRadioButton.parentElement.firstChild.nextSibling.textContent = objectContainer.workingObject["id"] || objectContainer.workingObject["name"]
}