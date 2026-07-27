# CodeSignal Prep Packet

Updated: 2026-07-27

Use Python. Optimize for fast, correct single-function implementation, not cleverness. For AI/backend/FDE screens, expect the normal CodeSignal General Coding Framework plus custom backend-style record parsing or workflow validation.

## Current GCA Shape

- Four questions in 70 minutes.
- Questions can be attempted in any order.
- Current certified scoring uses a 200-600 range.
- Submit each solved question in the IDE; unsent work may not count.
- Do not use external AI during the assessment. Know Python standard library cold.

Official references:

- GCA structure: https://support.codesignal.com/hc/en-us/articles/360040370853-What-should-I-expect-when-I-take-the-General-Coding-Assessment-GCA-and-how-is-it-structured
- GCA rules/setup: https://support.codesignal.com/hc/en-us/articles/360051960134-General-Coding-Assessment-GCA-Rules-and-Setup
- Score range conversion: https://support.codesignal.com/hc/en-us/articles/13260678794775-Converting-Historical-Coding-Score-Thresholds-to-Assessment-Score
- Practice flow: https://support.codesignal.com/hc/en-us/articles/21025134150423-How-do-I-practice-coding-questions-on-CodeSignal
- Assessment UI: https://support.codesignal.com/hc/en-us/articles/360045953873-Taking-an-assessment-on-CodeSignal

Image / UI URLs to view:

- Setup screenshot: https://support.codesignal.com/hc/article_attachments/360068564774
- Practice question screenshot: https://support.codesignal.com/hc/article_attachments/29294091611287
- CodeSignal example questions: https://codesignal.com/blog/example-codesignal-questions/
- Practice coding questions: https://support.codesignal.com/hc/en-us/articles/21025134150423-How-do-I-practice-coding-questions-on-CodeSignal
- Taking an assessment UI: https://support.codesignal.com/hc/en-us/articles/360045953873-Taking-an-assessment-on-CodeSignal

## Likely Question Types

1. Array/string basics: one pass, counters, edge handling.
2. Pattern matching: sliding windows, substring checks, small nested loops when constraints allow.
3. Matrix/grid simulation: row/column traversal, collision/placement, state mutation.
4. Hash table optimization: turn pair/search logic into O(n) or O(n log n).
5. Sorting plus sweep: intervals, logs, timestamps, events.
6. Stack/queue simulation: command processors, path/state machines, monotonic stack.
7. Graph-lite: BFS/DFS on grids or small dependency graphs.
8. Backend/FDE custom screens: parse records, validate rules, reconcile state, emit audit-friendly output.

## Time Plan

Default order: `Q1 -> Q2 -> Q4 -> Q3`, unless Q4 looks unfamiliar.

Budget:

- Q1: 7 minutes.
- Q2: 12 minutes.
- Q4: 20 minutes.
- Q3: 25 minutes.
- Final pass: 6 minutes.

## Eight Practice Problems

1. Neighbor Sum Array: return each element plus left/right neighbors. Strategy: one loop, boundary checks.
2. Vowel Pattern Match: count substrings matching `0=vowel`, `1=consonant`. Strategy: helper predicate, scan each start or sliding window.
3. Tetris Drop: drop a 3x3 figure into a binary field and find a column that completes a row. Strategy: simulate each valid column, test collision, test filled rows.
4. Power Pair Count: count pairs whose sum is a power of two. Strategy: frequency dict while scanning; enumerate powers.
5. API Log Reconciliation: request/response events; return request IDs missing success within N seconds. Strategy: dict by ID, timestamp compare, sorted output.
6. Approval Workflow Validator: records have `submitted`, `approved`, `paid`; flag illegal transitions. Strategy: finite-state machine per entity.
7. Meeting Rooms / Worker Capacity: intervals; return peak concurrent jobs. Strategy: event sweep with `+1/-1`.
8. Dependency Unlocks: tasks and prerequisites; return executable order or `[]` on cycle. Strategy: topological sort with indegrees.

## Python Toolkit To Memorize

- `dict`, `set`, `Counter`, `defaultdict`.
- `deque` for BFS/queues.
- `heapq` for priority queues.
- `bisect` for sorted insertion/search.
- `sorted(items, key=...)` for sweep/event ordering.
- Defensive parsing: handle empty input, one element, duplicate keys, and unsorted records.
