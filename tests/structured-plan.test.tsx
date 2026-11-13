import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { StructuredTaskPlan } from '../src/components/structured-task-plan';
import { parseTaskPlan, TaskPlan } from '../src/lib/task-plan-schema';

const validPlan: TaskPlan = {
  locale: 'en-NG',
  response: { locale: 'en-NG', content: 'Here is a clear first pass for the launch.' },
  planTitle: { locale: 'en-NG', content: 'Spring launch preparation' },
  planSummary: { locale: 'en-NG', content: 'Three small steps keep the work visible.' },
  suggestions: [
    { id: 'confirm-scope', title: { locale: 'en-NG', content: 'Confirm the launch scope' }, detail: { locale: 'en-NG', content: 'Agree on the first release and its owner.' }, priority: 'high' },
    { id: 'review-page', title: { locale: 'en-NG', content: 'Review the launch page' }, detail: { locale: 'en-NG', content: 'Check the copy, links, and mobile layout.' }, priority: 'medium' },
  ],
  checklist: [
    { locale: 'en-NG', content: 'Name one owner for each step.' },
    { locale: 'en-NG', content: 'Choose a date to review the plan.' },
  ],
};

test('accepts typed content with locale metadata separated from copy', () => {
  const result = parseTaskPlan(validPlan);
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.data.response.locale, 'en-NG');
    assert.equal(result.data.response.content, 'Here is a clear first pass for the launch.');
  }
});

test('rejects missing fields and returns a safe fallback with field names', () => {
  const { response: _response, ...incomplete } = validPlan;
  const result = parseTaskPlan(incomplete);
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.match(result.message, /task board is unchanged/);
    assert.ok(result.invalidFields.includes('response'));
  }
});

test('rejects malformed nested fields and unexpected object properties', () => {
  const malformed = structuredClone(validPlan) as TaskPlan & { debug?: string };
  (malformed.suggestions[0] as unknown as { priority: string }).priority = 'critical';
  malformed.debug = 'unexpected';
  assert.equal(parseTaskPlan(malformed).ok, false);
});

test('renders valid output as typed cards and a separate natural-language note', () => {
  const html = renderToStaticMarkup(createElement(StructuredTaskPlan, { value: validPlan, onRetry: () => {} }));
  assert.match(html, /A note from Tasklane/);
  assert.match(html, /Suggested plan/);
  assert.match(html, /Confirm the launch scope/);
  assert.match(html, /Before you start/);
  assert.match(html, /lang="en-NG"/);
});

test('renders a retryable fallback instead of partial or unexpected content', () => {
  const { checklist: _checklist, ...partial } = validPlan;
  const html = renderToStaticMarkup(createElement(StructuredTaskPlan, { value: partial, onRetry: () => {} }));
  assert.match(html, /couldn’t safely show that plan/);
  assert.match(html, /Retry structured plan/);
  assert.doesNotMatch(html, /Confirm the launch scope/);
  assert.match(html, /No tasks were changed/);
});

test('treats missing and unexpected data loaded from browser storage as untrusted', () => {
  const withUnexpected = { ...validPlan, surprise: 'not part of the contract' };
  assert.equal(parseTaskPlan(undefined).ok, false);
  assert.equal(parseTaskPlan(withUnexpected).ok, false);
});
