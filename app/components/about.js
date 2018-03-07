
Vue.component('about-modal',{
    template:`
    <transition name="fade">
    <div id="about" v-if="enabled" class="modal" v-bind:class="{'is-active':enabled}">
        <div class="modal-background" onclick="reader.showAbout=false"></div>
        <div class="modal-content">
            <div class="box">
                <div class="edit-header">
                    <p class="title">About Mako</p>
                    <button class="delete" aria-label="close" onclick="reader.showAbout=false"></button>
                </div>
                <p class="about-text">
                    Its mostly for learing electron, but maybe will become a viable comic reader for release to the public
                </p>
                <div class="content has-text-centered has-text-grey-light about-foot">
                    <div class="links">
                        <a onclick="openWebsite('https://github.com/LordDeimos/Mako')" class="weblink link tooltip" data-tooltip="Github Repo">
                            <i class="fab fa-github link" id='gitfore'></i>
                        </a>
                        <a class="weblink link tooltip" data-tooltip="Website" onclick="openWebsite()">
                            <i class="fas fa-globe" id='web'></i>
                        </a>
                        <a class="weblink link tooltip" data-tooltip="Icons by FontAwesome" onclick="openWebsite('https://fontawesome.com/')">
                            <i class="fab fa-font-awesome-flag link"></i>
                        </a>
                        <a onclick="openWebsite('https://bulma.io/')" class="weblink link">
                            <img src="resources/made-with-bulma--semiwhite.png" alt="Made with Bulma" width="128" height="24" class="link">
                        </a>
                    </div>
                    <div>
                        <p id="current-version">
                            0.1.1
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </transition>
    `,
    props:['enabled']
});