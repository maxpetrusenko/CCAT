# CCAT5 extraction — 2026-07-27

This folder contains a direct extraction from the actual JPEG files found in
`/Users/maxpetrusenko/Desktop/CCAT5`. It does not use prior manifests, pointer
files, or sediment references.

## Status

- Filenames supplied in transcript: 37
- Source JPEGs found: 30
- Cropped and normalized question/reference images: 30
- Missing source JPEGs: 7
- Question/reference records: 37, including explicit placeholders for all 7
  missing files
- Transcript-supplied answer records: 3
- Unresolved transcript note: 1 (`Dad`, following a missing source)
- Visible UI selections recorded as unverified observations: 2

## Files

- `images/`: cropped JPEGs named by transcript order and source-image prefix
- `questions.json`: extracted question, prompt, reference, and option text
- `answers.json`: answers kept separate from questions

The JSON records preserve the order supplied in the transcript. Images that are
source material, scenario text, or generated output are identified by
`record_type` instead of being misrepresented as standalone questions.

## Extraction rules

- Actual source images only.
- No missing text or answers invented.
- Blur, edge clipping, and unreadable text are marked explicitly.
- A dark/selected UI option is only an `observed_selection`; it is not treated
  as a verified correct answer.
- The one sideways source was rotated upright.
- Crops remove unrelated browser chrome, laptop dock, and empty margins where
  doing so did not remove question content.

## Missing source files

1. `IMG_9FA7985C-F72D-4CBB-A609-918B665F849C.jpeg`
2. `IMG_1BD2298B-67B4-45E4-99D9-00A9D2D29A80.jpeg`
3. `IMG_783B72CF-EE20-4F56-948B-139E9A7E916A.jpeg`
4. `IMG_A85E9915-1954-4C24-9765-B106D938CAE3.jpeg`
5. `IMG_31448037-1123-4C4F-ADF2-8862BF1E4959.jpeg`
6. `IMG_E6744DBF-B76C-4927-AA13-F4C559CEEBBD.jpeg`
7. `IMG_6287E5F5-2E98-4BE1-9A47-5C9FBBF88F21.jpeg`

## Known source limitations

Several photographs cut off text at the left or right edge. One scenario image
is substantially out of focus. Those limitations originate in the supplied
JPEGs and are recorded per item in `questions.json`.
