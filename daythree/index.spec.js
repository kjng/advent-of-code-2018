const daythree = require('../daythree')
const input = require('../daythree/input')
const createFabric = daythree.createFabric
const parseInput = daythree.parseInput
const getCoordinates = daythree.getCoordinates
const cutFabric = daythree.cutFabric
const countConflicts = daythree.countConflicts
const getNumberOfConflictsFromInput = daythree.getNumberOfConflictsFromInput
const partOne = daythree.partOne
const checkClaim = daythree.checkClaim
const partTwo = daythree.partTwo

describe('Advent of Code: Day Three', () => {
  describe('createFabric', () => {
    it('correctly returns array for n of 1', () => {
      const expected = [[null]]
      expect(createFabric(1)).toEqual(expected)
    })

    it('correctly returns array for n of 2', () => {
      const expected = [[null, null], [null, null]]
      expect(createFabric(2)).toEqual(expected)
    })

    it('correctly returns array for n of 3', () => {
      const expected = [[null, null, null], [null, null, null], [null, null, null]]
      expect(createFabric(3)).toEqual(expected)
    })
  })

  describe('input', () => {
    it('is an array', () => {
      expect(Array.isArray(input)).toBe(true)
    })

    it('contains strings', () => {
      expect(typeof input[0]).toBe('string')
    })
  })

  describe('parseInput', () => {
    const input = ['#1 @ 16,576: 17x14', '#2 @ 0,20: 3x18']

    it('returns an array', () => {
      expect(Array.isArray(parseInput(input))).toBe(true)
    })

    describe('return array', () => {
      it('contains expected objects', () => {
        const expectedFirst = {
          id: 1,
          left: 16,
          top: 576,
          width: 17,
          height: 14
        }

        const expectedSecond = {
          id: 2,
          left: 0,
          top: 20,
          width: 3,
          height: 18
        }

        expect(parseInput(input)[0]).toEqual(expectedFirst)
        expect(parseInput(input)[1]).toEqual(expectedSecond)
      })
    })
  })

  describe('getCoordinates', () => {
    const str = '#1 @ 16,576: 17x14'

    it('returns an object', () => {
      expect(typeof getCoordinates(str)).toBe('object')
    })

    it('returns expected properties', () => {
      const result = getCoordinates(str)

      expect(result.left).toBe(16)
      expect(result.top).toBe(576)
      expect(result.width).toBe(17)
      expect(result.height).toBe(14)
    })
  })

  describe('cutFabric', () => {
    it('returns 1 in positions that are cut (simple, no conflicts)', () => {
      const fabric = createFabric(3)
      const coordinates = getCoordinates('#1 @ 1,1: 2x2')
      const result = cutFabric(fabric, coordinates)
      const expected = [[null, null, null], [null, 1, 1], [null, 1, 1]]

      expect(fabric).not.toBe(expected)
      expect(typeof result).toBe('object')
      expect(result).toEqual(expected)
    })

    it('returns 1 in positions that are cut (complex, no conflicts)', () => {
      const fabric = createFabric(11)
      const coordinates = getCoordinates('#1 @ 3,2: 5x4')
      const result = cutFabric(fabric, coordinates)
      const expected = [
        [null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, 1, 1, 1, 1, 1, null, null, null],
        [null, null, null, 1, 1, 1, 1, 1, null, null, null],
        [null, null, null, 1, 1, 1, 1, 1, null, null, null],
        [null, null, null, 1, 1, 1, 1, 1, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null]
      ]

      expect(result).toEqual(expected)
    })

    it('returns 2 in positions that have been attempted to be cut twice (conflicts)', () => {
      const fabric = [[null, null, null], [null, 1, 1], [null, 1, 1]]
      const coordinates = getCoordinates('#1 @ 0,0: 2x2')
      const result = cutFabric(fabric, coordinates)
      const expected = [[1, 1, null], [1, 'X', 1], [null, 1, 1]]

      expect(result).toEqual(expected)
    })

    it('returns X in positions that have attempted to be cut repeatedly (conflicts)', () => {
      const fabric = [[null, null, null], [null, null, null], [null, null, null]]
      const coordinates = getCoordinates('#123 @ 0,0: 2x2')

      // cut three times using same coords
      const result = cutFabric(cutFabric(cutFabric(fabric, coordinates), coordinates), coordinates)
      const expected = [['X', 'X', null], ['X', 'X', null], [null, null, null]]

      expect(result).toEqual(expected)
    })
  })

  describe('countConflicts', () => {
    const fabric = [[1, 'X', 1], [1, 1, 'X'], ['X', 1, null]]
    const result = countConflicts(fabric)

    it('returns a number', () => {
      expect(typeof result).toBe('number')
    })

    it('returns the correct number of conflicts', () => {
      expect(result).toBe(3)
    })
  })

  describe('getNumberOfConflictsFromInput', () => {
    const fabric = createFabric(5)
    const input = ['#1 @ 0,0: 2x2', '#2 @ 0,0: 2x2', '#3 @ 0,0: 2x2']
    const result = getNumberOfConflictsFromInput(fabric, input)

    it('returns a number', () => {
      expect(typeof result).toBe('number')
    })

    it('returns correct result', () => {
      expect(result).toBe(4)
    })
  })

  describe('partOne', () => {
    it('is a function', () => {
      expect(typeof partOne).toBe('function')
    })
  })

  describe('checkClaim', () => {
    it('returns true if the claim was successful', () => {
      const coordinates = parseInput(['#1 @ 0,0: 2x2'])
      const result = checkClaim(createFabric(2), coordinates)

      expect(result).toBe(true)
    })

    it('returns false if the claim was unsuccessful (conflicts)', () => {
      const coordinates = parseInput(['#1 @ 0,0: 2x2', '#2 @ 0,0: 2x2'])
      const conflictFabric = cutFabric(cutFabric(createFabric(2), coordinates[0]), coordinates[1])
      const result = checkClaim(conflictFabric, coordinates[0])

      expect(result).toBe(false)
    })
  })

  describe('partTwo', () => {
    it('is a function', () => {
      expect(typeof partTwo).toBe('function')
    })
  })
})
