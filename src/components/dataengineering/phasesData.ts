import { DataEngineeringPhase } from './types.ts';

export const DATA_ENGINEERING_PHASES: DataEngineeringPhase[] = [
  {
    id: 'phase-1',
    number: 1,
    title: 'Architecture & Foundation: The Modern Data Lakehouse & Medallion Design',
    shortTitle: '1. Architecture & Lakehouse',
    tagline: 'Bronze, Silver & Gold Medallion Lakehouse Foundations',
    readTime: '30 min read',
    difficulty: 'Intermediate',
    tools: ['AWS S3', 'MinIO', 'Delta Lake', 'Apache Iceberg'],
    summary:
      'Master the architectural principles of modern data lakehouses. Understand how ACID transactions operate over object storage, design Medallion tier boundaries (Bronze, Silver, Gold), and avoid small-file partitioning traps.',
    learningObjectives: [
      'Compare Delta Lake, Apache Iceberg, and Apache Hudi table formats',
      'Implement Medallion storage partitions and Z-ordering strategies',
      'Configure MinIO / S3 object storage buckets with immutable retention policies',
    ],
  },
  {
    id: 'phase-2',
    number: 2,
    title: 'Data Ingestion: Streaming with Apache Kafka / Redpanda & Python Producers',
    shortTitle: '2. Streaming Ingestion (Kafka)',
    tagline: 'High-Throughput Streaming & Schema Validation',
    readTime: '35 min read',
    difficulty: 'Intermediate',
    tools: ['Apache Kafka', 'Redpanda', 'Python Confluent', 'Avro'],
    summary:
      'Build fault-tolerant ingestion pipelines. Configure high-throughput Kafka topics, partition by natural customer keys for ordered consumption, write idempotent Python producers, and manage Dead-Letter Queues (DLQ).',
    learningObjectives: [
      'Design Kafka topics with optimal partition counts and replication factors',
      'Write idempotent Python streaming producers with automatic retries',
      'Enforce JSON/Avro schemas and isolate malformed payloads into DLQs',
    ],
  },
  {
    id: 'phase-3',
    number: 3,
    title: 'Distributed Processing & SQL: PySpark Transformations & Watermarking',
    shortTitle: '3. PySpark & SQL Engine',
    tagline: 'Distributed Streaming Transformations & Late-Arriving Data',
    readTime: '40 min read',
    difficulty: 'Advanced',
    tools: ['Apache Spark', 'PySpark', 'Structured Streaming', 'Delta Engine'],
    summary:
      'Scale distributed transformations with PySpark. Execute streaming aggregations, configure watermarks to gracefully accommodate late mobile events, deduplicate records via window functions, and optimize Catalyst execution plans.',
    learningObjectives: [
      'Implement Structured Streaming joins and micro-batch writes to Delta Lake',
      'Configure watermarking to prevent streaming state memory leaks',
      'Deduplicate transaction events and cast temporal UTC timestamps',
    ],
  },
  {
    id: 'phase-4',
    number: 4,
    title: 'Data Modeling & Transformation with dbt: Modular SQL & Star Schemas',
    shortTitle: '4. dbt & Star Schema Modeling',
    tagline: 'Analytics Engineering, Kimball Star Schema & Incremental Builds',
    readTime: '42 min read',
    difficulty: 'Production-Ready',
    tools: ['dbt Core', 'Snowflake', 'BigQuery', 'PostgreSQL'],
    summary:
      'Bring software engineering rigor to SQL pipelines with dbt. Model a Kimball Star Schema with central fact tables and conformed dimensions, implement surrogate key hashing, write incremental models, and automate schema tests.',
    learningObjectives: [
      'Model an e-commerce Star Schema (Fact Transactions & Dimensions)',
      'Author high-performance incremental dbt models using merge strategies',
      'Write singular and generic dbt tests for non-nullness and referential integrity',
    ],
  },
  {
    id: 'phase-5',
    number: 5,
    title: 'Workflow Orchestration: Apache Airflow DAGs, Sensor Tasks & Alert Loops',
    shortTitle: '5. Airflow Workflow Orchestration',
    tagline: 'Dynamic DAGs, Failure Alert Loops & Backfilling',
    readTime: '38 min read',
    difficulty: 'Advanced',
    tools: ['Apache Airflow', 'DockerOperator', 'Slack Webhooks', 'PagerDuty'],
    summary:
      'Orchestrate complex data workflows with Apache Airflow. Build dynamic DAGs, coordinate sensor tasks, handle historical backfills, enforce exponential retry backoff, and automate Slack/PagerDuty emergency alerts on pipeline failure.',
    learningObjectives: [
      'Write production-grade Airflow DAGs with DockerOperator and BashOperator',
      'Configure exponential retry policies and automated failure callbacks',
      'Orchestrate end-to-end dependencies from Bronze ingestion to Gold BI reporting',
    ],
  },
  {
    id: 'phase-6',
    number: 6,
    title: 'Data Quality & CI/CD: Automated Profiling, Dockerization & Drift Monitoring',
    shortTitle: '6. Data Quality & CI/CD',
    tagline: 'Soda Core Contracts, Docker Compose & Data Drift Detection',
    readTime: '36 min read',
    difficulty: 'Production-Ready',
    tools: ['Soda Core', 'Great Expectations', 'Docker Compose', 'GitHub Actions'],
    summary:
      'Deploy enterprise data platforms with automated quality gates. Author declarative Soda Core quality contracts, spin up the entire Modern Data Stack with Docker Compose, and detect statistical data distribution drift.',
    learningObjectives: [
      'Write Soda Core checks.yml quality contracts with automated circuit breakers',
      'Containerize Kafka, MinIO, Postgres, and Airflow using Docker Compose',
      'Implement statistical Kolmogorov-Smirnov (KS) tests for data drift monitoring',
    ],
  },
];
