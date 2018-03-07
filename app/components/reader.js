Vue.component('reader',{
    template:`
            <transition name="fade">
                <div id='reader' class="box" v-if="reading">
                    <header class="closeReader" onclick="closeBook()" onmouseenter="$('#reader').css('top', '10px') " onmouseleave="$('#reader').css('top', '0px') "></header>
                    <div id="readerMain">
                        <a class="nav prev" onclick="left()">
                            <i class="fas fa-caret-left"></i>
                        </a>
                        <div id="pages">
                            <figure id="current-page" class="image page">
                                <img>
                            </figure>
                        </div>
                        <a class="nav next" onclick="right()">
                                <i class="fas fa-caret-right"></i>
                        </a>
                    </div>
                    <footer>
                        <div id="pageCount" class="content has-text-centered has-text-grey-light"></div>
                    </footer>
                </div>
            </transition>`,
    props:['reading']
});