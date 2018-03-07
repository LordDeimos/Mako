Vue.component('close-warning-modal', {
        template: `
        <transition name="fade">
                <div id="close-warning" v-if="enabled" class="modal" v-bind:class="{'is-active':enabled}">
                        <div class="modal-background"></div>
                        <div class="modal-content box">
                                <div class="edit-header">
                                        <p class="title">Are You Sure You Want To Exit?</p>
                                        <button class="delete" aria-label="close" onclick="reader.showCloseWarning=false"></button>
                                </div>
                                <p class="about-text">There are queued things still running, I am not responsible for loss of data!</p>
                                <button class="button is-primary" onclick="reader.showCloseWarning=false">No!, Save My Data!</button>
                                <button class="button is-danger" onclick="remote.getCurrentWindow().close()">Yes!, I Want to Destroy My Library!</button>
                         </div>
                </div>
        </transition>`,
        props: ['enabled']
});