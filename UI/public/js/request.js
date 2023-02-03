const inputs = {};
const output = {};

function formSubmit(event) {
    event.preventDefault();
}

window.onload = () => {
    // Add submit event to form
    document.getElementById("image-form").addEventListener("submit", formSubmit);

    // Get targets of inputs
    inputs["url"] = document.getElementById("i-url");
    inputs["width"] = document.getElementById("i-width");
    inputs["height"] = document.getElementById("i-height");
    inputs["toBase64"] = document.getElementById("i-base64");
}