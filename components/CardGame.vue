<template>
  <div>
    <div
      class="bg-white shadow rounded-lg hover:bg-teal-50 hover:shadow-md hover:shadow-teal-100 hover:transition-shadow">
      <!--  Imagen  -->
      <a :href="game.url" target="_blank">
        <img class="object-cover h-35 w-35 w-full"
             :src="pathImage(game.pathImage)" alt="">
      </a>
      <div class="p-5 space-y-3">
        <!--  Nombre & Estado -->
        <div class="flex justify-between items-center">
          <a class="text-gray-900 flex items-center justify-between" :href="game.url" target="_blank">
            <h3 class="text-lg hover:text-green-400 font-bold truncate text-gray-700" v-text="game.name"></h3>
          </a>
          <span
            :class="`${game.state ? 'bg-green-100 text-green-800':'bg-red-100 text-red-800'} text-xs font-medium px-2.5 py-0.5 rounded`">{{
              game.state ? 'Disponible' : 'No Disponible'
            }}</span>
        </div>
        <!--  Description  -->
        <span class="text-gray-500 text-sm" v-text="game.description"></span>
        <div class="md:flex md:items-center md:justify-between mt-3">
          <!-- Botón de jugar -->
          <div>
            <a :href="game.url"
               target="_blank" type="button"
               :class="`${!game.state ? 'pointer-events-none bg-blue-300 ': 'bg-blue-800'} text-white flex items-center justify-center w-full hover:bg-green-400 focus:ring-4 focus:ring-green-100 font-medium rounded-md text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none`">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                   stroke="currentColor" class="w-4 h-4 mr-1">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
              </svg>
              Jugar
            </a>
          </div>
          <!-- Botones de eliminar y actualizar -->
          <div>
            <div class="flex space-x-2">
              <a @click="deleteGame" class="text-red-500 hover:text-red-400 flex items-center justify-between" href="#">
                Eliminar
              </a>
              <a @click="openModalFormProduct"
                 class="text-blue-700 hover:text-blue-400 flex items-center justify-between" href="#">
                Actualizar
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FormGame from "./FormGame";

export default {
  name: "CardGame",
  props: ['game'],
  methods: {
    async deleteGame() {
      this.$swal.fire(
        {
          title: '¿Esta seguro de eliminar el juego?',
          icon: 'warning',
          confirmButtonText: 'Estoy Seguro',
          cancelButtonText: 'Cancelar',
          customClass: {
            confirmButton: 'text-white bg-blue-700 w-full hover:bg-green-500 focus:ring-1 focus:ring-green-600 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2',
            cancelButton: 'text-white bg-gray-700 w-full hover:bg-gray-800 focus:ring-1 focus:ring-gray-600 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2'
          },
          buttonsStyling: false,
          showCancelButton: true,
          reverseButtons: true,
          allowOutsideClick: false,
        }
      ).then(async result => {
        if (result.value) {
          await this.$store.dispatch('game/deleteGame', this.game)
        }
      })
    },
    openModalFormProduct() {
      this.$FModal.show(
        {
          component: FormGame,
          clickToClose: false,
          escToClose: false,
          placement: 'center top',
        },
        {
          game: this.game,
          editGame: true
        }
      )
    },
    pathImage(image) {
      const url = new URL(image, window.location.href);
      const ruta = url.pathname.split('/');
      const storage = ruta[1];
      switch (storage) {
        case 'storage':
          return this.$config.baseUrlBack + image
        case 'public':
          return image;
      }
      if (image.urlResized) {
        return image.urlResized
      }
    }
  }
}
</script>

<style scoped>

</style>
