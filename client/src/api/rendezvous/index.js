import client from '../client'

export const getRendezVousById = (id) => {
  return client.create(`/api/v1/rendezvous/get-rendezvous/${id}`)
}

export const getAllRendezVoussApi =  () => {
  return client.get('/api/v1/rendezvous/all-rendezvous')
}

export const deleteAllUserRendezVousApi = (id) => {
  return client.put(`/api/v1/rendezvous/delete-all-rendezvous/${id}`)
}

export const createRendezVousApi = (date) => {
  const type = localStorage.getItem('typeUsage')
  return client.create('/api/v1/rendezvous/create-rendezvous', { date, type: type || 'DEFAULT' })
}

export const getAllRendezVousPerType = (type) => {
  return client.create(`/api/v1/rendezvous/all-rendezvous/type/${type}`)
}


