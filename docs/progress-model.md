# Progress Model

Client-side learner progress using `localStorage`. No backend, no accounts, no data leaves the browser.

## Storage key

```
orccb-progress
```

Single key holding a JSON object. No per-topic keys — one object simplifies migration and export.

## Schema

```json
{
  "version": 1,
  "completedTopics": ["laws-and-regulations", "contracts"],
  "bookmarks": ["oregon-lien-law"],
  "quizAttempts": {
    "laws-and-regulations": {
      "bestScore": 8,
      "lastScore": 6,
      "attemptCount": 3
    }
  },
  "preferences": {
    "studyMode": "read"
  },
  "lastVisitedTopic": "contracts"
}
```

See `src/lib/types.ts` for the `LearnerProgress` TypeScript interface.

## Field definitions

| Field | Type | Description |
|-------|------|-------------|
| `version` | number | Schema version for future migrations. Always `1` for now. |
| `completedTopics` | string[] | Slugs of topics the learner has marked complete. |
| `bookmarks` | string[] | Slugs of bookmarked topics. |
| `quizAttempts` | Record | Per-topic quiz stats: best score, last score, attempt count. |
| `preferences.studyMode` | `"read"` or `"audio-script"` | Preferred content presentation mode. |
| `lastVisitedTopic` | string or null | Slug of the most recently viewed topic. |

## Versioning and migration

The `version` field enables future schema changes without data loss:

1. When loading, check `version` against the current expected version
2. If older, run a migration function that transforms the old shape to the new one
3. Write back the migrated object
4. If the data is malformed or unrecoverable, reset to defaults and warn the user

## Resilience rules

- **Never crash on bad data.** If `localStorage` contains garbage, reset to a clean default.
- **Validate on load.** Check that `completedTopics` contains only strings, `quizAttempts` values have the right shape, etc.
- **No sensitive data.** Progress is convenience, not identity. Losing it is annoying, not harmful.
- **No portability claims.** Progress lives in one browser on one device. Don't imply otherwise.

## Default state

```json
{
  "version": 1,
  "completedTopics": [],
  "bookmarks": [],
  "quizAttempts": {},
  "preferences": {
    "studyMode": "read"
  },
  "lastVisitedTopic": null
}
```

## UI states

| State | What the user sees |
|-------|-------------------|
| Empty | "You haven't started any topics yet." |
| Partial | Progress bar, list of completed and remaining topics. |
| All complete | Congratulatory summary with quiz score overview. |

## Future considerations

- **Export/import**: Let users download their progress as JSON and re-import it on another device.
- **Quiz history**: Store individual attempt records, not just aggregates, to power review-what-you-missed features.
- **Spaced repetition signals**: Track per-question accuracy to suggest review topics. Explicitly deferred to Phase 3+.
