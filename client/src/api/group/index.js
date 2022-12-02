import client from '../client'

export const getGroupById = (id) => {
  return client.create(`/api/v1/groups/get-group/${id}`)
}

export const getOpenGroupsApi =  () => {
  return client.get('/api/v1/groups/open-groups')
}

export const getAllGroupsApi =  () => {
  return client.get('/api/v1/groups/all-groups')
}

export const closeGroupApi = (id) => {
  return client.put(`/api/v1/groups/close-group/${id}`)
}

export const createGroupApi = (name) => {
  return client.create('/api/v1/groups/create-group', { groupName: name })
}

export const joinGroupApi = (id) => {
  return client.create('/api/v1/groups/join-group', { id })
}
