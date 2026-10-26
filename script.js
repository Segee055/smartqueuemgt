// ===== Data =====
let waitingQueue = [];   // tickets waiting to be served
let skippedList = [];    // tickets that were skipped
let ticketCounter = 0;   // last ticket number given out
let servedCount = 0;     // how many customers have been called
let nowServing = null;   // the ticket being served (null = nobody)

// ===== Page elements =====
const nowServingEl = document.getElementById("now-serving");
const waitingCountEl = document.getElementById("waiting-count");
const servedCountEl = document.getElementById("served-count");
const waitingListEl = document.getElementById("waiting-list");
const skippedListEl = document.getElementById("skipped-list");
const emptyMessageEl = document.getElementById("empty-message");
const skippedEmptyEl = document.getElementById("skipped-empty");
const messageEl = document.getElementById("message");

const takeNumberBtn = document.getElementById("take-number-btn");
const callNextBtn = document.getElementById("call-next-btn");
const skipBtn = document.getElementById("skip-btn");
const resetBtn = document.getElementById("reset-btn");

// ===== Queue functions =====

// Create a ticket like "A001", "A002", ...
function generateTicket() {
  ticketCounter++;
  return "A" + String(ticketCounter).padStart(3, "0");
}

// Add a new customer to the end of the queue
function takeNumber() {
  const ticket = generateTicket();
  waitingQueue.push(ticket);
  showMessage("Ticket " + ticket + " issued.");
  updateUI();
}

// Move the first waiting customer to "Now Serving"
function callNext() {
  if (waitingQueue.length === 0) {
    showMessage("There is no one to call.");
    return;
  }
  nowServing = waitingQueue.shift();
  servedCount++;
  showMessage("Now calling " + nowServing + ".");
  updateUI();
}

// Move the first waiting customer to the skipped list
function skipCustomer() {
  if (waitingQueue.length === 0) {
    showMessage("There is no one to skip.");
    return;
  }
  const skipped = waitingQueue.shift();
  skippedList.push(skipped);
  showMessage("Ticket " + skipped + " was skipped.");
  updateUI();
}

// Clear everything and start a new session
function resetQueue() {
  const confirmed = confirm("Are you sure you want to reset the queue?");
  if (!confirmed) {
    return;
  }
  waitingQueue = [];
  skippedList = [];
  ticketCounter = 0;
  servedCount = 0;
  nowServing = null;
  showMessage("Queue reset. New session started.");
  updateUI();
}

// ===== Screen functions =====

// Show a short message to the user
function showMessage(text) {
  messageEl.textContent = text;
}

// Redraw everything on the page from the current data
function updateUI() {
  // Now Serving
  nowServingEl.textContent = nowServing ? nowServing : "---";

  // Statistics
  waitingCountEl.textContent = waitingQueue.length;
  servedCountEl.textContent = servedCount;

  // Waiting list
  waitingListEl.innerHTML = "";
  for (let i = 0; i < waitingQueue.length; i++) {
    const li = document.createElement("li");
    li.textContent = (i + 1) + ". " + waitingQueue[i];
    waitingListEl.appendChild(li);
  }
  emptyMessageEl.style.display = waitingQueue.length === 0 ? "block" : "none";

  // Skipped list
  skippedListEl.innerHTML = "";
  for (let i = 0; i < skippedList.length; i++) {
    const li = document.createElement("li");
    li.textContent = skippedList[i];
    skippedListEl.appendChild(li);
  }
  skippedEmptyEl.style.display = skippedList.length === 0 ? "block" : "none";

  // Disable buttons that make no sense right now
  callNextBtn.disabled = waitingQueue.length === 0;
  skipBtn.disabled = waitingQueue.length === 0;
}

// ===== Event listeners =====
takeNumberBtn.addEventListener("click", takeNumber);
callNextBtn.addEventListener("click", callNext);
skipBtn.addEventListener("click", skipCustomer);
resetBtn.addEventListener("click", resetQueue);

// Draw the page for the first time
updateUI();
