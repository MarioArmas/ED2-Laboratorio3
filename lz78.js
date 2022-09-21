function lz78Encoding(text) {
  const dictionary = ['']
  const textCompressed = []
  let charsToAdd = ''
  let dictReference = 0
  let done = true
  
  for (let i of text) {
    charsToAdd += i
    if (!done) {
      dictionary.push(dictionary[dictReference] + i)
      textCompressed.push({ dictReference, char: i })
      charsToAdd = ''
      done = true
      continue
    }

    for (let j = 1; j < dictionary.length; j++) {
      if (dictionary[j] === charsToAdd) {
        dictReference = j
        j = dictionary.length
        charsToAdd = ''
        done = false
      }
    }

    if (done) {
      console.log(dictReference, charsToAdd)
      dictionary.push(dictionary[dictReference] + charsToAdd)
      textCompressed.push({ dictReference, char: charsToAdd })
      charsToAdd = ''
    }
  }

  return { dictionary, textCompressed }
}

function lz78Decoding(dict, textCompressed) {
  let text = ''
  textCompressed.forEach(obj => {
    const { dictReference, char } = obj
    text += dict[dictReference] + char
  })

  return text
}

const word = 'ABRACADRABRARAAAA'
const { dictionary, textCompressed } = lz78Encoding(word)
console.log(dictionary)
console.log(textCompressed)

console.log(lz78Decoding(dictionary, textCompressed))
console.log(word)