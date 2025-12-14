// --- Global Data Store ---
let quotes = []; 

// The key used for Local Storage persistence
const STORAGE_KEY = 'quotesData';

// --- DOM Element References (Must be defined early) ---
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');


// --- Default Data (Used only if Local Storage is empty) ---
const defaultQuotes = [
    { text: "The only way to do great work is to love what you do.", category: "Work" },
    { text: "Strive not to be a success, but rather to be of value.", category: "Life" },
    { text: "The mind is everything. What you think you become.", category: "Philosophy" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Get busy living or get busy dying.", category: "Motivation" }
];


// --- Web Storage Functions (The focus of Task 1) ---

/**
 * Saves the current 'quotes' array to Local Storage.
 * It converts the JS Object into a JSON string using JSON.stringify().
 */
function saveQuotes() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
        console.log("Quotes saved to Local Storage.");
    } catch (e) {
        console.error("Error saving quotes to Local Storage:", e);
    }
}

/**
 * Loads the quotes array from Local Storage on application startup.
 * It converts the JSON string back to a JS Object using JSON.parse().
 */
function loadQuotes() {
    const storedQuotes = localStorage.getItem(STORAGE_KEY);
    
    if (storedQuotes) {
        try {
            // Restore the data from the JSON string
            quotes = JSON.parse(storedQuotes);
        } catch (e) {
            console.error("Error parsing stored quotes. Using default data.", e);
            quotes = defaultQuotes;
            saveQuotes(); // Save defaults in place of corrupted data
        }
    } else {
        // No data found in Local Storage, initialize with defaults
        quotes = defaultQuotes;
        saveQuotes();
    }
}


// --- Core Functions (Task 0 functions MODIFIED for persistence) ---

/**
 * Displays a random quote.
 */
function showRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.innerHTML = '<p>No quotes available. Add one!</p>';
        return;
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    // Clear and create dynamic elements
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
 * Creates and inserts the dynamic form for adding new quotes.
 */
function createAddQuoteForm() {
    // Check if the form already exists
    if (document.getElementById('addQuoteContainer')) {
        return;
    }
    
    // ... (logic to create and append the text input, category input, and button) ...
    const container = document.createElement('div');
    container.id = 'addQuoteContainer';
    
    const textInput = document.createElement('input');
    textInput.id = 'newQuoteText';
    textInput.type = 'text';
    textInput.placeholder = 'Enter a new quote';

    const categoryInput = document.createElement('input');
    categoryInput.id = 'newQuoteCategory';
    categoryInput.type = 'text';
    categoryInput.placeholder = 'Enter quote category';

    const addButton = document.createElement('button');
    addButton.textContent = 'Add Quote';
    addButton.addEventListener('click', addQuote);

    container.appendChild(textInput);
    container.appendChild(categoryInput);
    container.appendChild(addButton);

    // Insert the form container before the script tag
    document.body.insertBefore(container, document.querySelector('script'));
}

/**
 * Handles the logic for adding a new quote.
 * MODIFIED to call saveQuotes().
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


// --- Event Listeners and Initialization ---

// 1. **Load data first**
loadQuotes();

// 2. Attach event listener 
newQuoteButton.addEventListener('click', showRandomQuote);

// 3. Display an initial quote
showRandomQuote(); 

// 4. Dynamically create the form
createAddQuoteForm();
