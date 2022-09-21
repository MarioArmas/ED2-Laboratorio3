class HuffmanNode {
  constructor() {
    this.data = 0
    this.character = ''
    this.left = null
    this.right = null
  }
}

function makeQueue(charArray, charFrequency) {
  const queue = []
  const n = charArray.length

  for (let i = 0; i < n; i++) {
    let node = new HuffmanNode()

    node.character = charArray[i]
    node.data = charFrequency[i]
    node.left = null
    node.right = null
    queue.push(node)
  }

  queue.sort((a, b) => a.data - b.data)
  return queue
}

function getChars(string) {
  const allChars = string.replace(/\s+/g, '').toLowerCase().split('')
  const charArray = [...new Set(allChars)]
  const charFrequency = []
  
  charArray.forEach(char => {
    charFrequency.push(allChars.filter(x => x == char).length)
  })

  return { charArray, charFrequency }
}

export function huffmanEncoding(string) {
  const { charArray, charFrequency } = getChars(string)
  let root = null
  const queue = makeQueue(charArray, charFrequency)

  while (queue.length > 1) {
    let x = queue.shift()
    let y = queue.shift()
    let f = new HuffmanNode()
    f.data = x.data + y.data
    f.character = '-'
    f.left = x
    f.right = y
    root = f
    queue.push(f)
    queue.sort((a, b) => a.data - b.data)
  }

  const dict = getTree(root, "", []).flat(99)
  const dictLetters = {}
  const dictBinary = {}

  for (let i = 0; i < dict.length; i += 2) {
    dictLetters[dict[i]] = dict[i + 1]
    dictBinary[dict[i + 1]] = dict[i]
  }

  return { "huffmanTree": root , dictLetters, dictBinary }
}

function getTree(root, s, dict) {
  if (root.left == null && root.right == null) {
    dict = ([...[root.character, s]])

    return dict
  }

  return [...dict, getTree(root.left, s + '0', dict) , getTree(root.right, s + '1', dict)]
}

export function encode(stringToEncode, dict) {
  let binary = ''
  stringToEncode.replace(/\s+/g, '').toLowerCase().split('').forEach(char => {
    binary += dict[char]
  })

  return binary
}

export function decode(binaryToDecode, dict) {
  const binary = binaryToDecode.split('')
  let i = 0
  let j = 1
  let word = ''

  while (j <= binary.length) {
    word += dict[binary.slice(i, j).join('')] ? dict[binary.slice(i, j).join('')] : ''

    if (dict[binary.slice(i, j).join('')]) i = j
    j += 1
  }

  return word
}