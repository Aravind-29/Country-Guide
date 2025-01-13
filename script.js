let searchBtn = document.getElementById("search-btn");
let filterBtn = document.getElementById("filter-btn");
let countryInp = document.getElementById("country-inp");
let continentFilter = document.getElementById("continent-filter");
let letterFilter = document.getElementById("letter-filter");
let result = document.getElementById("result");


let allCountries = [];

fetch("https://restcountries.com/v3.1/all")
  .then((response) => response.json())
  .then((data) => {
    allCountries = data;

  
    let letters = new Set();
    data.forEach((country) => {
      let firstLetter = country.name.common.charAt(0).toUpperCase();
      letters.add(firstLetter);
    });
    Array.from(letters)
      .sort()
      .forEach((letter) => {
        let option = document.createElement("option");
        option.value = letter;
        option.textContent = letter;
        letterFilter.appendChild(option);
      });
  });

searchBtn.addEventListener("click", () => {
  let countryName = countryInp.value;
  let finalURL = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;
  fetch(finalURL)
    .then((response) => response.json())
    .then((data) => displayCountry(data))
    .catch(() => {
      result.innerHTML = `<h3>Please enter a valid country name.</h3>`;
    });
});

filterBtn.addEventListener("click", () => {
  let selectedContinent = continentFilter.value;
  let selectedLetter = letterFilter.value;

  let filteredCountries = allCountries.filter((country) => {
    let matchesContinent =
      !selectedContinent || country.continents[0] === selectedContinent;
    let matchesLetter =
      !selectedLetter || country.name.common.startsWith(selectedLetter);
    return matchesContinent && matchesLetter;
  });

  if (filteredCountries.length > 0) {
    displayCountry(filteredCountries);
  } else {
    result.innerHTML = `<h3>No countries match the filters.</h3>`;
  }
});

function displayCountry(countries) {
  result.innerHTML = "";
  countries.forEach((country) => {
    result.innerHTML += `
      <div class="country-card">
        <img src="${country.flags.svg}" class="flag-img">
        <h2>${country.name.common}</h2>
        <div class="wrapper">
          <div class="data-wrapper">
            <h4>Capital:</h4>
            <span>${country.capital ? country.capital[0] : "N/A"}</span>
          </div>
          <div class="data-wrapper">
            <h4>Continent:</h4>
            <span>${country.continents[0]}</span>
          </div>
          <div class="data-wrapper">
            <h4>Population:</h4>
            <span>${country.population}</span>
          </div>
          <div class="data-wrapper">
            <h4>Currency:</h4>
            <span>${
              country.currencies
                ? country.currencies[Object.keys(country.currencies)[0]].name
                : "N/A"
            }</span>
          </div>
          <div class="data-wrapper">
            <h4>Common Languages:</h4>
            <span>${country.languages ? Object.values(country.languages).join(", ") : "N/A"}</span>
          </div>
        </div>
      </div>
    `;
  });
}
