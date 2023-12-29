/**
 * **IMPORTANT** - Should only ever be used in the backend API docker image
 * This mock is used instead of the normal @gobletqa/repo to make the image smaller
 * The backend API only needs the `getUserRepos` method from the `@gobletqa/workflows` package
 * But because of that, it has to install all it's dependencies which makes the image much larger
 * So instead we mock the `@gobletqa/repo` package, and alias to it instead
 * This allows us to remove from the image, and keep the size down
 */

const noOp = () => {}

export const repoSecrets = noOp
export const ensureMounted = noOp
export const resetCachedWorld = noOp
export class Repo {}

