import React, { useState } from 'react';
import { GitCommit, Bell, RotateCcw, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

export const AirflowDAGDiagram: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<string>('dbt_run');

  const tasks = [
    {
      id: 'sensor_kafka',
      name: 'sensor_kafka_stream',
      operator: 'DateTimeSensorAsync',
      status: 'success',
      duration: '4.2s',
      description: 'Verifies Kafka topic partitions have consumed expected hourly watermark payloads before downstream scheduling.',
    },
    {
      id: 'extract_api',
      name: 'extract_batch_rest_api',
      operator: 'PythonOperator',
      status: 'success',
      duration: '18.6s',
      description: 'Ingests external currency conversion FX rates and payment provider dispute logs into S3 Bronze landing zone.',
    },
    {
      id: 'spark_silver',
      name: 'pyspark_silver_curation',
      operator: 'SparkSubmitOperator',
      status: 'success',
      duration: '4m 12s',
      description: 'Distributed PySpark job on EMR/Docker cluster: deduplicates order_id, casts UTC timestamps, and joins customer dimensions.',
    },
    {
      id: 'dbt_run',
      name: 'dbt_run_gold_models',
      operator: 'BashOperator (dbt build)',
      status: 'success',
      duration: '1m 45s',
      description: 'Executes incremental dbt models compiling Star Schema fact and dimensional tables in Snowflake / BigQuery.',
    },
    {
      id: 'soda_gate',
      name: 'soda_data_quality_gate',
      operator: 'SodaCheckOperator',
      status: 'success',
      duration: '22.1s',
      description: 'Strict circuit breaker: verifies zero NULLs in primary keys, fresh date boundaries, and valid non-negative revenue bounds.',
    },
    {
      id: 'publish_bi',
      name: 'publish_metabase_cache',
      operator: 'SimpleHttpOperator',
      status: 'success',
      duration: '5.8s',
      description: 'Invalidates and warms Redis/Metabase semantic layer caches for executive business intelligence reporting.',
    },
  ];

  const current = tasks.find((t) => t.id === selectedTask) || tasks[3];

  return (
    <div className="my-8 rounded-2xl border border-slate-800 bg-[#0a0f1d] p-6 shadow-2xl overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-slate-800/80 gap-3">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-purple-400 font-semibold bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/50">
            Workflow Orchestration
          </span>
          <h3 className="text-lg font-bold text-white mt-1">
            Apache Airflow DAG Graph & Automated Failure Alert Loop
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="text-emerald-400 font-bold">● DAG: ecom_hourly_medallion_v2</span>
          <span>(Hourly @ 00:05 UTC)</span>
        </div>
      </div>

      {/* DAG Visual Task Flow Pipeline */}
      <div className="py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {tasks.map((task, idx) => {
            const isSelected = selectedTask === task.id;
            return (
              <button
                key={task.id}
                onClick={() => setSelectedTask(task.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-purple-400 bg-purple-950/20 shadow-lg shadow-purple-500/10 scale-105'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono text-slate-500">Task 0{idx + 1}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className="text-xs font-mono font-bold text-white leading-snug line-clamp-1">
                    {task.name}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="text-cyan-300 truncate max-w-[70px]">{task.operator.split(' ')[0]}</span>
                  <span>{task.duration}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Task Inspector & Failure Alert Circuit Loop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-2">
        {/* Task Details */}
        <div className="lg:col-span-7 p-4 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-purple-300 font-bold">{current.name}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30">
              {current.operator}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">{current.description}</p>
          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
            <span>Execution SLA: {current.duration}</span>
            <span>•</span>
            <span className="text-emerald-400">Status: State.SUCCESS</span>
          </div>
        </div>

        {/* Failure Loop & SQS / PagerDuty Alert Loop */}
        <div className="lg:col-span-5 p-4 rounded-xl border border-rose-500/30 bg-rose-950/10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-300">
            <Bell className="w-3.5 h-3.5 text-rose-400" />
            <span>Automated Failure Alert Circuit</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            On task failure, Airflow triggers exponential retry policy (<code className="text-rose-300">retries: 3</code>, factor 2.0). If all retries fail:
          </p>
          <div className="text-[10px] font-mono text-slate-400 space-y-1 pt-1 border-t border-slate-800">
            <div>1. <span className="text-rose-300">PagerDuty Sev-1 Incident:</span> Triggered with task log URI</div>
            <div>2. <span className="text-amber-300">Slack Webhook:</span> Broadcasts to <code className="text-amber-200">#data-ops-alerts</code></div>
            <div>3. <span className="text-cyan-300">Circuit Breaker:</span> Halts downstream Gold Mart publishing</div>
          </div>
        </div>
      </div>
    </div>
  );
};
