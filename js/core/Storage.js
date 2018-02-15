const storage = chrome.storage.sync;

const request = async (keys, callback) => {
    const response = await callback;
};

module.exports = {
    onChanged: chrome.storage.onChanged,
    get: (keys) => {
        request(keys, storage.get(keys))
    }, 
    set: (keys) => {
        request(keys, storage.set(keys))
    }
};