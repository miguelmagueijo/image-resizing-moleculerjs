// Port must be changed if you changed it in api.service.js
const URL_STRING = "http://127.0.0.1:3000/api/image"

const inputs = {};
const output = {};

function formSubmit(event) {
    event.preventDefault();
    const API_URL = new URL(URL_STRING);

    if (inputs.url.value.length > 0)
        API_URL.searchParams.append("url", inputs.url.value);

    if (inputs.width.value.length > 0)
        API_URL.searchParams.append("width", inputs.width.value);

    if (inputs.height.value.length > 0)
        API_URL.searchParams.append("height", inputs.height.value);
    
    API_URL.searchParams.append("base64", inputs.toBase64.checked);

    fetch(API_URL.toString())
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        output.code.innerHTML = JSON.stringify(data, undefined, 2);
        output.div.classList.remove("is-hidden");
    })
    .catch((error) => {
        console.error(error);
    })
}

window.onload = () => {
    // Add submit event to form
    document.getElementById("image-form").addEventListener("submit", formSubmit);

    // Get targets of inputs
    inputs["url"] = document.getElementById("i-url");
    inputs["width"] = document.getElementById("i-width");
    inputs["height"] = document.getElementById("i-height");
    inputs["toBase64"] = document.getElementById("i-base64");

    // Get targets of output
    output["div"] = document.getElementById("result-div");
    output["code"] = document.getElementById("result-code");

    // Add event to button that copies result
    document.getElementById("result-copy").addEventListener("click", (event) => {
        navigator.clipboard.writeText(output.code.innerHTML);
    });

    // Add event to button that hides output
    document.getElementById("result-hide").addEventListener("click", () => { output.div.classList.add("is-hidden"); });
}