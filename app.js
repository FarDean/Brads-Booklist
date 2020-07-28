// Book Class: Represents a Book
class Book {
    constructor(title,author,isbn){
        this.title = title;
        this.author= author;
        this.isbn= isbn;
    }
}

// UI Class: Handles UI Tasks
class UI {
    static displayBooks() {
        const books = Store.getBook();
        books.forEach(book => UI.addBookToList(book))
    }
    static addBookToList(book){
        const list = document.querySelector("#book-list");

        const row = document.createElement("tr");
        row.innerHTML = `
                        <td>${book.title}</td>
                        <td>${book.author}</td>
                        <td id="isbn">${book.isbn}</td>
                        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
                        `
        list.appendChild(row)
    }
    static showAlert(message, type){
        const div = document.createElement("div")
        div.innerHTML =`
        <div class="alert alert-${type}" role="alert">
             ${message}
        </div>
                        `
        const form = document.querySelector("#book-form");
        const container = document.querySelector(".container")
        container.insertBefore(div,form)
        setTimeout(()=> {
            const alert = document.querySelector(".alert");
            alert.remove()
        },2000)
    }
}

// Store Class: Handles Storage
localStorage.getItem("storedBooks");
class Store {
    static getBook(){
        let books;
        if(localStorage.getItem("books") === null){
            books = [];
        }else {
            books = JSON.parse(localStorage.getItem("books"));
        }
        return books;
    }

    static addBook(book){
        const books = Store.getBook();
        books.push(book);
        localStorage.setItem("books",JSON.stringify(books));
    }
    static removeBook(isbn){
        const books = Store.getBook();
        books.forEach((book,index)=> {
            if(book.isbn === isbn) {
                books.splice(index,1)
            }
        })
        localStorage.setItem("books",JSON.stringify(books))
    }
}
// Event: Display Books
window.addEventListener("load", UI.displayBooks)

// Event: Add a Book
const subBtn = document.querySelector("#submit");
subBtn.addEventListener("click", e => {
    e.preventDefault();
    const title = document.querySelector("#title").value
    const author = document.querySelector("#author").value
    const isbn = document.querySelector("#isbn").value
    if(title === "" || author==="" || isbn === ""){
        UI.showAlert("Please fill in all the fields", "warning")
    }else if(isNaN(parseFloat(isbn))) {
        UI.showAlert("ISBN must be a Number", "warning")
    }else {
        const book = {
            title:title,
            author: author,
            isbn: isbn
        }
        UI.addBookToList(book)
        document.querySelector("#title").value =""
        document.querySelector("#author").value = ""
        document.querySelector("#isbn").value = ""
        UI.showAlert("Book Added!","success");
        Store.addBook(book)
    }

    
})

// Event: Remove a Book

const table = document.querySelector("#book-list");
table.addEventListener("click",e => {
    const el = e.target;
    if(el.classList.contains("delete")){
        el.parentElement.parentElement.remove();
        UI.showAlert("Book Removed!","danger");
        Store.removeBook(el.parentElement.previousElementSibling.textContent)
    }
})