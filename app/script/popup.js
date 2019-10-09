
$(() => {
    $('[data-toggle="tooltip"]').tooltip()

    const background = chrome.extension.getBackgroundPage()
    background.popup.getAccountInfo().then(({balance}) => {
        const decimalPart = ("000000" + balance).substr(-6)
        const integerPart = balance.substring(0, balance.length - 6)
        $("#balance").text(`${integerPart}.${decimalPart}`)
    })
    background.popup.getTransactions().then(({transactions}) => {
        $(".transactions-container > div").each((index, element) => {
            $(element).text(transactions[index])
        })
    })
    const {address, endPoint} = background.popup.getAccountStaticInfo()
    $(".text-address").text(address)
    $("#end-point").text(endPoint)

    $("#more-transactions").on('click', (event) => {
        event.preventDefault()
        chrome.tabs.create({
            url: `${endPoint}/account/${address.replace(/-/g, '')}/transactions`,
            active: true,
        })
    })

    $("#copy-address-button").on('click', () => {
        const elm = document.getElementById('copy-address')
        const selection = window.getSelection()
        const range = document.createRange()
        range.selectNodeContents(elm)
        selection.removeAllRanges()
        selection.addRange(range)
        document.execCommand('copy')
        selection.removeAllRanges()
    })
})