chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.windows.create({
    'url': chrome.extension.getURL('popup.html'),
    'type': 'popup',
    'width': 350,
    'height': 400,
    'left': Math.round((screen.width / 2) - (350 / 2)),
    'top': Math.round((screen.height / 2) - (400 / 2))
  });
});
