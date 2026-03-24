import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'

/* ─── Design tokens (match DSA page) ─────────────────────────────── */
const C = {
  bg: '#000',
  surface: '#0a0a0a',
  surface2: '#111',
  border: '#1c1c1c',
  borderMid: '#2a2a2a',
  white: '#fff',
  whiteOff: '#e8e8e8',
  gray: '#888',
  grayDim: '#555',
  grayDeep: '#333',
  muted: '#444',
} as const

/* ─── Types ───────────────────────────────────────────────────────── */
type UnitStatus = 0 | 1 | 2 | 3
type Domain = 'DSA' | 'AI/ML' | 'Data Science' | 'DevOps' | 'Backend' | 'Frontend' | 'OSS'
type Difficulty = 'Easy' | 'Medium' | 'Medium-Hard' | 'Hard' | '-'

interface MasteryUnit {
  id: string
  code: string
  unit: string
  domain: Domain
  resource: string
  task: string
  proof: string
  hours: number
  difficulty: Difficulty
  week: number
}

/* ─── Status / confidence maps ────────────────────────────────────── */
const STATUS_LABELS: Record<UnitStatus, string> = {
  0: 'Not started',
  1: 'Learning',
  2: 'Implemented',
  3: 'Explained publicly',
}
const STATUS_COLORS: Record<UnitStatus, { border: string; color: string; bg: string }> = {
  0: { border: '#1c1c1c', color: '#333', bg: '#0a0a0a' },
  1: { border: '#444', color: '#888', bg: 'rgba(255,255,255,0.02)' },
  2: { border: '#666', color: '#bbb', bg: 'rgba(255,255,255,0.04)' },
  3: { border: '#fff', color: '#fff', bg: 'rgba(255,255,255,0.07)' },
}
const CONF_STEPS = [0, 3, 5, 7, 9, 10]
const CONF_LABELS: Record<number, string> = {
  0: '—', 3: 'Saw solution', 5: 'Understood', 7: 'Can rebuild', 9: 'Can teach', 10: 'Used in prod',
}

const DOMAIN_COLORS: Record<Domain, string> = {
  'DSA': '#fff',
  'AI/ML': '#aaa',
  'Data Science': '#888',
  'DevOps': '#666',
  'Backend': '#999',
  'Frontend': '#777',
  'OSS': '#555',
}

/* ─── All 120 master units ────────────────────────────────────────── */
const UNITS: MasteryUnit[] = [
  /* ════ DSA (25) ════ */
  { id:'d1',  code:'D1',  unit:'Two Pointers on sorted arrays',          domain:'DSA',          resource:'NeetCode.io "Two Pointers" playlist (first 4 videos) + LC #11, #15, #42',                    task:'Solve Container With Most Water, 3Sum, Trapping Rain Water',                                   proof:'GitHub commit with solutions + inline complexity comments',             hours:1.5, difficulty:'Medium',      week:1 },
  { id:'d2',  code:'D2',  unit:'Sliding window variable size',           domain:'DSA',          resource:'NeetCode.io "Sliding Window" playlist + LC #3, #76, #424',                                   task:'Solve Longest Substring Without Repeat, Min Window Substring',                                 proof:'GitHub commit',                                                         hours:1.5, difficulty:'Medium',      week:1 },
  { id:'d3',  code:'D3',  unit:'Prefix sum + difference arrays',         domain:'DSA',          resource:'LC article "Prefix Sum" + LC #560, #974, #1314',                                             task:'Subarray Sum Equals K, Range Sum Query, implement difference array',                           proof:'GitHub commit',                                                         hours:1.5, difficulty:'Medium',      week:2 },
  { id:'d4',  code:'D4',  unit:'Binary search on answer',                domain:'DSA',          resource:'NeetCode "Binary Search" section + LC #875, #1011, #410',                                    task:'Koko Eating Bananas, Capacity To Ship, Split Array Largest Sum',                               proof:'GitHub commit',                                                         hours:1.5, difficulty:'Medium-Hard', week:2 },
  { id:'d5',  code:'D5',  unit:'Monotonic stack',                        domain:'DSA',          resource:'LC article + LC #496, #739, #84',                                                            task:'Next Greater Element, Daily Temperatures, Largest Rectangle in Histogram',                     proof:'GitHub commit',                                                         hours:2,   difficulty:'Hard',        week:2 },
  { id:'d6',  code:'D6',  unit:'BFS shortest path (unweighted)',         domain:'DSA',          resource:'Abdul Bari graph playlist ep 1–3 + LC #127, #994, #1091',                                   task:'Word Ladder, Rotting Oranges, Shortest Path in Binary Matrix',                                 proof:'GitHub commit',                                                         hours:2,   difficulty:'Medium',      week:3 },
  { id:'d7',  code:'D7',  unit:'DFS + backtracking',                     domain:'DSA',          resource:'NeetCode "Backtracking" playlist + LC #46, #39, #51',                                        task:'Permutations, Combination Sum, N-Queens',                                                      proof:'GitHub commit',                                                         hours:2,   difficulty:'Hard',        week:3 },
  { id:'d8',  code:'D8',  unit:'Tree: serialize + LCA',                  domain:'DSA',          resource:'LC #297, #236, #235',                                                                        task:'Serialize/Deserialize Binary Tree, Lowest Common Ancestor',                                    proof:'GitHub commit',                                                         hours:1.5, difficulty:'Hard',        week:3 },
  { id:'d9',  code:'D9',  unit:'Heap: K-pattern problems',               domain:'DSA',          resource:'NeetCode "Heap/Priority Queue" + LC #347, #23, #973',                                       task:'Top K Frequent Elements, Merge K Sorted Lists, K Closest Points',                             proof:'GitHub commit',                                                         hours:2,   difficulty:'Medium',      week:4 },
  { id:'d10', code:'D10', unit:'Union-Find (DSU)',                        domain:'DSA',          resource:'CP-algorithms.com "DSU" article + LC #684, #721, #1202',                                    task:'Redundant Connection, Accounts Merge, Smallest String With Swaps',                             proof:'GitHub commit',                                                         hours:2,   difficulty:'Hard',        week:4 },
  { id:'d11', code:'D11', unit:'Trie for prefix matching',               domain:'DSA',          resource:'NeetCode "Tries" section + LC #208, #211, #212',                                             task:'Implement Trie, Add & Search Words, Word Search II',                                           proof:'GitHub commit',                                                         hours:2,   difficulty:'Hard',        week:4 },
  { id:'d12', code:'D12', unit:'1D Dynamic Programming',                 domain:'DSA',          resource:'NeetCode "1D DP" playlist + LC #198, #322, #300',                                            task:'House Robber, Coin Change, Longest Increasing Subsequence',                                    proof:'GitHub commit',                                                         hours:2,   difficulty:'Medium',      week:5 },
  { id:'d13', code:'D13', unit:'2D DP: grid + string',                   domain:'DSA',          resource:'LC #62, #72, #1143',                                                                         task:'Unique Paths, Edit Distance, Longest Common Subsequence',                                      proof:'GitHub commit',                                                         hours:2,   difficulty:'Hard',        week:5 },
  { id:'d14', code:'D14', unit:'Interval scheduling',                    domain:'DSA',          resource:'LC #56, #57, #253',                                                                          task:'Merge Intervals, Insert Interval, Meeting Rooms II',                                           proof:'GitHub commit',                                                         hours:1.5, difficulty:'Medium',      week:5 },
  { id:'d15', code:'D15', unit:'Topological sort',                       domain:'DSA',          resource:'NeetCode "Graphs" section + LC #207, #210, #269',                                            task:'Course Schedule, Course Schedule II, Alien Dictionary',                                        proof:'GitHub commit',                                                         hours:2,   difficulty:'Hard',        week:6 },
  { id:'d16', code:'D16', unit:"Dijkstra's shortest path",               domain:'DSA',          resource:'Abdul Bari ep "Dijkstra" + LC #743, #787, #1514',                                           task:'Network Delay Time, Cheapest Flights K Stops, Max Probability Path',                          proof:'GitHub commit',                                                         hours:2,   difficulty:'Hard',        week:6 },
  { id:'d17', code:'D17', unit:'DP on trees',                            domain:'DSA',          resource:'LC #124, #543, #968',                                                                        task:'Binary Tree Max Path Sum, Diameter of Binary Tree, Binary Tree Cameras',                      proof:'GitHub commit',                                                         hours:2,   difficulty:'Hard',        week:6 },
  { id:'d18', code:'D18', unit:'DP: knapsack variants',                  domain:'DSA',          resource:'Errichto "Knapsack" YouTube + LC #416, #494, #474',                                         task:'Partition Equal Subset Sum, Target Sum, Ones and Zeroes',                                      proof:'GitHub commit',                                                         hours:2,   difficulty:'Hard',        week:7 },
  { id:'d19', code:'D19', unit:'Graph: cycle detection (directed + undirected)', domain:'DSA',  resource:'CP-algorithms "DFS tree" + LC #207, #684',                                                  task:'Implement both cycle detection approaches, explain difference',                                proof:'GitHub commit + explanation.md',                                        hours:1.5, difficulty:'Medium',      week:7 },
  { id:'d20', code:'D20', unit:'Greedy: interval + jump',                domain:'DSA',          resource:'LC #45, #134, #621',                                                                         task:'Jump Game II, Gas Station, Task Scheduler',                                                    proof:'GitHub commit',                                                         hours:1.5, difficulty:'Medium-Hard', week:7 },
  { id:'d21', code:'D21', unit:'Bit manipulation patterns',              domain:'DSA',          resource:'LC "Bit Manipulation" article + LC #136, #260, #338',                                       task:'Single Number, Single Number III, Counting Bits',                                              proof:'GitHub commit',                                                         hours:1.5, difficulty:'Medium',      week:8 },
  { id:'d22', code:'D22', unit:'Sliding window + deque',                 domain:'DSA',          resource:'LC #239, #480',                                                                              task:'Sliding Window Maximum, Sliding Window Median',                                                proof:'GitHub commit',                                                         hours:1.5, difficulty:'Hard',        week:8 },
  { id:'d23', code:'D23', unit:"Tarjan's SCC + bridges",                 domain:'DSA',          resource:'CP-algorithms "Bridges & Articulation Points" + LC #1192',                                  task:'Critical Connections in Network, find all bridges in a custom graph',                          proof:'GitHub commit + concept explanation',                                   hours:2,   difficulty:'Hard',        week:8 },
  { id:'d24', code:'D24', unit:'Segment tree (range query mutable)',      domain:'DSA',          resource:'CP-algorithms "Segment Tree" article',                                                       task:'Implement range sum + range min segment tree from scratch, LC #307',                           proof:'GitHub commit',                                                         hours:2,   difficulty:'Hard',        week:9 },
  { id:'d25', code:'D25', unit:'Mock interview round',                   domain:'DSA',          resource:'Pramp.com or Interviewing.io (free session)',                                                task:'Complete one full mock interview, record what you got stuck on',                               proof:'Screen recording or written debrief',                                   hours:2,   difficulty:'-',           week:9 },

  /* ════ AI/ML (25) ════ */
  { id:'a1',  code:'A1',  unit:'Python ML environment setup',            domain:'AI/ML',        resource:'Real Python "Python Virtual Environments" + conda docs',                                     task:'Create reproducible ML project: conda env, requirements.txt, .env, .gitignore',               proof:'GitHub repo scaffolded',                                                hours:1,   difficulty:'Easy',        week:1 },
  { id:'a2',  code:'A2',  unit:'NumPy vectorized ops',                   domain:'AI/ML',        resource:'NumPy quickstart + Jake VanderPlas "Python Data Science Handbook" Ch2 (free online)',        task:'Implement matrix multiply, broadcasting rules, vectorized sigmoid — NO Python loops',         proof:'Jupyter notebook committed',                                            hours:1.5, difficulty:'Medium',      week:1 },
  { id:'a3',  code:'A3',  unit:'Pandas ETL pipeline',                    domain:'AI/ML',        resource:'PDSH Ch3 + Kaggle "Pandas" micro-course (free)',                                             task:'Load raw CSV, handle nulls, groupby aggregate, merge two tables, export clean CSV',            proof:'Jupyter notebook committed',                                            hours:1.5, difficulty:'Easy',        week:1 },
  { id:'a4',  code:'A4',  unit:'EDA workflow',                           domain:'Data Science', resource:'Towards Data Science "EDA in Python" + Kaggle Titanic dataset',                              task:'Full EDA: distribution plots, correlation heatmap, outlier detection',                         proof:'Notebook + LinkedIn post "5 things EDA taught me"',                     hours:2,   difficulty:'Easy',        week:1 },
  { id:'a5',  code:'A5',  unit:'Scikit-learn supervised learning',       domain:'AI/ML',        resource:'Scikit-learn docs "Getting Started" + "Your First ML Model" tutorial',                       task:'Train/eval pipeline: LogReg + RandomForest on UCI dataset, compare with classification_report', proof:'Notebook committed',                                                    hours:1.5, difficulty:'Easy',        week:1 },
  { id:'a6',  code:'A6',  unit:'Train/val/test + preventing leakage',    domain:'AI/ML',        resource:'Scikit-learn "Pipeline" docs + "Data Leakage in ML" (machinelearningmastery.com)',           task:'Build sklearn Pipeline with ColumnTransformer, compare leaky vs correct eval',                 proof:'Notebook with leaky vs fixed comparison',                               hours:1.5, difficulty:'Medium',      week:2 },
  { id:'a7',  code:'A7',  unit:'XGBoost + Optuna hyperparameter tuning', domain:'AI/ML',        resource:'XGBoost docs "Get Started" + Optuna docs "10-minute intro"',                                task:'Train XGBoost on tabular Kaggle dataset, tune hyperparams with Optuna, beat baseline',        proof:'Notebook + Kaggle submission screenshot',                               hours:2,   difficulty:'Medium',      week:1 },
  { id:'a8',  code:'A8',  unit:'Model eval: beyond accuracy',            domain:'AI/ML',        resource:'Scikit-learn "Model Evaluation" docs',                                                       task:'Plot ROC-AUC, precision-recall curve, explain why accuracy misleads on imbalanced data',      proof:'Notebook + explanation.md',                                             hours:1.5, difficulty:'Medium',      week:2 },
  { id:'a9',  code:'A9',  unit:'PyTorch tensors + autograd',             domain:'AI/ML',        resource:'Official PyTorch "60 Minute Blitz" (first 2 sections)',                                      task:'Implement forward + backward pass of a 2-layer network manually using autograd',              proof:'Single .py file, no nn.Module',                                         hours:1.5, difficulty:'Medium',      week:2 },
  { id:'a10', code:'A10', unit:'PyTorch: custom Dataset + DataLoader',   domain:'AI/ML',        resource:'PyTorch docs "torch.utils.data" + fast.ai lesson 1 notebook',                               task:'Build custom Dataset class for any CSV dataset, use DataLoader with transforms',              proof:'GitHub commit',                                                         hours:1.5, difficulty:'Medium',      week:2 },
  { id:'a11', code:'A11', unit:'PyTorch: full training loop',            domain:'AI/ML',        resource:'PyTorch "Training a Classifier" official tutorial',                                          task:'Implement: model → loss → optimizer → train loop → val loop → save checkpoint',              proof:'.py training script (not notebook)',                                     hours:2,   difficulty:'Medium',      week:3 },
  { id:'a12', code:'A12', unit:'CNN image classifier (CIFAR-10)',        domain:'AI/ML',        resource:'PyTorch "Training a Classifier" (CIFAR-10) + cs231n notes "Conv Layers"',                  task:'Train CNN on CIFAR-10: 70%+ val accuracy, implement BatchNorm + Dropout',                     proof:'GitHub repo with training script + eval results',                       hours:2,   difficulty:'Medium-Hard', week:3 },
  { id:'a13', code:'A13', unit:'Transfer learning (ResNet fine-tune)',   domain:'AI/ML',        resource:'PyTorch "Transfer Learning Tutorial" official docs',                                         task:'Fine-tune ResNet-18 on a custom 2-class image dataset',                                        proof:'GitHub repo + README with accuracy table',                              hours:2,   difficulty:'Medium',      week:3 },
  { id:'a14', code:'A14', unit:'HuggingFace Transformers basics',        domain:'AI/ML',        resource:'HuggingFace "NLP Course" Ch1-2 (free, course.huggingface.co)',                              task:'Use pipeline() for sentiment, NER, summarization. Understand tokenizer input/output',         proof:'Notebook demonstrating 3 different pipelines',                          hours:1.5, difficulty:'Easy',        week:1 },
  { id:'a15', code:'A15', unit:'Fine-tune BERT for text classification', domain:'AI/ML',        resource:'HuggingFace "NLP Course" Ch3 + Trainer API docs',                                           task:'Fine-tune bert-base-uncased on any text classification dataset (10 epochs)',                  proof:'GitHub repo + pushed to HuggingFace Hub',                               hours:2,   difficulty:'Medium-Hard', week:1 },
  { id:'a16', code:'A16', unit:'HuggingFace model card + Hub push',      domain:'AI/ML',        resource:'HuggingFace "Model Card Guidebook" + push_to_hub() docs',                                  task:'Write proper model card (training data, metrics, limitations, usage) and push',               proof:'Live HuggingFace model page',                                           hours:1,   difficulty:'Easy',        week:1 },
  { id:'a17', code:'A17', unit:'Gradio app for model demo',              domain:'AI/ML',        resource:'Gradio docs "Quickstart" + "Sharing Your App"',                                             task:'Build Gradio interface for your BERT model, deploy to HuggingFace Spaces',                    proof:'Live HuggingFace Space URL',                                            hours:1.5, difficulty:'Easy',        week:1 },
  { id:'a18', code:'A18', unit:'RAG pipeline from scratch',              domain:'AI/ML',        resource:'LlamaIndex "Starter Tutorial" + FAISS docs "Getting Started"',                              task:'Build: chunk text → embed (sentence-transformers) → FAISS index → query → generate',         proof:'GitHub repo: rag-from-scratch',                                         hours:2,   difficulty:'Hard',        week:5 },
  { id:'a19', code:'A19', unit:'LangChain vs direct API tradeoffs',      domain:'AI/ML',        resource:'LangChain docs "LCEL" + "LangChain is unnecessary complexity" (Hacker News thread)',       task:'Rebuild a chain in raw Python, document what LangChain adds vs removes',                      proof:'explanation.md in repo + LinkedIn post',                                hours:1.5, difficulty:'Medium',      week:5 },
  { id:'a20', code:'A20', unit:'Prompt engineering patterns',            domain:'AI/ML',        resource:'Anthropic "Prompt Engineering Guide" + OpenAI "Prompt Engineering" docs',                  task:'Implement few-shot, chain-of-thought, output parsing — benchmark output quality',              proof:'Notebook with eval results',                                            hours:1.5, difficulty:'Medium',      week:4 },
  { id:'a21', code:'A21', unit:'MLflow experiment tracking',             domain:'AI/ML',        resource:'MLflow "Quickstart" docs',                                                                   task:'Instrument any existing training script with MLflow: log metrics, params, artifacts',         proof:'GitHub commit with MLflow runs',                                        hours:1.5, difficulty:'Medium',      week:4 },
  { id:'a22', code:'A22', unit:'Model quantization + local inference',   domain:'AI/ML',        resource:'llama.cpp README + HuggingFace "bitsandbytes" docs',                                        task:'Run a quantized LLM locally (GGUF format), compare VRAM and speed vs full precision',         proof:'Benchmark table in README',                                             hours:2,   difficulty:'Hard',        week:7 },
  { id:'a23', code:'A23', unit:'Embeddings + semantic search API',       domain:'AI/ML',        resource:'sentence-transformers docs + Pinecone/FAISS quickstart',                                    task:'Build semantic search over a document corpus, expose as FastAPI endpoint',                     proof:'GitHub repo: semantic-search-api',                                      hours:2,   difficulty:'Hard',        week:6 },
  { id:'a24', code:'A24', unit:'Fine-tune a small LLM with LoRA',        domain:'AI/ML',        resource:'HuggingFace PEFT docs "LoRA" + trl SFTTrainer docs',                                        task:'Fine-tune mistral-7b or phi-2 on a custom instruction dataset using LoRA',                    proof:'HuggingFace Hub + model card',                                          hours:2,   difficulty:'Hard',        week:8 },
  { id:'a25', code:'A25', unit:'AI system end-to-end (capstone)',        domain:'AI/ML',        resource:'Your own design',                                                                            task:'Build: data ingestion → fine-tuned model → Gradio/FastAPI demo → HuggingFace Space',         proof:'Full repo + blog post',                                                 hours:4,   difficulty:'Hard',        week:9 },

  /* ════ Data Science (15) ════ */
  { id:'ds1',  code:'DS1',  unit:'Statistical hypothesis testing',       domain:'Data Science', resource:'StatQuest YouTube "p-values" + "t-tests" (Josh Starmer)',                                   task:'Run t-test + chi-square on real dataset, explain Type I/II error',                            proof:'Notebook + 1 paragraph explanation to a non-technical person',          hours:1.5, difficulty:'Medium',      week:2 },
  { id:'ds2',  code:'DS2',  unit:'A/B test end-to-end',                  domain:'Data Science', resource:'KhanAcademy "Significance Tests" + Evan Miller\'s "A/B Test Calculator"',                  task:'Design A/B test: power analysis, sample size, run test, correct for multiple testing',        proof:'Notebook with complete A/B test simulation',                            hours:2,   difficulty:'Hard',        week:3 },
  { id:'ds3',  code:'DS3',  unit:'SQL window functions for analytics',   domain:'Data Science', resource:'Mode Analytics "SQL Tutorial" advanced section (free) + LC SQL #185, #184, #178',           task:'Write RANK, LAG, LEAD, NTILE, running total queries on real dataset',                         proof:'SQL file committed + LC solutions',                                     hours:1.5, difficulty:'Medium',      week:2 },
  { id:'ds4',  code:'DS4',  unit:'Time series basics (ARIMA)',           domain:'Data Science', resource:'Statsmodels "Time Series Analysis" docs + Kaggle "Store Sales" dataset',                   task:'Decompose seasonal trend, stationarity test, fit ARIMA, evaluate RMSE',                       proof:'Notebook committed',                                                    hours:2,   difficulty:'Hard',        week:5 },
  { id:'ds5',  code:'DS5',  unit:'Feature selection with SHAP',          domain:'Data Science', resource:'SHAP docs "Tabular examples"',                                                               task:'Train XGBoost, generate SHAP summary plot, explain top 5 features in plain English',          proof:'Notebook + feature explanation paragraph',                              hours:1.5, difficulty:'Medium',      week:4 },
  { id:'ds6',  code:'DS6',  unit:'Class imbalance handling',             domain:'Data Science', resource:'imbalanced-learn docs + "The Right Way to Handle Imbalanced Data" (TowardsDataScience)',    task:'Compare: baseline vs class_weight vs SMOTE vs threshold tuning on imbalanced dataset',       proof:'Notebook with comparison table',                                        hours:1.5, difficulty:'Medium',      week:3 },
  { id:'ds7',  code:'DS7',  unit:'Clustering: K-Means + DBSCAN',         domain:'Data Science', resource:'Scikit-learn "Clustering" docs + Sebastian Raschka\'s "Python ML" Ch11',                   task:'Cluster a real dataset, choose k with elbow + silhouette, interpret cluster profiles',        proof:'Notebook + cluster description',                                        hours:2,   difficulty:'Medium',      week:4 },
  { id:'ds8',  code:'DS8',  unit:'PCA for dimensionality reduction',     domain:'Data Science', resource:'StatQuest "PCA" YouTube series (3 videos) + scikit-learn PCA docs',                        task:'Reduce high-dim dataset, visualize 2D PCA, explain variance retained',                        proof:'Notebook with variance plot',                                           hours:1.5, difficulty:'Medium',      week:4 },
  { id:'ds9',  code:'DS9',  unit:'Streamlit interactive dashboard',      domain:'Data Science', resource:'Streamlit docs "Get Started" + "Data Sources" section',                                     task:'Build: upload CSV → auto EDA → filter → chart → download. Deploy to Streamlit Cloud',       proof:'Live Streamlit app URL',                                                hours:2,   difficulty:'Medium',      week:3 },
  { id:'ds10', code:'DS10', unit:'Production DS project structure',      domain:'Data Science', resource:'Cookie Cutter Data Science README + Real Python "Jupyter to Python"',                       task:'Convert notebook into production scripts: data/, models/, src/, tests/, Makefile',            proof:'GitHub repo with proper structure',                                     hours:1.5, difficulty:'Medium',      week:5 },
  { id:'ds11', code:'DS11', unit:'Data quality with Great Expectations', domain:'Data Science', resource:'Great Expectations "Core Concepts" docs',                                                   task:'Write expectations suite for a dataset, fail-fast on schema violations',                      proof:'GitHub commit with GE checkpoint',                                      hours:1.5, difficulty:'Hard',        week:6 },
  { id:'ds12', code:'DS12', unit:'Causal inference basics',              domain:'Data Science', resource:'"The Book of Why" Ch1-2 (Judea Pearl) + TowardsDataScience "DAGs in Python"',              task:'Build a DAG, identify confounders, explain why correlation ≠ causation for one example',     proof:'explanation.md + DAG diagram',                                          hours:1.5, difficulty:'Hard',        week:7 },
  { id:'ds13', code:'DS13', unit:'Regression diagnostics (OLS)',          domain:'Data Science', resource:'statsmodels "OLS" docs + "Diagnosing Regression Models" article',                          task:'Fit OLS, check residuals, test assumptions (homoscedasticity, normality), interpret coefficients', proof:'Notebook committed',                                               hours:1.5, difficulty:'Medium',      week:5 },
  { id:'ds14', code:'DS14', unit:'Kaggle competition entry',             domain:'Data Science', resource:'kaggle.com — pick any "Getting Started" competition',                                       task:'Submit a baseline + one improved submission, document your approach',                         proof:'Kaggle submission + notebook',                                          hours:2,   difficulty:'Medium',      week:6 },
  { id:'ds15', code:'DS15', unit:'DS portfolio write-up',               domain:'Data Science', resource:'"How to Write a Data Science Resume Project" (KDnuggets)',                                   task:'Write a 500-word case study for your best DS project in README format',                       proof:'Published as GitHub README or dev.to post',                             hours:1,   difficulty:'Easy',        week:7 },

  /* ════ DevOps (15) ════ */
  { id:'dv1',  code:'DV1',  unit:'Multi-stage Docker builds',            domain:'DevOps',       resource:'Docker docs "Multi-stage builds" + Snyk "Best Practices for Node.js Docker"',              task:'Reduce your existing app image size by 50%+ using multi-stage + distroless',                  proof:'GitHub commit: before/after size comparison in README',                 hours:1.5, difficulty:'Medium',      week:2 },
  { id:'dv2',  code:'DV2',  unit:'GitHub Actions CI pipeline',           domain:'DevOps',       resource:'GitHub Actions "Quickstart" + "Building and Testing Node.js" docs',                        task:'Build CI: lint → test → Docker build → push to GHCR on PR merge',                             proof:'Working .github/workflows/ci.yml committed',                            hours:2,   difficulty:'Medium',      week:2 },
  { id:'dv3',  code:'DV3',  unit:'Kubernetes HPA + resource limits',     domain:'DevOps',       resource:'K8s docs "Horizontal Pod Autoscaling" + "Managing Resources"',                             task:'Add resource requests/limits + HPA to an existing deployment, test with kubectl top',         proof:'YAML committed + screenshot',                                           hours:1.5, difficulty:'Medium',      week:3 },
  { id:'dv4',  code:'DV4',  unit:'Helm chart authoring',                 domain:'DevOps',       resource:'Helm docs "Chart Template Guide" Ch1-5',                                                    task:'Convert a raw K8s YAML app into a Helm chart with values.yaml, install + upgrade',            proof:'GitHub repo: helm-charts/',                                             hours:2,   difficulty:'Hard',        week:4 },
  { id:'dv5',  code:'DV5',  unit:'GitOps with ArgoCD',                   domain:'DevOps',       resource:'ArgoCD "Getting Started" docs + "App of Apps" pattern doc',                                task:'Set up ArgoCD, deploy your app via GitOps: push to git = deploy to cluster',                  proof:'Screenshot + architecture note in README',                              hours:2,   difficulty:'Hard',        week:4 },
  { id:'dv6',  code:'DV6',  unit:'Prometheus + Grafana custom metrics',  domain:'DevOps',       resource:'Prometheus "Getting Started" + Grafana "Build your first dashboard"',                      task:'Instrument Spring Boot app with Micrometer, build Grafana dashboard with 4 panels',           proof:'Dashboard screenshot committed',                                        hours:2,   difficulty:'Hard',        week:5 },
  { id:'dv7',  code:'DV7',  unit:'Nginx rate limiting config',           domain:'DevOps',       resource:'Nginx docs "ngx_http_limit_req_module" + "ngx_http_limit_conn_module"',                    task:'Configure per-IP and per-endpoint rate limiting with burst allowance',                        proof:'nginx.conf committed + test with ab output',                            hours:1.5, difficulty:'Medium',      week:3 },
  { id:'dv8',  code:'DV8',  unit:'Terraform: provision real infra',      domain:'DevOps',       resource:'Terraform "Get Started — AWS" (or equivalent)',                                             task:'Provision VPC + EC2 + RDS using Terraform, destroy cleanly, document cost',                   proof:'.tf files committed, cost breakdown in README',                         hours:2,   difficulty:'Hard',        week:6 },
  { id:'dv9',  code:'DV9',  unit:'Container security scanning (Trivy)',  domain:'DevOps',       resource:'Trivy "Quick Start" docs',                                                                  task:'Scan your existing Docker images, fix all CRITICAL/HIGH CVEs, document changes',              proof:'GitHub Actions step that fails on CRITICAL',                            hours:1.5, difficulty:'Medium',      week:3 },
  { id:'dv10', code:'DV10', unit:'Zero-downtime blue-green deploy',      domain:'DevOps',       resource:'Nginx "upstream" docs + Martin Fowler "BlueGreenDeployment"',                              task:'Implement blue-green switch at Nginx layer for your app',                                      proof:'Script + README with rollback steps',                                   hours:2,   difficulty:'Hard',        week:7 },
  { id:'dv11', code:'DV11', unit:'OpenTelemetry distributed tracing',    domain:'DevOps',       resource:'OpenTelemetry "Java Getting Started" + Jaeger "Getting Started"',                          task:'Add OTel auto-instrumentation to Spring Boot, view traces in Jaeger',                         proof:'Jaeger screenshot + OTel config committed',                             hours:1.5, difficulty:'Medium',      week:4 },
  { id:'dv12', code:'DV12', unit:'Log aggregation: Loki + Grafana',      domain:'DevOps',       resource:'Grafana Loki "Getting Started"',                                                            task:'Ship structured JSON logs from your app to Loki, query by label in Grafana',                  proof:'Dashboard screenshot',                                                  hours:1.5, difficulty:'Medium',      week:5 },
  { id:'dv13', code:'DV13', unit:'AWS essentials for backend devs',      domain:'DevOps',       resource:'AWS "Getting Started" free tier + "IAM Best Practices"',                                   task:'Deploy a containerized app to EC2, use S3 for file uploads, configure IAM with least privilege', proof:'Live URL + IAM policy JSON committed',                                hours:2,   difficulty:'Medium',      week:6 },
  { id:'dv14', code:'DV14', unit:'Canary deploy with feature flags',     domain:'DevOps',       resource:'OpenFeature "Java SDK" docs + Unleash "Self-hosted quickstart"',                           task:'Implement feature flag to route 10% traffic to new API version',                              proof:'Code commit + flag config in README',                                   hours:1.5, difficulty:'Hard',        week:7 },
  { id:'dv15', code:'DV15', unit:'DevOps write-up: my CI/CD pipeline',   domain:'DevOps',       resource:'"How I set up my CI/CD pipeline" format',                                                  task:'Write technical post: your full CI/CD pipeline from code push to production',                 proof:'Published: dev.to or your blog',                                        hours:1.5, difficulty:'Medium',      week:8 },

  /* ════ Backend (20) ════ */
  { id:'b1',  code:'B1',  unit:'Event sourcing pattern',                  domain:'Backend',      resource:'Martin Fowler "Event Sourcing" (martinfowler.com) + Axon Framework quickstart',            task:'Implement event store + projection + snapshot in Spring Boot',                                proof:'GitHub commit',                                                         hours:2,   difficulty:'Hard',        week:3 },
  { id:'b2',  code:'B2',  unit:'Outbox pattern (reliable events)',        domain:'Backend',      resource:'Debezium "Outbox Pattern" docs + Gunnar Morling blog "Reliable Microservices"',            task:'Implement transactional outbox in your existing service',                                      proof:'GitHub commit + architecture note',                                     hours:2,   difficulty:'Hard',        week:3 },
  { id:'b3',  code:'B3',  unit:'PostgreSQL EXPLAIN ANALYZE deep dive',    domain:'Backend',      resource:'"Use the Index, Luke" (use-the-index-luke.com) Ch1-3',                                     task:'Analyze 3 slow queries, add proper indexes, document speedup',                                proof:'Before/after EXPLAIN ANALYZE output committed',                         hours:2,   difficulty:'Hard',        week:4 },
  { id:'b4',  code:'B4',  unit:'Redis distributed lock (Redlock)',        domain:'Backend',      resource:'Antirez "Redlock" article (redis.io) + Redisson docs',                                     task:'Implement distributed lock for a shared resource (e.g., prevent duplicate cron jobs)',       proof:'GitHub commit + unit test',                                             hours:1.5, difficulty:'Hard',        week:4 },
  { id:'b5',  code:'B5',  unit:'gRPC service + streaming',               domain:'Backend',      resource:'gRPC "Introduction to gRPC" + "Basics Tutorial Java"',                                     task:'Define proto3 service, implement server/client streaming, compare to REST',                   proof:'GitHub repo: grpc-demo',                                                hours:2,   difficulty:'Hard',        week:5 },
  { id:'b6',  code:'B6',  unit:'Rate limiting: token bucket in Redis',    domain:'Backend',      resource:'Redis docs "INCR pattern" + Stripe Engineering "Rate Limiting" blog',                     task:'Implement per-user sliding window rate limiter as Spring Boot filter',                        proof:'GitHub commit + load test with wrk',                                    hours:2,   difficulty:'Hard',        week:5 },
  { id:'b7',  code:'B7',  unit:'Resilience4j circuit breaker',            domain:'Backend',      resource:'Resilience4j "Getting Started" docs + "Circuit Breaker" guide',                           task:'Add circuit breaker to an outgoing HTTP dependency, simulate failure, verify fallback',       proof:'GitHub commit + test',                                                  hours:1.5, difficulty:'Medium',      week:4 },
  { id:'b8',  code:'B8',  unit:'Webhook design: signatures + retry',      domain:'Backend',      resource:'Stripe "Webhook Best Practices" docs',                                                     task:'Implement webhook receiver: verify HMAC-SHA256 signature, idempotency key, exponential retry', proof:'GitHub commit',                                                        hours:1.5, difficulty:'Medium',      week:3 },
  { id:'b9',  code:'B9',  unit:'Java virtual threads (Project Loom)',     domain:'Backend',      resource:'JEP 444 "Virtual Threads" + Nicolai Parlog "Java 21 Virtual Threads" YouTube',            task:'Migrate a thread-pool-based handler to virtual threads, benchmark with JMH',                  proof:'Benchmark results in README',                                           hours:2,   difficulty:'Hard',        week:6 },
  { id:'b10', code:'B10', unit:'GraphQL N+1 problem + DataLoader',        domain:'Backend',      resource:'Netflix "GraphQL" blog + graphql-java "DataLoader" docs',                                  task:'Implement DataLoader to batch database calls, compare query count before/after',              proof:'GitHub commit + before/after DB query log',                             hours:2,   difficulty:'Hard',        week:6 },
  { id:'b11', code:'B11', unit:'API versioning strategy',                 domain:'Backend',      resource:'Troy Hunt "Your API versioning is wrong" + Stripe API versioning docs',                   task:'Implement URI + header versioning in one app, document the migration path',                   proof:'GitHub commit + ADR (Architecture Decision Record)',                    hours:1.5, difficulty:'Medium',      week:5 },
  { id:'b12', code:'B12', unit:'Distributed caching: cache stampede',     domain:'Backend',      resource:'Cloudflare blog "Cache Stampede" + Redis docs "SETNX"',                                   task:'Implement probabilistic early expiration or mutex-based cache recompute',                     proof:'GitHub commit',                                                         hours:1.5, difficulty:'Hard',        week:5 },
  { id:'b13', code:'B13', unit:'Multi-tenancy: row-level security',       domain:'Backend',      resource:'PostgreSQL "Row Security Policies" docs',                                                  task:'Implement RLS in PostgreSQL, verify tenant isolation with integration tests',                 proof:'GitHub commit + test',                                                  hours:2,   difficulty:'Hard',        week:6 },
  { id:'b14', code:'B14', unit:'Zero-downtime schema migrations',         domain:'Backend',      resource:'Stripe "Online Migrations" blog + Flyway "Migration Patterns" docs',                      task:'Apply expand-contract pattern to rename a column in a live DB',                               proof:'Migration scripts committed',                                           hours:1.5, difficulty:'Hard',        week:7 },
  { id:'b15', code:'B15', unit:'OpenTelemetry manual instrumentation',    domain:'Backend',      resource:'OTel "Java Manual Instrumentation" docs',                                                  task:'Add custom spans + attributes to a business-critical code path',                              proof:'GitHub commit + Jaeger trace screenshot',                               hours:1.5, difficulty:'Medium',      week:4 },
  { id:'b16', code:'B16', unit:'CQRS implementation',                     domain:'Backend',      resource:'Greg Young "CQRS Documents" (cqrs.files.wordpress.com)',                                   task:'Extract read model from write model in one bounded context',                                  proof:'GitHub commit + before/after diagram',                                  hours:2,   difficulty:'Hard',        week:7 },
  { id:'b17', code:'B17', unit:'Bulkhead: thread pool isolation',         domain:'Backend',      resource:'Resilience4j "Bulkhead" docs',                                                             task:'Separate thread pools for DB calls vs external API calls, prevent cascading failure',        proof:'GitHub commit + load test',                                             hours:1.5, difficulty:'Hard',        week:8 },
  { id:'b18', code:'B18', unit:'OAuth 2.1 + PKCE flow from scratch',      domain:'Backend',      resource:'Aaron Parecki "OAuth 2.0 Simplified" (Ch14) + RFC 7636',                                   task:'Implement authorization code + PKCE from scratch (no library for the core flow)',             proof:'GitHub repo: oauth-pkce-demo',                                          hours:2,   difficulty:'Hard',        week:8 },
  { id:'b19', code:'B19', unit:'Async job queue: advanced patterns',      domain:'Backend',      resource:'Redis "RPOPLPUSH pattern" + Bull queue docs "Priority + delayed jobs"',                   task:'Implement priority queue + delayed job + deduplication in Redis',                             proof:'GitHub commit',                                                         hours:1.5, difficulty:'Hard',        week:8 },
  { id:'b20', code:'B20', unit:'Backend system write-up (EchoPost)',      domain:'Backend',      resource:'Your own project: EchoPost architecture',                                                  task:'Write a 1500-word technical breakdown of EchoPost pipeline with diagrams',                   proof:'Published: dev.to or GitHub Pages',                                     hours:2,   difficulty:'Medium',      week:9 },

  /* ════ Frontend (10) ════ */
  { id:'f1',  code:'F1',  unit:'React Server Components',                 domain:'Frontend',     resource:'Next.js docs "Server and Client Components" + Theo "RSC explained" YouTube',              task:'Refactor a Client component to Server component, measure bundle size reduction',              proof:'GitHub commit + bundle analyzer screenshot',                            hours:1.5, difficulty:'Hard',        week:4 },
  { id:'f2',  code:'F2',  unit:'Next.js App Router + Server Actions',    domain:'Frontend',     resource:'Next.js docs "Server Actions and Mutations"',                                              task:'Replace an API route with Server Action, add optimistic update with useOptimistic',           proof:'GitHub commit',                                                         hours:1.5, difficulty:'Medium',      week:4 },
  { id:'f3',  code:'F3',  unit:'TanStack Query: mutations + optimistic',  domain:'Frontend',     resource:'TanStack Query docs "Mutations" + "Optimistic Updates"',                                  task:'Implement infinite scroll + optimistic delete + stale-while-revalidate',                      proof:'GitHub commit',                                                         hours:1.5, difficulty:'Medium',      week:5 },
  { id:'f4',  code:'F4',  unit:'React performance profiling',             domain:'Frontend',     resource:'React DevTools Profiler guide + web.dev "Performance"',                                   task:'Profile your existing app, find + fix 3 unnecessary re-renders',                              proof:'GitHub commit + before/after Profiler screenshots',                     hours:1.5, difficulty:'Medium',      week:5 },
  { id:'f5',  code:'F5',  unit:'Advanced TypeScript patterns',            domain:'Frontend',     resource:'Matt Pocock "Total TypeScript" (free beginner workshops)',                                 task:'Implement discriminated union for API responses, mapped type for form fields',                proof:'GitHub commit',                                                         hours:1.5, difficulty:'Medium-Hard', week:6 },
  { id:'f6',  code:'F6',  unit:'WebSockets + SSE in React',               domain:'Frontend',     resource:'MDN "Server-Sent Events" + socket.io React docs',                                         task:'Add real-time notification feed using SSE (or WebSocket), with reconnect logic',              proof:'GitHub commit',                                                         hours:2,   difficulty:'Medium',      week:6 },
  { id:'f7',  code:'F7',  unit:'E2E testing with Playwright',             domain:'Frontend',     resource:'Playwright "Getting Started" docs',                                                        task:'Write 5 critical user flow tests for your app, run in CI',                                    proof:'.github/workflows/e2e.yml committed',                                   hours:2,   difficulty:'Medium',      week:7 },
  { id:'f8',  code:'F8',  unit:'Accessibility audit (axe-core)',          domain:'Frontend',     resource:'axe-core "Getting Started" + WCAG 2.1 "Quick Reference"',                                task:'Run axe on your portfolio, fix all critical violations, add keyboard nav',                    proof:'GitHub commit + axe report',                                            hours:1.5, difficulty:'Medium',      week:7 },
  { id:'f9',  code:'F9',  unit:'Bundle analysis + code splitting',        domain:'Frontend',     resource:'Vite "Code Splitting" docs + rollup-plugin-visualizer',                                   task:'Analyze bundle, lazy-load 3 heavy routes, reduce initial JS by 30%+',                        proof:'GitHub commit + bundle screenshot',                                     hours:1.5, difficulty:'Medium',      week:8 },
  { id:'f10', code:'F10', unit:'Frontend write-up: DSA tracker build',    domain:'Frontend',     resource:'"How I built my DSA tracker" (your existing project)',                                    task:'Write 1000-word breakdown of your portfolio\'s architecture and tech decisions',              proof:'Published: dev.to',                                                     hours:1.5, difficulty:'Easy',        week:9 },

  /* ════ OSS (10) ════ */
  { id:'os1',  code:'OS1',  unit:'How to read a large OSS codebase',      domain:'OSS',          resource:'"How to Contribute to Open Source" (opensource.guide)',                                    task:'Pick 1 repo, read CONTRIBUTING.md, map the codebase in a personal doc',                      proof:'Your contribution map doc',                                             hours:1,   difficulty:'Easy',        week:1 },
  { id:'os2',  code:'OS2',  unit:'First OSS PR: documentation fix',       domain:'OSS',          resource:'GitHub "Finding good first issues"',                                                       task:'Submit a docs/typo/example fix PR to any major repo this week',                               proof:'Merged PR URL',                                                         hours:1,   difficulty:'Easy',        week:1 },
  { id:'os3',  code:'OS3',  unit:'Second OSS PR: test addition',          domain:'OSS',          resource:'Same repo or new one',                                                                     task:'Add a missing unit test for an edge case you found reading the code',                        proof:'Merged PR URL',                                                         hours:2,   difficulty:'Medium',      week:3 },
  { id:'os4',  code:'OS4',  unit:'GitHub profile as portfolio',           domain:'OSS',          resource:'GitHub "Managing your profile README" docs',                                               task:'Pin 6 best repos, write profile README with your stack + what you\'re building',             proof:'Live GitHub profile URL',                                               hours:1,   difficulty:'Easy',        week:1 },
  { id:'os5',  code:'OS5',  unit:'HuggingFace profile optimization',       domain:'OSS',          resource:'HuggingFace "Profile" + "Spaces" docs',                                                   task:'Write profile README, pin your best model + Space, add dataset card',                        proof:'Live HuggingFace profile URL',                                          hours:1,   difficulty:'Easy',        week:1 },
  { id:'os6',  code:'OS6',  unit:'LinkedIn build-in-public system',       domain:'OSS',          resource:'Taplio "LinkedIn Algorithm" blog + 3 examples of devs hired via posts',                  task:'Post 1 technical update per week for 12 weeks (template: built + why + link)',               proof:'12 LinkedIn posts scheduled/drafted',                                   hours:1,   difficulty:'Easy',        week:1 },
  { id:'os7',  code:'OS7',  unit:'Technical blog: first post',            domain:'OSS',          resource:'dev.to "Getting Started" + "How to Write a Technical Blog Post" (swyx.io)',               task:'Write "How I built X" covering EchoPost pipeline — 1500 words',                              proof:'Published dev.to URL',                                                  hours:2,   difficulty:'Medium',      week:1 },
  { id:'os8',  code:'OS8',  unit:'Third OSS PR: feature/bug fix',         domain:'OSS',          resource:'langchain4j or similar Java AI repo',                                                     task:'Fix a real issue (not just docs), get it reviewed and merged',                               proof:'Merged PR URL',                                                         hours:3,   difficulty:'Hard',        week:5 },
  { id:'os9',  code:'OS9',  unit:'Cold outreach for remote jobs',         domain:'OSS',          resource:'Lenny\'s Newsletter "How to get a job remotely" + resumeworded.com "Developer Resume"',  task:'Write 3 outreach messages for 3 companies you actually want to work at',                    proof:'3 drafts + 3 sent',                                                     hours:1,   difficulty:'Medium',      week:7 },
  { id:'os10', code:'OS10', unit:'System design write-up as portfolio',   domain:'OSS',          resource:'"Architecture Patterns with Python" O\'Reilly intro (free preview)',                       task:'Write an architecture decision record for EchoPost\'s scheduling system',                    proof:'Published: GitHub or blog',                                             hours:2,   difficulty:'Medium',      week:6 },
]

const ALL_DOMAINS: Domain[] = ['DSA', 'AI/ML', 'Data Science', 'DevOps', 'Backend', 'Frontend', 'OSS']

/* ─── Week 1 Schedule ─────────────────────────────────────────────── */
const WEEK1 = [
  {
    day: 'Monday',
    date: 'Mar 30',
    hours: 2,
    slots: [
      { unit: 'D1', label: 'Two Pointers — NeetCode playlist, solve LC #11 + #15' },
      { unit: 'A1', label: 'ML environment setup — conda env, scaffold, push to GitHub' },
    ],
    deliverable: '2 LC solutions committed, ml-fundamentals repo scaffolded',
  },
  {
    day: 'Tuesday',
    date: 'Mar 31',
    hours: 2,
    slots: [
      { unit: 'A2', label: 'NumPy vectorized ops — PDSH Ch2, implement sigmoid without loops' },
      { unit: 'A3', label: 'Pandas ETL — Kaggle micro-course lessons 1–3, load + clean a CSV' },
    ],
    deliverable: 'Jupyter notebook committed to ml-fundamentals repo',
  },
  {
    day: 'Wednesday',
    date: 'Apr 1',
    hours: 2,
    slots: [
      { unit: 'A4', label: 'EDA on Titanic or Iris dataset (distributions, correlations, nulls)' },
      { unit: 'A5', label: 'Scikit-learn pipeline — LogReg + RandomForest comparison' },
    ],
    deliverable: 'Full EDA notebook committed',
  },
  {
    day: 'Thursday',
    date: 'Apr 2',
    hours: 2,
    slots: [
      { unit: 'D2', label: 'Sliding Window — NeetCode, solve LC #3 + #76' },
      { unit: 'A7', label: 'XGBoost + Optuna on tabular dataset — run baseline' },
    ],
    deliverable: '2 more LC solutions + XGBoost notebook started',
  },
  {
    day: 'Friday',
    date: 'Apr 3',
    hours: 2,
    slots: [
      { unit: 'A14', label: 'HuggingFace Transformers — 3 pipelines: sentiment, NER, summarization' },
      { unit: 'OS4', label: 'GitHub profile README + pin 6 repos' },
    ],
    deliverable: 'HuggingFace notebook committed, GitHub profile live',
  },
  {
    day: 'Saturday',
    date: 'Apr 4',
    hours: 4,
    slots: [
      { unit: 'A15', label: 'Train DistilBERT SMS spam classifier (UCI dataset) — HuggingFace Trainer API' },
      { unit: 'A16', label: 'Write model card, push to HuggingFace Hub with push_to_hub()' },
      { unit: 'A17', label: 'Build Gradio interface, deploy to HuggingFace Spaces (free)' },
    ],
    deliverable: 'LIVE HuggingFace Space with working spam classifier demo',
  },
  {
    day: 'Sunday',
    date: 'Apr 5',
    hours: 4,
    slots: [
      { unit: 'OS7', label: '"How I built a spam classifier in one week" — publish on dev.to' },
      { unit: 'OS6', label: 'LinkedIn post with Space link: "I shipped my first ML model"' },
      { unit: 'OS1', label: 'Pick OSS repo, read CONTRIBUTING.md, map codebase' },
      { unit: 'OS5', label: 'Set up HuggingFace profile README, pin model + Space' },
    ],
    deliverable: 'Published blog post + LinkedIn post + OSS repo chosen',
  },
]

/* ─── OSS mapping ─────────────────────────────────────────────────── */
const OSS_REPOS = [
  {
    repo: 'langchain4j/langchain4j',
    url: 'https://github.com/langchain4j/langchain4j',
    why: 'Java + AI. You have deep Spring Boot + AI API experience. Exact overlap with your stack.',
    units: ['A19', 'B6', 'A18'],
    issues: [
      'Add missing tests for existing integrations (label: good first issue)',
      'Add Spring Boot auto-configuration for a missing provider',
      'Improve error messages when API key is missing or invalid',
      'Add JavaDoc to undocumented public methods',
      'Add integration example for OpenAI streaming in examples/',
    ],
  },
  {
    repo: 'huggingface/transformers',
    url: 'https://github.com/huggingface/transformers',
    why: 'Direct HuggingFace portfolio signal. Even documentation PRs on this repo are respected.',
    units: ['A15', 'A16', 'A24'],
    issues: [
      'Fix a broken example notebook (check Issues tab, label: good first issue)',
      'Add a missing docstring to a model class',
      'Fix a reproducibility issue in a training script',
      'Add a new task example to an existing model README',
      'Improve a confusing error message in the Trainer',
    ],
  },
  {
    repo: 'spring-projects/spring-data-redis',
    url: 'https://github.com/spring-projects/spring-data-redis',
    why: 'You already use Redis heavily (EchoPost). Contributing here is authentic, not forced.',
    units: ['B4', 'B12', 'B19'],
    issues: [
      'Reproduce a reported bug, confirm + add a failing test',
      'Add missing documentation for a configuration property',
      'Fix a typo or unclear error message in source code',
      'Add a missing test case for ReactiveRedisTemplate',
      'Improve performance of a serialization edge case',
    ],
  },
]

/* ════════════════════════════════════════════════════════════════════
   Sub-components
════════════════════════════════════════════════════════════════════ */

function UnitRow({
  unit,
  status,
  confidence,
  onCycleStatus,
  onSetConf,
}: {
  unit: MasteryUnit
  status: UnitStatus
  confidence: number
  onCycleStatus: () => void
  onSetConf: (c: number) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const sc = STATUS_COLORS[status]

  return (
    <div
      style={{
        border: `1px solid ${status > 0 ? sc.border : C.border}`,
        borderRadius: 4,
        background: sc.bg,
        overflow: 'hidden',
        transition: 'border-color 0.2s',
      }}
    >
      {/* Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '50px 1fr auto auto auto',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.6rem 0.85rem',
          cursor: 'pointer',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        {/* Code badge */}
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.58rem',
            fontWeight: 700,
            color: DOMAIN_COLORS[unit.domain],
            letterSpacing: '0.05em',
          }}
        >
          {unit.code}
        </span>

        {/* Unit name */}
        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            color: status > 0 ? sc.color : '#999',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {unit.unit}
        </span>

        {/* Hours */}
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.58rem',
            color: C.grayDeep,
            flexShrink: 0,
          }}
        >
          {unit.hours}h
        </span>

        {/* Confidence */}
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.6rem',
            color: confidence >= 7 ? C.white : confidence > 0 ? C.gray : C.grayDeep,
            flexShrink: 0,
            minWidth: 32,
            textAlign: 'right',
          }}
        >
          {confidence > 0 ? `${confidence}/10` : '—'}
        </span>

        {/* Status badge */}
        <button
          onClick={(e) => { e.stopPropagation(); onCycleStatus() }}
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.56rem',
            fontWeight: 700,
            padding: '0.16rem 0.5rem',
            border: `1px solid ${sc.border}`,
            borderRadius: 2,
            color: sc.color,
            background: sc.bg,
            cursor: 'pointer',
            letterSpacing: '0.05em',
            flexShrink: 0,
            transition: 'all 0.15s',
            whiteSpace: 'nowrap',
          }}
        >
          {status} · {STATUS_LABELS[status].split(' ')[0]}
        </button>
      </div>

      {/* Expanded */}
      {expanded && (
        <div style={{ padding: '0 0.85rem 1rem', borderTop: `1px solid ${C.border}` }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '0.75rem',
              marginTop: '0.85rem',
              marginBottom: '1rem',
            }}
          >
            {[
              { label: 'Resource', val: unit.resource },
              { label: 'Task', val: unit.task },
              { label: 'Proof required', val: unit.proof },
              { label: 'Difficulty', val: unit.difficulty },
            ].map(({ label, val }) => (
              <div key={label}>
                <div
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.56rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: C.grayDim,
                    marginBottom: '0.3rem',
                  }}
                >
                  {label}
                </div>
                <div style={{ fontSize: '0.75rem', color: C.gray, lineHeight: 1.55 }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Confidence selector */}
          <div>
            <div
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.56rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: C.grayDim,
                marginBottom: '0.5rem',
              }}
            >
              Confidence — below 7 = incomplete
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {CONF_STEPS.map((c) => (
                <button
                  key={c}
                  onClick={() => onSetConf(c)}
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.62rem',
                    fontWeight: confidence === c ? 700 : 400,
                    padding: '0.22rem 0.55rem',
                    borderRadius: 2,
                    border: `1px solid ${confidence === c ? (c >= 7 ? C.white : C.gray) : C.border}`,
                    color: confidence === c ? (c >= 7 ? C.white : C.gray) : C.grayDeep,
                    background:
                      confidence === c
                        ? c >= 7
                          ? 'rgba(255,255,255,0.07)'
                          : 'rgba(255,255,255,0.03)'
                        : C.surface,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {c === 0 ? '—' : `${c}`}
                  {c > 0 && (
                    <span style={{ color: C.grayDim, fontWeight: 400 }}>
                      {' '}· {CONF_LABELS[c]}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Master Tracker ─────────────────────────────────────────────── */
function MasterTracker() {
  const STORAGE_KEY = 'dsav2_records'
  const [records, setRecords] = useState<Record<string, { status: UnitStatus; confidence: number }>>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }
    catch { return {} }
  })
  const [domainFilter, setDomainFilter] = useState<Domain | 'all'>('all')
  const [weekFilter, setWeekFilter] = useState<number | 'all'>('all')

  const save = (updated: Record<string, { status: UnitStatus; confidence: number }>) => {
    setRecords(updated)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)) } catch {}
  }

  const cycleStatus = (id: string) => {
    const current = (records[id]?.status ?? 0) as UnitStatus
    const next = ((current + 1) % 4) as UnitStatus
    save({ ...records, [id]: { ...records[id], status: next, confidence: records[id]?.confidence ?? 0 } })
  }

  const setConf = (id: string, conf: number) => {
    save({ ...records, [id]: { ...records[id], confidence: conf, status: records[id]?.status ?? 0 } })
  }

  const visible = UNITS.filter((u) => {
    const domainOk = domainFilter === 'all' || u.domain === domainFilter
    const weekOk = weekFilter === 'all' || u.week === weekFilter
    return domainOk && weekOk
  })

  const counts = {
    0: UNITS.filter((u) => (records[u.id]?.status ?? 0) === 0).length,
    1: UNITS.filter((u) => (records[u.id]?.status ?? 0) === 1).length,
    2: UNITS.filter((u) => (records[u.id]?.status ?? 0) === 2).length,
    3: UNITS.filter((u) => (records[u.id]?.status ?? 0) === 3).length,
  }
  const progress = Math.round(
    ((counts[1] * 0.33 + counts[2] * 0.66 + counts[3]) / UNITS.length) * 100
  )
  const totalHours = UNITS.reduce((s, u) => s + u.hours, 0)

  return (
    <div>
      {/* Stats bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '1px',
          border: `1px solid ${C.border}`,
          borderRadius: 6,
          overflow: 'hidden',
          marginBottom: '2rem',
        }}
      >
        {[
          { val: UNITS.length,    label: 'Total units' },
          { val: `${totalHours}h`, label: 'Total hours' },
          { val: counts[3],        label: 'Explained' },
          { val: counts[2],        label: 'Implemented' },
          { val: counts[1],        label: 'Learning' },
          { val: `${progress}%`,   label: 'Progress' },
        ].map(({ val, label }) => (
          <div
            key={label}
            style={{ background: C.surface, padding: '1rem', textAlign: 'center' }}
          >
            <div
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '1.4rem',
                fontWeight: 700,
                color: C.white,
                lineHeight: 1,
              }}
            >
              {val}
            </div>
            <div
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.56rem',
                color: C.grayDim,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginTop: '0.3rem',
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: 2,
          background: C.border,
          borderRadius: 1,
          marginBottom: '1.75rem',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: C.white,
            transition: 'width 0.35s ease',
          }}
        />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.58rem',
            color: C.grayDim,
            alignSelf: 'center',
            marginRight: '0.25rem',
          }}
        >
          Domain:
        </span>
        {(['all', ...ALL_DOMAINS] as const).map((d) => (
          <button
            key={d}
            onClick={() => setDomainFilter(d as Domain | 'all')}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.62rem',
              fontWeight: 600,
              padding: '0.25rem 0.65rem',
              borderRadius: 2,
              border: `1px solid ${domainFilter === d ? C.white : C.border}`,
              color: domainFilter === d ? C.white : C.grayDim,
              background:
                domainFilter === d ? 'rgba(255,255,255,0.06)' : C.surface,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {d === 'all'
              ? `all (${UNITS.length})`
              : `${d} (${UNITS.filter((u) => u.domain === d).length})`}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.58rem',
            color: C.grayDim,
            alignSelf: 'center',
            marginRight: '0.25rem',
          }}
        >
          Week:
        </span>
        {(['all', 1, 2, 3, 4, 5, 6, 7, 8, 9] as const).map((w) => (
          <button
            key={w}
            onClick={() => setWeekFilter(w as number | 'all')}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.62rem',
              fontWeight: 600,
              padding: '0.25rem 0.55rem',
              borderRadius: 2,
              border: `1px solid ${weekFilter === w ? C.white : C.border}`,
              color: weekFilter === w ? C.white : C.grayDim,
              background:
                weekFilter === w ? 'rgba(255,255,255,0.06)' : C.surface,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {w === 'all' ? 'all' : `W${w}`}
          </button>
        ))}
      </div>

      {/* Unit list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {visible.map((unit) => {
          const rec = records[unit.id]
          return (
            <UnitRow
              key={unit.id}
              unit={unit}
              status={(rec?.status ?? 0) as UnitStatus}
              confidence={rec?.confidence ?? 0}
              onCycleStatus={() => cycleStatus(unit.id)}
              onSetConf={(c) => setConf(unit.id, c)}
            />
          )
        })}
      </div>
    </div>
  )
}

/* ─── Week 1 Schedule section ────────────────────────────────────── */
function Week1Schedule() {
  return (
    <div>
      {/* Portfolio piece callout */}
      <div
        style={{
          border: `1px solid ${C.borderMid}`,
          borderRadius: 6,
          padding: '1.5rem',
          marginBottom: '2rem',
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.6rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: C.grayDim,
            marginBottom: '0.75rem',
          }}
        >
          // Week 1 Portfolio Piece
        </div>
        <div
          style={{
            fontSize: '1.05rem',
            fontWeight: 800,
            color: C.white,
            marginBottom: '0.4rem',
            letterSpacing: '-0.01em',
          }}
        >
          SMS Spam Classifier: scikit-learn → DistilBERT
        </div>
        <p style={{ fontSize: '0.82rem', color: C.gray, lineHeight: 1.65, marginBottom: '1rem' }}>
          One GitHub repo with 4 artifacts: baseline Naive Bayes notebook, fine-tuned DistilBERT
          training script, Gradio demo deployed to HuggingFace Spaces, README with comparison table
          and blog post link.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {[
            'github.com/yourhandle/spam-classifier',
            'huggingface.co/yourhandle/spam-distilbert (model)',
            'huggingface.co/spaces/yourhandle/spam-demo (live demo)',
            'dev.to post link',
          ].map((link) => (
            <div
              key={link}
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.68rem',
                color: C.grayDim,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span style={{ color: C.grayDeep }}>→</span> {link}
            </div>
          ))}
        </div>
      </div>

      {/* Daily schedule */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {WEEK1.map((day) => (
          <div
            key={day.day}
            style={{
              border: `1px solid ${C.border}`,
              borderRadius: 5,
              overflow: 'hidden',
            }}
          >
            {/* Day header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '90px 1fr auto',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.75rem 1rem',
                background: C.surface,
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              <div>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    color: C.whiteOff,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {day.day}
                </div>
                <div
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.58rem',
                    color: C.grayDim,
                  }}
                >
                  {day.date}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                {day.slots.map((s) => (
                  <span
                    key={s.unit}
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '0.6rem',
                      padding: '0.18rem 0.5rem',
                      border: `1px solid ${C.borderMid}`,
                      borderRadius: 2,
                      color: C.gray,
                    }}
                  >
                    {s.unit}
                  </span>
                ))}
              </div>
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.65rem',
                  color: C.grayDeep,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {day.hours}h
              </span>
            </div>

            {/* Slots + deliverable */}
            <div style={{ padding: '0.85rem 1rem' }}>
              {day.slots.map((s) => (
                <div
                  key={s.unit}
                  style={{
                    display: 'flex',
                    gap: '0.75rem',
                    marginBottom: '0.45rem',
                    alignItems: 'flex-start',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '0.6rem',
                      color: C.grayDeep,
                      flexShrink: 0,
                      marginTop: '0.15rem',
                    }}
                  >
                    →
                  </span>
                  <span style={{ fontSize: '0.78rem', color: C.gray, lineHeight: 1.5 }}>{s.label}</span>
                </div>
              ))}
              <div
                style={{
                  marginTop: '0.75rem',
                  padding: '0.5rem 0.75rem',
                  background: '#050505',
                  border: `1px solid ${C.border}`,
                  borderRadius: 3,
                }}
              >
                <span
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.58rem',
                    color: C.grayDim,
                  }}
                >
                  Deliverable:{' '}
                </span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: C.gray }}>
                  {day.deliverable}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── OSS Mapping section ────────────────────────────────────────── */
function OSSMapping() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {OSS_REPOS.map((repo) => (
        <div
          key={repo.repo}
          style={{
            border: `1px solid ${C.border}`,
            borderRadius: 6,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '1.1rem 1.25rem',
              background: C.surface,
              borderBottom: `1px solid ${C.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div>
              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: C.white,
                  textDecoration: 'none',
                  letterSpacing: '-0.01em',
                }}
              >
                {repo.repo} ↗
              </a>
              <p style={{ fontSize: '0.78rem', color: C.gray, marginTop: '0.3rem', fontWeight: 400 }}>
                {repo.why}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {repo.units.map((u) => (
                <span
                  key={u}
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.6rem',
                    padding: '0.18rem 0.5rem',
                    border: `1px solid ${C.borderMid}`,
                    borderRadius: 2,
                    color: C.gray,
                  }}
                >
                  {u}
                </span>
              ))}
            </div>
          </div>

          {/* Issues */}
          <div style={{ padding: '0.85rem 1.25rem' }}>
            <div
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.56rem',
                letterSpacing: '0.13em',
                textTransform: 'uppercase',
                color: C.grayDim,
                marginBottom: '0.65rem',
              }}
            >
              Target issues
            </div>
            {repo.issues.map((issue, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: '0.65rem',
                  alignItems: 'flex-start',
                  marginBottom: '0.4rem',
                }}
              >
                <span
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.6rem',
                    color: C.grayDeep,
                    flexShrink: 0,
                    marginTop: '0.15rem',
                  }}
                >
                  {i + 1}.
                </span>
                <span style={{ fontSize: '0.78rem', color: C.gray, lineHeight: 1.5 }}>{issue}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── Proof System section ───────────────────────────────────────── */
function ProofSystem() {
  const channels = [
    {
      name: 'GitHub',
      desc: 'Profile README (stack + what you\'re building), 6 pinned repos, commit every day. Every repo needs a live demo link OR architecture diagram in README.',
      items: ['Profile README live', 'EchoPost pinned with architecture write-up', 'spam-classifier repo with HuggingFace links', 'dsa-solutions repo (your daily commits)', 'Green commit graph visible to recruiters'],
    },
    {
      name: 'HuggingFace',
      desc: 'Target 5 pushed models over 12 weeks. Each model card links to your GitHub + blog post. Spaces = live demos = resume links that actually work.',
      items: ['Profile README with stack + links', '5 models pushed by week 12', 'At least 2 live Spaces (live demos)', 'Model cards written in full (data, metrics, limits, usage)'],
    },
    {
      name: 'dev.to / Blog',
      desc: '1 post per week = 12 articles after 12 weeks. Format that gets traction: "How I built X using Y — tradeoffs, mistakes, code." Ranks on Google, generates inbound interest.',
      items: ['"How I built a spam classifier in one week"', '"EchoPost architecture: why we use Redis time-wheels"', '"Implementing Redlock in Spring Boot"', '"From LeetCode to real systems: what I actually learned"'],
    },
    {
      name: 'LinkedIn',
      desc: 'The job-outside-country lever. 1 post/week. Share what you built, link to GitHub + demo. Connect with 5 international devs per week. Message hiring managers directly after posting.',
      items: ['Post Sunday night → recruiter sees it Monday', '12 weeks of build-in-public posts', 'Connect with 5 international devs/week', 'DM hiring managers: "Just shipped X, open to remote roles"'],
    },
  ]

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1rem',
      }}
    >
      {channels.map((ch) => (
        <div
          key={ch.name}
          style={{
            border: `1px solid ${C.border}`,
            borderRadius: 6,
            padding: '1.25rem',
            background: C.surface,
          }}
        >
          <div
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: C.whiteOff,
              marginBottom: '0.5rem',
              letterSpacing: '0.05em',
            }}
          >
            {ch.name}
          </div>
          <p
            style={{
              fontSize: '0.78rem',
              color: C.gray,
              lineHeight: 1.6,
              marginBottom: '0.85rem',
            }}
          >
            {ch.desc}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {ch.items.map((item) => (
              <div
                key={item}
                style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}
              >
                <span
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.6rem',
                    color: C.grayDeep,
                    flexShrink: 0,
                    marginTop: '0.2rem',
                  }}
                >
                  →
                </span>
                <span style={{ fontSize: '0.75rem', color: C.grayDim, lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════
   Main Page
════════════════════════════════════════════════════════════════════ */
type Tab = 'tracker' | 'week1' | 'oss' | 'proof'

export default function DSAv2() {
  usePageMeta(
    '90-Day Mastery Sprint — DSA + AI/ML + Backend + DevOps',
    '120 atomic units across 7 domains. Dynamic, measurable, portfolio-first. Built to get a remote job paying in foreign money.',
  )
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('tracker')

  const tabs: { id: Tab; label: string }[] = [
    { id: 'tracker', label: '// Master Tracker' },
    { id: 'week1',   label: '// Week 1 Schedule' },
    { id: 'oss',     label: '// OSS Mapping' },
    { id: 'proof',   label: '// Proof System' },
  ]

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.whiteOff }}>

      {/* ── HERO ────────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: '92vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          position: 'relative',
          padding: '6rem 2rem 4rem',
          background:
            'radial-gradient(ellipse 70% 55% at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 65%)',
        }}
      >
        {/* Grid overlay */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            maskImage:
              'radial-gradient(ellipse 80% 80% at 50% 40%, black 20%, transparent 75%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 80% 80% at 50% 40%, black 20%, transparent 75%)',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 860 }}>
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.7rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: C.gray,
              border: `1px solid ${C.borderMid}`,
              padding: '0.32rem 0.9rem',
              borderRadius: 2,
              marginBottom: '2.25rem',
            }}
          >
            <span>90-Day Mastery Sprint · 2026</span>
            <span style={{ color: C.grayDeep }}>|</span>
            <span style={{ color: C.grayDeep }}>Dynamic · No static plans</span>
          </div>

          {/* Heading */}
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 8vw, 6rem)',
              fontWeight: 800,
              lineHeight: 0.92,
              letterSpacing: '-0.04em',
              marginBottom: '1.5rem',
              color: C.white,
            }}
          >
            DSA · AI/ML
            <br />
            <span style={{ color: C.gray }}>Backend · DevOps</span>
            <br />
            <span style={{ color: C.grayDim }}>In 90 Days</span>
          </h1>

          <p
            style={{
              fontSize: '1rem',
              color: C.grayDim,
              maxWidth: 560,
              margin: '0 auto 1.75rem',
              fontWeight: 400,
              lineHeight: 1.7,
            }}
          >
            120 atomic units. 7 domains. Each unit is 1–2 hours, immediately testable, and maps
            to a real-world system. Built to market yourself internationally and land a remote job
            paying in foreign currency.
          </p>

          {/* Rule bar */}
          <div
            style={{
              display: 'inline-flex',
              gap: '1.5rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.65rem',
              color: C.grayDeep,
              marginBottom: '3rem',
            }}
          >
            {[
              '0 = Not started',
              '1 = Learning',
              '2 = Implemented',
              '3 = Explained publicly',
            ].map((r) => (
              <span key={r}>{r}</span>
            ))}
          </div>

          {/* Stats */}
          <div
            style={{
              display: 'flex',
              gap: '3rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '2.5rem',
            }}
          >
            {[
              { num: '120', label: 'Atomic Units' },
              { num: '7',   label: 'Domains' },
              { num: '90',  label: 'Days' },
              { num: '3',   label: 'Target OSS PRs' },
            ].map(({ num, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: C.white,
                    letterSpacing: '-0.03em',
                  }}
                >
                  {num}
                </span>
                <span
                  style={{
                    fontSize: '0.62rem',
                    fontFamily: 'JetBrains Mono, monospace',
                    color: C.grayDim,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Back button */}
          <button
            onClick={() => navigate('/dsa')}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '0.6rem 1.4rem',
              border: `1px solid ${C.border}`,
              borderRadius: 3,
              background: 'transparent',
              color: C.grayDim,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = C.white
              e.currentTarget.style.color = C.white
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = C.border
              e.currentTarget.style.color = C.grayDim
            }}
          >
            ← Back to DSA Guide
          </button>
        </div>
      </section>

      {/* ── TABS ────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: C.surface,
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: '0 1.5rem',
            display: 'flex',
            gap: 0,
            overflowX: 'auto',
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.68rem',
                fontWeight: activeTab === tab.id ? 700 : 400,
                padding: '1rem 1.25rem',
                border: 'none',
                borderBottom: `2px solid ${activeTab === tab.id ? C.white : 'transparent'}`,
                background: 'transparent',
                color: activeTab === tab.id ? C.white : C.grayDim,
                cursor: 'pointer',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
                letterSpacing: '0.05em',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT ────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '3.5rem 1.5rem 5rem' }}>

        {activeTab === 'tracker' && (
          <div>
            <div
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.62rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: C.grayDim,
                marginBottom: '2rem',
                paddingBottom: '1rem',
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              // Master Unit Table — status: click badge to advance · confidence: expand row to set
            </div>
            <MasterTracker />
          </div>
        )}

        {activeTab === 'week1' && (
          <div>
            <div
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.62rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: C.grayDim,
                marginBottom: '2rem',
                paddingBottom: '1rem',
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              // Week 1 Schedule — Mar 30 → Apr 5 · theme: AI/ML foundations + DSA momentum + public debut
            </div>
            <Week1Schedule />
          </div>
        )}

        {activeTab === 'oss' && (
          <div>
            <div
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.62rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: C.grayDim,
                marginBottom: '2rem',
                paddingBottom: '1rem',
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              // OSS Mapping — 3 repos · 5 target issues each · linked to your units
            </div>
            <OSSMapping />
          </div>
        )}

        {activeTab === 'proof' && (
          <div>
            <div
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.62rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: C.grayDim,
                marginBottom: '2rem',
                paddingBottom: '1rem',
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              // The Proof System — how you market what you build to get a job outside your country
            </div>
            <ProofSystem />
            {/* Extra rule */}
            <div
              style={{
                marginTop: '2.5rem',
                border: `1px solid ${C.border}`,
                borderRadius: 6,
                padding: '1.5rem',
                background: C.surface,
              }}
            >
              <div
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: C.whiteOff,
                  marginBottom: '0.75rem',
                }}
              >
                The edge after 4 weeks
              </div>
              <p style={{ fontSize: '0.83rem', color: C.gray, lineHeight: 1.7, marginBottom: '0.75rem' }}>
                Most candidates have ML <em>or</em> backend <em>or</em> open source. Almost nobody
                has all four publicly documented with live demos. Your resume after 4 weeks has:
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '0.5rem',
                }}
              >
                {[
                  'HuggingFace profile with 2 live models + Spaces',
                  '3 merged OSS PRs',
                  'Published blog posts (actual links, not "I blog")',
                  'EchoPost with architectural write-up',
                  'DSA commits visible daily on GitHub',
                ].map((item) => (
                  <div
                    key={item}
                    style={{
                      padding: '0.65rem 0.85rem',
                      border: `1px solid ${C.border}`,
                      borderRadius: 4,
                      background: '#050505',
                      fontSize: '0.75rem',
                      color: C.gray,
                      lineHeight: 1.5,
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <footer
        style={{
          textAlign: 'center',
          padding: '3rem 2rem',
          borderTop: `1px solid ${C.border}`,
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.68rem',
          color: C.grayDeep,
          lineHeight: 2,
          background: C.surface,
        }}
      >
        <div style={{ fontSize: '1.4rem', marginBottom: '0.5rem', opacity: 0.4 }}>⬡</div>
        90-DAY MASTERY SPRINT · 120 UNITS · 7 DOMAINS
        <br />
        <span style={{ color: C.gray }}>Build</span>
        {' · '}
        <span style={{ color: C.grayDim }}>Ship</span>
        {' · '}
        <span style={{ color: C.grayDeep }}>Explain publicly</span>
        <br />
        <br />
        Come back after Week 1 and I'll generate Week 2 based on your actual progress.
      </footer>
    </div>
  )
}
