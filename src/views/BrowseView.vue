
<script setup>
import Loader from '../components/Loader.vue'
</script>

<template>
    <div v-if="data.length > 0" class="grid grid-cols-2 gap-4">
        <router-link v-for="komik in data" :key="komik" :to="`/komik/${komik.href}`" class="relative w-full h-80 md:h-96 rounded-lg">
            <img :src="'https://api.mitenime.my.id/api/v1/images/?url=https://i0.wp.com/' + komik.thumbnail.replace('https://', '')"
                alt="cover" class="w-full h-full object-cover rounded-lg">
            <div class="absolute bottom-0 w-full h-16 bg-black bg-opacity-50 flex items-start flex-col rounded-b-lg">
                <h1 class="text-lg font-semibold text-white line-clamp-2 px-2" v-html="komik.title"></h1>
            </div>
        </router-link>
    </div>
    <div v-if="loading" class="flex justify-center items-center mt-4">
        <Loader />
    </div>
</template>

<script>
export default {
    data() {
        return {
            data: [],
            page: 1,
            loading: true,
            url: '',
        }
    },
    mounted() {
        if (this.$route.query.search) {
            this.url = `https://mite-mail.my.id/komikcast/search/${this.$route.query.search}/page/${this.page}`
        } else {
            this.url = `https://mite-mail.my.id/komikcast/home/page/${this.page}`
        }
        fetch(this.url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(res => res.json())
            .then(res => {
                this.data = res.data,
                    this.page = res.pagination.next_page
                this.loading = false
            })
            .catch(err => {
                console.log(err)
                this.loading = false
            })

        window.addEventListener('scroll', () => {
            if (this.loading) return
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                this.loading = true
                fetch(`https://mite-mail.my.id/komikcast/home/page/${this.page}`)
                    .then(res => res.json())
                    .then(res => {
                        this.data = this.data.concat(res.data)
                        this.page = res.pagination.next_page
                        this.loading = false
                    })
                    .catch(err => {
                        console.log(err)
                        this.loading = false
                    })
            }
        })
    },
    methods: {
    },
    components: { Loader }
}
</script>