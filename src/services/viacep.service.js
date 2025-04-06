import axios from 'axios'

const viaCepService = {
  getAddressByCep: async (cep) => {
    const cleanCep = cep.replace(/\D/g, '')
    const response = await axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`)
    return response.data
  }
}

export default viaCepService
