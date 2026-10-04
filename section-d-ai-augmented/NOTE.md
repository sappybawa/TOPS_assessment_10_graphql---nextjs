# Submission item 3 — What I changed and why

The AI's version filtered items by the API category `title`, but the mock API returns lorem-ipsum titles that never match the food categories, so clicking any chip showed an empty list. I fixed this by mapping category ids to real labels and filtering by id. I also added a default "All" chip (the original started empty and could not be reset), stable keys instead of the array index, `aria-pressed` for accessibility, an empty-state message, and a Retry button when the query fails.
