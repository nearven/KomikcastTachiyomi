<script setup>
import { hasChanged } from '@vue/shared';
import Loader from '../components/Loader.vue';
import ModalReader from '../components/ModalReader.vue';
import ViewKomik from '../components/ViewKomik.vue';
</script>

<template>
    <div v-if="!loading">
        <div class="flex mb-2">
            <img :src="'https://api.mitenime.my.id/api/v1/images/?url=https://i0.wp.com/' + komik.thumbnail.replace('https://', '')"
                alt="cover" class="w-32 h-48 object-cover rounded-lg flex-shrink-0 mr-4">
            <div class="flex flex-col">
                <h1 class="text-2xl font-semibold text-gray-600" v-html="komik.title"></h1>
                <h1 class="text-sm font-medium text-gray-600 mb-2">{{ komik.original_title }}</h1>
                <div class="flex">
                    <router-link v-for="types in komik.meta.type" :key="types" :to="'/type/' + types.href">
                        <h1
                            class="text-sm font-medium bg-gray-800 bg-opacity-60 text-gray-300 rounded-lg px-2 py-1 mr-2">
                            {{
                                types.text
                            }}</h1>
                    </router-link>
                </div>
                <div class="flex items-center mt-2">
                    <button @click="bookmark(komik)" class="bg-opacity-80 text-white rounded-lg px-2 py-2 mr-2"
                        :class="bookmarkStatus ? 'bg-green-600' : 'bg-red-600'">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"
                            stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                        </svg>
                    </button>
                    <a :href="`https://komikcast.site/komik/${$route.params.slug}`" target="_blank">
                        <button class="bg-red-600 bg-opacity-80 text-white rounded-lg px-2 py-2 mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                            </svg>
                        </button>
                    </a>
                </div>
            </div>
        </div>

        <div class="p-2">
            <p class="text-gray-600 text-sm" v-html="komik.description">
            </p>
        </div>
        <div class="p-2 grid grid-cols-5">
            <router-link v-for="genre in komik.genres" :key="genre" :to="'/genres/' + genre.href">
                <h1
                    class="text-md font-medium bg-gray-800 bg-opacity-60 text-gray-300 rounded-lg px-2 py-1 mr-2 mb-2 line-clamp-1">
                    {{
                        genre.text
                    }}</h1>
            </router-link>
        </div>

        <button @click="lastChapter ? openModal(komik.chapters.find(item => item.text === lastChapter).href) : openModal(komik.chapters[komik.chapters.length - 1].href)"
            class="bg-red-600 bg-opacity-80 text-white rounded-lg px-2 py-2 mr-2 w-full font-bold mb-4">
            {{ lastChapter ? 'Continue reading ' + lastChapter : 'Read Now' }}
        </button>

        <div class="w-full flex justify-between items-center border-b">
            <h1 class="text-2xl font-semibold text-gray-600">{{ komik.chapters.length }} Chapter</h1>
            <button class="text-red-600 rounded-lg px-2 py-2" @click="filterAscDesc">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>
        </div>

        <div class="w-full">
            <button v-for="chapter in komik.chapters" :key="chapter" class="border-b p-2 px-0 block w-full text-left"
                @click="openModal(chapter.href)">
                <h1 class="text-md text-gray-600">{{ chapter.text }}</h1>
                <h1 class="text-sm text-gray-600">{{ chapter.updated_at }}</h1>
            </button>
        </div>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-full">
        <Loader />
    </div>

    <!-- Modal -->
    <div class="fixed z-40 inset-0 transition-all duration-500 ease-out overflow-auto" aria-labelledby="modal-title"
        role="dialog" aria-modal="true"
        v-bind:class="{ 'opacity-100 pointer-events-auto': modal, 'opacity-0 pointer-events-none': !modal }">
        <div class="flex items-end justify-center min-h-screen  text-center sm:block sm:p-0">
            <div class="fixed inset-0 transition-opacity" aria-hidden="true"></div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-white text-left overflow-hidden shadow-xl transform transition-all sm:align-middle md:w-[600px] w-full mx-auto h-screen"
                role="document">
                <div class="bg-white">
                    <header class="fixed top-0 z-10 bg-white md:w-[600px] w-full mx-auto border-b shadow-sm">
                        <div class="flex justify-between items-center px-4 py-2 w-full">
                            <button @click="openModal" class="bg-gray-200 hover:bg-gray-300 rounded-full p-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke="currentColor"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <p class="text-md font-bold text-gray-600">{{ nameChapter }}</p>
                            <button class="ml-2 p-1 text-red-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                </svg>
                            </button>
                        </div>
                    </header>

                    <div class="py-16 overflow-auto h-screen" id="screen-reader" v-on:scroll="countProgress">
                        <!-- <ModalReader :slug="slugChapter" /> -->
                        <img v-for="image in chapters" :key="image.index"
                            :src="'https://api.mitenime.my.id/api/v1/images/?url=' + image.src" class="w-full" />
                        <div class="flex items-center justify-center w-full h-full" v-if="loadingImage">
                            <Loader />
                        </div>

                        <div v-if="!loadingImage && next_chapter !== null" class="flex items-center justify-center p-2">
                            <button class="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2"
                                @click="nextChapter">
                                Next Chapter
                            </button>
                        </div>
                    </div>

                    <div v-if="!loadingImage"
                        class="fixed bottom-0 z-10 bg-white md:w-[600px] w-full mx-auto border-t shadow-sm">
                        <div class="py-2 px-4 flex flex-col justify-between w-full">
                            <div class="h1 w-full bg-gray-200 mb-2 rounded-full relative">
                                <div class="h-1 w-full bg-blue-500 rounded-full" :style="{ width: progress + '%' }">
                                </div>
                                <button class="absolute -top-1 left-0 h-3 w-3 bg-white border rounded-full"
                                    :style="{ left: progress - 2 + '%' }"></button>
                            </div>
                            <div class="flex justify-between items-center">
                                <p class="w-16 flex-shrink-0"></p>
                                <p class="text-xs text-gray-600">{{ progressChapter }} of {{ chapters.length }}</p>
                                <p class="text-xs text-gray-400">{{ chapters.length - progressChapter }} pages left</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {

    name: "Komik",
    data() {
        return {
            komik: {},
            loading: true,
            modal: false,
            slugChapter: '',
            chapters: [],
            loadingImage: true,
            next_chapter: null,
            progressChapter: 0,
            progress: 0,
            nameChapter: '',
            bookmarkStatus: false,
            lastChapter: null,
        }
    },
    async mounted() {
        try {
            const response = await fetch(`https://mite-mail.my.id/komikcast/komik/${this.$route.params.slug}`)
            const res = await response.json()

            this.komik = res.data
            const bookmark = JSON.parse(localStorage.getItem('bookmark')) || []
            const historyBookmark = JSON.parse(localStorage.getItem('history')) || []
            const dataBookmark = historyBookmark.find(item => item.slug === this.$route.params.slug)
            this.lastChapter = dataBookmark ? dataBookmark.last_chapter : null
            const index = bookmark.findIndex(item => item.slug === this.$route.params.slug)
            this.bookmarkStatus = index !== -1 ? true : false
            this.komik.chapters.reverse()
            this.historyAdd(this.komik)
            this.loading = false
        } catch (error) {
            console.log(error)
            this.loading = false
        }
    },
    methods: {
        bookmark(komik) {
            komik.last_chapter = komik.chapters[komik.chapters.length - 1].text
            komik.created_at = new Date().toISOString()
            const bookmark = JSON.parse(localStorage.getItem('bookmark')) || []
            const index = bookmark.findIndex(item => item.slug === this.$route.params.slug)
            if (index !== -1) {
                bookmark.splice(index, 1)
                localStorage.setItem('bookmark', JSON.stringify(bookmark))
                this.bookmarkStatus = false
            } else {
                bookmark.push(komik)
                localStorage.setItem('bookmark', JSON.stringify(bookmark))
                this.bookmarkStatus = true
            }
        },
        historyAdd(komik) {
            komik.last_chapter = komik.chapters[komik.chapters.length - 1].text
            komik.created_at = new Date().toISOString()
            const bookmark = JSON.parse(localStorage.getItem('history')) || []
            const index = bookmark.findIndex(item => item.slug === this.$route.params.slug)
            if (index !== -1) {
                bookmark.splice(index, 1)
                localStorage.setItem('history', JSON.stringify(bookmark))
            }

            bookmark.push(komik)
            localStorage.setItem('history', JSON.stringify(bookmark))
        },
        updateBookmark(slug) {
            const bookmark = JSON.parse(localStorage.getItem('bookmark')) || []
            const index = bookmark.findIndex(item => item.slug === slug)
            if (index !== -1) {
                bookmark.splice(index, 1)
                localStorage.setItem('bookmark', JSON.stringify(bookmark))


                const komik = this.komik
                komik.last_chapter = this.nameChapter
                komik.created_at = new Date().toISOString()
                bookmark.push(komik)
                localStorage.setItem('bookmark', JSON.stringify(bookmark))
            }
        },
        updateHistory(slug) {
            const bookmark = JSON.parse(localStorage.getItem('history')) || []
            const index = bookmark.findIndex(item => item.slug === slug)
            if (index !== -1) {
                bookmark.splice(index, 1)
                localStorage.setItem('history', JSON.stringify(bookmark))
            }

            const komik = this.komik
            komik.last_chapter = this.nameChapter
            komik.created_at = new Date().toISOString()
            bookmark.push(komik)
            localStorage.setItem('history', JSON.stringify(bookmark))
        },
        openModal(slug) {
            this.modal = !this.modal
            this.slugChapter = slug
            this.chapters = []
            this.loadingImage = true
            this.nameChapter = ''

            if (this.modal === true) {


                fetch(`https://mite-mail.my.id/komikcast/chapter/${slug}`)
                    .then(res => res.json())
                    .then(res => {
                        this.chapters = res.data.images,
                            this.progressChapter = 0
                        this.progress = 0
                        this.nameChapter = this.komik.chapters.find(chapter => chapter.href === slug).text
                        this.loadingImage = false
                        this.next_chapter = res.data.next_chapter
                        this.updateBookmark(this.$route.params.slug)
                        this.updateHistory(this.$route.params.slug)
                    })
                    .catch(err => {
                        console.log(err)
                        this.loadingImage = false
                    })
            }
        },
        nextChapter() {
            this.chapters = []
            this.loadingImage = true
            this.nameChapter = ''

            fetch(`https://mite-mail.my.id/komikcast/chapter/${this.next_chapter}`)
                .then(res => res.json())
                .then(res => {
                    this.chapters = res.data.images
                    this.progressChapter = 0
                    this.progress = 0
                    this.loadingImage = false
                    this.nameChapter = this.komik.chapters.find(chapter => chapter.href === this.next_chapter).text
                    this.next_chapter = res.data.next_chapter
                    this.updateBookmark(this.$route.params.slug)
                })
                .catch(err => {
                    console.log(err)
                    this.loadingImage = false
                })
        },
        countProgress() {
            const modal = document.getElementById('screen-reader')
            const { scrollTop, scrollHeight, clientHeight } = modal
            this.progress = Math.floor((scrollTop / (scrollHeight - clientHeight)) * 100)
            this.progressChapter = Math.floor((scrollTop / (scrollHeight - clientHeight)) * this.chapters.length)
        },
        filterAscDesc() {
            this.komik.chapters.reverse()
        }
    },
    components: { Loader, ViewKomik, ModalReader }
}
</script>