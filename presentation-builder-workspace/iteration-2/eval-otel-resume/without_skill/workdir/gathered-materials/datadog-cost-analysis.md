# Datadog cost analysis (internal memo, 2026-02)

## TL;DR

Our Datadog bill tripled in 3 years ($180k → $720k/yr) despite roughly flat
usage. The growth is almost entirely cardinality-driven: we added `user_id`,
`tenant_id`, and `request_id` as metric tags early on and every chart we built
on top of those ballooned the time-series count.

## By the numbers

- 2023: $180k/yr, ~2.1M active time-series
- 2024: $380k/yr, ~6.8M time-series
- 2025: $590k/yr, ~14.2M time-series
- 2026 (projected): $720k/yr, ~19M time-series

Custom metrics SKU is the dominant cost line (72% of total).

## What actually drove it

- `user_id` tag was added on 14 core metrics in 2024 for a debugging push. Never removed.
- `tenant_id` multiplied everything by ~900 (our tenant count).
- `request_id` tagged a counter that should never have had it.

## Why OTel specifically

Datadog custom-metric pricing is per-tag-combination. OTel + self-hosted backend
(Mimir) is per-sample. We can drop the same cardinality at ingest or at storage
and the cost curve flattens.

## What we're NOT claiming

- That OTel is always cheaper. It needs 1-2 platform engineers to run.
- That we understood cardinality the whole time. We didn't. We'd make the same
  mistake in OTel if we weren't careful. The *good* part is that with OTel,
  cardinality mistakes cost us compute, not money.
