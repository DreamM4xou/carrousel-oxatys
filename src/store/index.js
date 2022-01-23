import {createStore} from 'vuex';
import {v4 as uuid_v4} from 'uuid';
import _ from 'lodash';
export default createStore({
    state: {
        carrousels: []
    },
    getters: {
        getCarrouselsIds(state) {
            return _.map(state.carrousels, 'id');
        },
        getCarrouselById : state => id => _.find(state.carrousels, {id})
    },
    mutations: {
        setCarrouselConfigs(state, carrousels) {
            state.carrousels = carrousels;
        },
        addCarrousel(state) {
            state.carrousels.push({
                id: uuid_v4(),
                images: [],
                height: 250,
                thumbnails_num: 4,
                ending_scroll: 'infinite'
            })
        },
        saveCarrousel(state, {id, params}) {
            let i = _.findIndex(state.carrousels, {id});
            let new_carrousel = {
                id: params.id,
                height: params.height,
                ending_scroll: params.ending_scroll,
                thumbnails_num: params.thumbnails_num,
                images: params.images
            }
            // @TODO : Upload image, get lien, ajouter à image + text
            state.carrousels[i] = params;
        }
    },
    actions: {
        getCarrouselsFromBack(context) {
            let carrousels = [{
                id: uuid_v4(),
                images: [{
                    url: '',
                    alt_text: 'Text 1'
                }],
                height: 250,
                thumbnails_num: 4,
                ending_scroll: 'infinite'
            }]
            context.commit('setCarrouselConfigs', carrousels);
        },
        addCarrousel(context) {
            context.commit('addCarrousel');
        }
    },
    modules: {
    }
});
