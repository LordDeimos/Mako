
var reader = new Vue({
    el: '#parent',
    data: {
            reading: false,
            bookList: [],
            editting: false,
            bookEdit: {},
            showAbout: false,
            showCloseWarning: false
    },
    methods: {
            openBook: function (book) {
                    loadBook(book);
            },
            editBook: function (book) {
                    this.editting = true;
                    this.bookEdit = book;
            }
    }
});