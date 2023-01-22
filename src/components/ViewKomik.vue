<template>
    
</template>

<script>
export default {
    props: ['komik', 'loading'],
    data() {
        return {
            modal: false,
        }
    },
    methods: {
        openModal() {
            this.modal = !this.modal
        }
    }
}
</script>