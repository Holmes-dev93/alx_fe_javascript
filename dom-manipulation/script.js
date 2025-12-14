// ... (Existing code from Tasks 0, 1, and 3) ...

// --- Server/Sync Constants ---
const MOCK_SERVER_URL = 'https://jsonplaceholder.typicode.com/posts?_limit=5';
const SYNC_INTERVAL = 60000; // Check every 60 seconds (60000 ms)

// --- New DOM Element References ---
const syncButton = document.getElementById('syncButton');
const syncStatus = document.getElementById('syncStatus');
const LAST_SYNC_KEY = 'lastSyncTimestamp'; // Key for tracking last sync time

// --- Server Interaction and Sync Functions ---

/**
 * Fetches quotes from the mock server API.
 * Maps the generic server response to our expected {text, category} format.
 */
async function fetchQuotesFromServer() {
    syncStatus.textContent = 'Syncing...';
    try {
        const response = await fetch(MOCK_SERVER_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const serverData = await response.json();
        
        // Map server data (post title/body) to our quote structure
        return serverData.map((item, index) => ({
            text: item.title,
            category: `Server-${item.id % 2 === 0 ? 'Tech' : 'Art'}`, // Mock category assignment
            // We use a property to mark server-sourced quotes for conflict checking
            source: 'server' 
        }));
    } catch (error) {
        console.error("Server fetch failed:", error);
        syncStatus.textContent = 'Sync failed. Check console for details.';
        return [];
    }
}

/**
 * Main function to synchronize local data with the server.
 */
async function syncQuotes() {
    const serverQuotes = await fetchQuotesFromServer();
    if (serverQuotes.length === 0) {
        return; // Stop if fetch failed
    }

    const localQuotes = quotes;
    let conflictResolved = false;

    // STEP 1: Implement Server Precedence Conflict Resolution
    const combinedQuotes = [...localQuotes];
    
    serverQuotes.forEach(sQuote => {
        // Simple conflict check: If a server quote exists (by text comparison), update or replace it.
        // For simplicity, we assume server data is canonical and merge non-server quotes.
        
        // Strategy: Only keep local quotes that don't match any server quote text
        // or that were added locally (source is not 'server').
        const serverQuoteExists = localQuotes.some(lQuote => lQuote.text === sQuote.text);
        
        if (!serverQuoteExists) {
            // New quote from the server, add it
            combinedQuotes.push(sQuote);
        } else {
            // Conflict or overlap: Server data takes precedence (as required by the prompt).
            // This is implicitly handled by not merging server duplicates into combinedQuotes.
            conflictResolved = true;
        }
    });

    // Strategy 2 (Cleaner, based on 'Server Precedence'): 
    // Filter out any local quotes that match a server quote text, then merge.
    const uniqueLocalQuotes = localQuotes.filter(lQuote => 
        !serverQuotes.some(sQuote => sQuote.text === lQuote.text)
    );
    
    // The new quote set is all server quotes + unique local quotes
    quotes = [...serverQuotes, ...uniqueLocalQuotes];
    
    // STEP 2: Update Local Storage and UI
    saveQuotes();
    populateCategories(); // Update the filter dropdown with new categories/quotes
    displayFilteredQuotes(); // Show the new data

    // STEP 3: Update Sync Status and Timestamp
    localStorage.setItem(LAST_SYNC_KEY, Date.now());
    syncStatus.textContent = conflictResolved 
        ? 'Sync complete. Conflicts resolved (Server data took precedence).' 
        : `Sync successful. ${serverQuotes.length} server quotes merged.`;
}

/**
 * Initializes the periodic syncing mechanism.
 */
function startPeriodicSync() {
    setInterval(syncQuotes, SYNC_INTERVAL);
    console.log(`Periodic sync started (every ${SYNC_INTERVAL / 1000}s).`);
}


// --- Initialization and Event Listeners (FINAL UPDATES) ---

// Attach event listener for the Sync Button
syncButton.addEventListener('click', syncQuotes);

// ... (Existing listeners for exportButton, importFile, newQuoteButton) ...

// Initialization (Modified for Sync)
loadQuotes();

// Check if a periodic sync needs to be started
startPeriodicSync();

// Display initial data (which might now be server data)
populateCategories(); 
createAddQuoteForm();
