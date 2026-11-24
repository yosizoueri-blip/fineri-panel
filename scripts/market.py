"""Fetch market quotes for the panel and write market.json.
Nikkei 225, KIOXIA (285A.T) and SpaceX (only if it has a listed ticker; otherwise marked pre-IPO).
Each entry: price, change vs ~1 hour ago, a small sparkline, and whether the market is open."""
import json, time, urllib.request, urllib.parse, datetime

UA = {"User-Agent": "Mozilla/5.0 (fineri-panel market fetcher)"}

def get(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=20) as r:
        return json.load(r)

def quote(sym):
    j = get("https://query1.finance.yahoo.com/v8/finance/chart/%s?interval=5m&range=1d" % urllib.parse.quote(sym))
    res = j["chart"]["result"][0]
    pts = [(t, c) for t, c in zip(res["timestamp"], res["indicators"]["quote"][0]["close"]) if c is not None]
    t_last, p_last = pts[-1]
    prev = pts[0]
    for t, c in pts:
        if t <= t_last - 3600:
            prev = (t, c)
    period = res.get("meta", {}).get("currentTradingPeriod", {}).get("regular", {})
    now = time.time()
    step = max(1, len(pts) // 32)
    return {
        "price": round(p_last, 2),
        "change_1h": round((p_last / prev[1] - 1) * 100, 3),
        "change_day": round((p_last / res["meta"].get("chartPreviousClose", pts[0][1]) - 1) * 100, 3),
        "age_min": round((now - t_last) / 60, 1),
        "market_open": bool(period) and period.get("start", 0) <= now <= period.get("end", 0),
        "spark": [round(c, 2) for _, c in pts[::step]][-32:],
    }

def spacex_symbol():
    j = get("https://query1.finance.yahoo.com/v1/finance/search?q=SpaceX&quotesCount=5&newsCount=0")
    for q in j.get("quotes", []):
        name = (q.get("longname") or q.get("shortname") or "").lower()
        if "space exploration" in name and q.get("quoteType") == "EQUITY":
            return q["symbol"]
    return None

out = {"updated": datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")}
for key, sym in [("nikkei", "^N225"), ("kioxia", "285A.T")]:
    try:
        out[key] = quote(sym)
    except Exception as e:  # keep the file valid even when one source fails
        out[key] = {"error": str(e)[:120]}
try:
    s = spacex_symbol()
    out["spacex"] = dict(quote(s), symbol=s) if s else {"status": "PRE-IPO"}
except Exception as e:
    out["spacex"] = {"status": "PRE-IPO", "error": str(e)[:120]}
json.dump(out, open("market.json", "w"), ensure_ascii=False, indent=1)
print(json.dumps(out, ensure_ascii=False)[:600])
