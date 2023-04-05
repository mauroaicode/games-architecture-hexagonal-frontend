export const state = () => ({
  games: [],
  dataLoading: false
})

export const mutations = {
  setGames(state, data) {
    if (data.length > 0) {
      state.games = data
    }else{
      state.dataLoading = true
    }
  },
  setGame(state, data) {
    if (data) {
      state.games.unshift(data)
    }
  },
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
  deleteGame(state, data) {
    if (data) {
      const index = state.games.findIndex(game => game.id === data.id);
      console.log(index)
      state.games.splice(index, 1)
    }
  }
}
export const getters = {
  listGames: state => state.games
}
export const actions = {
  getGames({commit, state}) {
    this.$axios.$get('/api/games').then(resp => {
      commit('setGames', resp.data)
    }).catch(e => {
      console.log('ERROR ', e)
      this.$toast.error('Error al obtener los juegos.');
      state.dataLoading = true
    })
  },
  async saveGame({commit, state}, data) {
    let resp
    try {
      resp = await this.$axios.post(
        '/api/create/game',
        data
      )
      if (resp.status === 200) {
        commit('setGame', data)
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
  async updateGame({commit, state}, data) {
    let resp
    try {
      resp = await this.$axios.put(
        `/api/update/game/${data.id}`,
        data
      )
      if (resp.status === 200) {
        commit('updateGame', data)
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
  async deleteGame({commit, state}, data) {
    let resp
    try {
      resp = await this.$axios.delete(
        `/api/delete/game/${data.id}`)
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

