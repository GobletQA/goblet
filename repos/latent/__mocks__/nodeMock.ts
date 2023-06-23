export const fsMock = {
  writeFileSync: jest.fn((loc:string, content?:string) => true)
}