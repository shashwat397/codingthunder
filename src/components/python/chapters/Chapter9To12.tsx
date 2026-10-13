import React from 'react';
import { PythonCalloutBox } from '../PythonCalloutBox.tsx';
import { CodeBlock } from '../../common/CodeBlock.tsx';

/* =========================================================================
   CHAPTER 9: Comprehensions & Lambdas
   ========================================================================= */
export const Chapter9Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-200">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
          <span>Chapter 09</span>
          <span>·</span>
          <span>Functional Programming</span>
          <span>·</span>
          <span>20 min read</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Comprehensions & Functional Programming: map, filter & Lambdas
        </h1>
        <p className="text-base text-slate-400 mt-2 leading-relaxed">
          Comprehensions provide a concise, readable, and highly optimized syntax for creating new sequences based on existing iterables. Coupled with anonymous <code className="text-amber-400">lambda</code> expressions and functional utilities like <code className="text-cyan-400">map()</code> and <code className="text-cyan-400">filter()</code>, they represent the peak of Pythonic elegance.
        </p>
      </div>

      <div className="border-t border-slate-800/80 pt-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">1. List, Dictionary & Set Comprehensions</h2>
        <CodeBlock
          filename="comprehensions_showcase.py"
          language="python"
          code={`# 1. List Comprehension with Conditional Filtering
raw_salaries = [65000, 92000, 115000, 48000, 140000, 85000]
# Calculate 10% bonus only for six-figure salaries:
senior_bonuses = [int(sal * 0.10) for sal in raw_salaries if sal >= 100000]
print("Bonuses:", senior_bonuses)  # [11500, 14000]

# 2. Dictionary Comprehension (Inverting key-value lookup)
user_to_id = {"alice": 101, "bob": 102, "charlie": 103}
id_to_user = {uid: uname.capitalize() for uname, uid in user_to_id.items()}
print("Inverted ID map:", id_to_user)  # {101: 'Alice', 102: 'Bob', 103: 'Charlie'}

# 3. Set Comprehension (Deduplicating & normalizing email domains)
emails = ["john@gmail.com", "sarah@GMAIL.COM", "alex@yahoo.com", "mike@outlook.com"]
unique_domains = {e.split("@")[1].lower() for e in emails}
print("Unique domains:", unique_domains)  # {'gmail.com', 'yahoo.com', 'outlook.com'}`}
        />

        <h2 className="text-2xl font-bold text-white pt-4">2. Anonymous Lambda Expressions & Functional Tools</h2>
        <CodeBlock
          filename="functional_python.py"
          language="python"
          code={`# Anonymous Lambda Syntax: lambda arguments : expression
# Sorting complex data structures
data_engineers = [
    {"name": "Elena", "experience_years": 7, "skills": ["Spark", "Airflow"]},
    {"name": "Marcus", "experience_years": 4, "skills": ["SQL", "dbt"]},
    {"name": "Ananya", "experience_years": 9, "skills": ["Kafka", "Python"]},
]

# Sort engineers descending by years of experience:
sorted_engineers = sorted(data_engineers, key=lambda eng: eng["experience_years"], reverse=True)

# Functional map() and filter() alternatives
squared = list(map(lambda x: x ** 2, [1, 2, 3, 4, 5]))
evens = list(filter(lambda x: x % 2 == 0, [1, 2, 3, 4, 5, 6]))`}
        />

        <PythonCalloutBox type="pro-tip" title="Comprehensions vs map/filter Performance">
          In Python, list comprehensions are almost universally preferred over <code className="text-cyan-300">map()</code> and <code className="text-cyan-300">filter()</code> with lambda expressions! List comprehensions evaluate in C-level loops without the overhead of creating Python frame objects for every single lambda invocation, making them both cleaner to read and significantly faster.
        </PythonCalloutBox>
      </div>
    </div>
  );
};

/* =========================================================================
   CHAPTER 10: Modules & Packages
   ========================================================================= */
export const Chapter10Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-200">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
          <span>Chapter 10</span>
          <span>·</span>
          <span>Systems & I/O</span>
          <span>·</span>
          <span>20 min read</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Modules, Packages, Virtual Environments & pip Management
        </h1>
        <p className="text-base text-slate-400 mt-2 leading-relaxed">
          As software expands, code must be organized into modular, decoupled units. A <strong>module</strong> is a single <code className="text-amber-400">.py</code> file, while a <strong>package</strong> is a directory containing modules and an optional <code className="text-amber-400">__init__.py</code> manifest.
        </p>
      </div>

      <div className="border-t border-slate-800/80 pt-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">1. The if __name__ == "__main__" Guard</h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          When Python executes a script directly, it sets the special global variable <code className="text-amber-300">__name__</code> to <code className="text-cyan-300">"__main__"</code>. If the file is imported by another script, <code className="text-amber-300">__name__</code> is set to the module's actual filename.
        </p>

        <CodeBlock
          filename="data_pipeline.py"
          language="python"
          code={`def run_etl():
    print("Extracting records from Postgres and writing to S3...")

def compute_kpis():
    print("Aggregating daily active users and retention...")

# Safety guard: only execute automated pipeline when called from CLI
if __name__ == "__main__":
    print("Executing pipeline as standalone CLI application...")
    run_etl()
    compute_kpis()`}
        />

        <h2 className="text-2xl font-bold text-white pt-4">2. Virtual Environments (venv) & Dependency Isolation</h2>
        <CodeBlock
          filename="terminal_commands.sh"
          language="bash"
          code={`# 1. Create an isolated virtual environment
python3 -m venv .venv

# 2. Activate environment (macOS / Linux):
source .venv/bin/activate
# Windows activation:
# .venv\\Scripts\\activate

# 3. Install production dependencies
pip install fastapi uvicorn pydantic pandas

# 4. Freeze locked versions for deterministic CI/CD builds
pip freeze > requirements.txt

# 5. Reinstall in production Docker container
pip install -r requirements.txt --no-cache-dir`}
        />

        <PythonCalloutBox type="common-mistake" title="Global pip Installs">
          Never run <code className="text-rose-400">pip install package</code> into your system Python! Doing so modifies the OS-level Python installation (used by your Linux distro or macOS system utilities), creating dependency conflicts. Always activate an isolated virtual environment (<code className="text-emerald-300">.venv</code>) for each project.
        </PythonCalloutBox>
      </div>
    </div>
  );
};

/* =========================================================================
   CHAPTER 11: File Handling & I/O
   ========================================================================= */
export const Chapter11Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-200">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
          <span>Chapter 11</span>
          <span>·</span>
          <span>Systems & I/O</span>
          <span>·</span>
          <span>24 min read</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          File Handling & Serialization: Read, Write, Append, CSV & JSON
        </h1>
        <p className="text-base text-slate-400 mt-2 leading-relaxed">
          Filesystem input/output and data serialization are core requirements of data engineering and web backends. Python makes file handling safe and painless through the <code className="text-amber-400">with</code> context manager, which guarantees file descriptors are closed even during unexpected exceptions.
        </p>
      </div>

      <div className="border-t border-slate-800/80 pt-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">1. File Access Modes Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden font-mono">
            <thead className="bg-slate-900 text-slate-300 uppercase text-[11px] font-sans">
              <tr>
                <th className="p-3 border-b border-slate-800">Mode</th>
                <th className="p-3 border-b border-slate-800">Description</th>
                <th className="p-3 border-b border-slate-800">File Pointer Position</th>
                <th className="p-3 border-b border-slate-800">Behavior if File Does Not Exist</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-cyan-300 font-bold">"r"</td>
                <td className="p-3 font-sans">Read-only (Default)</td>
                <td className="p-3">Beginning of file</td>
                <td className="p-3 text-rose-400 font-sans">Raises FileNotFoundError</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-amber-300 font-bold">"w"</td>
                <td className="p-3 font-sans">Write-only (Truncates existing content)</td>
                <td className="p-3">Beginning of file</td>
                <td className="p-3 text-emerald-400 font-sans">Creates new file</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-emerald-300 font-bold">"a"</td>
                <td className="p-3 font-sans">Append-only (Preserves existing content)</td>
                <td className="p-3">End of file</td>
                <td className="p-3 text-emerald-400 font-sans">Creates new file</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 text-purple-300 font-bold">"rb" / "wb"</td>
                <td className="p-3 font-sans">Binary read/write (Images, PDFs, pickles)</td>
                <td className="p-3">Start / End</td>
                <td className="p-3 font-sans">Raw bytes stream</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold text-white pt-4">2. CSV & JSON Serialization Patterns</h2>
        <CodeBlock
          filename="serialization_demo.py"
          language="python"
          code={`import json
import csv

# 1. Enterprise JSON Serialization with formatting
report_data = {
    "generated_at": "2026-10-10T12:00:00Z",
    "metrics": {"total_users": 154200, "conversion_rate": 0.048},
    "features_enabled": ["dark_mode", "ai_copilot", "sso"]
}

with open("report.json", "w", encoding="utf-8") as f:
    json.dump(report_data, f, indent=2)

with open("report.json", "r", encoding="utf-8") as f:
    loaded = json.load(f)
    print("Parsed JSON total users:", loaded["metrics"]["total_users"])

# 2. Reading CSV with csv.DictReader
with open("customers.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["id", "name", "plan"])
    writer.writeheader()
    writer.writerow({"id": 1, "name": "Deepak Sharma", "plan": "Enterprise"})
    writer.writerow({"id": 2, "name": "Sarah Connor", "plan": "Pro"})`}
        />

        <PythonCalloutBox type="pro-tip" title="Always Specify encoding='utf-8'">
          Never rely on Python's platform default encoding when opening files! On Windows, the default can be <code className="text-rose-400">cp1252</code>, which will crash your app when encountering emojis or international characters. Always include <code className="text-emerald-300">encoding="utf-8"</code> explicitly.
        </PythonCalloutBox>
      </div>
    </div>
  );
};

/* =========================================================================
   CHAPTER 12: Exception Handling
   ========================================================================= */
export const Chapter12Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-200">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
          <span>Chapter 12</span>
          <span>·</span>
          <span>Systems & I/O</span>
          <span>·</span>
          <span>22 min read</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Exception Handling: try-except-else-finally & Custom Exceptions
        </h1>
        <p className="text-base text-slate-400 mt-2 leading-relaxed">
          Production applications must fail gracefully without leaving database connections hung or data corrupted. Python provides a structured exception handling architecture based on the <code className="text-amber-400">try</code>, <code className="text-amber-400">except</code>, <code className="text-cyan-400">else</code>, and <code className="text-emerald-400">finally</code> control blocks.
        </p>
      </div>

      <div className="border-t border-slate-800/80 pt-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">1. The Full Lifecycle: try, except, else, finally</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
            <span className="font-mono text-amber-400 font-bold block mb-1">try:</span>
            Contains the risky code that may raise an error (e.g. database query, file reading, HTTP request).
          </div>
          <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
            <span className="font-mono text-rose-400 font-bold block mb-1">except Error:</span>
            Catches specific exception types and executes recovery, logging, or rollback logic.
          </div>
          <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
            <span className="font-mono text-cyan-400 font-bold block mb-1">else:</span>
            Runs <em>only</em> if the <code className="text-cyan-300">try</code> block succeeded with zero exceptions.
          </div>
          <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
            <span className="font-mono text-emerald-400 font-bold block mb-1">finally:</span>
            Guaranteed to run <em>always</em> (even after a return or re-raised error). Ideal for resource cleanup.
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white pt-4">2. Defining Custom Domain Exceptions</h2>
        <CodeBlock
          filename="custom_exceptions.py"
          language="python"
          code={`# Custom Domain Exception Class
class InsufficientFundsError(Exception):
    \"\"\"Raised when an account balance cannot cover a debit transaction.\"\"\"
    def __init__(self, account_id: str, current_balance: float, requested_amount: float):
        self.account_id = account_id
        self.current_balance = current_balance
        self.requested_amount = requested_amount
        super().__init__(
            f"Account '{account_id}' has \${current_balance:,.2f}, which is insufficient for \${requested_amount:,.2f}"
        )

class BankAccount:
    def __init__(self, account_id: str, balance: float):
        self.account_id = account_id
        self.balance = balance

    def withdraw(self, amount: float) -> float:
        if amount > self.balance:
            raise InsufficientFundsError(self.account_id, self.balance, amount)
        self.balance -= amount
        return self.balance

# Execution & Handling
try:
    acc = BankAccount("ACC-9042", 500.0)
    acc.withdraw(1200.0)
except InsufficientFundsError as err:
    print(f"Transaction Blocked: {err}")
finally:
    print("Audit log committed.")`}
        />

        <PythonCalloutBox type="common-mistake" title="The Bare 'except:' Anti-Pattern">
          <strong>Never write:</strong> <code className="text-rose-400">except:</code> without specifying an exception class! A bare except statement catches <code className="text-rose-400">BaseException</code>, which includes <code className="text-rose-400">KeyboardInterrupt</code> (Ctrl+C) and <code className="text-rose-400">SystemExit</code>, making your program impossible to stop from the terminal. At minimum, catch <code className="text-emerald-300">except Exception as e:</code>.
        </PythonCalloutBox>
      </div>
    </div>
  );
};
