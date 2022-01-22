<template>
    <button @click="count++">Tu as appuyé {{ count }} fois</button>
    <div v-if="can_configure">Je suis admin</div>
    <div v-else>Je ne suis pas admin</div>
</template>

<script>
export default {
    name: 'Carrousel',
    props: {
        canConfigure: {
            type: Boolean,
            required: false,
            default() {return false;}
        }
    },
    data() {
        return {
            count: 0
        }
    }
}
</script>
