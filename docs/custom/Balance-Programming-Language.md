---
title: "Balance: Quilibrium's Programming Language for Distributed Systems"
source: github
author: Quilibrium Network
date: 2026-03-30
type: technical_reference
topics:
  - Balance
  - programming language
  - distributed systems
  - capabilities
  - CSP
  - settlement
  - substrates
  - ports
  - services
  - Rust
---

# Balance: Quilibrium's Programming Language for Distributed Systems

Balance is a programming language for distributed systems where **capability-based service interaction** is the primary abstraction. It is a practical embodiment of the **Communicating Sequential Processes (CSP)** paradigm: independent services communicate exclusively through typed, capability-mediated interactions rather than shared memory, with formal event traces providing the mathematical foundation for reasoning about correctness across process boundaries.

Instead of treating distribution as an afterthought, Balance makes authority, consistency, and distributed semantics explicit and checkable from the ground up.

The Balance compiler and runtime are written in **Rust** and live in the open-source repository `QuilibriumNetwork/balance`.

## Why Balance?

In most languages, a function call and a remote service call look the same but behave very differently. Balance makes this distinction first-class:

- **Capabilities** (`cap T`) are unforgeable references to services. You cannot accidentally call something you do not have authority to use.
- **Settlement and observation** make consistency semantics explicit. A write is not "done" when it returns; it is done when the event trace confirms it.
- **Substrates** define the mechanisms (logs, stores, queues, crypto, networking) with formal guarantees that can be verified.
- **Profiles** let the same code run with different trust, latency, and durability tradeoffs without changing application logic.

## How Balance Differs from QCL

QCL (Q Compute Language) is Quilibrium's earlier application language, a Golang subset compiled into garbled circuits for secure multi-party computation (MPC). Balance is the next-generation language that goes beyond MPC to provide a full distributed-systems programming model with capabilities, settlement semantics, and substrate composition. Balance replaces the need to think in terms of circuits and instead lets developers write services that interact through typed, authority-checked interfaces.

## Key Concepts

### Capabilities

Authority-bearing references to services. Cannot be forged or constructed; only obtained via `resolve` or entry injection. Optionally qualified with `@consume`, `@borrow`, or `@delegate`.

```
entry(out: cap Stdout @delegate) {
    let h = resolve Hello["hello/world"]
    await out.writeln(await h.greet())
}
```

### Ports

Typed service interfaces. Operations are annotated as `[command]` (requires settlement) or `[query]` (requires observation).

```
port Hello {
    greet() -> String [query, visible(committed)]
}
```

### Services

Implementations of ports. Published with a runtime identity (`publish as "name"`), resolved by callers at runtime.

```
service HelloWorld provides Hello {
    publish as "hello/world"
    query greet() -> String {
        return "Hello, World!"
    }
}
```

### Substrates

Seven built-in mechanism types plus user-defined substrates:

| Built-in Substrate | Purpose |
|---|---|
| ReplicatedLog | Append-only replicated log |
| KeyValueStore | Key-value storage |
| Queue | Message queuing |
| Clock | Time and scheduling |
| Crypto | Cryptographic operations |
| Socket | TCP socket communication |
| RawSocket | Low-level socket access |

User-defined substrates can hold state, emit events, and compose other substrates:

```
substrate Counter {
    state {
        let mut count: Int = 0
    }

    op increment(amount: Int) -> Int {
        count = count + amount
        emit count_incremented { count: count, amount: amount }
        return count
    }

    op get_count() -> Int {
        return count
    }

    emits { count_incremented }
}
```

### Settlement

A command is not complete when it returns; it is complete when a matching event confirms it. This makes consistency semantics explicit rather than hidden behind "eventual consistency" hand-waving.

```
command put(key: String, value: String) -> String
    via store.put(key, value)
    settle store.put_committed by ack.key
```

### Guarantees

Formal laws over event traces that constrain substrate behavior and justify interaction semantics. This is the mathematical foundation that lets Balance reason about correctness across process boundaries.

## Language Features

Balance supports standard programming constructs alongside its distributed-systems primitives:

- **Functions and closures**: First-class functions, higher-order functions, lambdas
- **Error handling**: `Result` type with `Ok`/`Err` variants and pattern matching
- **Pattern matching**: `match` expressions with exhaustive checking
- **Collections**: Lists with `map`, `fold`, and other functional operations
- **Modules and imports**: Module system with packages and dynamic loading
- **Type inference**: Hindley-Milner style type checking

### Example: Functions and Closures

```
fn double(x: Int) -> Int {
    x * 2
}

entry() {
    let items = [1, 2, 3, 4, 5]
    let doubled = items.map(|x| { x * 2 })
    let sum = doubled.fold(0, |acc, x| { acc + x })
    sum
}
```

### Example: Error Handling with Result

```
fn divide(a: Int, b: Int) -> Result {
    match b {
        0 => return err("division by zero")
        _ => return ok(a / b)
    }
}

entry() {
    let r = divide(10, 2)
    match r {
        Ok(v) => v
        Err(e) => 0
    }
}
```

## CLI Usage

The `balance` CLI is built with `cargo build --release` and provides these commands:

| Command | Purpose |
|---|---|
| `balance run <file>` | Execute a program |
| `balance check <file>` | Type-check only |
| `balance trace <file>` | Run with interaction tracing |
| `balance deploy <file>` | Deploy as a service node |
| `balance compile <file>` | Emit bytecode IR |
| `balance repl` | Interactive REPL |

Additional flags include `--profile`, `--entry`, `--vm`, `--event-log`, and `--node-id`.

## Architecture

The runtime is structured in layers:

- **Lexer** (Logos 0.14): Tokenizer
- **Parser**: Recursive descent
- **AST**: Abstract syntax tree representation
- **Type Checker**: Inference and checking
- **Evaluator**: Async tree-walking evaluator
- **Bytecode VM**: Stack-based virtual machine with compiler (AST to bytecode)
- **Runtime**: Substrate implementations, interaction engine, service registries, async event system

## Frequently Asked Questions

**What language is Balance written in?**
Balance is implemented in Rust. The repository uses a Cargo workspace with two crates: `balance-lang` (core library) and `balance-cli` (CLI binary).

**How does Balance relate to Quilibrium's network?**
Balance is the programming language for building distributed applications on Quilibrium. Its capability-based model maps directly to Quilibrium's authority and permission architecture, and its settlement semantics align with how Quilibrium confirms state transitions.

**Can I try Balance today?**
Yes. Clone the `QuilibriumNetwork/balance` repository, run `cargo build --release`, and try the example programs in `tests/programs/` (48 examples covering everything from basic expressions to TCP socket servers).

**What is a "profile" in Balance?**
Profiles let the same application code run with different trust, latency, and durability tradeoffs. For example, a development profile might skip replication while a production profile requires quorum settlement. The application logic stays the same.

**How is Balance different from writing smart contracts?**
Balance programs are not contracts deployed to a shared VM. They are standalone distributed services that communicate through typed capabilities. There is no global shared state; each service owns its substrates and exposes only what its port interface declares.
