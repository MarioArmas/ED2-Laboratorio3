import { huffmanEncoding, encode, decode } from './huffman.js'
import Tree from './tree.js'

const dictionary = (key, companyTree, person) => {
  if (key === 'INSERT') companyTree.insert(person)
  if (key === 'PATCH') companyTree.update(person)
  if (key === 'DELETE') companyTree.remove(person)
}

const trees = {}

async function readFile() {
  const file = await fetch('test.txt')
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

  console.log('SEARCH', trees['BANCO S.A.'].tree.search({ dpi: encode('5822613821272', trees['BANCO S.A.'].huffman.dictLetters) })?.map(person => {
    return {...person, 'dpi':decode(person.dpi, trees['BANCO S.A.'].huffman.dictBinary), 'dpiEncoded':person.dpi}
  }))
}

mainFunction(await readFile())