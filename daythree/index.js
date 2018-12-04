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

// --- Part Two ---
// Amidst the chaos, you notice that exactly one claim doesn't overlap by even a single square inch of fabric with any other claim. If you can somehow draw attention to it, maybe the Elves will be able to make Santa's suit after all!

// For example, in the claims above, only claim 3 is intact after all claims are made.

// What is the ID of the only claim that doesn't overlap?

const INPUT = require('./input')

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

  const claimNumber = Number(str.split(' @')[0].slice(1))

  return { id: claimNumber, left, top, width, height }
}

/**
 *
 * @param {Object} fabric array of arrays
 * @param {Object} coordinates object with { id, left, top, width, height } properties
 * @returns {Object}
 */
function cutFabric(fabric, { id, left, top, width, height }) {
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
      newFabric[i][j] = newFabric[i][j] === null ? id : 'X'
    }
  }

  return newFabric
}

/**
 * Count the number of conflicting areas in the fabric (represented by X)
 *
 * @param {Object} fabric
 * @returns {Number} count of conflicts
 */
function countConflicts(fabric) {
  return fabric.reduce((total, row) => {
    return (
      total +
      row.reduce((count, val) => {
        return val === 'X' ? count + 1 : count
      }, 0)
    )
  }, 0)
}

/**
 * Get the number of conflicts using claims from input
 *
 * @param {Object} fabric
 * @param {Object} unformattedInput array of strings
 * @returns {Number} count of conflicts
 */
function getNumberOfConflictsFromInput(fabric, unformattedInput) {
  const parsedInput = parseInput(unformattedInput)
  const resultFabric = parsedInput.reduce((fabric, claim) => {
    return cutFabric(fabric, claim)
  }, fabric)

  return countConflicts(resultFabric)
}

/**
 * Returns whether or not the claim is fully present in the fabric
 *
 * @param {Object} fabric
 * @param {Object} coordinates object with { id, left, top, width, height } properties
 * @returns {Boolean}
 */
function checkClaim(fabric, { id, left, top, width, height }) {
  const firstRow = top
  const lastRow = top + height - 1
  const firstColumn = left
  const lastColumn = left + width - 1

  // go through rows
  for (let i = firstRow; i <= lastRow; i++) {
    // go through columns
    for (let j = firstColumn; j <= lastColumn; j++) {
      if (fabric[i][j] !== id) {
        return false
      }
    }
  }

  return true
}

/**
 * Runner to solve day 3 problem partOne using problem input and on a generated fabric array
 *
 * @returns {Number} number of conflicts
 */
function partOne(input) {
  const fabric = createFabric(1000)

  return getNumberOfConflictsFromInput(fabric, input || INPUT)
}

/**
 * Runner to solve partTwo
 * 
 * @returns {Number|Boolean} id of first successful claim, or false if none
 */
function partTwo(input) {
  const fabric = createFabric(1000)
  const formattedInput = parseInput(input || INPUT)
  const resultFabric = formattedInput.reduce((fabric, claim) => {
    return cutFabric(fabric, claim)
  }, fabric)

  for (let coordinates of formattedInput) {
    if (checkClaim(resultFabric, coordinates) === true) {
      return coordinates.id
    }
  }

  return false
}

module.exports = {
  problems: {
    partOne,
    partTwo
  },
  createFabric,
  parseInput,
  getCoordinates,
  cutFabric,
  countConflicts,
  getNumberOfConflictsFromInput,
  checkClaim,
  partOne,
  partTwo
}
