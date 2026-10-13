import React from 'react';
import { PythonCalloutBox } from '../PythonCalloutBox.tsx';
import { CodeBlock } from '../../common/CodeBlock.tsx';
import { PythonExecutionFlowDiagram } from '../diagrams/PythonExecutionFlowDiagram.tsx';
import { DecisionFlowDiagram } from '../diagrams/DecisionFlowDiagram.tsx';

/* =========================================================================
   CHAPTER 1: Introduction to Python
   ========================================================================= */
export const Chapter1Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-200">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
          <span>Chapter 01</span>
          <span>·</span>
          <span>Core Fundamentals</span>
          <span>·</span>
          <span>15 min read</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Introduction to Python: Philosophy, Features & CPython Architecture
        </h1>
        <p className="text-base text-slate-400 mt-2 leading-relaxed">
          Python is a high-level, interpreted, dynamically typed programming language created by Guido van Rossum in 1991. Renowned for its clean, English-like syntax and strict adherence to readability, Python is the engine powering modern artificial intelligence, data engineering, distributed backend microservices, and scientific research.
        </p>
      </div>

      <div className="border-t border-slate-800/80 pt-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">1. Core Features of Python</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <h3 className="font-bold text-amber-400 mb-1">Simple & Expressive Syntax</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Eliminates boilerplates like semicolons and curly braces. Code blocks are structured strictly via semantic indentation (4 spaces per level), resulting in clean, self-documenting code.
            </p>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <h3 className="font-bold text-cyan-400 mb-1">Interpreted & Interactive</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Executes code line-by-line via the Python Virtual Machine (PVM). Provides an immediate REPL (Read-Eval-Print Loop) for fast interactive prototyping, debugging, and experimentation.
            </p>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <h3 className="font-bold text-emerald-400 mb-1">Dynamically & Strongly Typed</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Variable types are resolved dynamically at runtime rather than compile time. However, types are strictly enforced—Python will never implicitly coerce a string and an integer into an addition.
            </p>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <h3 className="font-bold text-purple-400 mb-1">"Batteries Included" Philosophy</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ships with an extensive standard library covering file I/O, mathematical computation, JSON/CSV serialization, cryptography, networking, multi-threading, and operating system bindings.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white pt-4">2. Real-World Applications</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden">
            <thead className="bg-slate-900 text-slate-300 font-mono uppercase text-[11px]">
              <tr>
                <th className="p-3 border-b border-slate-800">Domain</th>
                <th className="p-3 border-b border-slate-800">Industry Giants Using It</th>
                <th className="p-3 border-b border-slate-800">Dominant Frameworks / Libraries</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 font-semibold text-amber-400">Data Science & AI</td>
                <td className="p-3">OpenAI, Google DeepMind, Tesla</td>
                <td className="p-3 font-mono text-slate-400">PyTorch, TensorFlow, scikit-learn, Pandas</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 font-semibold text-cyan-400">Web Backend Development</td>
                <td className="p-3">Instagram, Spotify, Netflix, Reddit</td>
                <td className="p-3 font-mono text-slate-400">FastAPI, Django, Flask</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 font-semibold text-emerald-400">Data Engineering & Big Data</td>
                <td className="p-3">Airbnb, Uber, Snowflake</td>
                <td className="p-3 font-mono text-slate-400">PySpark, Apache Airflow, dbt, Polars</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 font-semibold text-purple-400">DevOps & Cloud Automation</td>
                <td className="p-3">AWS, Cloudflare, Microsoft</td>
                <td className="p-3 font-mono text-slate-400">Ansible, Fabric, Boto3, Docker SDK</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold text-white pt-4">3. Python Execution Flow: Source → Bytecode → PVM</h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          Many beginners mistakenly believe Python directly executes source code line-by-line without any compilation. In reality, CPython (the official reference implementation of Python) compiles human-readable <code className="text-amber-400">.py</code> files into an intermediate representation known as <strong>Bytecode</strong> (<code className="text-amber-400">.pyc</code> files stored in <code className="text-slate-300">__pycache__/</code>), which is then evaluated by the <strong>Python Virtual Machine (PVM)</strong> loop.
        </p>

        {/* Visual SVG Diagram */}
        <PythonExecutionFlowDiagram />

        <CodeBlock
          filename="execution_demo.py"
          language="python"
          code={`# Checking bytecode generated by CPython
import dis

def calculate_tax(subtotal: float, rate: float = 0.08) -> float:
    \"\"\"Calculates sales tax with high precision.\"\"\"
    tax_amount = subtotal * rate
    return round(tax_amount, 2)

# Inspect the low-level PVM opcodes
print("--- Bytecode Disassembly ---")
dis.dis(calculate_tax)`}
        />

        <PythonCalloutBox type="pro-tip" title="Why .pyc Bytecode Matters">
          When you import a module in Python, CPython automatically writes a pre-compiled bytecode file into a hidden <code className="text-emerald-300">__pycache__/</code> directory. In subsequent runs, Python checks the timestamp of the source file; if it hasn't changed, it directly loads the bytecode, saving expensive parsing time!
        </PythonCalloutBox>

        <PythonCalloutBox type="interview-tip" title="Interview Question: Is Python an Interpreted or Compiled Language?">
          <strong>The Perfect Senior Answer:</strong> Python is <em>both</em>. It first compiles high-level Python source code into low-level intermediate bytecode (<code className="text-amber-300">.pyc</code>), and then the Python Virtual Machine (PVM) interprets that bytecode instruction by instruction on the host machine. You can prove this using the standard library module <code className="text-amber-300">dis</code> (disassembler).
        </PythonCalloutBox>
      </div>
    </div>
  );
};

/* =========================================================================
   CHAPTER 2: Variables & Data Types
   ========================================================================= */
export const Chapter2Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-200">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
          <span>Chapter 02</span>
          <span>·</span>
          <span>Core Fundamentals</span>
          <span>·</span>
          <span>18 min read</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Variables, Dynamic Typing & Python's Object Memory Model
        </h1>
        <p className="text-base text-slate-400 mt-2 leading-relaxed">
          In Python, variables do not hold values directly like memory boxes in C or C++. Instead, variables are <strong>symbolic labels (references)</strong> bound to objects in heap memory. Everything in Python—numbers, strings, functions, and classes—is a first-class object.
        </p>
      </div>

      <div className="border-t border-slate-800/80 pt-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">1. Variable Naming Rules & PEP 8 Standards</h2>
        <ul className="list-disc pl-5 space-y-2 text-sm text-slate-300">
          <li><strong>Permitted Characters:</strong> Letters (a–z, A–Z), digits (0–9), and underscores (<code className="text-amber-400">_</code>).</li>
          <li><strong>First Character Rule:</strong> Must start with a letter or an underscore. Never with a number (e.g. <code className="text-rose-400">1st_variable</code> is invalid syntax).</li>
          <li><strong>Case Sensitivity:</strong> <code className="text-cyan-400">total_revenue</code>, <code className="text-cyan-400">Total_Revenue</code>, and <code className="text-cyan-400">TOTAL_REVENUE</code> are three completely distinct variables.</li>
          <li><strong>Reserved Keywords:</strong> You cannot use Python's 35 reserved keywords (e.g. <code className="text-rose-400">for, while, if, def, class, return, import, yield, pass</code>).</li>
        </ul>

        <h2 className="text-2xl font-bold text-white pt-4">2. Python Data Types Comparison Matrix</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden">
            <thead className="bg-slate-900 text-slate-300 font-mono uppercase text-[11px]">
              <tr>
                <th className="p-3 border-b border-slate-800">Category</th>
                <th className="p-3 border-b border-slate-800">Type</th>
                <th className="p-3 border-b border-slate-800">Example Literal</th>
                <th className="p-3 border-b border-slate-800">Mutability</th>
                <th className="p-3 border-b border-slate-800">Key Production Characteristic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 font-semibold text-amber-400" rowSpan={3}>Numeric</td>
                <td className="p-3 font-mono text-cyan-300">int</td>
                <td className="p-3 font-mono text-slate-300">42, -100, 1_000_000</td>
                <td className="p-3 text-emerald-400">Immutable</td>
                <td className="p-3">Arbitrary precision (no 64-bit integer overflow)</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 font-mono text-cyan-300">float</td>
                <td className="p-3 font-mono text-slate-300">3.14159, 1e-5</td>
                <td className="p-3 text-emerald-400">Immutable</td>
                <td className="p-3">IEEE 754 double precision (64-bit float)</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 font-mono text-cyan-300">complex</td>
                <td className="p-3 font-mono text-slate-300">3 + 4j</td>
                <td className="p-3 text-emerald-400">Immutable</td>
                <td className="p-3">Built-in electrical & scientific coordinate math</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 font-semibold text-cyan-400">Text</td>
                <td className="p-3 font-mono text-cyan-300">str</td>
                <td className="p-3 font-mono text-slate-300">"Data Engineering"</td>
                <td className="p-3 text-emerald-400">Immutable</td>
                <td className="p-3">Unicode code points, string interning for small tokens</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 font-semibold text-emerald-400">Boolean</td>
                <td className="p-3 font-mono text-cyan-300">bool</td>
                <td className="p-3 font-mono text-slate-300">True, False</td>
                <td className="p-3 text-emerald-400">Immutable</td>
                <td className="p-3">Subclass of int (<code className="text-amber-300">True == 1</code>, <code className="text-amber-300">False == 0</code>)</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 font-semibold text-purple-400">Null Value</td>
                <td className="p-3 font-mono text-cyan-300">NoneType</td>
                <td className="p-3 font-mono text-slate-300">None</td>
                <td className="p-3 text-emerald-400">Immutable</td>
                <td className="p-3">Singleton object representing absence of value</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold text-white pt-4">3. Type Conversion & Object Identity vs Equality</h2>
        <CodeBlock
          filename="variables_memory.py"
          language="python"
          code={`# Explicit Type Conversion (Casting)
raw_input = "1450"
units = int(raw_input)         # str -> int: 1450
price = float(units) * 1.18    # int -> float: 1711.0
as_string = str(price)         # float -> str: "1711.0"
is_valid = bool(units)         # Non-zero int -> bool: True

# Identity (is) vs Equality (==)
list_a = [1, 2, 3]
list_b = [1, 2, 3]
list_c = list_a

print(list_a == list_b)  # True: Values are identical
print(list_a is list_b)  # False: Distinct heap objects (different id() memory addresses)
print(list_a is list_c)  # True: Both reference the exact same memory pointer`}
        />

        <PythonCalloutBox type="common-mistake" title="The == vs is Trap">
          Never use <code className="text-rose-400">if status is "ACTIVE":</code>! While Python's string interning might make this occasionally evaluate to <code className="text-emerald-400">True</code> for short strings, it is an implementation detail of CPython and will fail unexpectedly on dynamically generated strings. Always use <code className="text-emerald-400">==</code> for value equality, and reserve <code className="text-cyan-400">is</code> exclusively for singletons like <code className="text-cyan-400">if obj is None:</code>.
        </PythonCalloutBox>
      </div>
    </div>
  );
};

/* =========================================================================
   CHAPTER 3: Input, Output & Operators
   ========================================================================= */
export const Chapter3Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-200">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
          <span>Chapter 03</span>
          <span>·</span>
          <span>Core Fundamentals</span>
          <span>·</span>
          <span>20 min read</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Input, Output Formatting & Complete Operators Matrix
        </h1>
        <p className="text-base text-slate-400 mt-2 leading-relaxed">
          Mastering console I/O, modern f-string interpolation, and the complete operator semantics in Python is critical for building robust command-line tools and production scripts.
        </p>
      </div>

      <div className="border-t border-slate-800/80 pt-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">1. Console Input & Output Mechanisms</h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          The <code className="text-amber-400">input()</code> function pauses execution and reads a line from standard input as a <strong>raw string (<code className="text-cyan-300">str</code>)</strong>. You must always cast it explicitly to perform numerical operations.
        </p>

        <CodeBlock
          filename="io_formatting.py"
          language="python"
          code={`# User Input with Prompt & Explicit Casting
user_age = int(input("Enter your age: "))
hourly_rate = float(input("Enter hourly rate in USD: "))

# Modern Python 3.6+ f-Strings Formatting Specifiers
company = "Codingthunder"
annual_salary = hourly_rate * 40 * 52

# Formatting: Currency formatting, padding, and date expressions
print(f"Employee at {company:^20}")                     # Centered in 20 spaces
print(f"Calculated Annual Comp: \${annual_salary:,.2f}")  # Thousands comma + 2 decimal digits
print(f"Tax Withholding (24%): \${annual_salary * 0.24:,.2f}")`}
        />

        <h2 className="text-2xl font-bold text-white pt-4">2. Complete Python Operators Matrix</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden">
            <thead className="bg-slate-900 text-slate-300 font-mono uppercase text-[11px]">
              <tr>
                <th className="p-3 border-b border-slate-800">Operator Type</th>
                <th className="p-3 border-b border-slate-800">Symbols</th>
                <th className="p-3 border-b border-slate-800">Example Code</th>
                <th className="p-3 border-b border-slate-800">Result & Explanation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-amber-400 font-sans font-semibold">Arithmetic</td>
                <td className="p-3">+ - * / // % **</td>
                <td className="p-3">7 / 2<br />7 // 2<br />7 % 2<br />2 ** 3</td>
                <td className="p-3 text-slate-300 font-sans">
                  3.5 (Float division)<br />3 (Floor integer division)<br />1 (Remainder / modulo)<br />8 (Power / exponentiation)
                </td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-cyan-400 font-sans font-semibold">Comparison</td>
                <td className="p-3">== != &gt; &lt; &gt;= &lt;=</td>
                <td className="p-3">10 &gt;= 5<br />18 &lt; age &lt;= 65</td>
                <td className="p-3 text-slate-300 font-sans">
                  True<br />Chained comparisons evaluated cleanly
                </td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-emerald-400 font-sans font-semibold">Logical</td>
                <td className="p-3">and or not</td>
                <td className="p-3">is_admin and has_token<br />not is_guest</td>
                <td className="p-3 text-slate-300 font-sans">
                  Short-circuit evaluation: stops evaluating early if outcome is fixed
                </td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-purple-400 font-sans font-semibold">Membership</td>
                <td className="p-3">in, not in</td>
                <td className="p-3">"sql" in "postgresql"<br />5 in [1, 2, 3]</td>
                <td className="p-3 text-slate-300 font-sans">
                  True (Sub-string check)<br />False (Membership in iterable sequence)
                </td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-rose-400 font-sans font-semibold">Identity</td>
                <td className="p-3">is, is not</td>
                <td className="p-3">result is None<br />x is not False</td>
                <td className="p-3 text-slate-300 font-sans">
                  Evaluates memory identity (<code className="text-amber-300">id(a) == id(b)</code>), not value equality
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <PythonCalloutBox type="pro-tip" title="Python's Chained Comparisons">
          In languages like C++ or Java, writing <code className="text-slate-300">0 &lt; x &lt; 10</code> evaluates <code className="text-slate-300">(0 &lt; x)</code> to a boolean <code className="text-slate-300">true</code> (1), which then evaluates <code className="text-slate-300">1 &lt; 10</code>—a notorious bug. In Python, <code className="text-emerald-300">0 &lt; x &lt; 10</code> is syntactic sugar for <code className="text-emerald-300">0 &lt; x and x &lt; 10</code>, evaluating naturally and safely!
        </PythonCalloutBox>
      </div>
    </div>
  );
};

/* =========================================================================
   CHAPTER 4: Decision Making
   ========================================================================= */
export const Chapter4Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-200">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
          <span>Chapter 04</span>
          <span>·</span>
          <span>Control Flow</span>
          <span>·</span>
          <span>22 min read</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Decision Making: if-elif-else & Structural Pattern Matching (match-case)
        </h1>
        <p className="text-base text-slate-400 mt-2 leading-relaxed">
          Control flow allows your programs to make runtime decisions based on business rules and data states. We will explore conditional branching, truthy vs falsy values, ternary expressions, and the modern Python 3.10+ pattern matching engine.
        </p>
      </div>

      <div className="border-t border-slate-800/80 pt-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">1. Real-World Multi-Factor Auth Decision Tree</h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          Below is a complete enterprise authentication decision flow diagram showing how branching logic cascades from username validation to hashed password evaluation and multi-factor challenge responses.
        </p>

        {/* Visual SVG Diagram */}
        <DecisionFlowDiagram />

        <h2 className="text-2xl font-bold text-white pt-4">2. Truthy vs. Falsy Values in Python</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-rose-950/20 p-4 rounded-xl border border-rose-500/30">
            <h3 className="font-bold text-rose-400 mb-2 font-mono uppercase">Falsy Values (Evaluate to False)</h3>
            <ul className="space-y-1 font-mono text-slate-300">
              <li>• Constants: <code className="text-rose-300">None, False</code></li>
              <li>• Zero numeric types: <code className="text-rose-300">0, 0.0, 0j, Decimal(0)</code></li>
              <li>• Empty sequences: <code className="text-rose-300">"", (), [], range(0)</code></li>
              <li>• Empty mappings: <code className="text-rose-300">{} (dict), set()</code></li>
              <li>• Objects implementing <code className="text-rose-300">__bool__() -&gt; False</code> or <code className="text-rose-300">__len__() -&gt; 0</code></li>
            </ul>
          </div>
          <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-500/30">
            <h3 className="font-bold text-emerald-400 mb-2 font-mono uppercase">Truthy Values (Evaluate to True)</h3>
            <ul className="space-y-1 font-mono text-slate-300">
              <li>• Any non-zero number: <code className="text-emerald-300">42, -1, 0.0001</code></li>
              <li>• Any non-empty string: <code className="text-emerald-300">"hello", "0", "False", " "</code></li>
              <li>• Any non-empty sequence: <code className="text-emerald-300">[0], (None,), [False]</code></li>
              <li>• Any non-empty dictionary: <code className="text-emerald-300">{`{"status": "ok"}`}</code></li>
              <li>• Most user-defined objects by default</li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white pt-4">3. Python 3.10+ match-case (Structural Pattern Matching)</h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          Unlike legacy switch-case statements in C or Java, Python's <code className="text-cyan-400">match-case</code> statement performs deep pattern matching against object structures, sequences, and types with guard clauses (<code className="text-amber-400">if</code>).
        </p>

        <CodeBlock
          filename="pattern_matching.py"
          language="python"
          code={`def handle_api_response(response: dict):
    \"\"\"Handles various API payload signatures cleanly using match-case.\"\"\"
    match response:
        case {"status": 200, "data": list(records)} if len(records) > 0:
            print(f"Success! Processed {len(records)} records.")
            return records
            
        case {"status": 200, "data": []}:
            print("Notice: Query succeeded but returned an empty dataset.")
            return []
            
        case {"status": 401 | 403, "error": error_msg}:
            print(f"Authentication Failure: {error_msg}. Triggering token refresh.")
            raise PermissionError(error_msg)
            
        case {"status": 500 | 502 | 503, "retry_after": int(seconds)}:
            print(f"Server upstream error. Waiting {seconds}s before retry.")
            return None
            
        case _:
            print(f"Unknown payload signature received: {response}")
            return None`}
        />

        <PythonCalloutBox type="interview-tip" title="Interview Tip: Idiomatic Pythonic Truth Checks">
          Avoid writing <code className="text-rose-400">if len(items) == 0:</code> or <code className="text-rose-400">if is_active == True:</code>. The idiomatic Python way (PEP 8) relies directly on truthiness:
          <pre className="mt-2 font-mono text-emerald-300 bg-slate-950 p-2 rounded">
{`if not items:
    print("List is empty")
if is_active:
    print("User is active")`}
          </pre>
        </PythonCalloutBox>
      </div>
    </div>
  );
};
