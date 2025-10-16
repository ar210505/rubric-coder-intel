# EVALAI - AI-Powered Evaluation Platform

> Live demo: https://ar210505.github.io/rubric-coder-intel/

[![Deploy to GitHub Pages](https://github.com/ar210505/rubric-coder-intel/actions/workflows/deploy.yml/badge.svg)](https://github.com/ar210505/rubric-coder-intel/actions/workflows/deploy.yml)

<div align="center">
  <img src="public/favicon.jpg" alt="EVALAI Logo" width="150" />
  
  **Intelligent Rubrics-Based Evaluator**
</div>

This project is a web application for evaluating flowcharts, algorithms, and pseudocode using configurable, weighted rubrics. Users can upload design artifacts (documents, slides, images) and receive structured feedback: per‑criterion scores, strengths, suggested improvements, and an overall score.

### Tech Stack
* Vite + React + TypeScript
* Tailwind CSS + shadcn-inspired component library
* Supabase (auth, database, edge function)

### Local Development
```bash
git clone <REPO_URL>
cd <project-folder>
npm install
npm run dev
```
Visit http://localhost:8080/.

**Important**: Ensure `.env` file exists with your Supabase credentials. See `SUPABASE_SETUP.md` for complete backend setup instructions.

### Evaluation Pipeline (Current Simplified Version)
An edge function performs a lightweight heuristic analysis of the submitted content against rubric criteria without calling external AI services. It produces provisional scores to enable iteration; you can later plug in more advanced analysis if desired.

### Planned Improvements
* Custom rubric builder UI
* Historical comparison + progress graphs
* Exportable PDF/CSV reports
* Instructor moderation workflow
* Stronger static + semantic analysis of pseudocode/flowcharts

### Contributing
1. Fork / branch
2. Make changes (ensure lint passes: `npm run lint`)
3. Submit PR with a concise description

### License
Add a LICENSE file of your choice (MIT recommended) if distributing.
