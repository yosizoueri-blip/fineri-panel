"""Fetch the Nikkei 225 and write market.json (price and change vs ~1 hour ago)."""
import json, time, urllib.request, datetime

URL = "https://query1.finance.yahoo.com/v8/finance/chart/%5EN225?interval=5m&range=1d"
req = urllib.request.Request(URL, headers={"User-Agent": "Mozilla/5.0 (fineri-panel market fetcher)"})
out = {"updated": datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")}
try:
    with urllib.request.urlopen(req, timeout=20) as r:
        j = json.load(r)
    res = j["chart"]["result"][0]
    ts = res["timestamp"]
    closes = res["indicators"]["quote"][0]["close"]
    pts = [(t, c) for t, c in zip(ts, closes) if c is not None]
    t_last, p_last = pts[-1]
    prev = pts[0]
    for t, c in pts:
        if t <= t_last - 3600:
            prev = (t, c)
    meta = res.get("meta", {})
    period = meta.get("currentTradingPeriod", {}).get("regular", {})
    now = time.time()
    out["nikkei"] = {
        "price": round(p_last, 2),
        "change_1h": round((p_last / prev[1] - 1) * 100, 3),
        "age_min": round((now - t_last) / 60, 1),
        "market_open": bool(period) and period.get("start", 0) <= now <= period.get("end", 0),
    }
except Exception as e:  # keep the file valid even when the source fails
    out["error"] = str(e)[:200]
json.dump(out, open("market.json", "w"), ensure_ascii=False, indent=1)
print(json.dumps(out, ensure_ascii=False))
