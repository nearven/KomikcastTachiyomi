<script setup>
import Loader from '../components/Loader.vue';


</script>

<template>
    <div class="mb-2">
        <h1 class="text-3xl font-bold mb-4">Library</h1>
        <div class="flex items-center w-full mb-4">
            <input type="text" class="w-full border-2 focus-within:outline-none border-gray-300 p-2 rounded-lg"
                placeholder="Search" @keyup.enter="searchBookmark" v-model="search">
            <button class="bg-blue-500 text-white p-2 ml-1 rounded-md" @click="searchBookmark">Search</button>
        </div>

        <div v-if="bookmarks.length > 0" class="grid grid-cols-2 gap-4">
            <router-link v-for="komik in bookmarks" :key="komik" :to="`/komik/${komik.slug}`"
                class="relative w-full h-80 md:h-96 rounded-lg">
                <img :src="'https://api.mitenime.my.id/api/v1/images/?url=https://i0.wp.com/' + komik.thumbnail.replace('https://', '')"
                    alt="cover" class="w-full h-full object-cover rounded-lg">
                <div
                    class="absolute bottom-0 w-full h-16 bg-black bg-opacity-50 flex items-start flex-col rounded-b-lg">
                    <h1 class="text-lg font-semibold text-white line-clamp-2 px-2" v-html="komik.title"></h1>
                </div>
            </router-link>
        </div>
        <div v-if="bookmarks.length === 0" class="flex flex-col items-center justify-center h-full py-4">
            <h1 class="text-2xl font-semibold">No Komik</h1>
            <p class="text-gray-500 text-center mt-2">You haven't added any komik to your library yet.</p>
            <router-link to="/browse" class="bg-blue-500 text-white p-2 rounded-md mt-4">Browse to Add Komik</router-link>
        </div>
        <div v-if="loading" class="flex justify-center items-center mt-4">
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
        this.bookmarks = JSON.parse(localStorage.getItem("bookmark"));
        if (this.bookmarks === null) {
            this.bookmarks = [];
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
                this.bookmarks = JSON.parse(localStorage.getItem("bookmark"));
                this.bookmarks.reverse()
                return;
            }
            this.bookmarks = JSON.parse(localStorage.getItem("bookmark"));
            this.bookmarks.reverse()
            this.bookmarks = this.bookmarks.filter(bookmark => bookmark.title.toLowerCase().includes(this.search.toLowerCase()) || bookmark.last_chapter.toLowerCase().includes(this.search.toLowerCase()))
        }
    },
    components: { Loader }
}
</script>