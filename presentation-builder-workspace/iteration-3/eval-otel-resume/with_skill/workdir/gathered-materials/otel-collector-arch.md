# OTel Collector Architecture — current state (2026-04)

## Deployment

OTel Collectors run as a DaemonSet (agent tier) + a Deployment (gateway tier)
on each k8s cluster. Agent tier scrapes pods, enriches with k8s attributes,
forwards to gateway. Gateway tier does sampling, batching, and fan-out to
backends.

## Backends

- **Traces:** Tempo (Grafana Cloud for internal, self-hosted for customer data)
- **Metrics:** Mimir (all self-hosted). Prometheus-compatible.
- **Logs:** Loki (self-hosted).

## Why this split?

- Tempo for traces because our tracing cardinality is fine and Grafana Cloud is
  cheap for our volume.
- Mimir for metrics because that's where all the cost pressure was — we have to
  control this tier and Prometheus storage is well-understood.
- Loki for logs because we were already using it for k8s logs; migrating OTel
  log records into it was ~1 sprint of work.

## Sampling

- Head-based sampling in agent tier (10% for most services, 100% for payments
  and auth)
- Tail-based sampling in gateway (keeps errors + slow requests at 100%, samples
  the rest at 1%)

## Known pain points

- Tail-based sampling requires all spans of a trace to hit the same gateway,
  which pinned us to a scaling pattern we didn't love.
- Collector config sprawl — 6 different config files for 6 deployments.
- Cardinality limits in Mimir mean we still get paged occasionally when a bad
  deploy adds a high-card label.
