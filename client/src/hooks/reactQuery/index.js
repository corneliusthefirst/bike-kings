import { useQuery } from 'react-query'
import {
  getPendingRequestsApi,
  getOutGoingRequestsApi,
  allFriendsRequestApi,
} from '../../api/friend'
import { getOpenRoomsApi } from '../../api/room'
import { getProfile, getUsers } from '../../api/account'
import {
  PENDING_REQUESTS_KEY,
  OUT_GOING_REQUESTS_KEY,
  ALL_FRIENDS_KEY,
  ACCOUNT_KEY,
  OPEN_ROOMS,
  USERS_KEY,
  ALL_GROUPS_KEY,
  OPEN_GROUPS,
} from '../../constants/queryKeys'
import { getAllGroupsApi, getOpenGroupsApi } from '../../api/group'

export  function PendingRequests() {
  return useQuery(PENDING_REQUESTS_KEY,  async () => {
    return await getPendingRequestsApi()
  })
}

export async function OutGoingRequests() {
  return useQuery(OUT_GOING_REQUESTS_KEY, async () => {
    return await getOutGoingRequestsApi()
  
  })
}

export function AllFriendsRequests() {
  return useQuery(ALL_FRIENDS_KEY, async () => {
    return await allFriendsRequestApi()
  })
}

export function Me(user) {
  return useQuery(ACCOUNT_KEY, async () => {
    if (user) {
      return await getProfile(user?.id).then((res) => res.data)
    }
    return null
  })
}

export function GetOpenRooms() {
  return useQuery(OPEN_ROOMS, async () => {
    return await getOpenRoomsApi()
  })
}

export function GetAllUsers() {
  return useQuery(USERS_KEY, async () => {
      return await getUsers()
  })
}

// For group chat

export function GetOpenGroups() {
  return useQuery(OPEN_GROUPS, async () => {
    return await getOpenGroupsApi()
  })
}

export function GetAllGroups() {
  return useQuery(ALL_GROUPS_KEY, async () => {
    return await getAllGroupsApi()
  })
}