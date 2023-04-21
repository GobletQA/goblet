
import { Client, Account } from 'appwrite'
import { GB_APPWRITE_URL, GB_APPWRITE_PROJECT } from '@constants'

export const client = new Client()

client
  .setEndpoint(GB_APPWRITE_URL)
  .setProject(GB_APPWRITE_PROJECT)


export const account = new Account(client)


