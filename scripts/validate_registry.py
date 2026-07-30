#!/usr/bin/env python3
"""Validate active skill packages with no third-party dependencies."""

from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REGISTRY = ROOT / "registry"
RESOURCE_DIRS = ("references", "scripts", "assets")
EFFECTS = {
    "read_local",
    "write_files",
    "git_write",
    "run_tests",
    "network_read",
    "network_write",
    "external_write",
    "destructive_git",
}


def frontmatter(text: str) -> tuple[dict[str, str], list[str]]:
    errors: list[str] = []
    if not text.startswith("---\n"):
        return {}, ["missing opening YAML frontmatter delimiter"]
    try:
        raw, _ = text[4:].split("\n---\n", 1)
    except ValueError:
        return {}, ["missing closing YAML frontmatter delimiter"]

    values: dict[str, str] = {}
    for line in raw.splitlines():
        if not line.strip():
            continue
        match = re.fullmatch(r"([a-z_]+):\s*(.+)", line)
        if not match:
            errors.append(f"unsupported frontmatter line: {line!r}")
            continue
        key, value = match.groups()
        values[key] = value.strip().strip("\"'")
    return values, errors


def validate_skill(
    skill_dir: Path, externally_managed: bool = False
) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []
    skill_file = skill_dir / "SKILL.md"
    text = skill_file.read_text(encoding="utf-8")
    metadata, frontmatter_errors = frontmatter(text)
    errors.extend(frontmatter_errors)

    extra_keys = sorted(set(metadata) - {"name", "description"})
    if extra_keys:
        errors.append(f"unsupported frontmatter keys: {', '.join(extra_keys)}")
    if metadata.get("name") != skill_dir.name:
        errors.append(
            f"name {metadata.get('name')!r} does not match directory {skill_dir.name!r}"
        )
    description = metadata.get("description", "")
    if not description:
        errors.append("description is missing")
    if "<" in description or ">" in description:
        errors.append("description contains angle brackets")
    if "DEPRECATED" in description.upper():
        errors.append("deprecated skill is present in the active registry")

    lines = text.splitlines()
    if len(lines) > 500:
        warnings.append(f"SKILL.md is {len(lines)} lines; review progressive disclosure")

    mentioned = set(
        match.rstrip(".,:;)")
        for match in re.findall(
            r"`((?:references|scripts|assets)/[^`\s]+)", text
        )
    )
    for relative in sorted(mentioned):
        if not (skill_dir / relative).exists():
            message = f"missing referenced resource: {relative}"
            if externally_managed:
                warnings.append(message + " (external source preserved)")
            else:
                errors.append(message)

    for dirname in RESOURCE_DIRS:
        resource_root = skill_dir / dirname
        if not resource_root.exists():
            continue
        for resource in sorted(path for path in resource_root.rglob("*") if path.is_file()):
            relative = resource.relative_to(skill_dir).as_posix()
            parent_prefix = resource.parent.relative_to(skill_dir).as_posix() + "/"
            if relative not in text and parent_prefix not in mentioned:
                message = f"bundled resource is not linked from SKILL.md: {relative}"
                if externally_managed:
                    warnings.append(message + " (external source preserved)")
                else:
                    errors.append(message)
            if dirname == "references":
                resource_text = resource.read_text(encoding="utf-8")
                if len(resource_text.splitlines()) > 100 and "## Contents" not in resource_text:
                    warnings.append(f"{relative} is over 100 lines without a Contents section")

    agent_metadata = skill_dir / "agents" / "openai.yaml"
    if not agent_metadata.exists():
        warnings.append("agents/openai.yaml is missing")
    else:
        agent_text = agent_metadata.read_text(encoding="utf-8")
        display_match = re.search(r'^\s+display_name:\s+"([^"]+)"\s*$', agent_text, re.M)
        short_match = re.search(
            r'^\s+short_description:\s+"([^"]+)"\s*$', agent_text, re.M
        )
        prompt_match = re.search(
            r'^\s+default_prompt:\s+"([^"]+)"\s*$', agent_text, re.M
        )
        if not display_match:
            errors.append("agents/openai.yaml has no quoted display_name")
        if not short_match:
            errors.append("agents/openai.yaml has no quoted short_description")
        elif not 25 <= len(short_match.group(1)) <= 64:
            errors.append(
                "agents/openai.yaml short_description must be 25–64 characters"
            )
        if not prompt_match:
            warnings.append("agents/openai.yaml has no default_prompt")
        elif f"${skill_dir.name}" not in prompt_match.group(1):
            errors.append(
                f"agents/openai.yaml default_prompt must mention ${skill_dir.name}"
            )

    return errors, warnings


def main() -> int:
    skill_dirs = sorted(path.parent for path in REGISTRY.glob("*/SKILL.md"))
    errors: list[str] = []
    warnings: list[str] = []
    catalog_file = ROOT / "catalog.json"
    catalog = json.loads(catalog_file.read_text(encoding="utf-8"))
    external = {
        name: metadata
        for name, metadata in catalog.get("skills", {}).items()
        if metadata.get("provenance") == "external"
    }

    for skill_dir in skill_dirs:
        skill_errors, skill_warnings = validate_skill(
            skill_dir, externally_managed=skill_dir.name in external
        )
        errors.extend(f"{skill_dir.name}: {message}" for message in skill_errors)
        warnings.extend(f"{skill_dir.name}: {message}" for message in skill_warnings)

    active_names = {path.name for path in skill_dirs}
    profiled_names: set[str] = set()
    for profile_name, profile in catalog.get("profiles", {}).items():
        profile_skills = profile.get("skills", [])
        if len(profile_skills) != len(set(profile_skills)):
            errors.append(f"catalog: profile {profile_name!r} contains duplicate skills")
        for skill_name in profile_skills:
            if skill_name not in active_names:
                errors.append(
                    f"catalog: profile {profile_name!r} references inactive skill "
                    f"{skill_name!r}"
                )
            profiled_names.add(skill_name)
    for skill_name in sorted(active_names - profiled_names):
        warnings.append(f"catalog: active skill {skill_name!r} is not in any profile")

    for skill_name, metadata in external.items():
        if skill_name not in active_names:
            errors.append(f"catalog: external skill {skill_name!r} is not active")
            continue
        origin_commit = metadata.get("origin_commit")
        if not origin_commit:
            errors.append(f"catalog: external skill {skill_name!r} has no origin_commit")
            continue
        try:
            original = subprocess.check_output(
                [
                    "git",
                    "show",
                    f"{origin_commit}:registry/{skill_name}/SKILL.md",
                ],
                cwd=ROOT,
            )
        except (OSError, subprocess.CalledProcessError):
            warnings.append(
                f"catalog: could not verify external source for {skill_name!r}"
            )
            continue
        current = (REGISTRY / skill_name / "SKILL.md").read_bytes()
        if current != original:
            errors.append(
                f"catalog: external skill {skill_name!r} differs from "
                f"origin commit {origin_commit}"
            )

    eval_file = ROOT / "evals" / "high_use_cases.json"
    if eval_file.exists():
        cases = json.loads(eval_file.read_text(encoding="utf-8"))
        seen_ids: set[str] = set()
        for case in cases:
            case_id = case.get("id", "<missing>")
            if case_id in seen_ids:
                errors.append(f"evals: duplicate case id {case_id!r}")
            seen_ids.add(case_id)
            if case.get("expected_skill") not in active_names:
                errors.append(
                    f"evals: {case_id} references inactive skill "
                    f"{case.get('expected_skill')!r}"
                )
            if not case.get("prompt") or not case.get("expected_mode"):
                errors.append(f"evals: {case_id} is missing a prompt or expected mode")
            delegates = case.get("expected_delegates", [])
            duplicate_delegates = sorted(
                name for name in set(delegates) if delegates.count(name) > 1
            )
            if duplicate_delegates:
                errors.append(
                    f"evals: {case_id} repeats delegates "
                    f"{', '.join(duplicate_delegates)}"
                )
            inactive_delegates = sorted(set(delegates) - active_names)
            if inactive_delegates:
                errors.append(
                    f"evals: {case_id} references inactive delegates "
                    f"{', '.join(inactive_delegates)}"
                )
            if case.get("expected_skill") in delegates:
                errors.append(
                    f"evals: {case_id} lists its router as a delegate"
                )
            allowed = set(case.get("allowed_effects", []))
            forbidden = set(case.get("forbidden_effects", []))
            unknown = sorted((allowed | forbidden) - EFFECTS)
            if unknown:
                errors.append(
                    f"evals: {case_id} uses unknown effects {', '.join(unknown)}"
                )
            overlap = sorted(allowed & forbidden)
            if overlap:
                errors.append(
                    f"evals: {case_id} both allows and forbids {', '.join(overlap)}"
                )

    for message in errors:
        print(f"ERROR: {message}")
    for message in warnings:
        print(f"WARNING: {message}")
    print(
        f"Validated {len(skill_dirs)} active skills: "
        f"{len(errors)} error(s), {len(warnings)} warning(s); "
        f"{len(seen_ids) if eval_file.exists() else 0} eval case(s)."
    )
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
