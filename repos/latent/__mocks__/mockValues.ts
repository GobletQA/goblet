export const repoUrl = `https://github.com/GobletQA/gobletqa`
export const altUrl = `https://github.com/GobletQA/different-repo`
export const repoToken = `ZmM3ZDQ4Y2UxNzVhNGIxMGE1YmJmODU0MmRmMjhkZjJhZWJhM2NhMmY3NjU1Mjc2ZmI4YzllNjZmNDE3MjFkZQ==`

export const mockEnvObj = {
  TEST_URL: repoUrl,
  TEST_TOKEN: repoToken,
  SOME_ENV: `SECRET-TEST-VALUE`,
}

export const mockFileContent = `
  SOME_ENV="SECRET-TEST-VALUE"
  TEST_URL=${repoUrl}
  TEST_TOKEN=${repoToken}
`

export const mockEncrypted = `5d8ebba14732b6276f1055e4fc4c724fe978f81ee540ab61f873f58cbb943b354bfcfa087435bd1c0689c355a02ef2ecf64b7f86f6a499c105ed6d188f9c447d3f99fb27314b4cf7b122c1315508a27808760ffc4430b1db412c40c987b963234d5e21520c36db203b15609268827eef90c0c869115867867690c57cf0fc55559e8e32abc1192ffc275520fdc58bf606bd3d5247d69d93dc92857f3237bc906ca246b7b18bfe590df80bfd3f0e0f0eba3566b65cfa10d9a260eb57abadd4dd899e40ecd83088f85d45cd37c9ad4f0ab5fbba`