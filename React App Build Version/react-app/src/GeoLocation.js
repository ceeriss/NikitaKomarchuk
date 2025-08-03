// src/utils/GeoLocation.js
export const getCountryCode = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return data.country;
  } catch (error) {
    console.error('Error detecting country:', error);
    return null;
  }
};

export const isCISCountry = (countryCode) => {
  const cisCountries = ['RU', 'BY', 'KZ', 'AM', 'AZ', 'KG', 'MD', 'TJ', 'TM', 'UZ', 'UA'];
  return cisCountries.includes(countryCode);
};