---
title: Building a Real-Time System Monitor with Zig, Bun, and WebSockets
summary: Most monitoring tools are either bloated or cloud-dependent. I wanted something minimal, local, and fast so I built one using Zig for system-level collection and Bun for a real-time WebSocket API. Here is how I approached it.
date: 2026-03-19
published: true
tags: ["zig", "systems-programming", "websockets"]
---

## System architecture

![system architecture for local monitoring tool](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/69fzkchnfngbwq3fxxow.png)

The core idea is simple: collect system metrics at regular intervals, store them in a database for later access, and broadcast updates to a web interface in real time.

### Metric collectors

The first step is a set of metric collectors that reads system metrics ands send them to the API every second.

I chose the [Zig](https://ziglang.org/) programming language for this. Why Zig?

- Zig is a modern alternative to C, offering better safety and performance while giving explicit control over memory. This makes it ideal for building lightweight tools with minimal overhead.

- Zig provides native access to system resources which enables direct interaction with hardware while offering stronger memory checks than C.

To keep this article concise, I'll explain each metric collector in plain English rather than diving deeply into implementation details.

#### CPU metric

CPU usage is captured from `/proc/stat`. The `/proc` directory in Linux is a virtual filesystem managed by the kernel that exposes real-time system and process information. Other system metrics are also available here.

Flow for CPU metric collector:

```sh
[ Get first reading from /proc/stat ]
      |
[ After first reading cycle ]
      |
[ Get second reading from /proc/stat ]
      |
[ Calculate delta total and delta active difference ]
      |
[ Compute the CPU usage in percentage ]
      |
[ Send to API Service ]
```

> CPU usage is calculated by comparing two readings of CPU time and computing the percentage of time spent doing active work versus idle time.

[Source code for CPU metric collector here](https://github.com/ize-302/mini-monitoring-tool/blob/main/collectors/cpu.zig)

---

#### Memory metric

Memory metrics are read from `/proc/meminfo`.

Flow for memory metric collection:

```sh
[ Read total memory from /proc/meminfo ]
      |
[ Read available memory from /proc/meminfo ]
      |
[ Compute the percentage being used ]
      |
[ Send to API Service ]
```

[Source code for memory metric collector here](https://github.com/ize-302/mini-monitoring-tool/blob/main/collectors/memory.zig)

---

#### Temperature metric

Temperature metrics are read from the `/sys` virtual filesystem, which exposes hardware attributes and allows inspection or control of devices.

> While `/proc` provides system and process stats, `/sys` exposes hardware-level information such as temperature sensors and power supply data.

Flow diagram of temperature metric collector:

```sh
[ Read the content of /sys/class/thermal/thermal_zone0/temp ]
      |
[ Convert from millidegrees Celsius to degree Celsius ]
      |
[ Send to API Service ]
```

[Source code for temperature metric collector here](https://github.com/ize-302/mini-monitoring-tool/blob/main/collectors/temperature.zig)

---

#### Battery metric

Battery metrics are also read from `/sys`. The collector reads the battery capacity from `/sys/class/power_supply/BAT0/capacity` (as a percentage) and sends it to the API.

Flow diagram of battery metric collector:

```sh
[ Read the content of /sys/class/power_supply/BAT0/capacity ]
      |
[ Send to API Service ]
```

[Source code for battery metric collector here](https://github.com/ize-302/mini-monitoring-tool/blob/main/collectors/battery.zig)

---

### API service

Once metrics are collected, the next step is to store and make them available to clients in real time. This is handled by a lightweight API service.

The API service is built with [TypeScript](https://www.typescriptlang.org/) and [Bun](https://bun.com/docs). Bun is a fast Javascript runtime designed for modern applications, with built-in HTTP, WebSocket, and SQLite support.

Why Bun?

- Fast and easy to setup
- Built-in WebSockets support
- Built-in SQLite
- No need for extra tooling

The Web API service is responsible for:

1. Persisting collected metrics in SQLite
2. Broadcasting metrics to connected clients via WebSockets

##### Endpoints:

| Method | Route                        | Description                                 |
| ------ | ---------------------------- | ------------------------------------------- |
| `POST` | `/api/metrics/cpu`           | Ingest CPU usage                            |
| `POST` | `/api/metrics/memory`        | Ingest memory usage                         |
| `POST` | `/api/metrics/temperature`   | Ingest temperature                          |
| `POST` | `/api/metrics/battery`       | Ingest battery level                        |
| `GET`  | `/api/history?metric=<name>` | Last 200 data points for a metric           |
| `WS`   | `/ws`                        | Real-time broadcast of all incoming metrics |

---

### Database

SQLite is used for its lightweight nature and simplicity, making it ideal for a local monitoring tool.

#### Metric table

| Column | Type    | Constraints                | Description                                    |
| ------ | ------- | -------------------------- | ---------------------------------------------- |
| id     | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique row identifier                          |
| metric | TEXT    | NOT NULL                   | Metric type (cpu, memory, temperature, etc.)   |
| value  | REAL    | NOT NULL                   | Recorded metric value                          |
| ts     | INTEGER | NOT NULL                   | Unix timestamp of when the metric was recorded |

Writing to the database every second could cause performance issues, so SQLite is configured for Write-Ahead Logging (WAL) and relaxed synchronous mode:

- `PRAGMA journal_mode = WAL;`
  This configures SQLite to write to a separate WAL file before merging into the main database thereby improving concurrency and write performance, at the cost of slightly more disk usage.

- `PRAGMA synchronous = NORMAL;`
  This configuration reduces the number of disk sync operations for faster writes. In rare cases (e.g., sudden power loss), some recent writes may be lost—acceptable for this use case.

---

### Web dashboard

Finally, to visualize the metrics in real time, I built a simple web interface that connects to the WebSocket endpoint. Whenever the API receives a new metric, it broadcasts it to all connected clients. The frontend listens for these events and updates the UI accordingly.

This approach avoids polling and ensures that the dashboard reflects system changes instantly.

I used [CanvasJS](https://canvasjs.com/) for visualization, providing charts that show trends over time at a glance.

---

### Conclusion

Building this monitoring tool helped me gain hands-on experience with Linux virtual filesystems (`/proc` and `/sys`) and real-time WebSocket communication.

While this is minimal, there are several possible improvements:

- Adding alerting for threshold breaches
- Enhancing the visualization layer
- Aggregating metrics over time for example:
  - average CPU usage over 1 minute
  - maximum temperature over 5 minutes

Overall, this project was an excellent hands-on learning experience, deepening my understanding of low-level system operations and real-time data streaming.

Thank you for taking the time to read. Looking forward to whatever questions or suggestions you may have.

> Here is the [link](https://github.com/ize-302/mini-monitoring-tool) to the entire source code. Happy digging!
