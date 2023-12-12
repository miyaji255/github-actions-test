import * as path from 'path'

process.exit(validateBlog() ? 0 : 1)

/**
 * 変更されたファイルが許可されているものに含まれているか判定します
 *
 * 許可されているファイルは以下のとおりです。
 * - src/content/blogs/*.{md, mdx}
 * - src/content/blogs/ より一階層下にある画像
 * - src/content/authors/*.json
 * - src/content/authors/ にある画像
 * - src/content/blog-metas/*.json
 * - src/content/tags/*.json
 * - src/content/tags/ にある画像
 */
function validateBlog() {
  let ok = true

  for (const arg of process.argv.slice(2)) {
    const parsedPath = path.parse(arg)

    if (parsedPath.dir === 'src/content/blogs') {
      // ブログ本体
      if (parsedPath.ext === '.md' || parsedPath.ext === '.mdx') continue
    } else if (parsedPath.dir === 'src/content/blog-metas') {
      // ブログのメタ情報
      if (parsedPath.ext === '.json') continue
    } else if (
      parsedPath.dir.match(new RegExp('src/content/blogs/[!(#/)]*/[!(#/)]*'))
    ) {
      // 画像
      if (isImage(parsedPath.ext)) continue
    } else if (
      ['src/content/authors', 'src/content/tags'].includes(parsedPath.dir)
    ) {
      // ブログの著者・タグ
      if (parsedPath.ext === '.json' || isImage(parsedPath.ext)) continue
    }

    console.log(
      `\u001b[31m[ERROR]\tYou are not allowed to change the file: ${arg}\u001b[m`,
    )
    ok = false
  }

  return ok
}

function isImage(ext: string) {
  return [
    '.jpg',
    '.jpeg',
    '.jfif',
    '.pjpeg',
    '.pjp',
    '.png',
    '.svg',
    '.webp',
    '.gif',
    '.avif',
    '.apng',
  ].includes(ext)
}
