import './css/styles.css'
import { Notify } from 'notiflix'
import debounce from 'lodash.debounce'
import { fetchCountries } from './fetchCountries'

const DEBOUNCE_DELAY = 300;
const WARNING_MASSAGE = "Too many matches found. Please enter a more specific name.";
const ERROR_MASSAGE = "Oops, there is no country with that name";
const OPTIONS_NOTIFLIX = {
    width: "430px",
    fontSize: "25px",
};

const input = document.querySelector("input#search-box")
const countryList = document.querySelector("ul.country-list")
const countryInfo = document.querySelector("div.country-info")

function clearCountryList() {
    countryList.innerHTML = ''
}

function clearCountryInfo() {
    countryInfo.innerHTML = ''
}

input.addEventListener("input", debounce(onInputChange, DEBOUNCE_DELAY))

function onInputChange(evt) {
    let inputValue = evt.target.value.toLowerCase().trim()

    if (!inputValue) {
        Notify.info("You didn't enter anything", OPTIONS_NOTIFLIX)

        clearCountryList()
        clearCountryInfo()
        return
    }
    if (inputValue !== ' ') {

        fetchCountries(inputValue)
            .then((response) => {
                if (!response.ok || response.status === 404) {
                    throw new Error(response.status)
                }
                return response.json()
            })
            .then((countries) => {

                if (countries.length > 10) {
                    Notify.info(WARNING_MASSAGE, OPTIONS_NOTIFLIX)
                    return
                }

                if (countries.length >= 2 && countries.length <= 10) {
                    Notify.success("Successful request to the server", OPTIONS_NOTIFLIX)
                    clearCountryInfo()
                    renderUlCountry(countries)
                }

                if (countries.length === 1) {
                    Notify.success("Successful request to the server", OPTIONS_NOTIFLIX)
                    clearCountryList()
                    renderDivCountry(countries)
                }
            })
            .catch(error => {
                Notify.failure(ERROR_MASSAGE, OPTIONS_NOTIFLIX)
                clearCountryList()
                clearCountryInfo()
            })
    }
}


function renderUlCountry(countries) {
    countryList.innerHTML = countries.map(({ flags, name }) =>
        `
      <li>
      <img
      src="${flags.svg}"
      alt="${name.official}"
      width="60"
      height="40">
      <p>${name.official}</p>
      </li>
      `
    ).join('')
}

function renderDivCountry(countries) {

    countryInfo.innerHTML = countries.map(({ flags, name, capital, population, languages }) =>
        `
      <img src="${flags.svg}" alt="${name.official}" width="60" height="40">
      <h1 class="country-name">${name.official}</h1>
      <p>
      <span>Capital: </span>${capital}
      </p>
      <p>
      <span>Population: </span>${population} humans
      </p>
      <p>
      <span>Languages: </span>${Object.values(languages).join(", ")}
      </p>
    `
    ).join("")
}