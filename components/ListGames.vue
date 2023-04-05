<template>
  <div class="px-10">
    <div class="bg-white py-4 w-full mt-4">
      <div class="md:flex md:items-center md:justify-between">
        <h1 class="font-bold text-5xl"> Juegos</h1>
        <button
          @click="openModalFormProduct"
          class="bg-blue-800 text-white my-5 flex items-center w-44 text-center hover:bg-green-400 focus:ring-4 focus:ring-green-100 font-medium rounded-md text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Agregar Juego
        </button>
      </div>
      <p class="text-gray-400 mt-4 text-justify">Bienvenido!. Prepárate para explorar un mundo lleno de aventuras y desafíos únicos
        que te mantendrán enganchado durante horas. Selecciona el juego y disfruta de la experiencia de juego
        inigualable que ofrecemos en nuestra página web. ¡Vamos!</p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10" v-if="games.length > 0">
        <CardGame :game="game" v-for="(game, index) in games" :key="index"/>
      </div>
      <div v-if="$store.state.game.dataLoading" class="flex h-64 justify-center items-center">
        <h4 class="text-3xl text-gray-400">No hay juegos 😟</h4>
      </div>
    </div>
  </div>
</template>

<script>
import FormGame from "./FormGame";
import {cloneDeep} from 'lodash'
export default {
  name: "ListGames",
  computed:{
    games(){
      return cloneDeep(this.$store.getters['game/listGames'])
    }
  },
  async beforeMount() {
    await this.$store.dispatch('game/getGames')
  },
  methods:{
    openModalFormProduct(){
      this.$FModal.show(
        {
          component: FormGame,
          clickToClose: false,
          escToClose: false,
          placement: 'center top',
        },
      )
    }
  },

}
</script>

<style scoped>

</style>
