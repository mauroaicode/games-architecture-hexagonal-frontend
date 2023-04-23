// Define el estado inicial de la aplicación en Vuex, que contiene la lista de juegos y un indicador de carga de datos.
export const state = () => ({
  games: [],
  dataLoading: false
})
// Las mutaciones se utilizan para modificar el estado de la aplicación en Vuex.
export const mutations = {
  // Modifica el estado de dataLoading a true, lo que indica que no hay datos disponibles.
  notData(state) {
    state.dataLoading = true
  },
  // Establece el estado de la lista de juegos y dataLoading a false si se proporcionan datos, o establece dataLoading a true si no hay datos.
  setGames(state, data) {
    if (data.length > 0) {
      state.games = data
      state.dataLoading = false
    } else {
      state.dataLoading = true
    }
  },
  // Agrega un nuevo juego a la lista de juegos y establece el estado de dataLoading a false.
  setGame(state, data) {
    if (data) {
      state.games.unshift(data)
      state.dataLoading = false
    }
  },
  // Actualiza un juego en la lista de juegos y establece el estado de dataLoading a false.
  updateGame(state, data) {
    if (data) {
      state.games.map(item => {
        if (item.id === data.id) {
          item.name = data.name
          item.description = data.description
          item.url = data.url
          item.pathImage = data.pathImage
          item.state = data.state
        }
      })
    }
  },
  // Elimina un juego de la lista de juegos y establece el estado de dataLoading a true si no quedan juegos.
  deleteGame(state, data) {
    if (data) {
      const index = state.games.findIndex(game => game.id === data.id);
      console.log(index)
      state.games.splice(index, 1)
      if(state.games.length === 0){
        state.dataLoading = true
      }
    }
  }
}
// Los getters se utilizan para acceder al estado de la aplicación en Vuex.
export const getters = {
  // Devuelve la lista de juegos.
  listGames: state => state.games
}
// Las acciones se utilizan para realizar operaciones asincrónicas en Vuex.
export const actions = {
  // Recupera la lista de juegos desde la API y la establece en el estado de la aplicación, o establece dataLoading a true si no hay juegos disponibles.
  async getGames({commit, state}) {
    try {
      const response = await this.$axios.get('/api/v1/games')
      console.log(response)
      if (response && response.data.data && response.data.data.length > 0) {
        commit('setGames', response.data.data)
        return true
      } else {
        commit('notData')
        console.log('No se encontraron juegos')
        return false
      }
    } catch (error) {
      commit('notData')
      console.log(error)
      return false
    }
  },
  // Agrega un nuevo juego a la API y a la lista de juegos en el estado de la aplicación.
  async saveGame({commit, state}, data) {
    let resp
    try {
      resp = await this.$axios.post(
        '/api/v1/create/game',
        data
      )
      if (resp.status === 201) {
        commit('setGame', resp.data.data)
        this.$toast.success('Juego agregado exitosamente!');
        return resp = true
      } else {
        console.log(resp)
        return resp = false
      }

    } catch (e) {
      this.$toast.error('Error al agregar el juego.');
      console.log('ERROR', e)
      return resp = false
    }
  },
  // Actualiza un juego existente en la lista de juegos
  async updateGame({commit, state}, data) {
    let resp
    try {
      resp = await this.$axios.put(
        `/api/v1/update/game/${data.id}`,
        data
      )
      if (resp.status === 200) {
        commit('updateGame', resp.data.data)
        this.$toast.success('Juego actualizado exitosamente!');
        return resp = true
      } else {
        console.log(resp)
        return resp = false
      }

    } catch (e) {
      this.$toast.error('Error al actualizar el juego.');
      console.log('ERROR', e)
      return resp = false
    }
  },
  // Eliminar un juego existente en la lista de juegos
  async deleteGame({commit, state}, data) {
    let resp
    try {
      resp = await this.$axios.delete(
        `/api/v1/delete/game/${data.id}`)
      if (resp.status === 200) {
        commit('deleteGame', data)
        this.$toast.success('Juego eliminado exitosamente!');
        return resp = true
      } else {
        console.log(resp)
        return resp = false
      }

    } catch (e) {
      this.$toast.error('Error al eliminar el juego.');
      console.log('ERROR', e)
      return resp = false
    }
  },
}

