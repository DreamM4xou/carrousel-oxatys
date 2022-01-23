<template>
<div class="app-test">
    <div class="container-fluid">
        <div class="card col-12">
            <div class="card-body">
                <h3 class="card-title page-title">
                    {{title}}
                </h3>
                <div class="card-text" v-for="id in carrouselsIds">
                    <carrousel
                        :is_admin="is_admin"
                        :id=id
                    />
                    <hr>
                </div>
                <button class='btn btn-primary' @click='addCarrousel'>
                    <i class="bi bi-plus-circle"></i>
                    Ajouter un carrousel
                </button>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Carrousel from './components/Carrousel.vue'

export default {
    name: 'App',
    components: {
        'carrousel': Carrousel
    },
    data() {
        return {
            title: "Application Carrousel",
            is_admin: true
        };
    },
    computed: {
        carrouselsIds() {
            return this.$store.getters.getCarrouselsIds;
        }
    },
    created() {
        // this.initDefaultCarrousels();
    },
    methods: {
        initDefaultCarrousels() {
            this.$store.dispatch('getCarrouselsFromBack');
        },
        addCarrousel() {
            this.$store.dispatch('addCarrousel');
        }
    }

}
</script>
