import React from 'react';
import { DataEngineeringCallout } from '../DataEngineeringCallout.tsx';
import { CodeBlock } from '../../common/CodeBlock.tsx';
import { DataEngineeringERDiagram } from '../diagrams/DataEngineeringERDiagram.tsx';
import { AirflowDAGDiagram } from '../diagrams/AirflowDAGDiagram.tsx';

/* =========================================================================
   PHASE 4: Data Modeling & Transformation with dbt & SQL
   ========================================================================= */
export const Phase4Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-300">
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2">
          <span>Milestone 04</span>
          <span>•</span>
          <span>Analytics Engineering & dbt Core</span>
          <span>•</span>
          <span className="text-emerald-400">Production-Ready</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Data Modeling & Transformation with dbt: Modular SQL & Star Schemas
        </h1>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          Bring software engineering rigor to SQL pipelines. Master dbt (data build tool), author staging layers, construct
          Kimball Star Schema dimensional models, implement incremental MERGE strategies, and test schema contracts.
        </p>
      </div>

      {/* 1. Star Schema ER Diagram */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          1. Gold Mart Dimensional Architecture (Star Schema)
        </h2>
        <p className="text-sm leading-relaxed">
          In high-performance data warehousing (Snowflake, BigQuery, PostgreSQL), queries execute fastest when transactions
          are organized around a central Fact table flanked by conformed Dimension tables:
        </p>

        <DataEngineeringERDiagram />
      </section>

      {/* 2. dbt Incremental Model */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          2. Production dbt Incremental Model with Surrogate Hashing
        </h2>
        <p className="text-sm leading-relaxed">
          Rebuilding billion-row tables from scratch daily burns through compute credits. Use dbt's{' '}
          <code>incremental</code> materialization with a 3-day lookback buffer to capture late updates efficiently:
        </p>

        <CodeBlock
          language="sql"
          code={`-- models/marts/core/fct_ecommerce_transactions.sql
{{
  config(
    materialized = 'incremental',
    unique_key = 'transaction_sk',
    incremental_strategy = 'merge',
    cluster_by = ['order_date', 'customer_sk']
  )
}}

WITH silver_orders AS (
  SELECT * FROM {{ ref('stg_silver_orders') }}
  {% if is_incremental() %}
    -- Look back 3 days to capture late mutations and refunds
    WHERE event_timestamp >= (SELECT MAX(order_timestamp) - INTERVAL '3 days' FROM {{ this }})
  {% endif %}
),
dim_customers AS (
  SELECT customer_sk, natural_customer_id, country_code 
  FROM {{ ref('dim_customers') }}
  WHERE is_current_flag = TRUE
),
dim_products AS (
  SELECT product_sk, product_sku, base_unit_cost 
  FROM {{ ref('dim_products') }}
)
SELECT 
  -- Deterministic surrogate key hashing
  {{ dbt_utils.generate_surrogate_key(['o.order_id', 'o.customer_id']) }} AS transaction_sk,
  o.order_id,
  c.customer_sk,
  p.product_sk,
  CAST(TO_CHAR(o.event_timestamp, 'YYYYMMDD') AS INTEGER) AS date_sk,
  o.quantity,
  o.unit_price,
  o.total_amount,
  (o.total_amount - (p.base_unit_cost * o.quantity)) AS estimated_gross_margin,
  o.event_timestamp AS order_timestamp,
  o.is_fraud_flagged,
  CURRENT_TIMESTAMP AS dbt_updated_at
FROM silver_orders o
LEFT JOIN dim_customers c ON o.customer_id = c.natural_customer_id
LEFT JOIN dim_products p ON o.product_sku = p.product_sku;`}
        />

        <DataEngineeringCallout type="interview-tip" title="Interview Question: SCD Type 1 vs Type 2 in dbt">
          <strong>Question:</strong> "How do you handle slowly changing dimensions (SCD) in dbt when a customer updates their address?"
          <br />
          <strong>Answer:</strong> "In dbt, we use <code>dbt snapshot</code> blocks. By defining a strategy like{' '}
          <code>check</code> or <code>timestamp</code> with <code>check_cols: ['address', 'segment']</code>, dbt
          automatically tracks row history by generating <code>dbt_valid_from</code> and <code>dbt_valid_to</code> timestamps
          and setting historical rows to inactive (SCD Type 2)."
        </DataEngineeringCallout>
      </section>
    </div>
  );
};

/* =========================================================================
   PHASE 5: Workflow Orchestration with Apache Airflow
   ========================================================================= */
export const Phase5Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-300">
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2">
          <span>Milestone 05</span>
          <span>•</span>
          <span>Enterprise Workflow Orchestration</span>
          <span>•</span>
          <span className="text-amber-400">Advanced Pipeline</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Workflow Orchestration: Apache Airflow DAGs, Sensor Tasks & Alert Loops
        </h1>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          Orchestrate multi-step heterogeneous pipelines with Airflow. Write dynamic DAGs, handle backfilling, configure
          exponential retry backoff, and automate Slack/PagerDuty incident webhooks when data quality contracts fail.
        </p>
      </div>

      {/* 1. DAG Graph Visual */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          1. Airflow Production DAG Dependency Graph
        </h2>
        <p className="text-sm leading-relaxed">
          Inspect the task execution tree and automated failure circuit loop:
        </p>

        <AirflowDAGDiagram />
      </section>

      {/* 2. Production Airflow DAG Code */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          2. Complete Production Airflow Python DAG Implementation
        </h2>
        <p className="text-sm leading-relaxed">
          Notice the inclusion of <code>on_failure_callback</code>, retry exponential delays, and strict execution SLAs:
        </p>

        <CodeBlock
          language="python"
          code={`from datetime import datetime, timedelta
import requests
from airflow import DAG
from airflow.operators.bash import BashOperator
from airflow.operators.python import PythonOperator
from airflow.providers.docker.operators.docker import DockerOperator

def alert_slack_failure(context):
    """Dispatches emergency webhook alert to Slack channel on pipeline failure"""
    task_instance = context.get('task_instance')
    msg = f":rotating_light: *DAG FAILED*: {task_instance.dag_id} | Task: {task_instance.task_id} | Execution Time: {context.get('execution_date')}"
    # requests.post("https://hooks.slack.com/services/T00/B00/X00", json={"text": msg})

default_args = {
    'owner': 'data_platform',
    'depends_on_past': False,
    'email_on_failure': True,
    'retries': 3,
    'retry_delay': timedelta(minutes=5),
    'retry_exponential_backoff': True,
    'on_failure_callback': alert_slack_failure,
    'execution_timeout': timedelta(minutes=45)
}

with DAG(
    dag_id='ecom_hourly_medallion_pipeline_v2',
    default_args=default_args,
    description='End-to-end lakehouse orchestration: S3 Bronze -> Spark Silver -> dbt Gold',
    schedule_interval='5 * * * *',           # 5 minutes past every hour
    start_date=datetime(2026, 1, 1),
    catchup=False,                            # Prevent accidental runaway historical backfill
    max_active_runs=1,
    tags=['production', 'lakehouse', 'ecommerce']
) as dag:

    # 1. Check Bronze Stream Partitions
    validate_bronze = BashOperator(
        task_id='validate_bronze_checksum',
        bash_command='python /opt/airflow/dags/scripts/validate_s3_bronze.py --hour {{ ds_nodash }}'
    )

    # 2. PySpark Silver Distributed Curation
    spark_silver = DockerOperator(
        task_id='pyspark_silver_curation',
        image='codingthunder/spark-curator:latest',
        command='spark-submit --master local[*] /app/curate_silver.py',
        docker_url='unix://var/run/docker.sock',
        network_mode='bridge'
    )

    # 3. dbt Gold Mart Incremental Build
    dbt_run = BashOperator(
        task_id='dbt_run_gold_models',
        bash_command='cd /opt/airflow/dbt && dbt build --select marts.core'
    )

    # 4. Data Quality Gate (Soda / Great Expectations)
    quality_gate = BashOperator(
        task_id='soda_data_quality_gate',
        bash_command='soda scan -d snowflake /opt/airflow/soda/checks.yml'
    )

    # Dependency Pipeline Flow
    validate_bronze >> spark_silver >> dbt_run >> quality_gate`}
        />
      </section>
    </div>
  );
};

/* =========================================================================
   PHASE 6: Data Quality, CI/CD & Docker Infrastructure
   ========================================================================= */
export const Phase6Content: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-300">
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2">
          <span>Milestone 06</span>
          <span>•</span>
          <span>Data Quality & CI/CD Production Hardening</span>
          <span>•</span>
          <span className="text-emerald-400">Industry-Ready</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Data Quality & CI/CD: Automated Profiling, Dockerization & Drift Monitoring
        </h1>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          Deploy production data systems with automated quality gates. Define Soda Core / Great Expectations contracts,
          containerize with Docker Compose, build GitHub Actions test harnesses, and detect data distribution drift.
        </p>
      </div>

      {/* 1. Soda Core Quality Contract */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          1. Declarative Data Quality Contracts (Soda Core checks.yml)
        </h2>
        <p className="text-sm leading-relaxed">
          Prevent silent bad data from contaminating downstream analytics using declarative quality contracts:
        </p>

        <CodeBlock
          language="yaml"
          code={`# /opt/soda/checks/fact_ecommerce_transactions.yml
checks for fact_ecommerce_transactions:
  # Primary Key Integrity
  - duplicate_count(transaction_sk) = 0:
      name: "Assert zero duplicate surrogate primary keys"
  - missing_count(transaction_sk) = 0:
      name: "Assert non-null surrogate keys"

  # Financial Validity Rules
  - min(total_amount) >= 0.0:
      name: "Reject negative order totals"
  - max(total_amount) <= 100000.0:
      name: "Flag anomalous single orders exceeding $100K threshold"

  # Freshness SLA Check
  - freshness(order_timestamp) < 2h:
      name: "Alert if latest ingested transaction is older than 2 hours"

  # Schema Anomaly Detection
  - schema:
      name: "Enforce strict schema parity"
      warn:
        when required column missing: [transaction_sk, customer_sk, total_amount]
        when wrong type format:
          total_amount: numeric`}
        />
      </section>

      {/* 2. Docker Compose Infrastructure */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          2. Complete Docker Compose Stack: Modern Data Stack
        </h2>
        <p className="text-sm leading-relaxed">
          Spin up the complete local lakehouse ecosystem (Kafka, MinIO S3, Postgres, Airflow, and dbt) with a single command:
        </p>

        <CodeBlock
          language="yaml"
          code={`# docker-compose.yml - Complete Modern Data Stack Sandbox
version: '3.8'

services:
  # Streaming Ingestion Broker
  redpanda:
    image: docker.redpanda.com/redpandadata/redpanda:v23.2.14
    container_name: redpanda_streaming
    command:
      - redpanda start
      - --kafka-addr internal://0.0.0.0:9092,external://0.0.0.0:19092
      - --advertise-kafka-addr internal://redpanda:9092,external://localhost:19092
    ports:
      - "19092:19092"
      - "9644:9644"

  # S3 Object Storage Emulation
  minio:
    image: minio/minio:RELEASE.2023-10-25T06-33-25Z
    container_name: minio_s3_lakehouse
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: miniopassword
    command: server /data --console-address ":9001"
    ports:
      - "9000:9000"
      - "9001:9001"

  # Analytical Warehouse Database
  postgres_dw:
    image: postgres:15-alpine
    container_name: postgres_gold_warehouse
    environment:
      POSTGRES_DB: warehouse
      POSTGRES_USER: dbt_user
      POSTGRES_PASSWORD: dbt_password
    ports:
      - "5432:5432"

  # Workflow Orchestrator
  airflow-webserver:
    image: apache/airflow:2.7.2-python3.10
    container_name: airflow_scheduler
    environment:
      - AIRFLOW__CORE__EXECUTOR=LocalExecutor
      - AIRFLOW__CORE__SQL_ALCHEMY_CONN=postgresql+psycopg2://dbt_user:dbt_password@postgres_dw:5432/warehouse
    ports:
      - "8080:8080"
    depends_on:
      - postgres_dw`}
        />

        <DataEngineeringCallout type="production-caveat" title="Data Drift Detection in Production ML/BI">
          When customer purchasing habits shift (e.g. during Black Friday), the underlying distribution of{' '}
          <code>total_amount</code> changes. Use the Kolmogorov-Smirnov (KS) two-sample test in your weekly Airflow pipeline
          to detect when your feature store drifts from historical baseline!
        </DataEngineeringCallout>
      </section>
    </div>
  );
};
