import { BlogPost } from '../types/blog.ts';

export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post_colab_predictive_01',
    title: 'Building Predictive Models in Google Colab: An End-to-End Random Forest Guide with BigQuery',
    slug: 'building-predictive-models-in-google-colab-random-forest-bigquery',
    excerpt: 'Learn how to query petabyte-scale data directly from Google BigQuery into a GPU-accelerated Google Colab runtime, engineer robust features, and train production-grade Random Forest classifiers with scikit-learn.',
    featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80',
    authorId: 'usr_owner_default',
    authorName: 'Shashwat Mishra',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=mishrashashwat90@gmail.com',
    authorRole: 'Lead Data Architect',
    authorBio: 'Specializes in distributed data pipelines, cloud analytics warehousing, and Trust & Safety engineering at scale.',
    category: 'Google Colab',
    tags: ['Google Colab', 'Machine Learning', 'BigQuery', 'Python', 'Data Analytics'],
    status: 'published',
    readTime: '9 min read',
    views: 4820,
    featured: true,
    seoDescription: 'Step-by-step master tutorial on connecting Google BigQuery to Google Colab, executing distributed SQL queries, building feature pipelines, and deploying Random Forest machine learning models.',
    createdAt: '2026-04-12T10:00:00.000Z',
    updatedAt: '2026-04-12T10:00:00.000Z',
    content: `
<h2>1. Introduction: Modern Cloud-Native Machine Learning</h2>
<p>Modern machine learning workflows frequently suffer from a persistent friction point: data scientists download millions of rows of CSV data to underpowered local laptops, running out of memory before feature normalization even finishes. By pairing <strong>Google BigQuery</strong> (Google Cloud's serverless, highly scalable multi-cloud data warehouse) with <strong>Google Colab</strong> (hosted Jupyter notebook environment with free GPU and TPU accelerators), you shift heavy aggregation compute to the cloud and keep local development lightning fast.</p>

<p>In this comprehensive guide, we will build an end-to-end churn and transaction prediction model using real-world e-commerce telemetry. We will connect securely via Cloud SDK service account tokens, pull aggregated features with zero egress lag, train a tuned Random Forest ensemble, and generate actionable feature importance charts.</p>

<blockquote>
  <strong>Production Architecture Rule:</strong> Never pull raw, unaggregated transactional tables across network boundaries into notebook memory. Always leverage BigQuery's columnar execution engine to filter, join, and bucket rows down to the exact entity-grain training dataset before passing data to Pandas!
</blockquote>

<h2>2. Authenticating Google Colab with BigQuery</h2>
<p>Google Colab provides native integration with Google Cloud Platform. The <code>google.colab.auth</code> module securely exchanges temporary OAuth2 tokens without baking credentials into version control.</p>

<pre><code class="language-python"># Step 1: Authenticate Google Colab Environment
from google.colab import auth
from google.cloud import bigquery
import pandas as pd
import numpy as np

# Authenticate current notebook user
auth.authenticate_user()
print("Successfully authenticated with Google Cloud Platform!")

# Initialize BigQuery Client with your active GCP Project
PROJECT_ID = "codingthunder-analytics-prod"
client = bigquery.Client(project=PROJECT_ID)
</code></pre>

<p>Once authenticated, we author an analytical SQL statement that leverages BigQuery window functions to aggregate user purchase behavior over a rolling 30-day window:</p>

<pre><code class="language-sql">-- Step 2: Feature Extraction Query in Google BigQuery
WITH user_features AS (
  SELECT 
    user_id,
    COUNT(transaction_id) AS total_orders_30d,
    SUM(amount) AS total_revenue_30d,
    AVG(amount) AS avg_order_value_30d,
    MAX(timestamp) AS last_purchase_timestamp,
    TIMESTAMP_DIFF(CURRENT_TIMESTAMP(), MAX(timestamp), DAY) AS days_since_last_order,
    COUNT(DISTINCT payment_method) AS unique_payment_methods,
    SUM(CASE WHEN status = 'DECLINED' THEN 1 ELSE 0 END) AS failed_payment_attempts
  FROM \`codingthunder-analytics-prod.ecommerce.fact_transactions\`
  WHERE timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 90 DAY)
  GROUP BY user_id
)
SELECT 
  user_id,
  total_orders_30d,
  total_revenue_30d,
  avg_order_value_30d,
  days_since_last_order,
  unique_payment_methods,
  failed_payment_attempts,
  CASE WHEN days_since_last_order > 30 THEN 1 ELSE 0 END AS is_churned
FROM user_features;
</code></pre>

<h2>3. Ingesting Results into Pandas and Data Cleansing</h2>
<p>BigQuery allows streaming tabular results directly into memory via the high-performance BigQuery Storage API (<code>to_dataframe()</code>), which is up to 10x faster than traditional REST cursor iteration.</p>

<pre><code class="language-python"># Execute query and load into Pandas DataFrame
query = """
  -- [Insert the SQL CTE above]
"""
df = client.query(query).to_dataframe()

print(f"Dataset shape: {df.shape[0]} rows, {df.shape[1]} columns")
print(df.head(5))

# Inspect missing values across engineered columns
null_counts = df.isnull().sum()
print("Missing values summary:\n", null_counts[null_counts > 0])

# Impute zero for users with no failed payment records
df['failed_payment_attempts'] = df['failed_payment_attempts'].fillna(0)
df['avg_order_value_30d'] = df['avg_order_value_30d'].fillna(df['total_revenue_30d'] / df['total_orders_30d'].replace(0, 1))
</code></pre>

<h2>4. Training a Tuned Random Forest Classifier</h2>
<p>We split our dataset into 80% training and 20% holdout validation sets using stratified sampling to preserve the positive class ratio (churners vs. retained users).</p>

<pre><code class="language-python">from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score, confusion_matrix

# Separate feature matrix (X) and target vector (y)
feature_cols = [
    'total_orders_30d',
    'total_revenue_30d',
    'avg_order_value_30d',
    'days_since_last_order',
    'unique_payment_methods',
    'failed_payment_attempts'
]
X = df[feature_cols]
y = df['is_churned']

# Stratified Train/Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, random_state=42, stratify=y
)

# Instantiate Random Forest with parallelized CPU workers
rf_model = RandomForestClassifier(
    n_estimators=250,
    max_depth=12,
    min_samples_split=8,
    min_samples_leaf=4,
    random_state=42,
    n_jobs=-1,
    class_weight='balanced'
)

rf_model.fit(X_train, y_train)

# Generate probabilistic predictions
y_pred = rf_model.predict(X_test)
y_prob = rf_model.predict_proba(X_test)[:, 1]

print("=== Classification Evaluation Report ===")
print(classification_report(y_test, y_pred))
print(f"ROC-AUC Score: {roc_auc_score(y_test, y_prob):.4f}")
</code></pre>

<h2>5. Extracting Feature Importance for Business Impact</h2>
<p>An algorithm is only as useful as the operational clarity it delivers to stakeholders. We compute Gini impurity feature importances to identify which behavioral metrics drive customer retention:</p>

<pre><code class="language-python">import matplotlib.pyplot as plt

# Extract and sort feature importances
importances = rf_model.feature_importances_
indices = np.argsort(importances)[::-1]

# Display ranked drivers of churn
print("Ranked Feature Drivers:")
for idx in indices:
    print(f"- {feature_cols[idx]}: {importances[idx] * 100:.2f}% contribution")
</code></pre>

<p>In our model, <code>days_since_last_order</code> accounted for 42.1% of predictive power, while <code>failed_payment_attempts</code> accounted for 24.8%. This proved to the executive team that payment gateway checkout friction was an unexpectedly massive driver of preventable subscriber attrition!</p>

<h2>6. Summary & Best Practices</h2>
<ul>
  <li><strong>Query Optimization:</strong> Never run <code>SELECT *</code> against BigQuery tables; always specify exact columns to minimize billed byte scans.</li>
  <li><strong>Reproducibility:</strong> Fix random seeds across <code>train_test_split</code> and model initializers to ensure deterministic notebook re-runs.</li>
  <li><strong>Serialization:</strong> Save your trained model artifact using <code>joblib.dump(rf_model, 'churn_rf_v1.joblib')</code> and upload directly to Google Cloud Storage (GCS) buckets for production serving.</li>
</ul>
`
  },
  {
    id: 'post_looker_studio_02',
    title: 'Visualizing BigQuery Data with Looker Studio: High-Performance Caching and Custom Calculated Fields',
    slug: 'visualizing-bigquery-data-with-looker-studio-caching-calculated-fields',
    excerpt: 'Transform raw data warehouse tables into interactive, responsive executive BI dashboards. Master BigQuery BI Engine acceleration, custom CASE WHEN formulas, and cross-source blending in Looker Studio.',
    featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80',
    authorId: 'usr_owner_default',
    authorName: 'Shashwat Mishra',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=mishrashashwat90@gmail.com',
    authorRole: 'Lead Data Architect',
    authorBio: 'Specializes in distributed data pipelines, cloud analytics warehousing, and Trust & Safety engineering at scale.',
    category: 'Looker Studio',
    tags: ['Looker Studio', 'BigQuery', 'BI Dashboards', 'Data Analytics', 'SQL'],
    status: 'published',
    readTime: '8 min read',
    views: 3950,
    featured: true,
    seoDescription: 'Complete tutorial on connecting Google BigQuery to Looker Studio with sub-second query latency, configuring BI Engine in-memory caching, and authoring complex calculated fields.',
    createdAt: '2026-04-10T14:30:00.000Z',
    updatedAt: '2026-04-10T14:30:00.000Z',
    content: `
<h2>1. Why Looker Studio + BigQuery is the Modern BI Standard</h2>
<p>Google Looker Studio (formerly Google Data Studio) has rapidly evolved from a lightweight reporting gadget into a full-fledged enterprise business intelligence front-end. When paired with Google BigQuery, it provides zero-maintenance, serverless reporting that can visualize terabytes of data without requiring heavy desktop installations.</p>

<p>However, many teams encounter two common pitfalls when connecting Looker Studio directly to BigQuery:</p>
<ol>
  <li><strong>Sluggish Visual Render Latency:</strong> Waiting 8 to 15 seconds every time a dropdown filter is clicked.</li>
  <li><strong>Runaway Query Invoicing:</strong> Incurring massive scanning bills because unfiltered visual widgets trigger full-table scans.</li>
</ol>

<p>In this tutorial, we will establish high-speed performance architecture using <strong>BigQuery BI Engine</strong>, configure pre-aggregated views, and author advanced <strong>Calculated Fields</strong> that eliminate spreadsheet export gymnastics.</p>

<h2>2. Enabling BigQuery BI Engine for Sub-Second In-Memory Caching</h2>
<p>BigQuery BI Engine is a built-in in-memory analysis service. It transparently accelerates queries from Looker Studio by caching frequently scanned table partitions into RAM.</p>

<blockquote>
  <strong>Configuration Pro-Tip:</strong> In the Google Cloud Console, navigate to <em>BigQuery ➔ BI Engine Management</em> and reserve 2 GB to 10 GB of memory in your analytics dataset region. Looker Studio dashboards bound to these tables will instantly accelerate from 6,000ms latency down to sub-150ms!
</blockquote>

<pre><code class="language-sql">-- Verify that your target analytical table is partitioned by DATE
CREATE OR REPLACE TABLE \`codingthunder-analytics-prod.reporting.daily_executive_metrics\`
PARTITION BY report_date
CLUSTER BY country_code, customer_tier AS
SELECT 
  DATE(timestamp) AS report_date,
  country_code,
  customer_tier,
  COUNT(DISTINCT user_id) AS active_subscribers,
  SUM(amount) AS total_gross_revenue,
  AVG(amount) AS average_order_value,
  SUM(CASE WHEN risk_score > 0.85 THEN 1 ELSE 0 END) AS flagged_fraud_alerts
FROM \`codingthunder-analytics-prod.ecommerce.fact_transactions\`
GROUP BY 1, 2, 3;
</code></pre>

<h2>3. Authoring Dynamic Calculated Fields in Looker Studio</h2>
<p>Rather than continually altering database schemas whenever product managers request a new ratio, Looker Studio allows you to create <strong>Calculated Fields</strong> directly inside the data source schema.</p>

<h3>Formula 1: Subscriber Risk Tier Classification</h3>
<pre><code class="language-sql">CASE 
  WHEN flagged_fraud_alerts / active_subscribers >= 0.05 THEN "HIGH RISK (Investigate)"
  WHEN flagged_fraud_alerts / active_subscribers >= 0.02 THEN "ELEVATED (Monitor)"
  ELSE "NORMAL HEALTH"
END
</code></pre>

<h3>Formula 2: Revenue Delta vs. Monthly Target</h3>
<pre><code class="language-sql">(SUM(total_gross_revenue) - 500000) / 500000
</code></pre>

<h2>4. Best Practices for Executive Dashboard UX</h2>
<ul>
  <li><strong>The 5-Second Rule:</strong> Key performance indicators (MRR, Active Users, Dispute Rate) must be pinned along the top header in bold, clean Scorecard cards.</li>
  <li><strong>Default Date Filter Controls:</strong> Always provide a default temporal boundary (e.g., <em>Last 28 Days</em>) to prevent unintentional scanning of legacy historical data.</li>
  <li><strong>Cross-Filtering Interactions:</strong> Enable chart cross-filtering so clicking a country bar in the bar chart instantly slices the time-series trend line.</li>
</ul>
`
  },
  {
    id: 'post_cdc_kafka_03',
    title: 'Orchestrating Real-Time CDC Pipelines: Streaming PostgreSQL to Snowflake via Kafka Connect',
    slug: 'orchestrating-real-time-cdc-pipelines-postgresql-snowflake-kafka',
    excerpt: 'Step-by-step architectural breakdown of Change Data Capture (CDC). Capture write-ahead log (WAL) events in PostgreSQL with Debezium, stream to Apache Kafka, and load into Snowflake with Snowpipe Streaming.',
    featuredImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=80',
    authorId: 'usr_owner_default',
    authorName: 'Shashwat Mishra',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=mishrashashwat90@gmail.com',
    authorRole: 'Lead Data Architect',
    authorBio: 'Specializes in distributed data pipelines, cloud analytics warehousing, and Trust & Safety engineering at scale.',
    category: 'Data Engineering',
    tags: ['Data Engineering', 'Kafka', 'PostgreSQL', 'Snowflake', 'Streaming'],
    status: 'published',
    readTime: '11 min read',
    views: 5210,
    featured: false,
    seoDescription: 'Master modern Change Data Capture (CDC) streaming architecture. Connect PostgreSQL WAL logs to Apache Kafka with Debezium, serialize with Avro, and stream into Snowflake.',
    createdAt: '2026-04-08T09:15:00.000Z',
    updatedAt: '2026-04-08T09:15:00.000Z',
    content: `
<h2>1. The Demise of Midnight Batch ETL</h2>
<p>Traditional nightly batch ETL jobs are no longer sufficient for modern real-time businesses. If an automated credit card fraud ring strikes at 2:00 PM, waiting until midnight's scheduled SQL extraction guarantees catastrophic financial exposure. <strong>Change Data Capture (CDC)</strong> reads row-level mutations directly from the database's Write-Ahead Log (WAL), streaming INSERT, UPDATE, and DELETE events in near-real-time to event buses with sub-second latency.</p>

<h2>2. Configuring PostgreSQL Logical Decoding & Replication Slots</h2>
<p>PostgreSQL natively writes every transaction to its WAL before persisting blocks to disk. We configure the <code>wal_level</code> parameter to <code>logical</code> to enable external consumers like Debezium:</p>

<pre><code class="language-sql">-- Enable logical replication in postgresql.conf
ALTER SYSTEM SET wal_level = 'logical';
ALTER SYSTEM SET max_replication_slots = 10;
ALTER SYSTEM SET max_wal_senders = 10;

-- Create dedicated replication user with minimal privileges
CREATE USER cdc_replicator WITH REPLICATION ENCRYPTED PASSWORD 'ThunderSecret2026!';
GRANT SELECT ON ALL TABLES IN SCHEMA public TO cdc_replicator;

-- Create publication for targeted transactional tables
CREATE PUBLICATION cdc_publication FOR TABLE public.fact_transactions, public.dim_users;
</code></pre>

<h2>3. Debezium Kafka Connect Source Configuration</h2>
<pre><code class="language-json">{
  "name": "postgres-cdc-source",
  "config": {
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
    "tasks.max": "1",
    "plugin.name": "pgoutput",
    "database.hostname": "postgres.internal.net",
    "database.port": "5432",
    "database.user": "cdc_replicator",
    "database.password": "ThunderSecret2026!",
    "database.dbname": "production_ledger",
    "database.server.name": "pg_cluster_prod",
    "table.include.list": "public.fact_transactions,public.dim_users",
    "publication.name": "cdc_publication"
  }
}
</code></pre>
`
  },
  {
    id: 'post_anomaly_iqr_04',
    title: 'Automated Anomaly Detection in Financial Time Series: Using Python, IQR Fences, and Isolation Forests',
    slug: 'automated-anomaly-detection-financial-time-series-python-iqr-isolation-forest',
    excerpt: 'Detect anomalous transactional spikes and bot velocities using hybrid statistical and unsupervised machine learning methods in Python. Full code for mathematical IQR fences and scikit-learn Isolation Forests.',
    featuredImage: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1400&q=80',
    authorId: 'usr_owner_default',
    authorName: 'Shashwat Mishra',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=mishrashashwat90@gmail.com',
    authorRole: 'Lead Data Architect',
    authorBio: 'Specializes in distributed data pipelines, cloud analytics warehousing, and Trust & Safety engineering at scale.',
    category: 'Data Analytics',
    tags: ['Python', 'Anomaly Detection', 'Time Series', 'Fraud Detection', 'Data Analytics'],
    status: 'published',
    readTime: '10 min read',
    views: 4190,
    featured: false,
    seoDescription: 'Production tutorial on implementing automated financial anomaly detection with Python using Interquartile Range (IQR) fences and scikit-learn Isolation Forests.',
    createdAt: '2026-04-05T16:20:00.000Z',
    updatedAt: '2026-04-05T16:20:00.000Z',
    content: `
<h2>1. Mathematical Foundation of Statistical Fences</h2>
<p>When monitoring high-frequency payment gateways, relying purely on static dollar thresholds ($500 limit) fails. A $500 transaction might be completely normal for a B2B enterprise tier, yet an extreme anomaly for a micro-creator subscriber. We combine parametric statistical thresholds with non-parametric unsupervised machine learning to isolate malicious behavior with minimal false positives.</p>

<pre><code class="language-python">import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest

def calculate_rolling_iqr_anomalies(df: pd.DataFrame, value_col: str, window_hours: int = 24):
    """
    Computes rolling IQR bounds and identifies statistical outliers.
    """
    df = df.sort_values(by='timestamp').copy()
    
    # Calculate rolling Q1 (25th percentile) and Q3 (75th percentile)
    rolling_q1 = df[value_col].rolling(f'{window_hours}h', on='timestamp').quantile(0.25)
    rolling_q3 = df[value_col].rolling(f'{window_hours}h', on='timestamp').quantile(0.75)
    rolling_iqr = rolling_q3 - rolling_q1
    
    upper_fence = rolling_q3 + (1.5 * rolling_iqr)
    lower_fence = np.maximum(0, rolling_q1 - (1.5 * rolling_iqr))
    
    df['is_iqr_outlier'] = (df[value_col] > upper_fence) | (df[value_col] < lower_fence)
    return df
</code></pre>
`
  },
  {
    id: 'post_dbt_snowflake_05',
    title: "The Modern Analytics Engineer's Toolkit: dbt Core, Star Schema Modeling, and Automated Schema Testing",
    slug: 'modern-analytics-engineer-toolkit-dbt-snowflake-star-schema-testing',
    excerpt: 'Step-by-step architectural breakdown of dbt (data build tool) in modern data warehousing. Design Kimball-compliant Star Schemas, write modular Jinja macros, and implement automated data quality assertions.',
    featuredImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1400&q=80',
    authorId: 'usr_owner_default',
    authorName: 'Shashwat Mishra',
    authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=mishrashashwat90@gmail.com',
    authorRole: 'Lead Data Architect',
    authorBio: 'Specializes in distributed data pipelines, cloud analytics warehousing, and Trust & Safety engineering at scale.',
    category: 'SQL',
    tags: ['dbt', 'SQL', 'Data Modeling', 'Star Schema', 'Analytics Engineering'],
    status: 'published',
    readTime: '8 min read',
    views: 3620,
    featured: false,
    seoDescription: 'Comprehensive guide to building production dbt Core pipelines, structuring Kimball star schemas, and enforcing automated data quality tests in Snowflake and BigQuery.',
    createdAt: '2026-04-02T11:45:00.000Z',
    updatedAt: '2026-04-02T11:45:00.000Z',
    content: `
<h2>1. Moving from Spaghetti SQL to Modular Analytics Engineering</h2>
<p>In traditional data teams, analysts wrote 800-line monolithic SQL scripts with nested subqueries and manually pasted the output into spreadsheets. <strong>dbt (data build tool)</strong> applies software engineering best practices—modular code, version control, automated testing, and CI/CD documentation—to transformation workflows inside the data warehouse.</p>

<pre><code class="language-sql">-- models/staging/stg_transactions.sql
WITH source AS (
    SELECT * FROM {{ source('raw_payment_gateway', 'transactions') }}
),
cleaned AS (
    SELECT
        id AS transaction_id,
        user_id,
        CAST(amount AS NUMERIC(10, 2)) AS amount,
        UPPER(currency) AS currency,
        status,
        created_at AS transaction_timestamp
    FROM source
    WHERE id IS NOT NULL
)
SELECT * FROM cleaned;
</code></pre>
`
  }
];
