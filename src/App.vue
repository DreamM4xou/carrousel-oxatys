<template>
<div class="app-test">
    <div class="container-fluid">
        <div class="card col-xs-12">
            <div class="card-body">
                <h3 class="card-title page-title">{{title}}</h3>
                <div class="card-text">
                    <carrousel
                        :can_configure="is_admin"
                    />
                </div>
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
    }
}
</script>
