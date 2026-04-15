// DSA-V3 Curriculum — 84 days, 12 weeks, 6 phases
// Complete data for Days 1-14 (Weeks 1-2). Skeleton for Days 15-84.

export type Difficulty = 'Easy' | 'Medium' | 'Hard'
export type DayType = 'active' | 'review' | 'rest'

export interface PatternCardData {
  name: string
  whenToUse: string
  tell: string
  ascii: string
}

export interface SimilarProblem {
  title: string
  difficulty: Difficulty
  leetcode?: number
}

export interface DayData {
  day: number
  type: DayType
  title: string
  pattern: string
  patternCard?: PatternCardData   // shown only when a pattern first appears
  difficulty: Difficulty
  companies: string[]
  videoUrl: string
  estimatedMinutes: number
  whyItMatters: string
  conceptIntro: string
  statement: string
  examples: { input: string; output: string; explanation?: string }[]
  constraints: string[]
  hints: [string, string, string]
  solutionCode: string
  timeComplexity: string
  spaceComplexity: string
  similar: SimilarProblem[]
}

// ─────────────────────────────────────────────────────────────────
// Week 1 — Arrays & Strings (Days 1-7)
// ─────────────────────────────────────────────────────────────────

const WEEK1: DayData[] = [
  {
    day: 1,
    type: 'active',
    title: 'Two Sum',
    pattern: 'Hash Map',
    patternCard: {
      name: 'Hash Map',
      whenToUse:
        'Use a hash map when you need to find elements by value in O(1) time, especially for complement/pair problems. If you catch yourself writing a nested loop to check pairs, a hash map can usually cut it to O(n).',
      tell:
        '"find two numbers that…" or "return indices where…" — whenever you need to look back at previously seen values quickly.',
      ascii: 'nums = [2, 7, 11, 15]   target = 9\n\ni=0  num=2  need=7   seen={2:0}\ni=1  num=7  need=2 ✓ → return [0,1]',
    },
    difficulty: 'Easy',
    companies: ['Google', 'Amazon', 'Microsoft', 'Apple', 'Meta'],
    videoUrl: 'https://www.youtube.com/watch?v=KLlXCFG5TnA',
    estimatedMinutes: 20,
    whyItMatters:
      'Two Sum is the canonical "trading memory for speed" problem. The O(n²) brute force is obvious; the O(n) hash map solution is the insight that unlocks dozens of harder problems.',
    conceptIntro:
      'For each number you visit, the question is: "Have I already seen the number that, together with me, forms the target?" A hash map lets you answer that in O(1). Store every number\'s index as you walk the array — by the time you need its complement, it\'s already in the map.',
    statement:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] == 9' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
      { input: 'nums = [3,3], target = 6', output: '[0,1]' },
    ],
    constraints: ['2 ≤ nums.length ≤ 10⁴', '-10⁹ ≤ nums[i] ≤ 10⁹', '-10⁹ ≤ target ≤ 10⁹', 'Only one valid answer exists.'],
    hints: [
      'Pattern: Hash Map. For each element, you need to quickly check if its complement (target - num) has been seen before.',
      'Walk the array once. Before storing nums[i], check if (target - nums[i]) is already in your map. If yes, you\'re done.',
      'seen = {}\nfor i, num in enumerate(nums):\n    complement = target - num\n    if complement in seen:\n        return [seen[complement], i]\n    seen[num] = i',
    ],
    solutionCode: `def twoSum(nums: list[int], target: int) -> list[int]:
    seen = {}                           # value -> index map

    for i, num in enumerate(nums):
        complement = target - num       # what we still need
        if complement in seen:          # O(1) lookup
            return [seen[complement], i]
        seen[num] = i                   # store index for future lookups

    return []                           # guaranteed solution exists`,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    similar: [
      { title: 'Two Sum II - Input Array Is Sorted', difficulty: 'Medium', leetcode: 167 },
      { title: 'Three Sum', difficulty: 'Medium', leetcode: 15 },
      { title: 'Four Sum', difficulty: 'Medium', leetcode: 18 },
    ],
  },
  {
    day: 2,
    type: 'active',
    title: 'Best Time to Buy and Sell Stock',
    pattern: 'Greedy / One Pass',
    patternCard: {
      name: 'Greedy / One Pass',
      whenToUse:
        'Use a greedy single pass when you can make a locally optimal choice at each step (e.g., track the running minimum) and the global optimum follows. These problems often have an obvious O(n²) brute force that can shrink to O(n).',
      tell:
        '"maximum profit / minimum cost" with a single array — if you can make a one-way decision at every index, greedy applies.',
      ascii: 'prices = [7, 1, 5, 3, 6, 4]\n         ^\n         min=7 → update min=1 → profit=4 → profit=5 ✓',
    },
    difficulty: 'Easy',
    companies: ['Amazon', 'Google', 'Apple', 'Microsoft', 'Bloomberg'],
    videoUrl: 'https://www.youtube.com/watch?v=1pkOgXD63yU',
    estimatedMinutes: 15,
    whyItMatters:
      'This problem teaches the "running minimum" trick — you don\'t need to compare every buy/sell pair. Just track the cheapest buy seen so far and the best profit you could get today.',
    conceptIntro:
      'You buy once, sell once. For every price you visit, ask: "What\'s the best profit if I sell today?" The answer is (today\'s price − cheapest price seen so far). Keep a running minimum and a running max profit.',
    statement:
      'You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.',
    examples: [
      { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price=1), sell on day 5 (price=6). Profit = 6-1 = 5.' },
      { input: 'prices = [7,6,4,3,1]', output: '0', explanation: 'No transaction achieves profit.' },
    ],
    constraints: ['1 ≤ prices.length ≤ 10⁵', '0 ≤ prices[i] ≤ 10⁴'],
    hints: [
      'Pattern: Greedy One Pass. Track the minimum price seen so far and update max profit at each step.',
      'At each price, you have two options: (1) this is a new minimum buy point, or (2) selling today gives a better profit than before.',
      'min_price = float("inf")\nmax_profit = 0\nfor price in prices:\n    min_price = min(min_price, price)\n    max_profit = max(max_profit, price - min_price)\nreturn max_profit',
    ],
    solutionCode: `def maxProfit(prices: list[int]) -> int:
    min_price = float('inf')     # lowest buy price seen so far
    max_profit = 0               # best profit achievable

    for price in prices:
        if price < min_price:
            min_price = price    # new potential buy point
        else:
            max_profit = max(max_profit, price - min_price)  # sell today?

    return max_profit`,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    similar: [
      { title: 'Best Time to Buy and Sell Stock II', difficulty: 'Medium', leetcode: 122 },
      { title: 'Best Time to Buy and Sell Stock with Cooldown', difficulty: 'Medium', leetcode: 309 },
      { title: 'Maximum Subarray', difficulty: 'Medium', leetcode: 53 },
    ],
  },
  {
    day: 3,
    type: 'active',
    title: 'Contains Duplicate',
    pattern: 'Hash Set',
    patternCard: {
      name: 'Hash Set',
      whenToUse:
        'Use a hash set when you need to detect duplicates or check membership in O(1). It\'s the simplest lookup structure — values in, no indices needed.',
      tell:
        '"does X appear more than once?" or "have I seen this value before?" — if you only care about existence (not position), reach for a set.',
      ascii: 'nums = [1, 2, 3, 1]\nseen = {}\n  1 → add\n  2 → add\n  3 → add\n  1 → already in set! → True',
    },
    difficulty: 'Easy',
    companies: ['Amazon', 'Apple', 'Bloomberg', 'Google'],
    videoUrl: 'https://www.youtube.com/watch?v=3OamzN90kPg',
    estimatedMinutes: 10,
    whyItMatters:
      'Simple problem, key pattern: a hash set gives O(1) membership checks. This building block appears in cycle detection, anagram checks, and intersection problems.',
    conceptIntro:
      'Walk the array once. For each number, ask "have I seen this before?" If yes, return True. If no, add it to your set. A set lookup is O(1), making the whole pass O(n).',
    statement:
      'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
    examples: [
      { input: 'nums = [1,2,3,1]', output: 'true' },
      { input: 'nums = [1,2,3,4]', output: 'false' },
      { input: 'nums = [1,1,1,3,3,4,3,2,4,2]', output: 'true' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁵', '-10⁹ ≤ nums[i] ≤ 10⁹'],
    hints: [
      'Pattern: Hash Set. You need to detect if any value appears more than once.',
      'Walk the array. Before adding a number to your set, check if it\'s already there.',
      'seen = set()\nfor num in nums:\n    if num in seen:\n        return True\n    seen.add(num)\nreturn False',
    ],
    solutionCode: `def containsDuplicate(nums: list[int]) -> bool:
    seen = set()              # O(1) membership check

    for num in nums:
        if num in seen:       # duplicate found
            return True
        seen.add(num)         # mark as visited

    return False              # all elements distinct`,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    similar: [
      { title: 'Contains Duplicate II', difficulty: 'Easy', leetcode: 219 },
      { title: 'Contains Duplicate III', difficulty: 'Hard', leetcode: 220 },
      { title: 'Find the Duplicate Number', difficulty: 'Medium', leetcode: 287 },
    ],
  },
  {
    day: 4,
    type: 'active',
    title: 'Product of Array Except Self',
    pattern: 'Prefix / Suffix',
    patternCard: {
      name: 'Prefix / Suffix',
      whenToUse:
        'Use prefix/suffix when you need to combine all values except the current one. Two passes — left-to-right and right-to-left — let you build the result in O(n) without division.',
      tell:
        '"product/sum/XOR of everything except index i" — if you can\'t use division, prefix × suffix is the answer.',
      ascii: 'nums     = [1, 2, 3, 4]\nprefix   = [1, 1, 2, 6]   # product of all LEFT\nsuffix   = [24,12, 4, 1]   # product of all RIGHT\nresult   = [24,12, 8, 6]   # prefix[i] × suffix[i]',
    },
    difficulty: 'Medium',
    companies: ['Amazon', 'Apple', 'Google', 'Microsoft', 'Meta', 'Lyft'],
    videoUrl: 'https://www.youtube.com/watch?v=bNvIQI2wAjk',
    estimatedMinutes: 25,
    whyItMatters:
      'Forces you to think in two passes and build answers from both directions. The "no division" constraint is the key — it reveals the prefix × suffix pattern used in many harder DP problems.',
    conceptIntro:
      'result[i] = (product of everything to the left of i) × (product of everything to the right of i). Do a left-to-right pass to fill prefix products, then a right-to-left pass to multiply in suffix products. No division needed.',
    statement:
      'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer. You must write an algorithm that runs in O(n) time and without using the division operation.',
    examples: [
      { input: 'nums = [1,2,3,4]', output: '[24,12,8,6]' },
      { input: 'nums = [-1,1,0,-3,3]', output: '[0,0,9,0,0]' },
    ],
    constraints: ['2 ≤ nums.length ≤ 10⁵', '-30 ≤ nums[i] ≤ 30', 'The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.'],
    hints: [
      'Pattern: Prefix × Suffix. result[i] = (product of all elements LEFT of i) × (product of all elements RIGHT of i).',
      'Pass 1 (left→right): fill result[i] with the product of all elements before index i. Pass 2 (right→left): multiply result[i] by the product of all elements after index i.',
      'result = [1] * n\n# Left pass\nprefix = 1\nfor i in range(n):\n    result[i] = prefix\n    prefix *= nums[i]\n# Right pass\nsuffix = 1\nfor i in range(n-1, -1, -1):\n    result[i] *= suffix\n    suffix *= nums[i]',
    ],
    solutionCode: `def productExceptSelf(nums: list[int]) -> list[int]:
    n = len(nums)
    result = [1] * n

    # Left pass: result[i] = product of all nums[0..i-1]
    prefix = 1
    for i in range(n):
        result[i] = prefix
        prefix *= nums[i]

    # Right pass: multiply result[i] by product of all nums[i+1..n-1]
    suffix = 1
    for i in range(n - 1, -1, -1):
        result[i] *= suffix
        suffix *= nums[i]

    return result`,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1) — output array excluded',
    similar: [
      { title: 'Trapping Rain Water', difficulty: 'Hard', leetcode: 42 },
      { title: 'Maximum Product Subarray', difficulty: 'Medium', leetcode: 152 },
      { title: 'Minimum Number of Arrows to Burst Balloons', difficulty: 'Medium', leetcode: 452 },
    ],
  },
  {
    day: 5,
    type: 'active',
    title: 'Maximum Subarray',
    pattern: "Kadane's Algorithm",
    patternCard: {
      name: "Kadane's Algorithm",
      whenToUse:
        "Use Kadane's when you need the maximum (or minimum) sum of a contiguous subarray. At each element, choose to either extend the current subarray or start fresh — whichever is larger.",
      tell:
        '"maximum/minimum sum contiguous subarray" — if a DP recurrence simplifies to max(current, current + prev), it\'s Kadane\'s.',
      ascii: 'nums    = [-2, 1,-3, 4,-1, 2, 1,-5, 4]\ncurrent = [-2, 1,-2, 4, 3, 5, 6, 1, 5]\nmax_sum = [-2, 1, 1, 4, 4, 5, 6, 6, 6] → 6',
    },
    difficulty: 'Medium',
    companies: ['Amazon', 'Google', 'Apple', 'Microsoft', 'Bloomberg', 'LinkedIn'],
    videoUrl: 'https://www.youtube.com/watch?v=5WZl3MMT0Eg',
    estimatedMinutes: 25,
    whyItMatters:
      "Kadane's is dynamic programming reduced to two variables. It's the pattern behind maximum product, circular subarray, and 2D maximum subarray problems. Learning it cleanly unlocks a whole family.",
    conceptIntro:
      "Walk the array. For each element, either start a new subarray here (if the running sum went negative, restart) or extend the existing one. Track the global maximum. This is DP compressed into O(1) space.",
    statement:
      'Given an integer array nums, find the subarray with the largest sum, and return its sum.',
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'Subarray [4,-1,2,1] has the largest sum = 6.' },
      { input: 'nums = [1]', output: '1' },
      { input: 'nums = [5,4,-1,7,8]', output: '23' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁵', '-10⁴ ≤ nums[i] ≤ 10⁴'],
    hints: [
      "Pattern: Kadane's Algorithm. At each element decide: extend the current subarray or start fresh?",
      "current_sum = max(nums[i], current_sum + nums[i]). If the running total goes negative, there's no point dragging it forward — reset by starting at nums[i].",
      'max_sum = current = nums[0]\nfor num in nums[1:]:\n    current = max(num, current + num)\n    max_sum = max(max_sum, current)\nreturn max_sum',
    ],
    solutionCode: `def maxSubArray(nums: list[int]) -> int:
    max_sum = nums[0]       # global best
    current = nums[0]       # current subarray sum

    for num in nums[1:]:
        # either extend current subarray or start fresh here
        current = max(num, current + num)
        max_sum = max(max_sum, current)

    return max_sum`,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    similar: [
      { title: 'Maximum Product Subarray', difficulty: 'Medium', leetcode: 152 },
      { title: 'Maximum Sum Circular Subarray', difficulty: 'Medium', leetcode: 918 },
      { title: 'Minimum Subarray', difficulty: 'Medium', leetcode: 2059 },
    ],
  },
  {
    day: 6,
    type: 'review',
    title: 'Week 1 Review: Arrays & Hash Maps',
    pattern: 'Review',
    difficulty: 'Easy',
    companies: [],
    videoUrl: '',
    estimatedMinutes: 30,
    whyItMatters: 'Solidifying Week 1 patterns builds the foundation for every technique you\'ll learn.',
    conceptIntro: 'Review the 5 patterns from this week: Hash Map (Two Sum), Greedy One Pass (Stock), Hash Set (Duplicates), Prefix/Suffix (Product), Kadane\'s (Max Subarray). Try to explain each pattern in one sentence without notes.',
    statement: '',
    examples: [],
    constraints: [],
    hints: ['---', '---', '---'],
    solutionCode: '',
    timeComplexity: '',
    spaceComplexity: '',
    similar: [],
  },
  {
    day: 7,
    type: 'rest',
    title: 'Rest Day',
    pattern: 'Rest',
    difficulty: 'Easy',
    companies: [],
    videoUrl: '',
    estimatedMinutes: 0,
    whyItMatters: 'Rest is when consolidation happens. Your brain encodes patterns during sleep.',
    conceptIntro: 'Take a genuine break. No coding today. Come back sharper tomorrow.',
    statement: '',
    examples: [],
    constraints: [],
    hints: ['---', '---', '---'],
    solutionCode: '',
    timeComplexity: '',
    spaceComplexity: '',
    similar: [],
  },
]

// ─────────────────────────────────────────────────────────────────
// Week 2 — Strings & Two Pointers (Days 8-14)
// ─────────────────────────────────────────────────────────────────

const WEEK2: DayData[] = [
  {
    day: 8,
    type: 'active',
    title: 'Valid Anagram',
    pattern: 'Frequency Count',
    patternCard: {
      name: 'Frequency Count',
      whenToUse:
        'Use a frequency map (or sorted comparison) when two arrays/strings need to contain the same elements regardless of order. A count map turns an O(n log n) sort into O(n).',
      tell:
        '"same characters / same elements in different order" — count maps let you compare distributions in O(n).',
      ascii: 's = "anagram"  t = "nagaram"\ncounts_s = {a:3, n:1, g:1, r:1, m:1}\ncounts_t = {n:1, a:3, g:1, r:1, m:1}  ← equal → True',
    },
    difficulty: 'Easy',
    companies: ['Amazon', 'Google', 'Apple', 'Bloomberg'],
    videoUrl: 'https://www.youtube.com/watch?v=9UtInBqnCgA',
    estimatedMinutes: 15,
    whyItMatters:
      'Anagram checks appear as subroutines in Sliding Window (find all anagrams in a string) and Group Anagrams problems. Mastering the count map variation beats sorting every time.',
    conceptIntro:
      'Count character frequencies in both strings. If all counts match, they\'re anagrams. The clever trick: use a single array of 26 ints — increment for s, decrement for t. If all zeros at the end, it\'s an anagram.',
    statement:
      'Given two strings s and t, return true if t is an anagram of s, and false otherwise. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, using all the original letters exactly once.',
    examples: [
      { input: 's = "anagram", t = "nagaram"', output: 'true' },
      { input: 's = "rat", t = "car"', output: 'false' },
    ],
    constraints: ['1 ≤ s.length, t.length ≤ 5 × 10⁴', 's and t consist of lowercase English letters.'],
    hints: [
      'Pattern: Frequency Count. An anagram uses the same characters with the same frequencies.',
      'Count characters in s (increment) and t (decrement) in the same array. If they cancel out (all zeros), it\'s an anagram.',
      'count = [0] * 26\nfor c in s: count[ord(c) - ord("a")] += 1\nfor c in t: count[ord(c) - ord("a")] -= 1\nreturn all(x == 0 for x in count)',
    ],
    solutionCode: `def isAnagram(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False

    count = [0] * 26            # one slot per lowercase letter

    for c in s:
        count[ord(c) - ord('a')] += 1   # increment for s

    for c in t:
        count[ord(c) - ord('a')] -= 1   # decrement for t

    return all(x == 0 for x in count)   # all must cancel out`,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1) — fixed 26-element array',
    similar: [
      { title: 'Group Anagrams', difficulty: 'Medium', leetcode: 49 },
      { title: 'Find All Anagrams in a String', difficulty: 'Medium', leetcode: 438 },
      { title: 'Ransom Note', difficulty: 'Easy', leetcode: 383 },
    ],
  },
  {
    day: 9,
    type: 'active',
    title: 'Valid Palindrome',
    pattern: 'Two Pointers',
    patternCard: {
      name: 'Two Pointers',
      whenToUse:
        'Use two pointers when working on a sorted (or symmetric) sequence and you need to efficiently check or combine elements from both ends. Shrinks O(n²) pair-checking to O(n).',
      tell:
        '"check from both ends" or "find pair in sorted array" — if the data is ordered and comparing from opposite ends can eliminate options, use two pointers.',
      ascii: 's = "A man, a plan, a canal: Panama"\n     L ────────────────────────── R\n     ↑ skip non-alpha, compare, move inward ↑',
    },
    difficulty: 'Easy',
    companies: ['Facebook', 'Microsoft', 'Amazon', 'Bloomberg'],
    videoUrl: 'https://www.youtube.com/watch?v=jJXJ16kPFWg',
    estimatedMinutes: 15,
    whyItMatters:
      'Two-pointer palindrome check is the warmup for Two Sum II, Three Sum, and Container with Most Water. The pattern of squeezing inward from both ends is reused constantly.',
    conceptIntro:
      'Place one pointer at the start and one at the end. Skip non-alphanumeric characters, then compare lowercase versions. If they ever differ, it\'s not a palindrome. If the pointers cross, it is.',
    statement:
      'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers. Given a string s, return true if it is a palindrome, or false otherwise.',
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: '"amanaplanacanalpanama" is a palindrome.' },
      { input: 's = "race a car"', output: 'false', explanation: '"raceacar" is not a palindrome.' },
      { input: 's = " "', output: 'true', explanation: 'After removing non-alphanumeric chars, s is "" which is a palindrome.' },
    ],
    constraints: ['1 ≤ s.length ≤ 2 × 10⁵', 's consists only of printable ASCII characters.'],
    hints: [
      'Pattern: Two Pointers. Point at the start and end; squeeze inward comparing characters.',
      'Skip non-alphanumeric characters on both sides with inner while loops. Compare lowercase versions.',
      'l, r = 0, len(s) - 1\nwhile l < r:\n    while l < r and not s[l].isalnum(): l += 1\n    while l < r and not s[r].isalnum(): r -= 1\n    if s[l].lower() != s[r].lower(): return False\n    l += 1; r -= 1\nreturn True',
    ],
    solutionCode: `def isPalindrome(s: str) -> bool:
    l, r = 0, len(s) - 1

    while l < r:
        # skip non-alphanumeric characters
        while l < r and not s[l].isalnum():
            l += 1
        while l < r and not s[r].isalnum():
            r -= 1

        if s[l].lower() != s[r].lower():
            return False    # mismatch found

        l += 1
        r -= 1

    return True             # all characters matched`,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    similar: [
      { title: 'Two Sum II - Input Array Is Sorted', difficulty: 'Medium', leetcode: 167 },
      { title: 'Palindrome II', difficulty: 'Easy', leetcode: 680 },
      { title: 'Three Sum', difficulty: 'Medium', leetcode: 15 },
    ],
  },
  {
    day: 10,
    type: 'active',
    title: 'Group Anagrams',
    pattern: 'Frequency Count + Grouping',
    difficulty: 'Medium',
    companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'Uber'],
    videoUrl: 'https://www.youtube.com/watch?v=vzdNOK2oB2E',
    estimatedMinutes: 25,
    whyItMatters:
      'Group Anagrams forces you to derive a canonical key (sorted string or char count tuple) that groups equivalent strings. This key-derivation technique appears in many "group by some invariant" problems.',
    conceptIntro:
      'Two words are anagrams if they have the same character frequency profile. Sort each word to get its canonical key, or use a tuple of 26 character counts. Group all words sharing a key into the same bucket.',
    statement:
      'Given an array of strings strs, group the anagrams together. You can return the answer in any order.',
    examples: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' },
      { input: 'strs = [""]', output: '[[""]]' },
      { input: 'strs = ["a"]', output: '[["a"]]' },
    ],
    constraints: ['1 ≤ strs.length ≤ 10⁴', '0 ≤ strs[i].length ≤ 100', 'strs[i] consists of lowercase English letters.'],
    hints: [
      'Pattern: Frequency Count + Grouping. Find a canonical key that is the same for all anagrams of a word.',
      'The canonical key can be: (1) sorted word as a string, or (2) tuple of 26 character counts. Use this key in a defaultdict(list).',
      'from collections import defaultdict\ngroups = defaultdict(list)\nfor s in strs:\n    key = tuple(sorted(s))\n    groups[key].append(s)\nreturn list(groups.values())',
    ],
    solutionCode: `from collections import defaultdict

def groupAnagrams(strs: list[str]) -> list[list[str]]:
    groups = defaultdict(list)

    for s in strs:
        key = tuple(sorted(s))   # canonical anagram key
        groups[key].append(s)

    return list(groups.values())`,
    timeComplexity: 'O(n × k log k) — k is max string length',
    spaceComplexity: 'O(n × k)',
    similar: [
      { title: 'Valid Anagram', difficulty: 'Easy', leetcode: 242 },
      { title: 'Find All Anagrams in a String', difficulty: 'Medium', leetcode: 438 },
    ],
  },
  {
    day: 11,
    type: 'active',
    title: 'Longest Consecutive Sequence',
    pattern: 'Hash Set + Sequence Detection',
    difficulty: 'Medium',
    companies: ['Google', 'Amazon', 'Facebook', 'Microsoft'],
    videoUrl: 'https://www.youtube.com/watch?v=P6RZZMu_maU',
    estimatedMinutes: 30,
    whyItMatters:
      'Forces O(n) thinking without sorting. The insight — only start counting from sequence beginnings — eliminates redundant work elegantly.',
    conceptIntro:
      'Put all numbers in a hash set for O(1) lookup. For each number, only start counting a sequence if num-1 is NOT in the set (i.e., it\'s a sequence start). Then count upwards. This makes each element processed at most twice.',
    statement:
      'Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in O(n) time.',
    examples: [
      { input: 'nums = [100,4,200,1,3,2]', output: '4', explanation: 'Longest sequence is [1,2,3,4].' },
      { input: 'nums = [0,3,7,2,5,8,4,6,0,1]', output: '9' },
    ],
    constraints: ['0 ≤ nums.length ≤ 10⁵', '-10⁹ ≤ nums[i] ≤ 10⁹'],
    hints: [
      'Pattern: Hash Set + Sequence Detection. Convert to a set, then only begin counting at sequence starts.',
      'A number num is a sequence start only if (num - 1) is NOT in the set. Start counting upward from there.',
      'num_set = set(nums)\nbest = 0\nfor n in num_set:\n    if n - 1 not in num_set:\n        length = 1\n        while n + length in num_set:\n            length += 1\n        best = max(best, length)\nreturn best',
    ],
    solutionCode: `def longestConsecutive(nums: list[int]) -> int:
    num_set = set(nums)         # O(1) lookup
    best = 0

    for n in num_set:
        if n - 1 not in num_set:        # this is a sequence start
            length = 1
            while n + length in num_set:
                length += 1             # extend the sequence
            best = max(best, length)

    return best`,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    similar: [
      { title: 'Binary Tree Longest Consecutive Sequence', difficulty: 'Medium', leetcode: 298 },
      { title: 'Missing Number', difficulty: 'Easy', leetcode: 268 },
    ],
  },
  {
    day: 12,
    type: 'active',
    title: 'Three Sum',
    pattern: 'Two Pointers',
    difficulty: 'Medium',
    companies: ['Amazon', 'Google', 'Facebook', 'Microsoft', 'Apple'],
    videoUrl: 'https://www.youtube.com/watch?v=jzZsG8n2R9A',
    estimatedMinutes: 35,
    whyItMatters:
      'Three Sum layers sorting + two pointers on top of hash map thinking. It introduces duplicate-skipping logic that reappears in Four Sum and other k-sum variants.',
    conceptIntro:
      'Sort the array. Fix one number with an outer loop. Use two pointers on the rest to find pairs that sum to negative of the fixed number. Skip duplicates at each pointer to avoid repeat triplets.',
    statement:
      'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0. Notice that the solution set must not contain duplicate triplets.',
    examples: [
      { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]' },
      { input: 'nums = [0,1,1]', output: '[]' },
      { input: 'nums = [0,0,0]', output: '[[0,0,0]]' },
    ],
    constraints: ['3 ≤ nums.length ≤ 3000', '-10⁵ ≤ nums[i] ≤ 10⁵'],
    hints: [
      'Pattern: Sort + Two Pointers. Fix nums[i], then use two pointers (l=i+1, r=n-1) to find pairs summing to -nums[i].',
      'After sorting, skip duplicate values of the fixed number (i) and after finding a valid triplet, advance both pointers past duplicates.',
      'nums.sort()\nres = []\nfor i, a in enumerate(nums):\n    if i > 0 and a == nums[i-1]: continue\n    l, r = i+1, len(nums)-1\n    while l < r:\n        s = a + nums[l] + nums[r]\n        if s > 0: r -= 1\n        elif s < 0: l += 1\n        else:\n            res.append([a, nums[l], nums[r]])\n            l += 1\n            while nums[l] == nums[l-1] and l < r: l += 1\nreturn res',
    ],
    solutionCode: `def threeSum(nums: list[int]) -> list[list[int]]:
    nums.sort()
    res = []

    for i, a in enumerate(nums):
        if a > 0:
            break                       # sorted — can't reach 0 now
        if i > 0 and a == nums[i - 1]:
            continue                    # skip duplicate for outer loop

        l, r = i + 1, len(nums) - 1
        while l < r:
            total = a + nums[l] + nums[r]
            if total > 0:
                r -= 1
            elif total < 0:
                l += 1
            else:
                res.append([a, nums[l], nums[r]])
                l += 1
                while l < r and nums[l] == nums[l - 1]:
                    l += 1              # skip duplicates

    return res`,
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1) — excluding output',
    similar: [
      { title: 'Two Sum', difficulty: 'Easy', leetcode: 1 },
      { title: 'Four Sum', difficulty: 'Medium', leetcode: 18 },
      { title: 'Three Sum Closest', difficulty: 'Medium', leetcode: 16 },
    ],
  },
  {
    day: 13,
    type: 'review',
    title: 'Week 2 Review: Strings & Two Pointers',
    pattern: 'Review',
    difficulty: 'Easy',
    companies: [],
    videoUrl: '',
    estimatedMinutes: 30,
    whyItMatters: 'Reviewing anagram patterns, palindrome checks, and three-sum builds bridges to sliding window.',
    conceptIntro: 'Review: Frequency Count (Anagram, Group Anagrams), Two Pointers (Palindrome, Three Sum), Hash Set sequence detection (Longest Consecutive). Can you code any of these from memory?',
    statement: '',
    examples: [],
    constraints: [],
    hints: ['---', '---', '---'],
    solutionCode: '',
    timeComplexity: '',
    spaceComplexity: '',
    similar: [],
  },
  {
    day: 14,
    type: 'rest',
    title: 'Rest Day',
    pattern: 'Rest',
    difficulty: 'Easy',
    companies: [],
    videoUrl: '',
    estimatedMinutes: 0,
    whyItMatters: 'Two weeks done. Rest well — Week 3 introduces Linked Lists.',
    conceptIntro: 'Take a complete break. No code today. The patterns are consolidating in your memory right now.',
    statement: '',
    examples: [],
    constraints: [],
    hints: ['---', '---', '---'],
    solutionCode: '',
    timeComplexity: '',
    spaceComplexity: '',
    similar: [],
  },
]

// ─────────────────────────────────────────────────────────────────
// Weeks 3-12 — Skeleton entries (Days 15-84)
// ─────────────────────────────────────────────────────────────────

function skeleton(
  day: number,
  type: DayType,
  title: string,
  pattern: string,
  difficulty: Difficulty,
  companies: string[],
  videoUrl: string,
  conceptIntro: string,
): DayData {
  return {
    day, type, title, pattern, difficulty, companies, videoUrl,
    estimatedMinutes: type === 'active' ? 30 : type === 'review' ? 25 : 0,
    whyItMatters: 'Deep understanding of this pattern unlocks dozens of harder problems.',
    conceptIntro,
    statement: '',
    examples: [],
    constraints: [],
    hints: ['Coming soon — check back next update.', '---', '---'],
    solutionCode: '',
    timeComplexity: '',
    spaceComplexity: '',
    similar: [],
  }
}

const WEEKS_3_12: DayData[] = [
  // Week 3 — Sliding Window
  skeleton(15,'active','Maximum Window Substring (easy warm-up)','Sliding Window','Easy',['Google','Amazon'],'https://www.youtube.com/watch?v=GFsVS6dRFsE','A variable-size window expands and shrinks based on a condition. Two pointers — left & right — bound the window.'),
  skeleton(16,'active','Longest Substring Without Repeating Characters','Sliding Window','Medium',['Amazon','Google','Microsoft'],'https://www.youtube.com/watch?v=wiGpQwVHdE0','Expand right; when a duplicate enters the window, shrink left until the window is valid again.'),
  skeleton(17,'active','Longest Repeating Character Replacement','Sliding Window','Medium',['Google'],'https://www.youtube.com/watch?v=gqXU1UyA8pk','Track max frequency char in the window. If window_size - max_freq > k, shrink left.'),
  skeleton(18,'active','Permutation in String','Sliding Window + Frequency','Medium',['Microsoft'],'https://www.youtube.com/watch?v=UbyhOgBN834','Fixed-size window equal to len(s1). Compare char counts. Slide right, update counts in O(1).'),
  skeleton(19,'active','Find All Anagrams in a String','Sliding Window + Frequency','Medium',['Facebook'],'https://www.youtube.com/watch?v=G8xtZy0fDKg','Same as Permutation in String but collect all valid start indices.'),
  skeleton(20,'review','Week 3 Review: Sliding Window','Review','Easy',[],'','Two types: fixed-size (anagram) and variable-size (longest valid). Practice recognizing which type from the problem statement.'),
  skeleton(21,'rest','Rest Day','Rest','Easy',[],'','Rest — Week 4 brings stacks and queues.'),

  // Week 4 — Linked Lists
  skeleton(22,'active','Reverse Linked List','Linked List Two Pointers','Easy',['Amazon','Microsoft','Apple'],'https://www.youtube.com/watch?v=G0_I-ZF0S38','prev=None, curr=head. At each step: save next, point curr→prev, advance both. Classic 3-variable dance.'),
  skeleton(23,'active','Merge Two Sorted Lists','Linked List Merge','Easy',['Amazon','Google','Microsoft'],'https://www.youtube.com/watch?v=XIdigk956u0','Dummy head simplifies edge cases. Compare l1 and l2 values at each step; advance the smaller one.'),
  skeleton(24,'active','Linked List Cycle','Floyd\'s Cycle Detection','Easy',['Amazon','Microsoft'],'https://www.youtube.com/watch?v=gBTe7lFR3vc','Slow (1 step) and fast (2 steps) pointers. If they meet, there\'s a cycle. If fast hits null, no cycle.'),
  skeleton(25,'active','Remove Nth Node From End','Two Pointers','Medium',['Amazon','Microsoft'],'https://www.youtube.com/watch?v=XVuQxVej6y8','Send a fast pointer n+1 steps ahead. Move both until fast hits null — slow is now at target.'),
  skeleton(26,'active','Reorder List','Linked List Manipulation','Medium',['Amazon'],'https://www.youtube.com/watch?v=S5bfdUTrKLM','3 steps: find middle (slow/fast), reverse second half, merge two halves alternately.'),
  skeleton(27,'review','Week 4 Review: Linked Lists','Review','Easy',[],'','Review: in-place reversal, dummy node, slow/fast pointer, two-pointer gap tricks.'),
  skeleton(28,'rest','Rest Day','Rest','Easy',[],'','Rest. Week 5 is trees — the biggest conceptual leap so far.'),

  // Week 5 — Trees (BFS/DFS)
  skeleton(29,'active','Invert Binary Tree','Tree DFS','Easy',['Google','Amazon','Apple'],'https://www.youtube.com/watch?v=OnSn2XEQ4MY','Recursively swap left and right children at every node. Base case: null node.'),
  skeleton(30,'active','Maximum Depth of Binary Tree','Tree DFS','Easy',['Amazon','LinkedIn'],'https://www.youtube.com/watch?v=hTM3phVI6YQ','DFS: return 1 + max(depth(left), depth(right)). BFS: count levels.'),
  skeleton(31,'active','Same Tree','Tree DFS','Easy',['Amazon','Microsoft'],'https://www.youtube.com/watch?v=vRbbcKXCxOw','Recursively check: same value? AND same left subtree? AND same right subtree?'),
  skeleton(32,'active','Binary Tree Level Order Traversal','Tree BFS','Medium',['Amazon','Microsoft','Google'],'https://www.youtube.com/watch?v=6ZnyEApgFYg','BFS with a queue. At each level, drain the current queue size — those nodes form one level.'),
  skeleton(33,'active','Validate Binary Search Tree','Tree DFS with Bounds','Medium',['Amazon','Microsoft','Bloomberg'],'https://www.youtube.com/watch?v=s6ATEkipzow','Pass min/max bounds down via recursion. Left child must be < node value; right child must be > node value.'),
  skeleton(34,'review','Week 5 Review: Binary Trees','Review','Easy',[],'','Review DFS (inorder, preorder, postorder) and BFS (level order). When does each apply?'),
  skeleton(35,'rest','Rest Day','Rest','Easy',[],'','Rest. Week 6 continues with advanced tree problems.'),

  // Week 6 — Trees Advanced
  skeleton(36,'active','Lowest Common Ancestor','Tree DFS','Medium',['Facebook','Amazon','Microsoft'],'https://www.youtube.com/watch?v=gs2LMfuOR9k','If both targets are in different subtrees of a node, that node is the LCA.'),
  skeleton(37,'active','Binary Tree Right Side View','BFS / DFS','Medium',['Amazon','Facebook'],'https://www.youtube.com/watch?v=d4zLyf32e3I','BFS: last node in each level. DFS: track depth; only add a node if depth equals result length.'),
  skeleton(38,'active','Count Good Nodes in Binary Tree','Tree DFS with max','Medium',['Microsoft'],'https://www.youtube.com/watch?v=7cp5imvDzl4','DFS, carry the current path maximum. Node is "good" if its value ≥ path max.'),
  skeleton(39,'active','Kth Smallest in BST','BST Inorder','Medium',['Amazon','Google','Microsoft'],'https://www.youtube.com/watch?v=5LUXSvjmGCw','BST inorder traversal yields sorted values. Stop at the kth element.'),
  skeleton(40,'active','Construct Tree from Preorder and Inorder','Tree Construction','Hard',['Amazon','Microsoft'],'https://www.youtube.com/watch?v=ihj4IQGZ2zc','Preorder root → split inorder into left/right subtrees → recurse.'),
  skeleton(41,'review','Week 6 Review: Advanced Trees','Review','Easy',[],'','Review LCA, BST properties, tree construction. Focus on choosing DFS vs BFS.'),
  skeleton(42,'rest','Rest Day','Rest','Easy',[],'','Rest. Week 7 introduces graph algorithms.'),

  // Week 7 — Graphs
  skeleton(43,'active','Number of Islands','Graph DFS/BFS','Medium',['Amazon','Google','Microsoft','Facebook'],'https://www.youtube.com/watch?v=pV2kpPD66nE','DFS from each unvisited \'1\'. Mark visited cells to avoid recounting. Count DFS starts.'),
  skeleton(44,'active','Clone Graph','Graph DFS + Hash Map','Medium',['Facebook','Amazon'],'https://www.youtube.com/watch?v=mQeF6bN8hMk','DFS, map original node → clone node. If clone exists, return it immediately.'),
  skeleton(45,'active','Pacific Atlantic Water Flow','Graph Multi-source BFS','Medium',['Google','Amazon'],'https://www.youtube.com/watch?v=s-VkcjHqkGI','BFS from both ocean edges. Cells reachable from BOTH oceans are the answer.'),
  skeleton(46,'active','Course Schedule (Cycle Detection)','Topological Sort / DFS','Medium',['Amazon','Apple','Google'],'https://www.youtube.com/watch?v=EgI5nU9etnU','Build directed graph. Cycle detection via DFS with 3 states: unvisited / in-stack / done.'),
  skeleton(47,'active','Graph Valid Tree','Union Find / DFS','Medium',['LinkedIn'],'https://www.youtube.com/watch?v=bXsUuownnoQ','Tree: connected + no cycles. DFS or Union-Find. Check: exactly n-1 edges and fully connected.'),
  skeleton(48,'review','Week 7 Review: Graphs','Review','Easy',[],'','Compare DFS/BFS for graphs. When to use Union-Find vs Topo Sort?'),
  skeleton(49,'rest','Rest Day','Rest','Easy',[],'','Rest. Week 8 is Binary Search and Heaps.'),

  // Week 8 — Binary Search & Heaps
  skeleton(50,'active','Binary Search','Binary Search','Easy',['Amazon','Microsoft','Google'],'https://www.youtube.com/watch?v=s4DPM8ct1pI','Classic: left=0, right=len-1. mid = (l+r)//2. Eliminate half the search space each iteration.'),
  skeleton(51,'active','Find Minimum in Rotated Sorted Array','Binary Search','Medium',['Amazon','Microsoft','Google'],'https://www.youtube.com/watch?v=nIVW4P8b1VA','Binary search: if nums[mid] > nums[right], minimum is in right half. Otherwise left half.'),
  skeleton(52,'active','Search in Rotated Sorted Array','Binary Search','Medium',['Amazon','Microsoft','Facebook'],'https://www.youtube.com/watch?v=U8XENwh8Oy8','Determine which half is sorted, then check if target falls in it.'),
  skeleton(53,'active','Kth Largest Element in an Array','Min-Heap','Medium',['Facebook','Amazon','Microsoft'],'https://www.youtube.com/watch?v=XEmy13g1Qxc','Min-heap of size k. Pop when heap exceeds k. The heap top = kth largest.'),
  skeleton(54,'active','Find Median from Data Stream','Two Heaps','Hard',['Amazon','Google','Microsoft'],'https://www.youtube.com/watch?v=itmhHWaHupI','Max-heap for lower half, min-heap for upper half. Balance sizes to find median.'),
  skeleton(55,'review','Week 8 Review: Binary Search & Heaps','Review','Easy',[],'','Review binary search templates and heap patterns. Practice the two-heap median trick.'),
  skeleton(56,'rest','Rest Day','Rest','Easy',[],'','Rest. Week 9 starts Dynamic Programming — the hardest phase.'),

  // Week 9 — DP 1D
  skeleton(57,'active','Climbing Stairs','DP 1D','Easy',['Amazon','Apple','Google'],'https://www.youtube.com/watch?v=Y0lT9Fck7qI','dp[i] = dp[i-1] + dp[i-2]. Base case: dp[1]=1, dp[2]=2. Space-optimized: two variables.'),
  skeleton(58,'active','House Robber','DP 1D','Medium',['Airbnb','Amazon','Google'],'https://www.youtube.com/watch?v=73r3KWiEvyk','dp[i] = max(dp[i-1], dp[i-2] + nums[i]). Two variables: rob1 (skip this) and rob2 (take this or not).'),
  skeleton(59,'active','House Robber II','DP 1D — Circular','Medium',['Airbnb'],'https://www.youtube.com/watch?v=rWAJCfYYOvM','Can\'t rob first and last. Run House Robber on [0..n-2] and [1..n-1], take the max.'),
  skeleton(60,'active','Longest Palindromic Substring','DP / Expand Around Center','Medium',['Amazon','Microsoft','Google'],'https://www.youtube.com/watch?v=XYQecbcd6_c','Expand around every center (n odd centers, n-1 even). Track longest expansion.'),
  skeleton(61,'active','Palindromic Substrings','DP / Expand Around Center','Medium',['Facebook','Microsoft'],'https://www.youtube.com/watch?v=4RACzI5-du8','Same expand-around-center but count every valid palindrome instead of tracking the longest.'),
  skeleton(62,'review','Week 9 Review: 1D DP','Review','Easy',[],'','DP transition review: climbing stairs, robber, palindromes. State definition is everything.'),
  skeleton(63,'rest','Rest Day','Rest','Easy',[],'','Rest. Week 10 brings 2D DP.'),

  // Week 10 — DP 2D
  skeleton(64,'active','Unique Paths','DP 2D','Medium',['Microsoft','Amazon','Google'],'https://www.youtube.com/watch?v=IlEsdxuD4lY','dp[i][j] = dp[i-1][j] + dp[i][j-1]. Top row and left column all 1s (only one path to them).'),
  skeleton(65,'active','Longest Common Subsequence','DP 2D','Medium',['Amazon','Google','Microsoft'],'https://www.youtube.com/watch?v=Ua0GhsJSlWM','dp[i][j] = dp[i-1][j-1]+1 if chars match, else max(dp[i-1][j], dp[i][j-1]).'),
  skeleton(66,'active','Edit Distance','DP 2D','Hard',['Amazon','Google','Microsoft'],'https://www.youtube.com/watch?v=XYi2-LPrwm4','dp[i][j] = min cost to transform word1[:i] → word2[:j]. Three options: insert, delete, replace.'),
  skeleton(67,'active','Coin Change','DP 1D Unbounded Knapsack','Medium',['Amazon','Google','Microsoft'],'https://www.youtube.com/watch?v=H9bfqozjoqs','dp[amount] = min coins to make amount. For each coin, dp[i] = min(dp[i], dp[i-coin]+1).'),
  skeleton(68,'active','Coin Change II','DP 2D / Knapsack','Medium',['Google'],'https://www.youtube.com/watch?v=Mjy4hd2xgrs','For each coin, update dp[i] += dp[i - coin]. Order matters (coins outer loop for combinations).'),
  skeleton(69,'review','Week 10 Review: 2D DP','Review','Easy',[],'','Review 2D DP tables. Focus on state definition and transition. LCS is the template for many string DP problems.'),
  skeleton(70,'rest','Rest Day','Rest','Easy',[],'','Rest. Week 11 brings advanced DP (intervals + decisions).'),

  // Week 11 — Advanced DP
  skeleton(71,'active','Word Break','DP + Hash Set','Medium',['Amazon','Google','Facebook'],'https://www.youtube.com/watch?v=Sx9NNgInc3A','dp[i] = True if s[:i] can be segmented. For each i, check all j: dp[j] and s[j:i] in word set.'),
  skeleton(72,'active','Partition Equal Subset Sum','DP Knapsack / Subset','Medium',['Amazon','Apple'],'https://www.youtube.com/watch?v=IsvocB5BJhw','Can any subset sum to total/2? dp[i] = True if sum i is achievable.'),
  skeleton(73,'active','Jump Game','Greedy','Medium',['Amazon','Microsoft'],'https://www.youtube.com/watch?v=Yan0cv2cLy8','Track max reachable index. If current index exceeds max_reach, return False.'),
  skeleton(74,'active','Jump Game II','Greedy BFS','Medium',['Amazon','Microsoft','Google'],'https://www.youtube.com/watch?v=dJ7sGKpfJo0','BFS levels: at each "level" (jump count), find the farthest you can reach.'),
  skeleton(75,'active','Longest Increasing Subsequence','DP / Binary Search','Medium',['Amazon','Google','Microsoft'],'https://www.youtube.com/watch?v=cjWnW0hdF1Y','DP O(n²): dp[i] = longest LIS ending at i. Patience sort O(n log n): maintain sorted tails array.'),
  skeleton(76,'review','Week 11 Review: Advanced DP','Review','Easy',[],'','Connect knapsack, jump game, and sequence DP. Can you identify the DP type from the problem structure?'),
  skeleton(77,'rest','Rest Day','Rest','Easy',[],'','Rest. Final week: Tries and Backtracking.'),

  // Week 12 — Tries & Backtracking
  skeleton(78,'active','Implement Trie','Trie','Medium',['Google','Amazon','Microsoft'],'https://www.youtube.com/watch?v=oobqoCJlHA0','TrieNode has children dict and is_end flag. Insert: walk/create nodes. Search: walk and check is_end.'),
  skeleton(79,'active','Word Search II','Trie + Backtracking','Hard',['Amazon','Microsoft'],'https://www.youtube.com/watch?v=asbcE9mZz_U','Build a Trie of words. DFS on grid with backtracking, prune using Trie paths.'),
  skeleton(80,'active','Subsets','Backtracking','Medium',['Amazon','Apple','Google'],'https://www.youtube.com/watch?v=REOH22Xwdkk','Backtrack: at each element, choose include or exclude. Recurse on both choices.'),
  skeleton(81,'active','Combination Sum','Backtracking','Medium',['Amazon','Google'],'https://www.youtube.com/watch?v=GBKI9VSKdGg','Backtrack with running sum. If sum == target, add to results. If sum > target, prune. Allow re-use.'),
  skeleton(82,'active','Word Search','Backtracking + DFS','Medium',['Amazon','Microsoft','Apple'],'https://www.youtube.com/watch?v=pfiQ_PS1g8E','DFS from each cell. Mark visited by temporarily modifying the grid. Restore on backtrack.'),
  skeleton(83,'review','Week 12 Review: Tries & Backtracking','Review','Easy',[],'','Review Trie construction and the backtracking template (choose, explore, unchoose).'),
  skeleton(84,'rest','Day 84 — Program Complete 🎯','Rest','Easy',[],'','You\'ve completed the full 12-week DSA curriculum. Every major pattern is in your toolkit. What you review next is up to you.'),
]

// ─────────────────────────────────────────────────────────────────
// Full 84-day curriculum export
// ─────────────────────────────────────────────────────────────────

export const CURRICULUM: DayData[] = [...WEEK1, ...WEEK2, ...WEEKS_3_12]

// Pattern appearance tracking — used to show PatternCard on first visit
export const PATTERN_FIRST_APPEARANCE: Record<string, number> = {}
CURRICULUM.forEach((d) => {
  if (d.patternCard && !(d.pattern in PATTERN_FIRST_APPEARANCE)) {
    PATTERN_FIRST_APPEARANCE[d.pattern] = d.day
  }
})

// Streak milestone messages
export const STREAK_MILESTONES: Record<number, string> = {
  3:  'Three days in. Habits form in the first week.',
  7:  'One full week. You\'re already ahead of 90% of people who start.',
  14: 'Two weeks. The patterns are starting to feel familiar.',
  21: 'Three weeks. This is officially a habit now.',
  30: '30 days. You\'ve built something most engineers never do.',
  50: '50 days. Half a century of deliberate practice.',
  84: '84 days. The full program. Complete.',
}
