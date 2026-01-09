const generatedQrContainer = document.querySelector('#qr-code'), qrContainerInfo = document.querySelector('#qr-code span')
const qrSize = document.querySelector('.qr-size'), qrBgColor = document.querySelector('#qr-bg-color'), 
    qrColor = document.querySelector('#qr-color'), qrUrl = document.querySelector('#qr-text')
const downloadQrButton = document.getElementById('btn-download'), clearQrButton = document.getElementById('btn-clear-qr')
const scannerQrUrlText = document.querySelector('#uploaded-qr-text') // Scanner

const resetValues = () => {
    qrSize.selectedIndex = 2
    qrUrl.value = '', scannerQrUrlText.value = ''
    qrUrl.focus()
    qrColor.value = '#000',  qrBgColor.value = '#FFF'
    downloadQrButton.classList.add('disabled')    

    /* Scanner */
    copyUrlBtn.classList.add('disabled')
}

window.onload = () => { resetValues() }

/* Opciones requeridas por defecto de la librería qrcode.js */
const defUrl = ''
let colorLight = '#fff', colorDark = '#000', text = defUrl, defSize = 152

qrSize.addEventListener('change', (sizeVal) => {
    defSize = sizeVal.target.value
    generateQrCode()
})

qrBgColor.addEventListener('input', (bgColor) => {
    colorLight = bgColor.target.value
    generateQrCode()
})

qrColor.addEventListener('input', (color) => {
    colorDark = color.target.value
    generateQrCode()
})

qrUrl.addEventListener('input', (textValue) => {
    const urlValue = textValue.target.value
    text = urlValue
    if (!urlValue) text = defUrl
    generateQrCode()

    if(text.length === 0) {
        const spanText = document.createElement('span')
        spanText.classList.add('span-text')
        spanText.textContent = 'El código se mostrará aquí'
        generatedQrContainer.appendChild(spanText)
        downloadQrButton.classList.add('disabled')
    } 
})

/* Se asignan los valores de las variables a las opciones predefinidas por la librería para generar el QR */
var qrcode
async function generateQrCode() {
    generatedQrContainer.innerHTML = ''
    downloadQrButton.classList.remove('disabled')
    qrcode = new QRCode("qr-code", {
        text,
        height: defSize,
        width: defSize,
        colorLight,
        colorDark,
        correctLevel : QRCode.CorrectLevel.H
    });
    downloadQrButton.href = await qrUrlToFile();
}

/* Objeto que devuelve el archivo del código QR para descargarlo */
function qrUrlToFile() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const img = document.querySelector('#qr-code img')
            if (img.currentSrc) {
                resolve(img.currentSrc)
                img.style.backgroundColor = 'white'                
                return
            }
            const canvas = document.querySelector('canvas')            
            resolve(canvas.toDataURL())
        }, 50);
    });
}

/* Borra el código QR generado */
clearQrButton.addEventListener('click', () => {
    qrcode.clear();
    generatedQrContainer.innerHTML = ''
    resetValues()
})