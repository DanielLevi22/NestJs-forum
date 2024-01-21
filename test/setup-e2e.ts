import { PrismaClient } from "@prisma/client";
import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";


const prisma = new PrismaClient()




function generateUniqueDataBaseUrl(SchemaId:string) {
  if(!process.env.DATABASE_URL) {
    throw new Error('Please provider a DATABASE_URL environment variable')
  }
  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', SchemaId)
  return url.toString()
}


const schemaId = randomUUID()
beforeAll(() => {
  const databaseURL = generateUniqueDataBaseUrl(schemaId)
  process.env.DATABASE_URL = databaseURL

  execSync('npx prisma migrate deploy')
})
afterAll( async() => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
})