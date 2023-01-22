<script setup>
import Loader from '../components/Loader.vue';
</script>

<template>
    <img v-for="image in chapters" :key="image.index" :src="'https://api.mitenime.my.id/api/v1/images/?url=' + image.src" class="w-full" />
    <div class="flex items-center justify-center w-full h-full" v-if="loading">
        <Loader />
    </div>
    
    <!-- Progress bar -->
    <div class="fixed top-0 left-0 z-20 w-full h-1 bg-gray-200">
        <div class="h-full bg-blue-500"
            :style="{ width: `${progress}%` }"
        ></div>
    </div>

    <div v-if="!loading && next_chapter !== null" class="flex items-center justify-center p-2">
        <router-link :to="`/chapter/${next_chapter}`" class="bg-blue-500 text-white px-4 py-2 rounded-lg">
            Next Chapter
        </router-link>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loading: true,
            chapters: [],
            next_chapter: null,
            progress: 0
        }
    },
    async mounted() {
        try {
            const response = await fetch(`https://mite-mail.my.id/komikcast/chapter/${this.$route.params.slug}`)
            const res = await response.json()
    
            this.chapters = res.data.images
            this.next_chapter = res.data.next_chapter
            this.loading = false
        } catch (error) {
            console.log(error)
            this.loading = false
        }

        // window.addEventListener('scroll', () => {
        //     if (this.loading) return
        //     this.progress = window.scrollY / (document.body.offsetHeight - window.innerHeight) * 100
        //     if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
        //         // if this route path is /chapter/:slug
        //         // then redirect to /chapter/:next_chapter
        //         if (this.next_chapter == null) return

        //         if (this.$route.path.includes('chapter')) {
        //             this.$router.push(`/chapter/${this.next_chapter}`)
        //         }
        //     }
        // })
    },
    components: { Loader }
}
</script>