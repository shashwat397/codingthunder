import React from 'react';
import { PythonCalloutBox } from '../PythonCalloutBox.tsx';
import { CodeBlock } from '../../common/CodeBlock.tsx';
import { WhileLoopDiagram } from '../diagrams/WhileLoopDiagram.tsx';
import { ScopeLEGBDiagram } from '../diagrams/ScopeLEGBDiagram.tsx';

/* =========================================================================
   CHAPTER 5: Loops & Iteration
   ========================================================================= */
export const Chapter5Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-200">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
          <span>Chapter 05</span>
          <span>·</span>
          <span>Control Flow</span>
          <span>·</span>
          <span>25 min read</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Loops & Iteration: while, range(), break, continue & The Loop-Else Protocol
        </h1>
        <p className="text-base text-slate-400 mt-2 leading-relaxed">
          Repetition is a fundamental pillar of programming. Python provides two primary iterative constructs: deterministic <code className="text-amber-400">for</code> loops (which iterate over iterable objects) and condition-governed <code className="text-amber-400">while</code> loops.
        </p>
      </div>

      <div className="border-t border-slate-800/80 pt-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">1. While Loop Lifecycle & The Mysterious else Clause</h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          The <code className="text-cyan-300">while</code> loop continues executing as long as its target condition evaluates to <code className="text-emerald-400">True</code>. The diagram below illustrates loop initialization, condition testing, mutation, early escapes via <code className="text-rose-400">break</code>, and normal termination executing the <code className="text-cyan-300">else:</code> block.
        </p>

        {/* Visual SVG Diagram */}
        <WhileLoopDiagram />

        <CodeBlock
          filename="loops_deep_dive.py"
          language="python"
          code={`# 1. The Power of while...else (Search Pattern)
def search_in_cluster(nodes: list[str], target: str) -> bool:
    i = 0
    while i < len(nodes):
        if nodes[i] == target:
            print(f"Target found at node {i}!")
            break  # Exits loop; skips 'else' clause completely!
        i += 1
    else:
        # Executes ONLY if the loop finished normally without hitting 'break'
        print(f"Target '{target}' not located across any cluster node.")
        return False
    return True

# 2. range() Memory Efficiency
# In Python 3, range() does NOT generate a massive list in memory.
# It is an immutable sequence type that computes values lazily in O(1) space!
for count in range(1, 10, 2):  # start=1, stop=10 (exclusive), step=2
    print(f"Step value: {count}")  # Output: 1, 3, 5, 7, 9`}
        />

        <PythonCalloutBox type="common-mistake" title="Accidental Infinite Loops in while Statements">
          In a <code className="text-rose-400">while</code> loop, you are responsible for updating the state variable inside the loop body (e.g. <code className="text-amber-300">i += 1</code>). Forgetting this line leads to a 100% CPU lock infinite loop! Whenever possible, prefer Python's idiomatic <code className="text-emerald-300">for item in iterable:</code> or <code className="text-emerald-300">for i, item in enumerate(iterable):</code>.
        </PythonCalloutBox>
      </div>
    </div>
  );
};

/* =========================================================================
   CHAPTER 6: Functions & Scope
   ========================================================================= */
export const Chapter6Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-200">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
          <span>Chapter 06</span>
          <span>·</span>
          <span>Functions & Modular Code</span>
          <span>·</span>
          <span>25 min read</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Functions: Parameters, Return Protocols, *args/**kwargs & LEGB Scope
        </h1>
        <p className="text-base text-slate-400 mt-2 leading-relaxed">
          Functions are reusable blocks of code that accept arguments, perform isolated computations, and return results. In Python, functions are first-class citizens: they can be passed as arguments, assigned to variables, returned from other functions, and stored in data structures.
        </p>
      </div>

      <div className="border-t border-slate-800/80 pt-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">1. Variable Scope: The LEGB Hierarchy</h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          Whenever an identifier is referenced inside a function, Python searches for it in four strictly prioritized scopes: <strong>Local (L)</strong>, <strong>Enclosing (E)</strong>, <strong>Global (G)</strong>, and <strong>Built-in (B)</strong>.
        </p>

        {/* Visual SVG Diagram */}
        <ScopeLEGBDiagram />

        <h2 className="text-2xl font-bold text-white pt-4">2. Advanced Parameters & *args / **kwargs</h2>
        <CodeBlock
          filename="advanced_functions.py"
          language="python"
          code={`# Combining positional, keyword-only, *args, and **kwargs
def enterprise_logger(
    service_name: str,           # Standard positional argument
    *tags: str,                  # Arbitrary positional args -> packed into tuple
    environment: str = "prod",   # Keyword default argument
    **metadata: any              # Arbitrary keyword args -> packed into dict
) -> None:
    \"\"\"Production logging function demonstrating modern Python signature conventions.\"\"\"
    print(f"[{environment.upper()}] Service: {service_name}")
    print(f"Tags attached: {tags} (Type: {type(tags).__name__})")
    print(f"Metadata payload: {metadata} (Type: {type(metadata).__name__})")

# Invocation:
enterprise_logger(
    "auth-service",
    "security", "audit", "pci-dss",
    environment="staging",
    region="us-east-1",
    latency_ms=14.2,
    authenticated=True
)`}
        />

        <PythonCalloutBox type="common-mistake" title="The Famous Mutable Default Argument Bug">
          <strong>Never write:</strong> <code className="text-rose-400">def append_item(item, target_list=[]):</code>. In Python, default parameter expressions are evaluated <strong>once</strong> when the function is defined, <em>not</em> every time it is called. That means the exact same list is shared across all function calls!
          <pre className="mt-2 font-mono text-emerald-300 bg-slate-950 p-2 rounded">
{`# THE CORRECT PATTERN:
def append_item(item, target_list=None):
    if target_list is None:
        target_list = []
    target_list.append(item)
    return target_list`}
          </pre>
        </PythonCalloutBox>
      </div>
    </div>
  );
};

/* =========================================================================
   CHAPTER 7: Strings & Slicing
   ========================================================================= */
export const Chapter7Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-200">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
          <span>Chapter 07</span>
          <span>·</span>
          <span>Data Structures</span>
          <span>·</span>
          <span>22 min read</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Strings: Immutability, Indexing, Slicing & The Ultimate Method Arsenal
        </h1>
        <p className="text-base text-slate-400 mt-2 leading-relaxed">
          Strings in Python are immutable sequences of Unicode characters. Once allocated in memory, a string object cannot be modified in place. Understanding extended slicing and the built-in method library is essential for data cleaning and backend API processing.
        </p>
      </div>

      <div className="border-t border-slate-800/80 pt-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">1. Extended Slicing Syntax [start:stop:step]</h2>
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2 text-sm">
          <p className="text-xs text-slate-400 font-mono">
            String: <span className="text-amber-300">P y t h o n</span><br />
            Positive Indices: <span className="text-cyan-300"> 0  1  2  3  4  5</span><br />
            Negative Indices: <span className="text-rose-300">-6 -5 -4 -3 -2 -1</span>
          </p>
        </div>

        <CodeBlock
          filename="string_operations.py"
          language="python"
          code={`text = "PythonDataScience"

# Slicing Examples:
print(text[0:6])     # "Python" (Indices 0 through 5)
print(text[6:])      # "DataScience" (From index 6 to end)
print(text[:6])      # "Python" (From beginning to index 5)
print(text[-7:])     # "Science" (Last 7 characters)
print(text[::2])     # "PtoDtSine" (Every 2nd character)
print(text[::-1])    # "ecneicSataDnohtyP" (Reverse string idiom!)`}
        />

        <h2 className="text-2xl font-bold text-white pt-4">2. Complete String Methods Catalog</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden">
            <thead className="bg-slate-900 text-slate-300 font-mono uppercase text-[11px]">
              <tr>
                <th className="p-3 border-b border-slate-800">Category</th>
                <th className="p-3 border-b border-slate-800">Method</th>
                <th className="p-3 border-b border-slate-800">Example Input</th>
                <th className="p-3 border-b border-slate-800">Output Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-amber-400 font-sans font-semibold" rowSpan={2}>Trimming & Cleaning</td>
                <td className="p-3 text-cyan-300">.strip()</td>
                <td className="p-3">"  clean data\\n  ".strip()</td>
                <td className="p-3 text-emerald-400">"clean data"</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-cyan-300">.replace()</td>
                <td className="p-3">"user_id".replace("_", "-")</td>
                <td className="p-3 text-emerald-400">"user-id"</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-cyan-400 font-sans font-semibold" rowSpan={2}>Splitting & Joining</td>
                <td className="p-3 text-cyan-300">.split()</td>
                <td className="p-3">"apple,banana,mango".split(",")</td>
                <td className="p-3 text-emerald-400">['apple', 'banana', 'mango']</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-cyan-300">.join()</td>
                <td className="p-3">" / ".join(["api", "v1", "users"])</td>
                <td className="p-3 text-emerald-400">"api / v1 / users"</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-emerald-400 font-sans font-semibold" rowSpan={2}>Case Modification</td>
                <td className="p-3 text-cyan-300">.title()</td>
                <td className="p-3">"senior data analyst".title()</td>
                <td className="p-3 text-emerald-400">"Senior Data Analyst"</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-cyan-300">.lower()</td>
                <td className="p-3">"User@Domain.COM".lower()</td>
                <td className="p-3 text-emerald-400">"user@domain.com"</td>
              </tr>
            </tbody>
          </table>
        </div>

        <PythonCalloutBox type="pro-tip" title="High Performance String Concatenation">
          Never use <code className="text-rose-400">+</code> in a loop to concatenate strings (e.g. <code className="text-rose-400">result += word</code>)! Because strings are immutable, each <code className="text-rose-400">+</code> creates an entirely new string in heap memory, yielding quadratic <code className="text-rose-400">O(n²)</code> performance. Instead, collect substrings into a list and use <code className="text-emerald-400">"".join(buffer)</code> which runs in linear <code className="text-emerald-400">O(n)</code> time.
        </PythonCalloutBox>
      </div>
    </div>
  );
};

/* =========================================================================
   CHAPTER 8: Collections Matrix
   ========================================================================= */
export const Chapter8Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-200">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
          <span>Chapter 08</span>
          <span>·</span>
          <span>Data Structures</span>
          <span>·</span>
          <span>30 min read</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Collections: List vs. Tuple vs. Set vs. Dictionary Architecture Matrix
        </h1>
        <p className="text-base text-slate-400 mt-2 leading-relaxed">
          Python's four primary built-in data collections—Lists, Tuples, Sets, and Dictionaries—are the bread and butter of daily programming. Each is backed by distinct underlying C data structures, carrying unique performance trade-offs and semantics.
        </p>
      </div>

      <div className="border-t border-slate-800/80 pt-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">1. Master Comparison Matrix</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden">
            <thead className="bg-slate-900 text-slate-300 font-mono uppercase text-[11px]">
              <tr>
                <th className="p-3 border-b border-slate-800">Collection</th>
                <th className="p-3 border-b border-slate-800">Syntax</th>
                <th className="p-3 border-b border-slate-800">Ordered?</th>
                <th className="p-3 border-b border-slate-800">Mutable?</th>
                <th className="p-3 border-b border-slate-800">Duplicates?</th>
                <th className="p-3 border-b border-slate-800">Underlying C Structure</th>
                <th className="p-3 border-b border-slate-800">Lookup Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 font-semibold text-amber-400">List</td>
                <td className="p-3 font-mono text-slate-300">[1, 2, 3]</td>
                <td className="p-3 text-emerald-400">Yes</td>
                <td className="p-3 text-cyan-400">Yes</td>
                <td className="p-3 text-emerald-400">Yes</td>
                <td className="p-3 font-mono text-slate-400">Dynamic array of pointers</td>
                <td className="p-3 font-mono text-amber-300">O(1) by index, O(n) by value</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 font-semibold text-cyan-400">Tuple</td>
                <td className="p-3 font-mono text-slate-300">(1, 2, 3)</td>
                <td className="p-3 text-emerald-400">Yes</td>
                <td className="p-3 text-rose-400">No (Immutable)</td>
                <td className="p-3 text-emerald-400">Yes</td>
                <td className="p-3 font-mono text-slate-400">Fixed-size array (low memory)</td>
                <td className="p-3 font-mono text-amber-300">O(1) by index, O(n) by value</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 font-semibold text-emerald-400">Set</td>
                <td className="p-3 font-mono text-slate-300">{`{1, 2, 3}`}</td>
                <td className="p-3 text-slate-400">No (Unordered)</td>
                <td className="p-3 text-cyan-400">Yes</td>
                <td className="p-3 text-rose-400">No (Unique)</td>
                <td className="p-3 font-mono text-slate-400">Hash table (keys only)</td>
                <td className="p-3 font-mono text-emerald-300">O(1) average lookup</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 font-semibold text-purple-400">Dictionary</td>
                <td className="p-3 font-mono text-slate-300">{`{"a": 1}`}</td>
                <td className="p-3 text-emerald-400">Yes (Python 3.7+)</td>
                <td className="p-3 text-cyan-400">Yes</td>
                <td className="p-3 text-slate-400">Unique Keys</td>
                <td className="p-3 font-mono text-slate-400">Combined hash table</td>
                <td className="p-3 font-mono text-emerald-300">O(1) key lookup / insert</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold text-white pt-4">2. Real-World Production Operations</h2>
        <CodeBlock
          filename="collections_mastery.py"
          language="python"
          code={`# 1. Sets for Ultra-Fast Deduplication & Venn Math
web_visitors = {"alice", "bob", "charlie", "david"}
mobile_visitors = {"charlie", "david", "emma", "frank"}

both_channels = web_visitors & mobile_visitors       # Intersection: {'charlie', 'david'}
all_unique = web_visitors | mobile_visitors          # Union: 6 unique users
web_only = web_visitors - mobile_visitors            # Difference: {'alice', 'bob'}

# 2. Modern Dictionary Merging (Python 3.9+ Union Operator |)
default_config = {"env": "prod", "workers": 4, "timeout": 30}
custom_overrides = {"workers": 8, "debug": False}
merged_config = default_config | custom_overrides
print(merged_config)  # {'env': 'prod', 'workers': 8, 'timeout': 30, 'debug': False}

# 3. Safe Dictionary Access with .get() and .setdefault()
user_profile = {"id": 101, "name": "Sarah"}
role = user_profile.get("role", "Standard Member")  # Returns default instead of KeyError`}
        />

        <PythonCalloutBox type="interview-tip" title="Interview Question: Why Use a Tuple Over a List?">
          There are three distinct architectural reasons:
          <ol className="list-decimal pl-5 mt-2 space-y-1 text-xs">
            <li><strong>Immutability & Intent:</strong> Conveys to other developers and systems that this data is a fixed record (e.g. coordinates, database row, HTTP status tuple).</li>
            <li><strong>Dictionary Keys:</strong> Tuples containing immutable elements are hashable, meaning they can serve as dictionary keys or set elements, whereas lists cannot!</li>
            <li><strong>Memory Efficiency & Speed:</strong> Tuples avoid the memory over-allocation that lists maintain for dynamic appending, saving heap memory and running slightly faster.</li>
          </ol>
        </PythonCalloutBox>
      </div>
    </div>
  );
};
