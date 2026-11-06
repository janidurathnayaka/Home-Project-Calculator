
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import {
  Bookmark,
  Check,
  Copy,
  Printer,
  RotateCcw,
  ShieldCheck,
  Share2,
  FileDown,
  Ruler,
  AlertCircle,
  Pencil,
  Save,
  Info,
} from 'lucide-react';

import { calculators } from '@/lib/calculators';
import { enhanceFenceCalculator } from '@/lib/fence-upgrade';

import type {
  CalculatorDefinition,
  SavedEstimate,
} from '@/lib/types';

import {
  amountFromResult,
  convertInput,
  displayMeasuredResult,
  hasPartialMeasurements,
  moneyInCurrency,
  safeReadEstimates,
  saveEstimates,
  unitLabel,
  validateInputs,
} from '@/lib/project-tools';

import type {
  CurrencyCode,
  UnitSystem,
} from '@/lib/project-tools';

import './CalculatorPrint.css';

const preparedCalculators = calculators.map(enhanceFenceCalculator);

function defaultsFor(
  calculator: CalculatorDefinition
): Record<string, string> {
  return Object.fromEntries(
    calculator.fields.map((field) => [
      field.key,
      field.type === 'number'
        ? '0'
        : String(field.defaultValue),
    ])
  );
}

export default function CalculatorClient({
  calculatorSlug,
}: {
  calculatorSlug: string;
}) {
  const calculator = preparedCalculators.find(
    (item) => item.slug === calculatorSlug
  );

  if (!calculator) {
    return (
      <div className="calculator-form-card">
        Calculator not found.{' '}
        <Link href="/calculators">Browse tools</Link>
      </div>
    );
  }

  return <CalculatorPanel calculator={calculator} />;
}

function CalculatorPanel({
  calculator,
}: {
  calculator: CalculatorDefinition;
}) {
  const defaults = useMemo(
    () => defaultsFor(calculator),
    [calculator]
  );

  const [values, setValues] =
    useState<Record<string, string>>(defaults);

  const [unitSystem, setUnitSystem] =
    useState<UnitSystem>('imperial');

  const [currency, setCurrency] =
    useState<CurrencyCode>('USD');

  const [projectName, setProjectName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [labor, setLabor] = useState('0');
  const [delivery, setDelivery] = useState('0');
  const [tax, setTax] = useState('0');
  const [contingency, setContingency] = useState('0');

  const [notice, setNotice] = useState('');
  const [saved, setSaved] = useState(false);
  const [showMath, setShowMath] = useState(false);

  const isFence = calculator.slug === 'fence-calculator';

  // Restore a saved estimate, including older estimates
  // that do not contain the new gateWidth field.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const editId = params.get('edit');

    if (!editId) return;

    const item = safeReadEstimates().find(
      (estimate) =>
        estimate.id === editId &&
        estimate.calculatorSlug === calculator.slug
    );

    if (!item) {
      setNotice('Saved estimate not found on this device.');
      return;
    }

    setValues(
      Object.fromEntries(
        calculator.fields.map((field) => [
          field.key,
          String(
            item.values[field.key] ??
            defaults[field.key]
          ),
        ])
      )
    );

    setProjectName(item.name ?? '');
    setCurrency(item.currency ?? 'USD');
    setUnitSystem(item.unitSystem ?? 'imperial');

    setLabor(String(item.labor ?? 0));
    setDelivery(String(item.delivery ?? 0));
    setTax(String(item.taxPercent ?? 0));
    setContingency(String(item.contingencyPercent ?? 0));

    setEditingId(item.id);
  }, [calculator, defaults]);

  const errors = useMemo(
    () => validateInputs(calculator, values, unitSystem),
    [calculator, values, unitSystem]
  );

  const extraErrors = useMemo(() => {
    const messages: string[] = [];

    const extraFields = [
      { label: 'Labor', value: labor, max: Infinity },
      { label: 'Delivery', value: delivery, max: Infinity },
      { label: 'Tax', value: tax, max: 100 },
      { label: 'Contingency', value: contingency, max: 100 },
    ];

    for (const field of extraFields) {
      const amount = Number(field.value);

      if (
        field.value.trim() === '' ||
        !Number.isFinite(amount) ||
        amount < 0 ||
        amount > field.max
      ) {
        messages.push(
          `${field.label} must be a valid non-negative value` +
          (field.max === Infinity
            ? '.'
            : ` up to ${field.max}%.`)
        );
      }
    }

    if (isFence) {
      const length = Number(values.length || 0);
      const gates = Number(values.gates || 0);
      const gateWidth = Number(values.gateWidth || 0);

      if (
        Number.isFinite(length) &&
        Number.isFinite(gates) &&
        Number.isFinite(gateWidth) &&
        gates * gateWidth > length &&
        length >= 0
      ) {
        messages.push(
          'Total gate opening width cannot exceed total fence length.'
        );
      }
    }

    return messages;
  }, [
    labor,
    delivery,
    tax,
    contingency,
    isFence,
    values,
  ]);

  const canonical = useMemo(() => {
    return Object.fromEntries(
      calculator.fields.map((field) => {
        const raw = values[field.key] ?? '';
        const amount = Number(raw);

        if (field.type === 'select') {
          return [field.key, raw];
        }

        const converted =
          raw !== '' && Number.isFinite(amount)
            ? convertInput(
                amount,
                field.unit,
                unitSystem,
                'imperial'
              )
            : 0;

        return [field.key, converted];
      })
    ) as Record<string, number | string>;
  }, [calculator, values, unitSystem]);

  const partial = useMemo(
    () => hasPartialMeasurements(calculator, canonical),
    [calculator, canonical]
  );

  const ready =
    Object.keys(errors).length === 0 &&
    extraErrors.length === 0 &&
    !partial;

  const results = useMemo(
    () => ready ? calculator.calculate(canonical) : [],
    [calculator, canonical, ready]
  );

  const base = ready ? amountFromResult(results) : 0;

  const direct =
    Number(labor || 0) +
    Number(delivery || 0);

  const taxAmount =
    ((base + direct) * Number(tax || 0)) / 100;

  const contingencyAmount =
    ((base + direct + taxAmount) *
      Number(contingency || 0)) / 100;

  const finalCost =
    base + direct + taxAmount + contingencyAmount;

  const formatMoney = (amount: number) =>
    moneyInCurrency(amount, currency);

  function changeField(key: string, value: string) {
    setValues((previous) => ({
      ...previous,
      [key]: value,
    }));

    setSaved(false);
    setNotice('');
  }

  function switchUnits(next: UnitSystem) {
    if (next === unitSystem) return;

    setValues((previous) =>
      Object.fromEntries(
        calculator.fields.map((field) => {
          const raw = previous[field.key];

          if (
            field.type !== 'number' ||
            !raw ||
            !Number.isFinite(Number(raw))
          ) {
            return [field.key, raw];
          }

          const converted = convertInput(
            Number(raw),
            field.unit,
            unitSystem,
            next
          );

          return [
            field.key,
            String(Number(converted.toFixed(5))),
          ];
        })
      )
    );

    setUnitSystem(next);
    setSaved(false);
  }

  function resetValues() {
    setValues(defaults);
    setUnitSystem('imperial');
    setCurrency('USD');

    setLabor('0');
    setDelivery('0');
    setTax('0');
    setContingency('0');

    setProjectName('');
    setEditingId(null);
    setSaved(false);
    setNotice('');
    setShowMath(false);

    window.history.replaceState(
      {},
      '',
      window.location.pathname
    );
  }

  function saveEstimate() {
    if (!ready) {
      setNotice('Correct the highlighted fields before saving.');
      return;
    }

    const existing = safeReadEstimates();

    const item: SavedEstimate = {
      id: editingId ?? `${Date.now()}-${calculator.slug}`,
      calculatorSlug: calculator.slug,
      calculatorTitle: calculator.title,
      createdAt: new Date().toISOString(),

      values,
      results: [
        ...results,
        {
          label: 'Total project estimate',
          value: formatMoney(finalCost),
          emphasis: true,
        },
      ],

      name:
        projectName.trim() ||
        `${calculator.shortTitle} project`,

      currency,
      unitSystem,

      labor: Number(labor),
      delivery: Number(delivery),
      taxPercent: Number(tax),
      contingencyPercent: Number(contingency),
    };

    const updated = [
      item,
      ...existing.filter(
        (estimate) => estimate.id !== item.id
      ),
    ];

    if (!saveEstimates(updated)) {
      setNotice(
        'Browser storage is full or disabled. Please export your estimate.'
      );
      return;
    }

    setEditingId(item.id);
    setSaved(true);
    setNotice('Estimate saved on this device.');
  }

  const summary = [
    projectName || calculator.title,

    ...calculator.fields.map(
      (field) =>
        `${field.label}: ${values[field.key]} ` +
        unitLabel(field.unit, unitSystem, currency)
    ),

    ...results.map(
      (result) =>
        `${result.label}: ` +
        displayMeasuredResult(
          result.value,
          currency,
          unitSystem
        )
    ),

    `Labor: ${formatMoney(Number(labor))}`,
    `Delivery: ${formatMoney(Number(delivery))}`,
    `Tax: ${tax}%`,
    `Contingency: ${contingency}%`,
    `Project total: ${formatMoney(finalCost)}`,

    'Planning estimate only. Confirm current local prices.',
  ].join('\n');

  async function copyResult() {
    if (!ready) return;

    try {
      await navigator.clipboard.writeText(summary);
      setNotice('Estimate copied to clipboard.');
    } catch {
      setNotice(
        'Clipboard is unavailable. Try Print / PDF.'
      );
    }
  }

  async function shareResult() {
    if (!ready) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: projectName || calculator.title,
          text: summary,
        });
      } else {
        await navigator.clipboard.writeText(summary);
        setNotice(
          'Estimate copied — paste it into WhatsApp or email.'
        );
      }
    } catch {
      setNotice('Sharing was cancelled or unavailable.');
    }
  }

  function exportCsv() {
    if (!ready) return;

    const rows = [
      ['Project', projectName || calculator.title],
      ['Calculator', calculator.title],
      ['Currency', currency],
      ['Units', unitSystem],

      ...calculator.fields.map(
        (field) => [
          field.label,
          `${values[field.key]} ` +
            unitLabel(field.unit, unitSystem, currency),
        ]
      ),

      ...results.map(
        (result) => [
          result.label,
          displayMeasuredResult(
            result.value,
            currency,
            unitSystem
          ),
        ]
      ),

      ['Labor', labor],
      ['Delivery', delivery],
      ['Tax percentage', tax],
      ['Contingency percentage', contingency],
      ['Final total', formatMoney(finalCost)],
    ];

    const csv = rows
      .map((row) =>
        row
          .map(
            (value) =>
              '"' +
              String(value).replace(/"/g, '""') +
              '"'
          )
          .join(',')
      )
      .join('\r\n');

    const url = URL.createObjectURL(
      new Blob([csv], {
        type: 'text/csv;charset=utf-8',
      })
    );

    const link = document.createElement('a');
    link.href = url;
    link.download = `${calculator.slug}-estimate.csv`;
    link.click();

    URL.revokeObjectURL(url);
  }

  const dimensions = calculator.fields.filter(
    (field) =>
      field.type === 'number' &&
      ['ft', 'in', 'sq ft'].includes(field.unit ?? '') &&
      /(length|width|height)/i.test(field.key)
  );

  const dimA = Number(values[dimensions[0]?.key] || 0);
  const dimB = Number(values[dimensions[1]?.key] || 0);

  const estimatedPosts = Number(
    results.find(
      (result) => result.label === 'Estimated posts'
    )?.value ?? 0
  );

  const previewPosts = isFence
    ? Math.min(17, Math.max(2, estimatedPosts || 2))
    : 0;

  const previewGates = Number(values.gates || 0);
  const previewGateWidth = Number(values.gateWidth || 0);
  const fenceLength = Number(values.length || 0);

  return (
    <div className="calculator-shell enhanced-calculator">
      {/* INTERACTIVE CALCULATOR FORM */}
      <section className="calculator-form-card">
        <div className="calc-card-head">
          <div>
            <span className="eyebrow">PROJECT INPUTS</span>
            <h2>Build your estimate</h2>
          </div>

          <button
            type="button"
            className="text-btn"
            onClick={resetValues}
          >
            <RotateCcw size={15} />
            Reset
          </button>
        </div>

        <div className="project-settings">
          <label className="settings-wide">
            Project name
            <input
              value={projectName}
              onChange={(event) => {
                setProjectName(event.target.value);
                setSaved(false);
              }}
              placeholder="e.g. Kitchen renovation"
              maxLength={80}
            />
          </label>

          <label>
            Measurements
            <select
              value={unitSystem}
              onChange={(event) =>
                switchUnits(event.target.value as UnitSystem)
              }
            >
              <option value="imperial">
                Imperial (ft / in)
              </option>
              <option value="metric">
                Metric (m / cm)
              </option>
            </select>
          </label>

          <label>
            Local currency
            <select
              value={currency}
              onChange={(event) => {
                setCurrency(
                  event.target.value as CurrencyCode
                );
                setSaved(false);
              }}
            >
              <option value="USD">USD ($)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD (CA$)</option>
            </select>
          </label>
        </div>

        <p className="settings-hint">
          <Info size={14} />
          Enter supplier prices in the selected currency.
          Currency selection changes the label, not exchange
          rates. Converted metric values are approximate.
        </p>

        <div className="field-grid">
          {calculator.fields.map((field) => (
            <label className="field" key={field.key}>
              <span className="field-label">
                {field.label}
              </span>

              <div
                className={
                  `input-wrap ` +
                  (errors[field.key] ? 'field-invalid' : '')
                }
              >
                {field.type === 'select' ? (
                  <select
                    value={values[field.key] ?? ''}
                    onChange={(event) =>
                      changeField(
                        field.key,
                        event.target.value
                      )
                    }
                  >
                    {field.options?.map((option) => (
                      <option
                        value={option.value}
                        key={option.value}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="number"
                    inputMode="decimal"
                    value={values[field.key] ?? '0'}
                    min="0"
                    max={field.max}
                    step="any"
                    onFocus={(event) =>
                      event.currentTarget.select()
                    }
                    onChange={(event) =>
                      changeField(
                        field.key,
                        event.target.value
                      )
                    }
                    aria-invalid={Boolean(
                      errors[field.key]
                    )}
                  />
                )}

                {field.unit && (
                  <span className="unit">
                    {unitLabel(
                      field.unit,
                      unitSystem,
                      currency
                    )}
                  </span>
                )}
              </div>

              {errors[field.key] ? (
                <small className="field-error">
                  {errors[field.key]}
                </small>
              ) : (
                field.help && <small>{field.help}</small>
              )}
            </label>
          ))}
        </div>

        {/* FENCE-SPECIFIC DIAGRAM */}
        {isFence && (
          <div className="room-preview hpc-fence-preview">
            <div className="room-preview-title">
              <Ruler size={16} />
              <strong>Fence layout preview</strong>
              <span>Schematic · not to scale</span>
            </div>

            <svg
              viewBox="0 0 660 140"
              className="hpc-fence-svg"
              role="img"
              aria-label="Illustrative fence line with post markers"
            >
              <line
                x1="40"
                y1="62"
                x2="620"
                y2="62"
                stroke="#8cad78"
                strokeWidth="12"
                strokeLinecap="round"
              />

              {Array.from(
                { length: previewPosts },
                (_, index) => {
                  const x =
                    40 +
                    (580 * index) /
                      Math.max(previewPosts - 1, 1);

                  return (
                    <g key={index}>
                      <line
                        x1={x}
                        y1="37"
                        x2={x}
                        y2="88"
                        stroke="#425f37"
                        strokeWidth="7"
                        strokeLinecap="round"
                      />
                      <circle
                        cx={x}
                        cy="33"
                        r="6"
                        fill="#b7d596"
                        stroke="#425f37"
                        strokeWidth="2"
                      />
                    </g>
                  );
                }
              )}

              {previewGates > 0 &&
                previewGateWidth > 0 && (
                  <g>
                    <rect
                      x="285"
                      y="38"
                      width="90"
                      height="48"
                      rx="4"
                      fill="#fff6df"
                      stroke="#b68a44"
                      strokeWidth="3"
                    />
                    <text
                      x="330"
                      y="67"
                      textAnchor="middle"
                      fontSize="13"
                      fontWeight="700"
                      fill="#6d5129"
                    >
                      Gate
                    </text>
                  </g>
                )}

              <text
                x="330"
                y="123"
                textAnchor="middle"
                fontSize="15"
                fontWeight="700"
                fill="#425f37"
              >
                {fenceLength || 0}{' '}
                {unitLabel('ft', unitSystem, currency)}
                {' total fence length'}
              </text>
            </svg>

            <p className="hpc-fence-note">
              {estimatedPosts} estimated posts ·{' '}
              {previewGates} gate(s).
              {' '}Post positions and gate locations are illustrative.
            </p>
          </div>
        )}

        {/* EXISTING PREVIEW FOR OTHER CALCULATORS */}
        {!isFence && dimensions.length >= 2 && (
          <div className="room-preview">
            <div className="room-preview-title">
              <Ruler size={16} />
              <strong>2D area preview</strong>
              <span>Diagram only · not to scale</span>
            </div>

            <div
              className="room-diagram"
              style={{
                width: `${
                  Math.max(
                    110,
                    Math.min(
                      280,
                      dimA > 0 && dimB > 0
                        ? 210 * Math.sqrt(
                            dimA / Math.max(dimB, 0.01)
                          )
                        : 160
                    )
                  )
                }px`,

                aspectRatio: `${
                  Math.max(
                    0.5,
                    Math.min(
                      2.3,
                      dimA > 0 && dimB > 0
                        ? dimA / dimB
                        : 1.5
                    )
                  )
                }`,
              }}
            >
              <span>
                {dimA || 0}{' '}
                {unitLabel(
                  dimensions[0]?.unit,
                  unitSystem,
                  currency
                )}
                {' × '}
                {dimB || 0}{' '}
                {unitLabel(
                  dimensions[1]?.unit,
                  unitSystem,
                  currency
                )}
              </span>
            </div>
          </div>
        )}
      </section>

      {/* LIVE RESULT */}
      <aside className="results-card" id="estimate-report">
        <span className="eyebrow light">
          LIVE ESTIMATE
        </span>

        <h2>
          {projectName || 'Your project snapshot'}
        </h2>

        {!ready ? (
          <div className="validation-panel">
            <AlertCircle size={19} />

            <div>
              <p>
                {Object.keys(errors).length > 0 ||
                extraErrors.length > 0
                  ? 'Correct the highlighted values to calculate safely.'
                  : 'Enter all required measurements to see your result.'}
              </p>

              {extraErrors.map((error) => (
                <small key={error}>{error}</small>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="result-list">
              {results.map((result) => (
                <div
                  className={
                    `result-row ` +
                    (result.emphasis ? 'emphasis' : '')
                  }
                  key={result.label}
                >
                  <span>{result.label}</span>
                  <strong>
                    {displayMeasuredResult(
                      result.value,
                      currency,
                      unitSystem
                    )}
                  </strong>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="explainer-toggle"
              onClick={() =>
                setShowMath((previous) => !previous)
              }
              aria-expanded={showMath}
            >
              <Info size={15} />
              {showMath ? 'Hide' : 'Show'} calculation explanation
            </button>

            {showMath && (
              <div className="formula-note">
                <p>{calculator.intro}</p>

                <p>
                  Measurements are converted to the
                  calculator&apos;s base units before the
                  formula runs.
                </p>

                <ul>
                  {calculator.assumptions
                    .slice(0, 4)
                    .map((assumption) => (
                      <li key={assumption}>
                        {assumption}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </>
        )}

        {/* ADVANCED COSTS */}
        <div className="cost-breakdown">
          <h3>Advanced cost breakdown</h3>

          <p className="light-caption">
            Base cost comes from the calculator.
            Add your local labor, delivery, tax,
            and contingency.
          </p>

          <div className="cost-field-grid">
            {[
              { label: 'Labor', val: labor, set: setLabor },
              {
                label: 'Delivery / extras',
                val: delivery,
                set: setDelivery,
              },
              { label: 'Tax (%)', val: tax, set: setTax },
              {
                label: 'Contingency (%)',
                val: contingency,
                set: setContingency,
              },
            ].map((field) => (
              <label key={field.label}>
                {field.label}

                <input
                  type="number"
                  value={field.val}
                  min="0"
                  step="any"
                  onFocus={(event) =>
                    event.currentTarget.select()
                  }
                  onChange={(event) => {
                    field.set(event.target.value);
                    setSaved(false);
                  }}
                />
              </label>
            ))}
          </div>

          <div className="cost-line">
            <span>Base material / budget</span>
            <strong>
              {ready ? formatMoney(base) : '—'}
            </strong>
          </div>

          <div className="cost-line">
            <span>Tax</span>
            <strong>
              {ready ? formatMoney(taxAmount) : '—'}
            </strong>
          </div>

          <div className="cost-line">
            <span>Extra contingency</span>
            <strong>
              {ready
                ? formatMoney(contingencyAmount)
                : '—'}
            </strong>
          </div>

          <div className="cost-total">
            <span>Estimated project total</span>
            <strong>
              {ready ? formatMoney(finalCost) : '—'}
            </strong>
          </div>

          <div
            className="cost-bar"
            aria-hidden="true"
          >
            <span
              style={{
                width: `${
                  finalCost > 0
                    ? (100 * base) / finalCost
                    : 0
                }%`,
              }}
            />

            <i
              style={{
                width: `${
                  finalCost > 0
                    ? (100 * direct) / finalCost
                    : 0
                }%`,
              }}
            />

            <b
              style={{
                width: `${
                  finalCost > 0
                    ? (100 *
                        (taxAmount + contingencyAmount)) /
                      finalCost
                    : 0
                }%`,
              }}
            />
          </div>
        </div>

        {/* SAVE, PRINT, COPY, SHARE AND CSV */}
        <div className="result-actions report-actions">
          <button
            type="button"
            className="primary-dark"
            disabled={!ready}
            onClick={saveEstimate}
          >
            {saved ? (
              <Check size={17} />
            ) : editingId ? (
              <Save size={17} />
            ) : (
              <Bookmark size={17} />
            )}

            {saved
              ? 'Saved'
              : editingId
              ? 'Update saved'
              : 'Save estimate'}
          </button>

          <button
            type="button"
            className="icon-action"
            disabled={!ready}
            onClick={() => window.print()}
            title="Save to PDF via browser print"
          >
            <Printer size={17} />
            <span>PDF / Print</span>
          </button>

          <button
            type="button"
            className="icon-action"
            disabled={!ready}
            onClick={copyResult}
            title="Copy estimate"
          >
            <Copy size={17} />
          </button>

          <button
            type="button"
            className="icon-action"
            disabled={!ready}
            onClick={shareResult}
            title="Share estimate"
          >
            <Share2 size={17} />
          </button>

          <button
            type="button"
            className="icon-action"
            disabled={!ready}
            onClick={exportCsv}
            title="Export CSV"
          >
            <FileDown size={17} />
          </button>
        </div>

        <p className="settings-hint on-dark">
          PDF: select <strong>Save as PDF</strong>
          {' '}in the browser Print dialog.
          Estimates remain private unless you share them.
        </p>

        {notice && (
          <p className="calculator-notice" role="status">
            {notice}
          </p>
        )}

        {editingId && (
          <Link href="/saved" className="saved-return">
            <Pencil size={14} />
            View saved projects
          </Link>
        )}

        <div className="trust-note">
          <ShieldCheck size={17} />

          <span>
            <strong>Planning estimate only.</strong>
            {' '}Verify dimensions, contractor quotes,
            product labels, local code, and supplier
            pricing before purchase.
            This is not a structural design.
          </span>
        </div>
      </aside>

      {/* DEDICATED PRINT REPORT */}
      <section
        className="hpc-print-report"
        aria-label="Printable project estimate"
      >
        <header className="hpc-print-header">
          <p className="hpc-print-brand">
            HOME PROJECT CALCULATOR
          </p>

          <h1>{projectName || calculator.title}</h1>

          <p>
            {calculator.title} ·{' '}
            {currency} ·{' '}
            {unitSystem === 'imperial'
              ? 'Imperial'
              : 'Metric'}
          </p>
        </header>

        <div className="hpc-print-section">
          <h2>Project inputs</h2>

          <div className="hpc-print-fields">
            {calculator.fields.map((field) => (
              <div key={field.key}>
                <span>{field.label}</span>
                <strong>
                  {values[field.key]}{' '}
                  {unitLabel(
                    field.unit,
                    unitSystem,
                    currency
                  )}
                </strong>
              </div>
            ))}
          </div>
        </div>

        <div className="hpc-print-section">
          <h2>Estimated materials and quantities</h2>

          <div className="hpc-print-lines">
            {results.map((result) => (
              <div key={result.label}>
                <span>{result.label}</span>

                <strong>
                  {displayMeasuredResult(
                    result.value,
                    currency,
                    unitSystem
                  )}
                </strong>
              </div>
            ))}
          </div>
        </div>

        <div className="hpc-print-section">
          <h2>Project cost summary</h2>

          <div className="hpc-print-lines">
            <div>
              <span>Materials / base budget</span>
              <strong>{formatMoney(base)}</strong>
            </div>

            <div>
              <span>Labor</span>
              <strong>
                {formatMoney(Number(labor || 0))}
              </strong>
            </div>

            <div>
              <span>Delivery / extras</span>
              <strong>
                {formatMoney(Number(delivery || 0))}
              </strong>
            </div>

            <div>
              <span>Tax ({tax}%)</span>
              <strong>
                {formatMoney(taxAmount)}
              </strong>
            </div>

            <div>
              <span>Contingency ({contingency}%)</span>
              <strong>
                {formatMoney(contingencyAmount)}
              </strong>
            </div>

            <div className="hpc-print-total">
              <span>ESTIMATED PROJECT TOTAL</span>
              <strong>
                {formatMoney(finalCost)}
              </strong>
            </div>
          </div>
        </div>

        <footer className="hpc-print-footer">
          Planning estimate only. Confirm measurements,
          materials, local prices, taxes, and professional
          requirements before purchasing.
        </footer>
      </section>
    </div>
  );
}
