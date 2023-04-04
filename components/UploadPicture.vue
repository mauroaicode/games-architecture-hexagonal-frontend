<template>
  <div>
    <client-only>
      <VueFileAgent
        ref="vueFileAgent"
        :theme="'list'"
        :multiple="true"
        :deletable="true"
        :meta="true"
        :accept="'image/*'"
        :maxSize="'10MB'"
        :maxFiles="1"
        :helpText="'Clic o arrastre aquí la imagen del juego.'"
        :errorText="{
      type: 'Tipo de archivo incorrecto',
      size: 'Este archivo no se enviará. Los archivos no deben superar los 15 MB de tamaño',
    }"
        v-model="fileRecords"
        @beforedelete="onBeforeDelete($event)"
        @delete="fileDeleted($event)"
      ></VueFileAgent>
    </client-only>
  </div>
</template>

<script>
import {bus} from "../plugins/bus";

export default {
  name: "UploadPicture",
  data() {
    return {
      fileRecords: [],
      uploadHeaders: '',
      // uploadUrl: `${this.$config.baseUrlBack}/api/v1/upload-picture/${this.productId}`,
      fileRecordsForUpload: []
    }
  },
  props:['productId'],
  methods: {
    uploadFiles: function () {
      if (this.fileRecordsForUpload.length > 0) {
        /* Componente Loading*/
        this.$vs.loading({
          color: this.$config.colorLoading,
          text: 'Subiendo imagen. Espere por favor...'
        })

        this.$refs.vueFileAgent.upload(this.uploadUrl, this.uploadHeaders, this.fileRecordsForUpload).then(resp => {
          this.$vs.loading.close()
          this.$toast.success(`La carga de la imagen fue exitoso!`);
        }).catch(e => {
          console.log(e)
          this.$toast.error("Error al subir la imagen. Consulte con el administrador.");
          this.$vs.loading.close()
        });
        this.$vs.loading.close()
        // this.$refs.vueFileAgent.upload
        this.fileRecordsForUpload = [];
      } else {
        if (this.productId > 0) {
          this.$toast.error("Debe agregar imagen.");
          this.$vs.loading.close()
        }
        this.$vs.loading.close()
      }

    },
    deleteUploadedFile: function (fileRecord) {
      // Using the default uploader. You may use another uploader instead.
      this.$refs.vueFileAgent.deleteUpload(this.uploadUrl, this.uploadHeaders, fileRecord);
    },
    filesSelected: function (fileRecordsNewlySelected) {
      let validFileRecords = fileRecordsNewlySelected.filter((fileRecord) => !fileRecord.error);
      this.fileRecordsForUpload = this.fileRecordsForUpload.concat(validFileRecords);
    },
    onBeforeDelete: function (fileRecord) {
      let i = this.fileRecordsForUpload.indexOf(fileRecord);
      if (i !== -1) {
        // queued file, not yet uploaded. Just remove from the arrays
        this.fileRecordsForUpload.splice(i, 1);
        let k = this.fileRecords.indexOf(fileRecord);
        if (k !== -1) this.fileRecords.splice(k, 1);
      } else {
        this.$refs.vueFileAgent.deleteFileRecord(fileRecord); // will trigger 'delete' event
      }
    },
    fileDeleted: function (fileRecord) {
      let i = this.fileRecordsForUpload.indexOf(fileRecord);
      if (i !== -1) {
        this.fileRecordsForUpload.splice(i, 1);
      } else {
        this.deleteUploadedFile(fileRecord);
      }
    },
  },
  watch:{
    fileRecords: function (val) {
      if (val){
        this.$emit('imageRecords', val)
      }
    }
  },
}
</script>

<style scoped>

</style>
