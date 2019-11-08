const CryptoJS = require('crypto-js')

const KEY = require('./private').key || '3esooNU9qo5J8T4FapH7'

export function encryptByDES(message) { // 传入加密的内容
  // 把私钥转换成16进制的字符串
  const keyHex = CryptoJS.enc.Utf8.parse(KEY)
  // 模式为ECB padding为Pkcs7
  const result = CryptoJS.DES.encrypt(message, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  // 加密出来是一个16进制的字符串
  return result.ciphertext.toString()
}

export function decryptByDES(cypherString) {
  const keyHex = CryptoJS.enc.Utf8.parse(KEY)
  const decrypted = CryptoJS.DES.decrypt({
    ciphertext: CryptoJS.enc.Hex.parse(cypherString)
  }, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return decrypted.toString(CryptoJS.enc.Utf8)
}

// 编码成Base64
export function encodeBase64(str) {
  const wordArray = CryptoJS.enc.Utf8.parse(str)
  return CryptoJS.enc.Base64.stringify(wordArray)
}

// Base64解码
export function decodeBase64(ciphertext) {
  var parsedWordArray = CryptoJS.enc.Base64.parse(ciphertext)
  return parsedWordArray.toString(CryptoJS.enc.Utf8)
}
