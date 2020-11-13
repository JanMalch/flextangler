module.exports.readVersion = function (contents) {
  const regex = /<meta name="version" content="(.+)"/i;
  return regex.exec(contents)?.[1];
}

module.exports.writeVersion = function (contents, version) {
  return contents
    // update meta version tag
    .replace(/<meta name="version" content="(.+)"/i, `<meta name="version" content="${version}"`)
    // update version in footer
    .replace(/>v\d+\.\d+\.\d+<\/a/i, `>v${version}</a`)
    // update copyright
    .replace(/&bullet; &copy; JanMalch, \d{4}/i, `&bullet; &copy; JanMalch, ${new Date().getFullYear()}`)
    // update meta date tag
    .replace(/<meta name="dc.created" content=".*?"/i, `<meta name="dc.created" content="${new Date().toJSON()}"`)
}
