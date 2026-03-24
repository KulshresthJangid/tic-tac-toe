export type Difficulty = 'easy' | 'medium' | 'hard'
export type NumStyle = 'solid' | 'outline' | 'muted'
export type CellStyle = 'bright' | 'mid' | 'dim' | 'normal'

export interface DSAProblem {
  name: string
  difficulty: Difficulty
  desc: string
  example: string
  approach: string
  time: string
  space: string
}

export interface DSAComplexityRow {
  cells: string[]
  styles: CellStyle[]
}

export interface DSATopic {
  id: string
  num: string
  numStyle: NumStyle
  title: string
  subtitle: string
  concepts: string[]
  complexityTable?: {
    headers: string[]
    rows: DSAComplexityRow[]
  }
  problems: DSAProblem[]
}

export const dsaTopics: DSATopic[] = [
  {
    id: 'arrays',
    num: '01',
    numStyle: 'solid',
    title: 'Arrays',
    subtitle: 'The bedrock of every data structure',
    concepts: [
      'Static vs Dynamic arrays',
      'Two Pointer technique',
      'Sliding Window',
      'Prefix Sum / Difference Array',
      "Kadane's Algorithm (max subarray)",
      'Dutch National Flag',
      'Merge Intervals',
      'Matrix traversal (row, column, diagonal, spiral)',
      'In-place operations',
      'Subarray / Subsequence problems',
    ],
    complexityTable: {
      headers: ['Operation', 'Average', 'Worst'],
      rows: [
        { cells: ['Access by index', 'O(1)', 'O(1)'], styles: ['normal', 'bright', 'bright'] },
        { cells: ['Search (unsorted)', 'O(n)', 'O(n)'], styles: ['normal', 'mid', 'mid'] },
        { cells: ['Insert at end', 'O(1)', 'O(n) amortized'], styles: ['normal', 'bright', 'mid'] },
        { cells: ['Insert at middle', 'O(n)', 'O(n)'], styles: ['normal', 'mid', 'mid'] },
        { cells: ['Delete', 'O(n)', 'O(n)'], styles: ['normal', 'mid', 'mid'] },
      ],
    },
    problems: [
      {
        name: 'Two Sum',
        difficulty: 'easy',
        desc: 'Find two indices in an array such that their values sum to a target.',
        example: 'Input:  nums=[2,7,11,15], target=9\nOutput: [0,1]  (nums[0]+nums[1]=9)',
        approach:
          'Use a HashMap. For each element x, check if (target - x) exists in the map. Store each element with its index as you iterate.',
        time: 'O(n)',
        space: 'O(n)',
      },
      {
        name: 'Maximum Product Subarray',
        difficulty: 'medium',
        desc: 'Find the contiguous subarray with the largest product.',
        example: 'Input:  nums=[2,3,-2,4]\nOutput: 6  (subarray [2,3])',
        approach:
          'Track both max and min products at each step (negatives can flip signs). maxProd = max(num, maxProd*num, minProd*num). Same for minProd.',
        time: 'O(n)',
        space: 'O(1)',
      },
      {
        name: 'Trapping Rain Water',
        difficulty: 'hard',
        desc: 'Given n non-negative integers representing an elevation map, compute how much water it can trap after raining.',
        example: 'Input:  height=[0,1,0,2,1,0,1,3,2,1,2,1]\nOutput: 6',
        approach:
          'Two-pointer approach: maintain leftMax and rightMax. Move the pointer with the smaller max inward. Water at position = min(leftMax, rightMax) - height[i].',
        time: 'O(n)',
        space: 'O(1)',
      },
    ],
  },
  {
    id: 'strings',
    num: '02',
    numStyle: 'outline',
    title: 'Strings',
    subtitle: 'Pattern matching, manipulation, encoding',
    concepts: [
      'String reversal & rotation',
      'Palindrome checking',
      'Anagram detection',
      'Sliding window on strings',
      'KMP pattern matching',
      'Rabin-Karp hashing',
      'Z-algorithm',
      'Longest Common Substring / Subsequence',
      'String compression (run-length)',
      'Trie-based string search',
    ],
    problems: [
      {
        name: 'Valid Palindrome',
        difficulty: 'easy',
        desc: 'Check if a string is a palindrome considering only alphanumeric characters.',
        example: 'Input:  "A man, a plan, a canal: Panama"\nOutput: true',
        approach:
          'Two pointers from both ends. Skip non-alphanumeric. Compare lowercased characters. Move both pointers inward.',
        time: 'O(n)',
        space: 'O(1)',
      },
      {
        name: 'Longest Substring Without Repeating',
        difficulty: 'medium',
        desc: 'Find the length of the longest substring without repeating characters.',
        example: 'Input:  s="abcabcbb"\nOutput: 3  (substring "abc")',
        approach:
          'Sliding window + HashMap. Expand right pointer. When duplicate found, move left pointer to max(left, lastSeen[char]+1). Track max window size.',
        time: 'O(n)',
        space: 'O(min(m,n))',
      },
      {
        name: 'Minimum Window Substring',
        difficulty: 'hard',
        desc: 'Find the minimum window in string s that contains all characters of string t.',
        example: 'Input:  s="ADOBECODEBANC", t="ABC"\nOutput: "BANC"',
        approach:
          "Sliding window with frequency maps. Track 'formed' count of valid chars. Shrink window from left when all t chars are satisfied. Record minimum valid window.",
        time: 'O(|s|+|t|)',
        space: 'O(|s|+|t|)',
      },
    ],
  },
  {
    id: 'linked-lists',
    num: '03',
    numStyle: 'muted',
    title: 'Linked Lists',
    subtitle: 'Singly, doubly, circular — pointers everywhere',
    concepts: [
      'Singly vs Doubly Linked List',
      'Circular Linked List',
      "Slow & Fast pointer (Floyd's)",
      'Reversing a linked list',
      'Merge two sorted lists',
      'Find middle node',
      'Detect & find cycle',
      'Remove nth from end',
      'Flatten multilevel list',
      'Copy list with random pointer',
    ],
    problems: [
      {
        name: 'Reverse Linked List',
        difficulty: 'easy',
        desc: 'Reverse a singly linked list iteratively or recursively.',
        example: 'Input:  1 → 2 → 3 → 4 → 5\nOutput: 5 → 4 → 3 → 2 → 1',
        approach:
          'Use three pointers: prev=null, curr=head, next. At each step: save next, point curr.next to prev, move prev to curr, move curr to next.',
        time: 'O(n)',
        space: 'O(1)',
      },
      {
        name: 'Reorder List',
        difficulty: 'medium',
        desc: 'Reorder: L0→L1→...→Ln to L0→Ln→L1→Ln-1→L2→Ln-2...',
        example: 'Input:  1 → 2 → 3 → 4 → 5\nOutput: 1 → 5 → 2 → 4 → 3',
        approach:
          '1) Find middle using slow/fast pointers. 2) Reverse second half. 3) Merge two halves by alternating nodes.',
        time: 'O(n)',
        space: 'O(1)',
      },
      {
        name: 'Merge K Sorted Lists',
        difficulty: 'hard',
        desc: 'Merge k sorted linked lists and return it as one sorted list.',
        example: 'Input:  [[1,4,5],[1,3,4],[2,6]]\nOutput: 1→1→2→3→4→4→5→6',
        approach:
          'Use a MinHeap (priority queue) of size k. Insert head of all lists. Repeatedly extract min, add to result, push next node of that list.',
        time: 'O(N log k)',
        space: 'O(k)',
      },
    ],
  },
  {
    id: 'stacks-queues',
    num: '04',
    numStyle: 'solid',
    title: 'Stacks & Queues',
    subtitle: 'LIFO / FIFO — the workhorses of parsing & BFS',
    concepts: [
      'Stack: push, pop, peek, isEmpty',
      'Monotonic Stack (increasing / decreasing)',
      'Queue: enqueue, dequeue, front',
      'Deque (double-ended queue)',
      'Circular Queue implementation',
      'Stack using Queues & vice versa',
      'Next Greater Element pattern',
      'Balanced parentheses',
      'BFS using Queue',
      'Min Stack design',
    ],
    problems: [
      {
        name: 'Valid Parentheses',
        difficulty: 'easy',
        desc: 'Determine if the input string of brackets is valid and properly closed.',
        example: 'Input:  "({[]})"\nOutput: true\n\nInput:  "([)]"\nOutput: false',
        approach:
          'Use a Stack. Push opening brackets. On closing bracket, check if top of stack is the matching opener. At end, stack must be empty.',
        time: 'O(n)',
        space: 'O(n)',
      },
      {
        name: 'Daily Temperatures',
        difficulty: 'medium',
        desc: 'For each day, find the number of days until a warmer temperature.',
        example: 'Input:  [73,74,75,71,69,72,76,73]\nOutput: [1,1,4,2,1,1,0,0]',
        approach:
          'Monotonic decreasing stack storing indices. For each temp, pop all stack elements smaller than current and compute their wait days as (current index - popped index).',
        time: 'O(n)',
        space: 'O(n)',
      },
      {
        name: 'Largest Rectangle in Histogram',
        difficulty: 'hard',
        desc: 'Find the largest rectangle area in a histogram.',
        example: 'Input:  heights=[2,1,5,6,2,3]\nOutput: 10  (bars 5 and 6, width=2)',
        approach:
          'Monotonic increasing stack. For each bar, pop while current height < stack top. Area = height[popped] × (current_i - stack_top - 1). Append sentinel 0 at end.',
        time: 'O(n)',
        space: 'O(n)',
      },
    ],
  },
  {
    id: 'hashing',
    num: '05',
    numStyle: 'outline',
    title: 'Hashing',
    subtitle: 'O(1) lookups — the secret weapon',
    concepts: [
      'Hash functions & collision handling',
      'Chaining vs Open Addressing',
      'HashMap / HashSet internals',
      'Load factor & rehashing',
      'Frequency counting',
      'Grouping by hash value',
      'Rolling hash (Rabin-Karp)',
      'Consistent hashing',
    ],
    problems: [
      {
        name: 'Contains Duplicate',
        difficulty: 'easy',
        desc: 'Return true if any value appears at least twice in the array.',
        example: 'Input:  [1,2,3,1]\nOutput: true',
        approach:
          'Use a HashSet. Iterate; if element already in set, return true. Otherwise add to set.',
        time: 'O(n)',
        space: 'O(n)',
      },
      {
        name: 'Group Anagrams',
        difficulty: 'medium',
        desc: 'Group an array of strings into groups of anagrams.',
        example:
          'Input:  ["eat","tea","tan","ate","nat","bat"]\nOutput: [["bat"],["nat","tan"],["ate","eat","tea"]]',
        approach:
          'Use sorted string or char-count tuple as key in a HashMap. Group words by their canonical key.',
        time: 'O(n·k log k)',
        space: 'O(n·k)',
      },
      {
        name: 'Subarray Sum Equals K',
        difficulty: 'hard',
        desc: 'Find the total number of continuous subarrays whose sum equals k.',
        example: 'Input:  nums=[1,1,1], k=2\nOutput: 2',
        approach:
          'Use prefix sum + HashMap. For each prefix sum, check if (prefixSum - k) exists in map. Count of that key is the number of valid subarrays ending here.',
        time: 'O(n)',
        space: 'O(n)',
      },
    ],
  },
  {
    id: 'recursion',
    num: '06',
    numStyle: 'muted',
    title: 'Recursion',
    subtitle: 'Base cases, call stack, divide & conquer thinking',
    concepts: [
      'Base case & recursive case',
      'Tail recursion',
      'Memoization (top-down DP)',
      'Tree recursion',
      'Divide & Conquer',
      'Mutual recursion',
      'Stack overflow & depth limits',
      'Recurrence relations (Master Theorem)',
    ],
    problems: [
      {
        name: 'Fibonacci Number',
        difficulty: 'easy',
        desc: 'Calculate the nth Fibonacci number.',
        example: 'Input:  n=10\nOutput: 55',
        approach:
          'Recursive with memoization (top-down DP). Cache fib(n) results in a HashMap to avoid redundant recomputation. Goes from O(2^n) to O(n).',
        time: 'O(n)',
        space: 'O(n)',
      },
      {
        name: 'Permutations',
        difficulty: 'medium',
        desc: 'Return all possible permutations of a distinct integer array.',
        example: 'Input:  [1,2,3]\nOutput: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]',
        approach:
          'Backtracking recursion. At each step, choose an unused element, add to current path, recurse, then remove (backtrack). Base case: path length = n.',
        time: 'O(n × n!)',
        space: 'O(n)',
      },
      {
        name: 'Regular Expression Matching',
        difficulty: 'hard',
        desc: "Implement regex matching with '.' (any char) and '*' (zero or more of preceding).",
        example: 'Input:  s="aab", p="c*a*b"\nOutput: true',
        approach:
          "Recursion + memoization on (i,j) positions. If p[j+1]='*', try zero matches (skip p[j] and '*') or one match (advance s if chars match).",
        time: 'O(m×n)',
        space: 'O(m×n)',
      },
    ],
  },
  {
    id: 'sorting',
    num: '07',
    numStyle: 'solid',
    title: 'Sorting Algorithms',
    subtitle: 'Comparison & non-comparison sorts',
    concepts: [
      'Bubble Sort, Selection Sort, Insertion Sort',
      'Merge Sort (stable, divide & conquer)',
      'Quick Sort (Lomuto / Hoare partition)',
      'Heap Sort',
      'Counting Sort — O(n+k)',
      'Radix Sort',
      'Bucket Sort',
      "Tim Sort (Python's built-in)",
      'Stability in sorting',
      'External sorting',
    ],
    complexityTable: {
      headers: ['Algorithm', 'Best', 'Average', 'Worst', 'Stable?'],
      rows: [
        {
          cells: ['Bubble Sort', 'O(n)', 'O(n²)', 'O(n²)', 'Yes'],
          styles: ['normal', 'mid', 'dim', 'dim', 'normal'],
        },
        {
          cells: ['Merge Sort', 'O(n log n)', 'O(n log n)', 'O(n log n)', 'Yes'],
          styles: ['normal', 'bright', 'bright', 'bright', 'normal'],
        },
        {
          cells: ['Quick Sort', 'O(n log n)', 'O(n log n)', 'O(n²)', 'No'],
          styles: ['normal', 'bright', 'bright', 'dim', 'normal'],
        },
        {
          cells: ['Heap Sort', 'O(n log n)', 'O(n log n)', 'O(n log n)', 'No'],
          styles: ['normal', 'bright', 'bright', 'bright', 'normal'],
        },
        {
          cells: ['Counting Sort', 'O(n+k)', 'O(n+k)', 'O(n+k)', 'Yes'],
          styles: ['normal', 'bright', 'bright', 'bright', 'normal'],
        },
      ],
    },
    problems: [
      {
        name: 'Sort Colors (Dutch Flag)',
        difficulty: 'easy',
        desc: 'Sort an array of 0s, 1s, and 2s in-place in one pass.',
        example: 'Input:  [2,0,2,1,1,0]\nOutput: [0,0,1,1,2,2]',
        approach:
          '3-pointer Dutch National Flag: low, mid, high. Swap arr[mid] based on value: 0→swap with low++, 1→mid++, 2→swap with high--.',
        time: 'O(n)',
        space: 'O(1)',
      },
      {
        name: 'Kth Largest Element',
        difficulty: 'medium',
        desc: 'Find the kth largest element in an unsorted array.',
        example: 'Input:  [3,2,1,5,6,4], k=2\nOutput: 5',
        approach:
          'Quickselect (partial quicksort). Partition around pivot. If pivot index = n-k, return pivot. Otherwise recurse on the correct partition. Average O(n).',
        time: 'O(n) avg',
        space: 'O(1)',
      },
      {
        name: 'Count of Smaller Numbers After Self',
        difficulty: 'hard',
        desc: 'For each element, count how many elements to its right are smaller.',
        example: 'Input:  [5,2,6,1]\nOutput: [2,1,1,0]',
        approach:
          'Modified Merge Sort — count inversions during merge. When right-half element is placed before left-half elements, those left-half elements get incremented counts.',
        time: 'O(n log n)',
        space: 'O(n)',
      },
    ],
  },
  {
    id: 'searching',
    num: '08',
    numStyle: 'outline',
    title: 'Searching & Binary Search',
    subtitle: 'The "think in halves" paradigm',
    concepts: [
      'Linear Search',
      'Binary Search (iterative & recursive)',
      'Search on answer space',
      'Lower bound / Upper bound',
      'Search in rotated sorted array',
      'Search in 2D matrix',
      'Exponential search',
      'Ternary search (unimodal functions)',
    ],
    problems: [
      {
        name: 'Binary Search',
        difficulty: 'easy',
        desc: 'Return the index of a target in a sorted array, or -1 if not found.',
        example: 'Input:  nums=[-1,0,3,5,9,12], target=9\nOutput: 4',
        approach:
          'lo=0, hi=n-1. While lo≤hi: mid=(lo+hi)/2. If nums[mid]=target return mid; if less, lo=mid+1; else hi=mid-1.',
        time: 'O(log n)',
        space: 'O(1)',
      },
      {
        name: 'Search in Rotated Sorted Array',
        difficulty: 'medium',
        desc: 'Search target in a rotated sorted array (no duplicates).',
        example: 'Input:  nums=[4,5,6,7,0,1,2], target=0\nOutput: 4',
        approach:
          'Binary search. At each mid, determine which half is sorted. If target falls in sorted half, search there; else search the other half.',
        time: 'O(log n)',
        space: 'O(1)',
      },
      {
        name: 'Median of Two Sorted Arrays',
        difficulty: 'hard',
        desc: 'Find the median of two sorted arrays in O(log(m+n)) time.',
        example: 'Input:  nums1=[1,3], nums2=[2]\nOutput: 2.0',
        approach:
          'Binary search on the smaller array to find the correct partition point. Ensure left halves of both arrays together form the "smaller half". Check max-left ≤ min-right.',
        time: 'O(log(min(m,n)))',
        space: 'O(1)',
      },
    ],
  },
  {
    id: 'trees',
    num: '09',
    numStyle: 'muted',
    title: 'Trees',
    subtitle: 'DFS, BFS, traversals, and tree properties',
    concepts: [
      'Binary Tree structure',
      'Inorder, Preorder, Postorder (DFS)',
      'Level Order Traversal (BFS)',
      'Tree height / depth / diameter',
      'Lowest Common Ancestor (LCA)',
      'Symmetric / balanced tree checks',
      'Serialize & Deserialize',
      'Path Sum problems',
      'N-ary trees',
      'Morris Traversal (O(1) space)',
    ],
    problems: [
      {
        name: 'Maximum Depth of Binary Tree',
        difficulty: 'easy',
        desc: 'Find the maximum depth (nodes along the longest path from root to leaf).',
        example: '    3\n   / \\\n  9  20\n    /  \\\n   15   7\nOutput: 3',
        approach:
          'Recursive DFS. maxDepth(node) = 1 + max(maxDepth(left), maxDepth(right)). Base case: null → 0.',
        time: 'O(n)',
        space: 'O(h)',
      },
      {
        name: 'Binary Tree Right Side View',
        difficulty: 'medium',
        desc: 'Return the values visible from the right side (rightmost at each level).',
        example: 'Input:  [1,2,3,null,5,null,4]\nOutput: [1,3,4]',
        approach:
          'BFS level order traversal. For each level, record the last node in the queue. That is the rightmost visible node.',
        time: 'O(n)',
        space: 'O(w) width',
      },
      {
        name: 'Binary Tree Maximum Path Sum',
        difficulty: 'hard',
        desc: 'Find the maximum path sum — a path goes from any node to any node.',
        example: 'Input:  [-10,9,20,null,null,15,7]\nOutput: 42  (15 → 20 → 7)',
        approach:
          'Post-order DFS. For each node, compute max single-branch gain. Update global max with node.val + leftGain + rightGain. Return node.val + max(leftGain, rightGain) to parent.',
        time: 'O(n)',
        space: 'O(h)',
      },
    ],
  },
  {
    id: 'bst',
    num: '10',
    numStyle: 'solid',
    title: 'Binary Search Trees',
    subtitle: 'Ordered trees — key property: left < root < right',
    concepts: [
      'BST insert, delete, search',
      'In-order gives sorted sequence',
      'Find kth smallest / largest',
      'BST validation',
      'Floor, ceiling in BST',
      'Predecessor & Successor',
      'BST to sorted doubly linked list',
      'Self-balancing: AVL, Red-Black trees',
      'Balanced BST from sorted array',
    ],
    problems: [
      {
        name: 'Search in BST',
        difficulty: 'easy',
        desc: 'Given a BST root and a value, return the subtree rooted with that value.',
        example: 'Input:  BST=[4,2,7,1,3], val=2\nOutput: [2,1,3]',
        approach:
          'If val = root.val, return root. If val < root.val, recurse left. If val > root.val, recurse right. Return null if not found.',
        time: 'O(h)',
        space: 'O(h)',
      },
      {
        name: 'Validate BST',
        difficulty: 'medium',
        desc: 'Determine if a binary tree is a valid binary search tree.',
        example: 'Input:  [5,1,4,null,null,3,6]\nOutput: false  (4\'s right child 3 < 4)',
        approach:
          "DFS with min/max bounds. Each node must satisfy min < node.val < max. Pass updated bounds down: left child gets (min, node.val), right child gets (node.val, max).",
        time: 'O(n)',
        space: 'O(h)',
      },
      {
        name: 'Recover BST (Two Nodes Swapped)',
        difficulty: 'hard',
        desc: 'Two nodes of a BST are swapped by mistake. Recover without changing structure.',
        example: 'Input:  [3,1,4,null,null,2]\nOutput: [2,1,4,null,null,3]',
        approach:
          'In-order traversal finds two inversions (prev > curr). First inversion: first = prev; second inversion: second = curr. Swap their values. Morris traversal gives O(1) space.',
        time: 'O(n)',
        space: 'O(1) Morris',
      },
    ],
  },
  {
    id: 'heaps',
    num: '11',
    numStyle: 'outline',
    title: 'Heaps & Priority Queues',
    subtitle: 'Always get the min (or max) in O(log n)',
    concepts: [
      'Min-Heap & Max-Heap',
      'Heapify (build heap) — O(n)',
      'Insert & extract: O(log n)',
      'Heap Sort',
      'K-way merge using heap',
      'Top-K elements pattern',
      'Median of a data stream (two heaps)',
      'Priority Queue API usage',
    ],
    problems: [
      {
        name: 'Kth Largest in Stream',
        difficulty: 'easy',
        desc: 'Design a class that finds the kth largest element in a stream.',
        example: 'k=3, initial=[4,5,8,2]\nadd(3) → 4\nadd(5) → 5\nadd(10) → 5',
        approach:
          'Maintain a Min-Heap of size k. When adding, push element; if heap size > k, pop minimum. Top of the heap is always the kth largest.',
        time: 'O(log k) add',
        space: 'O(k)',
      },
      {
        name: 'Task Scheduler',
        difficulty: 'medium',
        desc: 'Minimum intervals to execute all tasks with cooling time n between same tasks.',
        example: 'Input:  tasks=["A","A","A","B","B","B"], n=2\nOutput: 8  (A→B→idle→A→B→idle→A→B)',
        approach:
          'Max-heap of task frequencies + cooldown queue. Each round: pop most frequent, execute, decrement, push to cooldown with release time. Advance clock.',
        time: 'O(n log n)',
        space: 'O(n)',
      },
      {
        name: 'Find Median from Data Stream',
        difficulty: 'hard',
        desc: 'Support addNum and findMedian operations on a live data stream.',
        example: 'addNum(1), addNum(2), findMedian() → 1.5\naddNum(3), findMedian() → 2.0',
        approach:
          'Two heaps: max-heap for lower half, min-heap for upper half. Balance sizes so they differ by at most 1. Median = top of larger heap or average of both tops.',
        time: 'O(log n) add',
        space: 'O(n)',
      },
    ],
  },
  {
    id: 'graphs',
    num: '12',
    numStyle: 'muted',
    title: 'Graphs',
    subtitle: 'BFS, DFS, shortest paths, spanning trees',
    concepts: [
      'Adjacency List vs Matrix',
      'BFS (shortest path unweighted)',
      'DFS (cycle detection, topological sort)',
      "Dijkstra's Algorithm (weighted)",
      'Bellman-Ford (negative weights)',
      'Floyd-Warshall (all-pairs)',
      "Kruskal's & Prim's (MST)",
      'Union-Find / Disjoint Set Union',
      "Topological Sort (Kahn's / DFS)",
      'Strongly Connected Components (Tarjan / Kosaraju)',
    ],
    problems: [
      {
        name: 'Number of Islands',
        difficulty: 'easy',
        desc: "Count the number of islands (connected '1's) in a 2D binary grid.",
        example:
          'Input:  [["1","1","0"],\n         ["0","1","0"],\n         ["0","0","1"]]\nOutput: 2',
        approach:
          "DFS/BFS from each unvisited '1'. Mark visited cells as '0'. Each DFS call counts as one island. Return total DFS calls.",
        time: 'O(m×n)',
        space: 'O(m×n)',
      },
      {
        name: 'Course Schedule (Cycle Detection)',
        difficulty: 'medium',
        desc: "Determine if it's possible to finish all courses given prerequisites.",
        example: 'Input:  numCourses=2, prerequisites=[[1,0]]\nOutput: true  (take 0, then 1)',
        approach:
          'Build directed graph of prerequisites. Run DFS with 3-color marking (white/gray/black). If we visit a gray node (currently in stack), there is a cycle.',
        time: 'O(V+E)',
        space: 'O(V+E)',
      },
      {
        name: 'Alien Dictionary (Topo Sort)',
        difficulty: 'hard',
        desc: 'Derive the order of letters in an alien language from a sorted dictionary.',
        example: 'Input:  ["wrt","wrf","er","ett","rftt"]\nOutput: "wertf"',
        approach:
          "Compare adjacent words to extract ordering constraints (edges). Build a directed graph. Run topological sort (Kahn's BFS). If all nodes processed, return order; else cycle detected.",
        time: 'O(C) chars',
        space: 'O(1) ≤ 26 chars',
      },
    ],
  },
  {
    id: 'dp',
    num: '13',
    numStyle: 'solid',
    title: 'Dynamic Programming',
    subtitle: 'Overlapping subproblems + optimal substructure',
    concepts: [
      'Memoization (top-down)',
      'Tabulation (bottom-up)',
      '1D DP: Fibonacci, Climbing Stairs',
      '2D DP: Grid paths, LCS, Edit Distance',
      '0/1 Knapsack',
      'Unbounded Knapsack',
      'Longest Increasing Subsequence (LIS)',
      'Longest Common Subsequence (LCS)',
      'Matrix Chain Multiplication',
      'Interval DP (Burst Balloons)',
      'Bitmask DP (Travelling Salesman)',
      'DP on Trees & Graphs',
    ],
    problems: [
      {
        name: 'Climbing Stairs',
        difficulty: 'easy',
        desc: 'Count distinct ways to climb n stairs (1 or 2 steps at a time).',
        example: 'Input:  n=5\nOutput: 8',
        approach:
          "It's Fibonacci! dp[i] = dp[i-1] + dp[i-2]. Use two variables instead of full array. dp[1]=1, dp[2]=2, iterate up to n.",
        time: 'O(n)',
        space: 'O(1)',
      },
      {
        name: 'Coin Change',
        difficulty: 'medium',
        desc: 'Find the fewest coins to make up a given amount.',
        example: 'Input:  coins=[1,5,11], amount=15\nOutput: 3  (5+5+5)',
        approach:
          'Bottom-up DP. dp[0]=0. For each amount from 1 to target: dp[i] = min(dp[i], dp[i-coin]+1) for each coin. Initialize dp array with infinity.',
        time: 'O(amount×n)',
        space: 'O(amount)',
      },
      {
        name: 'Edit Distance',
        difficulty: 'hard',
        desc: 'Find minimum operations (insert, delete, replace) to convert word1 to word2.',
        example: 'Input:  word1="horse", word2="ros"\nOutput: 3  (horse→rorse→rose→ros)',
        approach:
          '2D DP. dp[i][j] = edit distance for word1[0..i] and word2[0..j]. If chars match: dp[i-1][j-1]. Else: 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]).',
        time: 'O(m×n)',
        space: 'O(m×n)',
      },
    ],
  },
  {
    id: 'greedy',
    num: '14',
    numStyle: 'outline',
    title: 'Greedy Algorithms',
    subtitle: 'Locally optimal choices → globally optimal solution',
    concepts: [
      'Activity selection / Interval scheduling',
      'Fractional Knapsack',
      'Huffman Encoding',
      'Job sequencing with deadlines',
      'Jump Game variants',
      "Minimum spanning tree (Prim's, Kruskal's)",
      'Dijkstra as a greedy algorithm',
      'Proof of correctness via exchange argument',
    ],
    problems: [
      {
        name: 'Best Time to Buy and Sell Stock',
        difficulty: 'easy',
        desc: 'Maximize profit from one transaction (buy then sell).',
        example: 'Input:  prices=[7,1,5,3,6,4]\nOutput: 5  (buy at 1, sell at 6)',
        approach:
          'Track minimum price seen so far. For each price, compute potential profit (price - minPrice). Update maxProfit greedily.',
        time: 'O(n)',
        space: 'O(1)',
      },
      {
        name: 'Jump Game II',
        difficulty: 'medium',
        desc: 'Find the minimum number of jumps to reach the last index.',
        example: 'Input:  nums=[2,3,1,1,4]\nOutput: 2  (0→1→4)',
        approach:
          'Greedy BFS levels. Track current range end and farthest reachable. When you exhaust current range, increment jumps and update range to farthest.',
        time: 'O(n)',
        space: 'O(1)',
      },
      {
        name: 'Candy Distribution',
        difficulty: 'hard',
        desc: 'Distribute minimum candies such that higher-rated child than neighbor gets more.',
        example: 'Input:  ratings=[1,0,2]\nOutput: 5  (2,1,2 candies)',
        approach:
          'Two passes. Left-to-right: give +1 if rating > left neighbor. Right-to-left: give max(current, right+1) if rating > right neighbor. Sum up the array.',
        time: 'O(n)',
        space: 'O(n)',
      },
    ],
  },
  {
    id: 'backtracking',
    num: '15',
    numStyle: 'muted',
    title: 'Backtracking',
    subtitle: 'Explore all paths, prune dead ends',
    concepts: [
      'Backtracking template (choose, explore, unchoose)',
      'Subsets / Power set',
      'Permutations with / without duplicates',
      'Combinations',
      'N-Queens problem',
      'Sudoku Solver',
      'Word Search on grid',
      'Constraint satisfaction pruning',
    ],
    problems: [
      {
        name: 'Subsets',
        difficulty: 'easy',
        desc: 'Return all possible subsets (power set) of a distinct integer array.',
        example: 'Input:  [1,2,3]\nOutput: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]',
        approach:
          'Backtracking. At each index, choose to include or exclude the element. DFS builds all subsets. Also solvable with bitmask iteration (1<<n possibilities).',
        time: 'O(n × 2^n)',
        space: 'O(n)',
      },
      {
        name: 'Combination Sum',
        difficulty: 'medium',
        desc: 'Find all unique combinations that sum to target (elements can repeat).',
        example: 'Input:  candidates=[2,3,6,7], target=7\nOutput: [[2,2,3],[7]]',
        approach:
          'Backtracking from start index. Include current (reduce target, do not advance) or skip to next. Prune when target < 0. Base case: target == 0, record path.',
        time: 'O(n^(T/M))',
        space: 'O(T/M)',
      },
      {
        name: 'N-Queens',
        difficulty: 'hard',
        desc: 'Place n queens on n×n chessboard so no two queens attack each other.',
        example:
          'Input:  n=4\nOutput: [[".Q..","...Q","Q...","..Q."],\n         ["..Q.","Q...","...Q",".Q.."]]',
        approach:
          'Place one queen per row. Use 3 sets: columns, diagonals (r-c), anti-diagonals (r+c) for O(1) conflict checks. Backtrack if no valid column in current row.',
        time: 'O(n!)',
        space: 'O(n²)',
      },
    ],
  },
  {
    id: 'tries',
    num: '16',
    numStyle: 'solid',
    title: 'Tries (Prefix Trees)',
    subtitle: 'Efficient string search and prefix matching',
    concepts: [
      'Trie node structure (children + isEnd)',
      'Insert, Search, StartsWith',
      'Delete from Trie',
      'Autocomplete / Word suggestion',
      'Word Search II (Trie + DFS)',
      'XOR Trie (maximum XOR)',
      'Compressed Trie / Patricia Trie',
      'Aho-Corasick (multi-pattern matching)',
    ],
    problems: [
      {
        name: 'Implement Trie',
        difficulty: 'easy',
        desc: 'Implement a Trie with insert, search, and startsWith operations.',
        example:
          'insert("apple")\nsearch("apple")   → true\nsearch("app")     → false\nstartsWith("app") → true',
        approach:
          'Each node has children[26] and isEndOfWord flag. Insert: create nodes as needed. Search: traverse chars, check isEndOfWord. StartsWith: same but skip isEnd check.',
        time: 'O(m) per op',
        space: 'O(m×n)',
      },
      {
        name: 'Add and Search Words',
        difficulty: 'medium',
        desc: "Design a data structure that supports search with '.' wildcard.",
        example: 'addWord("bad"), addWord("dad")\nsearch(".ad") → true\nsearch("b..") → true',
        approach:
          "Trie with DFS search. For '.' wildcard, try all 26 children recursively. For regular chars, follow the specific child. Return false if dead-end.",
        time: 'O(m) typical',
        space: 'O(m×n)',
      },
      {
        name: 'Word Search II',
        difficulty: 'hard',
        desc: 'Find all words from a dictionary that appear in a 2D board.',
        example:
          'board=[["o","a","a","n"],["e","t","a","e"],...]\nwords=["oath","pea","eat","rain"]\nOutput: ["eat","oath"]',
        approach:
          'Build a Trie from words. DFS on board from every cell. At each cell, advance the Trie pointer. If node.isEnd, record word. Prune when no Trie child matches. Unmark visited on backtrack.',
        time: 'O(m×n×4^L)',
        space: 'O(W×L)',
      },
    ],
  },
  {
    id: 'segment-trees',
    num: '17',
    numStyle: 'outline',
    title: 'Segment Trees & Fenwick Trees',
    subtitle: 'Range queries and point updates in O(log n)',
    concepts: [
      'Segment Tree structure (array of size 4n)',
      'Build: O(n), Query: O(log n), Update: O(log n)',
      'Range sum / min / max queries',
      'Lazy propagation (range updates)',
      'Binary Indexed Tree (BIT / Fenwick)',
      'BIT: prefix sum, point update in O(log n)',
      'Order statistics with BIT',
      'Merge sort tree',
    ],
    problems: [
      {
        name: 'Range Sum Query (Immutable)',
        difficulty: 'easy',
        desc: 'Handle multiple range sum queries efficiently on a fixed array.',
        example: 'NumArray([-2,0,3,-5,2,-1])\nsumRange(0,2) → 1\nsumRange(2,5) → -1',
        approach:
          'Precompute prefix sums in O(n). Answer each query in O(1) as prefix[right+1] - prefix[left].',
        time: 'O(1) query',
        space: 'O(n)',
      },
      {
        name: 'Range Sum Query (Mutable)',
        difficulty: 'medium',
        desc: 'Support both range sum queries and point updates efficiently.',
        example: 'NumArray([1,3,5])\nsumRange(0,2) → 9\nupdate(1,2)\nsumRange(0,2) → 8',
        approach:
          'Binary Indexed Tree (BIT). update(i, delta): add delta propagating via i += i&(-i). query(i): sum using i -= i&(-i). Range = query(right) - query(left-1).',
        time: 'O(log n)',
        space: 'O(n)',
      },
      {
        name: 'The Skyline Problem',
        difficulty: 'hard',
        desc: 'Find the skyline formed by a list of buildings (left, right, height).',
        example: 'Input:  [[2,9,10],[3,7,15],[5,12,12]]\nOutput: [[2,10],[3,15],[7,12],[12,0]]',
        approach:
          'Process events (building starts/ends) sorted by x. Use a Max-Heap of active building heights. Add height on start, remove on end. Record key point when max height changes.',
        time: 'O(n log n)',
        space: 'O(n)',
      },
    ],
  },
  {
    id: 'bit-manip',
    num: '18',
    numStyle: 'muted',
    title: 'Bit Manipulation',
    subtitle: 'Binary tricks that feel like magic',
    concepts: [
      'AND, OR, XOR, NOT, left/right shifts',
      'Check kth bit: (n >> k) & 1',
      'Set kth bit: n | (1 << k)',
      'Clear kth bit: n & ~(1 << k)',
      'Toggle kth bit: n ^ (1 << k)',
      'n & (n-1): clears lowest set bit',
      'n & (-n): isolates lowest set bit',
      'XOR properties (a^a=0, a^0=a)',
      'Bit masking for subsets',
      "Brian Kernighan's algorithm (count bits)",
    ],
    problems: [
      {
        name: 'Single Number',
        difficulty: 'easy',
        desc: 'Find the element that appears once; all others appear exactly twice.',
        example: 'Input:  [4,1,2,1,2]\nOutput: 4',
        approach:
          'XOR all elements. Since a^a=0 and a^0=a, paired elements cancel out and only the single element remains.',
        time: 'O(n)',
        space: 'O(1)',
      },
      {
        name: 'Sum of Two Integers (No + or -)',
        difficulty: 'medium',
        desc: 'Calculate sum of two integers without using + or - operators.',
        example: 'Input:  a=2, b=3\nOutput: 5',
        approach:
          'XOR gives sum without carry. AND+left-shift gives the carry. Repeat until carry is 0: a = a^b, b = (old_a & b) << 1. Handle negatives with a 32-bit mask.',
        time: 'O(1)',
        space: 'O(1)',
      },
      {
        name: 'Maximum XOR of Two Numbers',
        difficulty: 'hard',
        desc: 'Find the maximum XOR of any two numbers in an array.',
        example: 'Input:  [3,10,5,25,2,8]\nOutput: 28  (5 XOR 25 = 28)',
        approach:
          'Build an XOR Trie from all numbers (bit by bit from MSB). For each number, traverse the trie choosing the opposite bit path when available to maximize XOR.',
        time: 'O(n)',
        space: 'O(n)',
      },
    ],
  },
]
