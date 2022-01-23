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
                selected: 0,
                can_configure: this.is_admin,
                show_parameters: false,
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
        formValid() {
            if (!this.states.can_configure) return false;
            let p = this.states.parameters;
            if (!p.ending_scroll) return false;
            if (!p.height) return false;
            if (typeof p.height !== 'number' &&
                !Number.isNaN(parseInt(p.height, 10)))
                return false;
            if (!p.thumbnails_num) return false;
            if (typeof p.thumbnails_num !== 'number' &&
                !Number.isNaN(parseInt(p.thumbnails_num, 10)))
                return false;
            let file_ok = this.checkFiles(p.images_upload);
            if (!file_ok) return false;
            return true;
        },
        selectedIsFirst() {
            this.states.selected === 0;
        },
        selectedIsLast() {
            this.states.selected === this.carrousel.images.length - 1 ;
        }
    },
    created() {
        this.setCarrousel();
        // this.listeners();
    },
    methods: {
        setCarrousel() {
            this.carrousel = this.$store.getters.getCarrouselById(this.id);
        },
        listeners() {
            function readURL(input) {
                if (input.files && input.files[0]) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        $('#test').attr('src', e.target.result);
                    }
                    reader.readAsDataURL(input.files[0]);
                }
            }
            $("#file-form-" + this.id).change(function() {
                readURL(this);
            })
        },
        openParameters() {
            // this.states.parameters = this.carrousel;
            this.states.parameters = _.cloneDeep(this.carrousel);
            this.states.parameters.images_upload = [];
            this.toggleShowParameters();
        },
        toggleShowParameters() {
            this.states.show_parameters = !this.states.show_parameters;
        },
        getBackgroundColor() {
            let values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'];
            let color = '#';
            while (color.length < 7) {
                let i = _.random(15);
                color += values[i];
            }
            return color;
        },
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
        disableArrow(arrow) {
            if (this.carrousel.ending_scroll === 'disabled') {
                if (arrow === 'start' && this.selectedIsFirst) return true;
                else if (arrow === 'end' &&  this.selectedIsLast) return true;
            }
            return false;
        },
        showArrow(arrow) {
            if (this.carrousel.ending_scroll === 'hidden') {
                if (arrow === 'start' && this.selectedIsFirst) return false;
                else if (arrow === 'end' &&  this.selectedIsLast) return false;
            }
            return true;
        },
        clickArrow(arrow) {
            if (arrow === 'start') {
                if (this.selectedIsFirst) {
                    if (this.carrousel.ending_scroll === 'infinite')
                        this.states.selected = this.carrousel.images.length - 1;
                } else this.states.selected--;
            } else if (arrow === 'end') {
                if (this.selectedIsLast) {
                    if (this.carrousel.ending_scroll === 'infinite')
                        this.states.selected = 0;
                } else this.states.selected++;
            }
        }
    }
}
</script>
