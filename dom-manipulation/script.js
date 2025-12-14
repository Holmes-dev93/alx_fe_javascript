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
    }
}
});
