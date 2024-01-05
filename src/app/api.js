// function to use fetch in the browser to get a list of thing types
const getThingTypes = () => {
  return fetch('/thing_type')
    .then(response => response.json())
}
