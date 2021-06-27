let db;

const request = indexedDB.open('budget_tracker', 1);

request.onupgradeneeded = function(event) {
  // save a reference to the database
  const db = event.target.result;
  // create an object store (table) called `new_pizza`, set it to have an auto incrementing primary key of sorts 
  db.createObjectStore('new_transaction', { autoIncrement: true });
};

request.onsuccess = function(event) {
  // when db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection, save reference to db in global variable
  db = event.target.result;

  // check if app is online, if yes run uploadTransactions() function to send all local db data to api
  if (navigator.onLine) {
    // uploadTransactions();
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