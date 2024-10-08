let zipCode;
let zipCodeInput; //variable containing a valid postal code


function formInput() {
    zipCode = document.getElementById('zipCode').value;

    if(/^([1-9][1-8]){1}([0-9]){3}$/.test(zipCode)){
        zipCodeInput = zipCode;
    }
}