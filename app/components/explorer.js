Vue.component('explorer', {
    template: `
            <div id='explorer' class="box">
                <div id='books'>
                    <div class="book box" data-badge="" v-bind:class="{ badge:!comic.read, 'is-badge-warning':!comic.read }" v-for="comic in books"
                        v-bind:id="comic.id" v-on:click="openBook(comic)" @contextmenu.prevent="editBook(comic)">
                        <figure class='image is-large'>
                            <span class="icon" v-if="comic.loading">
                                <i class="fas fa-circle-notch fa-spin loading" v-bind:name="comic.id"></i>
                            </span>
                            <img class="thumb" v-bind:src="comic.thumb">
                        </figure>
                        {{ comic.displayName }}
                    </div>
                </div>
            </div>`,
    props: ['books'],
    methods: {
        editBook: function (book) {
            reader.editting = true;
            reader.bookEdit = book;
        },
        openBook: function (book) {
            loadBook(book);
        }
    }
});