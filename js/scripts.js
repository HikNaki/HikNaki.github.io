const books = [];
const RENDER_EVENT = 'Render-books';
const SAVED_EVENT = 'Saved-books';
const STORAGE_KEY = 'BookShelf-Apps'

document.addEventListener('DOMContentLoaded', function () {
    const submit = document.getElementById('form');
    submit.addEventListener('submit', function(event) {
        event.preventDefault();
        addBook();
    })

    if(isStorageExist()){
        loadDataFromStorage();
    }
});

document.addEventListener(RENDER_EVENT, function() {

    const unfinishedBookList = document.getElementById('books');
    unfinishedBookList.innerHTML = "";

    const finishedBookList = document.getElementById('finished-books');
    finishedBookList.innerHTML = "";
    for (const bookItem of books) {
        const bookElement = makeList(bookItem);
        if(!bookItem.isCompleted){
            unfinishedBookList.append(bookElement);
        } else {
            finishedBookList.append(bookElement);
        }
    }

});

document.addEventListener(SAVED_EVENT, function() {
    localStorage.getItem(STORAGE_KEY);
})

function generateId() {
    return +new Date();
};

function isCompleted(bookShelf){
    if(bookShelf == 'unfinished'){
        return false;
    }else {
        return true; 
    }
}
function generateBookObject(id, title, author, year, isCompleted){
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
};

function addBook() {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const year = parseInt(document.getElementById('year').value);
    const bookShelf = document.getElementById('rak').value;

    const select = isCompleted(bookShelf);
    const generateID = generateId();
    const bookObject = generateBookObject(generateID, title, author, year, select);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function makeList(bookObject){
    const textTitle = document.createElement('h3');
    textTitle.innerText = bookObject.title;
    
    const textAuthor = document.createElement('p');
    textAuthor.innerText = "Penulis: " + bookObject.author;

    const years = document.createElement('p');
    years.innerText = "Tahun: " + bookObject.year;

    const itemContainer = document.createElement('div');
    itemContainer.classList.add('inner');
    itemContainer.append(textTitle, textAuthor, years);

    const Container = document.createElement('div');
    Container.classList.add('item');
    Container.append(itemContainer);
    Container.setAttribute('id', `book-${bookObject.id})`);

    if (bookObject.isCompleted){
        const unfinishedButton = document.createElement('button');
        unfinishedButton.classList.add('unfinished-button');
        unfinishedButton.innerHTML="<p>Belum Dibaca</p>";

        unfinishedButton.addEventListener('click', function () {
            undoBookItem(bookObject.id);
        });

        const removeButton = document.createElement('button');
        removeButton.classList.add('remove-button');
        removeButton.innerHTML="<p>Hapus</p>";

        removeButton.addEventListener('click', function () {
            removeBookItem(bookObject.id);
        });

        Container.append(unfinishedButton, removeButton);
    } else {
        const finishedButton = document.createElement('button');
        finishedButton.classList.add('finished-button');
        finishedButton.innerHTML = "<p>Selesai Dibaca</p>";

        finishedButton.addEventListener('click', function () {
            finishBook(bookObject.id);
        });

        const removeButton = document.createElement('button');
        removeButton.classList.add('remove-button');
        removeButton.innerHTML="<p>Hapus</p>";

        removeButton.addEventListener('click', function () {
            removeBookItem(bookObject.id);
        });

        Container.append(finishedButton, removeButton);
    }
    return Container;
};

function finishBook(bookId){
    const bookTarget = findBook(bookId);

    if (bookTarget == null) {
        return;
    }
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function undoBookItem(bookId){
    const bookTarget = findBook(bookId);

    if (bookTarget == null){
        return;
    }
    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function removeBookItem(bookId){
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) {
        return;
    }
    if(confirm('Apakah anda yakin ingin menghapus buku ini?')){
        books.splice(bookTarget, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }
};
function findBook(bookId) {
    for (const bookItem of books){
        if(bookItem.id === bookId){
            return bookItem;
        }
    }
    return null
};

function findBookIndex(bookId){
    for (const index in books) {
        if(books[index].id === bookId){
            return index;
        }
    }
    return -1;
};

function saveData() {
    if(isStorageExist()) {
        const parsedData = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsedData);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
};

function isStorageExist() {
    if (typeof(Storage) === undefined) {
        alert('Peringatan!!! Browser Kamu tidak mendukung Local Storage');
        return false;
    }
    return true;
};

function loadDataFromStorage() {
    const getData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(getData);

    if(data !== null){
        for(const book of data){
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}
