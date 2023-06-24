// Book Class: Represents a Book

class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Class: Handle UI Tasks

class UI {
    static displayBooks() {
        // read books from local storage
        const BOOKS = Store.getBooks();
        
        //hard-coded array of book objects
        // const STORED_BOOKS = [
        //     {
        //         title: 'Book One',
        //         author: 'John Doe',
        //         isbn: 3434434
        //     }, 
        //     {
        //         title: 'Book Two',
        //         author: 'Jane Doe',
        //         isbn: '45545'
        //     }
        // ];
        // 

        // loops through the array of book objects and calls the addBookToList method
        // passing in each book as a parameter
        BOOKS.forEach((book) => UI.addBookToList(book));            
    }
    
    // add book to UI on submit
    static addBookToList(book) {

        // selects element with matching id of book-list
        const LIST = document.querySelector('#book-list');
        // creates table row element
        const ROW = document.createElement('tr');
        // injects HTML dynamically into row element 
        ROW.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">x</a></td>
        `;

        LIST.appendChild(ROW);
    }
    
    // deletes table row on event click
    static deleteBook(element) {
        if (element.classList.contains('delete')) {
            element.parentElement.parentElement.remove();
        }
    }

    // custom alert functionality
    static showAlert(message, className) {
        const DIV = document.createElement('div');
        // dynamically sets class name of alert div
        DIV.className = `alert alert-${className}`;
        DIV.appendChild(document.createTextNode(message));
        const CONTAINER = document.querySelector('.container');
        const FORM = document.querySelector('#book-form');
        CONTAINER.insertBefore(DIV, FORM);
        // set timer for alert display
        setTimeout(() => document.querySelector('.alert').remove(),
        3000);
    }

     // clear fields on submit
    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

// Store Class: Handles Storage

class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book) {
        const BOOKS = Store.getBooks();
        BOOKS.push(book);
        localStorage.setItem('books', JSON.stringify(BOOKS));

    }

    static removeBook(isbn) {
        const BOOKS = Store.getBooks();
        BOOKS.forEach((book, index) => {
            if (book.isbn === isbn) {
                BOOKS.splice(index, 1);
            }
        });
    }
}

// Event: Display Books

// event triggers when the DOM loads, and calls the displayBooks method
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a Book

document.querySelector('#book-form')
    .addEventListener('submit', (e) => {
        // prevent default submit behavior
        e.preventDefault();

        // get form values
        const TITLE = document.querySelector('#title').value;
        const AUTHOR = document.querySelector('#author').value;
        const ISBN = document.querySelector('#isbn').value;

        // form validation
        if (TITLE === '' || AUTHOR === '' || ISBN === '') {
            UI.showAlert('Please fill in all fields.', 'danger');
        }

        // instantiate book
        const book = new Book(TITLE, AUTHOR, ISBN);

        // add book to UI
        UI.addBookToList(book);

        // add book to local storage
        Store.addBook(book);
        
        // display success message
        UI.showAlert('Book Added Successfully.', 'success');

        UI.clearFields();

});

// Event: Remove a Book

// targets the parent element for the event click handler to register on all child elements
document.querySelector('#book-list').addEventListener('click', (e) => {
    // remove book from UI
    UI.deleteBook(e.target);

    // remove book from local storage by targeting the isbn of the event target sibling
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent)

    UI.showAlert('Book Removed Successfully.', 'success');
});
