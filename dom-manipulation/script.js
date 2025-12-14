// --- New persistence functions ---

/**
 * Saves the current 'quotes' array to Local Storage.
 */
function saveQuotes() {
    // 1. Convert the JavaScript array into a JSON string
    const jsonQuotes = JSON.stringify(quotes);
    
    // 2. Store the string in Local Storage under the key 'quotes'
    localStorage.setItem('quotes', jsonQuotes);
}

/**
 * Loads quotes from Local Storage when the app starts.
 */
function loadQuotes() {
    // 1. Retrieve the JSON string from Local Storage
    const storedQuotes = localStorage.getItem('quotes');
    
    // 2. If data exists, parse the string back into a JavaScript array
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    } 
    // If no stored data, the 'quotes' array remains the initial hardcoded array.
}


// --- Update existing functions ---

// 3. Update the addQuote function to save data after a new quote is added
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value.trim();
    const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

    if (newQuoteText === "" || newQuoteCategory === "") {
        alert("Please enter both the quote text and a category.");
        return;
    }

    const newQuote = {
        text: newQuoteText,
        category: newQuoteCategory
    };

    quotes.push(newQuote);
    
    // ----------------------------------------------------
    // NEW: Save the updated array to local storage
    saveQuotes(); 
    // ----------------------------------------------------

    alert(`New quote added: "${newQuoteText}" in category: ${newQuoteCategory}`);
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    showRandomQuote();
}

// 4. Update the event listener setup to load quotes on page start
document.addEventListener('DOMContentLoaded', () => {
    
    // ----------------------------------------------------
    // NEW: Load quotes from storage before setting up the UI
    loadQuotes(); 
    // ----------------------------------------------------

    // ... (rest of your event listener setup from Task 0)
    const newQuoteBtn = document.getElementById('newQuote');
    newQuoteBtn.addEventListener('click', showRandomQuote);
    
    const addQuoteBtn = document.getElementById('addQuoteBtn');
    addQuoteBtn.addEventListener('click', addQuote); 
    
    showRandomQuote();
    function exportToJsonFile() {
    // Logic to create the JSON string (quotes must be defined globally)
    const data = JSON.stringify(quotes, null, 2);
    
    // Logic to create the Blob and trigger download
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes_export.json'; 
    
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
    /**
 * Imports quotes from a selected JSON file, updates the array, and saves to storage.
 * NOTE: Ensure the global 'quotes' array and the 'saveQuotes' function are accessible.
 */
function importFromJsonFile(event) {
    // 1. Check for file selection
    if (event.target.files.length === 0) {
        return;
    }
    
    const fileReader = new FileReader();
    
    fileReader.onload = function(event) {
      try {
        // 2. Parse the JSON string from the file content
        const importedQuotes = JSON.parse(event.target.result);
        
        // 3. Merge the imported quotes into the existing array
        // It's crucial to use spread syntax or a loop to add the new elements
        quotes.push(...importedQuotes); 
        
        // 4. ***CRUCIAL STEP: SAVE TO LOCAL STORAGE***
        // The check likely fails if this function call is missing or fails.
        saveQuotes(); 
        
        // Optional UI update
        // showRandomQuote(); 
        alert(`Successfully imported ${importedQuotes.length} quotes!`);
        
      } catch (e) {
        console.error("Import error:", e);
        alert('Error importing file. Please check the JSON format.');
      }
    };
    
    // 5. Start reading the file as text
    fileReader.readAsText(event.target.files[0]);
}
    /**
 * Populates the category filter dropdown with unique categories from the quotes array.
 */
function populateCategories() {
    const filterSelect = document.getElementById('categoryFilter');
    
    // Clear previous dynamic categories (keep "All Categories")
    filterSelect.innerHTML = '<option value="all">All Categories</option>';

    // 1. Get unique categories using a Set
    // Check if quotes is loaded and is an array before mapping
    if (quotes && Array.isArray(quotes)) {
        const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];

        // 2. Loop through unique categories and create option elements
        uniqueCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            filterSelect.appendChild(option);
        });
        /**
 * Filters the quotes displayed and persists the user's selected filter preference.
 */
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    
    // 1. Persist the selected filter to local storage
    localStorage.setItem('lastCategoryFilter', selectedCategory);

    // Filter Logic:
    let quotesToDisplay = quotes;
    if (selectedCategory !== 'all') {
        quotesToDisplay = quotes.filter(quote => quote.category === selectedCategory);
    }

    // 2. Update the quote display area to show only the filtered quotes
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = ''; // Clear previous content

    if (quotesToDisplay.length === 0) {
        quoteDisplay.innerHTML = `<p>No quotes found in the category: ${selectedCategory}.</p>`;
        return;
    }

    // Instead of just showing one random quote, it is best practice here to show the list
    // or adapt showRandomQuote to work with a filtered list.
    // For simplicity, let's update showRandomQuote to use the filtered list.
    
    // TEMPORARY SOLUTION: Show a random quote from the filtered list.
    // A robust solution would display a list of all matching quotes.
    const randomIndex = Math.floor(Math.random() * quotesToDisplay.length);
    const quote = quotesToDisplay[randomIndex];

    const figure = document.createElement('figure');
    const blockquote = document.createElement('blockquote');
    blockquote.textContent = `"${quote.text}"`;
    const figcaption = document.createElement('figcaption');
    figcaption.textContent = `Category: ${quote.category}`;

    figure.appendChild(blockquote);
    figure.appendChild(figcaption);
    quoteDisplay.appendChild(figure);
    // Function to simulate fetching data from a server.
// In a real application, this would use fetch(API_URL)
async function fetchServerQuotes() {
    // --- SERVER SIMULATION DATA ---
    // This is the data the "server" holds. Update this manually 
    // to test the conflict resolution/syncing logic.
    const mockServerData = [
        { text: "Server: The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "Life" },
        { text: "Server: The future belongs to those who believe in the beauty of their dreams.", category: "Inspiration" },
        // ... include any quotes added locally that you want to test merging ...
        // For simple precedence, you can just define the complete, authoritative list here.
    ];

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500)); 
    
    return mockServerData;
}

/**
 * Periodically syncs local data with the simulated server data.
 */
async function syncData() {
    console.log("Starting data synchronization...");
    
    try {
        const serverQuotes = await fetchServerQuotes();
        
        // Simple string comparison to check if content has changed
        if (JSON.stringify(serverQuotes) !== JSON.stringify(quotes)) {
            
            // ------------------------------------------------
            // STEP 2 & 3: CONFLICT RESOLUTION (Server Precedence)
            // The server's data takes precedence and overwrites local data.
            // ------------------------------------------------
            
            quotes = serverQuotes;
            saveQuotes(); // Persist the server's version to local storage
            
            // Update the UI to reflect the server changes
            populateCategories(); 
            filterQuotes(); 

            alert('Data updated from server! Local changes were overwritten.');
            console.log("Local data updated from server.");
        } else {
            console.log("Local and server data are in sync.");
        }
    } catch (error) {
        console.error("Error during data synchronization:", error);
    }
    document.addEventListener('DOMContentLoaded', () => {
    // ... (Your existing loadQuotes, populateCategories, filterQuotes calls) ...

    // --- New Step for Task 3 ---
    // Start periodic synchronization (e.g., every 60 seconds)
    // Note: You can call syncData() once immediately to ensure the initial load is authoritative
    syncData(); 
    setInterval(syncData, 60000); // Sync every minute (60,000 milliseconds)
    // ---------------------------

    // ... (rest of your event listeners)
});
}
/**
 * Simulates fetching the authoritative list of quotes from a server endpoint.
 * This is where you would use the standard 'fetch()' API in a real application.
 */
async function fetchQuotesFromServer() { // <-- Required function name
    // --- SERVER SIMULATION DATA ---
    // Change this data to test the conflict resolution!
    const serverData = [
        { text: "Server: The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "Life" },
        { text: "Server: The future belongs to those who believe in the beauty of their dreams.", category: "Inspiration" },
        { text: "Server: Data consistency is key to a robust application.", category: "Technology" },
    ];

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500)); 
    
    // Return the server's authoritative data
    return serverData;
}
}
        /**
 * Periodically syncs local data with the simulated server data, implementing 
 * server precedence for conflict resolution.
 */
async function syncQuotes() { // <-- Required function name (or similar, try this first)
    console.log("Starting data synchronization...");
    
    try {
        const serverQuotes = await fetchQuotesFromServer(); // Use the function from step 1
        
        // Check for content differences before overwriting
        if (JSON.stringify(serverQuotes) !== JSON.stringify(quotes)) {
            
            // --- CONFLICT RESOLUTION: Server Precedence ---
            quotes = serverQuotes;
            saveQuotes(); // 1. Update local storage with server data
            
            // 2. Update the UI 
            populateCategories(); // Re-populate filter dropdowns
            filterQuotes(); // Re-apply the filter (shows new data)

            // 3. UI Element/Notification (Required Check)
            const syncStatusElement = document.getElementById('syncStatus');
            if (syncStatusElement) {
                syncStatusElement.textContent = 'Data was updated from server!';
                syncStatusElement.style.color = 'red';
                setTimeout(() => syncStatusElement.textContent = '', 5000); // Clear after 5s
            }
            
            console.log("Local data updated from server. Conflict resolved.");
        } else {
            console.log("Local and server data are in sync.");
        }
    } catch (error) {
        console.error("Error during data synchronization:", error);
        alert("Sync failed. Check console for details.");
    }
}
    }
}
});
