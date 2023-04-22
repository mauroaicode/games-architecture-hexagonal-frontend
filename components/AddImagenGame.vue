<template>
  <div>
    <label
      for="image"
      :class="{ 'text-red-500': $v.pathImage.$error }"
      class="block text-sm text-gray-500 mb-3 font-bold"
    >Imagen del Juego <span class="text-red-400">*</span>
    </label>
    <p
      class="text-red-400 font-bold text-sm mb-4"
      v-if="$v.pathImage.$error">
      La imagen es requerida.
    </p>

    <div v-if="editGame" class="my-4">
      <h5 class="text-blue-800 hover:text-green-500 cursor-pointer" @click="editImageGame">
        {{ editImage ? 'Cancelar' : 'Cambiar Imagen' }}</h5>
    </div>
    <!--  Imagen del Juego   -->
    <div v-if="editGame" class="flex justify-center">
      <img v-if="!editImage" class="object-contain w-100 h-60"
           :src="pathImage ? fcPathImage(pathImage): require(`~/assets/images/image-demo.png`)"
           alt="">
    </div>

    <div class="space-y-5" v-if="editImage || !editGame">
      <div class="flex items-center mb-4">
        <input checked id="default-radio-1" v-model="pathImageUrl" type="radio" :value="true" name="default-radio"
               class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
        <label for="default-radio-1" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Subir
          Imagen</label>
      </div>
      <div class="flex items-center">
        <input id="default-radio-2" v-model="pathImageUrl" type="radio" :value="false" name="default-radio"
               class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
        <label for="default-radio-2" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Agregar Imagen
          Url</label>
      </div>

      <div v-if="pathImageUrl">
        <UploadPicture @imageRecords="image" :gameId="gameId" v-if="editImage || !editGame" ref="uploadPicture"/>
      </div>
      <div v-else>
        <label
          for="urlImageGame"
          class="block text-sm text-gray-500 mb-3 font-bold"
          :class="{ 'text-red-500': $v.pathImage.$error }"
        >Url Imagen <span class="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="urlImageGame"
          id="urlImageGame"
          v-model="pathImage"
          :class="[{ 'border-red-300': $v.pathImage.$error }]"
          class="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400"
          placeholder="Url imagen"
        >

      </div>

    </div>

  </div>
</template>

<script>
import {required} from "vuelidate/lib/validators";
import {bus} from "../plugins/bus";

export default {
  name: "AddImagenGame",
  data() {
    return {
      editImage: false,
      pathImageUrl: false,
      pathImage: String()
    }
  },
  props: ['gameId', 'editGame', 'dataPathImage'],
  validations: {
    pathImage: {required}
  },
  methods: {
    fcPathImage(image) {
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
    },
    validation() {
      if (!this.editGame) {
        this.$v.$touch();
        if (!this.$v.$invalid) {
          return
        }
      }
    },
    editImageGame() {
      this.editImage = !this.editImage
    },
    image(file) {
      this.pathImage = file[0]
    },
  },
  mounted() {
    bus.$on('validatePathImage', () => {
      this.validation()
    })
  },
  watch: {
    dataPathImage:function (val) {
      if (this.editGame){
        this.pathImage = val
      }
    },
    // immediate: true,
    pathImage: {
      handler(val) {
        setTimeout(() => {
          if (val) {
            this.$emit('dataImage', val)
          }
        }, 200)
      },
      deep: true
    },
    pathImageUrl: {
      handler(val) {
        setTimeout(() => {
          if (val) {
            this.$emit('dataImageUrl', val)
          }
        }, 200)
      },
      deep: true
    },
  }
}
</script>

<style scoped>

</style>
