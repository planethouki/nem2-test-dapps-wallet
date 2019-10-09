$('#button').on('click', function(){
    console.log('button clicked')
    const background = chrome.extension.getBackgroundPage()
    $('#counter').text(background.fromPopup())
});
