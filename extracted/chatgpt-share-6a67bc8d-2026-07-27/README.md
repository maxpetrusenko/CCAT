# ChatGPT Share Extraction - 2026-07-27

Source: https://chatgpt.com/share/6a67bc8d-55c0-83ea-9339-719efad6b860

This folder preserves what could be extracted from the public shared ChatGPT conversation:

- `questions-manifest.json`: uploaded-image metadata and `sediment://` pointers for each visible file attachment.
- `answers.json`: answer text visible in the rendered shared conversation, stored separately from question metadata.
- `rendered-text.txt`: compact rendered conversation text used for answer extraction.

## Current Limitation

The public share renders uploaded files as `Uploaded an image` placeholders and does not expose normal `<img src>` URLs. Direct backend download for the first extracted `file_id` returned `{"detail":"Unauthorized"}`. Because of that, `local_image` is intentionally `null` for now. Do not fabricate OCR text or answers for the unanswered image batch.

If Max opens the original logged-in chat or exports the images, copy the binaries into this folder and update `local_image` in `questions-manifest.json`.
