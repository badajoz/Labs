// Initialize Firebase
var config = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    storageBucket: "",
    messagingSenderId: ""
};

firebase.initializeApp(config);

var database = firebase.database();
var regexpEmail = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

var app = new Vue({
    el: '#app',
    data: {
        message: 'You are not logged in !!!',
        islogin: false,
        account: {
            email: '',
            password: ''
        },
        bookmarksList: {},
        bookmark: ''
    },
    // computed property for form validation state
    computed: {
        validation: function () {
            return {
                email: regexpEmail.test(this.account.email),
                password: !!this.account.password.trim()
            }
        },
        isValid: function () {
            var validation = this.validation;
            return Object.keys(validation).every(function (key) {
                return validation[key]
            })
        }
    },
    // methods
    methods: {
        login: function () {
            if (this.isValid) {
                var $this = this;
                firebase.auth().signInWithEmailAndPassword(this.account.email, this.account.password)
                    .then(function(user) {
                        $this.message = 'You are logged in : '+ user.email;
                        $this.account.password = '';
                        $this.account.email = '';
                    })
                    .catch(function(error) {
                        // Handle Errors here.
                        var errorCode = error.code;
                        var errorMessage = error.message;

                        $this.message = errorMessage;
                    });
            }
            else {
                this.message = 'Invalid field(s) !!!'
            }
        },
        logout: function() {
            firebase.auth().signOut();
        },
        addBookmark: function() {
            user = firebase.auth().currentUser;
            var bookmarkData = {
                uid: user.uid,
                bookmark: this.bookmark
            };

            var newBookmarkId = firebase.database().ref().child('bookmarks').push().key;
            var updates = {};
                updates['/bookmarks/' + newBookmarkId] = bookmarkData;

            return firebase.database().ref().update(updates);
        }
    }
});

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        app.islogin = true;
        app.message = 'You are logged in : '+ user.email;

        /*firebase.database().ref('/bookmarks/').on('value').then(function(b) {
            console.log(b.val());
        });*/

        var bookmarksRef = firebase.database().ref('/bookmarks/');
        bookmarksRef.orderByChild('uid').equalTo(user.uid).on('value', function(b) {
            app.bookmarksList = b.val();
        });
    }
    else {
        app.islogin = false;
        app.message = 'You are not logged in !!!';
        app.bookmarksList = {};
    }
});