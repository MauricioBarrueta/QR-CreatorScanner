const scannerContainer = document.querySelector('.scanner'), scanQrForm = document.querySelector('.read-qr')
const inputFile = document.getElementById('upload-qr'), uploadStatus = document.getElementById('upload-status'),
    uploadedQrContent = document.querySelector('.qr-scanner input')
const copyUrlBtn = document.getElementById('btn-copy'), clearContent = document.getElementById('btn-clear-scan')
const originalUploadText = uploadStatus.innerText

/* Se hace la petición a la api obteniendo la información del código QR cargado */
const apiURL = 'https://api.qrserver.com/v1/read-qr-code/'
const fetchQrCodeData = (file, qrFileData) => {
    uploadStatus.innerText = 'Escaneando código...'
    fetch(apiURL, { method: 'POST', body: qrFileData })
        .then(res => res.json())
        .then(data => {
            data = data[0].symbol[0].data
            console.log(data)
            uploadStatus.innerText = data ? 'Sube el código para escanear' : 'Error al cargar archivo'
            if(data) {
                uploadedQrContent.value = data
                scanQrForm.querySelector('img').src = URL.createObjectURL(file)
                scannerContainer.classList.add('active')
            } else { return }            
        }).catch(() => {
            uploadStatus.innerText = 'Error al cargar archivo'
            copyUrlBtn.classList.add('disabled')
    });
}

/* Se obtiene la información del archivo cargado y se le manda a la petición */
const getQrFileData = async (fileData) => {
    uploadStatus.innerText = originalUploadText

    let file = fileData.target.files[0]
    if (file) {
        let formData = new FormData()
        formData.append('file', file)
        fetchQrCodeData(file, formData)
        copyUrlBtn.classList.remove('disabled')
    }
};

inputFile.addEventListener('change', getQrFileData)

/* Se llama al método 'click()' del input tipo 'file' al dar clic sobre el formulario */
scanQrForm.addEventListener('click', () => {
    uploadStatus.innerHTML = 'Espere un momento...'
    inputFile.click()
});

/* Resetea el texto después de que se seleccionó un archivo */
window.addEventListener('focus', () => {
    uploadStatus.innerText = originalUploadText
});

copyUrlBtn.addEventListener('click', () => {
    uploadedQrContent.select();
    uploadedQrContent.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(uploadedQrContent.value) 
});

clearContent.addEventListener('click', () => {
    scannerContainer.classList.remove('active')
    uploadedQrContent.value = ''
    copyUrlBtn.classList.add('disabled')
})