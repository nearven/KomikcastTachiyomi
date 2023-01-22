<script setup>
import Loader from '../components/Loader.vue';


</script>

<template>
    <div class="mb-2">
        <h1 class="text-3xl font-bold mb-4">History</h1>
        <div class="flex items-center w-full mb-4">
            <input type="text" class="w-full border-2 focus-within:outline-none border-gray-300 p-2 rounded-lg"
                placeholder="Search" @keyup.enter="searchBookmark" v-model="search">
            <button class="bg-blue-500 text-white p-2 ml-1 rounded-md" @click="searchBookmark">Search</button>
        </div>

        <router-link :to="'/komik/' + bookmark.slug" v-if="!loading" class="flex items-center mb-2" v-for="bookmark in bookmarks" :key="bookmark">
            <img :src="'https://api.mitenime.my.id/api/v1/images/?url=https://i0.wp.com/' + bookmark.thumbnail.replace('https://', '')"
                class="w-20 h-28 flex-shrink-0 rounded-lg">
            <div class="ml-2 md:ml-4">
                <h1 class="text-lg font-semibold line-clamp-2">{{ bookmark.title }}</h1>
                <h1 class="text-md">{{ bookmark.last_chapter }} - {{ convertDateToTime(bookmark.created_at) }}</h1>
            </div>
        </router-link>

        <div v-else class="flex items-center justify-center h-full">
            <Loader />
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            bookmarks: [],
            loading: true,
            search: ""
        };
    },
    mounted() {

    },
    created() {
        this.bookmarks = JSON.parse(localStorage.getItem("history"));
        if (this.bookmarks === null) {
            this.bookmarks = []
        }
        this.bookmarks.reverse()
        this.loading = false;
        console.log(this.bookmarks)
    },
    methods: {
        convertDateToTime(date) {
            const dateObj = new Date(date);
            const hours = dateObj.getHours();
            const minutes = dateObj.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            return `${hours}:${minutes} ${ampm}`;
        },
        searchBookmark() {
            if (this.search === "") {
                this.bookmarks = JSON.parse(localStorage.getItem("history"));
                this.bookmarks.reverse()
                return;
            }
            this.bookmarks = JSON.parse(localStorage.getItem("history"));
            this.bookmarks.reverse()
            this.bookmarks = this.bookmarks.filter(bookmark => bookmark.title.toLowerCase().includes(this.search.toLowerCase()) || bookmark.last_chapter.toLowerCase().includes(this.search.toLowerCase()))
        }
    },
    components: { Loader }
}
</script>