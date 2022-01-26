<template src="./Carrousel.html"></template>

<script>
import _  from 'lodash';
export default {
    name: 'Carrousel',
    props: {
        is_admin: {
            type: Boolean,
            required: false,
            default() {return false;}
        },
        id: {
            type: [String, Number],
            required: true
        }
    },
    data() {
        return {
            states: {
                can_configure: this.is_admin,
                selected: 0,
                thumbnails_start: 0,
                show_parameters: false,
                error: null,
                file_enabled: ['image/jpg', 'image/jpeg', 'image/png'],
                end_scroll: [
                    {
                        value: 'infinite',
                        text: 'Infinie'
                    },
                    {
                        value: 'disabled',
                        text: 'Désactivé'
                    },
                    {
                        value: 'hidden',
                        text: 'Caché'
                    }
                ],
                parameters: {},
            },
            default_image: {
                url: './images/default.jpg',
                text_alt: 'Image par défaut'
            },
            carrousel: {}
        }
    },
    computed: {
        selector() {
            return ".container-my-carrousel#" + this.id;
        },
        /**
         * verify all fields au form and trigger an error
         *
         * @access public
         * @return {Boolean} form failed
         */
        formValid() {
            if (!this.states.can_configure) return false;
            let p = this.states.parameters;
            this.states.error = "Choix du scroll non défini";
            if (!p.ending_scroll) return false;
            this.states.error = "Taille non définie";
            if (!p.height) return false;
            if (typeof p.height !== 'number' &&
                Number.isNaN(parseInt(p.height, 10)))
                return false;
            this.states.error = "Nombre de vignette non défini";
            if (!p.thumbnails_num) return false;
            if (typeof p.thumbnails_num !== 'number' &&
                Number.isNaN(parseInt(p.thumbnails_num, 10)))
                return false;
            this.states.error = "Fichier non conforme";
            let file_ok = this.checkFiles(p.images_upload);
            if (!file_ok) return false;
            this.states.error = null;
            return true;
        },
        selectedIsFirst() {
            return this.states.selected === 0;
        },
        selectedIsLast() {
            return this.states.selected === this.carrousel.images.length - 1 ;
        }
    },
    created() {
        this.setCarrousel();
    },
    methods: {
        /**
         * Get object carrousel with id <id>
         * @access public
         */
        setCarrousel() {
            this.carrousel = this.$store.getters.getCarrouselById(this.id);
        },

        // Carrousel parameters

        /**
         * Open the carrousel parameters
         * @access public
         */
        openParameters() {
            // this.states.parameters = this.carrousel;
            this.states.parameters = _.cloneDeep(this.carrousel);
            this.states.parameters.images_upload = [];
            this.toggleShowParameters();
        },
        toggleShowParameters() {
            this.states.show_parameters = !this.states.show_parameters;
        },
        /**
         * Check if the file has an enable type (image)
         * @access public
         * @param {Object} files file object construct with <File> type of an input file element
         * @return {Boolean} type is accepted
         */
        checkFiles(files) {
            let file_ok = true;
            _.forEach(files, i => {
                file_ok = this.states.file_enabled.indexOf(i.type) > -1
                return file_ok;
            })
            return file_ok;
        },
        save() {
            if (!this.formValid) return;
            let params = this.states.parameters;
            params.thumbnails_num = parseInt(params.thumbnails_num, 10)
            params.height = parseInt(params.height, 10)
            this.$store.commit('saveCarrousel', {id: this.id, params});
            this.setCarrousel();
            this.toggleShowParameters();
        },
        cancel() {
            this.states.parameters = {};
            this.toggleShowParameters();
        },
        addImage() {
            let i = this.states.parameters.images.length + 1;
            let url = `/images/carrousel (${i}).jpg`;
            this.states.parameters.images.push({url, text_alt: ''});
        },

        // Carrousel thumbnails
        /**
         * depending the arrow, options and where is the selector, say if the arrow is disabled or not
         *
         * @access public
         * @param {String} arrow "previous" or "next"
         * @return {Boolean} the arrow is disabled or not
         */
        disableArrow(arrow) {
            if (this.carrousel.ending_scroll === 'disabled') {
                if (arrow === 'previous' && this.selectedIsFirst) return true;
                else if (arrow === 'next' &&  this.selectedIsLast) return true;
            }
            return false;
        },
        /**
         * depending the arrow, options and where is the selector, say if the arrow is visible or not
         *
         * @access public
         * @param {String} arrow "previous" or "next"
         * @return {Boolean} the arrow is shown or not
         */
        showArrow(arrow) {
            if (this.carrousel.ending_scroll === 'hidden') {
                if (arrow === 'previous' && this.selectedIsFirst) return false;
                else if (arrow === 'next' &&  this.selectedIsLast) return false;
            }
            return true;
        },
        /**
         * depending the arrow, options and where is the selector, affect the new selector index
         *
         * @access public
         * @param {String} arrow "previous" or "next"
         */
        clickArrow(arrow) {
            if (arrow === 'previous') {
                if (this.selectedIsFirst) {
                    if (this.carrousel.ending_scroll === 'infinite')
                        this._affectSelectorToEnd();
                } else this._affectToPrevious();
            } else if (arrow === 'next') {
                if (this.selectedIsLast) {
                    if (this.carrousel.ending_scroll === 'infinite')
                        this._affectSelectorToStart();
                } else this._affectToNext();
            }
        },
        /**
         * The image is in the thumbnails
         *
         * @access public
         * @param {Number} index image index
         * @return {Boolean} is in thumbnail
         */
        isInThumbnails(index) {
            let start = this.states.thumbnails_start;
            let end = start + this.carrousel.thumbnails_num;
            return index >= start && index < end;
        },
        _affectSelectorToStart() {
            this.states.selected = 0;
            this.states.thumbnails_start = 0;
        },
        _affectSelectorToEnd() {
            let end = this.carrousel.images.length;
            this.states.selected = end - 1;
            this.states.thumbnails_start = end - this.carrousel.thumbnails_num;
        },
        _affectToNext() {
            this.states.selected++;
            if (!this.isInThumbnails(this.states.selected))
                this.states.thumbnails_start++;
        },
        _affectToPrevious() {
            this.states.selected--;
            if (!this.isInThumbnails(this.states.selected))
                this.states.thumbnails_start--;
        }
    }
}
</script>
