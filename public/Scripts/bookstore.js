function Bookstore() {

    var me = this;
    me.viewHeader();
    me.initRouter();
    me.db = firebase.firestore();
    //SECURITY CODE GOES here
}

//NAVIGATION CODE
/**
 initializes the router and dictates what navigation string
 leads to what render function.
 Current render functions:
 viewHeader()
 viewCart()
 viewHome()
 HOW TO USE:
 when you need to navigate to another page, call
 this.router.navigate('NAVIGATION_STRING');
 */
Bookstore.prototype.initRouter = function () {
  this.router = new Navigo();
  var that = this;
  let booksDocRef = firebase.firestore().collection("bookdetails")
  let userInfoRef = firebase.firestore().collection("users")

  this.router
    .on({
      '/': function () { // Navigation string '/' leads to viewHome()
        let bDetails = [];
        let allItems = booksDocRef.orderBy("BookTitle").get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              bDetails.push(doc.data());
            });
            that.viewHome(bDetails);
          })
          .catch(err => {
            console.log('Error getting documents', err);
          });
      }
    }).resolve();

    this.router
    .on({
      '/sortByRating': function () { // Home sorted by Rating
        console.log("Sorting by rating")
        let bDetails = [];
        let allItems = booksDocRef.orderBy("Rating", "desc").get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              bDetails.push(doc.data());
            });
            that.viewHome(bDetails);
          })
          .catch(err => {
            console.log('Error getting documents', err);
          });
      }
    }).resolve();

    this.router
    .on({
      '/sortByGenre': function () { // Home sorted by Rating
        console.log("Sorting by genre")
        let bDetails = [];
        let allItems = booksDocRef.orderBy("Genre").get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              bDetails.push(doc.data());
            });
            that.viewHome(bDetails);
          })
          .catch(err => {
            console.log('Error getting documents', err);
          });
      }
    }).resolve();

    this.router
    .on({
      '/sortByBestSellers': function () { // Home sorted by Rating
        console.log("Sorting by best sellers")
        let bDetails = [];
        let allItems = booksDocRef.orderBy("NumSales", "desc").get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              bDetails.push(doc.data());
            });
            that.viewHome(bDetails);
          })
          .catch(err => {
            console.log('Error getting documents', err);
          });
      }
    }).resolve();

  this.router
    this.router
    .on({
      '/sortByAuthor': function () { // Home sorted by Rating
        console.log("Sorting by author")
        let bDetails = [];
        let allItems = booksDocRef.orderBy("AuthorLn").get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              bDetails.push(doc.data());
            });
            that.viewHome(bDetails);
          })
          .catch(err => {
            console.log('Error getting documents', err);
          });
      }
    }).resolve();

    this.router
    .on({
      '/sortByPrice': function () { // Home sorted by Rating
        console.log("Sorting by price")
        let bDetails = [];
        let allItems = booksDocRef.orderBy("Price").get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              bDetails.push(doc.data());
            });
            that.viewHome(bDetails);
          })
          .catch(err => {
            console.log('Error getting documents', err);
          });
      }
    }).resolve();

    // this.router
    // .on({
    //   '/sortByRelease': function () { // Home sorted by Rating
    //     console.log("Sorting by rating")
    //     let bDetails = [];
    //     let allItems = booksDocRef.orderBy("ReleaseDate").get()
    //       .then(snapshot => {
    //         snapshot.forEach(doc => {
    //           bDetails.push(doc.data());
    //         });
    //         that.viewHome(bDetails);
    //       })
    //       .catch(err => {
    //         console.log('Error getting documents', err);
    //       });
    //   }
    // }).resolve();


    this.router
    .on({
        "/createAcc": function(params) {
            // Get data

            // userInfoRef.get().then(snapshot => {
            //     console.log(snapshot.docs)
            // })
            that.viewCreateAcc();
        }
    }).resolve();

    this.router
      .on({
        "/profile": function(params) {
            // Get data
            userInfoRef.get().then(snapshot => {
                console.log(snapshot.docs)
            })
            that.viewProfile();
        }
      }).resolve();

  this.router
    .on({
      "/book/:id": function(params){
        let allBooks = that.db.collection("bookdetails");
        let detailsRef = allBooks.doc(params.id);

        var currentBookAuthor = "";
        let getCurrentAuthor = detailsRef.get()
        .then(doc => {
          if (!doc.exists) {
            console.log('No such document!');
          } else {
            currentBookAuthor = doc.get("AuthorLn")
          }
        })

        // TODO: Should be able to use this as replacement for third argument in allBooks.where
        console.log(currentBookAuthor)

        let booksByAuthor = [];
        let allItems = allBooks.where("AuthorLn", "==", "Coelho").get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              booksByAuthor.push(doc.data());
            });
          })

        let getDoc = detailsRef.get()
        .then(doc => {
           if (!doc.exists) {
             console.log('No such document!');
           } else {
             that.viewBookDetails(doc, booksByAuthor);
           }
         })
         .catch(err => {
           console.log('Error getting document', err);
         });
       }
    }).resolve();

  this.router
    .on({
      '/cart': function () {
        let cartDocRef = that.db.collection("users").doc("nrodr047").collection("cart");
        let allItemsCart = cartDocRef.get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              console.log(doc.id, '=>', doc.data());
              that.viewCart(doc);
            });
          })
          .catch(err => {
            console.log('Error getting documents', err);
          });
      }
    }).resolve();


  //FIRESTORE LOAD COLLECTIONS
  return this.router;
}

Bookstore.prototype.getCleanPath = function (dirtyPath) {
    if (dirtyPath.startsWith('/index.html')) {
        return dirtyPath.split('/').slice(1).join('/');
    } else {
        return dirtyPath;
    }
}

window.onload = function () {
    window.app = new Bookstore();
}
