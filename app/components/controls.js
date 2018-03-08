Vue.component('control-box',{
    template:`
            <div id="controls" class="box">
                <button class="button" onclick="loadDir()">Load Books</button>
                <button class="button" onclick="reader.showAbout=true">About</button>
                <div class="field">
                    <div class="control has-icons-left">
                        <div class="select">
                            <select id="sort-option" onchange="sortList()">
                                <option disabled selected hidden>Sort By..</option>
                                <option>Title</option>
                                <option>Author</option>
                                <option>Series</option>
                                <option>File Name</option>
                                <option>Number</option>
                            </select>
                        </div>
                        <div class="icon is-left">
                            <i class="fas fa-sort-amount-down"></i>
                        </div>
                    </div>
                </div>
            </div>`
})