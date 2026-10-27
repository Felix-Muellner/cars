const MIN_YEAR = 1886;

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

// returns { car, errors }; car holds trimmed values and is only set when errors is empty
function validateCarInput(body) {
  const { make, model, year } = body ?? {};
  const maxYear = new Date().getFullYear() + 1;
  const errors = [];

  if (!isNonEmptyString(make)) {
    errors.push("make must be a non-empty string");
  }
  if (!isNonEmptyString(model)) {
    errors.push("model must be a non-empty string");
  }
  if (!Number.isInteger(year) || year < MIN_YEAR || year > maxYear) {
    errors.push(`year must be an integer from ${MIN_YEAR} to next year`);
  }

  if (errors.length > 0) {
    return { errors };
  }

  return { car: { make: make.trim(), model: model.trim(), year }, errors };
}

// returns the id as a number, or undefined if raw is not a positive integer
function parseCarId(raw) {
  if (!/^[1-9]\d*$/.test(raw)) {
    return undefined;
  }

  return Number(raw);
}

module.exports = { validateCarInput, parseCarId };
