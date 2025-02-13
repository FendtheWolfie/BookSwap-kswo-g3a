// funktion für die detailierte Buchkarte (Angebotsansicht)
function createCard(title, price, year, condition, level, description, image, subject, bookid, webauthentication) {
    return `
        <div class="col">
            <a href="Angebotsansicht?title=${encodeURIComponent(title)}
            &price=${encodeURIComponent(price)}
            &year=${encodeURIComponent(year)}
            &condition=${encodeURIComponent(condition)}
            &level=${encodeURIComponent(level)}
            &description=${encodeURIComponent(description || "Keine Beschreibung verfügbar")}
            &image=${encodeURIComponent(image || "https://via.placeholder.com/250")}
            &subject=${encodeURIComponent(subject || "Schulfach nicht angegeben")}
            &bookid=${encodeURIComponent(bookid)}
            &webauthentication=${encodeURIComponent(webauthentication)}">
            <div class="card">
                    <div class="card-body">
                        <div class="image-container" style="width: 100%; height: 250px; display: flex; align-items: center; justify-content: center; overflow: hidden; background-color: #f0f0f0;">
                            <img src="${image || "https://via.placeholder.com/250"}" class="card-img-top" alt="Buchbild" style="max-width: 100%; max-height: 100%; object-fit: contain;"/>
                        </div>
                        <h5 class="card-title mt-3">${title}</h5>
                        <p class="card-text">Preis: ${price} CHF</p>
                        <p class="card-text">Erscheinungsjahr: ${year}</p>
                        <p class="card-text">Zustand: ${condition}</p>
                        <p class="card-text">Niveau: ${level}</p>
                    </div>
                </div>
            </a>
        </div>
    `;
}


// funktion für die detailierte Buchkarte (Angebotsansicht)
function populateSection(sectionId, books) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    section.innerHTML = "";
    books.forEach((book) => {
        const firstImage = book.filelocation.split(';')[0];
        section.innerHTML += createCard(
            book.bookTitle, book.price, book.publicationYear, book.bookCondition, book.educationLevel,
            book.bookDescription, firstImage, book.schoolSubject, book.bookid, book.webauthentication
        );
    });
}

// funktion
function populateCategoryBooks(category, books) {
    const section = document.getElementById("category-section");
    section.innerHTML = "";
    books.forEach((book) => {
        if (book.schoolSubject === category) {
            const firstImage = book.filelocation.split(';')[0];
            section.innerHTML += createCard(
                book.bookTitle, book.price, book.publicationYear, book.bookCondition, book.educationLevel,
                book.bookDescription, firstImage, book.schoolSubject, book.bookid,  book.webauthentication
            );
        }
    });
}

// funktion für die detailierte Buchkarte (Angebotsansicht)
function loadBookDetails() {
    function getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.has(name) ? decodeURIComponent(urlParams.get(name)) : "Nicht verfügbar";
    }

    const title = getUrlParameter("title");
    const price = getUrlParameter("price");
    const year = getUrlParameter("year");
    const condition = getUrlParameter("condition");
    const level = getUrlParameter("level");
    const description = getUrlParameter("description");
    const image = getUrlParameter("image");
    const subject = getUrlParameter("subject");
    const bookid = getUrlParameter("bookid");
    const webauthentication = getUrlParameter("webauthentication");

    document.getElementById("book-details").innerHTML = createCardForDetails(
        title, price, year, condition, level, description, image, subject, bookid, webauthentication
    );
}

// funktion
async function fetchBooks() {
    try {
        const response = await fetch('/api/books');
        const data = await response.json();
        return data.books;
    } catch (error) {
        console.error('Error fetching books:', error);
        return [];
    }
}

// erkennung der kategorie
document.addEventListener("DOMContentLoaded", async () => {
    const books = await fetchBooks();
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");

    if (window.location.pathname.includes("kategorie")) {
        populateCategoryBooks(category, books);
    } else if (window.location.pathname.includes("Angebotsansicht")) {
        loadBookDetails();
    } else {
        populateSection("math-section", books.filter(book => book.schoolSubject === "Mathematik"));
        populateSection("german-section", books.filter(book => book.schoolSubject === "Deutsch"));
        populateSection("english-section", books.filter(book => book.schoolSubject === "Englisch"));
        populateSection("french-section", books.filter(book => book.schoolSubject === "Französisch"));
        populateSection("economics-section", books.filter(book => book.schoolSubject === "Wirtschaft"));
        populateSection("geography-section", books.filter(book => book.schoolSubject === "Geografie"));
        populateSection("history-section", books.filter(book => book.schoolSubject === "Geschichte"));
        populateSection("law-section", books.filter(book => book.schoolSubject === "Recht"));
    }
});
