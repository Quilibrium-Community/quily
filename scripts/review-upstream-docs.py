#!/usr/bin/env python3
"""Flag public Quilibrium upstream changes for documentation review."""

import argparse
import base64
import hashlib
import html
import json
import os
import re
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import quote, urlencode
from urllib.request import Request, urlopen

ORG = "QuilibriumNetwork"
STATE_BRANCH = "upstream-docs-review-state"
STATE_FILE = "checkpoint.json"
GUIDES = {
    "coppice-client": "Coppice-Client.md",
    "coppice-research": "Coppice-Client.md",
    "klearu": "Klearu.md",
    "metavm": "MetaVM-ZK-Proof-System.md",
    "quorum-desktop": "auto/ecosystem/quorum.md",
    "quorum-mobile": "auto/ecosystem/quorum.md",
    "quorum-shared": "auto/ecosystem/quorum.md",
}
TEST_DIRECTORIES = {"test", "tests", "__tests__", "testdata", "fixtures", "__fixtures__"}


def api(path, *, query=None, method="GET", data=None, missing=()):
    if query:
        path += "?" + urlencode(query)
    headers = {"Accept": "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28",
               "User-Agent": "quily-upstream-docs-review"}
    if token := os.environ.get("GH_TOKEN"):
        headers["Authorization"] = "Bearer " + token
    body = json.dumps(data).encode() if data is not None else None
    if body is not None:
        headers["Content-Type"] = "application/json"
    request = Request("https://api.github.com" + path, body, headers, method=method)
    try:
        with urlopen(request, timeout=20) as response:
            return json.load(response)
    except HTTPError as error:
        if error.code in missing:
            return None
        raise RuntimeError(f"GitHub returned HTTP {error.code} for {method} {path}") from error


def pages(path, **query):
    page = 1
    while True:
        items = api(path, query={**query, "per_page": 100, "page": page})
        yield from items
        if len(items) < 100:
            return
        page += 1


def markdown_text(value):
    # Upstream text is untrusted. Keep it on one line and suppress mentions and links.
    clean = " ".join(value.split())[:180]
    return re.sub(r"([\\`*_{}\[\]()#!|~])", r"\\\1", html.escape(clean)).replace("@", "&#64;")


def relevant(path):
    if not path:
        return False
    *directories, name = path.lower().split("/")
    if TEST_DIRECTORIES.intersection(directories):
        return False
    if directories[:2] in ([".github", "workflows"], [".github", "issue_template"]):
        return False
    return not re.search(r"\.(?:test|spec)\.[cm]?[jt]sx?$|_test\.go$", name)


def inspect_upstream(previous, guide_root):
    repos = {
        repo["name"]: repo
        for repo in pages(f"/orgs/{ORG}/repos", type="public")
        if not repo["private"] and repo["visibility"] == "public"
    }
    if not repos:
        raise RuntimeError("GitHub returned no public repositories")
    checkpoint = {"seen_ids": sorted(set(previous["seen_ids"] if previous else ()) |
                                     {repo["id"] for repo in repos.values()}), "watches": {}}
    discoveries = []
    reviews = []
    if previous is not None:
        for name, repo in sorted(repos.items()):
            if repo["id"] not in previous["seen_ids"]:
                description = markdown_text(repo["description"] or "No description supplied.")
                discoveries.append(
                    f"- [ ] [`{name}`](https://github.com/{ORG}/{name}) — {description} "
                    "Check whether Quily needs new coverage."
                )

    for name, guide in GUIDES.items():
        old = previous["watches"].get(name) if previous else None
        if name not in repos:
            print(f"::warning::Watched repository {name} is absent from the public inventory")
            if old:
                checkpoint["watches"][name] = {**old, "public": False}
                if old["public"]:
                    reviews.append(
                        f"- [ ] `{name}` is no longer in the public organization inventory. "
                        f"Check links in [`{guide}`]({guide_root}/{guide})."
                    )
            continue
        repo = repos[name]
        upstream = f"/repos/{ORG}/{name}"
        url = f"https://github.com/{ORG}/{name}"
        branch = repo["default_branch"]
        head = api(f"{upstream}/commits/{quote(branch, safe='')}")["sha"]
        releases = [release for release in api(f"{upstream}/releases", query={"per_page": 100})
                    if not release["draft"]]
        current = {"id": repo["id"], "branch": branch, "head": head,
                   "public": True, "releases": sorted(release["id"] for release in releases)}
        checkpoint["watches"][name] = current
        if not old:
            continue
        reasons = []
        if old["id"] != current["id"]:
            reasons.append("repository was replaced")
        if old["branch"] != branch:
            reasons.append(f"default branch changed to `{markdown_text(branch)}`")
        added_releases = [release for release in releases if release["id"] not in old["releases"]]
        if added_releases:
            links = [
                f"[`{markdown_text(release['tag_name'])}`]({url}/releases/tag/{quote(release['tag_name'], safe='')})"
                for release in added_releases[:3]
            ]
            extra = f" and {len(added_releases) - 3} more" if len(added_releases) > 3 else ""
            reasons.append(f"published releases appeared ({', '.join(links)}{extra})")
        if old["head"] != head and old["id"] == current["id"]:
            comparison = api(f"{upstream}/compare/{old['head']}...{head}",
                             query={"per_page": 1}, missing=(404, 409, 422))
            if comparison is None or comparison["status"] != "ahead":
                reasons.append("branch history changed or the comparison is unavailable")
            else:
                files = comparison.get("files")
                if files is None or len(files) >= 300:
                    reasons.append("GitHub may have omitted changed paths from the comparison")
                names = [
                    f"`{markdown_text(file['filename'])}`"
                    for file in files or []
                    if relevant(file["filename"])
                    or relevant(file.get("previous_filename", ""))
                ]
                if names:
                    extra = f" and {len(names) - 5} more" if len(names) > 5 else ""
                    reasons.append(f"changed files ({', '.join(names[:5])}{extra})")
            if reasons:
                reasons.append(f"[compare commits]({url}/compare/{old['head']}...{head})")
        if reasons:
            reviews.append(
                f"- [ ] `{name}` → [`{guide}`]({guide_root}/{guide}) — "
                + "; ".join(reasons) + ". Check whether a claim in this guide needs updating."
            )
    return checkpoint, discoveries, reviews


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--publish", action="store_true", help="create the issue and save the checkpoint")
    args = parser.parse_args()
    repository = os.environ.get("GITHUB_REPOSITORY", "Quilibrium-Community/quily")
    root = f"/repos/{repository}"
    revision = os.environ.get("GITHUB_SHA")
    if args.publish and not (os.environ.get("GH_TOKEN") and revision):
        parser.error("--publish requires the workflow token and commit SHA")

    ref_path = f"{root}/git/ref/heads/{STATE_BRANCH}"
    ref = api(ref_path, missing=(404,))
    path = f"{root}/contents/{STATE_FILE}"
    saved = api(path, query={"ref": STATE_BRANCH}, missing=(404,)) if ref else None
    previous = json.loads(base64.b64decode(saved["content"])) if saved else None
    guide_root = f"https://github.com/{repository}/blob/{revision or 'main'}/docs/custom"
    current, discoveries, reviews = inspect_upstream(previous, guide_root)

    sections = []
    if discoveries:
        sections.append("### Newly visible public repositories\n\n" + "\n".join(discoveries))
    if reviews:
        sections.append("### Guides to review\n\n" + "\n".join(reviews))
    report = "\n\n".join(sections)
    summary = report or (
        f"Baseline prepared for {len(current['seen_ids'])} public repositories and "
        f"{len(current['watches'])} watched repositories."
        if previous is None else "No upstream changes flagged for documentation review."
    )
    print(summary)
    if summary_file := os.environ.get("GITHUB_STEP_SUMMARY"):
        with Path(summary_file).open("a", encoding="utf-8") as file:
            file.write(summary + "\n")
    if not args.publish or current == previous:
        return

    if report:
        identity = [previous, current, report.replace(guide_root, "docs/custom")]
        fingerprint = hashlib.sha256(json.dumps(identity, sort_keys=True).encode()).hexdigest()
        marker = f"<!-- upstream-docs-review:{fingerprint} -->"
        issues = pages(f"{root}/issues", state="all", creator="github-actions[bot]")
        if not any(marker in (issue.get("body") or "") for issue in issues):
            issue = api(f"{root}/issues", method="POST", data={
                "title": "Review upstream changes for Quily docs",
                "body": report + "\n\nClose this issue after reviewing the checklist.\n\n" + marker,
            })
            print(f"Created {issue['html_url']}")

    # Save only after issue creation succeeds. A retry can reuse an existing issue.
    if not ref:
        api(f"{root}/git/refs", method="POST",
            data={"ref": f"refs/heads/{STATE_BRANCH}", "sha": revision})
    payload = {
        "message": "chore: save upstream docs review checkpoint",
        "branch": STATE_BRANCH,
        "content": base64.b64encode((json.dumps(current, indent=2) + "\n").encode()).decode(),
    }
    if saved:
        payload["sha"] = saved["sha"]
    api(path, method="PUT", data=payload)


if __name__ == "__main__":
    main()
