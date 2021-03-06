JS.ENV.Canopy.Compiler.CharClassSpec = JS.Test.describe("Canopy.Compiler.CharClass",
function() { with(this) {
  include(Canopy.SpecHelper)

  describe('positive', function() { with(this) {
    before(function() { with(this) {
      Canopy.compile('grammar JS.ENV.PositiveCharClassTest\
        charClass <- [a-z]')
    }})

    it('parses characters within the class', function() { with(this) {
      assertParse( ['a', 0, []], PositiveCharClassTestParser.parse('a') )
    }})

    it('does not parse characters outside the class', function() { with(this) {
      assertThrows(Error, function() { PositiveCharClassTestParser.parse('7') })
      assertEqual({
          input:    '7',
          offset:   0,
          expected: '[a-z]'
        }, PositiveCharClassTestParser.lastError)
    }})

    it('does not parse characters within the class appearing too late', function() { with(this) {
      assertThrows(Error, function() { PositiveCharClassTestParser.parse('7a') })
      assertEqual({
          input:    '7a',
          offset:   0,
          expected: '[a-z]'
        }, PositiveCharClassTestParser.lastError)
    }})
  }})

  describe('negative', function() { with(this) {
    before(function() { with(this) {
      Canopy.compile('grammar JS.ENV.NegativeCharClassTest\
        charClass <- [^a-z]')
    }})

    it('parses characters within the class', function() { with(this) {
      assertParse( ['7', 0, []], NegativeCharClassTestParser.parse('7') )
    }})

    it('does not parse characters outside the class', function() { with(this) {
      assertThrows(Error, function() { NegativeCharClassTestParser.parse('a') })
    }})

    it('does not parse characters within the class appearing too late', function() { with(this) {
      assertThrows(Error, function() { NegativeCharClassTestParser.parse('a7') })
    }})
  }})

  describe('with sequencing and repetition', function() { with(this) {
    before(function() { with(this) {
      Canopy.compile('grammar JS.ENV.RepeatCharClassTest\
        root <- [1-9] [0-9]*')
    }})

    it('parses integers', function() { with(this) {
      assertParse(['3718', 0, [
                    ['3', 0, []],
                    ['718', 1, [
                      ['7', 1, []],
                      ['1', 2, []],
                      ['8', 3, []]]]]],

        RepeatCharClassTestParser.parse('3718') )
    }})

    it('does not parse floats', function() { with(this) {
      assertThrows(Error, function() { RepeatCharClassTestParser.parse('7.4') })
      assertEqual({
          input:    '7.4',
          offset:   1,
          expected: '[0-9]'
        }, RepeatCharClassTestParser.lastError)
    }})

    it('does not parse octal', function() { with(this) {
      assertThrows(Error, function() { RepeatCharClassTestParser.parse('0644') })
    }})
  }})
}})

