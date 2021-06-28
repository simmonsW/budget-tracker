let db;

const request = indexedDB.open('budget_tracker', 1);

request.onupgradeneeded = function(event) {

  const db = event.target.result;
  db.createObjectStore('new_transaction', { autoIncrement: true });
};

request.onsuccess = function(event) {

  db = event.target.result;

  if (navigator.onLine) {
    uploadTransactions();
  };
};

request.onerror = function(event) {
  // log error here
  console.log(event.target.errorCode);
};

function saveRecord(transaction) {

  const transfer = db.transaction(['new_transaction'], 'readwrite');
  const transferObjectStore = transfer.objectStore('new_transaction');
  transferObjectStore.add(transaction);
};

function uploadTransactions() {

  const transfer = db.transaction(['new_transaction'], 'readwrite');
  const transferObjectStore = transfer.objectStore('new_transaction');
  const getAll = transferObjectStore.getAll();

  getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      fetch('/api/transaction', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(serverResponse => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }

          const transfer = db.transaction(['new_transaction'], 'readwrite');
          const transferObjectStore = transfer.objectStore('new_transaction');
          transferObjectStore.clear();

          alert('All saved transactions have been submitted');
        })
        .catch(err => {
          console.log(err);
        })
    }
  }
};

window.addEventListener('online', uploadTransactions);