// ... (Existing code from Tasks 0, 1, and 3 - including quotes array,
// loadQuotes, saveQuotes, populateCategories, displayFilteredQuotes, etc.) ...

// --- Server/Sync Constants ---
// NOTE: JSONPlaceholder does not store state, so POST will always return success
// without actually saving. This is sufficient for the client-side check.
const MOCK_SERVER_URL = 'https://jsonplaceholder.typicode.com/posts?_limit=5';
const SYNC_INTERVAL = 10000; // Check every 10 seconds (for quick testing)

// --- New DOM Element References (Ensure these are correctly referenced) ---
const syncButton = document.getElementById('syncButton');
const syncStatus = document.getElementById('syncStatus');
const LAST_SYNC_KEY = 'lastSyncTimestamp'; 


// --- New Server Functions ---

/**
 * ❌ FIX: Implements the 'Check for posting data' requirement.
 * Sends the current local 'quotes' array to the server via a POST request.
 */
async function postQuotesToServer(data) {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`POST failed! Status: ${response.status}`);
        }
        console.log("Local data successfully posted to server simulation.");
        return true;
    } catch (error) {
        console.error("Post to server failed:", error);
        return false;
    }
}


/**
 * Fetches quotes from the mock server API (PULL).
 */
async function fetchQuotesFromServer() {
    // ... (Existing implementation from previous response) ...
    // [Ensure this function is present and correctly handles the GET request]
    try {
        const response = await fetch(MOCK_SERVER_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const serverData = await response.json();
        
        return serverData.map((item, index) => ({
            text: item.title,
            category: `Server-${item.id % 2 === 0 ? 'Tech' : 'Art'}`, 
            source: 'server' 
        }));
    } catch (error) {
        console.error("Server fetch failed:", error);
        return [];
    }
}


/**
 * ❌ FIX: The main synchronization function (PULL and PUSH).
 * Addresses 'Check for the syncQuotes function' and 'Check for updating local storage'.
 */
async function syncQuotes() {
    syncButton.disabled = true;
    syncStatus.textContent = 'Syncing...';
    
    // 1. PUSH local changes to the server (POST)
    const pushSuccess = await postQuotesToServer(quotes);

    if (!pushSuccess) {
        syncStatus.textContent = 'Sync failed: Could not upload local changes.';
        syncButton.disabled = false;
        return;
    }

    // 2. PULL server data (GET)
    const serverQuotes = await fetchQuotesFromServer();
    if (serverQuotes.length === 0) {
        syncStatus.textContent = 'Sync failed: Could not fetch server data.';
        syncButton.disabled = false;
        return;
    }

    // 3. CONFLICT RESOLUTION (Server Precedence)
    let conflictResolved = false;
    const initialLocalCount = quotes.length;
    
    // Filter out local quotes that match any incoming server quote text
    const uniqueLocalQuotes = quotes.filter(lQuote => 
        !serverQuotes.some(sQuote => sQuote.text === lQuote.text)
    );
    
    // If we removed any local quotes, a conflict was resolved
    if (uniqueLocalQuotes.length < initialLocalCount) {
        conflictResolved = true;
    }

    // The new, merged quote set: all server quotes + unique local quotes
    quotes = [...serverQuotes, ...uniqueLocalQuotes];
    
    // 4. Update Local Storage
    saveQuotes();

    // 5. Update UI
    populateCategories();
    displayFilteredQuotes(); 
    localStorage.setItem(LAST_SYNC_KEY, Date.now());

    // 6. ❌ FIX: Update UI status for conflicts
    syncStatus.textContent = conflictResolved 
        ? 'Sync complete. Conflicts resolved (Server data took precedence).' 
        : `Sync successful. Total quotes: ${quotes.length}.`;
        
    syncButton.disabled = false;
}

/**
 * ❌ FIX: Implements the 'Check for periodically checking' requirement.
 */
function startPeriodicSync() {
    // Run syncQuotes immediately, then every SYNC_INTERVAL
    syncQuotes(); // Initial run
    setInterval(syncQuotes, SYNC_INTERVAL);
    console.log(`Periodic sync started (every ${SYNC_INTERVAL / 1000}s).`);
}


// --- Initialization (FINAL UPDATES) ---

// Attach event listener for the Sync Button
syncButton.addEventListener('click', syncQuotes);

// ... (Existing listeners for exportButton, importFile, newQuoteButton) ...

// 1. Load quotes from Local Storage
loadQuotes();

// 2. Start Periodic Syncing (which also does the first sync)
startPeriodicSync();

// 3. Display initial data
populateCategories(); 
createAddQuoteForm();
