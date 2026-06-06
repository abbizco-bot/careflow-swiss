# ADR-097 — Operational State Snapshot as CareFlow World-State Representation

## Status

Accepted

## Date

2026-05-21

## Context

CareFlow-Swiss needs a consistent representation of the operational situation over a defined time horizon in order to support leadership views, rolling planning, planning comparison, and future scenario simulation.

CareFlow already works with several operational concepts:

- employees;
- base qualifications;
- daily assigned functions;
- shifts;
- assignments;
- absences;
- availability requests;
- planning months;
- planning days;
- planning shift templates;
- publication states;
- leadership day, week, and month views;
- rolling planning windows;
- coverage and qualification gaps;
- severity states;
- primary causes and signals.

These data points are stored and processed in different parts of the system. For scenario simulation and impact analysis, CareFlow needs a temporary, consolidated, read-only representation of the current operational situation.

This representation can be understood as CareFlow’s world-state representation: not a philosophical or universal world model, but a concrete operational state of a nursing home over a defined time horizon.

## Decision

CareFlow will introduce the concept of an Operational State Snapshot.

An Operational State Snapshot is a temporary, consolidated, read-only representation of the operational situation for a defined period.

It is built from existing CareFlow data and logic, including:

- planning structures;
- operational shifts;
- assignments;
- employee qualifications;
- daily assigned functions;
- absences;
- availability requests;
- reference plan information;
- validation results;
- gap interpretation;
- severity classification;
- leadership signals.

The Operational State Snapshot is the foundation for scenario simulation and impact comparison.

It is not the single source of truth for operational data. The leading data remains in the underlying domain tables and, in future integrations, in external planning systems such as Polypoint.

The snapshot is a derived analytical representation.

## Purpose

The Operational State Snapshot answers the question:

> What does CareFlow currently know about the operational situation within this time horizon?

It enables CareFlow to compare:

```text
baseline operational state
        vs.
simulated operational state