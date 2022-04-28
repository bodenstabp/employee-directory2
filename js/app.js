const DIRECTORY = document.querySelector('#gallery');
const SUBMIT = document.querySelector('#search-submit');
let employeeArray = [];
let modalIsOpen = false;
let selectedEmployee;

fetchEmployees();

/**
 * Handles user interactions for clicks on gallery section
 * @param {Object} e target clicked on
 */
DIRECTORY.addEventListener('click', e => {
  if (e.target !== DIRECTORY && !modalIsOpen) {
    openModal(e.target);
  } else if (e.target.textContent === 'X') {
    closeModal(e.target);
  } else if (e.target.textContent === 'Prev') {
    cycleModalLeft();
  } else if (e.target.textContent === 'Next') {
    cycleModalRight();
  }
});

/**
 * Handles user interactions for clicks on search section
 */
SUBMIT.addEventListener('click', e => {
  search();
});

/**
 * Fetches data from RandomUser API, formats data into json, displays on screen
 * @param {URL} API providing random user data
 */
function fetchEmployees() {
  fetch(
    'https://randomuser.me/api/?results=12&inc=picture,name,location,email,phone,dob&noinfo&nat=US'
  )
    .then(response => response.json())
    .then(response => response.results)
    .then(createEmployeeElements);
}

/**
 * Takes given employee data and displays on screen
 * @param {Array} employeeList array of employees
 */
function createEmployeeElements(employeeList) {
  employeeList.forEach(employee => {
    const { name, picture, email, location } = employee;
    employee.id = employeeArray.length;
    employeeArray.push(employee);
    const employeeHTML = `<div class="card" data-index=${employee.id}>
                            <div class="card-img-container">
                                <img class="card-img" src=${picture.large} alt="profile picture">
                            </div>
                            <div class="card-info-container">
                                <h3 id="name" class="card-name cap">${name.first} ${name.last}</h3>
                                <p class="card-text">${email}</p>
                                <p class="card-text cap">${location.city}, ${location.state}</p>
                            </div>
                          </div>`;

    DIRECTORY.insertAdjacentHTML('beforeend', employeeHTML);
  });
}

/**
 * Displays modal window with more employee info
 * @param {Object} e selected employee or employee index
 */
function openModal(e) {
  if (modalIsOpen) {
    document.querySelector('.modal-container').remove();
    selectedEmployee = employeeArray[selectedEmployee.id + e];
  } else {
    selectedEmployee = e.closest('.card').getAttribute('data-index');
    modalIsOpen = true;
    selectedEmployee = employeeArray[selectedEmployee];
  }

  const {
    name,
    dob,
    phone,
    email,
    location: { city, street, state, postcode },
    picture,
  } = selectedEmployee;
  const birthday = new Date(dob.date);
  const modalHTML = `<div class="modal-container">
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src=${
                  picture.large
                } alt="profile picture">
                <h3 id="name" class="modal-name cap">
                    ${name.first} ${name.last}
                </h3>
                <p class="modal-text">
                    ${email}
                </p>
                <p class="modal-text cap">
                    ${city}, ${state}
                </p>
                <hr>
                <p class="modal-text">
                    ${phone}</p>
                <p class="modal-text">
                    ${street.number} ${
    street.name
  }, ${city}, ${state} ${postcode}
                </p>
                <p class="modal-text">Birthday:${birthday.getMonth()}/${birthday.getDate()}/${birthday.getFullYear()}</p>
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>
    </div>`;
  DIRECTORY.insertAdjacentHTML('beforeend', modalHTML);
}

/**
 * Closes modal
 */
function closeModal() {
  modalIsOpen = false;
  document.querySelector('.modal-container').remove();
}

/**
 * Shows previous employee
 */
function cycleModalLeft() {
  if (selectedEmployee.id !== 0) {
    openModal(-1);
  }
}

/**
 * Shows next employee
 */
function cycleModalRight() {
  if (selectedEmployee.id !== employeeArray.length - 1) {
    openModal(1);
  }
}

/**
 * Creates logic for search function
 */
function search() {
  const input = document.querySelector('#search-input').value.toLowerCase();
  let displayedEmployees = document.querySelectorAll('.card');
  displayedEmployees.forEach(employee => {
    let employeeText = employee.querySelector('.card-name').textContent;
    employeeText.toLowerCase().includes(input)
      ? (employee.style.display = '')
      : (employee.style.display = 'none');
  });
}
