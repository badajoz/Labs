// Initialize Firebase
var config = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    storageBucket: "",
    messagingSenderId: ""
};

firebase.initializeApp(config);

var regexpEmail = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

var app = new Vue({
    el: '#app',
    data: {
        message: 'You are not logged in !!!',
        islogin: false,
        account: {
            email: '',
            password: ''
        }
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
                        $this.account.email = ''
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
        }
    }
});

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        app.islogin = true;
        app.message = 'You are logged in : '+ user.email;
    }
    else {
        app.islogin = false;
        app.message = 'You are not logged in !!!';
    }
});