# Setup guide

About 30 minutes the first time. Use a laptop: the n8n editor is hard to use on a phone. n8n's menus change between versions, so if a label differs slightly, look for the nearest match.

## What you need

| Account | Used for | Cost to try |
|---|---|---|
| n8n Cloud (or self-hosted n8n 2.x) | Runs the workflows | 14-day free trial |
| Anthropic | Claude explains each search | Pay as you go (small amounts per search) |
| Gmail account | Weekly emails and alerts | Free |

## 1. Import the six workflows

1. In n8n, open **Overview** and click **Create workflow**.
2. In the empty editor, open the **⋯** menu (top right) > **Import from URL…**
3. Paste the raw link of the first file:
   `https://raw.githubusercontent.com/costasxeras-stack/zero-results-fixer/main/workflows/00-setup.json`
4. Click **Save**. You should see the workflow with its yellow note.
5. Repeat with `01-weekly-scan.json`, `02-review-form.json`, `03-rules-api.json`, `04-weekly-report.json` and `99-error-alerts.json`.

✅ Overview lists six workflows starting with **Zero Results Fixer ·**

## 2. Create the data tables

1. Open **Zero Results Fixer · 00 Setup (run once)**.
2. Click **Execute workflow**.
3. Every node turns green. Under **Overview > Data tables** you now see `zrf_settings`, `zrf_proposals` and `zrf_rules`.

## 3. Add the credentials

Open each node below, click **Credential to connect with > Create new credential**, fill it in, then **Save**.

**Claude** (workflow 01, node **Claude**)
On n8n Cloud the node can run on n8n's own AI credits: if the credential shows **Gateway credits**, there is nothing to do. Otherwise:
1. Go to console.anthropic.com > **API keys** > **Create key**. Copy it.
2. In n8n paste it into **API Key**.

**Email** (nodes **Email the owner**, **Email the report**, **Alert owner**)
These are Gmail nodes. Open **Email the owner**, click **Credential to connect with > Create new credential**, then **Sign in with Google** and allow access. Pick the same credential in the other two nodes.
On self-hosted n8n you first need a Google OAuth client (see "Google OAuth2 single service" in the n8n docs). Emails are sent from the Gmail account you sign in with, so `from_email` in settings is no longer used.

✅ No node shows a red warning triangle.

## 4. Publish the review form and copy its link

1. Open **02 Review form** and click **Publish** (top right).
2. Double-click the **Review form** node and copy the **Production URL**.

## 5. Fill in your settings

Open **Overview > Data tables > zrf_settings** and edit the one row:

| Column | What to put |
|---|---|
| `owner_email` | Where the weekly emails go |
| `from_email` | Your Gmail address |
| `review_form_url` | The Production URL from step 4 |
| `search_api_url` | Leave as is for the demo (Search Relevance Lab) |
| `query_source_url` | Leave as is for the demo |
| `max_queries_per_run` | 30. Lower it to spend less on Claude per run |

## 6. Turn on error alerts and publish

1. In workflows 01, 02, 03 and 04: **⋯ > Settings > Error workflow** > choose **Zero Results Fixer · 99 Error alerts** > **Save**.
2. Publish workflows 01, 03, 04 and 99.

## 7. First run

1. Open **01 Weekly scan** and click **Execute workflow**. It takes a few minutes. Search Relevance Lab may need up to a minute to wake up first.
2. Check your inbox: "Zero results this week: … fixes to approve".
3. Click one review link, approve it, and you should see "Approved".
4. Open the Production URL of **03 Rules API** in a browser. You should see your approved rule as JSON.
