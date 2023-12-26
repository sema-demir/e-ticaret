let bookList = [],
  basketList = [];

//toogle-menu
const toggleModal = () => {
  const basketModal = document.querySelector(".basket-modal");
  basketModal.classList.toggle("active");
};

const getBooks = () => {
  fetch("./products.json")
    .then((res) => res.json())
    .then((books) => (bookList = books))
    .catch((err) => console.log(err));
};
getBooks();

//star alanı
const createBookStars = (starRate) => {
  //console.log(starRate)
  let starRateHtml = "";
  for (let i = 1; i <= 5; i++) {
    if (Math.round(starRate) >= i) {
      starRateHtml += `<i class="bi bi-star-fill active"></i>`;
    } else {
      starRateHtml += `<i class="bi bi-star-fill"></i>`;
    }
  }
  return starRateHtml;
};
//booklist alanı
const createBookItemsHtml = () => {
  const bookListEl = document.querySelector(".book-list");
  let bookListHtml = "";
  bookList.forEach((book, index) => {
    //console.log(book)
    bookListHtml += `<div class="col-5 ${index % 2 == 0 && "offset-2"} my-5">
  <div class="row book-card">
    <div class="col-6">
      <img
        src="${book.imgSource}"
        alt=""
        class="img-fluid shadow"
        width="258px"
        height="400px"
      />
    </div>
    <div class="col-6 d-flex flex-column justify-content-center gap-4">
      <div class="book-detail">
        <span class="fos gray fw-bold fs-5">${book.name}</span> <br />
        <span class="fs-4 ">${book.measure}</span> <br />
        <span class="book-star-rate">
          ${createBookStars(book.starRate)}
          <span class="gray">19 yorum</span>
        </span>
      </div>
      <p class="book-description fos gray">
        ${book.description}
      </p>
      <div>
        <span class="black fw-bold fs-4 me-2">${book.price}</span>
        
      </div>
      <button class="btn-purple" onClick= "addBookToBasket(${
        book.id
      })">Sepete Ekle</button>
    </div>
  </div>
</div>`;
  });
  bookListEl.innerHTML = bookListHtml;
};

//type alanı
const BOOK_TYPES = {
  ALL: "Tümü",
  doorornament: "Kapı Süsü",
  Wallaccessory: "Duvar Aksesuarı",
  hour: "Saat",
  childrenroom: "Çocuk Odası",
  Koran: "Kuranı Kerim",
  Moneybox: "Kumbara",
  gift: "Karne Hediyesi",
  candle: "Mumlar",
  baby: "Hoşgeldin Bebek",
  chocolate: "Çikolata",
};
const createBookTypesHtml = () => {
  const filterEle = document.querySelector(".filter");
  let filterHtml = "";
  let filterTypes = ["ALL"];
  //Önemli--------filter All türleri ile baslıyor-----------------
  bookList.forEach((book) => {
    if (filterTypes.findIndex((filter) => filter == book.type) == -1) {
      filterTypes.push(book.type);
    }
  });
  filterTypes.forEach((type, index) => {
    //console.log(type)
    filterHtml += ` <li onClick="filterBooks(this)" data-types="${type}" class="${
      index == 0 ? "active" : null
    }">${BOOK_TYPES[type] || type}</li>`;
  });

  filterEle.innerHTML = filterHtml;
};
const filterBooks = (filterEl) => {
  document.querySelector(".filter .active").classList.remove("active");
  filterEl.classList.add("active");
  let bookType = filterEl.dataset.types;
  // console.log(bookType)
  getBooks();
  if (bookType != "ALL") {
    console.log(bookType);
    bookList = bookList.filter((book) => book.type == bookType);
  }
  createBookItemsHtml();
};

//ürün ekleme
const listBasketItems = () => {
  const basketListEl = document.querySelector(".basket-list");
  const basketCountEl = document.querySelector(".basket__count");
  const totalQuantity = basketList.reduce(
    (total, item) => total + item.quantity,
    0
  );
  basketCountEl.innerHTML = totalQuantity > 0 ? totalQuantity : null;
  const totalPriceEl = document.querySelector(".total-price");
  console.log(totalPriceEl);
  basketCountEl.innerHTML = basketList.length > 0 ? basketList.length : null;
  let basketListHtml = "";
  let totalPrice = 0;
  basketList.forEach((item) => {
    // console.log(item)
    totalPrice += item.product.price * item.quantity;
    basketListHtml += `
    <li class="basket-item">
    <img src="${item.product.imgSource}"
    width="100" 
    height="100"
     />
    <div class="basket-item-info">
      <h3 class="book-name">${item.product.name}</h3>
      <span class="book-price">${item.product.price}</span><br>
      <span class="book-remove" onclick="removeItemBasket(${item.product.id})">Sepetten Kaldır</span>
    </div>
    <div class="book-count">
      <span class="decrease" onClick= "decreaseItemToBasket(${item.product.id})">-</span>
      <span class="mx-2">${item.quantity}</span>
      <span class="increase" onClick="increaseItemToBasket(${item.product.id})">+</span>
    </div>
  </li>
    `;
  });
  basketListEl.innerHTML = basketListHtml
    ? basketListHtml
    : `<li class="basket-item">Sepette Ürün Bulunmuyor</li>`;
  totalPriceEl.innerHTML = totalPrice > 0 ? "Total:" + totalPrice + "TL" : null;
};

const addBookToBasket = (bookId) => {
  let findedBook = bookList.find((book) => book.id == bookId);
  //console.log(findedBook)

  if (findedBook) {
    //sepetteki ürünün  var olup olmadıgını kontrol eder
    const basketAlreadyIndex = basketList.findIndex(
      (basket) => basket.product.id == bookId
    );
    //eğer sepet bossa eklenen ürün sepette yoksa bu kısım calısır
    if (basketAlreadyIndex == -1) {
      let addItem = { quantity: 1, product: findedBook };
      basketList.push(addItem);
    } else {
      basketList[basketAlreadyIndex].quantity += 1;
      //console.log(basketList)
    }
  }
  const btnCheck = document.querySelector(".btnCheck");
  btnCheck.style.display = "block";
  listBasketItems();
};
const removeItemBasket = (bookId) => {
  const findedIndex = basketList.findIndex(
    (basket) => basket.product.id == bookId
  );
  //eger kitap sepet içinde bulunuyorsa
  if (findedIndex != -1) {
    //splice belirli sayıda ürün silmek için
    basketList.splice(findedIndex, 1);
  }
  const btnCheck = document.querySelector(".btnCheck");
  btnCheck.style.display = "none";
  listBasketItems();
};

//sepetteki ürününn miktarını azaltma
const decreaseItemToBasket = (bookId) => {
  //console.log (bookId)
  const findedIndex = basketList.findIndex(
    (basket) => basket.product.id == bookId
  );
  if (findedIndex != -1) {
    if (basketList[findedIndex].quantity != 1) {
      basketList[findedIndex].quantity -= 1;
    } else {
      removeItemBasket(bookId);
    }
    listBasketItems();
  }
  //sepet içeriğini güncelle
  listBasketItems();
};
//artırma işlemi

const increaseItemToBasket = (bookId) => {
  const findedIndex = basketList.findIndex(
    (basket) => basket.product.id == bookId
  );
  if (findedIndex != -1) {
    basketList[findedIndex].quantity += 1;
  }
  listBasketItems();
};

setTimeout(() => {
  createBookItemsHtml();
  createBookTypesHtml();
}, 100);
