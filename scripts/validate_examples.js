const fs = require('fs');
const path = require('path');

const EXAMPLES_DIR = path.join(__dirname, '..', 'examples');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateStep(step, location) {
  assert(step && typeof step === 'object' && !Array.isArray(step), `${location} must be an object`);
  assert(isNonEmptyString(step.id), `${location}.id must be a non-empty string`);
  assert(isNonEmptyString(step.title), `${location}.title must be a non-empty string`);
  if (step.children !== undefined) {
    assert(Array.isArray(step.children), `${location}.children must be an array`);
    step.children.forEach((child, index) => validateStep(child, `${location}.children[${index}]`));
  }
}

function validateProcedure(procedure, fileName) {
  assert(isNonEmptyString(procedure.id), `${fileName}: id is required`);
  assert(procedure.jurisdiction === 'Spain', `${fileName}: jurisdiction must be Spain`);
  assert(isNonEmptyString(procedure.procedureName), `${fileName}: procedureName is required`);
  assert(Array.isArray(procedure.legalBasis) && procedure.legalBasis.length > 0, `${fileName}: legalBasis must not be empty`);
  assert(Array.isArray(procedure.phases) && procedure.phases.length > 0, `${fileName}: phases must not be empty`);

  let previousOrder = 0;
  const phaseIds = new Set();
  procedure.phases.forEach((phase, index) => {
    const location = `${fileName}: phases[${index}]`;
    assert(isNonEmptyString(phase.id), `${location}.id is required`);
    assert(!phaseIds.has(phase.id), `${location}.id is duplicated`);
    phaseIds.add(phase.id);
    assert(isNonEmptyString(phase.title), `${location}.title is required`);
    assert(Number.isInteger(phase.order) && phase.order > previousOrder, `${location}.order must be increasing`);
    previousOrder = phase.order;
    assert(Array.isArray(phase.steps) && phase.steps.length > 0, `${location}.steps must not be empty`);
    phase.steps.forEach((step, stepIndex) => validateStep(step, `${location}.steps[${stepIndex}]`));
  });
}

function main() {
  const files = fs.readdirSync(EXAMPLES_DIR).filter((file) => file.endsWith('.json'));
  assert(files.length > 0, 'No JSON examples found');

  for (const file of files) {
    const filePath = path.join(EXAMPLES_DIR, file);
    const procedure = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    validateProcedure(procedure, file);
    console.log(`OK ${file}`);
  }
}

main();
