import React, { useState } from 'react';
import { Database, Cpu, Layers, Server, Terminal, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const MedallionPipelineDiagram: React.FC = () => {
  const [activeTier, setActiveTier] = useState<string>('silver');

  const tiers = [
    {
      id: 'sources',
      name: '01. Ingestion Sources',
      badge: 'Streaming & Batch',
      tech: 'Kafka / Redpanda, Python Requests, Debezium CDC',
      color: 'from-blue-600 to-cyan-600',
      borderColor: 'border-blue-500/40',
      badgeBg: 'bg-blue-500/20 text-blue-300',
      sla: '< 100ms streaming latency',
      description:
        'Continuous ingestion of raw transactional event payloads and clickstream logs. Emits Avro-encoded events into Kafka topic `ecom.orders.v1` with JSON schema validation.',
      keyOperations: [
        'Partitioning by customer_id for FIFO order guarantees',
        'Idempotent producers with acks=all to prevent dropped records',
        'Dead-Letter Queue (DLQ) for corrupt malformed JSON payloads',
      ],
      codeSnippet: `# Kafka Streaming Producer (Confluent Python)
p = Producer({'bootstrap.servers': 'localhost:9092', 'enable.idempotence': True})
p.produce('ecom.orders.v1', key=customer_id, value=avro_payload, callback=delivery_report)`,
    },
    {
      id: 'bronze',
      name: '02. Bronze Layer (Raw)',
      badge: 'Append-Only Lakehouse',
      tech: 'AWS S3 / MinIO + Delta Lake / Apache Iceberg',
      color: 'from-amber-600 to-yellow-600',
      borderColor: 'border-amber-500/40',
      badgeBg: 'bg-amber-500/20 text-amber-300',
      sla: 'Hourly Partition Sync',
      description:
        'Immutable historical archive. Raw data is landed as-is without any transformations or schema mutations, preserving original raw event lineage.',
      keyOperations: [
        'Storage format: Snappy-compressed Parquet with Delta Lake transaction log',
        'Partitioned by /year=YYYY/month=MM/day=DD/hour=HH',
        'ACID transactions prevent dirty reads during parallel ingestion bursts',
      ],
      codeSnippet: `# PySpark Bronze Ingestion with Delta Lake
df_stream.writeStream \\
    .format("delta") \\
    .outputMode("append") \\
    .option("checkpointLocation", "s3a://bronze/checkpoints/orders") \\
    .partitionBy("year", "month", "day") \\
    .start("s3a://bronze/lakehouse/ecom_orders")`,
    },
    {
      id: 'silver',
      name: '03. Silver Layer (Cleaned)',
      badge: 'Enriched & Conformed',
      tech: 'Apache Spark (PySpark), Great Expectations',
      color: 'from-slate-400 to-teal-400',
      borderColor: 'border-teal-500/50',
      badgeBg: 'bg-teal-500/20 text-teal-300',
      sla: 'Sub-15 Minute Latency',
      description:
        'Enterprise Single Source of Truth. Cleanses corrupt records, casts timestamps to UTC, deduplicates primary keys, and enriches geographic and customer metadata.',
      keyOperations: [
        'Deduplication via window functions over order_id and updated_at',
        'Schema evolution & quarantine for invalid price numbers',
        'Watermarking (10-minute threshold) to accommodate late-arriving mobile telemetry',
      ],
      codeSnippet: `# PySpark Silver Enrichment Pipeline
silver_df = bronze_df.dropDuplicates(["order_id"]) \\
    .filter(col("total_amount") > 0) \\
    .withColumn("order_timestamp_utc", to_utc_timestamp("event_timestamp", "UTC")) \\
    .withColumn("processed_at", current_timestamp())`,
    },
    {
      id: 'gold',
      name: '04. Gold Layer (Analytics Mart)',
      badge: 'Star Schema Dim/Fact',
      tech: 'dbt (data build tool), Snowflake / BigQuery / Postgres',
      color: 'from-amber-400 to-orange-500',
      borderColor: 'border-amber-500/50',
      badgeBg: 'bg-amber-500/20 text-amber-300',
      sla: 'Daily Incremental Merge',
      description:
        'Curated business-level dimensional models modeled for lightning-fast aggregation queries. Dimensional Kimball Star Schema powering BI dashboards and feature stores.',
      keyOperations: [
        'Surrogate key hashing with dbt_utils.surrogate_key([order_id, date])',
        'Incremental MERGE strategy targeting only mutated rows within last 3 days',
        'Automated dbt generic & singular tests verifying referential integrity',
      ],
      codeSnippet: `-- dbt Gold Model: fact_ecommerce_transactions.sql
{{ config(materialized='incremental', unique_key='transaction_sk') }}
SELECT 
  {{ dbt_utils.generate_surrogate_key(['t.order_id', 't.customer_id']) }} AS transaction_sk,
  t.order_id, c.customer_sk, p.product_sk, d.date_sk,
  t.quantity, t.total_amount, (t.total_amount * 0.15) AS estimated_margin
FROM {{ ref('stg_silver_orders') }} t
LEFT JOIN {{ ref('dim_customers') }} c ON t.customer_id = c.natural_customer_id`,
    },
    {
      id: 'serving',
      name: '05. Analytical Serving & BI',
      badge: 'Downstream Consumer',
      tech: 'Metabase, Supabase Cache, FastAPI Telemetry API',
      color: 'from-purple-600 to-indigo-600',
      borderColor: 'border-purple-500/40',
      badgeBg: 'bg-purple-500/20 text-purple-300',
      sla: '< 300ms Query SLA',
      description:
        'Executive decision support layer. Consumes pre-aggregated Gold marts for real-time revenue pacing, customer churn detection, and automated webhook alerts.',
      keyOperations: [
        'Pre-warmed analytical caches for executive Metabase dashboards',
        'FastAPI microservices querying Snowflake using read-only service accounts',
        'Row-Level Security (RLS) restricting customer financial data by region',
      ],
      codeSnippet: `# FastAPI Analytical Telemetry Endpoint
@app.get("/api/v1/metrics/revenue-velocity")
async def get_revenue_velocity(db: Session = Depends(get_gold_db)):
    return db.execute(text("SELECT * FROM agg_daily_revenue_velocity WHERE date >= NOW() - INTERVAL '30d'")).fetchall()`,
    },
  ];

  const current = tiers.find((t) => t.id === activeTier) || tiers[2];

  return (
    <div className="my-8 rounded-2xl border border-slate-800 bg-[#0a0f1d] p-6 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-slate-800/80 gap-3">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
            Lakehouse Architecture
          </span>
          <h3 className="text-lg font-bold text-white mt-1">
            Enterprise Medallion Architecture: End-to-End Pipeline
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /> Live Pipeline Spec
          </span>
        </div>
      </div>

      {/* Visual Pipeline Interactive Flow Bar */}
      <div className="py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {tiers.map((t, idx) => {
            const isSelected = activeTier === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTier(t.id)}
                className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-cyan-400 bg-slate-800/90 shadow-lg shadow-cyan-500/10 scale-[1.02]'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-slate-400">Stage 0{idx + 1}</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${t.badgeBg}`}>
                      {t.badge}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white leading-snug">{t.name}</div>
                </div>
                <div className="mt-3 text-[10px] font-mono text-slate-400 truncate">
                  {t.tech.split(',')[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Tier Inspector */}
      <div className="mt-2 p-5 rounded-xl border border-slate-800 bg-slate-900/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-white">{current.name}</h4>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${current.badgeBg}`}>
                {current.badge}
              </span>
            </div>
            <p className="text-xs font-mono text-cyan-300 mt-1">{current.tech}</p>
          </div>
          <span className="text-xs font-mono text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2.5 py-1 rounded-lg self-start sm:self-auto">
            SLA: {current.sla}
          </span>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-4">{current.description}</p>

        {/* Operational Highlights */}
        <div className="space-y-2 mb-4">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
            Core Production Architecture Patterns:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {current.keyOperations.map((op, i) => (
              <div
                key={i}
                className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-slate-300"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>{op}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Code Snippet */}
        <div className="mt-4">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-1.5">
            Production Engineering Snippet:
          </span>
          <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-200 overflow-x-auto leading-relaxed">
            <code>{current.codeSnippet}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
