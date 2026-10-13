import React from 'react';
import { PythonCalloutBox } from '../PythonCalloutBox.tsx';
import { CodeBlock } from '../../common/CodeBlock.tsx';

/* =========================================================================
   CHAPTER 13: Object-Oriented Programming (OOP)
   ========================================================================= */
export const Chapter13Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-200">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
          <span>Chapter 13</span>
          <span>·</span>
          <span>Object-Oriented Design</span>
          <span>·</span>
          <span>30 min read</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Object-Oriented Programming (OOP): The 4 Pillars in Python
        </h1>
        <p className="text-base text-slate-400 mt-2 leading-relaxed">
          Python is an object-oriented language by design. Everything from numbers to functions is an instance of a class. We explore the 4 foundational pillars—Encapsulation, Inheritance, Polymorphism, and Abstraction—with production architectural patterns.
        </p>
      </div>

      <div className="border-t border-slate-800/80 pt-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">1. The 4 OOP Pillars in Python Architecture</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <h3 className="font-bold text-amber-400 mb-1 uppercase font-mono">1. Encapsulation</h3>
            <p className="text-slate-300 leading-relaxed">
              Bundling state (data) and behavior (methods) into a class while restricting direct external access to internal state via private attributes (<code className="text-amber-300">_protected</code> and <code className="text-amber-300">__private</code> name mangling) and <code className="text-amber-300">@property</code> getters/setters.
            </p>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <h3 className="font-bold text-cyan-400 mb-1 uppercase font-mono">2. Inheritance</h3>
            <p className="text-slate-300 leading-relaxed">
              Enabling child classes to derive attributes and behavior from parent classes using <code className="text-cyan-300">class Child(Parent):</code> and delegating initialization upward via <code className="text-cyan-300">super().__init__()</code>, preserving DRY principles.
            </p>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <h3 className="font-bold text-emerald-400 mb-1 uppercase font-mono">3. Polymorphism</h3>
            <p className="text-slate-300 leading-relaxed">
              "Duck Typing": <em>"If it walks like a duck and quacks like a duck, it's a duck."</em> Code interacts with objects based on the interfaces they expose, rather than their explicit concrete class inheritance hierarchy.
            </p>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <h3 className="font-bold text-purple-400 mb-1 uppercase font-mono">4. Abstraction</h3>
            <p className="text-slate-300 leading-relaxed">
              Hiding complex implementation details and enforcing standard contracts across subsystems using Python's standard <code className="text-purple-300">abc</code> module (<code className="text-purple-300">ABC</code> base class and <code className="text-purple-300">@abstractmethod</code> decorators).
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white pt-4">2. Comprehensive Production Example</h2>
        <CodeBlock
          filename="payment_processor_oop.py"
          language="python"
          code={`from abc import ABC, abstractmethod

# 1. Abstraction: Contract Interface
class PaymentGateway(ABC):
    @abstractmethod
    def process_charge(self, amount: float, currency: str) -> dict:
        \"\"\"Must be implemented by concrete payment adapters.\"\"\"
        pass

# 2. Inheritance & Polymorphism: Concrete Adapters
class StripeGateway(PaymentGateway):
    def __init__(self, api_key: str):
        self._api_key = api_key  # Encapsulated protected attribute

    def process_charge(self, amount: float, currency: str) -> dict:
        # Calls external Stripe REST endpoints
        return {"provider": "Stripe", "status": "authorized", "amount": amount}

class PayPalGateway(PaymentGateway):
    def __init__(self, client_id: str, secret: str):
        self.__secret = secret  # Private name-mangled attribute

    def process_charge(self, amount: float, currency: str) -> dict:
        return {"provider": "PayPal", "status": "settled", "amount": amount}

# 3. Polymorphic Consumption:
def checkout(gateway: PaymentGateway, cart_total: float):
    # Interacts purely with interface regardless of whether Stripe or PayPal is injected!
    result = gateway.process_charge(cart_total, "USD")
    print(f"Charge completed via {result['provider']}: Status = {result['status']}")

checkout(StripeGateway("sk_test_90"), 99.99)
checkout(PayPalGateway("client_1", "sec_2"), 149.50)`}
        />

        <PythonCalloutBox type="interview-tip" title="Interview Tip: What is Python's MRO (Method Resolution Order)?">
          Because Python supports multiple inheritance (<code className="text-amber-300">class C(A, B):</code>), it uses the <strong>C3 Linearization Algorithm</strong> to determine the deterministic order in which parent classes and methods are searched. You can inspect any class's resolution order by printing <code className="text-cyan-300">ClassName.__mro__</code> or calling <code className="text-cyan-300">ClassName.mro()</code>.
        </PythonCalloutBox>
      </div>
    </div>
  );
};

/* =========================================================================
   CHAPTER 14: Advanced Python Engine
   ========================================================================= */
export const Chapter14Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-200">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
          <span>Chapter 14</span>
          <span>·</span>
          <span>Advanced Python Engine</span>
          <span>·</span>
          <span>28 min read</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Advanced Python: Iterators, Generators, Decorators & Context Managers
        </h1>
        <p className="text-base text-slate-400 mt-2 leading-relaxed">
          Master the low-level constructs that distinguish senior Python engineers: lazy streams with the generator <code className="text-amber-400">yield</code> protocol, metaprogramming through function decorators, and custom context managers.
        </p>
      </div>

      <div className="border-t border-slate-800/80 pt-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">1. Generators & Memory-Efficient Streaming with yield</h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          A regular function computes its entire dataset in memory and returns it at once. A <strong>generator function</strong> uses <code className="text-emerald-400">yield</code> to pause its execution state and stream elements lazily one by one, keeping memory utilization constant (<code className="text-emerald-400">O(1) RAM</code>) even for 100-gigabyte files!
        </p>

        <CodeBlock
          filename="generators_memory.py"
          language="python"
          code={`import sys

# Standard List Comprehension (Allocates entire list in RAM immediately)
huge_list = [x ** 2 for x in range(1_000_000)]
print(f"List RAM Usage: {sys.getsizeof(huge_list):,} bytes (~8.4 MB)")

# Generator Expression (Computes items on-the-fly)
huge_gen = (x ** 2 for x in range(1_000_000))
print(f"Generator RAM Usage: {sys.getsizeof(huge_gen)} bytes (112 bytes total!)")

# Generator Function for Streaming Large Database / Log Dumps
def stream_large_log(file_path: str):
    with open(file_path, "r", encoding="utf-8") as f:
        for line in f:
            if "CRITICAL" in line:
                yield line.strip()  # Pauses execution and returns line`}
        />

        <h2 className="text-2xl font-bold text-white pt-4">2. Higher-Order Decorators & functools.wraps</h2>
        <CodeBlock
          filename="decorators_production.py"
          language="python"
          code={`import time
from functools import wraps

# Production Performance Benchmark Decorator
def execution_timer(func):
    @wraps(func)  # Preserves the original function's name and docstring (__doc__)
    def wrapper(*args, **kwargs):
        start_time = time.perf_counter()
        result = func(*args, **kwargs)
        duration_ms = (time.perf_counter() - start_time) * 1000
        print(f"[METRIC] {func.__name__} executed in {duration_ms:.2f} ms")
        return result
    return wrapper

@execution_timer
def query_warehouse_aggregates(days: int = 30):
    \"\"\"Simulates expensive analytical warehouse query.\"\"\"
    time.sleep(0.08)  # Simulated latency
    return {"total_revenue": 450000.00}

query_warehouse_aggregates(days=60)`}
        />

        <PythonCalloutBox type="pro-tip" title="Why functools.wraps is Mandatory">
          Without <code className="text-emerald-300">@wraps(func)</code>, your wrapper function overwrites the wrapped function's metadata! This means <code className="text-cyan-300">my_func.__name__</code> becomes <code className="text-rose-400">"wrapper"</code> and its docstrings are erased, breaking automatic Swagger/OpenAPI documentation generation in FastAPI and testing frameworks like pytest.
        </PythonCalloutBox>
      </div>
    </div>
  );
};

/* =========================================================================
   CHAPTER 15: Essential Python Standard Libraries & Ecosystem
   ========================================================================= */
export const Chapter15Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-200">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
          <span>Chapter 15</span>
          <span>·</span>
          <span>Ecosystem & Production</span>
          <span>·</span>
          <span>25 min read</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Essential Python Standard Libraries & Ecosystem (os, sys, requests, numpy, pandas)
        </h1>
        <p className="text-base text-slate-400 mt-2 leading-relaxed">
          Python's real superpower is its sprawling ecosystem of built-in and industry-standard third-party libraries. Here we survey the core five libraries every software engineer and data analyst must master.
        </p>
      </div>

      <div className="border-t border-slate-800/80 pt-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">1. Core Ecosystem Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <h3 className="font-bold text-amber-400 mb-1 font-mono uppercase">1. os & pathlib (Built-in)</h3>
            <p className="text-slate-300">
              Cross-platform operating system abstractions. Use <code className="text-amber-300">pathlib.Path</code> for object-oriented filesystem path manipulation, directory traversal, and environment variable lookups (<code className="text-amber-300">os.getenv</code>).
            </p>
          </div>
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <h3 className="font-bold text-cyan-400 mb-1 font-mono uppercase">2. sys (Built-in)</h3>
            <p className="text-slate-300">
              Runtime environment hooks. Access CLI parameters via <code className="text-cyan-300">sys.argv</code>, inspect module resolution paths with <code className="text-cyan-300">sys.path</code>, and exit scripts cleanly with <code className="text-cyan-300">sys.exit(0)</code>.
            </p>
          </div>
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <h3 className="font-bold text-emerald-400 mb-1 font-mono uppercase">3. requests (HTTP Engine)</h3>
            <p className="text-slate-300">
              Human-friendly HTTP networking library for consuming REST APIs. Supports connection pooling, automatic JSON deserialization, query parameters, headers, and OAuth tokens.
            </p>
          </div>
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <h3 className="font-bold text-purple-400 mb-1 font-mono uppercase">4. numpy & pandas (Data Science)</h3>
            <p className="text-slate-300">
              C-backed N-dimensional arrays (<code className="text-purple-300">ndarray</code>) offering vectorized math operations, and Pandas DataFrames for tabular data analysis, joins, and group-by aggregations.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white pt-4">2. requests & pandas Integration Code</h2>
        <CodeBlock
          filename="data_fetch_and_analyze.py"
          language="python"
          code={`import requests
import pandas as pd

# Fetch external mock user dataset
response = requests.get(
    "https://jsonplaceholder.typicode.com/users",
    headers={"Accept": "application/json"},
    timeout=5.0
)
response.raise_for_status()
users_data = response.json()

# Transform into tabular Pandas DataFrame
df = pd.DataFrame(users_data)
# Select specific columns and inspect
clean_df = df[["id", "name", "email", "website"]]
print(clean_df.head(3))`}
        />

        <PythonCalloutBox type="pro-tip" title="Always Set a timeout on requests">
          Never make an HTTP call with <code className="text-rose-400">requests.get(url)</code> without specifying a <code className="text-emerald-300">timeout=...</code>! By default, Python's requests library will wait indefinitely if the remote server drops the connection, causing your server worker process to hang forever.
        </PythonCalloutBox>
      </div>
    </div>
  );
};

/* =========================================================================
   CHAPTER 16: Real-World Automation
   ========================================================================= */
export const Chapter16Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-200">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
          <span>Chapter 16</span>
          <span>·</span>
          <span>Ecosystem & Production</span>
          <span>·</span>
          <span>26 min read</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Real-World Automation Scripts: File Organizer, API Caller & Log Analyzer
        </h1>
        <p className="text-base text-slate-400 mt-2 leading-relaxed">
          The true test of a developer is the ability to write robust, automated scripts that solve repetitive business tasks. Here are three complete, production-grade automation utilities.
        </p>
      </div>

      <div className="border-t border-slate-800/80 pt-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">Script 1: Automated Downloads Folder Organizer</h2>
        <CodeBlock
          filename="file_organizer.py"
          language="python"
          code={`import shutil
from pathlib import Path

def organize_directory(target_dir: str):
    \"\"\"Categorizes messy files into organized subfolders by extension.\"\"\"
    base_path = Path(target_dir)
    CATEGORIES = {
        "Documents": [".pdf", ".docx", ".xlsx", ".pptx", ".txt", ".csv"],
        "Images": [".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp"],
        "Archives": [".zip", ".tar", ".gz", ".rar", ".7z"],
        "Code": [".py", ".sql", ".json", ".js", ".html", ".css"],
    }

    for item in base_path.iterdir():
        if item.is_file():
            ext = item.suffix.lower()
            dest_folder = "Others"
            for category, extensions in CATEGORIES.items():
                if ext in extensions:
                    dest_folder = category
                    break
            
            dest_path = base_path / dest_folder
            dest_path.mkdir(exist_ok=True)
            shutil.move(str(item), str(dest_path / item.name))
            print(f"Moved: {item.name} -> {dest_folder}/")

# Example invocation:
# organize_directory("~/Downloads")`}
        />

        <h2 className="text-2xl font-bold text-white pt-4">Script 2: Server Access Log Analyzer & IP Frequency Report</h2>
        <CodeBlock
          filename="log_analyzer.py"
          language="python"
          code={`import re
from collections import Counter

# Common Log Format regex pattern
LOG_REGEX = re.compile(r'^(\S+) \S+ \S+ \[(.*?)\] "(\S+) (\S+) \S+" (\d{3}) (\d+)')

def analyze_web_log(log_path: str):
    \"\"\"Parses Nginx/Apache logs and extracts top client IPs & 4xx/5xx error frequencies.\"\"\"
    ip_counter = Counter()
    error_counter = Counter()

    with open(log_path, "r", encoding="utf-8") as f:
        for line in f:
            match = LOG_REGEX.match(line)
            if match:
                ip, timestamp, method, path, status, bytes_sent = match.groups()
                ip_counter[ip] += 1
                if int(status) >= 400:
                    error_counter[status] += 1

    print("--- TOP 5 REQUESTING CLIENT IPS ---")
    for ip, count in ip_counter.most_common(5):
        print(f"IP: {ip:15} | Requests: {count}")

    print("\\n--- HTTP ERROR STATUS DISTRIBUTION ---")
    for status, count in error_counter.items():
        print(f"HTTP {status}: {count} occurrences")`}
        />

        <PythonCalloutBox type="pro-tip" title="Use pathlib Over os.path in Modern Python">
          <code className="text-emerald-300">pathlib</code> (introduced in Python 3.4) replaces clumsy string operations like <code className="text-slate-400">os.path.join(a, b)</code> with intuitive division operators: <code className="text-emerald-300">Path("root") / "subfolder" / "file.csv"</code>. It is cross-platform, safer, and completely object-oriented!
        </PythonCalloutBox>
      </div>
    </div>
  );
};

/* =========================================================================
   CHAPTER 17: Best Practices, PEP 8 & Project Structure
   ========================================================================= */
export const Chapter17Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-200">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
          <span>Chapter 17</span>
          <span>·</span>
          <span>Ecosystem & Production</span>
          <span>·</span>
          <span>22 min read</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Best Practices, PEP 8 Standards, Typing & Project Architecture
        </h1>
        <p className="text-base text-slate-400 mt-2 leading-relaxed">
          Writing Python that works is only the baseline; writing Python that a team can maintain, scale, test, and debug years later requires strict adherence to community standards (PEP 8), static typing, and modular directory structures.
        </p>
      </div>

      <div className="border-t border-slate-800/80 pt-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">1. PEP 8 Core Style Commandments</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
            <span className="font-bold text-amber-400 block mb-1">Indentation & Line Length</span>
            Strictly 4 spaces per indentation level (never tabs). Limit lines to 79–88 characters for readability.
          </div>
          <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
            <span className="font-bold text-cyan-400 block mb-1">Naming Conventions</span>
            <code className="text-cyan-300">snake_case</code> for functions & variables.<br />
            <code className="text-cyan-300">PascalCase</code> for classes.<br />
            <code className="text-cyan-300">UPPER_CASE</code> for constants.
          </div>
          <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
            <span className="font-bold text-emerald-400 block mb-1">Imports Hierarchy</span>
            1. Standard library imports<br />
            2. Related third party imports<br />
            3. Local application/library imports
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white pt-4">2. Production Repository Directory Layout</h2>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
          <pre>{`my_enterprise_service/
├── .venv/                   # Local isolated virtual environment
├── pyproject.toml           # Modern build metadata & tool config (Ruff, Black)
├── requirements.txt         # Pinned production dependencies
├── README.md                # System architectural blueprint
├── src/
│   └── my_service/
│       ├── __init__.py      # Package indicator
│       ├── main.py          # Entry point
│       ├── api/             # REST routing & controllers
│       ├── core/            # Business logic & domain models
│       ├── db/              # SQLAlchemy / PostgreSQL connection pools
│       └── utils/           # Helper scripts & formatters
└── tests/
    ├── conftest.py          # Pytest fixtures & mock clients
    └── test_api.py          # Unit & integration tests`}</pre>
        </div>

        <PythonCalloutBox type="pro-tip" title="Adopt Modern Linters: Ruff">
          Legacy Python tools relied on Flake8, Black, and isort running separately. In modern Python engineering, <strong>Ruff</strong> (written in Rust) replaces all three and executes 100x faster, formatting and linting hundreds of thousands of lines of Python in milliseconds!
        </PythonCalloutBox>
      </div>
    </div>
  );
};

/* =========================================================================
   CHAPTER 18: Ultimate Cheat Sheet & Interview Guide
   ========================================================================= */
export const Chapter18Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-200">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
          <span>Chapter 18</span>
          <span>·</span>
          <span>Interview & Mastery</span>
          <span>·</span>
          <span>30 min read</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Ultimate Python Cheat Sheet & High-Stakes Technical Interview Guide
        </h1>
        <p className="text-base text-slate-400 mt-2 leading-relaxed">
          The ultimate reference manual: a rapid syntax cheat sheet and 6 high-stakes technical interview questions with deep architectural answers to guarantee you ace senior live coding tests.
        </p>
      </div>

      <div className="border-t border-slate-800/80 pt-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">1. High-Frequency Technical Interview Questions & Trap Solutions</h2>

        {/* Q1 */}
        <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-amber-400 font-bold uppercase">Question 01 · Internals</span>
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono">Senior Engineer Tier</span>
          </div>
          <h3 className="text-base font-bold text-white">What is the Python Global Interpreter Lock (GIL) and how does it affect concurrency?</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>Model Answer:</strong> The GIL is a mutual exclusion lock used by CPython to prevent multiple native operating system threads from executing Python bytecodes simultaneously. It exists because CPython's memory management is not thread-safe (it relies on reference counting). Therefore, multi-threading in Python does NOT achieve true CPU parallelism on multi-core processors for CPU-bound tasks. To achieve true multi-core speedups, Python uses <strong>multiprocessing</strong> (which spawns independent OS processes, each with their own interpreter and GIL) or offloads to C-extensions like NumPy.
          </p>
        </div>

        {/* Q2 */}
        <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-cyan-400 font-bold uppercase">Question 02 · Memory</span>
            <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-mono">Senior Engineer Tier</span>
          </div>
          <h3 className="text-base font-bold text-white">How does Python's Garbage Collection work under the hood?</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>Model Answer:</strong> Python uses two primary mechanisms:
            1. <strong>Reference Counting (Immediate):</strong> Every Python object has an internal <code className="text-cyan-300">ob_refcnt</code> field. Whenever an object is referenced, its count increases; when a reference goes out of scope, it decrements. When it reaches 0, memory is immediately reclaimed.
            2. <strong>Generational Cyclical GC (Periodic):</strong> Reference counting cannot handle circular references (e.g. Object A points to Object B, and Object B points to Object A). Python's cyclical garbage collector tracks objects across 3 generational tiers (Generation 0, 1, 2) and runs periodic cycle detection algorithms.
          </p>
        </div>

        {/* Q3 */}
        <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-emerald-400 font-bold uppercase">Question 03 · Metaprogramming</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-mono">Senior Engineer Tier</span>
          </div>
          <h3 className="text-base font-bold text-white">Explain the difference between deepcopy and shallow copy with memory implications.</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>Model Answer:</strong> A <strong>shallow copy</strong> (<code className="text-emerald-300">copy.copy()</code>) constructs a new collection object, but inserts references into it to the objects found in the original. If the elements are mutable (like nested lists), mutating a nested element in the copy also mutates the original! A <strong>deep copy</strong> (<code className="text-emerald-300">copy.deepcopy()</code>) recursively copies all nested objects, creating a 100% independent object graph in memory.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-white pt-4">2. Top 5 Whiteboard Coding Pitfalls to Avoid</h2>
        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/30 text-rose-300">
            <strong className="text-rose-400">1. Modifying a list while iterating over it:</strong> Writing <code className="text-white">for item in my_list: if cond: my_list.remove(item)</code> alters the internal list indices dynamically, skipping subsequent elements! Always iterate over a copy: <code className="text-emerald-300">for item in my_list[:]:</code> or use a list comprehension.
          </div>
          <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/30 text-rose-300">
            <strong className="text-rose-400">2. Checking list membership in a loop:</strong> Calling <code className="text-white">if x in large_list:</code> inside a loop of length N takes <code className="text-white">O(N²)</code> time. Convert the list to a <code className="text-emerald-300">set(large_list)</code> first to perform <code className="text-emerald-300">O(1)</code> average lookups!
          </div>
          <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/30 text-rose-300">
            <strong className="text-rose-400">3. Using floating point numbers for financial calculations:</strong> Writing <code className="text-white">0.1 + 0.2 == 0.3</code> evaluates to <code className="text-white">False</code> due to IEEE 754 precision limits. Always use Python's <code className="text-emerald-300">decimal.Decimal</code> for financial computations.
          </div>
        </div>

        <PythonCalloutBox type="pro-tip" title="Congratulations!">
          You have mastered the foundational and senior architecture of Python! You now understand the CPython bytecode pipeline, memory allocation, object data models, functional comprehensions, OOP contracts, and performance bottlenecks.
        </PythonCalloutBox>
      </div>
    </div>
  );
};
