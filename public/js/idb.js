let idb;
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = ((event) => {
    const idb = event.target.result;
    idb.createObjectStore("pending", {autoIncrement: true});
});

request.onsuccess = ((event) => {
    idb = event.target.result;
    if (navigator.onLine) {
        checkDatabase();
    }
});

request.onerror = ((event) => [
    console.log("oops" + event.target.errorCode);
]);

//when the app is offline this will save budget changes

function saveRecord(record) {
    const transaction = idb.transaction("pending", "readWrite");
    const store = transaction.objectStore("pending");
    const getAll = store.getAll();

    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch("/api/transaction", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    accept: "application/json, text/plain, */*",
                    "content-type": "application/json"
                }
            })
            .then(response => response.json())
            .then(() => {
                const transaction = idb.transaction("pending", "readWrite");
                const store = transaction.objectStore("pending");
                store.clear();
            });
        }
        function deletePending() {
            const transaction = db.transaction("pending", "readWrite");
            const store = transaction.objectStore("pending");
            store.clear():
        };
    };
};

window.addEventListener("online", checkDatabase);