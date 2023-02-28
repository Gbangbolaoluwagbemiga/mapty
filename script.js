'use strict';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class workout {
  clicks = 0;
  date = new Date();
  id = (Date.now() + '').slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }

  _setDescription() {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}
    `;
  }

  click() {
    this.clicks++;
  }
}

class Run extends workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycle extends workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

// const run = new Run();
// const cycle = new Cycle();
// console.log(run, cycle);

//////////////////////////
// Application structure
class App {
  // Global variable
  #map;
  #mapEvent;
  #mapZoomLevel = 13;
  #workouts = [];

  constructor() {
    this._getPosition();
    this._getLocalStorage();
    inputType.addEventListener('change', this._toggleElevationField);
    form.addEventListener('submit', this._newWorkout.bind(this));
    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert(`Error 2023`);
        }
      );
  }

  _loadMap(pos) {
    const { latitude } = pos.coords;
    const { longitude } = pos.coords;
    const coords = [latitude, longitude];

    // console.log(`https://www.google.com/maps/@${latitude},${longitude},12z`);
    this.#map = L.map('map').setView(coords, this.#mapZoomLevel);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // This work exactly like an event listener but it's from the library
    this.#map.on('click', this._showForm.bind(this));

    this.#workouts.forEach(work => {
      this.workoutMarker(work);
    });
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _hideform() {
    // clear the field
    inputCadence.value =
      inputDistance.value =
      inputDuration.value =
      inputElevation.value =
        '';
    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 1000);
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    // console.log(inputType.value);
  }

  _newWorkout(e) {
    e.preventDefault();

    const validation = (...numbers) => numbers.every(no => Number.isFinite(no));
    const positiveNo = (...numbers) => numbers.every(no => no > 0);
    const notEmpty = (...numbers) => numbers.every(no => no !== 0);

    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    // when type is running
    if (type === 'running') {
      const cadence = +inputCadence.value;
      // console.log('hi');
      if (
        !validation(distance, duration, cadence) ||
        !positiveNo(distance, duration, cadence) ||
        !notEmpty(distance, duration, cadence)
      )
        return alert(
          'input has to be a positive number and all input field must be filled'
        );
      workout = new Run([lat, lng], distance, duration, cadence);
      this.#workouts.push(workout);
      // console.log(`${this.#workouts}`);
    }

    // when type is cycling
    if (type === 'cycling') {
      // console.log('hey');
      const elevation = +inputElevation.value;
      if (
        !validation(distance, duration, elevation) ||
        !positiveNo(distance, duration) ||
        !notEmpty(distance, duration, elevation)
      )
        return alert(
          'input has to be a positive number and all input field must be filled'
        );
      workout = new Cycle([lat, lng], distance, duration, elevation);
      this.#workouts.push(workout);
      // console.log(`${this.#workouts}`);
    }

    this._hideform();
    this.workoutMarker(workout);
    this._renderWorkout(workout);
    this._setLocalStorage();
  }

  workoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        // Customization of the popup
        L.popup({
          maxWidth: 250,
          minwidth: 100,
          maxHeight: 30,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
      )
      .openPopup();
  }

  _renderWorkout(workout) {
    let html = `
     <li class="workout workout--${workout.type}" data-id="${workout.id}">
    <h2 class="workout__title">${workout.description}</h2>
    <div class="workout__details">
          <span class="workout__icon">${
            workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
          }</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
    </div>

          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>
 
    `;
    if (workout.type === 'running') {
      html += `
  <div class="workout__details">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value">${workout.pace.toFixed(1)}</span>
      <span class="workout__unit">min/km</span>
  </div>
  <div class="workout__details">
      <span class="workout__icon">🦶🏼</span>
      <span class="workout__value">${workout.cadence.toFixed(1)}</span>
      <span class="workout__unit">spm</span>
  </div>
  </li>`;
    }

    if (workout.type === 'cycling') {
      html += `
      <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.speed.toFixed(1)}</span>
          <span class="workout__unit">km/h</span>
    </div>
    <div class="workout__details">
          <span class="workout__icon">⛰</span>
          <span class="workout__value">${workout.elevationGain.toFixed(
            1
          )}</span>
          <span class="workout__unit">m</span>
    </div>
  </li>`;
    }
    form.insertAdjacentHTML('afterend', html);
  }
  _moveToPopup(e) {
    const workoutEl = e.target.closest('.workout');
    if (!workoutEl) return;

    const workingOut = this.#workouts.find(
      work => work.id === workoutEl.dataset.id
    );
    console.log(workingOut);

    this.#map.setView(workingOut.coords, this.#mapZoomLevel, {
      animate: true,
      pan: { duration: 1 },
    });
    // workingOut.click();
  }

  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));
    if (!data) return;
    this.#workouts = data;

    this.#workouts.forEach(work => {
      this._renderWorkout(work);
    });
  }

  reset() {
    localStorage.removeItem('workouts');
    location.reload();
  }
}

const app = new App();
