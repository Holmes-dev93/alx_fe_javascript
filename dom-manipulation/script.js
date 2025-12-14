// --- Initial Data Store ---
let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Work" },
    { text: "Strive not to be a success, but rather to be of value.", category: "Life" },
    { text: "The mind is everything. What you think you become.", category: "Philosophy" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Get busy living or get busy dying.", category: "Motivation" }
];

// --- DOM Element References ---
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');

// --- Core Functions ---

/**
 * Displays a random quote from the 'quotes' array in the DOM.
 */
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    // Clear and create elements
    quoteDisplay.innerHTML = '';
    
    const quoteTextElement = document.createElement('p');
    quoteTextElement.textContent = `"${quote.text}"`;
    quoteTextElement.classList.add('quote-text'); 

    const quoteCategoryElement = document.createElement('span');
    quoteCategoryElement.textContent = `- Category: ${quote.category}`;
    quoteCategoryElement.classList.add('quote-category'); 

    // Append to container
    quoteDisplay.appendChild(quoteTextElement);
    quoteDisplay.appendChild(quoteCategoryElement);
}

/**
 * Creates and inserts the dynamic form for adding new quotes into the DOM.
 */
function createAddQuoteForm() {
    if (document.getElementById('addQuoteContainer')) {
        return;
    }

    const container = document.createElement('div');
    container.id = 'addQuoteContainer';
    
    // Text Input
    const textInput = document.createElement('input');
    textInput.id = 'newQuoteText';
    textInput.type = 'text';
    textInput.placeholder = 'Enter a new quote';

    // Category Input
    const categoryInput = document.createElement('input');
    categoryInput.id = 'newQuoteCategory';
    categoryInput.type = 'text';
    categoryInput.placeholder = 'Enter quote category';

    // Add Button
    const addButton = document.createElement('button');
    addButton.textContent = 'Add Quote';
    addButton.addEventListener('click', addQuote);

    // Assembly and insertion
    container.appendChild(textInput);
    container.appendChild(categoryInput);
    container.appendChild(addButton);

    // Insert the form container before the script tag at the end of the body
    document.body.insertBefore(container, document.querySelector('script'));
}

/**
 * Handles the logic for adding a new quote from the form input.
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

    // Feedback and cleanup
    alert(`Quote added successfully! Total quotes: ${quotes.length}`);
    textInput.value = '';
    categoryInput.value = '';
    
    showRandomQuote();
}


// --- Event Listeners and Initialization ---

// 1. Attach event listener to the "Show New Quote" button
newQuoteButton.addEventListener('click', showRandomQuote);

// 2. Initial setup
showRandomQuote();
createAddQuoteForm();
