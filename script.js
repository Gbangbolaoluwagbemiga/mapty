'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

// starting section 15 all over again
navigator.geolocation.getCurrentPosition(
  function (pos) {
    const { latitude } = pos.coords;
    const { longitude } = pos.coords;

    console.log(`https://www.google.com/maps/@${latitude},${longitude},12z`);
  },
  function () {
    alert(`Error 2023`);
  }
);

// if (navigator.geolocation)
//   navigator.geolocation.getCurrentPosition(
//     function (pos) {
//       const { latitude } = pos.coords;
//       const { longitude } = pos.coords;
//       // console.log(latitude, longitude);
//       // console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
//       const coord = [latitude, longitude];

//       const map = L.map('map').setView(coord, 13);

//       L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
//         attribution:
//           '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//       }).addTo(map);

//       L.marker(coord)
//         .addTo(map)
//         .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
//         .openPopup();
//     },
//     function () {
//       alert(`Could not access your location`);
//       // console.log(`Haaa`);
//     }
//   );
