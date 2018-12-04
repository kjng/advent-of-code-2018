// --- Day 3: No Matter How You Slice It ---
// The Elves managed to locate the chimney-squeeze prototype fabric for Santa's suit (thanks to someone who helpfully wrote its box IDs on the wall of the warehouse in the middle of the night). Unfortunately, anomalies are still affecting them - nobody can even agree on how to cut the fabric.

// The whole piece of fabric they're working on is a very large square - at least 1000 inches on each side.

// Each Elf has made a claim about which area of fabric would be ideal for Santa's suit. All claims have an ID and consist of a single rectangle with edges parallel to the edges of the fabric. Each claim's rectangle is defined as follows:

// The number of inches between the left edge of the fabric and the left edge of the rectangle.
// The number of inches between the top edge of the fabric and the top edge of the rectangle.
// The width of the rectangle in inches.
// The height of the rectangle in inches.
// A claim like #123 @ 3,2: 5x4 means that claim ID 123 specifies a rectangle 3 inches from the left edge, 2 inches from the top edge, 5 inches wide, and 4 inches tall. Visually, it claims the square inches of fabric represented by # (and ignores the square inches of fabric represented by .) in the diagram below:

// ...........
// ...........
// ...#####...
// ...#####...
// ...#####...
// ...#####...
// ...........
// ...........
// ...........
// The problem is that many of the claims overlap, causing two or more claims to cover part of the same areas. For example, consider the following claims:

// #1 @ 1,3: 4x4
// #2 @ 3,1: 4x4
// #3 @ 5,5: 2x2
// Visually, these claim the following areas:

// ........
// ...2222.
// ...2222.
// .11XX22.
// .11XX22.
// .111133.
// .111133.
// ........
// The four square inches marked with X are claimed by both 1 and 2. (Claim 3, while adjacent to the others, does not overlap either of them.)

// If the Elves all proceed with their own plans, none of them will have enough fabric. How many square inches of fabric are within two or more claims?

/**
 * Create multi-dimensional array of null values "n x n"
 *
 * @param {Number} n dimensions
 */
function createFabric(n) {
  // n x n multidimensional array with null values
  const fabric = []

  // add rows
  for (let i = 0; i < n; i++) {
    fabric.push([])
  }

  // add columns
  for (let row of fabric) {
    for (let k = 0; k < n; k++) {
      row.push(null)
    }
  }

  return fabric
}

/**
 * Returns formatted input which will be easier to use to solve the problem
 *
 * @param {Array} input array of strings
 */
function parseInput(input) {
  return input.map(x => getCoordinates(x))
}

/**
 * Returns coordinates from a single input string
 *
 * @param {String} str ex: "#1 @ 16,576: 17x14"
 */
function getCoordinates(str) {
  const [left, top] = str
    .split('@ ')[1]
    .split(':')[0]
    .split(',')
    .map(x => Number(x))

  const [width, height] = str
    .split('@ ')[1]
    .split(': ')[1]
    .split('x')
    .map(x => Number(x))

  return { left, top, width, height }
}

/**
 * 
 * @param {Object} fabric array of arrays
 * @param {Object} coordinates object with { left, top, width, height } properties
 * @returns {Object}
 */
function cutFabric(fabric, { left, top, width, height }) {
  const newFabric = fabric.slice().map(innerArray => innerArray.slice())
  const firstRow = top
  const lastRow = top + height - 1
  const firstColumn = left
  const lastColumn = left + width - 1

  // go through rows
  for (let i = firstRow; i <= lastRow; i++) {

    // go through columns
    for (let j = firstColumn; j <= lastColumn; j++) {

      // cut position using 1 if first cut, 2 if cut before
      newFabric[i][j] = newFabric[i][j] === 1 || newFabric[i][j] === 2 ? 2 : 1
    }
  }

  return newFabric
}

/**
 * Count the number of conflicting areas in the fabric (represented by 2)
 * 
 * @param {Object} fabric 
 * @returns {Number} count of conflicts
 */
function countConflicts(fabric) {
  return fabric.reduce((total, row) => {
    return total + row.reduce((count, val) => {
      return val === 2 ? count + 1 : count
    }, 0)
  }, 0)
}

function getNumberOfConflictsFromInput(fabric, unformattedInput) {
  const parsedInput = parseInput(unformattedInput)
  const resultFabric = parsedInput.reduce((fabric, claim) => {
    return cutFabric(fabric, claim)
  }, fabric)

  return countConflicts(resultFabric)
}

/**
 * Runner to solve day 3 problem using problem input and on a generated fabric array
 * 
 * Answer is 111630
 */
function partOne() {
  const input = require('./input')
  const fabric = createFabric(1000)

  return getNumberOfConflictsFromInput(fabric, input)
}

module.exports = {
  problems: {
    partOne
  },
  createFabric,
  parseInput,
  getCoordinates,
  cutFabric,
  countConflicts,
  getNumberOfConflictsFromInput,
  partOne
}
