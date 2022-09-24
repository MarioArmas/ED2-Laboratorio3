import Tree from './tree.js'
import { huffmanEncoding, encode, decode } from './huffman.js'
import { lz78Encoding, lz78Decoding } from './lz78.js'

const dictionary = (key, companyTree, person) => {
  if (key === 'INSERT') companyTree.insert(person)
  if (key === 'PATCH') companyTree.update(person)
  if (key === 'DELETE') companyTree.remove(person)
}

const trees = {}

async function readFile() {
  const file = await fetch('input.csv')
  .then(response => response.text())
  .then(data => {
    return data.split('\r\n')
      .filter(el => el != '')
      .map(operation => {
        const text = operation.split(';')
        return [text[0], JSON.parse(text[1])]
      })
  })

  return file
}

async function mainFunction(data) {
  data.forEach((item) => {
    const operationString = item[0]
    const person = item[1]
    person?.address
    person?.datebirth
    person?.companies
    //person.letters = getLetters(person.dpi)

    person?.companies?.forEach(company => {
      // create tree for each company
      const personToStore = {...person}
      trees[company] ??= {
        'tree': new Tree,
        'name': company,
        'huffman': huffmanEncoding(company + '0123456789')
      }

      // execute function from file
      const huffman = trees[company].huffman
      personToStore.dpi = encode(person.dpi, huffman.dictLetters)
      dictionary(operationString, trees[company].tree, personToStore)
      trees[company].tree.sortByDPI()
    })
  })

  const companyName = 'Bogisich Group'
  const dpiSearch = '1041443605068'
  const treeFromCompany = trees[companyName]
  const lettersCompressed = await getLetters(dpiSearch)
  const letters = lettersCompressed.map((letter) => {
    const { dictionary, textCompressed } = letter
    return lz78Decoding(dictionary, textCompressed)
  })

  console.log('SEARCH', treeFromCompany.tree.search({ dpi: encode(dpiSearch, treeFromCompany.huffman.dictLetters) })?.map(person => {
    return {
      ...person,
      'dpi': decode(person.dpi, treeFromCompany.huffman.dictBinary),
      'dpiEncoded': person.dpi,
      'lettersCompressed': lettersCompressed,
      'letters': letters
    }
  }))
}

async function getLetters(dpi) {
  let destroy = false
  const letters = []
  for (let i = 1; i < 100; i++) {
    const path = '/inputs/inputs/REC-' + dpi + '-' + i + '.txt'

    const compressedLetter = await fetch(path)
      .then(response => {
        if (!response.ok) {
          destroy = true
          return -1
        }
        return response.text()
      })
      .then(data => {
        if (data != -1) return lz78Encoding(data)
      })

    letters.push(compressedLetter)
    if (letters[letters.length - 1] == undefined) letters.pop()
    if (destroy) break
  }

  return letters
}

mainFunction(await readFile())