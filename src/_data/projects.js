export default [
  {
    title: "Osmgraph",
    description:
      "Builds a road graph from an OpenStreetMap PBF file (osm.pbf). Returns a node map (coordinates) and an adjacency map (edges) suitable for pathfinding.",
    tags: ["Go"],
    links: [{ label: "GitHub", url: "https://github.com/ize-302/osmgraph" }],
  },
  {
    title: "Beacon",
    description:
      "Real-time vehicle tracking system. Simulates GPS-equipped vehicles moving across Lagos road network and streams their positions to a live map dashboard.",
    tags: ["Go", "TypeScript", "Postgres", "Websocket"],
    links: [{ label: "GitHub", url: "https://github.com/ize-302/beacon" }],
  },
  {
    title: "Hop",
    description: "A fast, intuitive tmux session manager for the terminal",
    tags: ["Shell script"],
    links: [{ label: "GitHub", url: "https://github.com/ize-302/hop" }],
  },
  {
    title: "Personal linux monitoring tool",
    description:
      "Personal monitoring tool for my linux setup. Think of a simplified version of Grafana + Prometheus but fully local.",
    tags: ["Zig", "TypeScript", "SQLite", "Websocket"],
    links: [
      {
        label: "GitHub",
        url: "https://github.com/ize-302/mini-monitoring-tool",
      },
      {
        label: "Blog",
        url: "http://localhost:8080/posts/building-a-realtime-system-monitor/",
      },
    ],
  },
  {
    title: "Gitmo",
    description:
      "A cli tool that adds appropriate emoji to your commit message based on conventional commits specification",
    tags: ["TypeScript"],
    links: [
      {
        label: "GitHub",
        url: "https://github.com/ize-302/gitmo",
      },
      {
        label: "NPM",
        url: "https://www.npmjs.com/package/gitmo",
      },
    ],
  },
];
