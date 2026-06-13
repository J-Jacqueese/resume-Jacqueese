"""Validate AI-generated data against JSON Schemas using jsonschema library."""

import json
import os
from typing import Any

from jsonschema import validate, ValidationError


_SCHEMA_DIR = os.path.join(os.path.dirname(__file__), '..', 'schemas')


def _load_schema(name: str) -> dict[str, Any]:
    """Load a JSON Schema file from the schemas directory."""
    path = os.path.join(_SCHEMA_DIR, name)
    with open(path, 'r') as f:
        return json.load(f)


def validate_raw_record(record: dict[str, Any]) -> tuple[bool, list[str]]:
    """
    Validate a record against RawRecord schema.

    Returns:
        Tuple of (is_valid, list_of_error_messages)
    """
    schema = _load_schema('raw_record.schema.json')
    try:
        validate(instance=record, schema=schema)
        return True, []
    except ValidationError as e:
        return False, [str(e)]


def validate_structured_insight(insight: dict[str, Any]) -> tuple[bool, list[str]]:
    """
    Validate an insight against StructuredInsight schema.
    Also runs logical validation: confidence in [0,1], magnitude in [1,5].

    Returns:
        Tuple of (is_valid, list_of_error_messages)
    """
    schema = _load_schema('structured_insight.schema.json')
    errors: list[str] = []

    try:
        validate(instance=insight, schema=schema)
    except ValidationError as e:
        errors.append(str(e))

    # Logical validation beyond JSON Schema
    classification = insight.get("classification", {})
    confidence = classification.get("confidence")
    if confidence is not None and not (0 <= confidence <= 1):
        errors.append(f"classification.confidence must be between 0 and 1, got {confidence}")

    impact = insight.get("impact_assessment", {})
    magnitude = impact.get("magnitude")
    if magnitude is not None and not (1 <= magnitude <= 5):
        errors.append(f"impact_assessment.magnitude must be between 1 and 5, got {magnitude}")

    sentiment = insight.get("sentiment", {})
    certainty = sentiment.get("certainty")
    if certainty is not None and not (0 <= certainty <= 1):
        errors.append(f"sentiment.certainty must be between 0 and 1, got {certainty}")

    is_valid = len(errors) == 0
    return is_valid, errors


def validate_relation_graph(graph: dict[str, Any]) -> tuple[bool, list[str]]:
    """
    Validate a graph against RelationGraph schema.

    Returns:
        Tuple of (is_valid, list_of_error_messages)
    """
    schema = _load_schema('relation_graph.schema.json')
    try:
        validate(instance=graph, schema=schema)
        return True, []
    except ValidationError as e:
        return False, [str(e)]


def validate_all_insights(insights: list[dict[str, Any]]) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    """
    Validate a batch of structured insights.

    Returns:
        Tuple of (valid_insights, rejected_insights_with_errors)
    """
    valid: list[dict[str, Any]] = []
    rejected: list[dict[str, Any]] = []

    for insight in insights:
        is_valid, errors = validate_structured_insight(insight)
        if is_valid:
            valid.append(insight)
        else:
            rejected.append({"insight": insight, "errors": errors})

    return valid, rejected
