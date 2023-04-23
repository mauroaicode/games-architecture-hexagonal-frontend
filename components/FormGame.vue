<template>
  <div class="py-5 px-9">
    <h1 class="font-bold text-2xl my-5">{{ editGame ? 'Actualizar Juego': 'Agregar Juego'}}</h1>
    <form action="" class="space-y-5">
      <!--  Input Nombre   -->
      <div>
        <label
          for="nameGame"
          class="block text-sm text-gray-500 mb-3 font-bold"
          :class="{ 'text-red-500': $v.form.name.$error }"
        >Nombre del Juego <span class="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="nameGame"
          id="nameGame"
          v-model="form.name"
          :class="[{ 'border-red-300': $v.form.name.$error }]"
          class="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400"
          placeholder="Nombre Juego"
        >
        <p
          class="text-red-400 font-bold text-sm"
          v-if="$v.form.name.$error">
          El nombre es requerido.
        </p>
      </div>
      <!--  Input Url   -->
      <div>
        <label
          for="url"
          class="block text-sm text-gray-500 mb-3 font-bold"
          :class="{ 'text-red-500': $v.form.url.$error && (!$v.form.url.url || !$v.form.url.required) }"
        >Url del Juego<span class="text-red-400"> *</span>
        </label>
        <input
          type="text"
          name="url"
          id="url"
          v-model="form.url"
          :class="[{ 'border-red-300': $v.form.url.$error && (!$v.form.url.url || !$v.form.url.required) }]"
          class="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400"
          placeholder="Url"
        >
        <p
          class="text-red-400 font-bold text-sm"
          v-if="$v.form.url.$error && !$v.form.url.required">
          La url del juego es requerida.
        </p>
        <p
          class="text-red-400 font-bold text-sm"
          v-if="$v.form.url.$error && !$v.form.url.url">
          Ingrese una url válida.
        </p>
      </div>
      <!--  Input Descripción   -->
      <div>
        <label
          for="description"
          class="block text-sm text-gray-500 mb-3 font-bold"
          :class="{ 'text-red-500': $v.form.description.$error }"
        >Descripción <span class="text-red-400">*</span>
        </label>
        <textarea
          :class="[{ 'border-red-300': $v.form.description.$error }]"
          name="description"
          placeholder="Descripción"
          class="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400"
          rows="4"
          v-model="form.description">
            </textarea>
        <p
          class="text-red-400 font-bold text-sm"
          v-if="$v.form.description.$error">
          La descripción es requerida.
        </p>
      </div>
      <!--  Input TOOGLE   -->
      <div class="w-full mb-12">

        <label
          for="toogleA"
          class="block text-sm text-gray-500 mb-3 font-bold flex items-center cursor-pointer"
        >
          <!-- toggle -->
          <div class="relative">
            <!-- input -->
            <input id="toogleA" v-model="form.state" type="checkbox" class="sr-only" />
            <!-- line -->
            <div class="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
            <!-- dot -->
            <div class="dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition"></div>
          </div>
          <!-- label -->
          <div class="ml-3 text-gray-700 font-medium">
            Estado <span
            :class="`${form.state ? 'bg-green-100 text-green-800':'bg-red-100 text-red-800'} text-xs font-medium mr-2 px-2.5 py-0.5 rounded`">{{
              form.state ? 'Disponible' : 'No Disponible'
            }}</span>
          </div>
        </label>

      </div>
      <!--  Agregar Imagen   -->
      <AddImagenGame @dataImage="dataImage" :editGame="editGame" :dataPathImage="form.pathImage" :dataPathImageUrl="form.pathImageUrl" @dataImageUrl="dataImageUrl"/>

      <!--  Botón agregar y editar juego  -->
      <div>
        <button v-if="!editGame" @click="fcAddGame" type="button"
                class="text-white bg-blue-800 w-full hover:bg-green-500 focus:ring-4 focus:ring-green-100 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2  focus:outline-none">
          Agregar Juego
        </button>
        <button v-else @click="fcUpdateGame" type="button"
                class="text-white bg-blue-800 w-full hover:bg-green-500 focus:ring-4 focus:ring-green-100 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2  focus:outline-none">
          Actualizar
        </button>
        <button  @click="fcCancelGame" type="button"
                class="text-white bg-gray-800 w-full hover:bg-green-500 focus:ring-4 focus:ring-green-100 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2  focus:outline-none">
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script>

import {bus} from "../plugins/bus";
import AddImagenGame from "./AddImagenGame";
import {required, url} from "vuelidate/lib/validators";

export default {
  name: "FormGame",
  components: {AddImagenGame},
  data() {
    return {
      gameId: null,
      form: {
        name: String(),
        url: String(),
        pathImageUrl: false,
        pathImage: String(),
        description: String(),
        state: true,
      }
    }
  },
  props:['game', 'editGame'],
  validations: {
    form: {
      name: {required},
      description: {required},
      url: {required, url},
      pathImage: {required}
    },
  },
  methods: {
    validateForm() {
      let validation = false
      bus.$emit('validatePathImage');
      this.$v.form.$touch();
      if (this.$v.$invalid) {
        this.$toast.error('Verifique los campos obligatorios.');
        return validation = true
      }
    },
    dataImage(image){
      if (image){
        this.form.pathImage = image
      }
    },
    dataImageUrl(data){
      console.log(data)
      this.form.pathImageUrl = data
    },
    dataEditGame(data){
      this.form = data
      this.form.pathImageUrl = data.pathImageUrl === 1
    },
    fcCancelGame(){
      this.$v.form.$reset()
      this.$FModal.hide()
    },
    fcAddGame() {
      const validation = this.validateForm()
      if (validation) return true
      this.$swal.fire(
        this.swalAlert('¿Esta seguro de agregar el juego?', 'warning', 'Estoy Seguro', 'Cancelar')
      ).then(async result => {
        if (result.value) {
          let response = await this.$store.dispatch('game/saveGame', this.form)
          if (response){
            this.$FModal.hide()
          }
        }
      })
    },
    fcUpdateGame() {
      const validation = this.validateForm()
      if (validation) return true
      this.$swal.fire(
        this.swalAlert('¿Esta seguro de actualizar el juego?', 'warning', 'Estoy Seguro', 'Cancelar')
      ).then(async result => {
        if (result.value) {
          let response = await this.$store.dispatch('game/updateGame', this.form)
          if (response){
            this.$FModal.hide()
          }
        }
      })
    },
    /*=============================================
    FUNCIÓN PARA LAS OPCIONES DE LA ALERTA DE CONFIRMACIÓN
   =============================================*/
    swalAlert(message, icon, textAccept, textCancel) {
      return {
        title: message,
        icon: icon,
        confirmButtonText: textAccept,
        cancelButtonText: textCancel,
        customClass: {
          confirmButton: 'text-white bg-blue-700 w-full hover:bg-green-500 focus:ring-1 focus:ring-green-600 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2',
          cancelButton: 'text-white bg-gray-700 w-full hover:bg-gray-800 focus:ring-1 focus:ring-gray-600 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2'
        },
        buttonsStyling: false,
        showCancelButton: true,
        reverseButtons: true,
        allowOutsideClick: false,
      }
    }
  },
  mounted() {
    if (this.editGame){
      this.dataEditGame(this.game)
    }
  }
}
</script>

<style scoped>
/* Toggle A */
input:checked ~ .dot {
  transform: translateX(100%);
  background-color: #48bb78;
}

/* Toggle B */
input:checked ~ .dot {
  transform: translateX(100%);
  background-color: #48bb78;
}
</style>
