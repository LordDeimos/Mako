Vue.component('edit-modal',{
    template:`
    <transition name="fade">
        <div id="edit" class="modal" v-bind:class="{ 'is-active':enabled }" v-if="enabled">
            <div class="modal-background" onclick="reader.editting=false"></div>
                <div class="modal-content box">
                    <div class="edit-header">
                        <p class="title">Edit Book</p>
                        <button class="delete" aria-label="close" onclick="reader.editting=false"></button>
                    </div>
                    <div class="field">
                        <label class="label">Title</label>
                            <div class="control">
                                <input id="title" class="input" type="text" onkeypress="handleSubmit(event)" v-bind:placeholder="book.title">
                            </div>
                    </div>
                    <div class="field">
                        <label class="label">Author</label>
                        <div class="control">
                            <input id="author" class="input" type="text" onkeypress="handleSubmit(event)" v-bind:placeholder="book.author">
                        </div>
                    </div>
                    <div class="side-by-side">
                        <div class="field is-horizontal">
                            <div class="field-label is-normal">
                                <label class="label">Series</label>
                            </div>
                            <div class="field-body">
                                <div class="control">
                                    <input id="series" class="input" type="text" onkeypress="handleSubmit(event)" v-bind:placeholder="book.series">
                                </div>
                            </div>
                        </div>
                        <div class="field is-horizontal">
                            <div class="field-label is-normal">
                                <label class="label">Number</label>
                            </div>
                            <div class="field-body">
                                <div class="control">
                                    <input id="number" class="input" type="number" min=0 onkeypress="handleSubmit(event)" v-bind:placeholder="book.number||0">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <label class="checkbox">
                            <input id="rtol" type="checkbox" onkeypress="handleSubmit(event)" v-bind:checked="book.rtol"> Right-To-Left
                        </label>
                    </div>
                    <div class="field">
                        <label class="checkbox">
                            <input id="read" type="checkbox" onkeypress="handleSubmit(event)" v-bind:checked="book.read"> Read?
                        </label>
                    </div>
                    <div class="control">
                        <button id="save-book" class="button is-primary" v-on:click="saveEdit()">Save</button>
                    </div>
                </div>
        </div>
    </transition>`,
    props:['enabled','book'],
    methods:{
        saveEdit: function () {
            console.log("Saving!");
            var newTitle = $('#title').val();
            var newAuthor = $('#author').val();
            var newSeries = $('#series').val();
            var newNumber = $('#number').val();
            var newDirection = $('#rtol').is(":checked");
            var newRead = $('#read').is(":checked");
            Object.assign(this.book, {
                    title: (newTitle !== "") ?
                            newTitle : this.book
                            .title,
                    author: (newAuthor !== "") ?
                            newAuthor : this.book
                            .author,
                    series: (newSeries !== "") ?
                            newSeries : this.book
                            .series,
                    number: (newNumber !== "") ?
                            newNumber : this.book
                            .number,
                    rtol: newDirection,
                    read: newRead
            });
            saveBook(this.book);
            reader.bookEdit = {};
            reader.editting = false;
    }
    }
})