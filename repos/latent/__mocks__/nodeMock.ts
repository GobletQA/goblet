export const fsMock = {
  existsSync: jest.fn((loc:string, content?:string) => true),
  writeFileSync: jest.fn((loc:string, content?:string) => true),
}