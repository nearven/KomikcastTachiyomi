<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="fixed top-0 z-10 bg-white md:w-[600px] w-full mx-auto border-b shadow-sm">
    <div class="flex justify-between items-center px-4 py-2 w-full">
      <RouterLink to="/">
        <h1 class="text-2xl font-bold">KomikCast</h1>
      </RouterLink>
      <button @click="openModal" class="text-2xl font-bold">🔍</button>
    </div>
  </header>

  <div class="py-16 md:w-[600px] px-4 w-full">
    <RouterView :key="$route.fullPath" />
  </div>

  <div class="fixed bottom-0 z-10 bg-white md:w-[600px] w-full mx-auto border-t shadow-sm">
    <div class="flex justify-around items-center w-full px-4">
      <RouterLink to="/" class="text-2xl font-bold hover:bg-gray-300 px-4 py-3 w-full flex items-center justify-center"
        :class="{ 'bg-gray-300': $route.path === '/' }"
      >
        <button class="">🏠</button>
      </RouterLink>
      <RouterLink to="/bookmarks"
        class="text-2xl font-bold hover:bg-gray-300 px-4 py-3 w-full flex items-center justify-center"
        :class="{ 'bg-gray-300': $route.path === '/bookmarks' }"
        >
        <button class="">📚</button>
      </RouterLink>
      <RouterLink to="/history"
        class="text-2xl font-bold hover:bg-gray-300 px-4 py-3 w-full flex items-center justify-center"
        :class="{ 'bg-gray-300': $route.path === '/history' }"
        >
        <button class="">⏰</button>
      </RouterLink>
      <RouterLink to="/browse"
        class="text-2xl font-bold hover:bg-gray-300 px-4 py-3 w-full flex items-center justify-center"
        :class="{ 'bg-gray-300': $route.path === '/browse' }"
        >
        <button class="">📖</button>
      </RouterLink>
      <button @click="openModal" class="text-2xl font-bold hover:bg-gray-300 px-4 py-3 w-full">🔍</button>
    </div>
  </div>

  <div class="fixed z-50 inset-0 transition-all duration-500 ease-out overflow-auto" aria-labelledby="modal-title"
    role="dialog" aria-modal="true"
    v-bind:class="{ 'opacity-100 pointer-events-auto': modal, 'opacity-0 pointer-events-none': !modal }">
    <div class="flex items-center justify-center bg-gray-300 bg-opacity-75 min-h-screen text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" aria-hidden="true"></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      <div
        class="inline-block align-center bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        role="document">
        <div class="flex items-center justify-center">
          <div class="bg-white w-full">
            <div class="flex items-center justify-between px-4 py-2">
              <h1 class="text-xl pl-4 font-bold">Search</h1>
              <button @click="openModal" class="text-xs bg-gray-300 rounded-full p-1 font-bold">✖️</button>
            </div>
            <div class="pb-2 px-4 flex items-center justify-center w-full">
              <div class="flex items-center justify-center w-full">
                <input type="text" class="w-full px-4 py-2 focus-within:outline-none" v-model="search"
                  placeholder="Search..." @keyup.enter="searchManga">
                <button class="bg-blue-500 text-white px-2 py-1 rounded-md" @click="searchManga">Search</button>
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
  data() {
    return {
      search: '',
      modal: false
    }
  },
  methods: {
    openModal() {
      this.modal = !this.modal
    },
    searchManga() {
      this.$router.push('/?search=' + this.search)
      this.modal = false
      this.search = ''
    }
  }
}
</script>
