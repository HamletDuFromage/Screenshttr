function sanitizeFilename(filename) {
    const illegalCharsRegex = /[\\/:"*?<>|]/g;
    filename = filename.replace(/^https?:\/\//, '');
    return filename.replace(illegalCharsRegex, '_');
}

function onCaptured(imagedata, url) {
    const date = new Date()
    const filename = `${date.toISOString().split('T')[0]}_${sanitizeFilename(url)}.png"`

    fetch(imagedata).then(res => res.blob()).then((blob) => {
        // hacky but downloads.download() won't work
        let a = document.createElement("a");
        let url = URL.createObjectURL(blob);
        a.style.display = "none";
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url)
        document.body.removeChild(a);
    });
}

function onError(error) {
    console.log(`Error: ${error}`);
}

function getCurrentWindowTabs() {
    return browser.tabs.query({ currentWindow: true });
}

function captureTabs(all = true) {
    getCurrentWindowTabs().then((tabs) => {
        for (let tab of tabs) {
            if (!all && !tab.active) continue
            let capturing = browser.tabs.captureTab(tab.id)
            capturing.then((imagedata) => {
                onCaptured(imagedata, tab.url);
            }, onError);
        }
    });
}

document.getElementById('scr_all').onclick = () => {
    captureTabs(true)
};

document.getElementById('scr_active').onclick = () => {
    captureTabs(false)
};
