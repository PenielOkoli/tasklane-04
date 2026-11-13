'use client';

import { ListChecks, RotateCcw, Sparkles } from 'lucide-react';
import { parseTaskPlan } from '@/lib/task-plan-schema';

export function StructuredTaskPlan({ value, onRetry }: { value: unknown; onRetry: () => void }) {
  const result = parseTaskPlan(value);
  if (!result.ok) {
    return <section className="plan-fallback" aria-label="Plan validation fallback" role="alert">
      <div className="plan-fallback-icon"><ListChecks size={17}/></div>
      <div><b>We couldn’t safely show that plan.</b><p>{result.message}</p><small>Check the request and try again. No tasks were changed.</small></div>
      <button onClick={onRetry} aria-label="Retry structured plan"><RotateCcw size={14}/> Retry</button>
    </section>;
  }

  const plan = result.data;
  return <section className="structured-plan" aria-label="Structured task plan">
    <div className="plan-narrative"><span className="plan-symbol"><Sparkles size={15}/></span><div><div className="plan-label">A note from Tasklane <span lang={plan.response.locale}>{plan.response.locale}</span></div><p lang={plan.response.locale}>{plan.response.content}</p></div></div>
    <header className="plan-heading"><div><span className="plan-label">Suggested plan · not added to your board</span><h3 lang={plan.planTitle.locale}>{plan.planTitle.content}</h3><p lang={plan.planSummary.locale}>{plan.planSummary.content}</p></div><span className="plan-locale" lang={plan.locale}>{plan.locale}</span></header>
    <div className="suggested-tasks">{plan.suggestions.map((task, index) => <article className="suggested-task" key={task.id}>
      <span className="suggested-task-number">{String(index + 1).padStart(2, '0')}</span>
      <div className="suggested-task-copy"><h4 lang={task.title.locale}>{task.title.content}</h4><p lang={task.detail.locale}>{task.detail.content}</p></div>
      <span className={`priority-pill priority-${task.priority}`}>{task.priority}</span>
    </article>)}</div>
    <div className="plan-checklist"><h4><ListChecks size={15}/> Before you start <span className="plan-locale" lang={plan.locale}>{plan.locale}</span></h4><ol>{plan.checklist.map((step, index) => <li key={`${index}-${step.content}`} lang={step.locale}><span>{index + 1}</span>{step.content}</li>)}</ol></div>
  </section>;
}
