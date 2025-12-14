// Global variable for the quote data.
// We remove the hardcoded initial data here because it will be loaded or set below.
let quotes = []; 

// The key used for Local Storage
const STORAGE_KEY = 'quotesData';

// --- Web Storage Functions ---

/**
 * Loads the quotes array from Local Storage. If no data exists, 
 * it initializes the array with default quotes.
 */
function loadQuotes() {
    const storedQuotes = localStorage.getItem(STORAGE_KEY);
    
    if (storedQuotes) {
        // Parse the JSON string back into a JavaScript array
        try {
            quotes = JSON.parse(storedQuotes);
        } catch (e) {
            console.error("Error parsing stored quotes:", e);
            // Fallback to default if stored data is corrupted
            initializeDefaultQuotes();
        }
    } else {
        // No data in Local Storage, initialize with defaults
        initializeDefaultQuotes();
    }
}

/**
 * Helper function to set the default quotes if storage is empty or corrupted.
 */
function initializeDefaultQuotes() {
    quotes = [
        { text: "The only way to do great work is to love what you do.", category: "Work" },
        { text: "Strive not to be a success, but rather to be of value.", category: "Life" },
        { text: "The mind is everything. What you think you become.", category: "Philosophy" },
        { text: "Life is what happens when you're busy making other plans.", category: "Life" },
        { text: "Get busy living or get busy dying.", category: "Motivation" }
    ];
    // Immediately save the defaults so they are available next time
    saveQuotes(); 
}


/**
 * Saves the current 'quotes' array to Local Storage as a JSON string.
 */
function saveQuotes() {
    try {
        // Convert the JavaScript array into a JSON string before saving
        localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
        console.log("Quotes saved to Local Storage.");
    } catch (e) {
        console.error("Error saving quotes to Local Storage:", e);
    }
}


// --- Core Functions (Updated) ---

/* * showRandomQuote function remains the same as Task 0, 
 * as it only reads the 'quotes' array.
 */
function showRandomQuote() {
    // ... (Your existing implementation from Task 0) ...
    // ensure this logic remains in your final script.js
    if (quotes.length === 0) {
        quoteDisplay.innerHTML = '<p>No quotes available. Add one!</p>';
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    
    quoteDisplay.innerHTML = '';
    const quoteTextElement = document.createElement('p');
    quoteTextElement.textContent = `"${quote.text}"`;
    quoteTextElement.classList.add('quote-text'); 

    const quoteCategoryElement = document.createElement('span');
    quoteCategoryElement.textContent = `- Category: ${quote.category}`;
    quoteCategoryElement.classList.add('quote-category'); 

    quoteDisplay.appendChild(quoteTextElement);
    quoteDisplay.appendChild(quoteCategoryElement);
}

/**
 * Handles the logic for adding a new quote from the form input.
 * MODIFIED to call saveQuotes()
 */
function addQuote() {
    const textInput = document.getElementById('newQuoteText');
    const categoryInput = document.getElementById('newQuoteCategory');

    const newText = textInput.value.trim();
    const newCategory = categoryInput.value.trim();

    if (newText === '' || newCategory === '') {
        alert('Please enter both a quote and a category.');
        return;
    }

    const newQuote = {
        text: newText,
        category: newCategory
    };
    quotes.push(newQuote);
    
    // **NEW STEP 1: Save the updated array to Local Storage**
    saveQuotes();

    alert(`Quote added successfully! Total quotes: ${quotes.length}`);
    textInput.value = '';
    categoryInput.value = '';
    
    showRandomQuote();
}

// ... (Your existing createAddQuoteForm function remains the same) ...

// --- Event Listeners and Initialization (MODIFIED) ---

// 1. Attach event listener (Remains the same)
newQuoteButton.addEventListener('click', showRandomQuote);

// 2. **NEW INITIALIZATION ORDER:**
// a. Load the quotes from storage first.
loadQuotes();

// b. Display an initial random quote.
showRandomQuote(); 

// c. Dynamically create and show the form.
createAddQuoteForm();

// Note: The references to quoteDisplay and newQuoteButton need to be 
// defined before they are used (at the top of your script).
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
