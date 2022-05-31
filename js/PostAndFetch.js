const overlay = document.querySelector("#overlay");

document.querySelector(".close").addEventListener("click", closeModal);

let modalTitle = document.querySelector(".modal-title");
let modalInputField = document.querySelector(".modal-input-field");

let form = document.querySelector(".modal-input-field");

let method;
let cykelrytterForm = false;
const submitBtn = document.getElementById("submit");
const deleteButton = document.createElement("button");


////////////// Create modals /////////////////////

function createHold() {
  setMethod("post");
  setTitle("Opret Hold");
  setFormDestination("http://localhost:8181/api/hold", "post");

  createInput("Holdnavn", "name", "text");

  setupSubmitButton();

  openModal();
}

function createCykelrytter() {
  setMethod("post");
  setTitle("Create Cykelrytter");
  setFormDestination("http://localhost:8181/api/cykelrytter", "post")

  createInput("Cykelrytters navn", "name", "text");
  createDropdownInput("http://localhost:8181/api/hold", "Hold", "hold");

  setupSubmitButton();

  cykelrytterForm = true;
  openModal();
}

function editHold(hold) {
  setMethod("put");
  setTitle("Rediger hold");
  setFormDestination("http://localhost:8181/api/hold/" + hold.id, "put")

  createInput("Holdnavn", "name", "text", hold.name);

  displayHold(hold)

  createDeleteButton("http://localhost:8181/api/hold/" + hold.id);
  setupSubmitButton();

  openModal();
}

function editCykelrytter(cykelrytter) {
  setMethod("put");
  setTitle("Rediger Cykelrytter");
  setFormDestination("http://localhost:8181/api/cykelrytter/" + cykelrytter.id, "put")

  createInput("Cykelrytters navn", "name", "text");
  createDropdownInput("http://localhost:8181/api/hold", "Hold", "hold");

  displayCykelryttere(cykelrytter)

  createDeleteButton("http://localhost:8181/api/cykelrytter/" + cykelrytter.id);
  setupSubmitButton();

  openModal();
}

//////////////// Modal build functions ///////////////

function setTitle(title) {
  modalTitle.textContent = title;
}

function setMethod(method) {
  this.method = method;
}

function setFormDestination(action, method) {
  form.setAttribute("action", action);
  form.setAttribute("method", method);
}

function createInput(inputName, idName, type, value) {
  const title = document.createElement("p");
  const text = document.createTextNode(inputName);
  title.appendChild(text);

  const input = document.createElement("input");
  input.id = idName;
  input.name = idName;
  input.type = type;
  if (value !== undefined) {
    input.value = value;
  }
  input.classList.add("js-input");


  form.appendChild(title);
  form.appendChild(input);
}

async function  createDropdownInput(url, inputName, idName) {
  const title = document.createElement("p");
  const text = document.createTextNode(inputName);
  title.appendChild(text);

  const entities = await fetchEntities(url);
  const select = document.createElement("select");
  select.id = idName;
  select.name = idName;

  for (let i = 0; i < entities.length; i++) {
    let entity = entities[i];
    select.add(new Option(entity.name, entity.id));
  }

  form.appendChild(title);
  form.appendChild(select);

}

function openModal() {
  overlay.style.display = "block";
}

function closeModal() {
  overlay.style.display = "none";
  clearModal();
}

function clearModal() {
  modalTitle.textContent = "";
  deleteButton.remove();

  form.reset();

  while (modalInputField.hasChildNodes()) {
    modalInputField.removeChild(modalInputField.firstChild);
  }
}

async function displayCykelryttere(cykelrytter) {
  const cykelryttere = await fetchEntities("http://localhost:8181/api/cykelrytter/" + cykelrytter.id);
  const header = document.createElement("p");
  header.textContent = "Cykelryttere:";
  header.style.fontWeight = "bold";
  form.appendChild(header);
  cykelryttere.forEach(s => {
    const div = document.createElement("div");
    div.textContent = s.name;
    form.appendChild(div);
  });
}

async function displayHold(hold) {
  const holdene = await fetchEntities("http://localhost:8181/api/cykelrytter/hold/" + hold.id);
  const header = document.createElement("p");
  form.appendChild(header);
  holdene.forEach(s => {
    const div = document.createElement("div");
    div.textContent = s.name;
    form.appendChild(div);
  });
}

function createDeleteButton(url) {
  const modalFooter = document.querySelector(".modal-footer")

  deleteButton.id = "delete";
  deleteButton.className = "btn btn-danger remove";
  deleteButton.textContent = "Delete";

  modalFooter.appendChild(deleteButton);

  deleteButton.addEventListener("click", async () => {

    await deleteEntity(url);
    await location.reload();
  });
}

function setupSubmitButton() {
  submitBtn.addEventListener("click", async () => {
    await createFormEventListener();
    await location.reload();
  });
}

function deleteEntity(url) {
  const fetchOptions = {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
  };
  return fetch(url, fetchOptions);
}

//////////////////////////////////////////////////////////////////

const cykelrytterContainer = document.getElementById("container");

loadCykelryttere();

async function loadCykelryttere() {
  const cykelryttere = await fetchEntities("http://localhost:8181/api/cykelrytter");

  for (let i = 0; i < cykelryttere.length; i++) {
    let cykelrytter = cykelryttere[i];
    const cykelrytterContainerElement = document.createElement("a");

    const cykelrytterContainerElementId = document.createElement("div");
    const cykelContainerElementTitle = document.createElement("div");

    cykelrytterContainerElementId.textContent = cykelrytter.id;
    cykelContainerElementTitle.textContent = cykelrytter.name;

    cykelrytterContainerElement.classList.add("container-element");
    cykelrytterContainerElementId.classList.add("container-element-id");
    cykelContainerElementTitle.classList.add("container-element-title");

    cykelrytterContainerElement.addEventListener("click", () => editCykelrytter(cykelrytter));

    cykelrytterContainerElement.appendChild(cykelrytterContainerElementId);
    cykelrytterContainerElement.appendChild(cykelContainerElementTitle);

    cykelrytterContainer.appendChild(cykelrytterContainerElement);
  }
}

const holdContainer = document.getElementById("hold-container");

loadHold();

async function loadHold() {
  const holdene = await fetchEntities("http://localhost:8181/api/hold");

  for (let i = 0; i < holdene.length; i++) {
    let hold = holdene[i];
    const holdContainerElement = document.createElement("a");

    const holdContainerElementId = document.createElement("div");
    const holdContainerElementTitle = document.createElement("div");

    holdContainerElementId.textContent = hold.id;
    holdContainerElementTitle.textContent = hold.name;

    holdContainerElement.classList.add("container-element");
    holdContainerElementId.classList.add("container-element-id");
    holdContainerElementTitle.classList.add("container-element-title");

    holdContainerElement.addEventListener("click", () => editHold(hold));

    holdContainerElement.appendChild(holdContainerElementId);
    holdContainerElement.appendChild(holdContainerElementTitle);

    holdContainer.appendChild(holdContainerElement);
  }
}

function fetchEntities(url) {
  return fetch(url).then(response => response.json());

}

/////////////////////////////////////////////////////////////////

function createFormEventListener() {

  form.addEventListener("submit", handleFormSubmit);

}

async function handleFormSubmit(event) {
  event.preventDefault();

  const formEvent = event.currentTarget;
  const url = formEvent.action;

  try {
    const formData = new FormData(formEvent);

    await postFormDataAsJson(url, formData);
  } catch (err) {

  }
}

async function postFormDataAsJson(url, formData) {
  const plainFormData = Object.fromEntries(formData.entries());
  let formDataJsonString;

  if (cykelrytterForm) {
    const holdId  = document.getElementById("hold").value;

    const cykelrytter = {};
    cykelrytter.name = "";
    cykelrytter.hold = {};
    cykelrytter.hold.id = holdId;

    formDataJsonString = JSON.stringify(cykelrytter);

    cykelrytterForm = false;
  } else {
    formDataJsonString = JSON.stringify(plainFormData);
  }

  const fetchOptions = {
    method: this.method,
    headers: {
      "Content-Type": "application/json",
    },
    body: formDataJsonString
  };

  const response = await fetch(url, fetchOptions);

  if (!response) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }

  return response.json();
}
