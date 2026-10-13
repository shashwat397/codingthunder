import React from 'react';
import { DataEngineeringCallout } from '../DataEngineeringCallout.tsx';
import { CodeBlock } from '../../common/CodeBlock.tsx';
import { MedallionPipelineDiagram } from '../diagrams/MedallionPipelineDiagram.tsx';

/* =========================================================================
   PHASE 1: Architecture & Lakehouse Foundations
   ========================================================================= */
export const Phase1Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-300">
      {/* Phase Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2">
          <span>Milestone 01</span>
          <span>•</span>
          <span>Lakehouse Architecture & Medallion Design</span>
          <span>•</span>
          <span className="text-emerald-400">Foundation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Architecture & Foundation: The Modern Data Lakehouse & Medallion Design
        </h1>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          Move beyond brittle legacy ETL pipelines. Build an ACID-compliant enterprise Lakehouse architecture unifying
          low-cost object storage (AWS S3 / MinIO) with transactional table formats (Delta Lake / Apache Iceberg).
        </p>
      </div>

      {/* 1. Medallion Pipeline Architecture */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          1. The 3-Tier Medallion Data Architecture (Bronze ➔ Silver ➔ Gold)
        </h2>
        <p className="text-sm leading-relaxed">
          The Medallion pattern organizes data incrementally as it flows through the platform, creating clear quality gates
          and decoupling raw data ingestion from analytical compute:
        </p>

        <MedallionPipelineDiagram />

        {/* Storage Format Comparison Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 my-6 shadow-xl">
          <div className="p-3 bg-slate-800/80 border-b border-slate-700 text-xs font-mono font-bold text-cyan-300">
            Open Table Format Architectural Comparison: Delta Lake vs. Apache Iceberg vs. Apache Hudi
          </div>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-300 font-mono">
                <th className="py-2.5 px-4">Feature / Metric</th>
                <th className="py-2.5 px-4 font-bold text-cyan-300">Delta Lake</th>
                <th className="py-2.5 px-4 font-bold text-blue-300">Apache Iceberg</th>
                <th className="py-2.5 px-4 font-bold text-amber-300">Apache Hudi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-sans">
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-white font-mono">Transaction Metadata</td>
                <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">JSON commits + checkpoint Parquet (_delta_log)</td>
                <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">Hierarchical snapshots + manifest list files</td>
                <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">Timeline commit files (.hoodie)</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-white font-mono">Hidden Partitioning</td>
                <td className="py-3 px-4 text-slate-400">Requires explicit generated partition columns</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">Native (Zero partition column duplication)</td>
                <td className="py-3 px-4 text-slate-400">Partial support via virtual keys</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-white font-mono">Time Travel & Rollback</td>
                <td className="py-3 px-4 text-emerald-400 font-mono font-bold">TIMESTAMP AS OF / VERSION AS OF</td>
                <td className="py-3 px-4 text-emerald-400 font-mono font-bold">SNAPSHOT ID / AS OF TIMESTAMP</td>
                <td className="py-3 px-4 text-emerald-400 font-mono font-bold">Time travel via commit timestamps</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-bold text-white font-mono">Spark & dbt Integration</td>
                <td className="py-3 px-4 text-emerald-400 font-semibold">Tier-1 First-Class support via Databricks/Delta-RS</td>
                <td className="py-3 px-4 text-emerald-400 font-semibold">Rapid industry adoption (Snowflake/Trino/Spark)</td>
                <td className="py-3 px-4 text-slate-400">Complex setup, specialized Spark extensions</td>
              </tr>
            </tbody>
          </table>
        </div>

        <DataEngineeringCallout type="production-caveat" title="The Small Files Problem in Bronze Streams">
          When streaming Kafka messages into Delta Lake in micro-batches of 10 seconds, you can accidentally generate
          8,640 small Parquet files every 24 hours! Always configure Delta Lake's <code>autoOptimize.optimizeWrite = true</code>{' '}
          or schedule a daily <code>OPTIMIZE ecom_orders ZORDER BY (customer_id, event_timestamp)</code> compaction job!
        </DataEngineeringCallout>
      </section>

      {/* 2. Partitioning Strategies */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          2. Storage Partitioning & Z-Ordering Strategy
        </h2>
        <p className="text-sm leading-relaxed">
          Over-partitioning is the #1 killer of Spark query performance. If a partition contains fewer than 128 MB of data,
          the metadata overhead of directory listing degrades query performance:
        </p>

        <CodeBlock
          language="sql"
          code={`-- Production Delta Lake Table Definition with Z-Ordering
CREATE TABLE lakehouse.bronze.ecom_orders (
    event_id STRING NOT NULL,
    order_id STRING NOT NULL,
    customer_id STRING NOT NULL,
    customer_segment STRING,
    product_sku STRING,
    quantity INT,
    unit_price DECIMAL(10,2),
    total_amount DECIMAL(12,2),
    event_timestamp TIMESTAMP NOT NULL,
    year INT GENERATED ALWAYS AS (YEAR(event_timestamp)),
    month INT GENERATED ALWAYS AS (MONTH(event_timestamp))
)
USING DELTA
PARTITIONED BY (year, month)
TBLPROPERTIES (
    'delta.autoOptimize.optimizeWrite' = 'true',
    'delta.autoOptimize.autoCompact' = 'true',
    'delta.deletedFileRetentionDuration' = 'interval 30 days'
);`}
        />
      </section>
    </div>
  );
};

/* =========================================================================
   PHASE 2: Data Ingestion (Batch & Streaming)
   ========================================================================= */
export const Phase2Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-300">
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2">
          <span>Milestone 02</span>
          <span>•</span>
          <span>High-Throughput Ingestion Engine</span>
          <span>•</span>
          <span className="text-cyan-400">Intermediate</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Data Ingestion: Streaming with Apache Kafka / Redpanda & Python Producers
        </h1>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          Construct fault-tolerant streaming ingestion pipelines. Configure high-throughput Kafka topics, enforce Avro/JSON
          schemas, implement idempotent message producing, and establish Dead-Letter Queues (DLQ).
        </p>
      </div>

      {/* 1. Kafka Cluster Architecture */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          1. Kafka Topic Configuration & Partition Keying
        </h2>
        <p className="text-sm leading-relaxed">
          To maintain strict ordering of e-commerce state transitions (e.g. <code>ORDER_CREATED</code> ➔{' '}
          <code>PAYMENT_CAPTURED</code> ➔ <code>ORDER_FULFILLED</code>), all events for a given order must be dispatched to
          the same partition using <code>customer_id</code> or <code>order_id</code> as the partition key:
        </p>

        <CodeBlock
          language="bash"
          code={`# Create topic with 6 partitions, replication factor 3, and 7-day retention
kafka-topics.sh --bootstrap-server localhost:9092 --create \\
    --topic ecom.orders.v1 \\
    --partitions 6 \\
    --replication-factor 3 \\
    --config min.insync.replicas=2 \\
    --config retention.ms=604800000 \\
    --config compression.type=snappy`}
        />
      </section>

      {/* 2. Python Idempotent Producer */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          2. Production Python Producer with Idempotency & Retries
        </h2>
        <p className="text-sm leading-relaxed">
          Network hiccups must never duplicate financial transactions. Enabling <code>enable.idempotence=true</code> assigns
          a Producer ID (PID) and sequence numbers to every message batch, guaranteeing exactly-once delivery semantics at
          the broker layer:
        </p>

        <CodeBlock
          language="python"
          code={`import json
import logging
from confluent_kafka import Producer

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ecom_producer")

conf = {
    'bootstrap.servers': 'localhost:9092',
    'client.id': 'ecom_payment_service',
    # Idempotence guarantees exactly-once delivery per partition
    'enable.idempotence': True,
    'acks': 'all',                          # All ISRs must acknowledge write
    'retries': 5,                           # Automatic retries on transient errors
    'max.in.flight.requests.per.connection': 5,
    'compression.type': 'snappy',
    'linger.ms': 20                         # Micro-batching for higher throughput
}

producer = Producer(conf)

def delivery_callback(err, msg):
    if err is not None:
        logger.error(f"Failed to deliver message: {err}")
        # Dispatch to Dead-Letter Queue (DLQ)
    else:
        logger.info(f"Delivered {msg.key()} to [{msg.topic()}:{msg.partition()}] offset {msg.offset()}")

def emit_transaction_event(event: dict):
    key = str(event['customer_id']).encode('utf-8')
    payload = json.dumps(event).encode('utf-8')
    producer.produce('ecom.orders.v1', key=key, value=payload, callback=delivery_callback)
    producer.poll(0)

# Flush any pending messages during graceful shutdown
producer.flush(timeout=10)`}
        />

        <DataEngineeringCallout type="interview-tip" title="Interview Question: At-Least-Once vs Exactly-Once">
          <strong>Question:</strong> "How does Kafka achieve Exactly-Once Processing (EOS) across distributed consumers and producers?"
          <br />
          <strong>Answer:</strong> "EOS combines two mechanisms: (1) Idempotent producers using sequence numbers and PIDs to
          prevent duplicate writes, and (2) Transactional API (`send_offsets_to_transaction`) coordinating atomic commits
          between read offsets and write destinations using a 2-Phase Commit on the `__transaction_state` topic."
        </DataEngineeringCallout>
      </section>
    </div>
  );
};

/* =========================================================================
   PHASE 3: Distributed Processing with PySpark
   ========================================================================= */
export const Phase3Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-300">
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2">
          <span>Milestone 03</span>
          <span>•</span>
          <span>Distributed Processing & Streaming Engine</span>
          <span>•</span>
          <span className="text-amber-400">Advanced Analytics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Distributed Processing & SQL: PySpark Transformations & Watermarking
        </h1>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          Scale data processing across compute nodes. Master Spark Structured Streaming, configure watermarking to handle
          late-arriving mobile events, execute sliding window aggregations, and optimize execution plans with the Catalyst
          optimizer.
        </p>
      </div>

      {/* 1. Spark Structured Streaming */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          1. PySpark Structured Streaming Pipeline with Watermarks
        </h2>
        <p className="text-sm leading-relaxed">
          In high-volume streaming, events can arrive out-of-order due to mobile network reconnects. A{' '}
          <strong>Watermark</strong> tells Spark how long to wait before closing an aggregation window and evicting state
          from memory:
        </p>

        <CodeBlock
          language="python"
          code={`from pyspark.sql import SparkSession
from pyspark.sql.functions import from_json, col, window, to_utc_timestamp, expr
from pyspark.sql.types import StructType, StringType, IntegerType, DoubleType, TimestampType

spark = SparkSession.builder \\
    .appName("EcomSilverCurator") \\
    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension") \\
    .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog") \\
    .getOrCreate()

# 1. Read from Kafka Streaming Source
kafka_stream = spark.readStream \\
    .format("kafka") \\
    .option("kafka.bootstrap.servers", "localhost:9092") \\
    .option("subscribe", "ecom.orders.v1") \\
    .option("startingOffsets", "latest") \\
    .load()

# 2. Define Strict JSON Schema
schema = StructType() \\
    .add("event_id", StringType()) \\
    .add("order_id", StringType()) \\
    .add("customer_id", StringType()) \\
    .add("total_amount", DoubleType()) \\
    .add("event_timestamp", TimestampType())

parsed_df = kafka_stream.select(
    from_json(col("value").cast("string"), schema).alias("data")
).select("data.*")

# 3. Apply 10-Minute Watermark & 5-Minute Sliding Aggregations
hourly_velocity = parsed_df \\
    .withWatermark("event_timestamp", "10 minutes") \\
    .groupBy(
        window(col("event_timestamp"), "10 minutes", "5 minutes"),
        col("customer_id")
    ) \\
    .agg(
        expr("count(order_id) as orders_count"),
        expr("sum(total_amount) as rolling_amount")
    )

# 4. Write Enriched Silver Stream to Delta Lake
query = hourly_velocity.writeStream \\
    .format("delta") \\
    .outputMode("append") \\
    .option("checkpointLocation", "s3a://checkpoints/silver/velocity") \\
    .start("s3a://lakehouse/silver/customer_velocity")`}
        />

        <DataEngineeringCallout type="debugging-practice" title="Managing Spark Driver OOM Exceptions">
          When dealing with stateful operations (like stream-stream joins or aggregations), failing to set a watermark
          forces Spark's state store to retain keys indefinitely in executor RAM until the cluster crashes with{' '}
          <code>java.lang.OutOfMemoryError</code>. Always bound stateful streams with watermarks!
        </DataEngineeringCallout>
      </section>
    </div>
  );
};
