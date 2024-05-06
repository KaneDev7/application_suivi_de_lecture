const addBtn = document.querySelector('.addBtn')
const fistAddBtn = document.querySelector('.fistAddBtn')
const defaulMessage = document.querySelector('.defaulMessage')
const modal = document.querySelector('.modal')
const closeBtn = document.querySelector('.closeBtn')
const overlay = document.querySelector('.overlay')
const form = document.querySelector('form')
const bookList = document.querySelector('.bookList')
const Infos_count = document.querySelector('.Infos_count h1')
const themeOption = document.querySelector('.themeOption')


function setDataToLocalStorage(name, data) {
    const currentData = getDataFromLocaleStorage(name)
    localStorage.setItem(name, JSON.stringify([...currentData, data]))
}

function getDataFromLocaleStorage(name) {
    return JSON.parse(localStorage.getItem(name)) || []
}


function deleteDataFromLocaleStorage(name, id) {
    const currentData = getDataFromLocaleStorage(name)
    const currentDataFiltered = currentData.filter(book => book.id !== id)
    localStorage.setItem(name, JSON.stringify(currentDataFiltered))
}


function patchDataFromLocalStorage(name, id) {
    const currentData = getDataFromLocaleStorage(name)
    const toggleIsRead = currentData.map(book => {
        if (id === book.id) {
            return { ...book, isRead: !book.isRead }
        } else {
            return book
        }
    })
    localStorage.setItem(name, JSON.stringify(toggleIsRead))
}


const showModal = () => {
    modal.classList.add('visible')
}


const closeModal = () => {
    modal.classList.remove('visible')
}


const addBook = (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const title = formData.get('title')
    const auteur = formData.get('auteur')

    if (title.trim() === '' || auteur.trim() === '') return

    const data = { id: Date.now(), title, auteur, isRead: false }
    setDataToLocalStorage('book', data)
    form.reset()
    closeBtn.click()
    insertDataToDom()

}

const insertDataToDom = () => {
    const books = getDataFromLocaleStorage('book')
    const liElements = books.map((book, index) => {
        return `
                <li class="bookList_item ${book.isRead && 'check'}">
              
                    <div class="booklist_item_left">
                        <p class="item_id">0${index + 1}</p>
                        <div class="item_text">
                            <h2 class='' >${book.title}</h2>
                            <p>${book.auteur}</p>
                        </div>
                    </div>

                    <div class="booklist_item_option">
                        <span onClick="toggleCheckBook(${book.id})" class="checkBtn material-icons">check_circle${!book.isRead ? '_outline' : ''} </span>
                        <span onClick="deleteBook(${book.id})" class="deleteBtn material-icons">delete</span>
                    </div>
                </li>
        `
    })

    if (liElements.length) {
        defaulMessage.classList.add('defaulMessageHidden')
    } else defaulMessage.classList.remove('defaulMessageHidden')
    bookList.innerHTML = liElements.join('')
    insertCountElement()
}

const insertCountElement = () => {
    const allBooks = getDataFromLocaleStorage('book')
    const bookReads = allBooks.filter(book => book.isRead === true)    
    Infos_count.innerText = `${bookReads.length}/${allBooks.length}`
    Infos_count.classList.add('sacalAnim')
    setTimeout(() =>{Infos_count.classList.remove('sacalAnim')}, 1000 )
}


const deleteBook = (id) => {
    const confirm = window.confirm('Voulez-vous supprimer ce livre ?')
    if (!confirm) return
    deleteDataFromLocaleStorage('book', id)
    insertDataToDom()
}

const toggleCheckBook = (id) => {
    patchDataFromLocalStorage('book', id)
    insertDataToDom()
}

const setTheme = (thmeValue = localStorage.getItem('theme')) => {
    localStorage.setItem('theme', thmeValue)

    if (thmeValue === 'dark') {
        themeOption.firstElementChild.innerText = 'light_mode'
        document.body.classList.add('darkTheme')
 
    } else {
        themeOption.firstElementChild.innerText = 'dark_mode'
        if (document.body.classList.contains('darkTheme')) {
            document.body.classList.remove('darkTheme')
        }
    }
}

const toggleTheme = () => {
    const theme = localStorage.getItem('theme')
    if (theme === 'dark') return setTheme('light')
    setTheme('dark')
}

insertDataToDom()
insertCountElement()
setTheme()

themeOption.addEventListener('click', toggleTheme)
addBtn.addEventListener('click', showModal)
closeBtn.addEventListener('click', closeModal)
fistAddBtn.addEventListener('click', showModal)
overlay.addEventListener('click', closeModal)
form.addEventListener('submit', addBook)






