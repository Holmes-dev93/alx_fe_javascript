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
});
